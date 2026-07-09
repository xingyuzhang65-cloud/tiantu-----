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
} from 'lucide-react';

interface OverseasTransitPageProps {
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  initialView?: 'list' | 'form';
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
  remark: string;
  agent: string;
  inboundAt: string;
  warehouseAt: string;
  status: TransitStatus;
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

const transitRows: OverseasTransitRow[] = [
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
    remark: '',
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
    remark: '',
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
    remark: '',
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
    remark: '',
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
    remark: '',
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
    remark: '',
    agent: '',
    inboundAt: '2024-04-12 16:23',
    warehouseAt: '2025-05-16 08:16',
    status: '签收',
  },
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

export default function OverseasTransitPage({ addToast, initialView = 'list' }: OverseasTransitPageProps) {
  const [view, setView] = useState<'list' | 'form'>(initialView);
  const [activeTab, setActiveTab] = useState<TransitStatus | '全部'>('全部');

  const filteredRows = useMemo(() => {
    return activeTab === '全部' ? transitRows : transitRows.filter((row) => row.status === activeTab);
  }, [activeTab]);

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
              <span className="font-semibold text-slate-700">中转备注</span>
              <input className={`${fieldClass} w-full`} defaultValue="预留仓库存合并出库，海外仓收货后按 FBA 批次入仓。" />
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
        <div className="grid grid-cols-[72px_200px_72px_200px_72px_200px_60px_200px_60px_200px] items-center gap-x-3 gap-y-5 text-xs">
          <label className="text-right font-semibold text-slate-700">头程运单号</label>
          <input className={fieldClass} placeholder="支持批量" />
          <label className="text-right font-semibold text-slate-700">中转运单号</label>
          <input className={fieldClass} placeholder="支持批量" />
          <label className="text-right font-semibold text-slate-700">FBA单号</label>
          <input className={fieldClass} placeholder="支持批量" />
          <label className="text-right font-semibold text-slate-700">转单号</label>
          <input className={fieldClass} placeholder="支持批量" />
          <label className="text-right font-semibold text-slate-700">仓库代码</label>
          <select className={fieldClass} defaultValue="">
            <option value="">请选择</option>
            <option>ONT8</option>
            <option>ABE8</option>
            <option>LAX9</option>
          </select>

          <label className="text-right font-semibold text-slate-700">客户全称</label>
          <select className={fieldClass} defaultValue="">
            <option value="">请选择</option>
            <option>阿里巴巴</option>
            <option>腾讯科技</option>
            <option>华为技术</option>
          </select>
          <label className="text-right font-semibold text-slate-700">经营单位</label>
          <input className={fieldClass} placeholder="请输入" />
          <label className="text-right font-semibold text-slate-700">邮编</label>
          <input className={fieldClass} placeholder="支持批量" />
          <label className="text-right font-semibold text-slate-700">业务员</label>
          <input className={fieldClass} placeholder="请输入" />
          <label className="text-right font-semibold text-slate-700">跟单员</label>
          <input className={fieldClass} placeholder="请输入" />

          <label className="text-right font-semibold text-slate-700">入仓时间</label>
          <select className={fieldClass} defaultValue="">
            <option value="">请选择时间</option>
            <option>近 7 天</option>
            <option>近 30 天</option>
          </select>
          <label className="text-right font-semibold text-slate-700">中转单类型</label>
          <select className={fieldClass} defaultValue="">
            <option value="">请选择</option>
            <option>暂存</option>
            <option>拦截</option>
          </select>
          <div className="col-span-4" />
          <button type="button" onClick={() => addToast('已查询海外中转单数据', 'success')} className="flex h-8 items-center justify-center rounded bg-[#0068d9] text-xs font-bold text-white shadow-sm hover:bg-[#005ac0]">
            搜索
          </button>
          <button type="button" onClick={() => addToast('已重置筛选条件', 'info')} className="h-8 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50">
            重置
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="mb-3 flex items-center gap-8 border-b border-slate-200 text-xs font-bold">
          {(['运输中', '暂存', '待确认', '已确认', '已下单', '转运中', '签收', '暂存已完成', '驳回', '取消'] as TransitStatus[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-1 pb-3 ${activeTab === tab ? 'text-[#004bb1]' : 'text-slate-600 hover:text-[#004bb1]'}`}
            >
              {tab}({tab === '运输中' || tab === '暂存' || tab === '待确认' || tab === '已确认' || tab === '已下单' || tab === '转运中' || tab === '驳回' || tab === '取消' ? 2 : 8})
              {activeTab === tab && <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-[#004bb1]" />}
            </button>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setView('form')} className="flex w-[90px] items-center justify-center rounded bg-[#0068d9] px-3 py-2 text-xs font-bold text-white hover:bg-[#005ac0]">
              下单
            </button>
            <button type="button" onClick={() => addToast('正在导出海外中转单', 'info')} className="flex w-[90px] items-center justify-center rounded bg-[#0068d9] px-3 py-2 text-xs font-bold text-white hover:bg-[#005ac0]">
              导出
            </button>
            <button type="button" onClick={() => addToast('批量修改面板已打开', 'info')} className="flex w-[90px] items-center justify-center rounded bg-[#0068d9] px-3 py-2 text-xs font-bold text-white hover:bg-[#005ac0]">
              批量修改
            </button>
            <button type="button" onClick={() => addToast('已打开日志列表', 'info')} className="flex w-[90px] items-center justify-center rounded bg-[#0068d9] px-3 py-2 text-xs font-bold text-white hover:bg-[#005ac0]">
              查看日志
            </button>
            <button type="button" onClick={() => addToast('请选择需要移除的运单', 'warning')} className="flex w-[90px] items-center justify-center rounded bg-[#0068d9] px-3 py-2 text-xs font-bold text-white hover:bg-[#005ac0]">
              移除运单
            </button>
          </div>
          <div />
        </div>

        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full min-w-[1680px] table-fixed border-collapse text-[11px]">
            <thead className="bg-[#f2f2f2] text-slate-800">
              <tr>
                <th className="w-10 border border-slate-200 px-2 py-2 text-center"><input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" /></th>
                {['头程运单号', 'FBA单号', '客户单号', '客户全称', '中转单类型', '总件数', '库存件数', '可用件数', '服务', '备注', '代理', '入仓时间', '仓租时间', '操作'].map((head) => (
                  <th key={head} className={`border border-slate-300 px-3 py-2 text-center font-semibold ${['总件数', '库存件数', '可用件数'].includes(head) ? 'outline outline-1 outline-red-500' : ''}`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="h-8 text-slate-700 hover:bg-blue-50/30">
                  <td className="border border-slate-300 px-2 text-center"><input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" /></td>
                  <td className="border border-slate-300 px-3 text-center font-mono">{row.headWaybillNo}</td>
                  <td className="border border-slate-300 px-3 text-center font-mono">{row.fbaNo}</td>
                  <td className="border border-slate-300 px-3 text-center">{row.customerOrderNo}</td>
                  <td className="border border-slate-300 px-3 text-center">{row.customer}</td>
                  <td className="border border-slate-300 px-3 text-center">{row.transferType}</td>
                  <td className="border border-slate-300 px-3 text-center">{row.totalCount}</td>
                  <td className="border border-slate-300 px-3 text-center">{row.inventoryCount}</td>
                  <td className="border border-slate-300 px-3 text-center">{row.availableCount}</td>
                  <td className="border border-slate-300 px-3 text-center">{row.service}</td>
                  <td className="border border-slate-300 px-3 text-center">{row.remark}</td>
                  <td className="border border-slate-300 px-3 text-center">{row.agent}</td>
                  <td className="border border-slate-300 px-3 text-center font-mono">{row.inboundAt}</td>
                  <td className="border border-slate-300 px-3 text-center font-mono">{row.warehouseAt}</td>
                  <td className="border border-slate-200 px-3 text-center">
                    <button type="button" onClick={() => setView('form')} className="font-semibold text-blue-600 hover:underline">
                      查看
                    </button>
                    <span className="mx-1 text-slate-300">|</span>
                    <button type="button" onClick={() => addToast(`已打开 ${row.id} 操作日志`, 'info')} className="font-semibold text-blue-600 hover:underline">
                      日志
                    </button>
                  </td>
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
    </div>
  );
}
