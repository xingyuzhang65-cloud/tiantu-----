import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FilePlus2,
  MoreHorizontal,
  PackageCheck,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings2,
  Ship,
  Trash2,
  UploadCloud,
  Warehouse,
  X,
} from 'lucide-react';
import {
  emptyAddressForm,
  overseasOrderTypes,
  overseasWarehouseCodes,
  warehouseAddressBook,
} from './overseasTransitAddress';
import type { AddressFormState } from './overseasTransitAddress';

interface OverseasTransitPageProps {
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  initialView?: 'list' | 'form';
  mode?: 'all' | 'storage';
}

type TransitStatus = '运输中' | '暂存' | '待确认' | '已确认' | '已下单' | '转运中' | '签收' | '暂存已完成' | '驳回' | '取消';

interface OverseasTransitRow {
  headWaybillNo: string;
  transitWaybillNo: string;
  fbaNo: string;
  customerOrderNo: string;
  customer: string;
  transferType: '暂存' | '拦截';
  totalCount: number;
  inventoryCount: number;
  availableCount: number;
  service: string;
  customerRemark: string;
  overseasWarehouseRemark: string;
  salesman: string;
  agent: string;
  inboundAt: string;
  warehouseAt: string;
  status: TransitStatus;
  shippedCount?: number;
  latestRoute?: string;
  routeUpdatedAt?: string;
  transferNo?: string;
  referenceId?: string;
  warehouseCode?: string;
  chargeWeight?: string;
  actualWeight?: string;
  volumetricWeight?: string;
  volumeCbm?: string;
  containerNo?: string;
  zipCode?: string;
}

interface LinkedOrderRow {
  id: string;
  reserveNo: string;
  customerRef: string;
  warehouseCode: string;
  destination: string;
  boxes: number;
  weight: string;
  volume: string;
  service: string;
  status: string;
}

type StorageInstructionRow = {
  id: string;
  feeName: string;
  feeType: string;
  unit: string;
  price: string;
  quantity: string;
  currency: string;
  addedAt: string;
  addedBy: string;
  description: string;
};

type StorageInstructionEditableField = 'feeName' | 'feeType' | 'unit' | 'price' | 'quantity' | 'currency' | 'description';

const statusClass: Record<TransitStatus, string> = {
  运输中: 'bg-blue-50 text-blue-700',
  暂存: 'bg-slate-100 text-slate-700',
  待确认: 'bg-amber-50 text-amber-700',
  已确认: 'bg-emerald-50 text-emerald-700',
  已下单: 'bg-indigo-50 text-indigo-700',
  转运中: 'bg-cyan-50 text-cyan-700',
  签收: 'bg-green-50 text-green-700',
  暂存已完成: 'bg-teal-50 text-teal-700',
  驳回: 'bg-rose-50 text-rose-700',
  取消: 'bg-slate-100 text-slate-500',
};

const allTransitTabs: TransitStatus[] = ['运输中', '暂存', '待确认', '已确认', '已下单', '转运中', '签收', '暂存已完成', '驳回', '取消'];
const storageTransitTabs: TransitStatus[] = ['运输中', '暂存', '暂存已完成'];

const seedTransitRows: OverseasTransitRow[] = [
  {
    headWaybillNo: 'USSZAS2508261001',
    transitWaybillNo: '',
    fbaNo: 'FBACCTES161T',
    customerOrderNo: '',
    customer: '阿里巴巴',
    transferType: '暂存',
    totalCount: 59,
    inventoryCount: 59,
    availableCount: 59,
    service: '美森15日达-快递派',
    customerRemark: '',
    overseasWarehouseRemark: '',
    salesman: '安一',
    agent: '',
    inboundAt: '2025-11-24 00:43',
    warehouseAt: '2025-11-28 10:12',
    status: '运输中',
  },
  {
    headWaybillNo: 'USSZAS2508261002',
    transitWaybillNo: '',
    fbaNo: 'FBACCTEE174T',
    customerOrderNo: '',
    customer: '腾讯科技',
    transferType: '拦截',
    totalCount: 13,
    inventoryCount: 13,
    availableCount: 13,
    service: '美森15日达-卡派包税',
    customerRemark: '',
    overseasWarehouseRemark: '',
    salesman: '安一',
    agent: '',
    inboundAt: '2025-04-17 12:49',
    warehouseAt: '2025-04-16 09:20',
    status: '暂存',
  },
  {
    headWaybillNo: 'USSZAS2508261003',
    transitWaybillNo: '',
    fbaNo: 'FBACCTES161T',
    customerOrderNo: '',
    customer: '华为技术',
    transferType: '暂存',
    totalCount: 71,
    inventoryCount: 71,
    availableCount: 71,
    service: 'OA以星17日达-快递派',
    customerRemark: '',
    overseasWarehouseRemark: '',
    salesman: '安一',
    agent: '',
    inboundAt: '2024-07-23 00:00',
    warehouseAt: '2024-05-10 08:41',
    status: '待确认',
  },
  {
    headWaybillNo: 'USSZAS2508261004',
    transitWaybillNo: '',
    fbaNo: 'FBACCTEST93T',
    customerOrderNo: '',
    customer: '百度在线',
    transferType: '拦截',
    totalCount: 43,
    inventoryCount: 43,
    availableCount: 43,
    service: '美森15日达-卡派包税',
    customerRemark: '',
    overseasWarehouseRemark: '',
    salesman: '安一',
    agent: '张运营',
    inboundAt: '2024-12-12 18:43',
    warehouseAt: '2025-12-10 09:18',
    status: '已下单',
  },
  {
    headWaybillNo: 'USSZAS2508261005',
    transitWaybillNo: '',
    fbaNo: 'FBA18HL83QJ0',
    customerOrderNo: '',
    customer: '京东集团',
    transferType: '拦截',
    totalCount: 79,
    inventoryCount: 79,
    availableCount: 79,
    service: '美森15日达-快递派',
    customerRemark: '',
    overseasWarehouseRemark: '',
    salesman: '安一',
    agent: '',
    inboundAt: '2025-11-14 02:29',
    warehouseAt: '2025-02-13 15:28',
    status: '转运中',
  },
  {
    headWaybillNo: 'USSZAS2508261006',
    transitWaybillNo: '',
    fbaNo: 'FBA18HLGVVK6',
    customerOrderNo: '',
    customer: '小米科技',
    transferType: '暂存',
    totalCount: 48,
    inventoryCount: 48,
    availableCount: 48,
    service: '美森15日达-快递派',
    customerRemark: '',
    overseasWarehouseRemark: '',
    salesman: '安一',
    agent: '',
    inboundAt: '2024-04-12 16:23',
    warehouseAt: '2025-05-16 08:16',
    status: '签收',
  },
  {
    headWaybillNo: 'USSZAS2508261007',
    transitWaybillNo: '',
    fbaNo: 'FBA18HL83QJ1',
    customerOrderNo: '',
    customer: '深圳天图电子有限公司',
    transferType: '暂存',
    totalCount: 36,
    inventoryCount: 0,
    availableCount: 0,
    service: '美森15日达-快递派',
    customerRemark: '客户已确认转出，暂存流程完成',
    overseasWarehouseRemark: '海外仓已完成库存释放',
    salesman: '安一',
    agent: '安逸',
    inboundAt: '2025-12-01 11:26',
    warehouseAt: '2025-12-09 15:42',
    status: '暂存已完成',
  },
];

