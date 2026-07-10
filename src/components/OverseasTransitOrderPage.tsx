import React, { useEffect, useState } from 'react';
import {
  FileText,
  Search,
  X,
} from 'lucide-react';
import {
  emptyAddressForm,
  overseasOrderTypes,
  overseasWarehouseCodes,
  warehouseAddressBook,
} from './overseasTransitAddress';
import type { AddressFormState } from './overseasTransitAddress';

interface OverseasTransitOrderPageProps {
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  activeNode?: string;
  onNodeChange?: (node: string) => void;
}

interface OverseasTransitRow {
  id: string;
  fbaCode: string;
  customerName: string;
  destination: string;
  channel: string;
  childCreatedAt?: string;
  orderSeq?: number;
  transferNo?: string;
  latestRoute?: string;
  customerRemark?: string;
  overseasWarehouseRemark?: string;
  warehouseCode?: string;
  zipCode?: string;
  orderType?: string;
  salesman?: string;
  merchandiser?: string;
  status: string;
  packages: number;
  weight: string;
  volume: string;
  inboundTime: string;
}

interface TransitTransferRow {
  systemBoxNo: string;
  fbaBoxNo: string;
  carrierCompany: string;
  transferNo: string;
}

const overseasTransitNodes = ['待确认', '已确认', '已下单', '转运中', '签收', '取消'];
const orderFormStatuses = new Set(['待确认', '已确认']);

const seedTransitRows: OverseasTransitRow[] = [
  {
    id: 'YT2507100001',
    fbaCode: 'FBA19DNZH02MU000318',
    customerName: '深圳天图电子有限公司',
    destination: '美国',
    channel: '美森正班13日达-卡派包税',
    childCreatedAt: '2026-07-10 09:18',
    orderSeq: 1,
    transferNo: '1Z0VV966030991',
    latestRoute: '深圳仓-美国海外仓-OUT',
    customerRemark: '第一批出库箱2、箱3',
    overseasWarehouseRemark: '海外仓已预约尾程交接',
    warehouseCode: 'ONT8',
    zipCode: '92551',
    orderType: 'FBA',
    salesman: '安一',
    merchandiser: '安逸',
    status: '转运中',
    packages: 2,
    weight: '96.4kg',
    volume: '0.48',
    inboundTime: '2026-07-09 15:21',
  },
  {
    id: 'YT2507100001',
    fbaCode: 'FBA19DNZH02MU000319',
    customerName: '深圳天图电子有限公司',
    destination: '美国',
    channel: '美森正班13日达-卡派包税',
    childCreatedAt: '2026-07-10 14:36',
    orderSeq: 2,
    transferNo: '1Z0VV966030992',
    latestRoute: '深圳仓-美国海外仓-OUT',
    customerRemark: '第二批出库箱1、箱5',
    overseasWarehouseRemark: '海外仓等待贴标确认',
    warehouseCode: 'ONT8',
    zipCode: '92551',
    orderType: 'FBA',
    salesman: '安一',
    merchandiser: '安逸',
    status: '已下单',
    packages: 2,
    weight: '88.0kg',
    volume: '0.42',
    inboundTime: '2026-07-09 15:21',
  },
  {
    id: 'YT2507100001',
    fbaCode: 'FBA19DNZH02MU000320',
    customerName: '深圳天图电子有限公司',
    destination: '美国',
    channel: '美线海卡',
    childCreatedAt: '2026-07-11 10:05',
    orderSeq: 1,
    transferNo: '888711227145',
    latestRoute: '美国海外仓-OUT',
    customerRemark: '隔天补发箱4，序号重新从1开始',
    overseasWarehouseRemark: '海外仓已复核体积重',
    warehouseCode: 'PSC2',
    zipCode: '99301',
    orderType: 'Walmart',
    salesman: '安一',
    merchandiser: '李客服',
    status: '签收',
    packages: 1,
    weight: '45.3kg',
    volume: '0.24',
    inboundTime: '2026-07-09 15:21',
  },
  {
    id: 'YT2507100002',
    fbaCode: 'FBACTES1617',
    customerName: '博创跨境贸易',
    destination: '美国',
    channel: '美线海卡',
    childCreatedAt: '2026-07-10 11:05',
    orderSeq: 1,
    transferNo: '8851511973',
    latestRoute: '深圳仓-美国海外仓-OUT',
    customerRemark: '样品件请单独下单',
    overseasWarehouseRemark: '海外仓需单独分拣',
    warehouseCode: 'PSC2',
    zipCode: '99301',
    orderType: 'Walmart',
    salesman: '天朗',
    merchandiser: '李客服',
    status: '转运中',
    packages: 3,
    weight: '118.0kg',
    volume: '0.71',
    inboundTime: '2026-07-09 16:02',
  },
  {
    id: 'YT2507100002',
    fbaCode: 'FBACTEE1741',
    customerName: '博创跨境贸易',
    destination: '美国',
    channel: '美线海卡',
    childCreatedAt: '2026-07-10 16:42',
    orderSeq: 2,
    transferNo: '8851511974',
    latestRoute: '深圳仓-美国海外仓-OUT',
    customerRemark: '同日第二批出库',
    overseasWarehouseRemark: '尾程标签已打印',
    warehouseCode: 'PSC2',
    zipCode: '99301',
    orderType: 'Walmart',
    salesman: '天朗',
    merchandiser: '李客服',
    status: '已下单',
    packages: 4,
    weight: '154.8kg',
    volume: '0.82',
    inboundTime: '2026-07-09 16:02',
  },
  {
    id: 'YT2507100003',
    fbaCode: 'FBACTEST937',
    customerName: '星链家居出口部',
    destination: '美国',
    channel: '美森正班13日达-卡派包税',
    childCreatedAt: '2026-07-10 13:47',
    orderSeq: 1,
    transferNo: '1Z0VV966030993',
    latestRoute: '待海外仓确认出库窗口',
    customerRemark: '客户确认后再安排下单',
    overseasWarehouseRemark: '海外仓待确认收货窗口',
    warehouseCode: 'ABE2',
    zipCode: '18031',
    orderType: 'FBA',
    salesman: '天朗',
    merchandiser: '李客服',
    status: '待确认',
    packages: 5,
    weight: '159.4kg',
    volume: '0.92',
    inboundTime: '2026-07-10 08:47',
  },
  {
    id: 'YT2507100004',
    fbaCode: 'FBA18HL83QJ0',
    customerName: '上海豪迅美中快递中心',
    destination: '美国',
    channel: '美线海派',
    childCreatedAt: '2026-07-11 09:12',
    orderSeq: 1,
    transferNo: '885151176528',
    latestRoute: '深圳仓-美国海外仓-OUT',
    customerRemark: '私人地址请电话预约',
    overseasWarehouseRemark: '海外仓需核对收件电话',
    warehouseCode: 'FTW1',
    zipCode: '75241',
    orderType: '私人地址',
    salesman: '张运营',
    merchandiser: '安逸',
    status: '已确认',
    packages: 6,
    weight: '205.7kg',
    volume: '1.23',
    inboundTime: '2026-07-10 14:04',
  },
  {
    id: 'YT2507100005',
    fbaCode: 'FBA18HLGVVK6',
    customerName: '常晟供应链集团',
    destination: '美国',
    channel: '美森正班13日达-卡派包税',
    childCreatedAt: '2026-07-11 15:26',
    orderSeq: 1,
    transferNo: '1Z0VV966030994',
    latestRoute: '客户取消海外中转',
    customerRemark: '客户取消本次出库',
    overseasWarehouseRemark: '海外仓停止出库操作',
    warehouseCode: 'ONT8',
    zipCode: '92551',
    orderType: 'FBA',
    salesman: '安一',
    merchandiser: '李客服',
    status: '取消',
    packages: 4,
    weight: '126.4kg',
    volume: '0.68',
    inboundTime: '2026-07-10 18:16',
  },
  {
    id: 'YT2507120001',
    fbaCode: 'FBA19CANCEL8',
    customerName: '广州跨境供应链',
    destination: '美国',
    channel: '美线空派',
    childCreatedAt: '2026-07-12 10:22',
    orderSeq: 1,
    transferNo: 'AIR20260712001',
    latestRoute: '美国海外仓-OUT',
    customerRemark: '急件优先派送',
    overseasWarehouseRemark: '海外仓已出库',
    warehouseCode: 'LAX9',
    zipCode: '91710',
    orderType: 'TikTok',
    salesman: '张运营',
    merchandiser: '安逸',
    status: '转运中',
    packages: 2,
    weight: '62.0kg',
    volume: '0.35',
    inboundTime: '2026-07-11 20:10',
  },
  {
    id: 'YT2507120001',
    fbaCode: 'FBA19CANCEL9',
    customerName: '广州跨境供应链',
    destination: '美国',
    channel: '美线空派',
    childCreatedAt: '2026-07-12 17:55',
    orderSeq: 2,
    transferNo: 'AIR20260712002',
    latestRoute: '尾程待提取',
    customerRemark: '同日第二批急件',
    overseasWarehouseRemark: '海外仓已完成复核',
    warehouseCode: 'LAX9',
    zipCode: '91710',
    orderType: 'TikTok',
    salesman: '张运营',
    merchandiser: '安逸',
    status: '已下单',
    packages: 3,
    weight: '84.5kg',
    volume: '0.46',
    inboundTime: '2026-07-11 20:10',
  },
  {
    id: 'YT2507130001',
    fbaCode: 'FBA20WAIT001',
    customerName: '宁波启航跨境仓储',
    destination: '美国',
    channel: '美森正班13日达-卡派包税',
    childCreatedAt: '2026-07-13 09:08',
    orderSeq: 1,
    transferNo: 'WAIT20260713001',
    latestRoute: '待海外仓确认出库窗口',
    customerRemark: '第一批勾选箱2、箱6',
    overseasWarehouseRemark: '待确认尾程地址',
    warehouseCode: 'ONT8',
    zipCode: '92551',
    orderType: 'FBA',
    salesman: '安一',
    merchandiser: '安逸',
    status: '待确认',
    packages: 2,
    weight: '74.6kg',
    volume: '0.39',
    inboundTime: '2026-07-12 18:25',
  },
  {
    id: 'YT2507130001',
    fbaCode: 'FBA20WAIT002',
    customerName: '宁波启航跨境仓储',
    destination: '美国',
    channel: '美线海卡',
    childCreatedAt: '2026-07-13 15:40',
    orderSeq: 2,
    transferNo: 'WAIT20260713002',
    latestRoute: '待海外仓确认出库窗口',
    customerRemark: '同日第二批勾选箱1',
    overseasWarehouseRemark: '等待客户确认标签',
    warehouseCode: 'PSC2',
    zipCode: '99301',
    orderType: 'Walmart',
    salesman: '安一',
    merchandiser: '李客服',
    status: '待确认',
    packages: 1,
    weight: '31.8kg',
    volume: '0.18',
    inboundTime: '2026-07-12 18:25',
  },
  {
    id: 'YT2507130002',
    fbaCode: 'FBA20CONFIRM001',
    customerName: '杭州星越家居',
    destination: '美国',
    channel: '美线海派',
    childCreatedAt: '2026-07-13 11:20',
    orderSeq: 1,
    transferNo: 'CFM20260713001',
    latestRoute: '海外仓已确认，待下单',
    customerRemark: '需拆分私人地址派送',
    overseasWarehouseRemark: '地址资料已核对',
    warehouseCode: 'FTW1',
    zipCode: '75241',
    orderType: '私人地址',
    salesman: '张运营',
    merchandiser: '安逸',
    status: '已确认',
    packages: 3,
    weight: '102.4kg',
    volume: '0.57',
    inboundTime: '2026-07-12 19:10',
  },
  {
    id: 'YT2507130003',
    fbaCode: 'FBA20SIGN001',
    customerName: '厦门万和供应链',
    destination: '美国',
    channel: '美线空派',
    childCreatedAt: '2026-07-13 12:06',
    orderSeq: 1,
    transferNo: 'POD20260713001',
    latestRoute: '尾程已签收',
    customerRemark: '签收后回传 POD',
    overseasWarehouseRemark: 'POD 已回传客户',
    warehouseCode: 'LAX9',
    zipCode: '91710',
    orderType: 'TikTok',
    salesman: '天朗',
    merchandiser: '李客服',
    status: '签收',
    packages: 2,
    weight: '58.2kg',
    volume: '0.31',
    inboundTime: '2026-07-12 21:45',
  },
  {
    id: 'YT2507130004',
    fbaCode: 'FBA20CANCEL001',
    customerName: '苏州恒通跨境',
    destination: '美国',
    channel: '美森正班13日达-卡派包税',
    childCreatedAt: '2026-07-13 16:18',
    orderSeq: 1,
    transferNo: 'CXL20260713001',
    latestRoute: '客户取消海外中转',
    customerRemark: '客户取消该批箱子出库',
    overseasWarehouseRemark: '海外仓已终止操作',
    warehouseCode: 'ABE2',
    zipCode: '18031',
    orderType: 'FBA',
    salesman: '安一',
    merchandiser: '李客服',
    status: '取消',
    packages: 2,
    weight: '69.9kg',
    volume: '0.36',
    inboundTime: '2026-07-12 22:18',
  },
];

