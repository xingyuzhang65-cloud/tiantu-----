import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit to support base64 scanned invoice files/images
app.use(express.json({ limit: "15mb" }));

// Initialize GoogleGenAI Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint to parse invoices
app.post("/api/parse-invoice", async (req: express.Request, res: express.Response): Promise<any> => {
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

    let contents: any[] = [];

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
      You are an expert logistics invoicing parser for "Tiantu Logistics Management" (天图通逊物流管理系统).
      Read and analyze the following invoice, packing list, or receipt detail (image, text, or PDF payload) and extract the waybill fields cleanly.
      
      Ensure you extract:
      1. customerName: Identify the potential customer/shipper, choosing from or matching closely to:
         - '深圳天图电子有限公司 (VIP)'
         - '付豪跨境电商事业群'
         - '常晟供应链集团'
         - '上海豪迅美中快递中心'
         - '英国海航直运有限公司'
         If not matching, provide the closest name or what is found on the invoice.
      2. country: Identify destination country. Usually, look for 'USA', 'United Kingdom', 'UK', 'Germany', 'Japan', 'Canada'. Map strictly to: '美国', '英国', '德国', '加拿大', '日本'.
      3. station: Identify delivery hub. Match closest to: '深圳天图货站', '上海分拨货站', '东莞塘厦分中心', '义乌中转营地' (Defaults to '深圳天图货站').
      4. packagesCount: Calculate the total package boxes or cartons count. Defaults to 1 if not readable.
      5. carrier: Identify carrier, service or shipping route. Map closely to: '海德运通', '美森尊卡限时达', '常润空快3日卡', '卡派高派拼箱', '深圳天图海派专线' (Defaults to '海德运通').
      6. fbaCode: Extract FBA code or shipment ID (e.g., FBA19G6M4C7B or warehouse codes like ONT8, FTW1, IND9, GYR3, etc.).
      7. remarks: Detailed items description, quantities, weight, MSDS details, battery flags, etc.
      8. description: A short, elegant, unified overall goods description phrase such as '多箱普货车载设备', '塑胶配件与日化类普货', etc.
    `;

    if (text) {
      contents.push({ text: `Invoice Text/Information:\n${text}` });
    }
    contents.push({ text: docPrompt });

    // API call using the official SDK setup
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: contents },
      config: {
        systemInstruction: "You are a professional invoice data extractor. Always return output in absolute compliance with the requested JSON schema. Do not include markdown wraps or leading backticks, directly output JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customerName: {
              type: Type.STRING,
              description: "Shipper or customer name. Try to match the provided list."
            },
            country: {
              type: Type.STRING,
              description: "Destination country mapped strictly to United States/UK/Germany/Canada/Japan in Chinese."
            },
            station: {
              type: Type.STRING,
              description: "Closest matching domestic logistics hub."
            },
            packagesCount: {
              type: Type.INTEGER,
              description: "Total physical packages count."
            },
            carrier: {
              type: Type.STRING,
              description: "Recommended logistics route / service carrier name."
            },
            fbaCode: {
              type: Type.STRING,
              description: "Extracted FBA reference code or warehouse destination designation."
            },
            remarks: {
              type: Type.STRING,
              description: "Extracted special instructions, cargo specifics, or MSDS numbers."
            },
            description: {
              type: Type.STRING,
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

  } catch (error: any) {
    console.error("Error during invoice parsing:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process invoice parse due to internal system failure"
    });
  }
});

// Configure Vite middleware or Static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