const makeMockTransitRow = (status: TransitStatus, index: number): OverseasTransitRow => {
  const statusIndex = storageTransitTabs.includes(status)
    ? storageTransitTabs.indexOf(status)
    : allTransitTabs.indexOf(status);
  const totalCount = 18 + ((index * 7) % 62);
  const completed = status === '暂存已完成';
  const inTransit = status === '运输中';
  const availableCount = completed ? 0 : inTransit ? totalCount : Math.max(1, totalCount - (index % 5));

  return {
    headWaybillNo: `USSZAS2607${String(statusIndex + 20).padStart(2, '0')}${String(index + 1).padStart(4, '0')}`,
    transitWaybillNo: '',
    fbaNo: `FBAST${String(statusIndex + 1).padStart(2, '0')}${String(index + 1).padStart(6, '0')}`,
    customerOrderNo: `CO${String(statusIndex + 1)}${String(index + 1).padStart(5, '0')}`,
    customer: ['阿里巴巴', '腾讯科技', '华为技术', '深圳天图电子有限公司', '宁波启航跨境仓储'][index % 5],
    transferType: index % 4 === 0 ? '拦截' : '暂存',
    totalCount,
    inventoryCount: completed ? 0 : totalCount,
    availableCount,
    service: ['美森15日达-快递派', '美森15日达-卡派包税', 'OA以星17日达-快递派', '美线海卡'][index % 4],
    shippedCount: totalCount,
    latestRoute: inTransit ? ['已装柜出港', '抵达洛杉矶港', '等待预约派送', '卡车转运中'][index % 4] : '',
    routeUpdatedAt: inTransit ? `2026-07-${String(10 + (index % 10)).padStart(2, '0')} ${String(9 + (index % 8)).padStart(2, '0')}:30` : '',
    transferNo: inTransit ? `TRK${String(26070000 + index).padStart(8, '0')}` : '',
    referenceId: inTransit ? `REF-FBA-${String(index + 1).padStart(5, '0')}` : '',
    warehouseCode: ['ONT8', 'LAX9', 'GYR3', 'SBD1'][index % 4],
    chargeWeight: String(totalCount * 6),
    actualWeight: String(totalCount * 5.6),
    volumetricWeight: String(totalCount * 6.2),
    volumeCbm: (totalCount * 0.078).toFixed(2),
    containerNo: inTransit ? `TGHU${String(7300000 + index)}` : '',
    zipCode: ['92376', '90001', '85043', '92408'][index % 4],
    customerRemark: completed ? '所有货箱已完成出库' : `mock-${status}-货箱仍按批次管理`,
    overseasWarehouseRemark: completed ? '海外仓已完成库存释放' : '海外仓库存待后续勾选出库',
    salesman: ['安一', '天朗', '张运营'][index % 3],
    agent: ['安逸', '李客服', '张运营', ''][index % 4],
    inboundAt: `2026-07-${String(8 + (index % 10)).padStart(2, '0')} ${String(8 + (index % 9)).padStart(2, '0')}:20`,
    warehouseAt: `2026-07-${String(9 + (index % 10)).padStart(2, '0')} ${String(9 + (index % 8)).padStart(2, '0')}:45`,
    status,
  };
};

const transitRows: OverseasTransitRow[] = [
  ...seedTransitRows,
  ...storageTransitTabs.flatMap((status) => {
    const existingCount = seedTransitRows.filter((row) => row.status === status).length;
    return Array.from({ length: Math.max(0, 10 - existingCount) }, (_, index) => makeMockTransitRow(status, existingCount + index));
  }),
];

const linkedOrders: LinkedOrderRow[] = [
  {
    id: 'HD2607031028',
    reserveNo: 'YLC260703010',
    customerRef: 'FBA19G6M4C7B',
    warehouseCode: 'ONT8',
    destination: '美国 CA',
    boxes: 18,
    weight: '286.40',
    volume: '1.72',
    service: '美线海卡',
    status: '已到预留仓',
  },
  {
    id: 'HD2607031086',
    reserveNo: 'YLC260703011',
    customerRef: 'FBA19X8B7C9D',
    warehouseCode: 'LAX9',
    destination: '美国 CA',
    boxes: 12,
    weight: '168.20',
    volume: '0.96',
    service: '美线空派',
    status: '已到预留仓',
  },
  {
    id: 'HD2607022219',
    reserveNo: 'YLC260702032',
    customerRef: 'FBA24M9V1K3S',
    warehouseCode: 'ONT8',
    destination: '美国 CA',
    boxes: 22,
    weight: '331.70',
    volume: '2.05',
    service: '海外仓一件代发',
    status: '待中转',
  },
];

const fieldClass =
  'h-8 rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
