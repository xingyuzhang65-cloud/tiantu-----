import React, { useEffect, useState } from 'react';
import {
  FileText,
  Search,
  X,
} from 'lucide-react';

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
  orderSeq?: number;
  transferNo?: string;
  latestRoute?: string;
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

interface AddressFormState {
  orderType: string;
  warehouseCode: string;
  zipCode: string;
  consignee: string;
  phone: string;
  city: string;
  state: string;
  company: string;
  addressDetail: string;
  remark: string;
}

const overseasTransitNodes = ['未下单', '待确认', '已下单', '转运中', '签收'];
const emptyAddressForm: AddressFormState = {
  orderType: 'FBA',
  warehouseCode: '',
  zipCode: '',
  consignee: '',
  phone: '',
  city: '',
  state: '',
  company: '',
  addressDetail: '',
  remark: '',
};

const warehouseAddressBook: Record<string, Omit<AddressFormState, 'orderType' | 'warehouseCode' | 'phone' | 'company' | 'remark'>> = {
  PSC2: {
    zipCode: '99301',
    consignee: 'PSC2',
    city: 'PASCO',
    state: 'WA',
    addressDetail: '1351 S Road 40 E',
  },
  ONT8: {
    zipCode: '92551',
    consignee: 'ONT8',
    city: 'MORENO VALLEY',
    state: 'CA',
    addressDetail: '24300 Nandina Ave',
  },
  ABE2: {
    zipCode: '18031',
    consignee: 'ABE2',
    city: 'BREINIGSVILLE',
    state: 'PA',
    addressDetail: '705 Boulder Dr',
  },
  FTW1: {
    zipCode: '75241',
    consignee: 'FTW1',
    city: 'DALLAS',
    state: 'TX',
    addressDetail: '33333 LBJ Freeway',
  },
};

const transitRows: OverseasTransitRow[] = [
  {
    id: 'USSZAS2508261001',
    fbaCode: 'FBACTES1617',
    customerName: '深圳天图电子有限公司',
    destination: '美国',
    channel: '美森正班13日达-卡派包税',
    orderSeq: 1,
    transferNo: '1Z0VV966030991',
    latestRoute: '深圳仓-美国海外仓-OUT',
    warehouseCode: 'ONT8',
    zipCode: '92551',
    orderType: 'FBA',
    salesman: '安一',
    merchandiser: '安逸',
    status: '转运中',
    packages: 12,
    weight: '486.2kg',
    volume: '2.46',
    inboundTime: '2026-08-26 10:21',
  },
  {
    id: 'USSZAS2508261002',
    fbaCode: 'FBACTEE1741',
    customerName: '博创跨境贸易',
    destination: '美国',
    channel: '美线海卡',
    orderSeq: 2,
    transferNo: '888711227145',
    latestRoute: '深圳仓-美国海外仓-OUT',
    warehouseCode: 'PSC2',
    zipCode: '99301',
    orderType: 'Walmart',
    salesman: '安一',
    merchandiser: '安逸',
    status: '转运中',
    packages: 8,
    weight: '312.8kg',
    volume: '1.84',
    inboundTime: '2026-08-26 11:05',
  },
  {
    id: 'USSZAS2508261003',
    fbaCode: 'FBACTES1617',
    customerName: '星链家居出口部',
    destination: '美国',
    channel: '美森正班13日达-卡派包税',
    orderSeq: 1,
    transferNo: '1Z0VV966030992',
    latestRoute: '深圳仓-美国海外仓-OUT',
    warehouseCode: 'ABE2',
    zipCode: '18031',
    orderType: 'FBA',
    salesman: '天朗',
    merchandiser: '李客服',
    status: '待确认',
    packages: 5,
    weight: '159.4kg',
    volume: '0.92',
    inboundTime: '2026-08-26 13:47',
  },
  {
    id: 'USSZAS2508261004',
    fbaCode: 'FBACTEST937',
    customerName: '上海豪迅美中快递中心',
    destination: '美国',
    channel: '美线海派',
    orderSeq: 1,
    transferNo: '8851511973',
    latestRoute: '深圳仓-美国海外仓-OUT',
    warehouseCode: 'FTW1',
    zipCode: '75241',
    orderType: '私人地址',
    salesman: '张运营',
    merchandiser: '安逸',
    status: '转运中',
    packages: 16,
    weight: '526.0kg',
    volume: '3.12',
    inboundTime: '2026-08-26 15:18',
  },
  {
    id: 'USSZAS2508261005',
    fbaCode: 'FBA18HL83QJ0',
    customerName: '英国海航直运有限公司',
    destination: '美国',
    channel: '美线海卡',
    orderSeq: 1,
    transferNo: '885151176528',
    latestRoute: '深圳仓-美国海外仓-OUT',
    warehouseCode: 'PSC2',
    zipCode: '99301',
    orderType: 'TikTok',
    salesman: '天朗',
    merchandiser: '李客服',
    status: '签收',
    packages: 7,
    weight: '205.7kg',
    volume: '1.23',
    inboundTime: '2026-08-26 16:04',
  },
  {
    id: 'USSZAS2508261006',
    fbaCode: 'FBA18HLGVVK6',
    customerName: '常晟供应链集团',
    destination: '美国',
    channel: '美森正班13日达-卡派包税',
    orderSeq: 1,
    transferNo: '1Z0VV966030993',
    latestRoute: '深圳仓-美国海外仓-OUT',
    warehouseCode: 'ONT8',
    zipCode: '92551',
    orderType: 'FBA',
    salesman: '张运营',
    merchandiser: '安逸',
    status: '已下单',
    packages: 10,
    weight: '398.5kg',
    volume: '2.08',
    inboundTime: '2026-08-26 17:32',
  },
  {
    id: 'USSZAS2508261007',
    fbaCode: 'FBACTEE9991',
    customerName: '东莞跨境贸易样品客户',
    destination: '美国',
    channel: '美线空派',
    transferNo: '8851511973',
    latestRoute: '深圳仓-美国海外仓-OUT',
    warehouseCode: 'PSC2',
    salesman: '天朗',
    merchandiser: '李客服',
    status: '未下单',
    packages: 3,
    weight: '88.0kg',
    volume: '0.41',
    inboundTime: '2026-08-26 18:09',
  },
];

