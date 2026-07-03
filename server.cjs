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
var PORT = Number(process.env.PORT) || 3e3;
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
var ruleIdCounter = 10;
var tradeModeRules = [
  {
    id: 1,
    stationCodes: ["tangxia"],
    serviceCodes: ["us_air_express", "us_sea_truck"],
    isRequired: true,
    status: true,
    updateUser: "\u5929\u6717\uFF08\u4ED8\u8C6A\uFF09",
    createTime: "2026-06-10 09:15:30",
    updateTime: "2026-06-20 14:22:10"
  },
  {
    id: 2,
    stationCodes: ["tangxia"],
    serviceCodes: ["de_air", "uk_sea"],
    isRequired: true,
    status: true,
    updateUser: "\u5929\u6717\uFF08\u4ED8\u8C6A\uFF09",
    createTime: "2026-06-12 10:30:00",
    updateTime: "2026-06-18 16:45:22"
  },
  {
    id: 3,
    stationCodes: ["guangzhou"],
    serviceCodes: ["us_air_express", "us_sea_truck", "de_air"],
    isRequired: true,
    status: true,
    updateUser: "\u5F20\u8FD0\u8425",
    createTime: "2026-06-11 14:20:15",
    updateTime: "2026-06-21 09:10:05"
  },
  {
    id: 4,
    stationCodes: ["guangzhou"],
    serviceCodes: ["uk_sea", "japan_express"],
    isRequired: false,
    status: true,
    updateUser: "\u5F20\u8FD0\u8425",
    createTime: "2026-06-13 08:55:40",
    updateTime: "2026-06-13 08:55:40"
  },
  {
    id: 5,
    stationCodes: ["yiwu"],
    serviceCodes: ["yiwu_tiantu"],
    isRequired: true,
    status: true,
    updateUser: "\u674E\u5BA2\u670D",
    createTime: "2026-06-14 11:05:00",
    updateTime: "2026-06-19 13:30:18"
  },
  {
    id: 6,
    stationCodes: ["yiwu"],
    serviceCodes: ["us_sea_truck", "uk_sea"],
    isRequired: false,
    status: false,
    updateUser: "\u674E\u5BA2\u670D",
    createTime: "2026-06-15 16:40:22",
    updateTime: "2026-06-22 10:20:33"
  },
  {
    id: 7,
    stationCodes: ["tangxia", "guangzhou"],
    serviceCodes: ["us_air_express", "us_sea_truck", "de_air", "uk_sea"],
    isRequired: true,
    status: true,
    updateUser: "\u5929\u6717\uFF08\u4ED8\u8C6A\uFF09",
    createTime: "2026-06-16 09:25:10",
    updateTime: "2026-06-23 08:15:45"
  },
  {
    id: 8,
    stationCodes: ["tangxia", "guangzhou", "yiwu"],
    serviceCodes: ["japan_express"],
    isRequired: false,
    status: true,
    updateUser: "\u5F20\u8FD0\u8425",
    createTime: "2026-06-17 13:10:30",
    updateTime: "2026-06-17 13:10:30"
  },
  {
    id: 9,
    stationCodes: ["guangzhou", "yiwu"],
    serviceCodes: ["yiwu_tiantu", "de_air"],
    isRequired: true,
    status: false,
    updateUser: "\u674E\u5BA2\u670D",
    createTime: "2026-06-18 10:45:55",
    updateTime: "2026-06-20 17:00:12"
  }
];
function now() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
}
app.get("/api/trade-mode-rules", (req, res) => {
  const { stationCode, serviceCode, status } = req.query;
  let result = [...tradeModeRules];
  if (status !== void 0 && status !== "") {
    const statusBool = status === "1" || status === "true";
    result = result.filter((r) => r.status === statusBool);
  }
  if (stationCode) {
    result = result.filter(
      (r) => r.stationCodes.includes(stationCode)
    );
  }
  if (serviceCode) {
    result = result.filter(
      (r) => r.serviceCodes.includes(serviceCode)
    );
  }
  return res.json({ success: true, data: result });
});
app.post("/api/trade-mode-rules", (req, res) => {
  const { isRequired, status, stationCodes, serviceCodes, updateUser } = req.body;
  if (isRequired === void 0) {
    return res.status(400).json({ success: false, message: "\u8BF7\u9009\u62E9\u8D38\u6613\u65B9\u5F0F\u662F\u5426\u5FC5\u586B" });
  }
  if (!stationCodes || stationCodes.length === 0) {
    return res.status(400).json({ success: false, message: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u9001\u8D27\u8D27\u7AD9" });
  }
  if (!serviceCodes || serviceCodes.length === 0) {
    return res.status(400).json({ success: false, message: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u670D\u52A1\u7C7B\u578B" });
  }
  if (status !== false) {
    const conflict = tradeModeRules.find((r) => {
      if (!r.status) return false;
      const stationOverlap = r.stationCodes.some((sc) => (stationCodes || []).includes(sc));
      const serviceOverlap = r.serviceCodes.some((sc) => (serviceCodes || []).includes(sc));
      return stationOverlap && serviceOverlap;
    });
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `\u8BE5\u8D27\u7AD9\u4E0E\u670D\u52A1\u7EC4\u5408\u5DF2\u88AB\u5DF2\u6709\u89C4\u5219\u5360\u7528`
      });
    }
  }
  const timestamp = now();
  const newRule = {
    id: ruleIdCounter++,
    isRequired: !!isRequired,
    status: status !== false,
    stationCodes: stationCodes || [],
    serviceCodes: serviceCodes || [],
    updateUser: updateUser || "\u5929\u6717\uFF08\u4ED8\u8C6A\uFF09",
    createTime: timestamp,
    updateTime: timestamp
  };
  tradeModeRules.push(newRule);
  return res.json({ success: true, data: newRule });
});
app.put("/api/trade-mode-rules/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const rule = tradeModeRules.find((r) => r.id === id);
  if (!rule) {
    return res.status(404).json({ success: false, message: "\u89C4\u5219\u672A\u627E\u5230" });
  }
  const { isRequired, status, stationCodes, serviceCodes, updateUser } = req.body;
  const resolvedStationCodes = stationCodes !== void 0 ? stationCodes : rule.stationCodes;
  const resolvedServiceCodes = serviceCodes !== void 0 ? serviceCodes : rule.serviceCodes;
  if (resolvedStationCodes.length === 0) {
    return res.status(400).json({ success: false, message: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u9001\u8D27\u8D27\u7AD9" });
  }
  if (resolvedServiceCodes.length === 0) {
    return res.status(400).json({ success: false, message: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u670D\u52A1\u7C7B\u578B" });
  }
  const resolvedStatus = status !== void 0 ? status !== false : rule.status;
  if (resolvedStatus) {
    const conflict = tradeModeRules.find((r) => {
      if (r.id === id) return false;
      if (!r.status) return false;
      const stationOverlap = r.stationCodes.some((sc) => resolvedStationCodes.includes(sc));
      const serviceOverlap = r.serviceCodes.some((sc) => resolvedServiceCodes.includes(sc));
      return stationOverlap && serviceOverlap;
    });
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `\u8BE5\u8D27\u7AD9\u4E0E\u670D\u52A1\u7EC4\u5408\u5DF2\u88AB\u5DF2\u6709\u89C4\u5219\u5360\u7528`
      });
    }
  }
  rule.stationCodes = resolvedStationCodes;
  rule.serviceCodes = resolvedServiceCodes;
  if (isRequired !== void 0) rule.isRequired = !!isRequired;
  rule.status = resolvedStatus;
  if (updateUser !== void 0) rule.updateUser = updateUser;
  rule.updateTime = now();
  return res.json({ success: true, data: rule });
});
app.delete("/api/trade-mode-rules/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tradeModeRules.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "\u89C4\u5219\u672A\u627E\u5230" });
  }
  tradeModeRules.splice(index, 1);
  return res.json({ success: true, message: "\u89C4\u5219\u5DF2\u5220\u9664" });
});
app.delete("/api/trade-mode-rules", (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "\u8BF7\u63D0\u4F9B\u8981\u5220\u9664\u7684\u89C4\u5219ID\u5217\u8868" });
  }
  for (const id of ids) {
    const index = tradeModeRules.findIndex((r) => r.id === id);
    if (index !== -1) tradeModeRules.splice(index, 1);
  }
  return res.json({ success: true, message: `\u5DF2\u6279\u91CF\u5220\u9664 ${ids.length} \u6761\u89C4\u5219` });
});
app.post("/api/check-trade-mode", (req, res) => {
  const { stationCode, serviceCode } = req.body;
  if (!stationCode || !serviceCode) {
    return res.status(400).json({ success: false, message: "stationCode \u548C serviceCode \u4E0D\u80FD\u4E3A\u7A7A" });
  }
  const matchedRule = [...tradeModeRules].reverse().find((r) => {
    if (!r.status) return false;
    const stationMatch = r.stationCodes.includes(stationCode);
    const serviceMatch = r.serviceCodes.includes(serviceCode);
    return stationMatch && serviceMatch;
  });
  return res.json({
    success: true,
    data: {
      isRequired: matchedRule ? matchedRule.isRequired : false
    }
  });
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
    app.use("/tiantu-----", import_express.default.static(distPath));
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