const searchLabelClass = 'w-20 shrink-0 text-right font-semibold text-slate-700';
const searchControlClass = `${fieldClass} min-w-0 flex-1`;
const drawerFieldClass =
  'h-8 w-full rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
const drawerLabelClass = 'w-28 shrink-0 text-right text-xs font-bold text-slate-900';
const instructionInputClass =
  'h-7 w-full rounded border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
const requiredMark = <span className="text-red-500">* </span>;

type SearchField = {
  label: string;
  type: 'input' | 'select';
  placeholder?: string;
  options?: string[];
};

type TransitLogRow = {
  id: string;
  operatedAt: string;
  operator: string;
  action: string;
  field: string;
  before: string;
  after: string;
  note: string;
};

const tableHeaders = ['头程运单号', 'FBA单号', '客户单号', '客户全称', '中转单类型', '总件数', '库存件数', '可用件数', '服务', '客户备注', '海外仓备注', '代理', '入仓时间', '仓租时间', '操作'];
const inTransitStorageHeaders = ['头程运单号', 'FBA单号', '客户单号', '客户全称', '发货件数', '最新路由', '路由更新时间', '转单号', 'ReferenceId', '仓库代码', '业务员', '收费重', '实重', '材积重', '方数', '柜号', '邮编', '服务', '客户备注', '海外仓备注'];

const overseasSearchFields: SearchField[] = [
  { label: '头程运单号', type: 'input', placeholder: '支持批量' },
  { label: 'FBA单号', type: 'input', placeholder: '支持批量' },
  { label: '客户单号', type: 'input', placeholder: '支持批量' },
  { label: '客户全称', type: 'select', options: ['阿里巴巴', '腾讯科技', '华为技术', '深圳天图电子有限公司'] },
  { label: '中转单类型', type: 'select', options: ['暂存', '拦截'] },
  { label: '总件数', type: 'input', placeholder: '请输入' },
  { label: '库存件数', type: 'input', placeholder: '请输入' },
  { label: '可用件数', type: 'input', placeholder: '请输入' },
  { label: '服务', type: 'select', options: ['美森15日达-快递派', '美森15日达-卡派包税', '美线海卡'] },
  { label: '代理', type: 'input', placeholder: '请输入' },
  { label: '入仓时间', type: 'select', options: ['近 7 天', '近 30 天'] },
  { label: '仓租时间', type: 'select', options: ['近 7 天', '近 30 天'] },
  { label: '客户备注', type: 'input', placeholder: '请输入' },
  { label: '海外仓备注', type: 'input', placeholder: '请输入' },
];

const storageSearchFields: SearchField[] = overseasSearchFields;

const getCompletedStorageAddressForm = (row: OverseasTransitRow): AddressFormState => {
  const warehouseCode = overseasWarehouseCodes[0];
  const warehouseAddress = warehouseAddressBook[warehouseCode];

  return {
    ...emptyAddressForm,
    orderType: 'FBA',
    warehouseCode,
    ...(warehouseAddress || {}),
    remark: row.customerRemark,
    overseasWarehouseRemark: row.overseasWarehouseRemark,
  };
};

const formatLocalDateTime = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:00`;
};

const createStorageInstructionRow = (index: number): StorageInstructionRow => ({
  id: `storage-instruction-${Date.now()}-${index}`,
  feeName: '',
  feeType: '操作费',
  unit: '票',
  price: '',
  quantity: '1',
  currency: '人民币',
  addedAt: formatLocalDateTime(),
  addedBy: '管理员',
  description: '',
});

const getTransitLogRows = (row: OverseasTransitRow): TransitLogRow[] => [
  {
    id: `${row.headWaybillNo}-create`,
    operatedAt: row.inboundAt,
    operator: row.agent || '系统',
    action: '创建暂存记录',
    field: '基础信息',
    before: '-',
    after: `${row.customer} / ${row.service}`,
    note: `头程运单 ${row.headWaybillNo} 入仓后生成${row.transferType}记录`,
  },
  {
    id: `${row.headWaybillNo}-inventory`,
    operatedAt: row.warehouseAt,
    operator: '海外仓',
    action: '库存更新',
    field: '库存件数 / 可用件数',
    before: '-',
    after: `${row.inventoryCount} / ${row.availableCount}`,
    note: '海外仓回传库存盘点结果',
  },
  {
    id: `${row.headWaybillNo}-remark`,
    operatedAt: row.warehouseAt,
    operator: row.agent || '安逸',
    action: '备注维护',
    field: '客户备注 / 海外仓备注',
    before: '-',
    after: `${row.customerRemark || '-'} / ${row.overseasWarehouseRemark || '-'}`,
    note: '同步客户说明与海外仓操作备注',
  },
  {
    id: `${row.headWaybillNo}-status`,
    operatedAt: row.warehouseAt,
    operator: '系统',
    action: '状态变更',
    field: '中转状态',
    before: '运输中',
    after: row.status,
    note: '根据仓库节点自动更新状态',
  },
];

function TransitLogDrawer({
  row,
  onClose,
}: {
  row: OverseasTransitRow;
  onClose: () => void;
}) {
  const logs = getTransitLogRows(row);
  return (
    <div className="fixed inset-0 z-[60] bg-black/45">
      <div className="absolute right-0 top-0 flex h-full w-[760px] max-w-[92vw] flex-col bg-white shadow-2xl">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-6">
          <div>
            <h2 className="text-sm font-bold text-slate-950">操作日志</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">{row.headWaybillNo} · {row.customer}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-600 hover:bg-slate-100" aria-label="关闭日志">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-4">
          <div className="mb-3 grid grid-cols-3 gap-3 rounded border border-slate-200 bg-white px-4 py-3 text-xs">
            <div><span className="font-bold text-slate-900">状态：</span>{row.status}</div>
            <div><span className="font-bold text-slate-900">服务：</span>{row.service}</div>
            <div><span className="font-bold text-slate-900">件数：</span>{row.totalCount}</div>
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

function DrawerFormRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 items-center gap-3">
      <span className={drawerLabelClass}>
        {required ? requiredMark : null}
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </label>
  );
}

function DrawerTextareaRow({
  label,
  limit,
  placeholder,
  required,
  value,
  onChange,
}: {
  label: string;
  limit: string;
  placeholder: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className={`${drawerLabelClass} pt-2`}>
        {required ? requiredMark : null}
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

function DrawerReadonlyField({
  label,
  required,
  children,
  className = '',
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 items-start gap-3 ${className}`}>
      <span className={`${drawerLabelClass} pt-1.5`}>
        {required ? requiredMark : null}
        {label}
      </span>
      <div className="min-h-8 min-w-0 flex-1 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs leading-5 text-slate-700">
        {children || '-'}
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 rounded border border-slate-200 bg-white px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-50 text-[#004bb1]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[11px] text-slate-500">{label}</div>
        <div className="mt-0.5 text-base font-bold text-slate-800">{value}</div>
      </div>
    </div>
  );
}

