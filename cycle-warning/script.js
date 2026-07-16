const rows = [
  // ── TTTX ──
  { customer: "TTTX", salesperson: "天晟", orderType: "普单", status: "预报", createdAt: "2026-06-14 23:07:40", bookingNo: "REQ260610-0002-MW-TTTX", pickup: "火车站", warehouse: "洛杉矶仓", dock: "", rail: "", quantity: 8, transit: "", type: "40HQ", containerNo: "CCLU7400926", systemNo: "CCLU7400926-260623", totalBoxes: 8, volume: 608, weight: 22000 },
  { customer: "TTTX", salesperson: "Tina", orderType: "普单", status: "接受", createdAt: "2026-06-14 22:43:03", bookingNo: "REQ260610-0001-MW-TTTX", pickup: "火车站", warehouse: "芝加哥仓", dock: "", rail: "", quantity: 16, transit: "", type: "40HQ", containerNo: "TCNU5379926", systemNo: "TCNU5379926-260623", totalBoxes: 16, volume: 1216, weight: 44000 },
  { customer: "TTTX", salesperson: "天晟", orderType: "普单", status: "接受", createdAt: "2026-06-11 19:44:02", bookingNo: "REQ260608-0011-MW-TTTX", pickup: "火车站", warehouse: "萨凡纳仓", dock: "", rail: "", quantity: 20, transit: "", type: "40HQ", containerNo: "MSNU9066272", systemNo: "MSNU9066272-260615", totalBoxes: 20, volume: 1520, weight: 56000 },
  { customer: "TTTX", salesperson: "Cathy", orderType: "普单", status: "运输中", createdAt: "2026-06-11 17:12:45", bookingNo: "REQ260608-0007-MW-TTTX", pickup: "码头", warehouse: "洛杉矶仓", dock: "长滩", rail: "", quantity: 15, transit: "", type: "40HQ", containerNo: "DFSU7790127", systemNo: "DFSU7790127-260623", totalBoxes: 15, volume: 1140, weight: 42000 },
  { customer: "TTTX", salesperson: "天晟", orderType: "普单", status: "预约池", createdAt: "2026-06-11 15:33:19", bookingNo: "REQ260608-0006-MW-TTTX", pickup: "火车站", warehouse: "芝加哥仓", dock: "", rail: "芝加哥站", quantity: 16, transit: "", type: "40HQ", containerNo: "OOCU5524700", systemNo: "OOCU5524700-260623", totalBoxes: 16, volume: 1216, weight: 44800 },
  { customer: "TTTX", salesperson: "Cathy", orderType: "普单", status: "提柜", createdAt: "2026-06-10 20:17:50", bookingNo: "REQ260608-0005-MW-TTTX", pickup: "码头", warehouse: "新泽西仓", dock: "纽瓦克", rail: "", quantity: 12, transit: "", type: "40HQ", containerNo: "CSNU8682381", systemNo: "CSNU8682381-260623", totalBoxes: 12, volume: 912, weight: 33600 },
  { customer: "TTTX", salesperson: "天晟", orderType: "普单", status: "入库处理中", createdAt: "2026-06-10 18:49:36", bookingNo: "REQ260608-0004-MW-TTTX", pickup: "火车站", warehouse: "萨凡纳仓", dock: "", rail: "萨凡纳站", quantity: 8, transit: "", type: "40HQ", containerNo: "OOCU5418870", systemNo: "OOCU5418870-260623", totalBoxes: 8, volume: 608, weight: 22400 },
  { customer: "TTTX", salesperson: "天晟", orderType: "普单", status: "预报", createdAt: "2026-06-10 16:25:11", bookingNo: "REQ260608-0003-MW-TTTX", pickup: "火车站", warehouse: "洛杉矶仓", dock: "", rail: "", quantity: 18, transit: "", type: "40HQ", containerNo: "OOCU6137033", systemNo: "OOCU6137033-260623", totalBoxes: 18, volume: 1368, weight: 50400 },
  { customer: "TTTX", salesperson: "Cathy", orderType: "普单", status: "接受", createdAt: "2026-06-10 13:08:57", bookingNo: "REQ260608-0002-MW-TTTX", pickup: "火车站", warehouse: "新泽西仓", dock: "", rail: "", quantity: 19, transit: "费城中转", type: "40HQ", containerNo: "FFAU2850840", systemNo: "FFAU2850840-260626", totalBoxes: 19, volume: 1444, weight: 53200 },
  { customer: "TTTX", salesperson: "天晟", orderType: "普单", status: "运输中", createdAt: "2026-06-09 22:54:28", bookingNo: "REQ260608-0001-MW-TTTX", pickup: "火车站", warehouse: "萨凡纳仓", dock: "", rail: "", quantity: 12, transit: "", type: "40HQ", containerNo: "CSGU7187527", systemNo: "CSGU7187527-260623", totalBoxes: 12, volume: 912, weight: 33600 },
  { customer: "TTTX", salesperson: "天晟", orderType: "普单", status: "预报", createdAt: "2026-06-14 14:22:10", bookingNo: "REQ260610-0003-MW-TTTX", pickup: "码头", warehouse: "休斯顿仓", dock: "休斯顿", rail: "", quantity: 14, transit: "", type: "40HQ", containerNo: "TGBU5012347", systemNo: "TGBU5012347-260623", totalBoxes: 14, volume: 1064, weight: 39200 },
  { customer: "TTTX", salesperson: "天晟", orderType: "加急单", status: "预报", createdAt: "2026-06-15 09:18:32", bookingNo: "REQ260612-0001-UR-TTTX", pickup: "火车站", warehouse: "奥克兰仓", dock: "", rail: "", quantity: 10, transit: "", type: "45HQ", containerNo: "MSCU8234711", systemNo: "MSCU8234711-260630", totalBoxes: 10, volume: 860, weight: 29000 },
  { customer: "TTTX", salesperson: "Tina", orderType: "普单", status: "运输中", createdAt: "2026-06-09 14:05:19", bookingNo: "REQ260606-0012-MW-TTTX", pickup: "码头", warehouse: "芝加哥仓", dock: "芝加哥", rail: "", quantity: 13, transit: "", type: "40GP", containerNo: "TCNU9238467", systemNo: "TCNU9238467-260620", totalBoxes: 13, volume: 871, weight: 33800 },
  // ── SLGYL ──
  { customer: "SLGYL", salesperson: "jessie", orderType: "普单", status: "运输中", createdAt: "2026-06-13 01:46:51", bookingNo: "REQ260610-0001-MW-SLGYL", pickup: "火车站", warehouse: "新泽西仓", dock: "", rail: "", quantity: 12, transit: "", type: "45HQ", containerNo: "GOSU1053503", systemNo: "GOSU1053503-260623", totalBoxes: 12, volume: 1032, weight: 33600 },
  { customer: "SLGYL", salesperson: "Cathy", orderType: "普单", status: "入库处理中", createdAt: "2026-06-08 17:42:13", bookingNo: "REQ260606-0004-MW-SLGYL", pickup: "火车站", warehouse: "萨凡纳仓", dock: "", rail: "", quantity: 10, transit: "", type: "40GP", containerNo: "TCLU1297334", systemNo: "TCLU1297334-260615", totalBoxes: 10, volume: 670, weight: 26000 },
  { customer: "SLGYL", salesperson: "天晟", orderType: "普单", status: "预报", createdAt: "2026-06-08 15:05:26", bookingNo: "REQ260606-0003-MW-SLGYL", pickup: "火车站", warehouse: "洛杉矶仓", dock: "", rail: "", quantity: 11, transit: "", type: "40GP", containerNo: "CXRU1004834", systemNo: "CXRU1004834-260615", totalBoxes: 11, volume: 737, weight: 28600 },
  { customer: "SLGYL", salesperson: "jessie", orderType: "普单", status: "接受", createdAt: "2026-06-14 16:22:37", bookingNo: "REQ260611-0003-MW-SLGYL", pickup: "码头", warehouse: "休斯顿仓", dock: "休斯顿", rail: "", quantity: 7, transit: "", type: "40HQ", containerNo: "MSCU7654398", systemNo: "MSCU7654398-260625", totalBoxes: 7, volume: 532, weight: 19600 },
  { customer: "SLGYL", salesperson: "Cathy", orderType: "普单", status: "提柜", createdAt: "2026-06-10 09:33:50", bookingNo: "REQ260607-0005-MW-SLGYL", pickup: "火车站", warehouse: "芝加哥仓", dock: "", rail: "芝加哥站", quantity: 9, transit: "", type: "40HQ", containerNo: "HLCU1948235", systemNo: "HLCU1948235-260618", totalBoxes: 9, volume: 684, weight: 25200 },
  { customer: "SLGYL", salesperson: "jessie", orderType: "加急单", status: "预约池", createdAt: "2026-06-12 21:11:04", bookingNo: "REQ260609-0004-UR-SLGYL", pickup: "码头", warehouse: "奥克兰仓", dock: "奥克兰", rail: "", quantity: 5, transit: "", type: "40RH", containerNo: "ONEU3498712", systemNo: "ONEU3498712-260622", totalBoxes: 5, volume: 340, weight: 14000 },
  // ── YQP ──
  { customer: "YQP", salesperson: "天晟", orderType: "普单", status: "预约池", createdAt: "2026-06-12 18:35:22", bookingNo: "REQ260610-0001-MW-YQP", pickup: "火车站", warehouse: "萨凡纳仓", dock: "", rail: "", quantity: 11, transit: "", type: "40RH", containerNo: "SEKU9431682", systemNo: "SEKU9431682-260618", totalBoxes: 11, volume: 836, weight: 30800 },
  { customer: "YQP", salesperson: "Tina", orderType: "普单", status: "运输中", createdAt: "2026-06-13 08:44:17", bookingNo: "REQ260611-0001-MW-YQP", pickup: "火车站", warehouse: "芝加哥仓", dock: "", rail: "", quantity: 8, transit: "", type: "40HQ", containerNo: "CSLU7823456", systemNo: "CSLU7823456-260625", totalBoxes: 8, volume: 608, weight: 22400 },
  { customer: "YQP", salesperson: "天晟", orderType: "加急单", status: "预报", createdAt: "2026-06-14 10:20:55", bookingNo: "REQ260612-0002-UR-YQP", pickup: "码头", warehouse: "洛杉矶仓", dock: "长滩", rail: "", quantity: 6, transit: "", type: "45HQ", containerNo: "FFAU6521890", systemNo: "FFAU6521890-260628", totalBoxes: 6, volume: 516, weight: 17400 },
  // ── JJGJ ──
  { customer: "JJGJ", salesperson: "jessie", orderType: "普单", status: "提柜", createdAt: "2026-06-12 16:20:08", bookingNo: "REQ260609-0001-MW-JJGJ", pickup: "火车站", warehouse: "芝加哥仓", dock: "", rail: "", quantity: 3, transit: "", type: "40HQ", containerNo: "CAAU8732748", systemNo: "CAAU8732748-260710", totalBoxes: 3, volume: 228, weight: 8400 },
  { customer: "JJGJ", salesperson: "jessie", orderType: "普单", status: "运输中", createdAt: "2026-06-11 10:58:41", bookingNo: "REQ260608-0009-MW-JJGJ", pickup: "码头", warehouse: "萨凡纳仓", dock: "萨凡纳", rail: "", quantity: 5, transit: "", type: "40GP", containerNo: "CXRU4578231", systemNo: "CXRU4578231-260620", totalBoxes: 5, volume: 335, weight: 13000 },
  // ── RX ──
  { customer: "RX", salesperson: "Cathy", orderType: "普单", status: "入库处理中", createdAt: "2026-06-12 14:58:31", bookingNo: "REQ260609-0001-MW-RX", pickup: "火车站", warehouse: "洛杉矶仓", dock: "", rail: "", quantity: 12, transit: "", type: "40HQ", containerNo: "SMCU7009844", systemNo: "SMCU7009844-260615", totalBoxes: 12, volume: 912, weight: 33600 },
  { customer: "RX", salesperson: "jessie", orderType: "普单", status: "预报", createdAt: "2026-06-11 21:06:17", bookingNo: "REQ260608-0001-MW-RX", pickup: "火车站", warehouse: "新泽西仓", dock: "", rail: "", quantity: 10, transit: "", type: "40HQ", containerNo: "ONEU6740504", systemNo: "ONEU6740504-260615", totalBoxes: 10, volume: 760, weight: 28000 },
  { customer: "RX", salesperson: "Cathy", orderType: "普单", status: "运输中", createdAt: "2026-06-12 09:10:33", bookingNo: "REQ260609-0002-MW-RX", pickup: "火车站", warehouse: "奥克兰仓", dock: "", rail: "", quantity: 9, transit: "", type: "40HQ", containerNo: "BMOU4123895", systemNo: "BMOU4123895-260615", totalBoxes: 9, volume: 684, weight: 25200 },
  { customer: "RX", salesperson: "Cathy", orderType: "普单", status: "接受", createdAt: "2026-06-14 19:36:12", bookingNo: "REQ260612-0004-MW-RX", pickup: "码头", warehouse: "休斯顿仓", dock: "休斯顿", rail: "", quantity: 11, transit: "", type: "40HQ", containerNo: "DFSU9982134", systemNo: "DFSU9982134-260628", totalBoxes: 11, volume: 836, weight: 30800 },
  // ── SHXY ──
  { customer: "SHXY", salesperson: "Tina", orderType: "普单", status: "预约池", createdAt: "2026-06-09 20:31:04", bookingNo: "REQ260606-0002-MW-SHXY", pickup: "火车站", warehouse: "洛杉矶仓", dock: "", rail: "", quantity: 4, transit: "", type: "40GP", containerNo: "TTNU8336962", systemNo: "TTNU8336962-260615", totalBoxes: 4, volume: 268, weight: 10400 },
  { customer: "SHXY", salesperson: "jessie", orderType: "普单", status: "提柜", createdAt: "2026-06-09 18:16:39", bookingNo: "REQ260606-0001-MW-SHXY", pickup: "火车站", warehouse: "新泽西仓", dock: "", rail: "", quantity: 3, transit: "", type: "40GP", containerNo: "CGMU5822559", systemNo: "CGMU5822559-260615", totalBoxes: 3, volume: 201, weight: 7800 },
  { customer: "SHXY", salesperson: "jessie", orderType: "普单", status: "接受", createdAt: "2026-06-13 11:45:08", bookingNo: "REQ260607-0001-MW-SHXY", pickup: "火车站", warehouse: "休斯顿仓", dock: "", rail: "", quantity: 6, transit: "", type: "40GP", containerNo: "HLXU8201749", systemNo: "HLXU8201749-260615", totalBoxes: 6, volume: 402, weight: 15600 },
  { customer: "SHXY", salesperson: "Tina", orderType: "加急单", status: "预报", createdAt: "2026-06-15 11:02:33", bookingNo: "REQ260613-0001-UR-SHXY", pickup: "码头", warehouse: "芝加哥仓", dock: "芝加哥", rail: "", quantity: 4, transit: "", type: "45HQ", containerNo: "TGBU3487129", systemNo: "TGBU3487129-260630", totalBoxes: 4, volume: 344, weight: 11600 },
  // ── HXWL (新客户) ──
  { customer: "HXWL", salesperson: "天晟", orderType: "普单", status: "预报", createdAt: "2026-06-15 08:35:10", bookingNo: "REQ260613-0002-MW-HXWL", pickup: "火车站", warehouse: "洛杉矶仓", dock: "", rail: "", quantity: 12, transit: "", type: "40HQ", containerNo: "BMOU5123894", systemNo: "BMOU5123894-260701", totalBoxes: 12, volume: 912, weight: 33600 },
  { customer: "HXWL", salesperson: "天晟", orderType: "普单", status: "接受", createdAt: "2026-06-14 07:22:48", bookingNo: "REQ260611-0005-MW-HXWL", pickup: "码头", warehouse: "新泽西仓", dock: "纽瓦克", rail: "", quantity: 15, transit: "", type: "40HQ", containerNo: "OOCU7523198", systemNo: "OOCU7523198-260625", totalBoxes: 15, volume: 1140, weight: 42000 },
  { customer: "HXWL", salesperson: "天晟", orderType: "普单", status: "运输中", createdAt: "2026-06-10 14:51:22", bookingNo: "REQ260607-0007-MW-HXWL", pickup: "火车站", warehouse: "萨凡纳仓", dock: "", rail: "萨凡纳站", quantity: 9, transit: "亚特兰大中转", type: "40GP", containerNo: "TCNU4712559", systemNo: "TCNU4712559-260618", totalBoxes: 9, volume: 603, weight: 23400 },
  // ── JXGJ (新客户) ──
  { customer: "JXGJ", salesperson: "Cathy", orderType: "普单", status: "预报", createdAt: "2026-06-14 20:15:04", bookingNo: "REQ260612-0005-MW-JXGJ", pickup: "火车站", warehouse: "芝加哥仓", dock: "", rail: "", quantity: 14, transit: "", type: "40HQ", containerNo: "MSCU3829104", systemNo: "MSCU3829104-260626", totalBoxes: 14, volume: 1064, weight: 39200 },
  { customer: "JXGJ", salesperson: "Cathy", orderType: "普单", status: "预约池", createdAt: "2026-06-13 16:48:33", bookingNo: "REQ260610-0005-MW-JXGJ", pickup: "码头", warehouse: "奥克兰仓", dock: "奥克兰", rail: "", quantity: 7, transit: "", type: "40HQ", containerNo: "ONEU2198457", systemNo: "ONEU2198457-260624", totalBoxes: 7, volume: 532, weight: 19600 },
  // ── ZJMY (新客户) ──
  { customer: "ZJMY", salesperson: "jessie", orderType: "普单", status: "预报", createdAt: "2026-06-15 13:09:56", bookingNo: "REQ260613-0003-MW-ZJMY", pickup: "火车站", warehouse: "休斯顿仓", dock: "", rail: "", quantity: 16, transit: "", type: "45HQ", containerNo: "HLCU6723489", systemNo: "HLCU6723489-260702", totalBoxes: 16, volume: 1376, weight: 46400 },
  { customer: "ZJMY", salesperson: "jessie", orderType: "加急单", status: "接受", createdAt: "2026-06-14 12:37:21", bookingNo: "REQ260611-0006-UR-ZJMY", pickup: "码头", warehouse: "洛杉矶仓", dock: "长滩", rail: "", quantity: 8, transit: "", type: "40RH", containerNo: "CSNU4456723", systemNo: "CSNU4456723-260625", totalBoxes: 8, volume: 544, weight: 22400 },
  { customer: "ZJMY", salesperson: "jessie", orderType: "普单", status: "运输中", createdAt: "2026-06-09 08:10:44", bookingNo: "REQ260606-0007-MW-ZJMY", pickup: "火车站", warehouse: "新泽西仓", dock: "", rail: "", quantity: 11, transit: "", type: "40HQ", containerNo: "FFAU1982347", systemNo: "FFAU1982347-260618", totalBoxes: 11, volume: 836, weight: 30800 },
  // ── BLT (新客户) ──
  { customer: "BLT", salesperson: "Tina", orderType: "普单", status: "预报", createdAt: "2026-06-14 17:44:18", bookingNo: "REQ260612-0003-MW-BLT", pickup: "码头", warehouse: "萨凡纳仓", dock: "萨凡纳", rail: "", quantity: 13, transit: "", type: "40HQ", containerNo: "CXRU7812459", systemNo: "CXRU7812459-260627", totalBoxes: 13, volume: 988, weight: 36400 },
  { customer: "BLT", salesperson: "Tina", orderType: "普单", status: "提柜", createdAt: "2026-06-11 06:29:37", bookingNo: "REQ260608-0010-MW-BLT", pickup: "火车站", warehouse: "洛杉矶仓", dock: "", rail: "", quantity: 5, transit: "", type: "40GP", containerNo: "GESU5498213", systemNo: "GESU5498213-260620", totalBoxes: 5, volume: 335, weight: 13000 },
  // ── HGKY (新客户) ──
  { customer: "HGKY", salesperson: "天晟", orderType: "普单", status: "预报", createdAt: "2026-06-15 10:46:02", bookingNo: "REQ260613-0004-MW-HGKY", pickup: "火车站", warehouse: "芝加哥仓", dock: "", rail: "芝加哥站", quantity: 10, transit: "", type: "40HQ", containerNo: "MSCU9472156", systemNo: "MSCU9472156-260703", totalBoxes: 10, volume: 760, weight: 28000 },
  { customer: "HGKY", salesperson: "天晟", orderType: "加急单", status: "入库处理中", createdAt: "2026-06-12 03:15:42", bookingNo: "REQ260609-0005-UR-HGKY", pickup: "码头", warehouse: "奥克兰仓", dock: "奥克兰", rail: "", quantity: 6, transit: "旧金山中转", type: "40HQ", containerNo: "SEKU6721034", systemNo: "SEKU6721034-260622", totalBoxes: 6, volume: 456, weight: 16800 },
  // ── XMHT (新客户) ──
  { customer: "XMHT", salesperson: "Cathy", orderType: "普单", status: "预报", createdAt: "2026-06-14 22:08:29", bookingNo: "REQ260612-0006-MW-XMHT", pickup: "码头", warehouse: "新泽西仓", dock: "纽瓦克", rail: "", quantity: 9, transit: "", type: "45HQ", containerNo: "TTNU6723401", systemNo: "TTNU6723401-260627", totalBoxes: 9, volume: 774, weight: 26100 },
  { customer: "XMHT", salesperson: "Cathy", orderType: "普单", status: "接受", createdAt: "2026-06-13 09:52:15", bookingNo: "REQ260610-0006-MW-XMHT", pickup: "火车站", warehouse: "休斯顿仓", dock: "", rail: "", quantity: 7, transit: "", type: "40HQ", containerNo: "OOLU8812945", systemNo: "OOLU8812945-260624", totalBoxes: 7, volume: 532, weight: 19600 },
  // ── DFWL (新客户) ──
  { customer: "DFWL", salesperson: "Tina", orderType: "普单", status: "预报", createdAt: "2026-06-15 14:55:03", bookingNo: "REQ260613-0005-MW-DFWL", pickup: "火车站", warehouse: "奥克兰仓", dock: "", rail: "", quantity: 11, transit: "", type: "40HQ", containerNo: "OOLU5591832", systemNo: "OOLU5591832-260704", totalBoxes: 11, volume: 836, weight: 30800 },
  { customer: "DFWL", salesperson: "Tina", orderType: "普单", status: "运输中", createdAt: "2026-06-10 11:23:50", bookingNo: "REQ260607-0008-MW-DFWL", pickup: "码头", warehouse: "洛杉矶仓", dock: "长滩", rail: "", quantity: 10, transit: "", type: "40GP", containerNo: "FSCU4871230", systemNo: "FSCU4871230-260619", totalBoxes: 10, volume: 670, weight: 26000 },
  // ── YRGY (新客户) ──
  { customer: "YRGY", salesperson: "jessie", orderType: "普单", status: "预报", createdAt: "2026-06-14 16:33:48", bookingNo: "REQ260612-0007-MW-YRGY", pickup: "火车站", warehouse: "洛杉矶仓", dock: "", rail: "", quantity: 15, transit: "", type: "40HQ", containerNo: "BMOU2938471", systemNo: "BMOU2938471-260628", totalBoxes: 15, volume: 1140, weight: 42000 },
  { customer: "YRGY", salesperson: "jessie", orderType: "普单", status: "预约池", createdAt: "2026-06-11 20:05:12", bookingNo: "REQ260608-0012-MW-YRGY", pickup: "码头", warehouse: "萨凡纳仓", dock: "萨凡纳", rail: "", quantity: 8, transit: "", type: "40HQ", containerNo: "ONEU4839201", systemNo: "ONEU4839201-260621", totalBoxes: 8, volume: 608, weight: 22400 },
  // ── JHT (新客户) ──
  { customer: "JHT", salesperson: "天晟", orderType: "普单", status: "预报", createdAt: "2026-06-15 09:25:37", bookingNo: "REQ260613-0006-MW-JHT", pickup: "火车站", warehouse: "萨凡纳仓", dock: "", rail: "", quantity: 12, transit: "", type: "40HQ", containerNo: "CSNU6028347", systemNo: "CSNU6028347-260701", totalBoxes: 12, volume: 912, weight: 33600 },
  { customer: "JHT", salesperson: "Cathy", orderType: "普单", status: "预报", createdAt: "2026-06-13 19:14:55", bookingNo: "REQ260610-0007-MW-JHT", pickup: "码头", warehouse: "休斯顿仓", dock: "休斯顿", rail: "", quantity: 10, transit: "", type: "40HQ", containerNo: "FCIU7782341", systemNo: "FCIU7782341-260625", totalBoxes: 10, volume: 760, weight: 28000 },
  // ── TJKD (新客户) ──
  { customer: "TJKD", salesperson: "Tina", orderType: "普单", status: "预报", createdAt: "2026-06-15 11:33:09", bookingNo: "REQ260613-0007-MW-TJKD", pickup: "码头", warehouse: "新泽西仓", dock: "纽瓦克", rail: "", quantity: 8, transit: "", type: "45HQ", containerNo: "NYKU4923105", systemNo: "NYKU4923105-260704", totalBoxes: 8, volume: 688, weight: 23200 },
  { customer: "TJKD", salesperson: "Tina", orderType: "加急单", status: "提柜", createdAt: "2026-06-10 15:42:19", bookingNo: "REQ260607-0009-UR-TJKD", pickup: "火车站", warehouse: "芝加哥仓", dock: "", rail: "芝加哥站", quantity: 5, transit: "", type: "40GP", containerNo: "HLXU3340912", systemNo: "HLXU3340912-260618", totalBoxes: 5, volume: 335, weight: 13000 },
  // ── 未预报周数筛选演示数据 ──
  { customer: "WEEK2", salesperson: "jessie", orderType: "普单", status: "接受", createdAt: "2026-05-28 00:00:00", bookingNo: "REQ260528-0001-MW-WEEK2", pickup: "火车站", warehouse: "洛杉矶仓", dock: "", rail: "", quantity: 6, transit: "", type: "40HQ", containerNo: "CCLU2800002", systemNo: "CCLU2800002-260528", totalBoxes: 6, volume: 456, weight: 16800 },
  { customer: "WEEK3", salesperson: "Cathy", orderType: "普单", status: "运输中", createdAt: "2026-05-21 00:00:00", bookingNo: "REQ260521-0001-MW-WEEK3", pickup: "码头", warehouse: "芝加哥仓", dock: "芝加哥", rail: "", quantity: 8, transit: "", type: "40HQ", containerNo: "MSCU2100003", systemNo: "MSCU2100003-260521", totalBoxes: 8, volume: 608, weight: 22400 },
  { customer: "WEEK4", salesperson: "Tina", orderType: "普单", status: "提柜", createdAt: "2026-05-14 00:00:00", bookingNo: "REQ260514-0001-MW-WEEK4", pickup: "火车站", warehouse: "新泽西仓", dock: "", rail: "", quantity: 5, transit: "", type: "40GP", containerNo: "NYKU1400004", systemNo: "NYKU1400004-260514", totalBoxes: 5, volume: 335, weight: 13000 },
  { customer: "MONTH1", salesperson: "天晟", orderType: "普单", status: "入库处理中", createdAt: "2026-05-13 00:00:00", bookingNo: "REQ260513-0001-MW-MONTH1", pickup: "码头", warehouse: "休斯顿仓", dock: "休斯顿", rail: "", quantity: 7, transit: "", type: "40HQ", containerNo: "TGBU1300001", systemNo: "TGBU1300001-260513", totalBoxes: 7, volume: 532, weight: 19600 }
];