const makeMockTransitRow = (status: string, index: number): OverseasTransitRow => {
  const statusIndex = overseasTransitNodes.indexOf(status);
  const headNo = `YT2507${String(statusIndex + 20).padStart(2, '0')}${String(Math.floor(index / 3) + 1).padStart(4, '0')}`;
  const createdDay = 10 + (index % 4);
  const sequence = (index % 3) + 1;
  const carrierCode = status === '取消' ? 'CXL' : status === '签收' ? 'POD' : status === '转运中' ? 'TRN' : status === '已下单' ? 'ORD' : status === '已确认' ? 'CFM' : 'WAT';
  const warehouseCode = overseasWarehouseCodes[index % overseasWarehouseCodes.length];
  const warehouseAddress = warehouseAddressBook[warehouseCode];

  return {
    id: headNo,
    fbaCode: `FBA${String(statusIndex + 21).padStart(2, '0')}${String(index + 1).padStart(6, '0')}`,
    customerName: ['深圳天图电子有限公司', '博创跨境贸易', '宁波启航跨境仓储', '杭州星越家居', '厦门万和供应链'][index % 5],
    destination: '美国',
    channel: ['美森正班13日达-卡派包税', '美线海卡', '美线海派', '美线空派'][index % 4],
    childCreatedAt: `2026-07-${String(createdDay).padStart(2, '0')} ${String(9 + (index % 8)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
    orderSeq: sequence,
    transferNo: `${carrierCode}202607${String(createdDay).padStart(2, '0')}${String(index + 1).padStart(3, '0')}`,
    latestRoute: status === '取消' ? '客户取消海外中转' : status === '签收' ? '尾程已签收' : status === '待确认' ? '待海外仓确认出库窗口' : '深圳仓-美国海外仓-OUT',
    customerRemark: `mock-${status}-第${index + 1}批勾选货箱`,
    overseasWarehouseRemark: status === '取消' ? '海外仓已终止操作' : '海外仓按批次处理出库',
    warehouseCode,
    zipCode: warehouseAddress.zipCode,
    orderType: overseasOrderTypes[index % overseasOrderTypes.length],
    salesman: ['安一', '天朗', '张运营'][index % 3],
    merchandiser: ['安逸', '李客服'][index % 2],
    status,
    packages: 1 + (index % 6),
    weight: `${(42 + index * 8.6).toFixed(1)}kg`,
    volume: (0.22 + index * 0.07).toFixed(2),
    inboundTime: `2026-07-${String(createdDay - 1).padStart(2, '0')} 18:${String((index * 5) % 60).padStart(2, '0')}`,
  };
};

const transitRows: OverseasTransitRow[] = [
  ...seedTransitRows,
  ...overseasTransitNodes.flatMap((status) => {
    const existingCount = seedTransitRows.filter((row) => row.status === status).length;
    return Array.from({ length: Math.max(0, 10 - existingCount) }, (_, index) => makeMockTransitRow(status, existingCount + index));
  }),
];

const fieldClass =
  'h-8 w-full rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
const labelClass = 'w-28 shrink-0 text-right text-xs font-bold text-slate-900';
const required = <span className="text-red-500">* </span>;

type OrderSearchField = {
  label: string;
  type: 'input' | 'select';
  placeholder?: string;
  options?: string[];
};

const orderSearchControlClass = `${fieldClass} min-w-0 flex-1`;
const orderSearchLabelClass = 'w-32 shrink-0 text-right font-semibold text-slate-700';

const baseOrderSearchFields: OrderSearchField[] = [
  { label: '头程运单号', type: 'input', placeholder: '支持批量' },
  { label: '转单号', type: 'input', placeholder: '支持批量' },
  { label: 'FBA单号', type: 'input', placeholder: '支持批量' },
  { label: '客户名称', type: 'select', options: ['深圳天图电子有限公司', '博创跨境贸易', '广州跨境供应链'] },
  { label: '最新路由', type: 'input', placeholder: '请输入' },
  { label: '仓库代码', type: 'select', options: overseasWarehouseCodes },
  { label: '目的地', type: 'select', options: ['美国'] },
  { label: '服务', type: 'select', options: ['美森正班13日达-卡派包税', '美线海卡'] },
  { label: '客户备注', type: 'input', placeholder: '请输入' },
  { label: '海外仓备注', type: 'input', placeholder: '请输入' },
  { label: '业务员', type: 'select', options: ['安一', '天朗'] },
  { label: '跟单员', type: 'select', options: ['安逸', '李客服'] },
  { label: '剩余件数', type: 'input', placeholder: '请输入' },
  { label: '重量', type: 'input', placeholder: '请输入' },
  { label: '（剩余件）总方数', type: 'input', placeholder: '请输入' },
  { label: '入仓时间', type: 'select', options: ['今日', '本周', '本月'] },
];

const fullOrderSearchFields: OrderSearchField[] = [
  { label: '头程运单号', type: 'input', placeholder: '支持批量' },
  { label: '海外仓运单号', type: 'input', placeholder: '支持批量' },
  { label: '转单号', type: 'input', placeholder: '支持批量' },
  { label: 'FBA单号', type: 'input', placeholder: '支持批量' },
  { label: '客户名称', type: 'select', options: ['深圳天图电子有限公司', '博创跨境贸易', '广州跨境供应链'] },
  { label: '最新路由', type: 'input', placeholder: '请输入' },
  { label: '仓库代码', type: 'select', options: overseasWarehouseCodes },
  { label: '邮编', type: 'input', placeholder: '请输入' },
  { label: '运单类型', type: 'select', options: overseasOrderTypes },
  { label: '目的地', type: 'select', options: ['美国'] },
  { label: '服务', type: 'select', options: ['美森正班13日达-卡派包税', '美线海卡'] },
  { label: '客户备注', type: 'input', placeholder: '请输入' },
  { label: '海外仓备注', type: 'input', placeholder: '请输入' },
  { label: '业务员', type: 'select', options: ['安一', '天朗'] },
  { label: '跟单员', type: 'select', options: ['安逸', '李客服'] },
  { label: '剩余件数', type: 'input', placeholder: '请输入' },
  { label: '重量', type: 'input', placeholder: '请输入' },
  { label: '（剩余件）总方数', type: 'input', placeholder: '请输入' },
  { label: '入仓时间', type: 'select', options: ['今日', '本周', '本月'] },
];

const cargoMaterialOptions = ['带磁', '带电', '纺织品', '玻璃制品', '普货', '玩具', 'FDA产品', '成人用品', '木制品', '钢铁铝类', '冲突类', '电子类', '灯类', '自行车类', '粉末', '液体', '敏感货', '木制品非报关件'];
const cargoMaterialChecked = new Set(['纺织品', '普货']);
const cargoInfoRows = [
  {
    boxNo: 'FBA19DTKOWLD0000001',
    poNumber: '1DT1ZZLZ',
    englishName: "dog's hind leg joints",
    chineseName: '犬类后腿关节支撑',
    declaredPrice: '6',
    declaredQty: '47',
    declaredTotal: '282',
    material: '纺织品',
    hsCode: '6307900090',
    usage: '宠物护理',
    brand: 'PetGuard',
    model: 'HLJ-01',
    imageUrl: 'https://example.com/image-1.jpg',
    salesUrl: 'https://example.com/product-1',
    boxWeight: '18.6',
    boxLength: '52',
    boxWidth: '41',
    boxHeight: '38',
  },
  {
    boxNo: 'FBA19DTKOWLD0000002',
    poNumber: '1DT1ZZLZ',
    englishName: "dog's hind leg joints",
    chineseName: '犬类后腿关节支撑',
    declaredPrice: '6',
    declaredQty: '18',
    declaredTotal: '108',
    material: '纺织品',
    hsCode: '6307900090',
    usage: '宠物护理',
    brand: 'PetGuard',
    model: 'HLJ-01',
    imageUrl: 'https://example.com/image-2.jpg',
    salesUrl: 'https://example.com/product-2',
    boxWeight: '9.2',
    boxLength: '45',
    boxWidth: '36',
    boxHeight: '30',
  },
];

const instructionFeeRows = [
  { code: 'FY202509260001', name: '仓储渠道-免仓30天', type: '仓储费', unit: '票', price: '3', currency: '人民币', description: '提柜入仓当天起算' },
  { code: 'FY202509260002', name: '仓储渠道-31-90天', type: '仓储费', unit: '票', price: '4', currency: '人民币', description: '按1级单价收取' },
  { code: 'FY202509260003', name: '仓储渠道-90天以上', type: '仓储费', unit: '票', price: '2', currency: '人民币', description: '按2级单价收取' },
  { code: 'FY202509260004', name: '拦截-免仓7天', type: '仓储费', unit: '票', price: '4', currency: '人民币', description: '提柜入仓当天起算' },
  { code: 'FY202509260005', name: '拦截-免仓8-90天', type: '仓储费', unit: '票', price: '3', currency: '人民币', description: '按1级单价收取' },
  { code: 'FY202509260006', name: '拦截-免仓90天以上', type: '仓储费', unit: '票', price: '2', currency: '人民币', description: '按2级单价收取' },
  { code: 'FY202509260007', name: '扣货-无免仓期', type: '仓储费', unit: '票', price: '2', currency: '人民币', description: '按1级单价收取' },
];

const downstreamDetailTabs = ['费用信息', '货箱信息', '其它信息'] as const;

const quoteFeeRows = [
  { code: 'BJ202606050001', name: '哈哈', type: '操作费', price: '1.89', currency: '美元', exchangeRate: '7.014', unit: '哈哈', quantity: '1票', amount: '13.26', addedAt: '2026-06-05 14:28:00', addedBy: '天未', description: '海外仓操作附加费用' },
];

const attachmentRows = [
  { id: 'ATT-202608260001', name: '快递标.pdf', type: '其他', customerVisible: '可见', uploadedAt: '2026-08-26 17:36:00', uploadedBy: '安逸', fileSize: '1.2MB' },
];

type InstructionFeeRow = (typeof instructionFeeRows)[number] & {
  quantity?: string;
};
type QuoteFeeRow = (typeof quoteFeeRows)[number];
type AttachmentRow = (typeof attachmentRows)[number];

type DownstreamDetailTab = (typeof downstreamDetailTabs)[number];
type FeeModalTarget = 'instruction' | 'quote';
type AttachmentFormState = {
  fileName: string;
  fileSize: string;
  type: string;
  customerVisible: '可见' | '不可见';
};

const attachmentTypeOptions = ['POD', 'ISA', '报关资料', '底单', '其他', '税金单', '递延资料', '提单'];
const emptyAttachmentForm: AttachmentFormState = {
  fileName: '',
  fileSize: '',
  type: '其他',
  customerVisible: '可见',
};

type OrderLogRow = {
  id: string;
  operatedAt: string;
  operator: string;
  action: string;
  field: string;
  before: string;
  after: string;
  note: string;
};

function FormRow({
  label,
  requiredMark,
  children,
}: {
  label: string;
  requiredMark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 items-center gap-3">
      <span className={labelClass}>
        {requiredMark ? required : null}
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </label>
  );
}

function TextareaRow({
  label,
  limit,
  placeholder,
  requiredMark,
  value,
  onChange,
}: {
  label: string;
  limit: string;
  placeholder: string;
  requiredMark?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className={`${labelClass} pt-2`}>
        {requiredMark ? required : null}
        {label}
      </span>
      <div className="min-w-0 flex-1">
        <textarea
          className="h-8 w-full resize-none rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
        <div className="-mt-0.5 pr-1 text-right text-[11px] text-slate-400">{limit}</div>
      </div>
    </div>
  );
}

function DetailField({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-baseline text-xs leading-5">
      <span className={`shrink-0 font-bold ${highlight ? 'text-[#004bb1]' : 'text-slate-950'}`}>{label}：</span>
      <span className={`min-w-0 break-words ${highlight ? 'font-bold text-[#004bb1]' : 'text-slate-950'}`}>{children}</span>
    </div>
  );
}

const getOverseasWaybillNo = (row: OverseasTransitRow) => {
  const match = (row.childCreatedAt || row.inboundTime).match(/^\d{4}-(\d{2})-(\d{2})/);
  const monthDay = match ? `${match[1]}${match[2]}` : '0000';
  return `${row.id}_${monthDay}_${row.orderSeq || 1}`;
};

const getOrderKey = (row: OverseasTransitRow) => getOverseasWaybillNo(row);

const formatDateTime = (date = new Date()) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const parseFeeNumber = (value: string | undefined) => Number(String(value || '0').replace(/[^\d.]/g, '')) || 0;
const getExchangeRate = (currency: string) => (currency === 'USD' || currency === '美元' ? '7.014' : '1');
const normalizeCurrency = (currency: string) => (currency === 'USD' ? '美元' : currency);
const getQuoteAmount = (row: Pick<QuoteFeeRow, 'price' | 'quantity' | 'exchangeRate'>) => {
  const amount = parseFeeNumber(row.price) * parseFeeNumber(row.quantity) * parseFeeNumber(row.exchangeRate);
  return amount.toFixed(2).replace(/\.00$/, '');
};
const describeQuoteFee = (row: QuoteFeeRow) => `${row.name} / ${row.price} ${row.currency} / ${row.quantity} / ${row.amount}`;

const createQuoteFeeRow = (fee: InstructionFeeRow, sequence: number): QuoteFeeRow => {
  const currency = normalizeCurrency(fee.currency);
  const exchangeRate = getExchangeRate(currency);
  const quantity = fee.quantity || '1票';
  const baseRow = {
    code: `${fee.code}-Q${sequence}`,
    name: fee.name,
    type: fee.type,
    price: fee.price,
    currency,
    exchangeRate,
    unit: fee.unit,
    quantity,
    amount: '0',
    addedAt: formatDateTime(),
    addedBy: '天朗（付豪）',
    description: fee.description,
  };
  return { ...baseRow, amount: getQuoteAmount(baseRow) };
};

const getOrderLogRows = (row: OverseasTransitRow): OrderLogRow[] => [
  {
    id: `${row.id}-create`,
    operatedAt: row.inboundTime,
    operator: row.salesman || '系统',
    action: '创建海外中转单',
    field: '基础信息',
    before: '-',
    after: `${row.customerName} / ${row.channel}`,
    note: `头程运单 ${row.id} 生成海外仓运单 ${getOrderKey(row)}`,
  },
  {
    id: `${row.id}-warehouse`,
    operatedAt: row.inboundTime,
    operator: row.merchandiser || '系统',
    action: '中转信息维护',
    field: '仓库代码 / 目的地 / 服务',
    before: '-',
    after: `${row.warehouseCode || '-'} / ${row.destination} / ${row.channel}`,
    note: '录入海外仓和尾程服务信息',
  },
  {
    id: `${row.id}-remark`,
    operatedAt: row.inboundTime,
    operator: row.merchandiser || '安逸',
    action: '备注维护',
    field: '客户备注 / 海外仓备注',
    before: '-',
    after: `${row.customerRemark || '-'} / ${row.overseasWarehouseRemark || '-'}`,
    note: '同步客户要求与海外仓操作备注',
  },
  {
    id: `${row.id}-status`,
    operatedAt: row.inboundTime,
    operator: '系统',
    action: '状态变更',
    field: '中转状态',
    before: '待确认',
    after: row.status,
    note: row.transferNo ? `转单号 ${row.transferNo} 已关联` : '等待转单信息回传',
  },
];

function OrderLogDrawer({
  row,
  extraLogs = [],
  onClose,
}: {
  row: OverseasTransitRow;
  extraLogs?: OrderLogRow[];
  onClose: () => void;
}) {
  const logs = [...getOrderLogRows(row), ...extraLogs];
  return (
    <div className="fixed inset-0 z-[60] bg-black/45">
      <div className="absolute right-0 top-0 flex h-full w-[800px] max-w-[92vw] flex-col bg-white shadow-2xl">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-6">
          <div>
            <h2 className="text-sm font-bold text-slate-950">操作日志</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">{row.id} · {row.customerName}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-600 hover:bg-slate-100" aria-label="关闭日志">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-4">
          <div className="mb-3 grid grid-cols-3 gap-3 rounded border border-slate-200 bg-white px-4 py-3 text-xs">
            <div><span className="font-bold text-slate-900">状态：</span>{row.status}</div>
            <div><span className="font-bold text-slate-900">海外仓运单号：</span>{getOverseasWaybillNo(row)}</div>
            <div><span className="font-bold text-slate-900">转单号：</span>{row.transferNo || '-'}</div>
          </div>
          <table className="w-full table-fixed border-collapse bg-white text-xs">
            <thead className="bg-slate-100 text-slate-800">
              <tr>
                {['变更时间', '操作人', '操作类型', '变更字段', '变更前', '变更后', '说明'].map((head) => (
                  <th key={head} className="border border-slate-200 px-3 py-2 text-center font-bold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="align-top text-slate-700">
                  <td className="border border-slate-200 px-3 py-2 text-center font-mono">{log.operatedAt}</td>
                  <td className="border border-slate-200 px-3 py-2 text-center">{log.operator}</td>
                  <td className="border border-slate-200 px-3 py-2 text-center">{log.action}</td>
                  <td className="border border-slate-200 px-3 py-2 text-center">{log.field}</td>
                  <td className="border border-slate-200 px-3 py-2">{log.before}</td>
                  <td className="border border-slate-200 px-3 py-2">{log.after}</td>
                  <td className="border border-slate-200 px-3 py-2">{log.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function OverseasTransitOrderPage({ addToast, activeNode = '待确认', onNodeChange }: OverseasTransitOrderPageProps) {
  const [activeTab, setActiveTab] = useState(activeNode);
  const [selectedIds, setSelectedIds] = useState<string[]>(['YT2507100001_0710_1', 'YT2507100002_0710_1', 'YT2507100004_0711_1']);
  const [activeOrder, setActiveOrder] = useState<OverseasTransitRow | null>(null);
  const [activeLogOrder, setActiveLogOrder] = useState<OverseasTransitRow | null>(null);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [feeModalTarget, setFeeModalTarget] = useState<FeeModalTarget>('instruction');
  const [selectedFeeCodes, setSelectedFeeCodes] = useState<string[]>(instructionFeeRows.slice(0, 3).map((row) => row.code));
  const [instructionRows, setInstructionRows] = useState<InstructionFeeRow[]>([]);
  const [quoteRowsByOrder, setQuoteRowsByOrder] = useState<Record<string, QuoteFeeRow[]>>({});
  const [quoteLogsByOrder, setQuoteLogsByOrder] = useState<Record<string, OrderLogRow[]>>({});
  const [attachmentRowsByOrder, setAttachmentRowsByOrder] = useState<Record<string, AttachmentRow[]>>({});
  const [transferPanelOpen, setTransferPanelOpen] = useState(false);
  const [transferDraftsByOrder, setTransferDraftsByOrder] = useState<Record<string, TransitTransferRow[]>>({});
  const [savedTransferRowsByOrder, setSavedTransferRowsByOrder] = useState<Record<string, TransitTransferRow[]>>({});
  const [editingInstruction, setEditingInstruction] = useState<InstructionFeeRow | null>(null);
  const [deletingInstruction, setDeletingInstruction] = useState<InstructionFeeRow | null>(null);
  const [editingQuoteFee, setEditingQuoteFee] = useState<QuoteFeeRow | null>(null);
  const [deletingQuoteFee, setDeletingQuoteFee] = useState<QuoteFeeRow | null>(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<AttachmentRow | null>(null);
  const [deletingAttachment, setDeletingAttachment] = useState<AttachmentRow | null>(null);
  const [attachmentForm, setAttachmentForm] = useState<AttachmentFormState>(emptyAttachmentForm);
  const [addressForm, setAddressForm] = useState<AddressFormState>(emptyAddressForm);
  const [downstreamDetailTab, setDownstreamDetailTab] = useState<DownstreamDetailTab>('费用信息');
  const filteredRows = transitRows.filter((row) => row.status === activeTab);
  const usesOrderFormTemplate = (status: string) => orderFormStatuses.has(status);
  const showOverseasWaybillNo = !usesOrderFormTemplate(activeTab);
  const orderSearchFields = showOverseasWaybillNo ? fullOrderSearchFields : baseOrderSearchFields;
  const quoteEditableStatuses = new Set(['已下单', '转运中', '签收']);
  const activeOrderKey = activeOrder ? getOrderKey(activeOrder) : '';
  const activeQuoteRows = activeOrder ? (quoteRowsByOrder[activeOrderKey] || quoteFeeRows) : [];
  const canEditQuoteFees = !!activeOrder && quoteEditableStatuses.has(activeOrder.status);
  const activeAttachmentRows = activeOrder ? (attachmentRowsByOrder[activeOrderKey] || attachmentRows) : [];

  useEffect(() => {
    if (overseasTransitNodes.includes(activeNode)) {
      setActiveTab(activeNode);
    }
  }, [activeNode]);

  const handleNodeChange = (node: string) => {
    setActiveTab(node);
    onNodeChange?.(node);
  };

  const openOrder = (row: OverseasTransitRow) => {
    setActiveOrder(row);
    setShowInstructionModal(false);
    setEditingInstruction(null);
    setDeletingInstruction(null);
    setEditingQuoteFee(null);
    setDeletingQuoteFee(null);
    setShowAttachmentModal(false);
    setEditingAttachment(null);
    setDeletingAttachment(null);
    setAttachmentForm(emptyAttachmentForm);
    setTransferPanelOpen(false);
    setDownstreamDetailTab('费用信息');
    setAddressForm(emptyAddressForm);
    addToast(`已打开 ${getOrderKey(row)} 中转下单页面`, 'info');
  };

  const openLog = (row?: OverseasTransitRow) => {
    const selectedCurrentRow = filteredRows.find((item) => selectedIds.includes(getOrderKey(item)));
    const nextRow = row || selectedCurrentRow || filteredRows[0];
    if (!nextRow) {
      addToast('当前节点暂无可查看的日志', 'warning');
      return;
    }
    setActiveLogOrder(nextRow);
    addToast(`已打开 ${nextRow.id} 操作日志`, 'info');
  };

  const appendQuoteLog = (orderId: string, log: Omit<OrderLogRow, 'id'>) => {
    setQuoteLogsByOrder((prev) => {
      const currentLogs = prev[orderId] || [];
      return {
        ...prev,
        [orderId]: [
          ...currentLogs,
          {
            id: `${orderId}-quote-${currentLogs.length + 1}`,
            ...log,
          },
        ],
      };
    });
  };

  const openFeeSelector = (target: FeeModalTarget) => {
    setFeeModalTarget(target);
    if (target === 'quote') {
      setSelectedFeeCodes([instructionFeeRows[0].code]);
    }
    setShowInstructionModal(true);
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleFeeCode = (code: string) => {
    setSelectedFeeCodes((prev) => (prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]));
  };

  const confirmInstructionFees = () => {
    const selectedFees = instructionFeeRows
      .filter((row) => selectedFeeCodes.includes(row.code))
      .map((row) => ({ ...row, quantity: '1' }));
    if (feeModalTarget === 'quote') {
      if (!activeOrder) return;
      const orderKey = getOrderKey(activeOrder);
      const existingRows = quoteRowsByOrder[orderKey] || quoteFeeRows;
      const nextRows = selectedFees.map((row, index) => createQuoteFeeRow(row, existingRows.length + index + 1));
      setQuoteRowsByOrder((prev) => ({
        ...prev,
        [orderKey]: [...existingRows, ...nextRows],
      }));
      appendQuoteLog(orderKey, {
        operatedAt: formatDateTime(),
        operator: '天朗（付豪）',
        action: '新增报价费用明细',
        field: '费用明细',
        before: '-',
        after: nextRows.map(describeQuoteFee).join('；'),
        note: `新增 ${nextRows.length} 条报价费用明细`,
      });
      setShowInstructionModal(false);
      addToast(`已添加 ${nextRows.length} 条报价费用明细`, 'success');
      return;
    }
    setInstructionRows(selectedFees);
    setShowInstructionModal(false);
    addToast(`已添加 ${selectedFees.length} 条操作指令`, 'success');
  };

  const saveEditingInstruction = () => {
    if (!editingInstruction) return;
    setInstructionRows((prev) => prev.map((row) => (row.code === editingInstruction.code ? editingInstruction : row)));
    setEditingInstruction(null);
    addToast('操作指令已更新', 'success');
  };

  const confirmDeleteInstruction = () => {
    if (!deletingInstruction) return;
    setInstructionRows((prev) => prev.filter((item) => item.code !== deletingInstruction.code));
    setDeletingInstruction(null);
    addToast('操作指令已删除', 'info');
  };

  const saveEditingQuoteFee = () => {
    if (!editingQuoteFee || !activeOrder) return;
    const orderKey = getOrderKey(activeOrder);
    const existingRows = quoteRowsByOrder[orderKey] || quoteFeeRows;
    const previousRow = existingRows.find((row) => row.code === editingQuoteFee.code);
    const exchangeRate = getExchangeRate(editingQuoteFee.currency);
    const nextRow = {
      ...editingQuoteFee,
      currency: normalizeCurrency(editingQuoteFee.currency),
      exchangeRate,
      amount: getQuoteAmount({ ...editingQuoteFee, exchangeRate }),
    };
    setQuoteRowsByOrder((prev) => ({
      ...prev,
      [orderKey]: existingRows.map((row) => (row.code === nextRow.code ? nextRow : row)),
    }));
    appendQuoteLog(orderKey, {
      operatedAt: formatDateTime(),
      operator: '天朗（付豪）',
      action: '编辑报价费用明细',
      field: nextRow.name,
      before: previousRow ? describeQuoteFee(previousRow) : '-',
      after: describeQuoteFee(nextRow),
      note: '报价费用明细已更新',
    });
    setEditingQuoteFee(null);
    addToast('报价费用明细已更新', 'success');
  };

  const confirmDeleteQuoteFee = () => {
    if (!deletingQuoteFee || !activeOrder) return;
    const orderKey = getOrderKey(activeOrder);
    const existingRows = quoteRowsByOrder[orderKey] || quoteFeeRows;
    setQuoteRowsByOrder((prev) => ({
      ...prev,
      [orderKey]: existingRows.filter((row) => row.code !== deletingQuoteFee.code),
    }));
    appendQuoteLog(orderKey, {
      operatedAt: formatDateTime(),
      operator: '天朗（付豪）',
      action: '删除报价费用明细',
      field: deletingQuoteFee.name,
      before: describeQuoteFee(deletingQuoteFee),
      after: '-',
      note: '报价费用明细已删除',
    });
    setDeletingQuoteFee(null);
    addToast('报价费用明细已删除', 'info');
  };

  const openAttachmentModal = (row?: AttachmentRow) => {
    setEditingAttachment(row || null);
    setAttachmentForm(row
      ? {
          fileName: row.name,
          fileSize: row.fileSize,
          type: row.type,
          customerVisible: row.customerVisible as AttachmentFormState['customerVisible'],
        }
      : emptyAttachmentForm);
    setShowAttachmentModal(true);
  };

  const handleAttachmentFileChange = (file?: File) => {
    if (!file) return;
    const sizeInMb = file.size / 1024 / 1024;
    setAttachmentForm((prev) => ({
      ...prev,
      fileName: file.name,
      fileSize: sizeInMb >= 1 ? `${sizeInMb.toFixed(1)}MB` : `${Math.max(1, Math.round(file.size / 1024))}KB`,
    }));
  };

  const saveAttachment = () => {
    if (!activeOrder) return;
    if (!attachmentForm.fileName) {
      addToast('请先选择附件文件', 'warning');
      return;
    }
    const orderKey = getOrderKey(activeOrder);
    const existingRows = attachmentRowsByOrder[orderKey] || attachmentRows;
    if (editingAttachment) {
      const previousRow = existingRows.find((row) => row.id === editingAttachment.id);
      const nextRow: AttachmentRow = {
        ...editingAttachment,
        name: attachmentForm.fileName,
        type: attachmentForm.type,
        customerVisible: attachmentForm.customerVisible,
        fileSize: attachmentForm.fileSize || editingAttachment.fileSize,
      };
      setAttachmentRowsByOrder((prev) => ({
        ...prev,
        [orderKey]: existingRows.map((row) => (row.id === nextRow.id ? nextRow : row)),
      }));
      appendQuoteLog(orderKey, {
        operatedAt: formatDateTime(),
        operator: '天朗（付豪）',
        action: '编辑附件',
        field: nextRow.name,
        before: previousRow ? `${previousRow.type} / ${previousRow.customerVisible}` : '-',
        after: `${nextRow.type} / ${nextRow.customerVisible}`,
        note: '附件信息已更新',
      });
      addToast('附件信息已更新', 'success');
    } else {
      const nextRow: AttachmentRow = {
        id: `ATT-${Date.now()}`,
        name: attachmentForm.fileName,
        type: attachmentForm.type,
        customerVisible: attachmentForm.customerVisible,
        uploadedAt: formatDateTime(),
        uploadedBy: '天朗（付豪）',
        fileSize: attachmentForm.fileSize || '-',
      };
      setAttachmentRowsByOrder((prev) => ({
        ...prev,
        [orderKey]: [...existingRows, nextRow],
      }));
      appendQuoteLog(orderKey, {
        operatedAt: formatDateTime(),
        operator: '天朗（付豪）',
        action: '上传附件',
        field: nextRow.type,
        before: '-',
        after: `${nextRow.name} / ${nextRow.customerVisible}`,
        note: '附件已上传并关联当前运单',
      });
      addToast('附件已上传', 'success');
    }
    setShowAttachmentModal(false);
    setEditingAttachment(null);
    setAttachmentForm(emptyAttachmentForm);
  };

  const confirmDeleteAttachment = () => {
    if (!deletingAttachment || !activeOrder) return;
    const orderKey = getOrderKey(activeOrder);
    const existingRows = attachmentRowsByOrder[orderKey] || attachmentRows;
    setAttachmentRowsByOrder((prev) => ({
      ...prev,
      [orderKey]: existingRows.filter((row) => row.id !== deletingAttachment.id),
    }));
    appendQuoteLog(orderKey, {
      operatedAt: formatDateTime(),
      operator: '天朗（付豪）',
      action: '删除附件',
      field: deletingAttachment.type,
      before: `${deletingAttachment.name} / ${deletingAttachment.customerVisible}`,
      after: '-',
      note: '附件已删除',
    });
    setDeletingAttachment(null);
    addToast('附件已删除', 'info');
  };

  const getTransitTransferNumber = (row: OverseasTransitRow, index: number) => {
    if (index === 0 && row.transferNo) return row.transferNo;
    const seed = `${getOrderKey(row)}${row.fbaCode}${row.warehouseCode || ''}${index + 1}`;
    const value = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 1321634000);
    return String(value).slice(0, 10);
  };

  const getDefaultTransferRows = (row: OverseasTransitRow): TransitTransferRow[] => {
    const rowCount = Math.max(3, Math.min(row.packages || 1, 5));
    return Array.from({ length: rowCount }, (_, index) => {
      const sequence = String(index + 1).padStart(4, '0');
      return {
        systemBoxNo: `${getOverseasWaybillNo(row)}U${sequence}`,
        fbaBoxNo: `${row.fbaCode}U${sequence}`,
        carrierCompany: row.channel,
        transferNo: getTransitTransferNumber(row, index),
      };
    });
  };

  const getTransferRows = (row: OverseasTransitRow) => (
    transferDraftsByOrder[getOrderKey(row)] || savedTransferRowsByOrder[getOrderKey(row)] || getDefaultTransferRows(row)
  );

  const getSavedTransferRows = (row: OverseasTransitRow) => savedTransferRowsByOrder[getOrderKey(row)] || getDefaultTransferRows(row);

  const getTransitCargoBoxRows = (row: OverseasTransitRow) => {
    const totalWeight = parseFeeNumber(row.weight);
    const perBoxWeight = (totalWeight / Math.max(row.packages, 1)).toFixed(2).replace(/\.00$/, '');
    return getSavedTransferRows(row)
      .filter((item) => item.systemBoxNo || item.fbaBoxNo)
      .map((item) => ({
        boxNo: item.fbaBoxNo,
        customerTracking: item.systemBoxNo,
        customerData: [`${perBoxWeight} KG`, '50*50*50 CM'],
        systemWeight: [`${perBoxWeight} / ${perBoxWeight} KG`, '50*50*50 CM'],
        carrier: item.carrierCompany,
        transferNo: item.transferNo,
        warehouseReturnNo: item.transferNo || row.transferNo || '-',
        networkStatus: row.status === '取消' ? '已取消' : row.status,
        status: row.status === '取消' ? '取消' : '查看',
      }));
  };

  const openTransferPanel = (row: OverseasTransitRow) => {
    setTransferDraftsByOrder((prev) => {
      const orderKey = getOrderKey(row);
      if (prev[orderKey]) return prev;
      const savedRows = savedTransferRowsByOrder[orderKey];
      return {
        ...prev,
        [orderKey]: savedRows ? savedRows.map((item) => ({ ...item })) : getDefaultTransferRows(row),
      };
    });
    setTransferPanelOpen(true);
  };

  const updateTransferDraft = (orderId: string, rowIndex: number, field: 'carrierCompany' | 'transferNo', value: string) => {
    setTransferDraftsByOrder((prev) => {
      const currentRows = prev[orderId] || (activeOrder ? getDefaultTransferRows(activeOrder) : []);
      return {
        ...prev,
        [orderId]: currentRows.map((row, index) => (index === rowIndex ? { ...row, [field]: value } : row)),
      };
    });
  };

  const saveTransferRows = () => {
    if (!activeOrder) return;
    const nextRows = getTransferRows(activeOrder);
    const filledRows = nextRows.filter((row) => row.systemBoxNo || row.fbaBoxNo);
    const missingRequired = filledRows.some((row) => !row.carrierCompany.trim() || !row.transferNo.trim());
    if (missingRequired) {
      addToast('请填写承运公司和转单号', 'warning');
      return;
    }

    setSavedTransferRowsByOrder((prev) => ({
      ...prev,
      [activeOrderKey]: nextRows.map((row) => ({ ...row })),
    }));
    appendQuoteLog(activeOrderKey, {
      operatedAt: formatDateTime(),
      operator: '天朗（付豪）',
      action: '维护转单号',
      field: '货箱信息',
      before: '-',
      after: filledRows.map((row) => `${row.systemBoxNo} / ${row.carrierCompany} / ${row.transferNo}`).join('；'),
      note: `保存 ${filledRows.length} 条货箱转单号`,
    });
    addToast(`海外中转单 ${activeOrderKey} 转单号已保存`, 'success');
    setTransferPanelOpen(false);
  };

  const updateAddressField = (field: keyof AddressFormState, value: string) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleWarehouseCodeChange = (value: string) => {
    const nextCode = value.trim().toUpperCase();
    const matchedWarehouse = warehouseAddressBook[nextCode];

    setAddressForm((prev) => ({
      ...prev,
      warehouseCode: nextCode,
      ...(matchedWarehouse || {}),
      company: prev.company,
      remark: prev.remark,
      overseasWarehouseRemark: prev.overseasWarehouseRemark,
    }));
  };

  return (
    <div className="relative flex-1 overflow-auto bg-slate-100 p-4 font-sans text-slate-700 max-h-[calc(100vh-3rem)]">
      <div className="mb-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 items-center gap-x-5 gap-y-4 text-xs md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1800px)]:grid-cols-5">
          {orderSearchFields.map((field) => (
            <label key={field.label} className="flex min-w-0 items-center gap-3">
              <span className={orderSearchLabelClass}>{field.label}</span>
              {field.type === 'select' ? (
                <select className={orderSearchControlClass} defaultValue="">
                  <option value="">请选择</option>
                  {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input className={orderSearchControlClass} placeholder={field.placeholder || '请输入'} />
              )}
            </label>
          ))}
          <div className="flex min-w-0 items-center gap-2 pl-[140px]">
            <button type="button" onClick={() => addToast('已查询海外中转单数据', 'success')} className="flex h-8 min-w-20 items-center justify-center gap-1 rounded bg-[#004bb1] px-4 text-xs font-bold text-white hover:bg-[#003b91]">
              <Search className="h-3.5 w-3.5" />
              搜索
            </button>
            <button type="button" onClick={() => addToast('已重置筛选条件', 'info')} className="h-8 min-w-20 rounded border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-8 border-b border-slate-200 text-xs font-bold">
          {overseasTransitNodes.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleNodeChange(tab)}
              className={`relative px-1 pb-3 ${activeTab === tab ? 'text-[#004bb1]' : 'text-slate-600 hover:text-[#004bb1]'}`}
            >
              {tab}({transitRows.filter((row) => row.status === tab).length})
              {activeTab === tab && <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-[#004bb1]" />}
            </button>
          ))}
        </div>

        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const selectedCurrentRow = filteredRows.find((row) => selectedIds.includes(getOrderKey(row)));
              selectedCurrentRow ? openOrder(selectedCurrentRow) : addToast('请选择当前节点下需要下单的中转运单', 'warning');
            }}
            className="rounded bg-[#004bb1] px-7 py-2 text-xs font-bold text-white hover:bg-[#003b91]"
          >
            下单
          </button>
          <button type="button" onClick={() => addToast('导出海外中转单功能为展示', 'info')} className="rounded bg-[#004bb1] px-7 py-2 text-xs font-bold text-white hover:bg-[#003b91]">
            导出
          </button>
          <button type="button" onClick={() => addToast('批量修改功能为展示', 'info')} className="rounded bg-[#004bb1] px-7 py-2 text-xs font-bold text-white hover:bg-[#003b91]">
            批量修改
          </button>
          <button type="button" onClick={() => openLog()} className="rounded bg-[#004bb1] px-7 py-2 text-xs font-bold text-white hover:bg-[#003b91]">
            查看日志
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200">
          <table className={`w-full ${showOverseasWaybillNo ? 'min-w-[2520px]' : 'min-w-[2040px]'} table-fixed border-collapse text-[11px]`}>
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="w-10 border border-slate-200 px-2 py-2 text-center">
                  <input type="checkbox" readOnly checked={filteredRows.length > 0 && filteredRows.every((row) => selectedIds.includes(getOrderKey(row)))} className="h-3.5 w-3.5 rounded border-slate-300" />
                </th>
                <th className="w-44 border border-slate-200 px-3 py-2 text-center">头程运单号</th>
                {showOverseasWaybillNo && <th className="w-56 border border-slate-200 px-3 py-2 text-center">海外仓运单号</th>}
                {showOverseasWaybillNo && <th className="w-36 border border-slate-200 px-3 py-2 text-center">子单创建时间</th>}
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">转单号</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">FBA单号</th>
                <th className="w-44 border border-slate-200 px-3 py-2 text-center">客户名称</th>
                <th className="w-52 border border-slate-200 px-3 py-2 text-center">最新路由</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">仓库代码</th>
                {showOverseasWaybillNo && <th className="w-24 border border-slate-200 px-3 py-2 text-center">邮编</th>}
                {showOverseasWaybillNo && <th className="w-28 border border-slate-200 px-3 py-2 text-center">运单类型</th>}
                <th className="w-20 border border-slate-200 px-3 py-2 text-center">目的地</th>
                <th className="w-56 border border-slate-200 px-3 py-2 text-center">服务</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">客户备注</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">海外仓备注</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">业务员</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">跟单员</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">剩余件数</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">重量</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">（剩余件）总方数</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">入仓时间</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={getOrderKey(row)}
                  onDoubleClick={() => openOrder(row)}
                  title="双击打开中转下单"
                  className={`h-9 cursor-pointer text-slate-700 hover:bg-blue-50/70 ${selectedIds.includes(getOrderKey(row)) ? 'bg-blue-50/30' : ''}`}
                >
                  <td className="border border-slate-200 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(getOrderKey(row))}
                      onChange={() => toggleRow(getOrderKey(row))}
                      onDoubleClick={(event) => event.stopPropagation()}
                      className="h-3.5 w-3.5 rounded border-slate-300"
                    />
                  </td>
                  <td className="border border-slate-200 px-3 text-center font-mono">{row.id}</td>
                  {showOverseasWaybillNo && <td className="border border-slate-200 px-3 text-center font-mono text-blue-600">{getOverseasWaybillNo(row)}</td>}
                  {showOverseasWaybillNo && <td className="border border-slate-200 px-3 text-center font-mono text-slate-500">{row.childCreatedAt || '-'}</td>}
                  <td className="border border-slate-200 px-3 text-center font-mono">{row.transferNo || '-'}</td>
                  <td className="border border-slate-200 px-3 text-center font-mono">{row.fbaCode}</td>
                  <td className="truncate border border-slate-200 px-3 text-center">{row.customerName}</td>
                  <td className="truncate border border-slate-200 px-3 text-center">{row.latestRoute || '-'}</td>
                  <td className="border border-slate-200 px-3 text-center font-mono">{row.warehouseCode || '-'}</td>
                  {showOverseasWaybillNo && <td className="border border-slate-200 px-3 text-center font-mono">{row.zipCode || '-'}</td>}
                  {showOverseasWaybillNo && <td className="border border-slate-200 px-3 text-center">{row.orderType || '-'}</td>}
                  <td className="border border-slate-200 px-3 text-center">{row.destination}</td>
                  <td className="truncate border border-slate-200 px-3 text-center">{row.channel}</td>
                  <td className="truncate border border-slate-200 px-3 text-center">{row.customerRemark || '-'}</td>
                  <td className="truncate border border-slate-200 px-3 text-center">{row.overseasWarehouseRemark || '-'}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.salesman || '-'}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.merchandiser || '-'}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.packages}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.weight}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.volume}</td>
                  <td className="border border-slate-200 px-3 text-center font-mono text-slate-500">{row.inboundTime}</td>
                  <td className="border border-slate-200 px-3 text-center">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openLog(row);
                      }}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      日志
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={showOverseasWaybillNo ? 22 : 18} className="h-24 border border-slate-200 text-center text-slate-400">
                    当前节点暂无海外中转单
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/55">
          <div className="absolute right-0 top-0 flex h-full w-[66vw] min-w-[980px] flex-col bg-slate-50 shadow-2xl">
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-9">
              <h2 className="text-sm font-bold text-slate-950">{usesOrderFormTemplate(activeOrder.status) ? '中转下单' : '确认运单信息'}</h2>
              <button type="button" onClick={() => setActiveOrder(null)} className="rounded p-1 text-slate-700 hover:bg-slate-100" aria-label="关闭">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {usesOrderFormTemplate(activeOrder.status) ? (
                <>
                  <div className="mb-3 grid grid-cols-5 rounded-2xl border border-slate-200 bg-white px-8 py-5 text-xs">
                    <div>
                      <span className="font-bold text-blue-600">运单号： ASSZ000000001</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">目的地：</span>
                      <span>美国</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">服务：</span>
                      <span>{activeOrder.channel}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">客户备注：</span>
                      <span>{activeOrder.customerRemark || '-'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">海外仓备注：</span>
                      <span>{activeOrder.overseasWarehouseRemark || '-'}</span>
                    </div>
                  </div>

                  <section className="rounded-2xl border border-slate-200 bg-white px-7 py-4">
                    <h3 className="mb-5 text-sm font-bold text-slate-950">收件地址信息</h3>
                    <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                      <FormRow label="运单类型" requiredMark>
                        <select
                          className={fieldClass}
                          value={addressForm.orderType}
                          onChange={(event) => updateAddressField('orderType', event.target.value)}
                        >
                          {overseasOrderTypes.map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </FormRow>

                      <FormRow label="仓库代码" requiredMark>
                        <>
                          <input
                            className={fieldClass}
                            list="overseas-warehouse-codes"
                            placeholder="请输入仓库代码"
                            value={addressForm.warehouseCode}
                            onChange={(event) => handleWarehouseCodeChange(event.target.value)}
                          />
                          <datalist id="overseas-warehouse-codes">
                            {overseasWarehouseCodes.map((code) => (
                              <option key={code} value={code} />
                            ))}
                          </datalist>
                        </>
                      </FormRow>
                      <FormRow label="邮编" requiredMark>
                        <input
                          className={fieldClass}
                          placeholder="请输入邮编"
                          value={addressForm.zipCode}
                          onChange={(event) => updateAddressField('zipCode', event.target.value)}
                        />
                      </FormRow>
                      <FormRow label="收件人">
                        <input
                          className={fieldClass}
                          placeholder="请输入收件人"
                          value={addressForm.consignee}
                          onChange={(event) => updateAddressField('consignee', event.target.value)}
                        />
                      </FormRow>
                      {addressForm.orderType === '私人地址' && (
                        <FormRow label="电话" requiredMark>
                          <input
                            className={fieldClass}
                            placeholder="请输入电话"
                            value={addressForm.phone}
                            onChange={(event) => updateAddressField('phone', event.target.value)}
                          />
                        </FormRow>
                      )}
                      <FormRow label="城市" requiredMark>
                        <input
                          className={fieldClass}
                          placeholder="请输入城市"
                          value={addressForm.city}
                          onChange={(event) => updateAddressField('city', event.target.value)}
                        />
                      </FormRow>
                      <FormRow label="州">
                        <input
                          className={fieldClass}
                          placeholder="请输入州"
                          value={addressForm.state}
                          onChange={(event) => updateAddressField('state', event.target.value)}
                        />
                      </FormRow>
                      <FormRow label="公司">
                        <input
                          className={fieldClass}
                          placeholder="请输入公司"
                          value={addressForm.company}
                          onChange={(event) => updateAddressField('company', event.target.value)}
                        />
                      </FormRow>
                      <TextareaRow
                        label="地址详情"
                        placeholder="请输入地址详情"
                        limit={`${addressForm.addressDetail.length}/100`}
                        requiredMark
                        value={addressForm.addressDetail}
                        onChange={(value) => updateAddressField('addressDetail', value)}
                      />
                      <TextareaRow
                        label="客户备注"
                        placeholder="请输入客户备注"
                        limit={`${addressForm.remark.length}/500`}
                        value={addressForm.remark}
                        onChange={(value) => updateAddressField('remark', value)}
                      />
                      <TextareaRow
                        label="海外仓备注"
                        placeholder="请输入海外仓备注"
                        limit={`${addressForm.overseasWarehouseRemark.length}/500`}
                        value={addressForm.overseasWarehouseRemark}
                        onChange={(value) => updateAddressField('overseasWarehouseRemark', value)}
                      />
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-950 shadow-sm">
                    <h3 className="mb-7 text-sm font-bold text-slate-950">基础信息</h3>
                    <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr_1.15fr] gap-x-16 gap-y-6">
                      <DetailField label="海外仓运单号" highlight>{getOverseasWaybillNo(activeOrder)}</DetailField>
                      <DetailField label="客户全称">{activeOrder.customerName}</DetailField>
                      <DetailField label="目的地">{activeOrder.destination}</DetailField>
                      <DetailField label="服务">{activeOrder.channel}</DetailField>
                      <DetailField label="运单类型">{activeOrder.orderType || '-'}</DetailField>
                      <DetailField label="仓库代码">{activeOrder.warehouseCode || '-'}</DetailField>
                      <DetailField label="FBA单号">{activeOrder.fbaCode}</DetailField>
                      <DetailField label="发货件数">{activeOrder.packages}</DetailField>
                      <DetailField label="收费重">{activeOrder.weight.replace('kg', '')}kg</DetailField>
                      <DetailField label="实重">{activeOrder.weight.replace('kg', '')}kg</DetailField>
                      <DetailField label="材积重">{activeOrder.weight.replace('kg', '')}kg</DetailField>
                      <DetailField label="方数">{activeOrder.volume}</DetailField>
                      <DetailField label="转单号">{activeOrder.transferNo || '-'}</DetailField>
                      <DetailField label="头程运单号">{activeOrder.id}</DetailField>
                      <DetailField label="子单创建时间">{activeOrder.childCreatedAt || '-'}</DetailField>
                      <DetailField label="柜号">YWSF11121453</DetailField>
                      <DetailField label="邮编">{activeOrder.zipCode || '-'}</DetailField>
                      <DetailField label="邮箱">customer@tiantu.com</DetailField>
                      <DetailField label="入仓时间">{activeOrder.inboundTime}</DetailField>
                      <DetailField label="业务员">{activeOrder.salesman || '-'}</DetailField>
                      <DetailField label="跟单员">{activeOrder.merchandiser || '-'}</DetailField>
                      <DetailField label="客户备注">{activeOrder.customerRemark || '-'}</DetailField>
                      <DetailField label="海外仓备注">{activeOrder.overseasWarehouseRemark || '-'}</DetailField>
                      <DetailField label="快递标">
                        <button className="font-bold text-[#004bb1] hover:underline" type="button">打印</button>
                        <span className="ml-2 rounded bg-yellow-300 px-1.5 py-0.5 text-[10px] font-bold leading-none text-amber-700 shadow-sm">24</span>
                      </DetailField>
                    </div>
                  </section>

                  <div className="mt-2 flex items-center gap-10 border-b border-slate-200 bg-white px-4 text-sm font-bold">
                    {downstreamDetailTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setDownstreamDetailTab(tab)}
                        className={`relative min-w-20 px-2 py-4 text-center ${
                          downstreamDetailTab === tab ? 'text-[#004bb1]' : 'text-slate-600 hover:text-[#004bb1]'
                        }`}
                      >
                        {tab}
                        {downstreamDetailTab === tab && <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-[#004bb1]" />}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 min-h-[300px]">
                    {downstreamDetailTab === '费用信息' && (
                      <section className="rounded-md bg-white p-4 shadow-sm">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <h3 className="text-sm font-bold text-slate-950">费用信息</h3>
                          {canEditQuoteFees && (
                            <button
                              type="button"
                              onClick={() => openFeeSelector('quote')}
                              className="rounded border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              新增
                            </button>
                          )}
                        </div>
                        <div className="overflow-x-auto border border-slate-200">
                          <table className="w-full min-w-[980px] table-fixed border-collapse text-[11px]">
                            <thead className="bg-slate-50 text-slate-600">
                              <tr>
                                {['费用名称', '单价', '币种', '汇率', '单位', '数量', '金额', '添加时间', '添加人', '操作'].map((head) => (
                                  <th key={head} className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    {head}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {activeQuoteRows.length > 0 ? (
                                activeQuoteRows.map((row) => (
                                  <tr key={row.code} className="h-10 text-slate-700 odd:bg-white even:bg-slate-50/70">
                                    <td className="border border-slate-200 px-3">{row.name}</td>
                                    <td className="border border-slate-200 px-3">{row.price}</td>
                                    <td className="border border-slate-200 px-3">{row.currency}</td>
                                    <td className="border border-slate-200 px-3">{row.exchangeRate}</td>
                                    <td className="border border-slate-200 px-3">{row.unit}</td>
                                    <td className="border border-slate-200 px-3">{row.quantity}</td>
                                    <td className="border border-slate-200 px-3 font-semibold text-slate-900">{row.amount}</td>
                                    <td className="border border-slate-200 px-3 font-mono text-slate-500">{row.addedAt}</td>
                                    <td className="border border-slate-200 px-3">{row.addedBy}</td>
                                    <td className="border border-slate-200 px-3">
                                      {canEditQuoteFees ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => setEditingQuoteFee(row)}
                                            className="mr-3 font-bold text-[#004bb1] hover:underline"
                                          >
                                            编辑
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setDeletingQuoteFee(row)}
                                            className="font-bold text-red-500 hover:underline"
                                          >
                                            删除
                                          </button>
                                        </>
                                      ) : (
                                        <span className="text-slate-300">-</span>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={10} className="h-24 border border-slate-200 text-center text-slate-300">
                                    <FileText className="mx-auto mb-2 h-8 w-8 text-slate-200" />
                                    暂无数据
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    )}

                    {downstreamDetailTab === '货箱信息' && (
                      <section className="rounded-md bg-white p-4 shadow-sm">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <h3 className="text-sm font-bold text-slate-950">货箱信息</h3>
                          <button
                            type="button"
                            onClick={() => openTransferPanel(activeOrder)}
                            className="rounded border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            转单号
                          </button>
                        </div>

                        <div className="overflow-x-auto border border-slate-200">
                          <table className="w-full min-w-[1120px] table-fixed border-collapse text-[11px]">
                            <thead className="bg-slate-50 text-slate-700">
                              <tr>
                                <th className="w-10 border border-slate-200 px-2 py-2 text-center">
                                  <input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" />
                                </th>
                                <th className="w-44 border border-slate-200 px-3 py-2 text-left">货箱号</th>
                                <th className="w-32 border border-slate-200 px-3 py-2 text-left">客户数据</th>
                                <th className="w-36 border border-slate-200 px-3 py-2 text-left">系统拣货（材重/实重）</th>
                                <th className="w-32 border border-slate-200 px-3 py-2 text-left">承运商</th>
                                <th className="w-24 border border-slate-200 px-3 py-2 text-left">快递标</th>
                                <th className="w-40 border border-slate-200 px-3 py-2 text-left">仓库回填转单号</th>
                                <th className="w-28 border border-slate-200 px-3 py-2 text-left">17网状态</th>
                                <th className="w-28 border border-slate-200 px-3 py-2 text-left">状态</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getTransitCargoBoxRows(activeOrder).map((row) => (
                                <tr key={row.boxNo} className="h-20 text-slate-700">
                                  <td className="border border-slate-200 px-2 py-2 text-center align-middle">
                                    <input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" />
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2 align-middle font-mono">
                                    <div>{row.boxNo}</div>
                                    <div className="mt-1 text-slate-500">{row.customerTracking}</div>
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2 align-middle">
                                    {row.customerData.map((item) => (
                                      <div key={item}>{item}</div>
                                    ))}
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2 align-middle">
                                    {row.systemWeight.map((item) => (
                                      <div key={item}>{item}</div>
                                    ))}
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2 align-middle">
                                    <div>{row.carrier || '-'}</div>
                                    {row.transferNo && <div className="mt-1 font-mono text-slate-500">{row.transferNo}</div>}
                                  </td>
                                  <td className="border border-slate-200 px-3 py-2 align-middle text-slate-400">-</td>
                                  <td className="border border-slate-200 px-3 py-2 align-middle font-mono">{row.warehouseReturnNo}</td>
                                  <td className="border border-slate-200 px-3 py-2 align-middle">{row.networkStatus}</td>
                                  <td className="border border-slate-200 px-3 py-2 align-middle text-slate-500">{row.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    )}

                    {downstreamDetailTab === '其它信息' && (
                      <section className="rounded-md bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-950">其它信息</h3>
                          <button
                            type="button"
                            onClick={() => openAttachmentModal()}
                            className="rounded border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            上传附件
                          </button>
                        </div>
                        <div className="overflow-x-auto border border-slate-200">
                          <table className="w-full min-w-[920px] table-fixed border-collapse text-[11px]">
                            <thead className="bg-slate-50 text-slate-600">
                              <tr>
                                {['附件名称', '附件类型', '客户可见', '文件大小', '上传人', '上传时间', '操作'].map((head) => (
                                  <th key={head} className="border border-slate-200 px-3 py-2 text-left font-semibold">
                                    {head}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {activeAttachmentRows.length > 0 ? (
                                activeAttachmentRows.map((row) => (
                                  <tr key={row.id} className="h-10 text-slate-700 odd:bg-white even:bg-slate-50/70">
                                    <td className="border border-slate-200 px-3">{row.name}</td>
                                    <td className="border border-slate-200 px-3">{row.type}</td>
                                    <td className="border border-slate-200 px-3">{row.customerVisible}</td>
                                    <td className="border border-slate-200 px-3">{row.fileSize}</td>
                                    <td className="border border-slate-200 px-3">{row.uploadedBy}</td>
                                    <td className="border border-slate-200 px-3 font-mono text-slate-500">{row.uploadedAt}</td>
                                    <td className="border border-slate-200 px-3">
                                      <button
                                        type="button"
                                        onClick={() => openAttachmentModal(row)}
                                        className="mr-3 font-bold text-[#004bb1] hover:underline"
                                      >
                                        编辑
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => addToast(`正在下载 ${row.name}`, 'info')}
                                        className="mr-3 font-bold text-[#004bb1] hover:underline"
                                      >
                                        下载
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setDeletingAttachment(row)}
                                        className="font-bold text-red-500 hover:underline"
                                      >
                                        删除
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={7} className="h-24 border border-slate-200 text-center text-slate-300">
                                    <FileText className="mx-auto mb-2 h-8 w-8 text-slate-200" />
                                    暂无附件
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    )}
                  </div>
                </>
              )}

              {usesOrderFormTemplate(activeOrder.status) && (
                <section className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-950">货箱信息</h3>
                    <div className="text-xs font-bold text-orange-500">
                      申报币种：USD · 总申报价值：0
                    </div>
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-700">
                    <span className="font-bold text-slate-900">
                      <span className="text-red-500">*</span>材质
                    </span>
                    {cargoMaterialOptions.map((item) => (
                      <label key={item} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <input
                          type="checkbox"
                          readOnly
                          checked={cargoMaterialChecked.has(item)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="mb-3 rounded bg-blue-600 px-5 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    新增10行
                  </button>

                  <div className="overflow-x-auto border border-slate-200">
                    <table className="w-full min-w-[2480px] table-fixed border-collapse text-[11px] text-slate-700">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="w-12 border border-slate-200 px-2 py-2 text-center">#</th>
                          <th className="w-12 border border-slate-200 px-2 py-2 text-center">
                            <input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" />
                          </th>
                          <th className="w-52 border border-slate-200 px-3 py-2 text-center">FBA/IBR箱号</th>
                          <th className="w-36 border border-slate-200 px-3 py-2 text-center">PO Number</th>
                          <th className="w-48 border border-slate-200 px-3 py-2 text-center">产品英文名</th>
                          <th className="w-48 border border-slate-200 px-3 py-2 text-center">产品中文名</th>
                          <th className="w-32 border border-slate-200 px-3 py-2 text-center">产品申报单价</th>
                          <th className="w-32 border border-slate-200 px-3 py-2 text-center">产品申报数量</th>
                          <th className="w-32 border border-slate-200 px-3 py-2 text-center">产品申报总价</th>
                          <th className="w-32 border border-slate-200 px-3 py-2 text-center">产品材质</th>
                          <th className="w-36 border border-slate-200 px-3 py-2 text-center">产品海关编码</th>
                          <th className="w-40 border border-slate-200 px-3 py-2 text-center">产品用途</th>
                          <th className="w-36 border border-slate-200 px-3 py-2 text-center">产品品牌</th>
                          <th className="w-36 border border-slate-200 px-3 py-2 text-center">产品型号</th>
                          <th className="w-44 border border-slate-200 px-3 py-2 text-center">产品图片链接</th>
                          <th className="w-44 border border-slate-200 px-3 py-2 text-center">产品销售链接</th>
                          <th className="w-32 border border-slate-200 px-3 py-2 text-center">货箱重量(KG)</th>
                          <th className="w-32 border border-slate-200 px-3 py-2 text-center">货箱长度(CM)</th>
                          <th className="w-32 border border-slate-200 px-3 py-2 text-center">货箱宽度(CM)</th>
                          <th className="w-32 border border-slate-200 px-3 py-2 text-center">货箱高度(CM)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 12 }).map((_, index) => {
                          const row = cargoInfoRows[index];
                          return (
                            <tr key={index} className="h-8">
                              <td className="border border-slate-200 px-2 text-center text-slate-500">{index + 1}</td>
                              <td className="border border-slate-200 px-2 text-center">
                                <input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" />
                              </td>
                              <td className="border border-slate-200 px-3 text-center font-mono">{row?.boxNo || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.poNumber || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.englishName || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.chineseName || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.declaredPrice || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.declaredQty || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.declaredTotal || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.material || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.hsCode || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.usage || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.brand || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.model || ''}</td>
                              <td className="truncate border border-slate-200 px-3 text-center text-blue-600">{row?.imageUrl || ''}</td>
                              <td className="truncate border border-slate-200 px-3 text-center text-blue-600">{row?.salesUrl || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.boxWeight || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.boxLength || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.boxWidth || ''}</td>
                              <td className="border border-slate-200 px-3 text-center">{row?.boxHeight || ''}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {usesOrderFormTemplate(activeOrder.status) && (
              <section className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h3 className="mb-4 pl-3 text-sm font-bold text-slate-950">操作指令</h3>
                  <button
                    type="button"
                    onClick={() => openFeeSelector('instruction')}
                    className="mb-5 ml-3 rounded bg-blue-600 px-7 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                  >
                  新增
                </button>
                <table className="w-full table-fixed border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-900">
                    <tr>
                      {['费用名称', '费用类型', '*计费单位', '*计费单价（元）', '*计费数量', '*币种', '总价（元）', '添加时间', '添加人', '描述', '操作'].map((head) => (
                        <th key={head} className="border border-slate-200 px-3 py-3 text-center font-bold">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {instructionRows.length > 0 ? (
                      instructionRows.map((row) => (
                        <tr key={row.code} className="h-9 text-slate-700">
                          <td className="border border-slate-200 px-3 text-center">{row.name}</td>
                          <td className="border border-slate-200 px-3 text-center">{row.type}</td>
                          <td className="border border-slate-200 px-3 text-center">{row.unit}</td>
                          <td className="border border-slate-200 px-3 text-center">{row.price}</td>
                          <td className="border border-slate-200 px-3 text-center">{row.quantity || '1'}</td>
                          <td className="border border-slate-200 px-3 text-center">{row.currency}</td>
                          <td className="border border-slate-200 px-3 text-center">{Number(row.price || 0) * Number(row.quantity || 1)}</td>
                          <td className="border border-slate-200 px-3 text-center">2026-07-08 18:30:00</td>
                          <td className="border border-slate-200 px-3 text-center">天朗（付豪）</td>
                          <td className="border border-slate-200 px-3 text-center">{row.description}</td>
                          <td className="border border-slate-200 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => setEditingInstruction(row)}
                              className="mr-3 font-semibold text-blue-600 hover:underline"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingInstruction(row)}
                              className="font-semibold text-red-500 hover:underline"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={11} className="h-24 border border-slate-200 text-center text-slate-300">
                          <FileText className="mx-auto mb-2 h-8 w-8 text-slate-200" />
                          暂无数据
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
              )}

              {showInstructionModal && (
                <div className="absolute inset-0 z-[90] bg-black/50">
                  <div className="absolute right-0 top-0 flex h-full w-[72vw] min-w-[980px] flex-col bg-white shadow-2xl">
                    <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-8">
                      <h3 className="text-sm font-bold text-slate-950">{feeModalTarget === 'quote' ? '添加报价费用明细' : '添加指令'}</h3>
                      <button
                        type="button"
                        onClick={() => setShowInstructionModal(false)}
                        className="rounded p-1 text-slate-600 hover:bg-slate-100"
                        aria-label="关闭添加指令"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-auto bg-[#f3f7fd] p-4">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="mb-4 grid grid-cols-[auto_220px_auto_220px_auto_auto] items-center gap-4 text-xs">
                          <span className="font-bold text-slate-900">费用名称：</span>
                          <input className={fieldClass} placeholder="请输入代码/名称" />
                          <span className="font-bold text-slate-900">费用类型：</span>
                          <select className={fieldClass} defaultValue="">
                            <option value="">请选择费用类型</option>
                            <option>仓储费</option>
                            <option>操作费</option>
                          </select>
                          <button className="h-8 rounded bg-blue-600 px-8 text-xs font-bold text-white hover:bg-blue-700" type="button">
                            搜索
                          </button>
                          <button className="h-8 rounded border border-slate-300 bg-white px-8 text-xs font-semibold text-slate-700 hover:bg-slate-50" type="button">
                            重置
                          </button>
                        </div>

                        <table className="w-full table-fixed border-collapse text-xs">
                          <thead className="bg-slate-50 text-slate-900">
                            <tr>
                              <th className="w-12 border border-slate-200 px-2 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedFeeCodes.length === instructionFeeRows.length}
                                  onChange={(event) => setSelectedFeeCodes(event.target.checked ? instructionFeeRows.map((row) => row.code) : [])}
                                  className="h-3.5 w-3.5 rounded border-slate-300"
                                />
                              </th>
                              {['费用代码', '费用名称', '费用类型', '计费单位', '计费单价', '币种', '描述'].map((head) => (
                                <th key={head} className="border border-slate-200 px-3 py-2 text-center font-bold">
                                  {head}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from({ length: 18 }).map((_, index) => {
                              const row = instructionFeeRows[index];
                              const isSelectedFee = !!row && selectedFeeCodes.includes(row.code);
                              return (
                                <tr key={index} className={`h-8 ${index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}>
                                  <td className="border border-slate-200 px-2 text-center">
                                    <input
                                      type="checkbox"
                                      disabled={!row}
                                      checked={isSelectedFee}
                                      onChange={() => row && toggleFeeCode(row.code)}
                                      className="h-3.5 w-3.5 rounded border-slate-300"
                                    />
                                  </td>
                                  <td className="border border-slate-200 px-3 text-center font-mono">{row?.code || ''}</td>
                                  <td className="border border-slate-200 px-3 text-center">{row?.name || ''}</td>
                                  <td className="border border-slate-200 px-3 text-center">{row?.type || ''}</td>
                                  <td className="border border-slate-200 px-3 text-center">{row?.unit || ''}</td>
                                  <td className="border border-slate-200 px-3 text-center">{row?.price || ''}</td>
                                  <td className="border border-slate-200 px-3 text-center">{row?.currency || ''}</td>
                                  <td className="border border-slate-200 px-3 text-center">{row?.description || ''}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                          <span>已选中{selectedFeeCodes.length}条</span>
                          <div className="flex items-center gap-2">
                            <span>共 50 条</span>
                            {[1, 2, 3, 4, 5].map((page) => (
                              <button
                                key={page}
                                type="button"
                                className={`h-7 w-7 rounded border text-xs ${page === 1 ? 'border-slate-700 bg-slate-700 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
                              >
                                {page}
                              </button>
                            ))}
                            <span>...</span>
                            <button type="button" className="h-7 rounded border border-slate-200 bg-white px-2 text-xs">50</button>
                            <select className="h-7 rounded border border-slate-200 bg-white px-2 text-xs" defaultValue="10">
                              <option value="10">10/页</option>
                              <option value="20">20/页</option>
                            </select>
                            <span>转到</span>
                            <input className="h-7 w-12 rounded border border-slate-200 px-2 text-xs" defaultValue="8" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex h-14 shrink-0 items-center justify-center gap-5 border-t border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={confirmInstructionFees}
                        className="rounded bg-blue-600 px-8 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        确认
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowInstructionModal(false)}
                        className="rounded border border-slate-300 bg-white px-8 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {editingInstruction && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50">
                  <div className="w-[520px] bg-white shadow-2xl">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">编辑费用项</h3>
                    </div>
                    <div className="space-y-4 px-12 py-6 text-xs">
                      <FormRow label="费用代码" requiredMark>
                        <input className={`${fieldClass} bg-slate-100`} value={editingInstruction.code} readOnly />
                      </FormRow>
                      <FormRow label="费用名称" requiredMark>
                        <input className={`${fieldClass} bg-slate-100`} value={editingInstruction.name} readOnly />
                      </FormRow>
                      <FormRow label="费用类型" requiredMark>
                        <select
                          className={fieldClass}
                          value={editingInstruction.type}
                          onChange={(event) => setEditingInstruction({ ...editingInstruction, type: event.target.value })}
                        >
                          <option>仓储费</option>
                          <option>操作费</option>
                        </select>
                      </FormRow>
                      <FormRow label="计费单位" requiredMark>
                        <select
                          className={fieldClass}
                          value={editingInstruction.unit}
                          onChange={(event) => setEditingInstruction({ ...editingInstruction, unit: event.target.value })}
                        >
                          <option>票</option>
                          <option>箱</option>
                          <option>KG</option>
                        </select>
                      </FormRow>
                      <FormRow label="计费单价" requiredMark>
                        <input
                          className={fieldClass}
                          value={editingInstruction.price}
                          onChange={(event) => setEditingInstruction({ ...editingInstruction, price: event.target.value })}
                        />
                      </FormRow>
                      <FormRow label="计费数量" requiredMark>
                        <input
                          className={fieldClass}
                          value={editingInstruction.quantity || '1'}
                          onChange={(event) => setEditingInstruction({ ...editingInstruction, quantity: event.target.value })}
                        />
                      </FormRow>
                      <FormRow label="币种" requiredMark>
                        <select
                          className={fieldClass}
                          value={editingInstruction.currency}
                          onChange={(event) => setEditingInstruction({ ...editingInstruction, currency: event.target.value })}
                        >
                          <option>人民币</option>
                          <option>USD</option>
                        </select>
                      </FormRow>
                    </div>
                    <div className="flex justify-end gap-3 px-12 pb-8">
                      <button
                        type="button"
                        onClick={() => setEditingInstruction(null)}
                        className="rounded border border-slate-300 bg-white px-6 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={saveEditingInstruction}
                        className="rounded bg-blue-600 px-6 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {deletingInstruction && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50">
                  <div className="w-[460px] bg-white shadow-2xl">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">删除费用项</h3>
                    </div>
                    <div className="px-10 py-8 text-center text-sm text-slate-800">
                      确定删除费用项“{deletingInstruction.name}”吗？
                    </div>
                    <div className="flex justify-end gap-3 px-8 pb-7">
                      <button
                        type="button"
                        onClick={() => setDeletingInstruction(null)}
                        className="rounded border border-slate-300 bg-white px-6 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={confirmDeleteInstruction}
                        className="rounded bg-blue-600 px-6 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {editingQuoteFee && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50">
                  <div className="w-[520px] bg-white shadow-2xl">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">编辑报价费用明细</h3>
                    </div>
                    <div className="space-y-4 px-12 py-6 text-xs">
                      <FormRow label="费用代码" requiredMark>
                        <input className={`${fieldClass} bg-slate-100`} value={editingQuoteFee.code} readOnly />
                      </FormRow>
                      <FormRow label="费用名称" requiredMark>
                        <input className={`${fieldClass} bg-slate-100`} value={editingQuoteFee.name} readOnly />
                      </FormRow>
                      <FormRow label="费用类型" requiredMark>
                        <select
                          className={fieldClass}
                          value={editingQuoteFee.type}
                          onChange={(event) => setEditingQuoteFee({ ...editingQuoteFee, type: event.target.value })}
                        >
                          <option>仓储费</option>
                          <option>操作费</option>
                        </select>
                      </FormRow>
                      <FormRow label="计费单位" requiredMark>
                        <select
                          className={fieldClass}
                          value={editingQuoteFee.unit}
                          onChange={(event) => setEditingQuoteFee({ ...editingQuoteFee, unit: event.target.value })}
                        >
                          <option>票</option>
                          <option>箱</option>
                          <option>KG</option>
                          <option>哈哈</option>
                        </select>
                      </FormRow>
                      <FormRow label="计费单价" requiredMark>
                        <input
                          className={fieldClass}
                          value={editingQuoteFee.price}
                          onChange={(event) => setEditingQuoteFee({ ...editingQuoteFee, price: event.target.value })}
                        />
                      </FormRow>
                      <FormRow label="计费数量" requiredMark>
                        <input
                          className={fieldClass}
                          value={editingQuoteFee.quantity}
                          onChange={(event) => setEditingQuoteFee({ ...editingQuoteFee, quantity: event.target.value })}
                        />
                      </FormRow>
                      <FormRow label="币种" requiredMark>
                        <select
                          className={fieldClass}
                          value={editingQuoteFee.currency}
                          onChange={(event) => setEditingQuoteFee({ ...editingQuoteFee, currency: event.target.value, exchangeRate: getExchangeRate(event.target.value) })}
                        >
                          <option>人民币</option>
                          <option>美元</option>
                        </select>
                      </FormRow>
                      <FormRow label="汇率">
                        <input className={`${fieldClass} bg-slate-100`} value={getExchangeRate(editingQuoteFee.currency)} readOnly />
                      </FormRow>
                    </div>
                    <div className="flex justify-end gap-3 px-12 pb-8">
                      <button
                        type="button"
                        onClick={() => setEditingQuoteFee(null)}
                        className="rounded border border-slate-300 bg-white px-6 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={saveEditingQuoteFee}
                        className="rounded bg-blue-600 px-6 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {deletingQuoteFee && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50">
                  <div className="w-[460px] bg-white shadow-2xl">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">删除报价费用明细</h3>
                    </div>
                    <div className="px-10 py-8 text-center text-sm text-slate-800">
                      确定删除报价费用“{deletingQuoteFee.name}”吗？
                    </div>
                    <div className="flex justify-end gap-3 px-8 pb-7">
                      <button
                        type="button"
                        onClick={() => setDeletingQuoteFee(null)}
                        className="rounded border border-slate-300 bg-white px-6 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={confirmDeleteQuoteFee}
                        className="rounded bg-blue-600 px-6 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showAttachmentModal && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50">
                  <div className="w-[520px] bg-white shadow-2xl">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">{editingAttachment ? '编辑附件' : '上传附件'}</h3>
                    </div>
                    <div className="space-y-5 px-10 py-6 text-xs text-slate-700">
                      <div className="flex items-start gap-3">
                        <span className="w-24 shrink-0 pt-2 text-right font-bold text-slate-900">
                          <span className="text-red-500">* </span>文件附件：
                        </span>
                        <div className="min-w-0 flex-1">
                          <label className="inline-flex h-8 cursor-pointer items-center rounded bg-[#004bb1] px-5 text-xs font-bold text-white hover:bg-[#003b91]">
                            点击上传
                            <input
                              type="file"
                              className="hidden"
                              onChange={(event) => handleAttachmentFileChange(event.target.files?.[0])}
                            />
                          </label>
                          <div className="mt-3 text-[11px] text-slate-500">文件大小不超过250M</div>
                          <div className="mt-2 text-[11px] font-semibold text-red-500">若为报关件资料，文件类型请选择“报关资料”</div>
                          {attachmentForm.fileName && (
                            <div className="mt-3 flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2">
                              <span className="min-w-0 flex-1 truncate">{attachmentForm.fileName}</span>
                              <span className="text-slate-400">{attachmentForm.fileSize || '-'}</span>
                              <button
                                type="button"
                                onClick={() => setAttachmentForm((prev) => ({ ...prev, fileName: '', fileSize: '' }))}
                                className="font-bold text-red-500 hover:underline"
                              >
                                删除
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <label className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-right font-bold text-slate-900">
                          <span className="text-red-500">* </span>文件类型：
                        </span>
                        <select
                          className={`${fieldClass} min-w-0 flex-1`}
                          value={attachmentForm.type}
                          onChange={(event) => setAttachmentForm((prev) => ({ ...prev, type: event.target.value }))}
                        >
                          {attachmentTypeOptions.map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </label>

                      <div className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-right font-bold text-slate-900">
                          <span className="text-red-500">* </span>客户是否可见：
                        </span>
                        {(['不可见', '可见'] as const).map((option) => (
                          <label key={option} className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name="attachmentCustomerVisible"
                              checked={attachmentForm.customerVisible === option}
                              onChange={() => setAttachmentForm((prev) => ({ ...prev, customerVisible: option }))}
                              className="h-3.5 w-3.5 text-blue-600"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-slate-200 px-10 py-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachmentModal(false);
                          setEditingAttachment(null);
                          setAttachmentForm(emptyAttachmentForm);
                        }}
                        className="rounded border border-slate-300 bg-white px-7 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={saveAttachment}
                        className="rounded bg-blue-600 px-7 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {deletingAttachment && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50">
                  <div className="w-[460px] bg-white shadow-2xl">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">删除附件</h3>
                    </div>
                    <div className="px-10 py-8 text-center text-sm text-slate-800">
                      确定删除附件“{deletingAttachment.name}”吗？
                    </div>
                    <div className="flex justify-end gap-3 px-8 pb-7">
                      <button
                        type="button"
                        onClick={() => setDeletingAttachment(null)}
                        className="rounded border border-slate-300 bg-white px-6 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={confirmDeleteAttachment}
                        className="rounded bg-blue-600 px-6 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {transferPanelOpen && activeOrder && (
                <div className="absolute right-0 top-0 z-[95] h-full w-[31vw] min-w-[560px] max-w-[680px] overflow-hidden bg-white shadow-2xl">
                  <div className="flex h-10 items-center border-b border-slate-200 bg-white px-4">
                    <span className="mr-2 h-5 w-1 rounded bg-slate-900" />
                    <h3 className="text-[15px] font-bold text-slate-900">转单号</h3>
                  </div>

                  <div className="relative h-[calc(100%-40px)] bg-white px-5 py-4">
                    <div className="pointer-events-none absolute inset-0 select-none overflow-hidden text-[12px] font-semibold text-slate-200/70">
                      {Array.from({ length: 24 }, (_, index) => (
                        <span
                          key={index}
                          className="absolute -rotate-[22deg] whitespace-nowrap"
                          style={{
                            left: `${(index % 3) * 34 + 11}%`,
                            top: `${Math.floor(index / 3) * 14 + 7}%`,
                          }}
                        >
                          管理员2026-06-29
                        </span>
                      ))}
                    </div>

                    <div className="relative z-10 mb-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={saveTransferRows}
                        className="rounded bg-[#004bb1] px-8 py-1.5 text-xs font-bold text-white hover:bg-[#003b91]"
                      >
                        保存
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransferPanelOpen(false)}
                        className="rounded border border-slate-300 bg-white px-8 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        取消
                      </button>
                    </div>

                    <div className="relative z-10 overflow-hidden border border-slate-300 bg-white">
                      <table className="w-full table-fixed border-collapse text-[11px] text-slate-700">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="w-10 border border-slate-300 px-2 py-2 text-center font-semibold"></th>
                            <th className="border border-slate-300 px-3 py-2 text-center font-semibold">系统箱号</th>
                            <th className="border border-slate-300 px-3 py-2 text-center font-semibold">FBA箱号</th>
                            <th className="border border-slate-300 px-3 py-2 text-center font-semibold">承运公司</th>
                            <th className="border border-slate-300 px-3 py-2 text-center font-semibold">转单号</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getTransferRows(activeOrder).map((row, index) => (
                            <tr key={`${row.systemBoxNo || 'empty'}-${index}`} className="h-7">
                              <td className="border border-slate-300 bg-slate-50 px-2 text-center font-mono text-slate-600">
                                {index + 1}
                              </td>
                              <td className="border border-slate-300 px-2">
                                <input
                                  readOnly
                                  value={row.systemBoxNo}
                                  className="h-6 w-full border-0 bg-transparent px-1 text-[11px] text-slate-700 outline-none"
                                />
                              </td>
                              <td className="border border-slate-300 px-2">
                                <input
                                  readOnly
                                  value={row.fbaBoxNo}
                                  className="h-6 w-full border-0 bg-transparent px-1 text-[11px] text-slate-700 outline-none"
                                />
                              </td>
                              <td className="border border-slate-300 px-2">
                                <input
                                  value={row.carrierCompany}
                                  onChange={(event) => updateTransferDraft(activeOrderKey, index, 'carrierCompany', event.target.value)}
                                  placeholder={row.systemBoxNo || row.fbaBoxNo ? '请输入' : ''}
                                  className="h-6 w-full border-0 bg-transparent px-1 text-[11px] text-slate-700 outline-none focus:bg-blue-50"
                                />
                              </td>
                              <td className="border border-slate-300 px-2">
                                <input
                                  value={row.transferNo}
                                  onChange={(event) => updateTransferDraft(activeOrderKey, index, 'transferNo', event.target.value)}
                                  placeholder={row.systemBoxNo || row.fbaBoxNo ? '请输入' : ''}
                                  className="h-6 w-full border-0 bg-transparent px-1 text-[11px] font-semibold text-slate-700 outline-none focus:bg-blue-50"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeLogOrder && (
        <OrderLogDrawer
          row={activeLogOrder}
          extraLogs={quoteLogsByOrder[getOrderKey(activeLogOrder)] || []}
          onClose={() => setActiveLogOrder(null)}
        />
      )}
    </div>
  );
}
