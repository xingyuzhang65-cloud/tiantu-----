import React, { useState } from 'react';
import { 
  Search, RotateCcw, ChevronDown, ChevronUp, Plus, Trash2, 
  RefreshCw, Settings2, ShieldCheck, HelpCircle, ArrowUpDown,
  FileDown, Check, AlertOctagon, Truck, Calendar, MapPin, X
} from 'lucide-react';
import { Waybill, SearchParams, OrderType } from '../types';

interface TableSectionProps {
  waybills: Waybill[];
  onAddWaybillClick: (orderType: OrderType) => void;
  onDeleteWaybills: (ids: string[]) => void;
  onUpdateWaybillStatus: (id: string, nextStatus: Waybill['status']) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export default function TableSection({ 
  waybills, 
  onAddWaybillClick, 
  onDeleteWaybills,
  onUpdateWaybillStatus,
  addToast
}: TableSectionProps) {
  // Filters state
  const [keywords, setKeywords] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [carrier, setCarrier] = useState('');
  
  // Active status tab filter
  const [activeStatusTab, setActiveStatusTab] = useState<string>('全部');

  // Applied filters state for search matching
  const [appliedFilters, setAppliedFilters] = useState<SearchParams>({
    keywords: '',
    groupCode: '',
    carrier: ''
  });

  // Collapsible search block
  const [extraFiltersOpen, setExtraFiltersOpen] = useState(true);

  // Selected checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected row for displaying details/timeline trace
  const [activeTraceWaybill, setActiveTraceWaybill] = useState<Waybill | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Toggle sort order
  const [sortAsc, setSortAsc] = useState(false);

  // Filter and compute data
  const filteredWaybills = waybills.filter(item => {
    // Keyword match
    if (appliedFilters.keywords) {
      const keys = appliedFilters.keywords.toLowerCase().split(',');
      const matchKey = keys.some(k => 
        item.id.toLowerCase().includes(k.trim()) || 
        item.fbaCode.toLowerCase().includes(k.trim()) ||
        (item.remarks && item.remarks.toLowerCase().includes(k.trim()))
      );
      if (!matchKey) return false;
    }
    // Group code match
    if (appliedFilters.groupCode) {
      if (!item.groupCode.toLowerCase().includes(appliedFilters.groupCode.toLowerCase())) return false;
    }
    // Carrier/Service match
    if (appliedFilters.carrier) {
      if (!item.carrier.toLowerCase().includes(appliedFilters.carrier.toLowerCase())) return false;
    }

    // Status Tab Match
    if (activeStatusTab === '已下单') {
      if (item.status !== '待揽收') return false;
    } else if (activeStatusTab === '已收货') {
      if (item.status !== '已收货') return false;
    } else if (activeStatusTab === '转运中') {
      if (item.status !== '转运中') return false;
    } else if (activeStatusTab === '退件') {
      if (item.status !== '异常件') return false;
    } else if (activeStatusTab === '已确认') {
      if (item.status !== '已收货') return false;
    } else if (activeStatusTab === '已签收') {
      return false;
    } else if (activeStatusTab === '已取消') {
      return false;
    } else if (activeStatusTab === '未确认') {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedWaybills = [...filteredWaybills].sort((a, b) => {
    const timeA = new Date(a.createTime).getTime();
    const timeB = new Date(b.createTime).getTime();
    return sortAsc ? timeA - timeB : timeB - timeA;
  });

  // Paginated partition
  const totalItems = sortedWaybills.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWaybills = sortedWaybills.slice(startIndex, startIndex + itemsPerPage);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const currentIds = paginatedWaybills.map(w => w.id);
      setSelectedIds(currentIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter apply and reset
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({ keywords, groupCode, carrier });
    setCurrentPage(1);
    addToast('已根据输入条件重新检索匹配运单', 'success');
  };

  const handleReset = () => {
    setKeywords('');
    setGroupCode('');
    setCarrier('');
    setAppliedFilters({ keywords: '', groupCode: '', carrier: '' });
    setCurrentPage(1);
    setSelectedIds([]);
    addToast('搜索条件已重置，显示全量日志', 'info');
  };

  // Actions
  const handleSyncFBA = () => {
    addToast('正在对接亚马逊 FBA 路由中心进行远端口径对账...', 'info');
    setTimeout(() => {
      addToast('成功同步 12 个海外仓仓位的集港 FBA 入库序列状态', 'success');
    }, 1200);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      addToast('请在列表中勾选要作废删除的运单', 'warning');
      return;
    }
    if (confirm(`确认要彻底作废作消当前选中的 ${selectedIds.length} 张跨境运单吗？此操作无法撤销。`)) {
      onDeleteWaybills(selectedIds);
      setSelectedIds([]);
      addToast('选定运单删除作废成功', 'success');
    }
  };

  const handleCalculateRate = () => {
    addToast('正在拉取最新的美东/美西空运海运基准附加费率...', 'info');
    setTimeout(() => {
      addToast('附加费及国内贴标打包费率计算模型更新完毕', 'success');
    }, 1000);
  };

  // Get status class for pills
  const getStatusStyle = (status: Waybill['status']) => {
    switch (status) {
      case '已收货': return 'bg-emerald-50 text-emerald-705 border-emerald-200';
      case '待揽收': return 'bg-amber-50 text-amber-705 border-amber-200';
      case '转运中': return 'bg-blue-50 text-blue-705 border-blue-200';
      case '异常件': return 'bg-rose-50 text-rose-705 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-100 p-4 space-y-4 font-sans max-h-[calc(100vh-3rem)]">
      
      {/* Search Header Form Block */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Search className="h-4 w-4 text-blue-600" />
              <span>数据检索过滤器</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                <Search className="h-3 w-3" />
                <span>查询</span>
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span>重置</span>
              </button>

              <button
                type="button"
                onClick={() => setExtraFiltersOpen(!extraFiltersOpen)}
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <span>{extraFiltersOpen ? '收起' : '展开'}</span>
                {extraFiltersOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {extraFiltersOpen && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 pt-3 border-t border-slate-100">
              {/* Keywords Input */}
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  关键字 (单号/FBA)
                </label>
                <input
                  id="search-keywords"
                  type="text"
                  placeholder="输入查询单号，多个用','隔开"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Group Code */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  集团单号
                </label>
                <input
                  id="search-group"
                  type="text"
                  placeholder="支持批量搜索"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Operating Unit (Carrier/Service) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  经营单位 (渠道名称)
                </label>
                <input
                  id="search-carrier"
                  type="text"
                  placeholder="经营单位"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Tab Row (Status filter + 4 Buttons) closer to top right, matching the screenshot */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between border border-slate-200 bg-white p-2.5 rounded-xl shadow-sm gap-4">
        {/* Left: Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: '已下单', label: '已下单', count: waybills.filter(w => w.status === '待揽收').length },
            { id: '已收货', label: '已收货', count: 142 + waybills.filter(w => w.status === '已收货').length },
            { id: '已确认', label: '已确认', count: 14 },
            { id: '转运中', label: '转运中', count: 12446 + waybills.filter(w => w.status === '转运中').length },
            { id: '已签收', label: '已签收', count: 12171 },
            { id: '退件', label: '退件', count: 246 + waybills.filter(w => w.status === '异常件').length },
            { id: '已取消', label: '已取消', count: 0 },
            { id: '全部', label: '全部', count: 25019 + waybills.length },
            { id: '未确认', label: '未确认', count: null }
          ].map((tab) => {
            const isActive = activeStatusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveStatusTab(tab.id);
                  addToast(`已应用状态过滤: ${tab.label}`, 'info');
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[10px] px-1 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    ({tab.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: The 3 Main Order Entry Buttons + Surcharge Settle (重算附加费) button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-fast-order"
            onClick={() => onAddWaybillClick('快捷下单')}
            className="rounded bg-[#004bb1] hover:bg-[#003b91] font-bold text-xs text-white px-4 py-1.5 shadow-sm transition-all text-center select-none cursor-pointer"
          >
            快捷下单
          </button>
          
          <button
            id="btn-excel-order"
            onClick={() => onAddWaybillClick('excel导入下单')}
            className="rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-1.5 shadow-sm transition-all text-center select-none cursor-pointer"
          >
            Excel导入下单
          </button>
          
          <button
            id="btn-ai-invoice-order"
            onClick={() => onAddWaybillClick('解析发票下单')}
            className="rounded bg-[#004bb1] hover:bg-[#003b91] font-bold text-xs text-white px-4 py-1.5 shadow-sm transition-all text-center select-none cursor-pointer"
          >
            解析发票下单(新星版)
          </button>
          
          <button
            id="btn-surcharge-recalc"
            onClick={handleCalculateRate}
            className="rounded bg-[#004bb1] hover:bg-[#003b91] font-bold text-xs text-white px-4 py-1.5 shadow-sm transition-all text-center select-none cursor-pointer"
          >
            重算附加费
          </button>
        </div>
      </div>

      {/* Operations Toolbar - Matches the exact look, feel and spacing of the screenshot buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* 其他 Dropdown */}
          <button
            type="button"
            onClick={() => addToast('展开更多平台管理运维工具...', 'info')}
            className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            <span>其他</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* 打印标签 */}
          <button
            type="button"
            onClick={() => addToast('正在生成货箱专属 FBA 揽收电子吊贴/面单...', 'info')}
            className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            <span>打印标签</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* 批量操作 */}
          <button
            type="button"
            onClick={() => {
              if (selectedIds.length === 0) {
                addToast('请在下方列表中勾选目标运单进行批量操作！', 'warning');
              } else {
                addToast(`准备对选定的 ${selectedIds.length} 项进行批量流水流转签收操作...`, 'info');
              }
            }}
            className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            <span>批量操作</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* 导出 */}
          <button
            type="button"
            onClick={() => addToast('正在导出符合天逻辑对账口径的 CSV 运单日志...', 'success')}
            className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            <span>导出</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* 批量添加 */}
          <button
            type="button"
            onClick={() => addToast('启动卡板、托盘批量打包上板申报流程...', 'info')}
            className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            <span>批量添加</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* 转单号 */}
          <button
            type="button"
            onClick={() => addToast('同步追踪并映射最后一公里 UPS/FedEx 国内国际转单号...', 'info')}
            className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            <span>转单号</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* 查看统计 */}
          <button
            type="button"
            onClick={() => addToast('正在生成货仓实时吞吐、重泡积压统计统计大盘...', 'success')}
            className="rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            查看统计
          </button>

          {/* 查看日志 */}
          <button
            type="button"
            onClick={() => addToast('调取集港操作审计日志、清关查验异常警示日志组...', 'info')}
            className="rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            查看日志
          </button>

          {/* 打印入仓单 */}
          <button
            type="button"
            onClick={() => addToast('正在生成并下载天图物流标准报关/入仓指示单...', 'success')}
            className="rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            打印入仓单
          </button>

          {/* 欧线打单 */}
          <button
            type="button"
            onClick={() => addToast('正在针对欧洲自建中转仓位调配 DPD 联运打单程序...', 'info')}
            className="rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            欧线打单
          </button>

          {/* 同步FBA */}
          <button
            type="button"
            onClick={handleSyncFBA}
            className="rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            同步FBA
          </button>

          {/* 推送报关 */}
          <button
            type="button"
            onClick={() => addToast('单票出口EDI无纸化申报资料已成功提交深圳皇岗口岸...', 'success')}
            className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            <span>推送报关</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* 抬头信息维护 */}
          <button
            type="button"
            onClick={() => addToast('查看企业、收货主体及海关备案抬头列表...', 'info')}
            className="rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            抬头信息维护
          </button>

          {/* 美线入库数据推送 */}
          <button
            type="button"
            onClick={() => addToast('调配洛杉矶/纽约中转货包直达卸货申报，EDI已对接完成...', 'success')}
            className="rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            美线入库数据推送
          </button>

          {/* Special Floating Route Push inside wrapper */}
          <button
            type="button"
            onClick={() => addToast('欧线卡排在仓预约信息与清标指令推送就绪...', 'success')}
            className="rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            欧线入库数据推送
          </button>

          {/* Show Multi Delete if items are selected */}
          {selectedIds.length > 0 && (
            <button
              id="btn-delete-selected"
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 rounded bg-red-650 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm shadow-red-100 animate-pulse"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>作废选中 ({selectedIds.length})</span>
            </button>
          )}
        </div>

        {/* Far Right: Gear settings block in a blue box precisely as in screenshot */}
        <button
          type="button"
          onClick={() => addToast('启动集港系统个性化列位置与显示自适应过滤板块...', 'info')}
          className="rounded bg-[#004bb1] p-2 text-white hover:bg-[#003b91] transition-all shrink-0"
          title="表头列定制"
        >
          <Settings2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Grid Layout containing Main Table and details panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        
        {/* Table Area (takes 3 columns when trace panel is active, otherwise full 4 columns) */}
        <div className={`rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm ${
          activeTraceWaybill ? 'lg:col-span-3' : 'lg:col-span-4'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wide">
                  <th className="w-12 py-3 px-3.5 text-center">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      checked={paginatedWaybills.length > 0 && paginatedWaybills.every(w => selectedIds.includes(w.id))}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="w-36 py-3 px-3 text-xs">运单号</th>
                  <th className="w-24 py-3 px-3 text-xs text-center">标识</th>
                  <th className="w-36 py-3 px-3 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setSortAsc(!sortAsc)}
                      className="flex items-center gap-1 hover:text-slate-800"
                    >
                      <span>创建时间</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="w-36 py-3 px-3 text-xs">拣货时间</th>
                  <th className="w-36 py-3 px-3 text-xs">出货单</th>
                  <th className="w-32 py-3 px-3 text-xs">集团单号</th>
                  <th className="w-40 py-3 px-3 text-xs">客户</th>
                  <th className="w-32 py-3 px-3 text-xs">附加费申请</th>
                  <th className="w-28 py-3 px-3 text-xs">邮编</th>
                  <th className="w-36 py-3 px-3 text-xs font-semibold">经营单位</th>
                  <th className="w-28 py-3 px-3 text-xs">客户类型</th>
                  <th className="w-32 py-3 px-3 text-xs text-center">运单状态</th>
                  <th className="w-28 py-3 px-3 text-xs text-center">动作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11.5px] text-slate-700">
                {paginatedWaybills.length > 0 ? (
                  paginatedWaybills.map((w) => {
                    const isSelected = selectedIds.includes(w.id);
                    const isCurrentlyTraced = activeTraceWaybill?.id === w.id;
                    return (
                      <tr 
                        key={w.id}
                        id={`waybill-row-${w.id}`}
                        className={`transition-colors hover:bg-blue-50/20 ${
                          isSelected ? 'bg-blue-50/10' : ''
                        } ${isCurrentlyTraced ? 'bg-blue-100/10' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-2.5 px-3.5 text-center">
                          <input
                            id={`checkbox-row-${w.id}`}
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(w.id)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>

                        {/* Waybill ID */}
                        <td className="py-2.5 px-3">
                          <span className="text-slate-900 font-mono font-bold hover:text-blue-600 transition-colors cursor-pointer block truncate" onClick={() => setActiveTraceWaybill(w)}>
                            {w.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block truncate" title="FBA货物箱标">
                            {w.fbaCode}
                          </span>
                        </td>

                        {/* 标识 */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1 select-none">
                            <span className="text-amber-500 font-bold" title="推荐星标">★</span>
                            {w.insurance ? (
                              <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1 rounded" title="已投查验保">保</span>
                            ) : (
                              <span className="bg-slate-100 text-slate-500 text-[9px] font-extrabold px-1 rounded" title="普通货品">无</span>
                            )}
                          </div>
                        </td>

                        {/* 创建时间 */}
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          {w.createTime}
                        </td>

                        {/* 拣货时间 */}
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          {w.pickupTime}
                        </td>

                        {/* 出货单 */}
                        <td className="py-2.5 px-3 font-semibold text-slate-800 truncate max-w-[120px]" title={w.description}>
                          {w.description}
                        </td>

                        {/* 集团单号 */}
                        <td className="py-2.5 px-3 font-mono text-slate-600 truncate max-w-[100px]">
                          {w.groupCode}
                        </td>

                        {/* 客户 */}
                        <td className="py-2.5 px-3 text-slate-800 font-semibold truncate max-w-[130px]" title={w.customerName || '付豪跨境电商群'}>
                          {w.customerName || '付豪跨境电商事业群'}
                        </td>

                        {/* 附加费申请 */}
                        <td className="py-2.5 px-3">
                          {w.insurance ? (
                            <span className="text-amber-600 font-bold">拼箱查验费</span>
                          ) : (
                            <span className="text-slate-400">无</span>
                          )}
                        </td>

                        {/* 邮编 */}
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          {w.zipCode}
                        </td>

                        {/* 经营单位 */}
                        <td className="py-2.5 px-3 font-semibold text-slate-800 truncate max-w-[120px]" title={w.carrier}>
                          {w.carrier}
                        </td>

                        {/* 客户类型 */}
                        <td className="py-2.5 px-3">
                          <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            w.customerType === 'vip' 
                              ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {w.customerType.toUpperCase()}
                          </span>
                        </td>

                        {/* 运单状态 select */}
                        <td className="py-2.5 px-2 text-center">
                          <select
                            id={`status-selector-${w.id}`}
                            value={w.status}
                            onChange={(e) => {
                              onUpdateWaybillStatus(w.id, e.target.value as Waybill['status']);
                              addToast(`运单 ${w.id} 状态已更新为 [${e.target.value}]`, 'success');
                            }}
                            className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold border focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${getStatusStyle(w.status)}`}
                          >
                            <option value="待揽收">待揽收</option>
                            <option value="转运中">转运中</option>
                            <option value="已收货">已收货</option>
                            <option value="异常件">异常件</option>
                          </select>
                        </td>

                        {/* 动作 */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTraceWaybill(w);
                                addToast(`已加载运单 ${w.id} 物流详细生命链路`, 'info');
                              }}
                              className="text-blue-600 font-bold hover:underline"
                              title="追踪路由"
                            >
                              追踪
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`确认单独作废/删除运单 ${w.id} ？`)) {
                                  onDeleteWaybills([w.id]);
                                  addToast(`已作废运单 [${w.id}]`, 'success');
                                }
                              }}
                              className="text-red-500 hover:text-red-700 font-semibold"
                              title="作废运单"
                            >
                              作废
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={14} className="py-12 text-center text-slate-400 text-xs font-sans">
                      <AlertOctagon className="h-6 w-6 text-slate-400 mx-auto mb-2 animate-bounce" />
                      当前检索条件下暂无匹配运单数据，请使用“重置”或重新录入。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Pagination controller */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-150 bg-slate-50 px-5 py-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span>共 <strong className="text-slate-800">{totalItems}</strong> 条数据记录</span>
              <span className="text-slate-350">|</span>
              <div className="flex items-center gap-1">
                <select
                  id="select-items-limit"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600"
                >
                  <option value={5}>5 条/页</option>
                  <option value={10}>10 条/页</option>
                  <option value={20}>20 条/页</option>
                  <option value={50}>50 条/页</option>
                  <option value={100}>100 条/页</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="btn-prev-page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                &lt; 上一页
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  const isCurrent = pNum === currentPage;
                  return (
                    <button
                      key={pNum}
                      id={`page-btn-${pNum}`}
                      onClick={() => setCurrentPage(pNum)}
                      className={`h-7 w-7 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-100'
                          : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                id="btn-next-page"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                下一页 &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Trace Logistics Milestone Timeline Side Panel (Active when row clicked "追踪" or "单号") */}
        {activeTraceWaybill && (
          <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm space-y-4 lg:col-span-1 border-t-4 border-t-blue-600 animate-slide-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1">
                <Truck className="h-4 w-4 text-blue-600" />
                仓储物流智能追踪
              </span>
              <button
                id="btn-close-trace"
                onClick={() => setActiveTraceWaybill(null)}
                className="text-slate-400 hover:text-slate-600 rounded-full p-0.5 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* General detail bar */}
            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600">
              <p>
                <strong className="text-slate-800">运单号:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border">{activeTraceWaybill.id}</code>
              </p>
              <p>
                <strong className="text-slate-800">FBA箱标:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border">{activeTraceWaybill.fbaCode}</code>
              </p>
              <p>
                <strong className="text-slate-800">发航站点:</strong> {activeTraceWaybill.station}
              </p>
              <p>
                <strong className="text-slate-800">总包数量:</strong> {activeTraceWaybill.packagesCount} 件 (包箱)
              </p>
            </div>

            {/* Vertical timeline steps */}
            <div className="space-y-4 pt-2">
              {[
                {
                  title: '出口港顺利提单清关 (美国海关入库)',
                  time: '2026-06-16 11:22:15',
                  desc: '目的港海关及拼箱代理已清关放行，进入海外仓拆柜分派阶段。',
                  active: activeTraceWaybill.status === '已收货',
                },
                {
                  title: '海空专线公海轮渡 (干线运输中)',
                  time: '2026-06-16 04:12:00',
                  desc: '波音空运专机 / 美森极速轮渡中，预计 48 小时后抵达洛杉矶港区中转场。',
                  active: activeTraceWaybill.status === '转运中' || activeTraceWaybill.status === '已收货',
                },
                {
                  title: '天图塘厦分拣仓完成拼箱称重并出库交付',
                  time: activeTraceWaybill.pickupTime !== '未揽收' ? activeTraceWaybill.pickupTime : '2026-06-16 02:30:00',
                  desc: '贴标装箱确认合格，购买国内查验宝保障。',
                  active: activeTraceWaybill.status !== '待揽收',
                },
                {
                  title: '商家创建发货运单 (待揽收)',
                  time: activeTraceWaybill.createTime,
                  desc: '客户自主网上填报，运单建立成功，等待集港货站统一揽件理单。',
                  active: true,
                },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-2.5 relative">
                  {/* Vertical dotted progress bar line */}
                  {idx < 3 && (
                    <div className="absolute left-2.5 top-5 bottom-0 w-0.5 border-l-2 border-dashed border-slate-200" />
                  )}

                  {/* Node icon indicator */}
                  <div className={`z-10 flex h-5.5 w-5.5 items-center justify-center rounded-full border text-[10px] font-bold ${
                    step.active
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm animate-pulse'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}>
                    {4 - idx}
                  </div>

                  {/* Milestone description labels */}
                  <div className="flex-1 text-[11px] space-y-1">
                    <h4 className={`font-semibold leading-snug ${
                      step.active ? 'text-slate-905 font-bold' : 'text-slate-450'
                    }`}>
                      {step.title}
                    </h4>
                    <span className="block text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3 shrink-0" />
                      {step.time}
                    </span>
                    {step.active && (
                      <p className="text-[10px] text-slate-500 leading-relaxed bg-slate-50 p-1.5 rounded border border-slate-150">
                        {step.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