const fieldClass =
  'h-8 w-full rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
const labelClass = 'w-28 shrink-0 text-right text-xs font-bold text-slate-900';
const required = <span className="text-red-500">* </span>;
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

const downstreamDetailTabs = ['报价', '运单踪迹', '附件'] as const;

const quoteFeeRows = [
  { name: '哈哈', price: '1.89', currency: '美元', exchangeRate: '7.014', unit: '哈哈', quantity: '1票', amount: '13.26', addedAt: '2026-06-05 14:28:00', addedBy: '天未' },
];

const shipmentTraceRows = [
  { time: '2026-08-26 17:32:00', node: '已下单', content: '海外仓运单已生成', operator: '安逸' },
  { time: '2026-08-26 18:10:00', node: '转运中', content: '美国海外仓-OUT', operator: '系统' },
];

const attachmentRows = [
  { name: '快递标.pdf', type: '快递标', uploadedAt: '2026-08-26 17:36:00', uploadedBy: '安逸' },
];

type InstructionFeeRow = (typeof instructionFeeRows)[number] & {
  quantity?: string;
};

type DownstreamDetailTab = (typeof downstreamDetailTabs)[number];

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
  const match = row.inboundTime.match(/^\d{4}-(\d{2})-(\d{2})/);
  const monthDay = match ? `${match[1]}${match[2]}` : '0000';
  return `${row.id}_${monthDay}_${row.orderSeq || 1}`;
};