const warehouseOptions = ["洛杉矶仓", "芝加哥仓", "新泽西仓", "萨凡纳仓", "休斯顿仓", "奥克兰仓"];
const warehouseColumnLabels = {};
const statusOptions = ["预报", "接受", "运输中", "预约池", "提柜", "入库处理中"];

function formatOffsetDate(value, dayOffset) {
  const [datePart, timePart = "00:00:00"] = value.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [sourceHour = 0, sourceMinute = 0] = timePart.split(":").map(Number);
  const date = new Date(year, month - 1, day, sourceHour, sourceMinute, 0);
  date.setDate(date.getDate() + dayOffset);

  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function applyTransitTimeDefaults(row, index) {
  const arrivalOffset = row.pickup === "火车站" ? 9 : 6;
  const pickOffset = row.pickup === "火车站" ? 12 : 8;
  row.etaAt = row.etaAt || formatOffsetDate(row.createdAt, arrivalOffset);
  row.actualArrivalAt = row.actualArrivalAt || (["运输中", "预约池", "提柜", "入库处理中"].includes(row.status)
    ? formatOffsetDate(row.createdAt, arrivalOffset + (index % 2))
    : "");
  row.estimatedPickupAt = row.estimatedPickupAt || formatOffsetDate(row.createdAt, pickOffset);
  row.actualPickupAt = row.actualPickupAt || (["提柜", "入库处理中"].includes(row.status)
    ? formatOffsetDate(row.createdAt, pickOffset + (index % 2))
    : "");
}

rows.forEach(applyTransitTimeDefaults);

const roleOptions = [
  { value: "admin", label: "管理员", isAdmin: true },
  { value: "天晟", label: "天晟", isAdmin: false },
  { value: "Tina", label: "Tina", isAdmin: false },
  { value: "jessie", label: "jessie", isAdmin: false },
  { value: "Cathy", label: "Cathy", isAdmin: false }
];

const auditWindow = {
  weekLabel: "2026-W24",
  weekStart: "2026-06-08 00:00:00",
  riskEnd: "2026-06-10 23:59:59",
  weekEnd: "2026-06-14 23:59:59",
  triggeredAt: "2026-06-11 00:00:00"
};

const customerStatusOptions = ["合作中", "暂停合作", "终止合作"];
const customerStatusRuleDefaults = {
  pauseMinDays: 14,
  terminateMinDays: 28,
  lowVolumeThreshold: 70
};
const customerStatusRules = loadCustomerStatusRules();

const state = {
  filters: {
    keyword: "",
    customer: "",
    salesperson: "",
    orderType: "",
    status: "",
    createdAt: "",
    carrierCode: "",
    type: "",
    warehouse: "",
    pickup: ""
  },
  selected: new Set(),
  activeWarehouseTab: "",
  boardCustomerFilter: "",
  boardSalespersonFilter: "",
  boardCustomerStatusFilter: "",
  boardStatusTab: "",
  boardCodeCreateTimeFrom: "",
  boardCodeCreateTimeTo: "",
  boardLatestTimeFrom: "",
  boardLatestTimeTo: "",
  boardLatestWarehouseFilter: [],
  boardUnreportedDaysFrom: "",
  boardUnreportedDaysTo: "",
  dashboardWeekRange: "8",
  role: "admin",
  sortKey: "",
  sortDirection: "",
  boardSelected: new Set(),
  activeRemarkId: "",
  editingProgressId: "",
  editingDeletedAttachments: [],
  isBatchProgress: false,
  visibleDetailFields: [],
  fieldSettingsDraft: []
};

const generatedWarnings = buildWarningRecords();
const warningStore = loadWarningStore();

const carrierCodeByPrefix = {
  CCLU: "HEDE",
  TCNU: "HEDE",
  MSNU: "HEDE",
  DFSU: "HEDE",
  OOCU: "HEDE",
  CSNU: "HEDE",
  FFAU: "CMA",
  TGBU: "CMA",
  GOSU: "HEDE",
  TCLU: "HEDE",
  CXRU: "HEDE",
  HLCU: "HEDE",
  ONEU: "CMA",
  SEKU: "HEDE",
  CSLU: "HEDE",
  CAAU: "CMA",
  SMCU: "HEDE",
  BMOU: "HEDE",
  TTNU: "HEDE",
  CGMU: "CMA",
  HLXU: "HEDE",
  MSCU: "HEDE",
  OOLU: "CMA",
  FSCU: "HEDE",
  FCIU: "CMA",
  NYKU: "HEDE"
};

function getCarrierCode(row) {
  if (row.carrierCode) {
    return row.carrierCode;
  }

  const prefix = String(row.containerNo || "").slice(0, 4).toUpperCase();
  return carrierCodeByPrefix[prefix] || "HEDE";
}

const detailFieldDefaults = [
  { id: "customer", title: "客户名称", width: 100, getText: (row) => row.customer },
  { id: "bookingNo", title: "预报单号", width: 180, sortable: true, getText: (row) => row.bookingNo, render: (row) => linkCell(row.bookingNo) },
  { id: "etaAt", title: "预计到港时间", width: 130, sortable: true, getText: (row) => row.etaAt },
  { id: "actualArrivalAt", title: "实际到港/火车站时间", width: 165, sortable: true, getText: (row) => row.actualArrivalAt },
  { id: "estimatedPickupAt", title: "预计提柜时间", width: 130, sortable: true, getText: (row) => row.estimatedPickupAt },
  { id: "actualPickupAt", title: "实际提柜时间", width: 130, sortable: true, getText: (row) => row.actualPickupAt },
  { id: "pickup", title: "提柜地点", width: 100, getText: (row) => row.pickup },
  { id: "warehouse", title: "仓库", width: 100, getText: (row) => row.warehouse },
  { id: "carrierCode", title: "船司代码", width: 76, className: "carrier-code-cell", getText: (row) => getCarrierCode(row), sortValue: (row) => getCarrierCode(row) },
  { id: "dock", title: "码头", width: 90, getText: (row) => row.dock },
  { id: "rail", title: "火车站", width: 90, getText: (row) => row.rail },
  { id: "quantity", title: "库点数量", width: 76, getText: (row) => row.quantity },
  { id: "transit", title: "中转仓", width: 90, getText: (row) => row.transit },
  { id: "type", title: "集装箱类型", width: 90, getText: (row) => row.type },
  { id: "containerNo", title: "柜号", width: 94, className: "asset-cell", getText: (row) => row.containerNo, render: (row) => linkCell(row.containerNo) },
  { id: "systemNo", title: "系统柜号", width: 125, className: "asset-cell", getText: (row) => row.systemNo },
  { id: "totalBoxes", title: "预报总箱数", width: 92, getText: (row) => row.totalBoxes },
  { id: "volume", title: "总体积", width: 92, getText: (row) => row.volume },
  { id: "weight", title: "重量", width: 92, getText: (row) => row.weight },
  { id: "salesperson", title: "业务员", width: 140, getText: (row) => row.salesperson },
  { id: "orderType", title: "类型", width: 92, getText: (row) => row.orderType },
  { id: "status", title: "运单状态", width: 92, getText: (row) => row.status, render: (row) => `<span class="status-badge">${escapeHtml(row.status)}</span>` },
  { id: "createdAt", title: "创建时间", width: 150, sortable: true, getText: (row) => row.createdAt }
];

const detailFieldMap = new Map(detailFieldDefaults.map((field) => [field.id, field]));

function getVisibleDetailFields() {
  return state.visibleDetailFields
    .filter((fieldState) => fieldState.visible)
    .map((fieldState) => detailFieldMap.get(fieldState.id))
    .filter(Boolean);
}

function getDetailFieldValue(field, row) {
  if (field.getText) {
    return field.getText(row);
  }

  return row[field.id];
}

function getExportColumns() {
  return [
    { title: "序号", getValue: (_row, index) => index + 1 },
    ...getVisibleDetailFields().map((field) => ({
      title: field.title,
      getValue: (row) => getDetailFieldValue(field, row)
    }))
  ];
}

const els = {
  dashboardMeta: document.querySelector("#dashboardMeta"),
  weeklyWarningLineChart: document.querySelector("#weeklyWarningLineChart"),
  weeklyWarningTotal: document.querySelector("#weeklyWarningTotal"),
  topUnreportedBarChart: document.querySelector("#topUnreportedBarChart"),
  topUnreportedMax: document.querySelector("#topUnreportedMax"),
  dashboardWeekRangeSelect: document.querySelector("#dashboardWeekRangeSelect"),
  dashboardSearchButton: document.querySelector("#dashboardSearchButton"),
  dashboardResetButton: document.querySelector("#dashboardResetButton"),
  overviewCustomerSearch: document.querySelector("#overviewCustomerSearch"),
  overviewSalespersonSearch: document.querySelector("#overviewSalespersonSearch"),
  overviewCustomerStatusSearch: document.querySelector("#overviewCustomerStatusSearch"),
  overviewCodeCreateTimeFrom: document.querySelector("#codeCreateTimeFrom"),
  overviewCodeCreateTimeTo: document.querySelector("#codeCreateTimeTo"),
  codeCreateTimeDisplay: document.querySelector("#codeCreateTimeDisplay"),
  codeCreateTimeBox: document.querySelector("#codeCreateTimeBox"),
  codeCreateTimeClear: document.querySelector("#codeCreateTimeClear"),
  boardStatusTabs: document.querySelectorAll(".board-status-tab"),
  overviewLatestTimeFrom: document.querySelector("#latestTimeFrom"),
  overviewLatestTimeTo: document.querySelector("#latestTimeTo"),
  latestTimeDisplay: document.querySelector("#latestTimeDisplay"),
  latestTimeBox: document.querySelector("#latestTimeBox"),
  latestTimeClear: document.querySelector("#latestTimeClear"),
  latestWarehouseBox: document.querySelector("#latestWarehouseBox"),
  latestWarehouseDisplay: document.querySelector("#latestWarehouseDisplay"),
  latestWarehouseClear: document.querySelector("#latestWarehouseClear"),
  latestWarehouseDrop: document.querySelector("#latestWarehouseDrop"),
  overviewUnreportedDaysFrom: document.querySelector("#unreportedDaysFrom"),
  overviewUnreportedDaysTo: document.querySelector("#unreportedDaysTo"),
  unreportedDaysDisplay: document.querySelector("#unreportedDaysDisplay"),
  unreportedDaysBox: document.querySelector("#unreportedDaysBox"),
  unreportedDaysClear: document.querySelector("#unreportedDaysClear"),
  boardSearchButton: document.querySelector("#boardSearchButton"),
  resetBoardButton: document.querySelector("#resetBoardButton"),
  alertBody: document.querySelector("#alertBody"),
  overviewEmptyState: document.querySelector("#overviewEmptyState"),
  customerInput: document.querySelector("#customerInput"),
  salespersonInput: document.querySelector("#salespersonInput"),
  orderTypeSelect: document.querySelector("#orderTypeSelect"),
  statusSelect: document.querySelector("#statusSelect"),
  createdAtInput: document.querySelector("#createdAtInput"),
  carrierCodeInput: document.querySelector("#carrierCodeInput"),
  searchButton: document.querySelector("#searchButton"),
  resetButton: document.querySelector("#resetButton"),
  backButton: document.querySelector("#backButton"),
  exportButton: document.querySelector("#exportButton"),
  fieldSettingsButton: document.querySelector("#fieldSettingsButton"),
  fieldSettingsMask: document.querySelector("#fieldSettingsMask"),
  fieldSettingsDrawer: document.querySelector("#fieldSettingsDrawer"),
  fieldSettingsClose: document.querySelector("#fieldSettingsClose"),
  fieldSettingsCancel: document.querySelector("#fieldSettingsCancel"),
  fieldSettingsApply: document.querySelector("#fieldSettingsApply"),
  fieldSettingsBody: document.querySelector("#fieldSettingsBody"),
  exportSelectedButton: document.querySelector("#exportSelectedButton"),
  clearSelectionButton: document.querySelector("#clearSelectionButton"),
  boardSelectAll: document.querySelector("#boardSelectAll"),
  detailsTable: document.querySelector("#detailsTable"),
  detailsTableHead: document.querySelector("#detailsTableHead"),
  tableBody: document.querySelector("#tableBody"),
  resultSummary: document.querySelector("#resultSummary"),
  selectionInfo: document.querySelector("#selectionInfo"),
  selectAll: document.querySelector("#selectAll"),
  emptyState: document.querySelector("#emptyState"),
  warehouseTabs: document.querySelectorAll(".warehouse-tab"),
  tabButtons: document.querySelectorAll(".tab-button"),
  boardListToolbar: document.querySelector("#boardListToolbar"),
  boardListExportBtn: document.querySelector("#boardListExportBtn"),
  boardListCsBtn: document.querySelector("#boardListCsBtn"),
  boardUpdateTime: document.querySelector("#boardUpdateTime"),
  toast: document.querySelector("#toast"),
  csModal: document.querySelector("#customerStatusModal"),
  csModalClose: document.querySelector("#customerStatusModalClose"),
  csPauseDays: document.querySelector("#csPauseDays"),
  csTerminateDays: document.querySelector("#csTerminateDays"),
  csLowVolumeThreshold: document.querySelector("#csLowVolumeThreshold"),
  csConfigSummary: document.querySelector("#csConfigSummary"),
  csCancelBtn: document.querySelector("#csCancelBtn"),
  csConfirmBtn: document.querySelector("#csConfirmBtn"),
};

function parseDateTime(value) {
  const [datePart, timePart = "00:00:00"] = value.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour = 0, minute = 0, second = 0] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

function isWithin(value, start, end) {
  const time = parseDateTime(value);
  return time >= parseDateTime(start) && time <= parseDateTime(end);
}

function formatMinute(value) {
  return value ? value.slice(0, 16) : "--";
}

function formatRealtimeUpdateTime(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function formatWarehouseTime(value) {
  return value || "--";
}

function getWarehouseDisplayTime(record, warehouse) {
  return record.latestByWarehouse[warehouse] || getLatestPreorderTime(record.latestByWarehouse) || record.codeCreateTime || "";
}

function getWarehouseLabel(warehouse) {
  return warehouseColumnLabels[warehouse] || warehouse;
}

function isEmptyValue(value) {
  return value === "" || value === null || value === undefined;
}

function getExplicitWarehouseStockVolume(record, warehouse) {
  const label = getWarehouseLabel(warehouse);
  const fieldNames = [
    `${warehouse}在库方数`,
    `${label}在库方数`,
    `${warehouse}库存体积`,
    `${label}库存体积`,
    `${warehouse}方数`,
    `${label}方数`
  ];

  for (const fieldName of fieldNames) {
    if (Object.prototype.hasOwnProperty.call(record, fieldName) && !isEmptyValue(record[fieldName])) {
      return record[fieldName];
    }
  }

  const nestedValues = [
    record.warehouseStockVolumes?.[warehouse],
    record.warehouseStockVolumes?.[label],
    record.stockVolumesByWarehouse?.[warehouse],
    record.stockVolumesByWarehouse?.[label],
    record.inventoryVolumeByWarehouse?.[warehouse],
    record.inventoryVolumeByWarehouse?.[label]
  ];

  for (const value of nestedValues) {
    if (!isEmptyValue(value)) {
      return value;
    }
  }

  return undefined;
}

function getWarehouseStockVolume(record, warehouse) {
  const explicitValue = getExplicitWarehouseStockVolume(record, warehouse);
  if (!isEmptyValue(explicitValue)) {
    return explicitValue;
  }

  const total = rows
    .filter((row) => row.customer === record.customer && row.warehouse === warehouse)
    .reduce((sum, row) => sum + (Number(row.volume) || 0), 0);

  return total;
}

function formatStockVolume(value) {
  if (isEmptyValue(value)) {
    return "0";
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    return String(value);
  }

  return number.toFixed(2).replace(/\.?0+$/, "");
}

function uniqueValues(key) {
  return [...new Set(rows.map((row) => row[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function fillSelect(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}


function getCustomerOwner(customer) {
  const customerRows = rows.filter((row) => row.customer === customer);
  const counts = customerRows.reduce((map, row) => {
    map[row.salesperson] = (map[row.salesperson] || 0) + 1;
    return map;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

function getLatestByWarehouse(customer) {
  return Object.fromEntries(
    warehouseOptions.map((warehouse) => {
      const latest = rows
        .filter((row) => row.customer === customer && row.warehouse === warehouse)
        .sort((a, b) => parseDateTime(b.createdAt) - parseDateTime(a.createdAt))[0];
      return [warehouse, latest?.createdAt || ""];
    })
  );
}

function getCodeCreateTime(customer) {
  const customerRows = rows.filter(function (r) { return r.customer === customer; });
  if (!customerRows.length) { return ""; }
  return customerRows
    .sort(function (a, b) { return parseDateTime(a.createdAt) - parseDateTime(b.createdAt); })[0]
    .createdAt;
}

function getCustomerCode(customer) {
  const customerRows = rows.filter(function (r) { return r.customer === customer; });
  return customerRows[0]?.customerCode || customerRows[0]?.customer_code || `CUS-${customer}`;
}

function getCustomerStockVolume(customer) {
  return rows
    .filter((row) => row.customer === customer)
    .reduce((totals, row) => {
      const volume = Number(row.volume) || 0;
      const bucket = ["预报", "接受", "运输中", "预约池"].includes(row.status) ? "temporary" : "regular";
      totals[bucket] += volume;
      return totals;
    }, { regular: 0, temporary: 0 });
}

function getWarehouseStockVolumeSplit(customer, warehouse) {
  return rows
    .filter((row) => row.customer === customer && row.warehouse === warehouse)
    .reduce((totals, row) => {
      const volume = Number(row.volume) || 0;
      const bucket = ["预报", "接受", "运输中", "预约池"].includes(row.status) ? "temporary" : "regular";
      totals[bucket] += volume;
      return totals;
    }, { regular: 0, temporary: 0 });
}

function formatVolume(value) {
  const number = Number(value) || 0;
  return Number.isInteger(number) ? String(number) : number.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function isLowVolume(value) {
  const number = Number(value) || 0;
  return number < customerStatusRules.lowVolumeThreshold;
}

function renderVolumeValue(value) {
  const formatted = escapeHtml(formatVolume(value));
  return isLowVolume(value) ? `<span class="volume-low">${formatted}</span>` : formatted;
}

function getLatestPreorderTime(latestByWarehouse) {
  return Object.values(latestByWarehouse)
    .filter(Boolean)
    .sort((a, b) => parseDateTime(b) - parseDateTime(a))[0] || "";
}

function getLatestPreorderWarehouse(latestByWarehouse) {
  return getLatestPreorderWarehouses(latestByWarehouse).join("、");
}

function getLatestPreorderWarehouses(latestByWarehouse) {
  const latestTime = getLatestPreorderTime(latestByWarehouse);
  if (!latestTime) {
    return [];
  }

  return Object.entries(latestByWarehouse)
    .filter(([, time]) => time === latestTime)
    .map(([warehouse]) => warehouse);
}

function getUnreportedWeekText(latestPreorderTime, triggeredAt) {
  if (!latestPreorderTime) {
    return "1";
  }

  const diff = parseDateTime(triggeredAt || auditWindow.triggeredAt) - parseDateTime(latestPreorderTime);
  const weeks = Math.max(1, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)));
  return weeks > 4 ? "1月以上" : String(weeks);
}

function getUnreportedWeekSortValue(record) {
  const latestTime = getLatestPreorderTime(record.latestByWarehouse);
  const weekText = getUnreportedWeekText(latestTime, record.triggeredAt);
  return weekText === "1月以上" ? 5 : Number(weekText);
}

function getUnreportedWeekCount(latestPreorderTime, triggeredAt) {
  if (!latestPreorderTime) {
    return 1;
  }

  const diff = parseDateTime(triggeredAt || auditWindow.triggeredAt) - parseDateTime(latestPreorderTime);
  return Math.max(1, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)));
}

function getUnreportedDayCount(record, latestPreorderTime) {
  const baseTime = latestPreorderTime || record.codeCreateTime;
  if (!baseTime) {
    return "";
  }

  const diff = parseDateTime(record.triggeredAt || auditWindow.triggeredAt) - parseDateTime(baseTime);
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

function hasPreorderInRiskWindow(customer) {
  return rows.some((row) => {
    return (
      row.customer === customer &&
      warehouseOptions.includes(row.warehouse) &&
      row.status === "预报" &&
      isWithin(row.createdAt, auditWindow.weekStart, auditWindow.riskEnd)
    );
  });
}

function buildWarningRecords() {
  const customers = uniqueValues("customer");
  const records = customers
    .filter((customer) => !hasPreorderInRiskWindow(customer))
    .map((customer) => {
      const owner = getCustomerOwner(customer);
      const latestByWarehouse = getLatestByWarehouse(customer);
      return {
        id: `${auditWindow.weekLabel}-${customer}`,
        customer,
        customerCode: getCustomerCode(customer),
        salesperson: owner,
        status: "pending",
        codeCreateTime: getCodeCreateTime(customer),
        weekLabel: auditWindow.weekLabel,
        latestByWarehouse,
        triggeredAt: auditWindow.triggeredAt,
        reason: "周一至周三六个核心仓均无新增循环柜预报",
        remark: "",
        processedAt: "",
        operator: "system",
        customerStatus: "合作中"
      };
    });

  const pausedCustomers = ["WEEK4"];
  const terminatedCustomers = ["MONTH1"];
  records.forEach(function(r) {
    if (pausedCustomers.indexOf(r.customer) !== -1) {
      r.customerStatus = "暂停合作";
    }
    if (terminatedCustomers.indexOf(r.customer) !== -1) {
      r.customerStatus = "终止合作";
    }
  });

  records.push({
    id: `${auditWindow.weekLabel}-JJGJ`,
    customer: "JJGJ",
    customerCode: getCustomerCode("JJGJ"),
    salesperson: "jessie",
    status: "processed",
    weekLabel: auditWindow.weekLabel,
    latestByWarehouse: getLatestByWarehouse("JJGJ"),
    triggeredAt: auditWindow.triggeredAt,
    reason: "周一至周三六个核心仓均无新增循环柜预报",
    remark: "已确认下周恢复洛杉矶仓循环柜。",
    processedAt: "2026-06-12 11:18:00",
    operator: "jessie",
    customerStatus: "合作中",
    codeCreateTime: getCodeCreateTime("JJGJ")
  });

  const jxgj = records.find((record) => record.customer === "JXGJ");
  if (jxgj) {
    jxgj.status = "processed";
    jxgj.processedAt = "2026-06-11 15:42:00";
    jxgj.remark = "已联系客户确认，下周洛杉矶仓有两柜计划。";
    jxgj.triggeredAt = "2026-06-11 00:45:00";
    jxgj.operator = "Cathy";
  }

  const blt = records.find((record) => record.customer === "BLT");
  if (blt) {
    blt.status = "processed";
    blt.processedAt = "2026-06-12 09:10:00";
    blt.remark = "客户反馈暂停发货，预计7月恢复。";
    blt.triggeredAt = "2026-06-11 02:00:00";
    blt.operator = "Tina";
  }

  const jht = records.find((record) => record.customer === "JHT");
  if (jht) {
    jht.status = "processed";
    jht.processedAt = "2026-06-13 17:55:00";
    jht.remark = "已与客户确认，月底前恢复。";
    jht.triggeredAt = "2026-06-11 01:15:00";
    jht.operator = "天晟";
  }

  return dedupeById(records);
}

function dedupeById(records) {
  const map = new Map();
  records.forEach((record) => map.set(record.id, record));
  return [...map.values()];
}

function loadWarningStore() {
  try {
    // 版本控制: 清空旧缓存强制重新生成
    var version = localStorage.getItem("cycle-warning-version");
    if (version !== "v4") {
      localStorage.removeItem("cycle-warning-records");
      localStorage.removeItem("cycle-warning-logs");
      localStorage.setItem("cycle-warning-version", "v4");
      return generatedWarnings.filter((record) => record.status !== "overdue");
    }
    const saved = JSON.parse(localStorage.getItem("cycle-warning-records") || "[]");
    const merged = generatedWarnings.map((record) => {
      const override = saved.find((item) => item.id === record.id);
      return override ? { ...record, ...override } : record;
    });
    return merged.filter((record) => record.status !== "overdue");
  } catch (_error) {
    return generatedWarnings.filter((record) => record.status !== "overdue");
  }
}

function persistWarningStore() {
  localStorage.setItem("cycle-warning-records", JSON.stringify(warningStore));
}

const progressStore = loadProgressStore();

function loadProgressStore() {
  try {
    var saved = JSON.parse(localStorage.getItem("cycle-warning-progress") || "[]");
    var ver = localStorage.getItem("cycle-warning-version");
    if (ver !== "v4") {
      localStorage.removeItem("cycle-warning-progress");
      saved = [];
    }
    var demo = [
      { id: "demo-1", customer: "JJGJ", content: "已确认下周恢复洛杉矶仓循环柜，预计两个柜。", attachments: [], operator: "jessie", timestamp: "2026-06-12 11:18:00" },
      { id: "demo-2", customer: "JXGJ", content: "电话联系客户确认，下周将有两票预报。", attachments: [], operator: "Cathy", timestamp: "2026-06-11 15:42:00" },
      { id: "demo-3", customer: "BLT", content: "客户反馈暂停发货，预计7月恢复。", attachments: [], operator: "Tina", timestamp: "2026-06-12 09:10:00" },
      { id: "demo-4", customer: "JHT", content: "已与客户确认，月底前恢复两个萨凡纳仓。", attachments: [], operator: "天晟", timestamp: "2026-06-13 17:55:00" },
      { id: "demo-5", customer: "TTTX", content: "Tim确认下周洛杉矶仓有新柜，芝加哥仓需协调火车站资源。", attachments: [], operator: "天晟", timestamp: "2026-06-14 10:30:00" },
      { id: "demo-6", customer: "SLGYL", content: "已邮件沟通，客户本周反馈预报计划。", attachments: [], operator: "jessie", timestamp: "2026-06-13 14:20:00" }
    ];
    var existing = new Set(saved.map(function (e) { return e.id; }));
    var changed = false;
    demo.forEach(function (d) { if (!existing.has(d.id)) { saved.push(d); changed = true; } });
    if (changed) { localStorage.setItem("cycle-warning-progress", JSON.stringify(saved)); }
    return saved;
  } catch (_error) {
    return [];
  }
}

function persistProgressStore() {
  localStorage.setItem("cycle-warning-progress", JSON.stringify(progressStore));
}

function getProgressEntries(customer) {
  return progressStore
    .filter((entry) => entry.customer === customer)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

function resetProgressEditor() {
  state.editingProgressId = "";
  state.editingDeletedAttachments = [];
  if (els.progressInput) {
    els.progressInput.value = "";
  }
  if (els.progressAttachment) {
    els.progressAttachment.value = "";
  }
  if (els.progressAttachmentName) {
    els.progressAttachmentName.textContent = "未选择任何文件";
  }
  if (els.progressEditAttachments) {
    els.progressEditAttachments.innerHTML = "";
    els.progressEditAttachments.hidden = true;
  }
}

function renderProgress() {
  if (!els.progressList) { return; }
  if (els.progressCustomerName) {
    els.progressCustomerName.textContent = state.activeProgressCustomer ? "— " + state.activeProgressCustomer : "";
  }
  // 非待处理状态隐藏更新进度按钮和编辑/删除
  var isPending = state.activeProgressIsPending;
  if (els.progressUpdateBtn) {
    els.progressUpdateBtn.hidden = !isPending;
  }
  var entries = getProgressEntries(state.activeProgressCustomer);
  var showActions = isPending;
  els.progressEmpty.hidden = entries.length > 0;
  els.progressList.innerHTML = entries
    .map(function (entry) {
      // 兼容旧数据格式: attachments 可能是字符串数组 (仅名称) 或对象数组 (name+size)
      var attachmentItems = entry.attachments || [];
      var attachmentHtml = "";
      if (attachmentItems.length) {
        attachmentHtml = '<div class="progress-attachments">' +
          attachmentItems.map(function (item) {
            var name = typeof item === "string" ? item : item.name;
            var sizeText = (typeof item === "object" && item.size) ? " (" + formatFileSize(item.size) + ")" : "";
            return '<span title="' + escapeHtml(name) + sizeText + '">' + escapeHtml(name) + sizeText + '</span>';
          }).join("") +
          '</div>';
      }
      var actionsHtml = showActions
        ? '<div class="progress-item-actions">' +
            '<button class="progress-edit-btn" type="button" data-id="' + escapeHtml(entry.id) + '" title="编辑">编辑</button>' +
            '<button class="progress-delete-btn" type="button" data-id="' + escapeHtml(entry.id) + '" title="删除此条进度">删除</button>' +
          '</div>'
        : '';
      return (
        '<article class="progress-item">' +
          '<div class="progress-dot" aria-hidden="true"></div>' +
          '<div class="progress-meta">' +
            '<strong>' + escapeHtml(entry.operator) + '</strong>' +
            '<span>' + escapeHtml(entry.timestamp) + '</span>' +
          '</div>' +
          '<div class="progress-content">' + escapeHtml(entry.content) + '</div>' +
          attachmentHtml +
          actionsHtml +
        '</article>'
      );
    })
    .join("");
}

function updateProgressAttachmentName() {
  if (!els.progressAttachmentName || !els.progressAttachment) { return; }
  const files = [...els.progressAttachment.files];
  els.progressAttachmentName.textContent = files.length
    ? files.map(function (file) { return file.name + " (" + formatFileSize(file.size) + ")"; }).join("、")
    : "未选择附件";
}

function submitProgress() {
  if (!els.progressInput) { return; }
  const content = els.progressInput.value.trim();
  if (!content) {
    showToast("请输入处理进度描述", "warning");
    return;
  }

  if (state.isBatchProgress) {
    // 批量模式: 为每个选中行创建进度
    var selectedIds = [...state.boardSelected];
    if (!selectedIds.length) { return; }
    var timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    var fileItems = els.progressAttachment
      ? [...els.progressAttachment.files].map(function (f) { return { name: f.name, size: f.size }; })
      : [];
    selectedIds.forEach(function (id) {
      var record = warningStore.find(function (r) { return r.id === id; });
      if (record) {
        progressStore.push({
          id: "progress-" + record.customer + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
          customer: record.customer,
          content: content,
          attachments: fileItems,
          operator: getRole().label,
          timestamp: timestamp
        });
      }
    });
    persistProgressStore();
    state.boardSelected.clear();
    state.isBatchProgress = false;
    showToast("✅ 已为 " + selectedIds.length + " 个客户批量添加进度", "success");
  } else if (state.editingProgressId) {
    // 编辑模式
    var entry = progressStore.find(function (e) { return e.id === state.editingProgressId; });
    if (entry) {
      entry.content = content;
      var oldItems = (entry.attachments || []).filter(function (_, index) {
        return !state.editingDeletedAttachments.includes(index);
      });
      var newItems = els.progressAttachment
        ? [...els.progressAttachment.files].map(function (file) { return { name: file.name, size: file.size }; })
        : [];
      entry.attachments = oldItems.concat(newItems);
      entry.timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    }
    showToast("✅ 进度修改成功", "success");
  } else if (state.activeProgressCustomer) {
    // 单条新增模式
    var fileItems2 = els.progressAttachment
      ? [...els.progressAttachment.files].map(function (file) { return { name: file.name, size: file.size }; })
      : [];
    progressStore.push({
      id: "progress-" + state.activeProgressCustomer + "-" + Date.now(),
      customer: state.activeProgressCustomer,
      content: content,
      attachments: fileItems2,
      operator: getRole().label,
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " ")
    });
    showToast("✅ 进度更新成功", "success");
  }

  persistProgressStore();
  resetProgressEditor();
  closeProgressModal();
  renderProgress();
  renderBoard();
}

function renderEditAttachments(entry) {
  if (!els.progressEditAttachments) { return; }
  state.editingDeletedAttachments = [];
  var items = entry.attachments || [];
  if (!items.length) {
    els.progressEditAttachments.innerHTML = "";
    els.progressEditAttachments.hidden = true;
    return;
  }
  els.progressEditAttachments.hidden = false;
  els.progressEditAttachments.innerHTML =
    '<span class="progress-edit-attach-label">已有附件：</span>' +
    items.map(function (item, index) {
      var name = typeof item === "string" ? item : item.name;
      var sizeText = (typeof item === "object" && item.size) ? " (" + formatFileSize(item.size) + ")" : "";
      return (
        '<span class="progress-edit-attach-item" data-index="' + index + '">' +
          '<span class="progress-edit-attach-name" title="' + escapeHtml(name) + sizeText + '">' + escapeHtml(name) + sizeText + '</span>' +
          '<button class="progress-edit-attach-del" type="button" data-index="' + index + '" title="删除此附件">✕</button>' +
        '</span>'
      );
    }).join("");
}

function editProgressEntry(entryId) {
  var entry = progressStore.find(function (e) { return e.id === entryId; });
  if (!entry || !els.progressInput || !els.progressModal) { return; }
  state.editingProgressId = entryId;
  state.editingDeletedAttachments = [];
  els.progressInput.value = entry.content;
  els.progressModal.hidden = false;
  if (els.progressAttachment) {
    els.progressAttachment.value = "";
  }
  if (els.progressAttachmentName) {
    els.progressAttachmentName.textContent = "点击选择文件追加附件";
  }
  if (els.progressModalCustomerName) {
    els.progressModalCustomerName.textContent = "— " + (entry.customer || state.activeProgressCustomer);
  }
  renderEditAttachments(entry);
}

function openProgressModal() {
  if (!els.progressModal) { return; }
  if (!state.isBatchProgress) {
    if (!state.activeProgressCustomer) { return; }
    if (!state.activeProgressIsPending) { showToast("已完成状态不支持更新进度", "warning"); return; }
  }
  resetProgressEditor();
  if (els.progressModalCustomerName) {
    if (state.isBatchProgress) {
      var ids = [...state.boardSelected];
      var names = ids.map(function (id) {
        var r = warningStore.find(function (w) { return w.id === id; });
        return r ? r.customer : "";
      }).filter(Boolean);
      els.progressModalCustomerName.textContent = "— 批量 (" + names.length + "个: " + names.slice(0, 3).join(", ") + (names.length > 3 ? "…" : "") + ")";
    } else {
      els.progressModalCustomerName.textContent = "— " + state.activeProgressCustomer;
    }
  }
  els.progressModal.hidden = false;
}

function closeProgressModal() {
  if (!els.progressModal) { return; }
  els.progressModal.hidden = true;
}

// ── Remark Modal ──

function deleteProgressEntry(entryId) {
  var index = progressStore.findIndex(function (entry) { return entry.id === entryId; });
  if (index === -1) { return; }
  progressStore.splice(index, 1);
  persistProgressStore();
  renderProgress();
  showToast("进度记录已删除", "info");
}

function getRole() {
  return roleOptions.find((role) => role.value === state.role) || roleOptions[0];
}

function getRoleScopedWarnings() {
  const role = getRole();
  return warningStore.filter((record) => role.isAdmin || record.salesperson === role.value);
}

function loadCustomerStatusRules() {
  try {
    const saved = JSON.parse(localStorage.getItem("cycle-warning-status-rules") || "{}");
    const pauseMinDays = Number(saved.pauseMinDays);
    const terminateMinDays = Number(saved.terminateMinDays);
    const lowVolumeThreshold = Number(saved.lowVolumeThreshold);
    if (
      Number.isFinite(pauseMinDays) &&
      Number.isFinite(terminateMinDays) &&
      pauseMinDays >= 0 &&
      terminateMinDays > pauseMinDays
    ) {
      return {
        pauseMinDays: Math.floor(pauseMinDays),
        terminateMinDays: Math.floor(terminateMinDays),
        lowVolumeThreshold: Number.isFinite(lowVolumeThreshold) && lowVolumeThreshold >= 0
          ? Math.floor(lowVolumeThreshold)
          : customerStatusRuleDefaults.lowVolumeThreshold
      };
    }
  } catch (_error) {
    // Ignore invalid local configuration and fall back to defaults.
  }
  return { ...customerStatusRuleDefaults };
}

function persistCustomerStatusRules() {
  localStorage.setItem("cycle-warning-status-rules", JSON.stringify(customerStatusRules));
}

function normalizeCustomerStatus(status) {
  return status === "不再合作" ? "终止合作" : (status || "合作中");
}

function getRecordUnreportedDays(record) {
  return getUnreportedDayCount(record, getLatestPreorderTime(record.latestByWarehouse));
}

function getCustomerStatusByDays(unreportedDays) {
  if (unreportedDays !== "" && Number(unreportedDays) >= customerStatusRules.terminateMinDays) {
    return "终止合作";
  }
  if (unreportedDays !== "" && Number(unreportedDays) >= customerStatusRules.pauseMinDays) {
    return "暂停合作";
  }
  return "合作中";
}

function getRecordCustomerStatus(record) {
  return getCustomerStatusByDays(getRecordUnreportedDays(record));
}

function sortBoardRows(records) {
  return records.slice().sort((a, b) => {
    const aInactive = getRecordCustomerStatus(a) === "终止合作" ? 1 : 0;
    const bInactive = getRecordCustomerStatus(b) === "终止合作" ? 1 : 0;
    if (aInactive !== bInactive) { return aInactive - bInactive; }
    const weekWeight = getUnreportedWeekSortValue(b) - getUnreportedWeekSortValue(a);
    if (weekWeight) { return weekWeight; }
    return a.customer.localeCompare(b.customer, "zh-Hans-CN");
  });
}

function getBoardBaseRows() {
  return getRoleScopedWarnings()
    .filter((record) => record.status !== "overdue")
    .filter((record) => !state.boardCustomerFilter || record.customer === state.boardCustomerFilter)
    .filter((record) => !state.boardSalespersonFilter || record.salesperson === state.boardSalespersonFilter)
    .filter((record) => !state.boardCustomerStatusFilter || getRecordCustomerStatus(record) === state.boardCustomerStatusFilter)
    .filter((record) => {
      const from = datetimeLocalToComparable(state.boardCodeCreateTimeFrom);
      const to = datetimeLocalToComparable(state.boardCodeCreateTimeTo);
      if (!from && !to) { return true; }
      const codeCreateTime = record.codeCreateTime || "";
      if (!codeCreateTime) { return false; }
      if (from && to) { return codeCreateTime >= from && codeCreateTime <= to; }
      if (from) { return codeCreateTime >= from; }
      return codeCreateTime <= to;
    })
    .filter((record) => {
      const from = datetimeLocalToComparable(state.boardLatestTimeFrom);
      const to = datetimeLocalToComparable(state.boardLatestTimeTo);
      if (!from && !to) { return true; }
      const latestTime = getLatestPreorderTime(record.latestByWarehouse);
      if (from && to) { return latestTime >= from && latestTime <= to; }
      if (from) { return latestTime >= from; }
      return latestTime <= to;
    })
    .filter((record) => {
      if (!state.boardLatestWarehouseFilter.length) { return true; }
      const latestWarehouses = getLatestPreorderWarehouses(record.latestByWarehouse);
      return state.boardLatestWarehouseFilter.some((warehouse) => latestWarehouses.includes(warehouse));
    })
    .filter((record) => {
      const from = state.boardUnreportedDaysFrom === "" ? "" : Number(state.boardUnreportedDaysFrom);
      const to = state.boardUnreportedDaysTo === "" ? "" : Number(state.boardUnreportedDaysTo);
      if (from === "" && to === "") { return true; }
      const latestTime = getLatestPreorderTime(record.latestByWarehouse);
      const unreportedDays = getUnreportedDayCount(record, latestTime);
      if (unreportedDays === "") { return false; }
      const value = Number(unreportedDays);
      if (from !== "" && value < from) { return false; }
      if (to !== "" && value > to) { return false; }
      return true;
    });
}

function getBoardRows() {
  return sortBoardRows(
    getBoardBaseRows().filter((record) => !state.boardStatusTab || getRecordCustomerStatus(record) === state.boardStatusTab)
  );
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateTimeString(date, endOfDay) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} ${endOfDay ? "23:59:59" : "00:00:00"}`;
}

function getWeekShortLabel(date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function getDashboardWeekLimit() {
  if (state.dashboardWeekRange === "current") { return 1; }
  if (state.dashboardWeekRange === "4") { return 4; }
  if (state.dashboardWeekRange === "8") { return 8; }
  return Infinity;
}

function getDashboardWeekWindow() {
  const limit = getDashboardWeekLimit();
  if (!Number.isFinite(limit)) { return null; }
  const baseMonday = parseDateTime(auditWindow.weekStart);
  return {
    start: addDays(baseMonday, -(limit - 1) * 7),
    end: addDays(baseMonday, 6)
  };
}

function getWeeklyWarningTrend() {
  const baseMonday = parseDateTime(auditWindow.weekStart);
  const scopedCustomers = getDashboardScopedWarnings().map((record) => record.customer);
  const trend = Array.from({ length: 8 }, (_, index) => {
    const monday = addDays(baseMonday, (index - 7) * 7);
    const riskEnd = addDays(monday, 2);
    const startText = toDateTimeString(monday, false);
    const endText = toDateTimeString(riskEnd, true);
    const count = scopedCustomers.filter((customer) => {
      const hadHistory = rows.some((row) => row.customer === customer && parseDateTime(row.createdAt) <= parseDateTime(endText));
      if (!hadHistory) { return false; }
      return !rows.some((row) => (
        row.customer === customer &&
        warehouseOptions.includes(row.warehouse) &&
        row.status === "预报" &&
        isWithin(row.createdAt, startText, endText)
      ));
    }).length;

    return {
      label: getWeekShortLabel(monday),
      startText,
      endText,
      count
    };
  });
  const limit = getDashboardWeekLimit();
  return Number.isFinite(limit) ? trend.slice(-limit) : trend;
}

function getDashboardScopedWarnings() {
  return getRoleScopedWarnings()
    .filter((record) => record.status !== "overdue")
    .filter((record) => isDashboardWeekMatch(record.triggeredAt || ""));
}

function isDashboardWeekMatch(value) {
  const windowRange = getDashboardWeekWindow();
  if (!windowRange) { return true; }
  if (!value) { return false; }
  const time = parseDateTime(value);
  return time >= windowRange.start && time <= windowRange.end;
}

function getTopUnreportedCustomers() {
  return getDashboardScopedWarnings()
    .map((record) => {
      const latestTime = getLatestPreorderTime(record.latestByWarehouse);
      const weekCount = getUnreportedWeekCount(latestTime, record.triggeredAt);
      return {
        customer: record.customer,
        weekText: String(weekCount),
        sortValue: weekCount
      };
    })
    .sort((a, b) => b.sortValue - a.sortValue || a.customer.localeCompare(b.customer, "zh-Hans-CN"))
    .slice(0, 10);
}

function drawWeeklyLineChart(items) {
  const canvas = els.weeklyWarningLineChart;
  if (!canvas) { return; }
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width || canvas.parentElement.clientWidth || 680));
  const height = Math.max(240, Math.floor(rect.height || 300));
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const padding = { top: 22, right: 18, bottom: 34, left: 42 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(1, ...items.map((item) => item.count));
  const stepX = plotWidth / Math.max(1, items.length - 1);

  ctx.strokeStyle = "#dbe4ef";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#6c7e94";
  ctx.font = "12px Microsoft YaHei, Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (plotHeight * i / 4);
    const value = Math.round(maxValue - (maxValue * i / 4));
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(String(value), padding.left - 8, y);
  }

  const points = items.map((item, index) => ({
    x: padding.left + index * stepX,
    y: padding.top + plotHeight - (item.count / maxValue) * plotHeight,
    ...item
  }));

  ctx.strokeStyle = "#0b7cff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  points.forEach((point) => {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0b7cff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#08233e";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(String(point.count), point.x, point.y - 8);
    ctx.fillStyle = "#6c7e94";
    ctx.textBaseline = "top";
    ctx.fillText(point.label, point.x, height - padding.bottom + 12);
  });
}

function renderTopUnreportedBars(items) {
  if (!els.topUnreportedBarChart) { return; }
  const maxValue = Math.max(1, ...items.map((item) => item.sortValue));
  els.topUnreportedBarChart.innerHTML = items.map((item) => {
    const width = Math.max(8, Math.round((item.sortValue / maxValue) * 100));
    return `
      <div class="bar-chart-row" title="${escapeHtml(item.customer)} ${escapeHtml(item.weekText)}">
        <span class="bar-chart-name">${escapeHtml(item.customer)}</span>
        <span class="bar-chart-track"><span class="bar-chart-fill" style="width:${width}%"></span></span>
        <span class="bar-chart-value">${escapeHtml(item.weekText)}</span>
      </div>
    `;
  }).join("");
}

function renderWarningDashboard() {
  const trend = getWeeklyWarningTrend();
  const topCustomers = getTopUnreportedCustomers();
  const currentWeek = trend[trend.length - 1];
  if (els.weeklyWarningTotal) {
    els.weeklyWarningTotal.textContent = currentWeek ? currentWeek.count : 0;
  }
  if (els.topUnreportedMax) {
    els.topUnreportedMax.textContent = topCustomers[0]?.weekText || "0";
  }
  if (els.dashboardMeta) {
    els.dashboardMeta.textContent = `更新时间：${formatMinute(auditWindow.triggeredAt)}`;
  }
  drawWeeklyLineChart(trend);
  renderTopUnreportedBars(topCustomers);
}

function applyDashboardSearch() {
  state.dashboardWeekRange = els.dashboardWeekRangeSelect ? els.dashboardWeekRangeSelect.value : "8";
  renderWarningDashboard();
}

function resetDashboardFilters() {
  state.dashboardWeekRange = "8";
  if (els.dashboardWeekRangeSelect) { els.dashboardWeekRangeSelect.value = state.dashboardWeekRange; }
  renderWarningDashboard();
}

function renderBoard() {
  const visibleRows = getBoardRows();

  els.alertBody.innerHTML = visibleRows
    .map((record) => {
      const warehouseCells = warehouseOptions
        .map((warehouse) => {
          const time = getWarehouseDisplayTime(record, warehouse);
          const stockSplit = getWarehouseStockVolumeSplit(record.customer, warehouse);
          return `
            <td><span class="warehouse-time" title="${escapeHtml(time)}">${escapeHtml(formatWarehouseTime(time))}</span></td>
            <td>
              <div class="stock-volume-cell">
                <span>常规 ${escapeHtml(formatVolume(stockSplit.regular))}</span>
                <span>暂存 ${escapeHtml(formatVolume(stockSplit.temporary))}</span>
              </div>
            </td>
          `;
        })
        .join("");
      const latestPreorderTime = getLatestPreorderTime(record.latestByWarehouse);
      const latestPreorderWarehouse = getLatestPreorderWarehouse(record.latestByWarehouse);
      const unreportedDays = getUnreportedDayCount(record, latestPreorderTime);
      const customerStatus = getCustomerStatusByDays(unreportedDays);
      const stockVolume = getCustomerStockVolume(record.customer);
      const stockTotalVolume = stockVolume.regular + stockVolume.temporary;
      const stockVolumeClass = isLowVolume(stockTotalVolume) ? " stock-volume-low" : "";

      var isSelected = state.boardSelected.has(record.id);
      return `
        <tr data-customer="${escapeHtml(record.customer)}" data-id="${escapeHtml(record.id)}" class="${isSelected ? "board-selected" : ""}">
          <td><input class="board-row-check" type="checkbox" data-id="${escapeHtml(record.id)}" ${isSelected ? "checked" : ""} /></td>
          <td><strong>${escapeHtml(record.customer)}</strong></td>
          <td>${escapeHtml(record.customerCode || getCustomerCode(record.customer))}</td>
          <td>${escapeHtml(record.salesperson)}</td>
          <td>
            <div class="stock-volume-cell total-stock-volume-cell${stockVolumeClass}" title="总计 ${escapeHtml(formatVolume(stockTotalVolume))}">
              <span>常规 ${escapeHtml(formatVolume(stockVolume.regular))}</span>
              <span>暂存 ${escapeHtml(formatVolume(stockVolume.temporary))}</span>
              <span>总计 ${escapeHtml(formatVolume(stockTotalVolume))}</span>
            </div>
          </td>
          <td><span class="customer-status-badge ${customerStatus === "暂停合作" ? "paused" : ""} ${customerStatus === "终止合作" ? "inactive" : ""}">${escapeHtml(customerStatus)}</span></td>
          <td><span class="warehouse-time ${record.codeCreateTime ? "" : "empty"}">${escapeHtml(formatWarehouseTime(record.codeCreateTime))}</span></td>
          <td><span class="warehouse-time ${latestPreorderTime ? "" : "empty"}" title="${escapeHtml(latestPreorderTime || "无预报")}">${escapeHtml(formatWarehouseTime(latestPreorderTime))}</span></td>
          <td><span class="warehouse-time ${latestPreorderWarehouse ? "" : "empty"}" title="${escapeHtml(latestPreorderWarehouse || "无预报")}">${escapeHtml(latestPreorderWarehouse || "--")}</span></td>
          <td><span class="warehouse-time ${unreportedDays === "" ? "empty" : ""}">${escapeHtml(unreportedDays === "" ? "--" : String(unreportedDays))}</span></td>
          ${warehouseCells}
        </tr>
      `;
    })
    .join("");

  els.overviewEmptyState.hidden = visibleRows.length > 0;
  renderBoardStatusTabs();
  updateBoardSelectAll(visibleRows);
  updateBoardListToolbar();
}

function renderBoardStatusTabs() {
  const baseRows = getBoardBaseRows();
  const counts = baseRows.reduce((map, record) => {
    const status = getRecordCustomerStatus(record);
    map[status] = (map[status] || 0) + 1;
    return map;
  }, {});

  els.boardStatusTabs.forEach((tab) => {
    const status = tab.dataset.status || "";
    const label = tab.dataset.label || tab.textContent.replace(/\(\d+\)$/, "");
    const count = status ? (counts[status] || 0) : baseRows.length;
    tab.dataset.label = label;
    tab.textContent = `${label}(${count})`;
    tab.classList.toggle("active", status === state.boardStatusTab);
  });
}

function getSelectedValues(selectEl) {
  if (!selectEl) { return []; }
  return Array.from(selectEl.selectedOptions).map((option) => option.value).filter(Boolean);
}

function clearSelectedValues(selectEl) {
  if (!selectEl) { return; }
  Array.from(selectEl.options).forEach((option) => {
    option.selected = false;
  });
}

function getSelectedLatestWarehouses() {
  if (!els.latestWarehouseDrop) { return []; }
  return Array.from(els.latestWarehouseDrop.querySelectorAll(".multi-select-check:checked"))
    .map((input) => input.value)
    .filter(Boolean);
}

function syncLatestWarehouseBox() {
  if (!els.latestWarehouseDisplay || !els.latestWarehouseBox) { return; }
  const selected = getSelectedLatestWarehouses();
  if (!selected.length) {
    els.latestWarehouseDisplay.value = "";
    els.latestWarehouseBox.classList.remove("has-value");
    return;
  }
  els.latestWarehouseDisplay.value = selected.length === 1 ? selected[0] : `已选 ${selected.length} 项`;
  els.latestWarehouseBox.classList.add("has-value");
}

function clearLatestWarehouseSelection() {
  if (!els.latestWarehouseDrop) { return; }
  els.latestWarehouseDrop.querySelectorAll(".multi-select-check").forEach((input) => {
    input.checked = false;
  });
  syncLatestWarehouseBox();
}

function renderLatestWarehouseOptions() {
  if (!els.latestWarehouseDrop) { return; }
  els.latestWarehouseDrop.innerHTML = warehouseOptions
    .map((warehouse) => `
      <label class="multi-select-option">
        <input class="multi-select-check" type="checkbox" value="${escapeHtml(warehouse)}" />
        <span>${escapeHtml(warehouse)}</span>
      </label>
    `)
    .join("");
}

function resetBoardFilters() {
  state.boardCustomerFilter = "";
  state.boardSalespersonFilter = "";
  state.boardCustomerStatusFilter = "";
  state.boardStatusTab = "";
  state.boardCodeCreateTimeFrom = "";
  state.boardCodeCreateTimeTo = "";
  state.boardLatestTimeFrom = "";
  state.boardLatestTimeTo = "";
  state.boardLatestWarehouseFilter = [];
  state.boardUnreportedDaysFrom = "";
  state.boardUnreportedDaysTo = "";
  els.overviewCustomerSearch.value = "";
  els.overviewSalespersonSearch.value = "";
  els.overviewCustomerStatusSearch.value = "";
  els.overviewCodeCreateTimeFrom.value = "";
  els.overviewCodeCreateTimeTo.value = "";
  els.codeCreateTimeDisplay.value = "";
  els.codeCreateTimeBox.classList.remove("has-value");
  els.overviewLatestTimeFrom.value = "";
  els.overviewLatestTimeTo.value = "";
  els.latestTimeDisplay.value = "";
  els.latestTimeBox.classList.remove("has-value");
  clearLatestWarehouseSelection();
  els.overviewUnreportedDaysFrom.value = "";
  els.overviewUnreportedDaysTo.value = "";
  els.unreportedDaysDisplay.value = "";
  els.unreportedDaysBox.classList.remove("has-value");
  state.boardSelected.clear();
  renderBoard();
}

function drillToDetails(customer, warehouse = "") {
  openDetailsDrawer();
  state.activeProgressCustomer = customer;
  // 判断当前客户的预警状态
  var w = warningStore.find(function (r) { return r.customer === customer; });
  state.activeProgressIsPending = w ? w.status === "pending" : false;
  resetProgressEditor();
  renderProgress();
  els.customerInput.value = customer;
  setActiveWarehouseTab(warehouse);
  applySearch();
}

function applyIncomingFilter() {
  const params = new URLSearchParams(window.location.search);
  const incomingFilter = window.incoming_filter || {
    customer_name: params.get("customer_name") || "",
    warehouse_name: params.get("warehouse_name") || ""
  };
  const view = params.get("view");

  if (incomingFilter.customer_name || incomingFilter.warehouse_name) {
    drillToDetails(incomingFilter.customer_name || "", incomingFilter.warehouse_name || "");
    return;
  }

  if (view === "details") {
    switchTab("details");
  }
}

window.incoming_filter = window.incoming_filter || null;

function updateBoardSelectAll(visibleRows) {
  if (!els.boardSelectAll) { return; }
  const visibleIds = visibleRows.map((r) => r.id);
  const checkedCount = visibleIds.filter((id) => state.boardSelected.has(id)).length;
  els.boardSelectAll.checked = visibleIds.length > 0 && checkedCount === visibleIds.length;
  els.boardSelectAll.indeterminate = checkedCount > 0 && checkedCount < visibleIds.length;
}

// ── Range picker helpers ──

function datetimeLocalToComparable(value) {
  return value ? value.replace("T", " ") : "";
}

function comparableToDisplay(value) {
  // "2026-06-14 23:07" → "2026-06-14 23:07"
  return value;
}

function syncRangeBox(displayEl, boxEl, fromEl, toEl) {
  const from = fromEl ? fromEl.value : "";
  const to = toEl ? toEl.value : "";
  const fromText = datetimeLocalToComparable(from);
  const toText = datetimeLocalToComparable(to);
  if (from && to) {
    displayEl.value = `${fromText}  —  ${toText}`;
    boxEl.classList.add("has-value");
  } else if (from) {
    displayEl.value = `${fromText} 起`;
    boxEl.classList.add("has-value");
  } else if (to) {
    displayEl.value = `截至 ${toText}`;
    boxEl.classList.add("has-value");
  } else {
    displayEl.value = "";
    boxEl.classList.remove("has-value");
  }
}

function syncNumberRangeBox(displayEl, boxEl, fromEl, toEl) {
  const from = fromEl ? fromEl.value : "";
  const to = toEl ? toEl.value : "";
  if (from && to) {
    displayEl.value = `${from}  —  ${to}`;
    boxEl.classList.add("has-value");
  } else if (from) {
    displayEl.value = `${from} 起`;
    boxEl.classList.add("has-value");
  } else if (to) {
    displayEl.value = `截至 ${to}`;
    boxEl.classList.add("has-value");
  } else {
    displayEl.value = "";
    boxEl.classList.remove("has-value");
  }
}

function clearRangeBox(boxEl, displayEl, fromEl, toEl, dropEl) {
  fromEl.value = "";
  toEl.value = "";
  displayEl.value = "";
  boxEl.classList.remove("has-value");
  dropEl.hidden = true;
}

function setupRangeBox(boxEl, displayEl, dropEl, fromEl, toEl, clearBtn, onChange) {
  // Toggle dropdown
  displayEl.addEventListener("click", (e) => {
    e.stopPropagation();
    dropEl.hidden = !dropEl.hidden;
  });

  // Apply filter on date change
  [fromEl, toEl].forEach((input) => {
    input.addEventListener("change", () => {
      syncRangeBox(displayEl, boxEl, fromEl, toEl);
      if (onChange) {
        onChange();
      } else {
        renderBoard();
      }
    });
  });

  // Clear
  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearRangeBox(boxEl, displayEl, fromEl, toEl, dropEl);
    if (onChange) {
      onChange();
    } else {
      renderBoard();
    }
  });
}

function updateBoardListToolbar() {
  if (els.boardListCsBtn) {
    els.boardListCsBtn.hidden = Boolean(state.boardStatusTab);
  }
  if (els.boardUpdateTime) {
    els.boardUpdateTime.textContent = "更新时间 " + formatRealtimeUpdateTime();
  }
}

function exportBoardCSV() {
  const visibleRows = getBoardRows();
  if (!visibleRows.length) { return; }

  const headerColumns = [
    "客户简称", "客户编码", "业务员", "当前在库总方数", "客户状态", "开户时间", "最近预报时间", "最近预报仓库", "未循环天数",
    ...warehouseOptions.flatMap((warehouse) => {
      const label = getWarehouseLabel(warehouse);
      return [`${label}最近预报时间`, `${label}在库常规方数`, `${label}在库暂存方数`];
    })
  ];

  const header = headerColumns.map(csvCell).join(",");
  const body = visibleRows.map((record) => {
    const latestPreorderTime = getLatestPreorderTime(record.latestByWarehouse);
    const latestPreorderWarehouse = getLatestPreorderWarehouse(record.latestByWarehouse);
    const unreportedDays = getUnreportedDayCount(record, latestPreorderTime);
    const stockVolume = getCustomerStockVolume(record.customer);
    const warehouseCells = warehouseOptions.flatMap((wh) => {
      const whSplit = getWarehouseStockVolumeSplit(record.customer, wh);
      return [
        csvCell(formatWarehouseTime(getWarehouseDisplayTime(record, wh))),
        csvCell(formatVolume(whSplit.regular)),
        csvCell(formatVolume(whSplit.temporary))
      ];
    });
    return [
      csvCell(record.customer),
      csvCell(record.customerCode || getCustomerCode(record.customer)),
      csvCell(record.salesperson),
      csvCell(formatVolume(stockVolume.regular + stockVolume.temporary)),
      csvCell(getCustomerStatusByDays(unreportedDays)),
      csvCell(formatWarehouseTime(record.codeCreateTime || "")),
      csvCell(formatWarehouseTime(latestPreorderTime)),
      csvCell(latestPreorderWarehouse || ""),
      csvCell(unreportedDays === "" ? "" : unreportedDays),
      ...warehouseCells
    ].join(",");
  });

  const blob = new Blob([`﻿${[header, ...body].join("\r\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getBoardExportFileName();
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function getBoardExportFileName() {
  const timestamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replaceAll("-", "")
    .replace("T", "_")
    .replaceAll(":", "");
  return `循环柜预警_${timestamp}.csv`;
}

function exportSelectedCSV() {
  const selectedRows = getFilteredRows().filter((row) => state.selected.has(row.containerNo));
  if (!selectedRows.length) { return; }

  const exportColumns = getExportColumns();
  const header = exportColumns.map((column) => csvCell(column.title)).join(",");
  const body = selectedRows.map((row, index) => {
    return exportColumns
      .map((column) => {
        const value = column.getValue ? column.getValue(row, index) : row[column.key];
        return csvCell(value);
      })
      .join(",");
  });

  const blob = new Blob([`﻿${[header, ...body].join("\r\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getExportFileName();
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function updateDetailsBatchUI() {
  const hasSelection = state.selected.size > 0;
  if (els.exportSelectedButton) {
    els.exportSelectedButton.hidden = !hasSelection;
  }
  if (els.clearSelectionButton) {
    els.clearSelectionButton.hidden = !hasSelection;
  }
}

function readFilters() {
  state.filters.customer = els.customerInput.value.trim().toLowerCase();
  state.filters.salesperson = els.salespersonInput.value.trim().toLowerCase();
  state.filters.orderType = els.orderTypeSelect ? els.orderTypeSelect.value : "";
  state.filters.status = els.statusSelect.value;
  state.filters.createdAt = els.createdAtInput.value.trim().toLowerCase();
  state.filters.carrierCode = els.carrierCodeInput.value.trim().toLowerCase();
  state.filters.warehouse = state.activeWarehouseTab;
}

function getFilteredRows(warehouseOverride = state.filters.warehouse) {
  const { customer, salesperson, orderType, status, createdAt, carrierCode } = state.filters;
  const warehouse = warehouseOverride;
  const role = getRole();

  return rows
    .filter((row) => role.isAdmin || row.salesperson === role.value)
    .filter((row) => {
      const customerMatch = !customer || row.customer.toLowerCase().includes(customer);
      const salespersonMatch = !salesperson || row.salesperson.toLowerCase().includes(salesperson);
      const orderTypeMatch = !orderType || row.orderType === orderType;
      const statusMatch = !status || row.status === status;
      const createdAtMatch = !createdAt || row.createdAt.toLowerCase().includes(createdAt);
      const carrierCodeMatch = !carrierCode || getCarrierCode(row).toLowerCase().includes(carrierCode);
      const warehouseMatch = !warehouse || row.warehouse === warehouse;

      return customerMatch && salespersonMatch && orderTypeMatch && statusMatch && createdAtMatch && carrierCodeMatch && warehouseMatch;
    })
    .sort((a, b) => {
      if (!state.sortKey || !state.sortDirection) {
        return parseDateTime(b.createdAt) - parseDateTime(a.createdAt);
      }

      const sortField = detailFieldMap.get(state.sortKey);
      const aValue = sortField?.sortValue ? sortField.sortValue(a) : a[state.sortKey];
      const bValue = sortField?.sortValue ? sortField.sortValue(b) : b[state.sortKey];
      const result = String(aValue ?? "").localeCompare(String(bValue ?? ""), "zh-Hans-CN");
      return state.sortDirection === "asc" ? result : -result;
    });
}

function linkCell(text) {
  const safeText = escapeHtml(text);
  return `<a href="#" title="${safeText}">${safeText}</a>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderDetailsHeader() {
  const visibleFields = getVisibleDetailFields();
  els.detailsTableHead.innerHTML = `
    <th class="col-index">#</th>
    <th class="col-check">
      <input id="selectAll" type="checkbox" aria-label="全选" />
    </th>
    ${visibleFields.map((field) => {
      const isSorted = state.sortKey === field.id;
      const sortClasses = ["sort-button"];
      if (isSorted && state.sortDirection === "asc") {
        sortClasses.push("asc");
      }
      if (isSorted && state.sortDirection === "desc") {
        sortClasses.push("desc");
      }

      const content = field.sortable
        ? `<button class="${sortClasses.join(" ")}" type="button" data-sort="${escapeHtml(field.id)}">${escapeHtml(field.title)} <span class="sort-mark" aria-hidden="true"></span></button>`
        : escapeHtml(field.title);
      return `<th style="width:${field.width}px">${content}</th>`;
    }).join("")}
  `;
  els.selectAll = document.querySelector("#selectAll");
}

function renderDetailsCell(field, row) {
  const rawValue = getDetailFieldValue(field, row);
  const content = field.render ? field.render(row) : escapeHtml(rawValue ?? "");
  const title = escapeHtml(rawValue ?? "");
  const className = field.className ? ` class="${field.className}"` : "";
  return `<td${className} style="width:${field.width}px" title="${title}">${content}</td>`;
}

function formatFileSize(bytes) {
  if (!bytes) { return "0 B"; }
  if (bytes < 1024) { return bytes + " B"; }
  if (bytes < 1048576) { return (bytes / 1024).toFixed(1) + " KB"; }
  return (bytes / 1048576).toFixed(2) + " MB";
}

let _toastTimer = 0;
function showToast(message, type) {
  if (!els.toast) { return; }
  clearTimeout(_toastTimer);
  els.toast.textContent = message;
  els.toast.className = "toast toast-" + (type || "success");
  els.toast.hidden = false;
  _toastTimer = setTimeout(function () {
    els.toast.hidden = true;
  }, 2800);
}

function renderTable() {
  const visibleRows = getFilteredRows();
  const visibleFields = getVisibleDetailFields();
  renderDetailsHeader();
  updateDetailsTableWidth(visibleFields);
  els.tableBody.innerHTML = visibleRows
    .map((row, index) => {
      const selected = state.selected.has(row.containerNo);
      return `
        <tr class="${selected ? "is-selected" : ""}">
          <td>${index + 1}</td>
          <td><input class="row-check" type="checkbox" data-id="${escapeHtml(row.containerNo)}" ${selected ? "checked" : ""} aria-label="选择第 ${index + 1} 行" /></td>
          ${visibleFields.map((field) => renderDetailsCell(field, row)).join("")}
        </tr>
      `;
    })
    .join("");

  els.resultSummary.textContent = `共 ${visibleRows.length} 条`;
  els.selectionInfo.textContent = `已选 ${state.selected.size} 条`;
  els.emptyState.hidden = visibleRows.length > 0;
  updateSelectAll(visibleRows);
  updateDetailsBatchUI();
  renderWarehouseTabs();
}

function renderWarehouseTabs() {
  els.warehouseTabs.forEach((tab) => {
    const warehouse = tab.dataset.warehouse || "";
    const label = tab.dataset.label || tab.textContent.replace(/\(\d+\)$/, "").trim();
    const count = getFilteredRows(warehouse).length;
    tab.dataset.label = label;
    tab.textContent = `${label}(${count})`;
    tab.classList.toggle("active", warehouse === state.activeWarehouseTab);
  });
}

function setupNumberRangeBox(boxEl, displayEl, dropEl, fromEl, toEl, clearBtn, onChange) {
  displayEl.addEventListener("click", (e) => {
    e.stopPropagation();
    dropEl.hidden = !dropEl.hidden;
  });

  [fromEl, toEl].forEach((input) => {
    input.addEventListener("change", () => {
      syncNumberRangeBox(displayEl, boxEl, fromEl, toEl);
      if (onChange) {
        onChange();
      } else {
        renderBoard();
      }
    });
  });

  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearRangeBox(boxEl, displayEl, fromEl, toEl, dropEl);
    if (onChange) {
      onChange();
    } else {
      renderBoard();
    }
  });
}

function updateDetailsTableWidth(visibleFields) {
  const baseWidth = 94;
  const fieldsWidth = visibleFields.reduce((sum, field) => sum + field.width, 0);
  els.detailsTable.style.width = `${Math.max(760, baseWidth + fieldsWidth)}px`;
}

function updateSelectAll(visibleRows) {
  const visibleIds = visibleRows.map((row) => row.containerNo);
  const checkedCount = visibleIds.filter((id) => state.selected.has(id)).length;
  els.selectAll.checked = visibleIds.length > 0 && checkedCount === visibleIds.length;
  els.selectAll.indeterminate = checkedCount > 0 && checkedCount < visibleIds.length;
}

function applySearch() {
  readFilters();
  renderTable();
}

function resetDetailFieldState() {
  state.visibleDetailFields = detailFieldDefaults.map((field) => ({
    id: field.id,
    visible: true
  }));
}

function openFieldSettings() {
  state.fieldSettingsDraft = state.visibleDetailFields.map((field) => ({ ...field }));
  renderFieldSettings();
  els.fieldSettingsMask.hidden = false;
  els.fieldSettingsDrawer.hidden = false;
}

function closeFieldSettings() {
  els.fieldSettingsMask.hidden = true;
  els.fieldSettingsDrawer.hidden = true;
}

function renderFieldSettings() {
  els.fieldSettingsBody.innerHTML = state.fieldSettingsDraft
    .map((fieldState, index) => {
      const field = detailFieldMap.get(fieldState.id);
      if (!field) {
        return "";
      }

      return `
        <tr data-id="${escapeHtml(field.id)}">
          <td>${index + 1}</td>
          <td>${escapeHtml(field.title)}</td>
          <td>
            <input class="field-visible-check" type="checkbox" ${fieldState.visible ? "checked" : ""} aria-label="显示 ${escapeHtml(field.title)}" />
          </td>
          <td>
            <div class="field-order-actions">
              <button class="field-order-btn" type="button" data-action="up" ${index === 0 ? "disabled" : ""} aria-label="上移 ${escapeHtml(field.title)}">▲</button>
              <button class="field-order-btn" type="button" data-action="down" ${index === state.fieldSettingsDraft.length - 1 ? "disabled" : ""} aria-label="下移 ${escapeHtml(field.title)}">▼</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function moveFieldSetting(id, direction) {
  const currentIndex = state.fieldSettingsDraft.findIndex((field) => field.id === id);
  const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= state.fieldSettingsDraft.length) {
    return;
  }

  const nextDraft = state.fieldSettingsDraft.slice();
  const [item] = nextDraft.splice(currentIndex, 1);
  nextDraft.splice(nextIndex, 0, item);
  state.fieldSettingsDraft = nextDraft;
  renderFieldSettings();
}

function applyFieldSettings() {
  state.visibleDetailFields = state.fieldSettingsDraft.map((field) => ({ ...field }));
  if (state.sortKey && !state.visibleDetailFields.some((field) => field.id === state.sortKey && field.visible)) {
    state.sortKey = "";
    state.sortDirection = "";
  }
  closeFieldSettings();
  renderTable();
}

function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function getExportFileName() {
  const timestamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replaceAll("-", "")
    .replace("T", "_")
    .replaceAll(":", "");
  return `循环柜预警明细_${timestamp}.csv`;
}

function exportRows() {
  readFilters();
  const visibleRows = getFilteredRows();
  const exportColumns = getExportColumns();
  const header = exportColumns.map((column) => csvCell(column.title)).join(",");
  const body = visibleRows.map((row, index) => {
    return exportColumns
      .map((column) => {
        const value = column.getValue ? column.getValue(row, index) : row[column.key];
        return csvCell(value);
      })
      .join(",");
  });

  const blob = new Blob([`\ufeff${[header, ...body].join("\r\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getExportFileName();
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function resetSearch() {
  els.customerInput.value = "";
  els.salespersonInput.value = "";
  if (els.orderTypeSelect) {
    els.orderTypeSelect.value = "";
  }
  els.statusSelect.value = "";
  els.createdAtInput.value = "";
  els.carrierCodeInput.value = "";
  state.selected.clear();
  setActiveWarehouseTab("");
  applySearch();
}

function setActiveWarehouseTab(warehouse) {
  state.activeWarehouseTab = warehouse;
  els.warehouseTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.warehouse === warehouse);
  });
}

function switchTab(tabName) {
  document.querySelectorAll(".page-shell").forEach(function (panel) {
    panel.hidden = panel.id !== "tab-" + tabName;
  });
  els.tabButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  closeDetailsDrawer();

  if (tabName === "overview") {
    renderBoard();
  }
  if (tabName === "warning-dashboard") {
    renderWarningDashboard();
  }
}

function openDetailsDrawer() {
  const drawer = document.querySelector("#tab-details");
  drawer.hidden = false;
  document.body.classList.add("details-open");
}

function closeDetailsDrawer() {
  closeProgressModal();
  const drawer = document.querySelector("#tab-details");
  if (drawer) {
    drawer.hidden = true;
  }
  document.body.classList.remove("details-open");
  state.activeProgressCustomer = "";
  resetProgressEditor();
  renderProgress();
}

// ── 状态配置 Modal ──

function renderCustomerStatusConfigSummary() {
  if (!els.csConfigSummary) { return; }
  els.csConfigSummary.textContent =
    `合作中：未循环天数 < ${customerStatusRules.pauseMinDays} 天；` +
    `暂停合作：未循环天数 >= ${customerStatusRules.pauseMinDays} 天；` +
    `终止合作：未循环天数 >= ${customerStatusRules.terminateMinDays} 天；` +
    `低方数：在库方数 < ${customerStatusRules.lowVolumeThreshold} 方时标红`;
}

function openCustomerStatusConfigModal() {
  if (!els.csModal) { return; }
  if (els.csPauseDays) {
    els.csPauseDays.value = String(customerStatusRules.pauseMinDays);
  }
  if (els.csTerminateDays) {
    els.csTerminateDays.value = String(customerStatusRules.terminateMinDays);
  }
  if (els.csLowVolumeThreshold) {
    els.csLowVolumeThreshold.value = String(customerStatusRules.lowVolumeThreshold);
  }
  renderCustomerStatusConfigSummary();
  els.csModal.hidden = false;
}

function closeCustomerStatusConfigModal() {
  if (!els.csModal) { return; }
  els.csModal.hidden = true;
}

function confirmCustomerStatusConfig() {
  if (!els.csModal) { return; }
  var pauseMinDays = Number(els.csPauseDays ? els.csPauseDays.value : customerStatusRules.pauseMinDays);
  var terminateMinDays = Number(els.csTerminateDays ? els.csTerminateDays.value : customerStatusRules.terminateMinDays);
  var lowVolumeThreshold = Number(els.csLowVolumeThreshold ? els.csLowVolumeThreshold.value : customerStatusRules.lowVolumeThreshold);
  if (!Number.isFinite(pauseMinDays) || !Number.isFinite(terminateMinDays) || !Number.isFinite(lowVolumeThreshold)) {
    showToast("请输入有效配置值", "warning");
    return;
  }
  pauseMinDays = Math.floor(pauseMinDays);
  terminateMinDays = Math.floor(terminateMinDays);
  lowVolumeThreshold = Math.floor(lowVolumeThreshold);
  if (pauseMinDays < 0) {
    showToast("暂停合作天数不能小于 0", "warning");
    return;
  }
  if (lowVolumeThreshold < 0) {
    showToast("低方数预警阈值不能小于 0", "warning");
    return;
  }
  if (terminateMinDays <= pauseMinDays) {
    showToast("终止合作天数必须大于暂停合作天数", "warning");
    return;
  }

  customerStatusRules.pauseMinDays = pauseMinDays;
  customerStatusRules.terminateMinDays = terminateMinDays;
  customerStatusRules.lowVolumeThreshold = lowVolumeThreshold;
  persistCustomerStatusRules();
  showToast("状态配置已保存", "success");
  closeCustomerStatusConfigModal();
  renderBoard();
}

function bindEvents() {
  els.tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!btn.dataset.tab) {
        return;
      }

      switchTab(btn.dataset.tab);
    });
  });

  els.boardStatusTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      state.boardStatusTab = tab.dataset.status || "";
      state.boardSelected.clear();
      renderBoard();
    });
  });

  if (els.boardSelectAll) {
    els.boardSelectAll.addEventListener("change", () => {
      const visibleRows = getBoardRows();
      visibleRows.forEach((record) => {
        if (els.boardSelectAll.checked) {
          state.boardSelected.add(record.id);
        } else {
          state.boardSelected.delete(record.id);
        }
      });
      renderBoard();
    });
  }

  function applyBoardSearch() {
    state.boardCustomerFilter = els.overviewCustomerSearch.value.trim();
    state.boardSalespersonFilter = els.overviewSalespersonSearch.value.trim();
    state.boardCustomerStatusFilter = els.overviewCustomerStatusSearch.value.trim();
    state.boardCodeCreateTimeFrom = els.overviewCodeCreateTimeFrom.value;
    state.boardCodeCreateTimeTo = els.overviewCodeCreateTimeTo.value;
    state.boardLatestTimeFrom = els.overviewLatestTimeFrom.value;
    state.boardLatestTimeTo = els.overviewLatestTimeTo.value;
    state.boardLatestWarehouseFilter = getSelectedLatestWarehouses();
    state.boardUnreportedDaysFrom = els.overviewUnreportedDaysFrom.value;
    state.boardUnreportedDaysTo = els.overviewUnreportedDaysTo.value;
    syncRangeBox(els.codeCreateTimeDisplay, els.codeCreateTimeBox, els.overviewCodeCreateTimeFrom, els.overviewCodeCreateTimeTo);
    syncRangeBox(els.latestTimeDisplay, els.latestTimeBox, els.overviewLatestTimeFrom, els.overviewLatestTimeTo);
    syncNumberRangeBox(els.unreportedDaysDisplay, els.unreportedDaysBox, els.overviewUnreportedDaysFrom, els.overviewUnreportedDaysTo);
    renderBoard();
  }

  els.boardSearchButton.addEventListener("click", applyBoardSearch);

  els.resetBoardButton.addEventListener("click", resetBoardFilters);

  // ── Range picker events ──

  setupRangeBox(els.codeCreateTimeBox, els.codeCreateTimeDisplay, els.codeCreateTimeBox.querySelector(".range-drop"), els.overviewCodeCreateTimeFrom, els.overviewCodeCreateTimeTo, els.codeCreateTimeClear, applyBoardSearch);
  setupRangeBox(els.latestTimeBox, els.latestTimeDisplay, els.latestTimeBox.querySelector(".range-drop"), els.overviewLatestTimeFrom, els.overviewLatestTimeTo, els.latestTimeClear, applyBoardSearch);
  setupNumberRangeBox(els.unreportedDaysBox, els.unreportedDaysDisplay, els.unreportedDaysBox.querySelector(".range-drop"), els.overviewUnreportedDaysFrom, els.overviewUnreportedDaysTo, els.unreportedDaysClear, applyBoardSearch);
  if (els.latestWarehouseBox && els.latestWarehouseDisplay && els.latestWarehouseDrop) {
    els.latestWarehouseDisplay.addEventListener("click", (event) => {
      event.stopPropagation();
      els.latestWarehouseDrop.hidden = !els.latestWarehouseDrop.hidden;
    });
    els.latestWarehouseDrop.addEventListener("change", (event) => {
      if (!event.target.matches(".multi-select-check")) { return; }
      syncLatestWarehouseBox();
      applyBoardSearch();
    });
  }
  if (els.latestWarehouseClear) {
    els.latestWarehouseClear.addEventListener("click", (event) => {
      event.stopPropagation();
      clearLatestWarehouseSelection();
      if (els.latestWarehouseDrop) { els.latestWarehouseDrop.hidden = true; }
      applyBoardSearch();
    });
  }

  // Click outside to dismiss dropdowns
  document.addEventListener("click", (event) => {
    [els.codeCreateTimeBox, els.latestTimeBox, els.latestWarehouseBox, els.unreportedDaysBox].forEach((box) => {
      if (!box) { return; }
      if (!box.contains(event.target)) {
        var drop = box.querySelector(".range-drop");
        if (drop) { drop.hidden = true; }
      }
    });
  });

  els.alertBody.addEventListener("dblclick", (event) => {
    if (event.target.closest("input[type=checkbox]")) {
      return;
    }

    const row = event.target.closest("tr[data-customer]");
    if (!row) {
      return;
    }

    drillToDetails(row.dataset.customer);
  });

  els.alertBody.addEventListener("click", (event) => {
    var badge = event.target.closest(".customer-status-badge");
    if (!badge) { return; }
    var row = badge.closest("tr[data-customer]");
    if (!row) { return; }
    if (!state.boardStatusTab) {
      openCustomerStatusConfigModal();
    }
  });

  els.alertBody.addEventListener("change", (event) => {
    if (!event.target.matches(".board-row-check")) {
      return;
    }
    const id = event.target.dataset.id;
    if (event.target.checked) {
      state.boardSelected.add(id);
    } else {
      state.boardSelected.delete(id);
    }
    renderBoard();
  });

  els.backButton.addEventListener("click", closeDetailsDrawer);
  els.searchButton.addEventListener("click", applySearch);
  els.resetButton.addEventListener("click", resetSearch);
  els.exportButton.addEventListener("click", exportRows);
  els.fieldSettingsButton.addEventListener("click", openFieldSettings);
  els.fieldSettingsClose.addEventListener("click", closeFieldSettings);
  els.fieldSettingsCancel.addEventListener("click", closeFieldSettings);
  els.fieldSettingsMask.addEventListener("click", closeFieldSettings);
  els.fieldSettingsApply.addEventListener("click", applyFieldSettings);

  // ── 状态配置 Modal 事件 ──
  if (els.csConfirmBtn) {
    els.csConfirmBtn.addEventListener("click", confirmCustomerStatusConfig);
  }
  if (els.csCancelBtn) {
    els.csCancelBtn.addEventListener("click", closeCustomerStatusConfigModal);
  }
  if (els.csModalClose) {
    els.csModalClose.addEventListener("click", closeCustomerStatusConfigModal);
  }
  if (els.csModal) {
    els.csModal.addEventListener("click", function (event) {
      if (event.target === els.csModal) {
        closeCustomerStatusConfigModal();
      }
    });
  }
  els.fieldSettingsBody.addEventListener("change", (event) => {
    if (!event.target.matches(".field-visible-check")) {
      return;
    }

    const row = event.target.closest("tr");
    const fieldState = state.fieldSettingsDraft.find((field) => field.id === row.dataset.id);
    if (fieldState) {
      fieldState.visible = event.target.checked;
    }
  });

  els.fieldSettingsBody.addEventListener("click", (event) => {
    const button = event.target.closest(".field-order-btn");
    if (!button) {
      return;
    }

    const row = button.closest("tr");
    moveFieldSetting(row.dataset.id, button.dataset.action);
  });

  if (els.exportSelectedButton) {
    els.exportSelectedButton.addEventListener("click", exportSelectedCSV);
  }

  if (els.clearSelectionButton) {
    els.clearSelectionButton.addEventListener("click", () => {
      state.selected.clear();
      renderTable();
    });
  }

  if (els.progressAttachment) {
    els.progressAttachment.addEventListener("change", updateProgressAttachmentName);
  }

  if (els.progressUpdateBtn) {
    els.progressUpdateBtn.addEventListener("click", openProgressModal);
  }

  if (els.progressConfirmBtn) {
    els.progressConfirmBtn.addEventListener("click", submitProgress);
  }

  if (els.progressCancelBtn) {
    els.progressCancelBtn.addEventListener("click", closeProgressModal);
  }

  if (els.progressList) {
    els.progressList.addEventListener("click", function (event) {
      var deleteBtn = event.target.closest(".progress-delete-btn");
      if (deleteBtn) {
        deleteProgressEntry(deleteBtn.dataset.id);
        return;
      }
      var editBtn = event.target.closest(".progress-edit-btn");
      if (editBtn) {
        editProgressEntry(editBtn.dataset.id);
        return;
      }
    });
  }

  if (els.progressModalClose) {
    els.progressModalClose.addEventListener("click", closeProgressModal);
  }

  if (els.progressModal) {
    els.progressModal.addEventListener("click", function (event) {
      if (event.target === els.progressModal) {
        closeProgressModal();
      }
    });
  }

  // 编辑模式下删除已有附件
  if (els.progressEditAttachments) {
    els.progressEditAttachments.addEventListener("click", function (event) {
      var delBtn = event.target.closest(".progress-edit-attach-del");
      if (!delBtn) { return; }
      var index = parseInt(delBtn.dataset.index, 10);
      if (!isNaN(index)) {
        state.editingDeletedAttachments.push(index);
        var item = delBtn.closest(".progress-edit-attach-item");
        if (item) {
          item.style.display = "none";
        }
      }
    });
  }

  [els.customerInput, els.salespersonInput, els.createdAtInput, els.carrierCodeInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        applySearch();
      }
    });
  });

  [els.orderTypeSelect, els.statusSelect].filter(Boolean).forEach((select) => {
    select.addEventListener("change", applySearch);
  });

  els.tableBody.addEventListener("change", (event) => {
    if (!event.target.matches(".row-check")) {
      return;
    }

    const id = event.target.dataset.id;
    if (event.target.checked) {
      state.selected.add(id);
    } else {
      state.selected.delete(id);
    }

    renderTable();
  });

  els.warehouseTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveWarehouseTab(tab.dataset.warehouse);
      applySearch();
    });
  });

  els.detailsTableHead.addEventListener("click", (event) => {
    const button = event.target.closest(".sort-button");
    if (!button) {
      return;
    }

    const nextSortKey = button.dataset.sort;
    state.sortDirection = state.sortKey === nextSortKey && state.sortDirection === "desc" ? "asc" : "desc";
    state.sortKey = nextSortKey;
    renderTable();
  });

  els.detailsTableHead.addEventListener("change", (event) => {
    if (!event.target.matches("#selectAll")) {
      return;
    }

    getFilteredRows().forEach((row) => {
      if (els.selectAll.checked) {
        state.selected.add(row.containerNo);
      } else {
        state.selected.delete(row.containerNo);
      }
    });

    renderTable();
  });

  // ── Board list toolbar ──

  if (els.boardListExportBtn) {
    els.boardListExportBtn.addEventListener("click", exportBoardCSV);
  }

  if (els.boardListCsBtn) {
    els.boardListCsBtn.addEventListener("click", function () {
      openCustomerStatusConfigModal();
    });
  }


  if (els.dashboardSearchButton) {
    els.dashboardSearchButton.addEventListener("click", applyDashboardSearch);
  }

  if (els.dashboardWeekRangeSelect) {
    els.dashboardWeekRangeSelect.addEventListener("change", applyDashboardSearch);
  }

  if (els.dashboardResetButton) {
    els.dashboardResetButton.addEventListener("click", resetDashboardFilters);
  }

  window.addEventListener("resize", function () {
    if (document.querySelector("#tab-warning-dashboard") && !document.querySelector("#tab-warning-dashboard").hidden) {
      renderWarningDashboard();
    }
  });
}

function init() {
  resetDetailFieldState();
  fillSelect(els.overviewCustomerSearch, uniqueValues("customer"));
  fillSelect(els.overviewSalespersonSearch, uniqueValues("salesperson"));
  fillSelect(els.overviewCustomerStatusSearch, customerStatusOptions);
  renderLatestWarehouseOptions();
  if (els.overviewOperatorSearch) {
    fillSelect(els.overviewOperatorSearch, ["system"].concat(uniqueValues("salesperson")));
  }
  if (els.orderTypeSelect) {
    fillSelect(els.orderTypeSelect, uniqueValues("orderType"));
  }
  fillSelect(els.statusSelect, statusOptions);
  bindEvents();
  renderBoard();
  window.setInterval(updateBoardListToolbar, 1000);
  renderWarningDashboard();
  applySearch();
  applyIncomingFilter();
}

try {
  init();
} catch (e) {
  document.getElementById('alertBody') && (document.getElementById('alertBody').innerHTML = '<tr><td colspan="13" style="color:red;padding:20px;text-align:center;">初始化错误: ' + e.message + '</td></tr>');
}