export default function OverseasTransitPage({ addToast, initialView = 'list', mode = 'all' }: OverseasTransitPageProps) {
  const [view, setView] = useState<'list' | 'form'>(initialView);
  const availableTabs = mode === 'storage' ? storageTransitTabs : allTransitTabs;
  const [activeTab, setActiveTab] = useState<TransitStatus | '全部'>(mode === 'storage' ? '运输中' : '全部');
  const [activeStorageOrder, setActiveStorageOrder] = useState<OverseasTransitRow | null>(null);
  const [activeLogOrder, setActiveLogOrder] = useState<OverseasTransitRow | null>(null);
  const [storageAddressForm, setStorageAddressForm] = useState<AddressFormState>({ ...emptyAddressForm });
  const [storageInstructionRowsByOrder, setStorageInstructionRowsByOrder] = useState<Record<string, StorageInstructionRow[]>>({});
  const searchFields = mode === 'storage' ? storageSearchFields : overseasSearchFields;
  const searchToastText = mode === 'storage' ? '已查询海外仓暂存管理数据' : '已查询海外中转单数据';
  const isCompletedStorageOrder = activeStorageOrder?.status === '暂存已完成';
  const activeStorageOrderKey = activeStorageOrder?.headWaybillNo || '';
  const activeStorageInstructionRows = activeStorageOrderKey ? (storageInstructionRowsByOrder[activeStorageOrderKey] || []) : [];

  const filteredRows = useMemo(() => {
    const rows = mode === 'storage'
      ? transitRows.filter((row) => storageTransitTabs.includes(row.status))
      : transitRows;
    return activeTab === '全部' ? rows : rows.filter((row) => row.status === activeTab);
  }, [activeTab, mode]);
  const isStorageInTransitTab = mode === 'storage' && activeTab === '运输中';
  const visibleTableHeaders = isStorageInTransitTab ? inTransitStorageHeaders : tableHeaders;

  const getTabCount = (tab: TransitStatus) => {
    const scopedRows = mode === 'storage'
      ? transitRows.filter((row) => storageTransitTabs.includes(row.status))
      : transitRows;
    return scopedRows.filter((row) => row.status === tab).length;
  };

  const openDetail = (row?: OverseasTransitRow) => {
    if (mode === 'storage') {
      const nextRow = row || filteredRows[0];
      if (!nextRow) {
        addToast('当前状态下暂无可查看的暂存单', 'warning');
        return;
      }
      setStorageAddressForm(nextRow.status === '暂存已完成' ? getCompletedStorageAddressForm(nextRow) : { ...emptyAddressForm });
      setActiveStorageOrder(nextRow);
      addToast(`已打开 ${nextRow.headWaybillNo} ${nextRow.status === '暂存已完成' ? '暂存已完成详情' : '中转下单页面'}`, 'info');
      return;
    }
    setView('form');
  };

  const openLog = (row?: OverseasTransitRow) => {
    const nextRow = row || filteredRows[0];
    if (!nextRow) {
      addToast('当前列表暂无可查看的日志', 'warning');
      return;
    }
    setActiveLogOrder(nextRow);
    addToast(`已打开 ${nextRow.headWaybillNo} 操作日志`, 'info');
  };

  const updateStorageAddressField = (field: keyof AddressFormState, value: string) => {
    setStorageAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStorageWarehouseCodeChange = (value: string) => {
    const nextCode = value.trim().toUpperCase();
    const matchedWarehouse = warehouseAddressBook[nextCode];

    setStorageAddressForm((prev) => ({
      ...prev,
      warehouseCode: nextCode,
      ...(matchedWarehouse || {}),
      company: prev.company,
      remark: prev.remark,
      overseasWarehouseRemark: prev.overseasWarehouseRemark,
    }));
  };

  const addStorageInstructionRow = () => {
    if (!activeStorageOrderKey) return;
    setStorageInstructionRowsByOrder((prev) => {
      const currentRows = prev[activeStorageOrderKey] || [];
      return {
        ...prev,
        [activeStorageOrderKey]: [...currentRows, createStorageInstructionRow(currentRows.length + 1)],
      };
    });
    addToast('已新增操作指令', 'success');
  };

  const updateStorageInstructionRow = (rowId: string, field: StorageInstructionEditableField, value: string) => {
    if (!activeStorageOrderKey) return;
    setStorageInstructionRowsByOrder((prev) => {
      const currentRows = prev[activeStorageOrderKey] || [];
      return {
        ...prev,
        [activeStorageOrderKey]: currentRows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
      };
    });
  };

  const removeStorageInstructionRow = (rowId: string) => {
    if (!activeStorageOrderKey) return;
    setStorageInstructionRowsByOrder((prev) => {
      const currentRows = prev[activeStorageOrderKey] || [];
      return {
        ...prev,
        [activeStorageOrderKey]: currentRows.filter((row) => row.id !== rowId),
      };
    });
    addToast('已删除操作指令', 'info');
  };

  if (view === 'form') {
    return (
      <div className="flex-1 overflow-auto bg-slate-100 p-4 font-sans text-slate-700 max-h-[calc(100vh-3rem)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setView('list')}
              className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              aria-label="返回"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900">海外中转单</h2>
              <p className="mt-0.5 text-xs text-slate-500">录入预留仓出库后的海外中转信息，关联待转运单并生成中转批次。</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addToast('海外中转单已保存为草稿', 'success')}
              className="flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Save className="h-3.5 w-3.5" />
              保存草稿
            </button>
            <button
              type="button"
              onClick={() => addToast('海外中转单已提交，等待仓库出库', 'success')}
              className="flex items-center gap-1 rounded bg-[#004bb1] px-4 py-2 text-xs font-bold text-white hover:bg-[#003b91]"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              提交中转单
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <MetricTile label="关联运单" value="3 票" icon={ClipboardList} />
          <MetricTile label="箱数合计" value="52 箱" icon={PackageCheck} />
          <MetricTile label="计费重量" value="786.30 KG" icon={Warehouse} />
          <MetricTile label="总体积" value="4.73 CBM" icon={Ship} />
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-bold text-slate-800">基础信息</h3>
          </div>
          <div className="grid grid-cols-4 gap-x-4 gap-y-3 p-4 text-xs">
            <label className="space-y-1.5">
              <span className="font-semibold text-slate-700">客户</span>
              <input className={`${fieldClass} w-full`} defaultValue="深圳天图电子有限公司" />
            </label>
            <label className="space-y-1.5">
              <span className="font-semibold text-slate-700">海外中转单号</span>
              <input className={`${fieldClass} w-full bg-slate-50`} defaultValue="系统自动生成" readOnly />
            </label>
            <label className="space-y-1.5">
              <span className="font-semibold text-slate-700">起运预留仓</span>
              <select className={`${fieldClass} w-full`} defaultValue="洛杉矶预留仓">
                <option>洛杉矶预留仓</option>
                <option>新泽西预留仓</option>
                <option>伦敦预留仓</option>
                <option>汉堡预留仓</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="font-semibold text-slate-700">海外中转仓</span>
              <select className={`${fieldClass} w-full`} defaultValue="ONT8 海外中转仓">
                <option>ONT8 海外中转仓</option>
                <option>ABE8 中转仓</option>
                <option>BHX4 中转仓</option>
                <option>DTM2 中转仓</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="font-semibold text-slate-700">目的仓</span>
              <input className={`${fieldClass} w-full`} defaultValue="亚马逊 ONT8" />
            </label>
            <label className="space-y-1.5">
              <span className="font-semibold text-slate-700">目的国家</span>
              <select className={`${fieldClass} w-full`} defaultValue="美国">
                <option>美国</option>
                <option>英国</option>
                <option>德国</option>
                <option>加拿大</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="font-semibold text-slate-700">中转服务</span>
              <select className={`${fieldClass} w-full`} defaultValue="海外仓中转派送">
                <option>海外仓中转派送</option>
                <option>拆柜换标中转</option>
                <option>海外仓补货中转</option>
                <option>尾程重派中转</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="font-semibold text-slate-700">预计出库日期</span>
              <input type="date" className={`${fieldClass} w-full`} defaultValue="2026-07-04" />
            </label>
            <label className="col-span-2 space-y-1.5">
              <span className="font-semibold text-slate-700">客户备注</span>
              <input className={`${fieldClass} w-full`} defaultValue="预留仓库存合并出库，海外仓收货后按 FBA 批次入仓。" />
            </label>
            <label className="col-span-2 space-y-1.5">
              <span className="font-semibold text-slate-700">海外仓备注</span>
              <input className={`${fieldClass} w-full`} defaultValue="海外仓收货后同步回传入仓异常。" />
            </label>
            <label className="col-span-2 space-y-1.5">
              <span className="font-semibold text-slate-700">仓库操作要求</span>
              <input className={`${fieldClass} w-full`} defaultValue="核对外箱唛头，异常箱先拍照上传后再装车。" />
            </label>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-bold text-slate-800">关联运单</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addToast('已打开可中转运单选择器', 'info')}
                className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#003b91]"
              >
                <Plus className="h-3.5 w-3.5" />
                添加运单
              </button>
              <button
                type="button"
                onClick={() => addToast('已上传海外仓交接附件', 'success')}
                className="flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                上传附件
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] table-fixed border-collapse text-[11px]">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {['运单号', '预留仓单号', '客户参考号', '海外仓代码', '目的地', '箱数', '重量(KG)', '体积(CBM)', '服务', '状态', '操作'].map((head) => (
                    <th key={head} className="border border-slate-200 px-3 py-2 text-center font-semibold">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {linkedOrders.map((row) => (
                  <tr key={row.id} className="h-8 hover:bg-blue-50/30">
                    <td className="border border-slate-200 px-3 text-center font-mono font-semibold text-blue-600">{row.id}</td>
                    <td className="border border-slate-200 px-3 text-center font-mono">{row.reserveNo}</td>
                    <td className="border border-slate-200 px-3 text-center">{row.customerRef}</td>
                    <td className="border border-slate-200 px-3 text-center">{row.warehouseCode}</td>
                    <td className="border border-slate-200 px-3 text-center">{row.destination}</td>
                    <td className="border border-slate-200 px-3 text-center">{row.boxes}</td>
                    <td className="border border-slate-200 px-3 text-center">{row.weight}</td>
                    <td className="border border-slate-200 px-3 text-center">{row.volume}</td>
                    <td className="border border-slate-200 px-3 text-center">{row.service}</td>
                    <td className="border border-slate-200 px-3 text-center">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">{row.status}</span>
                    </td>
                    <td className="border border-slate-200 px-3 text-center">
                      <button type="button" className="font-semibold text-rose-600 hover:underline">
                        移除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#f3f4f6] p-3 font-sans text-slate-700 max-h-[calc(100vh-3rem)]">
      <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="grid grid-cols-1 items-center gap-x-5 gap-y-4 text-xs md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1800px)]:grid-cols-5">
          {searchFields.map((field) => (
            <label key={field.label} className="flex min-w-0 items-center gap-3">
              <span className={searchLabelClass}>{field.label}</span>
              {field.type === 'select' ? (
                <select className={searchControlClass} defaultValue="">
                  <option value="">请选择</option>
                  {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input className={searchControlClass} placeholder={field.placeholder || '请输入'} />
              )}
            </label>
          ))}
          <div className="flex min-w-0 items-center gap-2 pl-[92px]">
            <button type="button" onClick={() => addToast(searchToastText, 'success')} className="flex h-8 min-w-20 items-center justify-center rounded bg-[#0068d9] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#005ac0]">
              搜索
            </button>
            <button type="button" onClick={() => addToast('已重置筛选条件', 'info')} className="h-8 min-w-20 rounded border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="mb-3 flex items-center gap-8 border-b border-slate-200 text-xs font-bold">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-1 pb-3 ${activeTab === tab ? 'text-[#004bb1]' : 'text-slate-600 hover:text-[#004bb1]'}`}
            >
              {tab}({getTabCount(tab)})
              {activeTab === tab && <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-[#004bb1]" />}
            </button>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => openDetail()} className="flex w-[90px] items-center justify-center rounded bg-[#0068d9] px-3 py-2 text-xs font-bold text-white hover:bg-[#005ac0]">
              下单
            </button>
            <button type="button" onClick={() => addToast('正在导出海外中转单', 'info')} className="flex w-[90px] items-center justify-center rounded bg-[#0068d9] px-3 py-2 text-xs font-bold text-white hover:bg-[#005ac0]">
              导出
            </button>
            <button type="button" onClick={() => addToast('批量修改面板已打开', 'info')} className="flex w-[90px] items-center justify-center rounded bg-[#0068d9] px-3 py-2 text-xs font-bold text-white hover:bg-[#005ac0]">
              批量修改
            </button>
            <button type="button" onClick={() => addToast('请选择需要移除的运单', 'warning')} className="flex w-[90px] items-center justify-center rounded bg-[#0068d9] px-3 py-2 text-xs font-bold text-white hover:bg-[#005ac0]">
              移除运单
            </button>
          </div>
          <div />
        </div>

        <div className="overflow-x-auto border border-slate-200">
          <table className={`w-full ${isStorageInTransitTab ? 'min-w-[2400px]' : 'min-w-[1800px]'} table-fixed border-collapse text-[11px]`}>
            <thead className="bg-[#f2f2f2] text-slate-800">
              <tr>
                <th className="w-10 border border-slate-200 px-2 py-2 text-center"><input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" /></th>
                {visibleTableHeaders.map((head) => (
                  <th key={head} className="border border-slate-300 px-3 py-2 text-center font-semibold">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.headWaybillNo}
                  onDoubleClick={() => openDetail(row)}
                  title="双击打开中转下单"
                  className="h-8 cursor-pointer text-slate-700 hover:bg-blue-50/30"
                >
                  <td className="border border-slate-300 px-2 text-center"><input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" /></td>
                  {isStorageInTransitTab ? (
                    <>
                      <td className="border border-slate-300 px-3 text-center font-mono">{row.headWaybillNo}</td>
                      <td className="border border-slate-300 px-3 text-center font-mono">{row.fbaNo}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.customerOrderNo}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.customer}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.shippedCount ?? row.totalCount}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.latestRoute || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center font-mono">{row.routeUpdatedAt || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center font-mono">{row.transferNo || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.referenceId || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.warehouseCode || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.salesman || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.chargeWeight || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.actualWeight || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.volumetricWeight || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.volumeCbm || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center font-mono">{row.containerNo || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center font-mono">{row.zipCode || '-'}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.service}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.customerRemark}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.overseasWarehouseRemark}</td>
                    </>
                  ) : (
                    <>
                      <td className="border border-slate-300 px-3 text-center font-mono">{row.headWaybillNo}</td>
                      <td className="border border-slate-300 px-3 text-center font-mono">{row.fbaNo}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.customerOrderNo}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.customer}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.transferType}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.totalCount}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.inventoryCount}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.availableCount}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.service}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.customerRemark}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.overseasWarehouseRemark}</td>
                      <td className="border border-slate-300 px-3 text-center">{row.agent}</td>
                      <td className="border border-slate-300 px-3 text-center font-mono">{row.inboundAt}</td>
                      <td className="border border-slate-300 px-3 text-center font-mono">{row.warehouseAt}</td>
                      <td className="border border-slate-200 px-3 text-center">
                        <button type="button" onClick={() => openDetail(row)} className="font-semibold text-blue-600 hover:underline">
                          查看
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-5 border-t border-slate-100 px-2 py-3 text-xs text-slate-600">
          <span>共 {filteredRows.length} 条</span>
          <select className="h-8 rounded border border-slate-300 bg-white px-3 outline-none">
            <option>100条/页</option>
            <option>50条/页</option>
            <option>20条/页</option>
          </select>
          <button type="button" className="text-slate-300">&lt;</button>
          <span className="font-bold text-blue-600">1</span>
          <button type="button" className="text-slate-300">&gt;</button>
          <span>前往</span>
          <input value="1" readOnly className="h-8 w-14 rounded border border-slate-300 px-2 text-center outline-none" />
          <span>页</span>
        </div>
      </div>

      {activeStorageOrder && (
        <div className="fixed inset-0 z-50 bg-black/55">
          <div className="absolute right-0 top-0 flex h-full w-[66vw] min-w-[980px] flex-col bg-slate-50 shadow-2xl">
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-9">
              <h2 className="text-sm font-bold text-slate-950">{isCompletedStorageOrder ? '暂存已完成详情' : '中转下单'}</h2>
              <button
                type="button"
                onClick={() => setActiveStorageOrder(null)}
                className="rounded p-1 text-slate-700 hover:bg-slate-100"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {isCompletedStorageOrder ? (
                <section className="mb-3 rounded-2xl border border-slate-200 bg-white px-7 py-4">
                  <h3 className="mb-5 text-sm font-bold text-slate-950">基础信息</h3>
                  <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                    <DrawerReadonlyField label="头程运单号">{activeStorageOrder.headWaybillNo}</DrawerReadonlyField>
                    <DrawerReadonlyField label="FBA单号">{activeStorageOrder.fbaNo || '-'}</DrawerReadonlyField>
                    <DrawerReadonlyField label="客户单号">{activeStorageOrder.customerOrderNo || '-'}</DrawerReadonlyField>
                    <DrawerReadonlyField label="客户全称">{activeStorageOrder.customer}</DrawerReadonlyField>
                    <DrawerReadonlyField label="中转单类型">{activeStorageOrder.transferType}</DrawerReadonlyField>
                    <DrawerReadonlyField label="状态">{activeStorageOrder.status}</DrawerReadonlyField>
                    <DrawerReadonlyField label="总件数">{activeStorageOrder.totalCount}</DrawerReadonlyField>
                    <DrawerReadonlyField label="库存件数">{activeStorageOrder.inventoryCount}</DrawerReadonlyField>
                    <DrawerReadonlyField label="可用件数">{activeStorageOrder.availableCount}</DrawerReadonlyField>
                    <DrawerReadonlyField label="代理">{activeStorageOrder.agent || '-'}</DrawerReadonlyField>
                    <DrawerReadonlyField label="服务" className="col-span-2">{activeStorageOrder.service}</DrawerReadonlyField>
                    <DrawerReadonlyField label="入仓时间">{activeStorageOrder.inboundAt}</DrawerReadonlyField>
                    <DrawerReadonlyField label="仓租时间">{activeStorageOrder.warehouseAt}</DrawerReadonlyField>
                    <DrawerReadonlyField label="客户备注" className="col-span-2">{activeStorageOrder.customerRemark || '-'}</DrawerReadonlyField>
                    <DrawerReadonlyField label="海外仓备注" className="col-span-2">{activeStorageOrder.overseasWarehouseRemark || '-'}</DrawerReadonlyField>
                  </div>
                </section>
              ) : (
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
                    <span>{activeStorageOrder.service}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">客户备注：</span>
                    <span>{activeStorageOrder.customerRemark}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">海外仓备注：</span>
                    <span>{activeStorageOrder.overseasWarehouseRemark}</span>
                  </div>
                </div>
              )}

              <section className="rounded-2xl border border-slate-200 bg-white px-7 py-4">
                <h3 className="mb-5 text-sm font-bold text-slate-950">收件地址信息</h3>
                <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                  {isCompletedStorageOrder ? (
                    <>
                      <DrawerReadonlyField label="运单类型" required>{storageAddressForm.orderType}</DrawerReadonlyField>
                      <DrawerReadonlyField label="仓库代码" required>{storageAddressForm.warehouseCode}</DrawerReadonlyField>
                    <DrawerReadonlyField label="业务员">{activeStorageOrder.salesman || '-'}</DrawerReadonlyField>
                      <DrawerReadonlyField label="邮编" required>{storageAddressForm.zipCode}</DrawerReadonlyField>
                      <DrawerReadonlyField label="收件人">{storageAddressForm.consignee}</DrawerReadonlyField>
                      {storageAddressForm.orderType === '私人地址' && (
                        <DrawerReadonlyField label="电话" required>{storageAddressForm.phone}</DrawerReadonlyField>
                      )}
                      <DrawerReadonlyField label="城市" required>{storageAddressForm.city}</DrawerReadonlyField>
                      <DrawerReadonlyField label="州">{storageAddressForm.state}</DrawerReadonlyField>
                      <DrawerReadonlyField label="公司">{storageAddressForm.company || '-'}</DrawerReadonlyField>
                      <DrawerReadonlyField label="地址详情" required className="col-span-2">{storageAddressForm.addressDetail}</DrawerReadonlyField>
                      <DrawerReadonlyField label="客户备注" className="col-span-2">{storageAddressForm.remark || '-'}</DrawerReadonlyField>
                      <DrawerReadonlyField label="海外仓备注" className="col-span-2">{storageAddressForm.overseasWarehouseRemark || '-'}</DrawerReadonlyField>
                    </>
                  ) : (
                    <>
                      <DrawerFormRow label="运单类型" required>
                        <select
                          className={drawerFieldClass}
                          value={storageAddressForm.orderType}
                          onChange={(event) => updateStorageAddressField('orderType', event.target.value)}
                        >
                          {overseasOrderTypes.map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </DrawerFormRow>

                      <DrawerFormRow label="仓库代码" required>
                        <>
                          <input
                            className={drawerFieldClass}
                            list="storage-warehouse-codes"
                            placeholder="请输入仓库代码"
                            value={storageAddressForm.warehouseCode}
                            onChange={(event) => handleStorageWarehouseCodeChange(event.target.value)}
                          />
                          <datalist id="storage-warehouse-codes">
                            {overseasWarehouseCodes.map((code) => (
                              <option key={code} value={code} />
                            ))}
                          </datalist>
                        </>
                      </DrawerFormRow>
                      <DrawerFormRow label="邮编" required>
                        <input
                          className={drawerFieldClass}
                          placeholder="请输入邮编"
                          value={storageAddressForm.zipCode}
                          onChange={(event) => updateStorageAddressField('zipCode', event.target.value)}
                        />
                      </DrawerFormRow>
                      <DrawerFormRow label="收件人">
                        <input
                          className={drawerFieldClass}
                          placeholder="请输入收件人"
                          value={storageAddressForm.consignee}
                          onChange={(event) => updateStorageAddressField('consignee', event.target.value)}
                        />
                      </DrawerFormRow>
                      {storageAddressForm.orderType === '私人地址' && (
                        <DrawerFormRow label="电话" required>
                          <input
                            className={drawerFieldClass}
                            placeholder="请输入电话"
                            value={storageAddressForm.phone}
                            onChange={(event) => updateStorageAddressField('phone', event.target.value)}
                          />
                        </DrawerFormRow>
                      )}
                      <DrawerFormRow label="城市" required>
                        <input
                          className={drawerFieldClass}
                          placeholder="请输入城市"
                          value={storageAddressForm.city}
                          onChange={(event) => updateStorageAddressField('city', event.target.value)}
                        />
                      </DrawerFormRow>
                      <DrawerFormRow label="州">
                        <input
                          className={drawerFieldClass}
                          placeholder="请输入州"
                          value={storageAddressForm.state}
                          onChange={(event) => updateStorageAddressField('state', event.target.value)}
                        />
                      </DrawerFormRow>
                      <DrawerFormRow label="公司">
                        <input
                          className={drawerFieldClass}
                          placeholder="请输入公司"
                          value={storageAddressForm.company}
                          onChange={(event) => updateStorageAddressField('company', event.target.value)}
                        />
                      </DrawerFormRow>
                      <DrawerTextareaRow
                        label="地址详情"
                        placeholder="请输入地址详情"
                        limit={`${storageAddressForm.addressDetail.length}/100`}
                        required
                        value={storageAddressForm.addressDetail}
                        onChange={(value) => updateStorageAddressField('addressDetail', value)}
                      />
                      <DrawerTextareaRow
                        label="客户备注"
                        placeholder="请输入客户备注"
                        limit={`${storageAddressForm.remark.length}/500`}
                        value={storageAddressForm.remark}
                        onChange={(value) => updateStorageAddressField('remark', value)}
                      />
                      <DrawerTextareaRow
                        label="海外仓备注"
                        placeholder="请输入海外仓备注"
                        limit={`${storageAddressForm.overseasWarehouseRemark.length}/500`}
                        value={storageAddressForm.overseasWarehouseRemark}
                        onChange={(value) => updateStorageAddressField('overseasWarehouseRemark', value)}
                      />
                    </>
                  )}
                </div>
              </section>

              <section className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-950">货箱信息</h3>
                  <div className="text-xs font-bold text-orange-500">申报币种：USD · 总申报价值：390</div>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-700">
                  <span className="font-bold text-slate-900"><span className="text-red-500">*</span>材质</span>
                  {['带磁', '带电', '纺织品', '玻璃制品', '普货', '玩具', 'FDA产品', '成人用品', '木制品', '钢铁铝类', '冲突类', '电子类', '灯类', '自行车类', '粉末', '液体', '敏感货', '木制品非报关件'].map((item) => (
                    <label key={item} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <input type="checkbox" disabled={isCompletedStorageOrder} readOnly checked={item === '纺织品' || item === '普货'} className="h-3.5 w-3.5 cursor-not-allowed rounded border-slate-300 text-blue-600 disabled:opacity-60" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <button type="button" disabled={isCompletedStorageOrder} className="mb-3 rounded bg-blue-600 px-5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">
                  新增10行
                </button>

                <div className="overflow-x-auto border border-slate-200">
                  <table className="w-full min-w-[2480px] table-fixed border-collapse text-[11px] text-slate-700">
                    <thead className="bg-slate-50 text-slate-700">
                      <tr>
                        {['#', '', 'FBA/IBR箱号', 'PO Number', '产品英文名', '产品中文名', '产品申报单价', '产品申报数量', '产品申报总价', '产品材质', '产品海关编码', '产品用途', '产品品牌', '产品型号', '产品图片链接', '产品销售链接', '货箱重量(KG)', '货箱长度(CM)', '货箱宽度(CM)', '货箱高度(CM)'].map((head) => (
                          <th key={head || 'check'} className="border border-slate-200 px-3 py-2 text-center">
                            {head || <input type="checkbox" disabled={isCompletedStorageOrder} readOnly className="h-3.5 w-3.5 cursor-not-allowed rounded border-slate-300 disabled:opacity-60" />}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 10 }).map((_, index) => (
                        <tr key={index} className="h-8">
                          <td className="border border-slate-200 px-2 text-center text-slate-500">{index + 1}</td>
                          <td className="border border-slate-200 px-2 text-center"><input type="checkbox" disabled={isCompletedStorageOrder} readOnly className="h-3.5 w-3.5 cursor-not-allowed rounded border-slate-300 disabled:opacity-60" /></td>
                          <td className="border border-slate-200 px-3 text-center font-mono">{index < 2 ? `FBA19DTKOWLD000000${index + 1}` : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? '1DT1ZZLZ' : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? "dog's hind leg joints" : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? '犬类后腿关节支撑' : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? '6' : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? (index === 0 ? '47' : '18') : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? (index === 0 ? '282' : '108') : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? '纺织品' : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? '6307900090' : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? '宠物护理' : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? 'PetGuard' : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? 'HLJ-01' : ''}</td>
                          <td className="truncate border border-slate-200 px-3 text-center text-blue-600">{index < 2 ? `https://example.com/image-${index + 1}.jpg` : ''}</td>
                          <td className="truncate border border-slate-200 px-3 text-center text-blue-600">{index < 2 ? `https://example.com/product-${index + 1}` : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? (index === 0 ? '18.6' : '9.2') : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? (index === 0 ? '52' : '45') : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? (index === 0 ? '41' : '36') : ''}</td>
                          <td className="border border-slate-200 px-3 text-center">{index < 2 ? (index === 0 ? '38' : '30') : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h3 className="mb-4 pl-3 text-sm font-bold text-slate-950">操作指令</h3>
                <button type="button" className="mb-5 ml-3 rounded bg-blue-600 px-7 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
                  新增
                </button>
                <table className="w-full table-fixed border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-900">
                    <tr>
                      {['费用名称', '费用类型', '*计费单位', '*计费单价（元）', '*计费数量', '*币种', '总价（元）', '添加时间', '添加人', '描述', '操作'].map((head) => (
                        <th key={head} className="border border-slate-200 px-3 py-3 text-center font-bold">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={11} className="h-24 border border-slate-200 text-center text-slate-300">
                        <FilePlus2 className="mx-auto mb-2 h-8 w-8 text-slate-200" />
                        暂无数据
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        </div>
      )}

      {activeLogOrder && (
        <TransitLogDrawer row={activeLogOrder} onClose={() => setActiveLogOrder(null)} />
      )}
    </div>
  );
}
