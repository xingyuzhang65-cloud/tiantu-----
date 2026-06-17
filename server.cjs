var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "15mb" }));
var apiKey = process.env.GEMINI_API_KEY;
var ai = new import_genai.GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
app.post("/api/parse-invoice", async (req, res) => {
  try {
    const { text, fileBase64, mimeType } = req.body;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "Gemini API key is missing. Please add GEMINI_API_KEY to your env/secrets configuration."
      });
    }
    if (!text && !fileBase64) {
      return res.status(400).json({
        success: false,
        message: "No content provided to parse. Please provide paste text or upload an invoice document."
      });
    }
    let contents = [];
    if (fileBase64) {
      const standardMime = mimeType || "image/png";
      const cleanedBase64 = fileBase64.replace(/^data:.*;base64,/, "");
      contents.push({
        inlineData: {
          mimeType: standardMime,
          data: cleanedBase64
        }
      });
    }
    const docPrompt = `
      You are an expert logistics invoicing parser for "Tiantu Logistics Management" (\u5929\u56FE\u901A\u900A\u7269\u6D41\u7BA1\u7406\u7CFB\u7EDF).
      Read and analyze the following invoice, packing list, or receipt detail (image, text, or PDF payload) and extract the waybill fields cleanly.
      
      Ensure you extract:
      1. customerName: Identify the potential customer/shipper, choosing from or matching closely to:
         - '\u6DF1\u5733\u5929\u56FE\u7535\u5B50\u6709\u9650\u516C\u53F8 (VIP)'
         - '\u4ED8\u8C6A\u8DE8\u5883\u7535\u5546\u4E8B\u4E1A\u7FA4'
         - '\u5E38\u665F\u4F9B\u5E94\u94FE\u96C6\u56E2'
         - '\u4E0A\u6D77\u8C6A\u8FC5\u7F8E\u4E2D\u5FEB\u9012\u4E2D\u5FC3'
         - '\u82F1\u56FD\u6D77\u822A\u76F4\u8FD0\u6709\u9650\u516C\u53F8'
         If not matching, provide the closest name or what is found on the invoice.
      2. country: Identify destination country. Usually, look for 'USA', 'United Kingdom', 'UK', 'Germany', 'Japan', 'Canada'. Map strictly to: '\u7F8E\u56FD', '\u82F1\u56FD', '\u5FB7\u56FD', '\u52A0\u62FF\u5927', '\u65E5\u672C'.
      3. station: Identify delivery hub. Match closest to: '\u6DF1\u5733\u5929\u56FE\u8D27\u7AD9', '\u4E0A\u6D77\u5206\u62E8\u8D27\u7AD9', '\u4E1C\u839E\u5858\u53A6\u5206\u4E2D\u5FC3', '\u4E49\u4E4C\u4E2D\u8F6C\u8425\u5730' (Defaults to '\u6DF1\u5733\u5929\u56FE\u8D27\u7AD9').
      4. packagesCount: Calculate the total package boxes or cartons count. Defaults to 1 if not readable.
      5. carrier: Identify carrier, service or shipping route. Map closely to: '\u6D77\u5FB7\u8FD0\u901A', '\u7F8E\u68EE\u5C0A\u5361\u9650\u65F6\u8FBE', '\u5E38\u6DA6\u7A7A\u5FEB3\u65E5\u5361', '\u5361\u6D3E\u9AD8\u6D3E\u62FC\u7BB1', '\u6DF1\u5733\u5929\u56FE\u6D77\u6D3E\u4E13\u7EBF' (Defaults to '\u6D77\u5FB7\u8FD0\u901A').
      6. fbaCode: Extract FBA code or shipment ID (e.g., FBA19G6M4C7B or warehouse codes like ONT8, FTW1, IND9, GYR3, etc.).
      7. remarks: Detailed items description, quantities, weight, MSDS details, battery flags, etc.
      8. description: A short, elegant, unified overall goods description phrase such as '\u591A\u7BB1\u666E\u8D27\u8F66\u8F7D\u8BBE\u5907', '\u5851\u80F6\u914D\u4EF6\u4E0E\u65E5\u5316\u7C7B\u666E\u8D27', etc.
    `;
    if (text) {
      contents.push({ text: `Invoice Text/Information:
${text}` });
    }
    contents.push({ text: docPrompt });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: contents },
      config: {
        systemInstruction: "You are a professional invoice data extractor. Always return output in absolute compliance with the requested JSON schema. Do not include markdown wraps or leading backticks, directly output JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            customerName: {
              type: import_genai.Type.STRING,
              description: "Shipper or customer name. Try to match the provided list."
            },
            country: {
              type: import_genai.Type.STRING,
              description: "Destination country mapped strictly to United States/UK/Germany/Canada/Japan in Chinese."
            },
            station: {
              type: import_genai.Type.STRING,
              description: "Closest matching domestic logistics hub."
            },
            packagesCount: {
              type: import_genai.Type.INTEGER,
              description: "Total physical packages count."
            },
            carrier: {
              type: import_genai.Type.STRING,
              description: "Recommended logistics route / service carrier name."
            },
            fbaCode: {
              type: import_genai.Type.STRING,
              description: "Extracted FBA reference code or warehouse destination designation."
            },
            remarks: {
              type: import_genai.Type.STRING,
              description: "Extracted special instructions, cargo specifics, or MSDS numbers."
            },
            description: {
              type: import_genai.Type.STRING,
              description: "A short, elegant summary description of the invoice cargo contents."
            }
          },
          required: ["customerName", "country", "packagesCount", "carrier"]
        }
      }
    });
    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response or empty text generated by Gemini model.");
    }
    const parsedResult = JSON.parse(resultText.trim());
    return res.json({
      success: true,
      data: parsedResult
    });
  } catch (error) {
    console.error("Error during invoice parsing:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process invoice parse due to internal system failure"
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
