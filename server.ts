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

// ─── In-Memory Storage for Trade Mode Rules ──────────────────────────────────
interface TradeModeRule {
  id: number;
  stationCodes: string[];
  serviceCodes: string[];
  isRequired: boolean;
  status: boolean;
  updateUser: string;
  createTime: string;
  updateTime: string;
}

let ruleIdCounter = 10;
const tradeModeRules: TradeModeRule[] = [
  {
    id: 1,
    stationCodes: ['tangxia'],
    serviceCodes: ['us_air_express', 'us_sea_truck'],
    isRequired: true,
    status: true,
    updateUser: '天朗（付豪）',
    createTime: '2026-06-10 09:15:30',
    updateTime: '2026-06-20 14:22:10',
  },
  {
    id: 2,
    stationCodes: ['tangxia'],
    serviceCodes: ['de_air', 'uk_sea'],
    isRequired: true,
    status: true,
    updateUser: '天朗（付豪）',
    createTime: '2026-06-12 10:30:00',
    updateTime: '2026-06-18 16:45:22',
  },
  {
    id: 3,
    stationCodes: ['guangzhou'],
    serviceCodes: ['us_air_express', 'us_sea_truck', 'de_air'],
    isRequired: true,
    status: true,
    updateUser: '张运营',
    createTime: '2026-06-11 14:20:15',
    updateTime: '2026-06-21 09:10:05',
  },
  {
    id: 4,
    stationCodes: ['guangzhou'],
    serviceCodes: ['uk_sea', 'japan_express'],
    isRequired: false,
    status: true,
    updateUser: '张运营',
    createTime: '2026-06-13 08:55:40',
    updateTime: '2026-06-13 08:55:40',
  },
  {
    id: 5,
    stationCodes: ['yiwu'],
    serviceCodes: ['yiwu_tiantu'],
    isRequired: true,
    status: true,
    updateUser: '李客服',
    createTime: '2026-06-14 11:05:00',
    updateTime: '2026-06-19 13:30:18',
  },
  {
    id: 6,
    stationCodes: ['yiwu'],
    serviceCodes: ['us_sea_truck', 'uk_sea'],
    isRequired: false,
    status: false,
    updateUser: '李客服',
    createTime: '2026-06-15 16:40:22',
    updateTime: '2026-06-22 10:20:33',
  },
  {
    id: 7,
    stationCodes: ['tangxia', 'guangzhou'],
    serviceCodes: ['us_air_express', 'us_sea_truck', 'de_air', 'uk_sea'],
    isRequired: true,
    status: true,
    updateUser: '天朗（付豪）',
    createTime: '2026-06-16 09:25:10',
    updateTime: '2026-06-23 08:15:45',
  },
  {
    id: 8,
    stationCodes: ['tangxia', 'guangzhou', 'yiwu'],
    serviceCodes: ['japan_express'],
    isRequired: false,
    status: true,
    updateUser: '张运营',
    createTime: '2026-06-17 13:10:30',
    updateTime: '2026-06-17 13:10:30',
  },
  {
    id: 9,
    stationCodes: ['guangzhou', 'yiwu'],
    serviceCodes: ['yiwu_tiantu', 'de_air'],
    isRequired: true,
    status: false,
    updateUser: '李客服',
    createTime: '2026-06-18 10:45:55',
    updateTime: '2026-06-20 17:00:12',
  },
];

function now(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

// Get all rules (with optional filters)
app.get("/api/trade-mode-rules", (req: express.Request, res: express.Response) => {
  const { stationCode, serviceCode, status } = req.query;
  let result = [...tradeModeRules];

  if (status !== undefined && status !== "") {
    const statusBool = status === "1" || status === "true";
    result = result.filter(r => r.status === statusBool);
  }
  if (stationCode) {
    result = result.filter(r =>
      r.stationCodes.includes(stationCode as string)
    );
  }
  if (serviceCode) {
    result = result.filter(r =>
      r.serviceCodes.includes(serviceCode as string)
    );
  }

  return res.json({ success: true, data: result });
});

// Create a new rule
app.post("/api/trade-mode-rules", (req: express.Request, res: express.Response): any => {
  const { isRequired, status, stationCodes, serviceCodes, updateUser } = req.body;

  if (isRequired === undefined) {
    return res.status(400).json({ success: false, message: "请选择贸易方式是否必填" });
  }
  if (!stationCodes || stationCodes.length === 0) {
    return res.status(400).json({ success: false, message: "请至少选择一个送货货站" });
  }
  if (!serviceCodes || serviceCodes.length === 0) {
    return res.status(400).json({ success: false, message: "请至少选择一个服务类型" });
  }

  // Anti-duplicate: check for existing enabled rule with overlapping [station + service] combo
  if (status !== false) {
    const conflict = tradeModeRules.find(r => {
      if (!r.status) return false; // skip disabled
      // Check station overlap
      const stationOverlap = r.stationCodes.some((sc: string) => (stationCodes || []).includes(sc));
      // Check service overlap
      const serviceOverlap = r.serviceCodes.some((sc: string) => (serviceCodes || []).includes(sc));
      return stationOverlap && serviceOverlap;
    });
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `该货站与服务组合已被已有规则占用`
      });
    }
  }

  const timestamp = now();
  const newRule: TradeModeRule = {
    id: ruleIdCounter++,
    isRequired: !!isRequired,
    status: status !== false,
    stationCodes: stationCodes || [],
    serviceCodes: serviceCodes || [],
    updateUser: updateUser || '天朗（付豪）',
    createTime: timestamp,
    updateTime: timestamp,
  };

  tradeModeRules.push(newRule);
  return res.json({ success: true, data: newRule });
});

