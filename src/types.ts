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
  remarks?: string;
  customerName?: string;
}

export interface SearchParams {
  keywords: string;
  groupCode: string;
  carrier: string;
}

export type SidebarTab = '单票' | '多票';
export type OrderType = '快捷下单' | 'excel导入下单' | '解析发票下单';
