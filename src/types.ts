export interface Waybill {
  id: string; // e.g. HD2606161063
  fbaCode: string; // e.g. FBA19G6M4C7B
  description: string; // e.g. 需要补充报关抬头
  createTime: string; // e.g. 2026-06-16 15:42:25
  pickupTime: string; // e.g. 2026-06-16 16:43:57
  groupCode: string; // e.g. USSZ202606160504
  carrier: string; // Service e.g. 海德运通
  zipCode: string; // e.g. 85043-2356
  station: string; // e.g. 深圳天图
  customerType: 'vip' | '基础价格' | '普通客户';
  status: '已收货' | '待揽收' | '转运中' | '异常件';
  packagesCount: number;
  country: string;
  orderWeek?: string;
  insurance: boolean;
  hasUploadedInvoice?: boolean;
  remarks?: string;
  customerName?: string;
  customerOrderNo?: string;
  consignee?: string;
  warehouseCode?: string;
  company?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  amazonReferenceId?: string;
  associatedNo?: string;
  delegatedPickup?: string;
  combinedDeclaration?: string;
  combinedClearance?: string;
  poNumber?: string;
  referenceNo1?: string;
  referenceNo2?: string;
  internalNote?: string;
  taxMethod?: string;
  clearanceMethod?: string;
  vatNo?: string;
  iossNo?: string;
  eori?: string;
  currency?: string;
  itemAttributes?: string[];
  buyInsurance?: boolean;
  domesticInspection?: boolean;
  customsDeclarationType?: string;
  tradeMode?: string;
}

export interface SearchParams {
  keywords: string;
  groupCode: string;
  carrier: string;
  tradeMode: string;
}

export type SidebarTab = '单票' | '多票';
export type OrderType = '快捷下单' | 'excel导入下单' | '解析发票下单';

// ─── Trade Mode Rule Config Types ──────────────────────────────────────────────
export interface TradeModeRule {
  id: number;
  ruleName: string;
  isAllStation: boolean;      // 是否适用全部货站
  isAllService: boolean;      // 是否适用全部服务
  isRequired: boolean;         // 贸易方式是否必填
  status: boolean;             // true:启用 false:禁用
  stationCodes: string[];      // 关联的货站编码列表 (isAllStation=false时有效)
  serviceCodes: string[];      // 关联的服务编码列表 (isAllService=false时有效)
  createTime: string;
  updateTime: string;
}

export interface StationOption {
  code: string;
  name: string;
}

export interface ServiceOption {
  code: string;
  name: string;
}

// Predefined station options matching existing waybill stations
export const STATION_OPTIONS: StationOption[] = [
  { code: 'sz_tiantu', name: '深圳天图货站' },
  { code: 'shanghai_distribution', name: '上海分拨货站' },
  { code: 'tangxia', name: '塘厦仓' },
  { code: 'dongguan_tangxia', name: '东莞塘厦分中心' },
  { code: 'yiwu_transfer', name: '义乌中转营地' },
];

// Predefined service options matching existing carriers
export const SERVICE_OPTIONS: ServiceOption[] = [
  { code: 'us_21day', name: '美国21日达' },
  { code: 'haide_express', name: '海德运通' },
  { code: 'matson_vip', name: '美森尊卡限时达' },
  { code: 'changrun_air', name: '常润空快3日卡' },
  { code: 'lcl_direct', name: '卡派高派拼箱' },
  { code: 'sz_tiantu_sea', name: '深圳天图海派专线' },
];

export interface TradeModeCheckRequest {
  stationCode: string;
  serviceCode: string;
}

export interface TradeModeCheckResponse {
  isRequired: boolean;
  matchedRuleName?: string;
}