// Update an existing rule
app.put("/api/trade-mode-rules/:id", (req: express.Request, res: express.Response): any => {
  const id = parseInt(req.params.id);
  const rule = tradeModeRules.find(r => r.id === id);
  if (!rule) {
    return res.status(404).json({ success: false, message: "规则未找到" });
  }

  const { isRequired, status, stationCodes, serviceCodes, updateUser } = req.body;

  const resolvedStationCodes = stationCodes !== undefined ? stationCodes : rule.stationCodes;
  const resolvedServiceCodes = serviceCodes !== undefined ? serviceCodes : rule.serviceCodes;

  if (resolvedStationCodes.length === 0) {
    return res.status(400).json({ success: false, message: "请至少选择一个送货货站" });
  }
  if (resolvedServiceCodes.length === 0) {
    return res.status(400).json({ success: false, message: "请至少选择一个服务类型" });
  }

  const resolvedStatus = status !== undefined ? (status !== false) : rule.status;

  // Anti-duplicate check (exclude self)
  if (resolvedStatus) {
    const conflict = tradeModeRules.find(r => {
      if (r.id === id) return false;
      if (!r.status) return false;
      const stationOverlap = r.stationCodes.some((sc: string) => resolvedStationCodes.includes(sc));
      const serviceOverlap = r.serviceCodes.some((sc: string) => resolvedServiceCodes.includes(sc));
      return stationOverlap && serviceOverlap;
    });
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `该货站与服务组合已被已有规则占用`
      });
    }
  }

  rule.stationCodes = resolvedStationCodes;
  rule.serviceCodes = resolvedServiceCodes;
  if (isRequired !== undefined) rule.isRequired = !!isRequired;
  rule.status = resolvedStatus;
  if (updateUser !== undefined) rule.updateUser = updateUser;
  rule.updateTime = now();

  return res.json({ success: true, data: rule });
});

// Delete a single rule
app.delete("/api/trade-mode-rules/:id", (req: express.Request, res: express.Response): any => {
  const id = parseInt(req.params.id);
  const index = tradeModeRules.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "规则未找到" });
  }
  tradeModeRules.splice(index, 1);
  return res.json({ success: true, message: "规则已删除" });
});

// Batch delete rules
app.delete("/api/trade-mode-rules", (req: express.Request, res: express.Response): any => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "请提供要删除的规则ID列表" });
  }
  for (const id of ids) {
    const index = tradeModeRules.findIndex(r => r.id === id);
    if (index !== -1) tradeModeRules.splice(index, 1);
  }
  return res.json({ success: true, message: `已批量删除 ${ids.length} 条规则` });
});

// Dynamic check: whether trade mode is required for a given station + service combo
app.post("/api/check-trade-mode", (req: express.Request, res: express.Response) => {
  const { stationCode, serviceCode } = req.body;

  if (!stationCode || !serviceCode) {
    return res.status(400).json({ success: false, message: "stationCode 和 serviceCode 不能为空" });
  }

  // Find the most recent matching enabled rule
  const matchedRule = [...tradeModeRules]
    .reverse() // newest first
    .find(r => {
      if (!r.status) return false;
      const stationMatch = r.stationCodes.includes(stationCode);
      const serviceMatch = r.serviceCodes.includes(serviceCode);
      return stationMatch && serviceMatch;
    });

  return res.json({
    success: true,
    data: {
      isRequired: matchedRule ? matchedRule.isRequired : false,
    }
  });
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