export default function OverseasTransitOrderPage({ addToast, activeNode = '未下单', onNodeChange }: OverseasTransitOrderPageProps) {
  const [activeTab, setActiveTab] = useState(activeNode);
  const [selectedIds, setSelectedIds] = useState<string[]>(['USSZAS2508261001', 'USSZAS2508261004', 'USSZAS2508261005']);
  const [activeOrder, setActiveOrder] = useState<OverseasTransitRow | null>(null);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [selectedFeeCodes, setSelectedFeeCodes] = useState<string[]>(instructionFeeRows.slice(0, 3).map((row) => row.code));
  const [instructionRows, setInstructionRows] = useState<InstructionFeeRow[]>([]);
  const [editingInstruction, setEditingInstruction] = useState<InstructionFeeRow | null>(null);
  const [deletingInstruction, setDeletingInstruction] = useState<InstructionFeeRow | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormState>(emptyAddressForm);
  const [downstreamDetailTab, setDownstreamDetailTab] = useState<DownstreamDetailTab>('报价');
  const filteredRows = transitRows.filter((row) => row.status === activeTab && (row.status !== '未下单' || row.packages > 0));
  const isUnorderedTab = activeTab === '未下单';
  const showOverseasWaybillNo = !isUnorderedTab;

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
    setDownstreamDetailTab('报价');
    setAddressForm(emptyAddressForm);
    addToast(`已打开 ${row.id} 中转下单页面`, 'info');
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
    }));
  };

  return (
    <div className="relative flex-1 overflow-auto bg-slate-100 p-4 font-sans text-slate-700 max-h-[calc(100vh-3rem)]">
      <div className="mb-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-[auto_minmax(180px,1fr)_auto_minmax(180px,1fr)] gap-5 text-xs lg:grid-cols-[auto_minmax(190px,1fr)_auto_minmax(190px,1fr)_auto_minmax(190px,1fr)]">
          <label className="flex items-center gap-3">
            <span className="w-20 text-right font-semibold text-slate-700">头程运单号</span>
            <input className={fieldClass} placeholder="支持批量" />
          </label>
          <label className="flex items-center gap-3">
            <span className="w-20 text-right font-semibold text-slate-700">客户名称</span>
            <select className={fieldClass} defaultValue="">
              <option value="">请选择</option>
              <option>深圳天图电子有限公司</option>
              <option>博创跨境贸易</option>
            </select>
          </label>
          <label className="flex items-center gap-3">
            <span className="w-20 text-right font-semibold text-slate-700">入仓时间</span>
            <select className={fieldClass} defaultValue="">
              <option value="">请选择时间</option>
              <option>今日</option>
              <option>本周</option>
            </select>
          </label>
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
              const selectedCurrentRow = filteredRows.find((row) => selectedIds.includes(row.id));
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
          <button type="button" onClick={() => addToast('已按当前条件刷新列表', 'success')} className="ml-auto flex items-center gap-1 rounded border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <Search className="h-3.5 w-3.5" />
            查询
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200">
          <table className={`w-full ${showOverseasWaybillNo ? 'min-w-[2040px]' : 'min-w-[1680px]'} table-fixed border-collapse text-[11px]`}>
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="w-10 border border-slate-200 px-2 py-2 text-center">
                  <input type="checkbox" readOnly checked={filteredRows.length > 0 && filteredRows.every((row) => selectedIds.includes(row.id))} className="h-3.5 w-3.5 rounded border-slate-300" />
                </th>
                <th className="w-44 border border-slate-200 px-3 py-2 text-center">头程运单号</th>
                {showOverseasWaybillNo && <th className="w-52 border border-slate-200 px-3 py-2 text-center">海外仓运单号</th>}
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">转单号</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">FBA单号</th>
                <th className="w-44 border border-slate-200 px-3 py-2 text-center">客户名称</th>
                <th className="w-52 border border-slate-200 px-3 py-2 text-center">最新路由</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">仓库代码</th>
                {showOverseasWaybillNo && <th className="w-24 border border-slate-200 px-3 py-2 text-center">邮编</th>}
                {showOverseasWaybillNo && <th className="w-28 border border-slate-200 px-3 py-2 text-center">运单类型</th>}
                <th className="w-20 border border-slate-200 px-3 py-2 text-center">目的地</th>
                <th className="w-56 border border-slate-200 px-3 py-2 text-center">服务</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">业务员</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">跟单员</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">剩余件数</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">重量</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">（剩余件）总方数</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">入仓时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  onDoubleClick={() => openOrder(row)}
                  title="双击打开中转下单"
                  className={`h-9 cursor-pointer text-slate-700 hover:bg-blue-50/70 ${selectedIds.includes(row.id) ? 'bg-blue-50/30' : ''}`}
                >
                  <td className="border border-slate-200 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                      onDoubleClick={(event) => event.stopPropagation()}
                      className="h-3.5 w-3.5 rounded border-slate-300"
                    />
                  </td>
                  <td className="border border-slate-200 px-3 text-center font-mono">{row.id}</td>
                  {showOverseasWaybillNo && <td className="border border-slate-200 px-3 text-center font-mono text-blue-600">{getOverseasWaybillNo(row)}</td>}
                  <td className="border border-slate-200 px-3 text-center font-mono">{row.transferNo || '-'}</td>
                  <td className="border border-slate-200 px-3 text-center font-mono">{row.fbaCode}</td>
                  <td className="truncate border border-slate-200 px-3 text-center">{row.customerName}</td>
                  <td className="truncate border border-slate-200 px-3 text-center">{row.latestRoute || '-'}</td>
                  <td className="border border-slate-200 px-3 text-center font-mono">{row.warehouseCode || '-'}</td>
                  {showOverseasWaybillNo && <td className="border border-slate-200 px-3 text-center font-mono">{row.zipCode || '-'}</td>}
                  {showOverseasWaybillNo && <td className="border border-slate-200 px-3 text-center">{row.orderType || '-'}</td>}
                  <td className="border border-slate-200 px-3 text-center">{row.destination}</td>
                  <td className="truncate border border-slate-200 px-3 text-center">{row.channel}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.salesman || '-'}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.merchandiser || '-'}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.packages}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.weight}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.volume}</td>
                  <td className="border border-slate-200 px-3 text-center font-mono text-slate-500">{row.inboundTime}</td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={showOverseasWaybillNo ? 18 : 15} className="h-24 border border-slate-200 text-center text-slate-400">
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
              <h2 className="text-sm font-bold text-slate-950">{activeOrder.status === '未下单' ? '中转下单' : '确认运单信息'}</h2>
              <button type="button" onClick={() => setActiveOrder(null)} className="rounded p-1 text-slate-700 hover:bg-slate-100" aria-label="关闭">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {activeOrder.status === '未下单' ? (
                <>
                  <div className="mb-3 grid grid-cols-4 rounded-2xl border border-slate-200 bg-white px-8 py-5 text-xs">
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
                      <span className="font-bold text-slate-900">备注：</span>
                    </div>
                  </div>

                  <section className="rounded-2xl border border-slate-200 bg-white px-7 py-4">
                    <h3 className="mb-5 text-sm font-bold text-slate-950">收件地址信息</h3>
                    <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                      <div className="col-span-2 flex items-center gap-5 pl-[75px] text-xs text-slate-700">
                        <span className="font-bold text-slate-900">{required}运单类型：</span>
                        {['FBA', 'Walmart', 'TikTok', '私人地址'].map((type) => (
                          <label key={type} className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name="orderType"
                              checked={addressForm.orderType === type}
                              onChange={() => updateAddressField('orderType', type)}
                              className="h-3.5 w-3.5 text-blue-600"
                            />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>

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
                            {Object.keys(warehouseAddressBook).map((code) => (
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
                        label="备注"
                        placeholder="请输入备注"
                        limit={`${addressForm.remark.length}/500`}
                        value={addressForm.remark}
                        onChange={(value) => updateAddressField('remark', value)}
                      />
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-950 shadow-sm">
                    <h3 className="mb-7 text-sm font-bold text-slate-950">基础信息</h3>
                    <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr_1.15fr] gap-x-16 gap-y-6">
                      <DetailField label="运单号" highlight>{getOverseasWaybillNo(activeOrder)}</DetailField>
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
                      <DetailField label="柜号">YWSF11121453</DetailField>
                      <DetailField label="邮编">{activeOrder.zipCode || '-'}</DetailField>
                      <DetailField label="邮箱">customer@tiantu.com</DetailField>
                      <DetailField label="入仓时间">{activeOrder.inboundTime}</DetailField>
                      <DetailField label="业务员">{activeOrder.salesman || '-'}</DetailField>
                      <DetailField label="跟单员">{activeOrder.merchandiser || '-'}</DetailField>
                      <DetailField label="客户备注">1543767</DetailField>
                      <DetailField label="海外仓备注">1231231</DetailField>
                      <DetailField label="快递标">
                        <button className="font-bold text-[#004bb1] hover:underline" type="button">打印</button>
                        <span className="ml-2 rounded bg-yellow-300 px-1.5 py-0.5 text-[10px] font-bold leading-none text-amber-700 shadow-sm">24</span>
                      </DetailField>
                    </div>
                  </section>

                  <div className="mt-2 grid grid-cols-3 overflow-hidden rounded border border-slate-200 bg-white text-xs">
                    {downstreamDetailTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setDownstreamDetailTab(tab)}
                        className={`h-8 border-r border-slate-200 text-center font-semibold last:border-r-0 ${
                          downstreamDetailTab === tab ? 'bg-[#1890ff] text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <section className="mt-2 min-h-[300px] rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                    {downstreamDetailTab === '报价' && (
                      <>
                        <h3 className="mb-3 text-sm font-bold text-slate-950">费用明细</h3>
                        <table className="w-full table-fixed border-collapse text-xs">
                          <thead className="bg-slate-50 text-slate-900">
                            <tr>
                              {['费用名称', '单价', '币种', '汇率', '单位', '数量', '金额', '添加时间', '添加人'].map((head) => (
                                <th key={head} className="border border-slate-200 px-3 py-3 text-center font-bold">
                                  {head}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {quoteFeeRows.map((row) => (
                              <tr key={row.name} className="h-11 text-slate-700">
                                <td className="border border-slate-200 px-3 text-center">{row.name}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.price}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.currency}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.exchangeRate}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.unit}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.quantity}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.amount}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.addedAt}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.addedBy}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}

                    {downstreamDetailTab === '运单踪迹' && (
                      <>
                        <h3 className="mb-3 text-sm font-bold text-slate-950">运单踪迹</h3>
                        <table className="w-full table-fixed border-collapse text-xs">
                          <thead className="bg-slate-50 text-slate-900">
                            <tr>
                              {['时间', '节点', '内容', '操作人'].map((head) => (
                                <th key={head} className="border border-slate-200 px-3 py-3 text-center font-bold">
                                  {head}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {shipmentTraceRows.map((row) => (
                              <tr key={`${row.time}-${row.node}`} className="h-10 text-slate-700">
                                <td className="border border-slate-200 px-3 text-center">{row.time}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.node}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.content}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.operator}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}

                    {downstreamDetailTab === '附件' && (
                      <>
                        <h3 className="mb-3 text-sm font-bold text-slate-950">附件</h3>
                        <table className="w-full table-fixed border-collapse text-xs">
                          <thead className="bg-slate-50 text-slate-900">
                            <tr>
                              {['附件名称', '附件类型', '上传时间', '上传人', '操作'].map((head) => (
                                <th key={head} className="border border-slate-200 px-3 py-3 text-center font-bold">
                                  {head}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {attachmentRows.map((row) => (
                              <tr key={row.name} className="h-10 text-slate-700">
                                <td className="border border-slate-200 px-3 text-center">{row.name}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.type}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.uploadedAt}</td>
                                <td className="border border-slate-200 px-3 text-center">{row.uploadedBy}</td>
                                <td className="border border-slate-200 px-3 text-center">
                                  <button type="button" className="font-bold text-[#004bb1] hover:underline">查看</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </section>
                </>
              )}

              {activeOrder.status === '未下单' && (
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

              {activeOrder.status === '未下单' && (
              <section className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h3 className="mb-4 pl-3 text-sm font-bold text-slate-950">操作指令</h3>
                <button
                  type="button"
                  onClick={() => setShowInstructionModal(true)}
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
                      <h3 className="text-sm font-bold text-slate-950">添加指令</h3>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
