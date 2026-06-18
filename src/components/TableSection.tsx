import React, { useState } from 'react';
import { 
  Search, RotateCcw, ChevronDown, ChevronUp, Plus, Trash2, 
  RefreshCw, Settings2, ShieldCheck, HelpCircle, ArrowUpDown,
  FileDown, Check, AlertOctagon, MapPin, X,
  Copy, Printer
} from 'lucide-react';
import { Waybill, SearchParams, OrderType } from '../types';

interface TableSectionProps {
  waybills: Waybill[];
  onAddWaybillClick: (orderType: OrderType) => void;
  onDeleteWaybills: (ids: string[]) => void;
  onUpdateWaybillStatus: (id: string, nextStatus: Waybill['status']) => void;
  onUpdateWaybill: (id: string, patch: Partial<Waybill>) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export default function TableSection({ 
  waybills, 
  onAddWaybillClick, 
  onDeleteWaybills,
  onUpdateWaybillStatus,
  onUpdateWaybill,
  addToast
}: TableSectionProps) {
  // Filters state
  const [keywords, setKeywords] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [carrier, setCarrier] = useState('');
  const [tradeMode, setTradeMode] = useState('');
  
  // Active status tab filter
  const [activeStatusTab, setActiveStatusTab] = useState<string>('全部');

  // Applied filters state for search matching
  const [appliedFilters, setAppliedFilters] = useState<SearchParams>({
    keywords: '',
    groupCode: '',
    carrier: '',
    tradeMode: ''
  });

  // Collapsible search block
  const [extraFiltersOpen, setExtraFiltersOpen] = useState(true);

  // Selected checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchMenuOpen, setBatchMenuOpen] = useState(false);
  const [batchTradePanelOpen, setBatchTradePanelOpen] = useState(false);
  const [batchTradeMode, setBatchTradeMode] = useState('');

  const [activeDetailWaybill, setActiveDetailWaybill] = useState<Waybill | null>(null);
  const [importInfoWaybill, setImportInfoWaybill] = useState<Waybill | null>(null);
  const [importInfoFileName, setImportInfoFileName] = useState('');
  const [editingWaybill, setEditingWaybill] = useState<Waybill | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Waybill>>({});

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
    // Trade mode match
    if (appliedFilters.tradeMode) {
      if (appliedFilters.tradeMode === '__EMPTY__') {
        if (item.tradeMode) return false;
      } else if (item.tradeMode !== appliedFilters.tradeMode) {
        return false;
      }
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
    setAppliedFilters({ keywords, groupCode, carrier, tradeMode });
    setCurrentPage(1);
    addToast('已根据输入条件重新检索匹配运单', 'success');
  };

  const handleReset = () => {
    setKeywords('');
    setGroupCode('');
    setCarrier('');
    setTradeMode('');
    setAppliedFilters({ keywords: '', groupCode: '', carrier: '', tradeMode: '' });
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

  const handleBatchTradeModeUpdate = (nextTradeMode = batchTradeMode) => {
    if (selectedIds.length === 0) {
      addToast('请在下方列表中勾选目标运单进行批量操作！', 'warning');
      return;
    }
    if (!nextTradeMode) {
      addToast('请选择要批量修改的贸易方式', 'warning');
      return;
    }

    const selectedWaybills = waybills.filter(item => selectedIds.includes(item.id));
    const unsupportedWaybills = selectedWaybills.filter(item => (item.customsDeclarationType || '托管报关') === '托管报关');

    if (unsupportedWaybills.length > 0) {
      const blockedText = unsupportedWaybills.map(item => `[${item.id}]`).join('、');
      addToast(`${blockedText}报关方式不支持该贸易方式`, 'warning');
      return;
    }

    selectedIds.forEach(id => onUpdateWaybill(id, { tradeMode: nextTradeMode }));
    setBatchTradeMode(nextTradeMode);
    setBatchTradePanelOpen(false);
    setBatchMenuOpen(false);
    addToast(`已批量修改 ${selectedIds.length} 张运单贸易方式为 ${nextTradeMode}`, 'success');
  };

  const handleConfirmImportInfo = () => {
    if (!importInfoWaybill) return;
    if (!importInfoFileName) {
      addToast('请先上传运单信息文件', 'warning');
      return;
    }

    onUpdateWaybill(importInfoWaybill.id, { hasUploadedInvoice: true });
    if (activeDetailWaybill?.id === importInfoWaybill.id) {
      setActiveDetailWaybill({ ...activeDetailWaybill, hasUploadedInvoice: true });
    }
    addToast(`运单 ${importInfoWaybill.id} 信息导入成功`, 'success');
    setImportInfoWaybill(null);
    setImportInfoFileName('');
  };

  const openWaybillDetail = (waybill: Waybill) => {
    setActiveDetailWaybill(waybill);
  };

  const getCustomerOrderNo = (waybill: Waybill) => waybill.customerOrderNo || `YP${waybill.id.replace(/^HD/, '')}000301`;

  const getConsignee = (waybill: Waybill) => waybill.consignee || (waybill.country === '美国' ? 'Fernando Ocana' : 'International Consignee');
  const getCity = (waybill: Waybill) => waybill.city || (waybill.country === '美国' ? 'Whitestone' : 'London');
  const getState = (waybill: Waybill) => waybill.state || (waybill.country === '美国' ? 'NY' : '-');
  const getPhone = (waybill: Waybill) => waybill.phone || '9177503147';
  const getAddress1 = (waybill: Waybill) => waybill.address1 || (waybill.country === '美国' ? '2406 169th Street' : 'Warehouse receiving address');
  const getWarehouseCode = (waybill: Waybill) => waybill.warehouseCode || '私人地址';

  const startEditingBasicInfo = (waybill: Waybill) => {
    setEditingWaybill(waybill);
    setEditDraft({
      customerName: waybill.customerName || '塘厦测试客户',
      customerOrderNo: getCustomerOrderNo(waybill),
      carrier: waybill.carrier,
      consignee: getConsignee(waybill),
      warehouseCode: getWarehouseCode(waybill),
      company: waybill.company || '',
      address1: getAddress1(waybill),
      address2: waybill.address2 || '',
      address3: waybill.address3 || '',
      city: getCity(waybill),
      state: getState(waybill),
      zipCode: waybill.zipCode,
      country: waybill.country,
      phone: getPhone(waybill),
      email: waybill.email || '',
      amazonReferenceId: waybill.amazonReferenceId || '',
      orderWeek: waybill.orderWeek || '2026-06-28 ~ 2026-07-04',
      associatedNo: waybill.associatedNo || '',
      delegatedPickup: waybill.delegatedPickup || '',
      combinedDeclaration: waybill.combinedDeclaration || '',
      combinedClearance: waybill.combinedClearance || '',
      poNumber: waybill.poNumber || '',
      referenceNo1: waybill.referenceNo1 || '',
      referenceNo2: waybill.referenceNo2 || '',
      internalNote: waybill.internalNote || '',
      remarks: waybill.remarks || '',
      taxMethod: waybill.taxMethod || '包税',
      customsDeclarationType: waybill.customsDeclarationType || '托管报关',
      tradeMode: waybill.tradeMode || '',
      clearanceMethod: waybill.clearanceMethod || '',
      vatNo: waybill.vatNo || '',
      iossNo: waybill.iossNo || '',
      eori: waybill.eori || '',
      currency: waybill.currency || 'USD',
      description: waybill.description,
      itemAttributes: waybill.itemAttributes || [],
      buyInsurance: waybill.buyInsurance ?? false,
      domesticInspection: waybill.domesticInspection ?? false,
    });
  };

  const updateEditDraft = <K extends keyof Waybill>(field: K, value: Waybill[K]) => {
    setEditDraft(prev => ({ ...prev, [field]: value }));
  };

  const updateTextDraft = (field: keyof Waybill, value: string) => {
    setEditDraft(prev => ({ ...prev, [field]: value }));
  };

  const updateBooleanDraft = (field: keyof Waybill, value: boolean) => {
    setEditDraft(prev => ({ ...prev, [field]: value }));
  };

  const textDraftValue = (field: keyof Waybill) => {
    const value = editDraft[field];
    if (value === undefined || value === null || Array.isArray(value) || typeof value === 'boolean') return '';
    return String(value);
  };

  const toggleItemAttribute = (attribute: string) => {
    const current = editDraft.itemAttributes || [];
    const next = current.includes(attribute)
      ? current.filter(item => item !== attribute)
      : [...current, attribute];
    updateEditDraft('itemAttributes', next);
  };

  const saveBasicInfo = () => {
    if (!editingWaybill) return;
    const selectedDeclarationType = textDraftValue('customsDeclarationType');
    const selectedTradeMode = textDraftValue('tradeMode').trim();
    if (selectedDeclarationType === '托管报关' && selectedTradeMode) {
      addToast('当前报关方式不支持该贸易方式', 'warning');
      return;
    }
    onUpdateWaybill(editingWaybill.id, editDraft);
    const updatedWaybill = { ...editingWaybill, ...editDraft };
    setActiveDetailWaybill(updatedWaybill);
    setEditingWaybill(null);
    setEditDraft({});
    addToast(`运单 ${editingWaybill.id} 基础信息已保存`, 'success');
  };

  const cancelBasicInfoEdit = () => {
    setEditingWaybill(null);
    setEditDraft({});
  };

  const getDetailRows = (waybill: Waybill) => ([
    [
      ['服务商', waybill.carrier],
      ['目的地', waybill.country],
      ['费用', waybill.insurance ? '1432' : '0'],
      ['仓库代码', getWarehouseCode(waybill)],
    ],
    [
      ['收费重', String(Math.max(waybill.packagesCount * 6, 1))],
      ['实重', String(Math.max(waybill.packagesCount * 6, 1))],
      ['材积重', (waybill.packagesCount * 12.86).toFixed(1)],
      ['计泡系数', '6000'],
    ],
    [
      ['体积', `${(waybill.packagesCount * 0.078).toFixed(2)} m³`],
      ['箱数', String(waybill.packagesCount)],
      ['提单号', waybill.fbaCode],
      ['货站', waybill.station],
    ],
  ]);

  const basicInfoLeft = (waybill: Waybill) => ([
    ['客户名称', waybill.customerName || '塘厦测试客户'],
    ['服务商', waybill.carrier],
    ['收件人', getConsignee(waybill)],
    ['城市', getCity(waybill)],
    ['邮编', waybill.zipCode],
    ['电话', getPhone(waybill)],
    ['报关方式', waybill.customsDeclarationType || '托管报关'],
    ['收费重', String(Math.max(waybill.packagesCount * 6, 1))],
    ['主品名', waybill.description],
    ['是否购买国内查验宝', waybill.insurance ? '是' : '否'],
  ]);

  const basicInfoRight = (waybill: Waybill) => ([
    ['客户单号', getCustomerOrderNo(waybill)],
    ['服务商类型', '国际运输'],
    ['地址一', getAddress1(waybill)],
    ['州', getState(waybill)],
    ['目的地', waybill.country],
    ['交税方式', waybill.taxMethod || '包税'],
    ['申报币种', waybill.currency || 'USD'],
    ['仓库代码', getWarehouseCode(waybill)],
    ['预计送达周', waybill.orderWeek || '2026-06-28~2026-07-04'],
  ]);

  const detailTabs = ['基础信息', '货物信息', '费用信息', '运踪信息', '其他信息', '中转信息'];
  const tradeModeOptions = ['9610', '9710', '9810', '0110', '1039'];
  const itemAttributeOptions = ['带电', '带磁', '普货', '液体', '粉末', '木制品', '危险品', '纺织品', '木架', '钢铁铝', '冲货类', '电子类', '灯类', '自行车类', '鼠标键盘'];
  const fieldClass = "h-8 w-full rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const disabledFieldClass = "h-8 w-full rounded border border-slate-200 bg-slate-50 px-3 text-xs text-slate-400 outline-none";
  const labelClass = "w-32 shrink-0 text-right text-xs text-slate-600";
  const requiredMark = <span className="mr-0.5 text-red-500">*</span>;

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
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

                {/* Trade Mode */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    贸易方式
                  </label>
                  <select
                    id="search-trade-mode"
                    value={tradeMode}
                    onChange={(e) => setTradeMode(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">全部贸易方式</option>
                    <option value="__EMPTY__">未填写</option>
                    <option value="9610">9610</option>
                    <option value="9710">9710</option>
                    <option value="9810">9810</option>
                    <option value="0110">0110</option>
                    <option value="1039">1039</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
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
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setBatchMenuOpen(prev => {
                  const nextOpen = !prev;
                  return nextOpen;
                });
              }}
              className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
            >
              <span>批量操作</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {batchMenuOpen && (
              <div className="absolute left-0 top-full z-30 mt-1 w-36 rounded-sm border border-slate-200 bg-white py-1 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedIds.length === 0) {
                      addToast('请在下方列表中勾选目标运单进行批量操作！', 'warning');
                      return;
                    }
                    setBatchMenuOpen(false);
                    setBatchTradePanelOpen(true);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] text-slate-700 hover:bg-blue-50 hover:text-[#004bb1]"
                >
                  <span>批量修改贸易方式</span>
                </button>
              </div>
            )}
          </div>

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

      {/* Grid Layout containing Main Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        
        {/* Table Area */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm lg:col-span-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[1280px]">
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
                  <th className="w-28 py-3 px-3 text-xs">贸易方式</th>
                  <th className="w-28 py-3 px-3 text-xs">客户类型</th>
                  <th className="w-32 py-3 px-3 text-xs text-center">运单状态</th>
                  <th className="w-28 py-3 px-3 text-xs text-center">动作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11.5px] text-slate-700">
                {paginatedWaybills.length > 0 ? (
                  paginatedWaybills.map((w) => {
                    const isSelected = selectedIds.includes(w.id);
                    return (
                      <tr 
                        key={w.id}
                        id={`waybill-row-${w.id}`}
                        onDoubleClick={() => openWaybillDetail(w)}
                        title="双击查看运单详情"
                        className={`transition-colors hover:bg-blue-50/20 ${
                          isSelected ? 'bg-blue-50/10' : ''
                        } cursor-default`}
                      >
                        {/* Checkbox */}
                        <td className="py-2.5 px-3.5 text-center">
                          <input
                            id={`checkbox-row-${w.id}`}
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(w.id)}
                            onDoubleClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>

                        {/* Waybill ID */}
                        <td className="py-2.5 px-3">
                          <span className="text-slate-900 font-mono font-bold block truncate">
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

                        {/* 贸易方式 */}
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {w.tradeMode || '-'}
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
                            onDoubleClick={(e) => e.stopPropagation()}
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
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`确认单独作废/删除运单 ${w.id} ？`)) {
                                  onDeleteWaybills([w.id]);
                                  addToast(`已作废运单 [${w.id}]`, 'success');
                                }
                              }}
                              onDoubleClick={(e) => e.stopPropagation()}
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
                    <td colSpan={15} className="py-12 text-center text-slate-400 text-xs font-sans">
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

      </div>

      {activeDetailWaybill && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45">
          <div className="relative h-full w-[calc(100vw-520px)] min-w-[840px] max-w-[1400px] overflow-y-auto bg-[#edf3fb] shadow-2xl">
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
              <div className="flex h-[60px] items-center justify-between px-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-6 w-1 rounded bg-slate-900" />
                  <h2 className="truncate text-[15px] font-bold text-slate-950">
                    {activeDetailWaybill.groupCode}/{getCustomerOrderNo(activeDetailWaybill)}/{activeDetailWaybill.customerName || '塘厦测试客户'}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addToast('详情区块已一键收起/展开', 'info')}
                    className="rounded bg-[#004bb1] px-3 py-2 text-xs font-bold text-white hover:bg-[#003b91]"
                  >
                    一键收起/展开
                  </button>
                  {activeDetailWaybill.hasUploadedInvoice !== true && (
                    <button
                      type="button"
                      onClick={() => {
                        setImportInfoWaybill(activeDetailWaybill);
                        setImportInfoFileName('');
                      }}
                      className="rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      导入运单信息
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => addToast(`正在生成运单 ${activeDetailWaybill.id} 打印标签`, 'info')}
                    className="flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>打印标签</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDetailWaybill(null)}
                    className="rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    aria-label="关闭详情"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="overflow-hidden border border-slate-200 bg-white">
                  <table className="w-full table-fixed border-collapse text-[11px]">
                    <tbody>
                      {getDetailRows(activeDetailWaybill).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map(([label, value]) => (
                            <React.Fragment key={label}>
                              <td className="w-[10%] border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-500">
                                {label}
                              </td>
                              <td className="w-[15%] border border-slate-200 px-3 py-2 text-slate-800">
                                {value || '-'}
                              </td>
                            </React.Fragment>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center border-t border-slate-200 bg-[#eef4fb] px-4">
                {detailTabs.map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      if (index !== 0) addToast(`${tab}模块已预留，当前展示基础信息`, 'info');
                    }}
                    className={`relative px-3 py-3 text-xs font-semibold ${
                      index === 0 ? 'text-[#004bb1]' : 'text-slate-700 hover:text-[#004bb1]'
                    }`}
                  >
                    {tab}
                    {index === 0 && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#004bb1]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 p-4">
              <section className="rounded-md bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">基础信息</h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-[#004bb1]">
                    <button
                      type="button"
                      onClick={() => addToast('基础信息已复制', 'success')}
                      className="flex items-center gap-1 hover:underline"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>复制</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditingBasicInfo(activeDetailWaybill)}
                      className="hover:underline"
                    >
                      编辑
                    </button>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-20 gap-y-3 px-1 pb-3 text-[12px]">
                  <div className="space-y-3">
                    {basicInfoLeft(activeDetailWaybill).map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[140px_minmax(0,1fr)] items-start gap-3">
                        <span className="text-right text-slate-600">{label}：</span>
                        <span className="min-w-0 text-slate-800">{value || '-'}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {basicInfoRight(activeDetailWaybill).map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[140px_minmax(0,1fr)] items-start gap-3">
                        <span className="text-right text-slate-600">{label}：</span>
                        <span className="min-w-0 text-slate-800">{value || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-md bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">VAT信息</h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#004bb1]">
                    <button type="button" className="hover:underline">编辑</button>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {batchTradePanelOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/50 pt-16">
          <div className="w-[520px] rounded-sm bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-bold text-slate-900">批量修改贸易方式</h3>
            </div>
            <div className="space-y-4 px-7 py-5 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600">运单号：</span>
                <span className="font-semibold text-slate-700">
                  {selectedIds.length > 2 ? `${selectedIds.slice(0, 2).join('、')} 等 ${selectedIds.length} 单` : selectedIds.join('、')}
                </span>
              </div>
              <label className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600">
                  <span className="mr-0.5 text-red-500">*</span>贸易方式：
                </span>
                <select
                  value={batchTradeMode}
                  onChange={(e) => setBatchTradeMode(e.target.value)}
                  className="h-9 flex-1 rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">请选择贸易方式</option>
                  {tradeModeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setBatchTradePanelOpen(false)}
                className="rounded border border-slate-300 bg-white px-5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => handleBatchTradeModeUpdate()}
                className="rounded bg-[#004bb1] px-5 py-1.5 text-xs font-bold text-white hover:bg-[#003b91]"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {importInfoWaybill && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/50 pt-32">
          <div className="w-[520px] rounded-sm bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-xl font-bold text-slate-900">导入运单信息</h3>
            </div>
            <div className="space-y-5 px-8 py-7 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600">运单号：</span>
                <span className="font-semibold text-slate-700">{importInfoWaybill.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600">
                  <span className="mr-0.5 text-red-500">*</span>导入文件：
                </span>
                <label className="inline-flex cursor-pointer items-center rounded bg-[#004bb1] px-5 py-2 text-xs font-bold text-white hover:bg-[#003b91]">
                  点击上传
                  <input
                    type="file"
                    accept=".xls,.xlsx,.csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImportInfoFileName(file.name);
                    }}
                  />
                </label>
                {importInfoFileName && (
                  <span className="max-w-[180px] truncate text-slate-500" title={importInfoFileName}>
                    {importInfoFileName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600">模板下载：</span>
                <button
                  type="button"
                  onClick={() => addToast('下载导入运单信息模板功能已预留', 'info')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  下载专用模板
                </button>
              </div>
              <p className="pl-[92px] text-sm font-semibold leading-7 text-red-500">
                美国亚马逊仓库 ORF2 / VGT2 / SWF2：UPS派送有<br />
                新旧地址，下单时请务必核对清楚。
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={handleConfirmImportInfo}
                className="rounded bg-[#004bb1] px-5 py-1.5 text-xs font-bold text-white hover:bg-[#003b91]"
              >
                确定
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportInfoWaybill(null);
                  setImportInfoFileName('');
                }}
                className="rounded border border-slate-300 bg-white px-5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {editingWaybill && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-slate-950/45">
          <div className="h-full w-[calc(100vw-610px)] min-w-[980px] max-w-[1500px] overflow-y-auto bg-[#edf3fb] shadow-2xl">
            <div className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 rounded bg-slate-900" />
                <h2 className="text-[15px] font-bold text-slate-950">编辑基础信息</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={saveBasicInfo}
                  className="rounded bg-[#004bb1] px-7 py-1.5 text-xs font-bold text-white hover:bg-[#003b91]"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={cancelBasicInfoEdit}
                  className="rounded border border-slate-300 bg-white px-7 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  取消
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="rounded-md bg-white p-5 shadow-sm">
                <div className="grid grid-cols-2 gap-x-14 gap-y-3">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>{requiredMark}客户名称：</span>
                      <input
                        value={textDraftValue('customerName')}
                        onChange={(e) => updateTextDraft('customerName', e.target.value)}
                        className={disabledFieldClass}
                      />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>客户单号：</span>
                      <input
                        value={textDraftValue('customerOrderNo')}
                        onChange={(e) => updateTextDraft('customerOrderNo', e.target.value)}
                        className={fieldClass}
                      />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>{requiredMark}服务商：</span>
                      <input
                        value={textDraftValue('carrier')}
                        onChange={(e) => updateTextDraft('carrier', e.target.value)}
                        className="h-8 flex-1 rounded border border-transparent bg-transparent px-0 text-xs font-bold text-slate-800 outline-none"
                      />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>{requiredMark}收件人：</span>
                      <input
                        value={textDraftValue('consignee')}
                        onChange={(e) => updateTextDraft('consignee', e.target.value)}
                        className={fieldClass}
                      />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>{requiredMark}仓库代码：</span>
                      <select
                        value={textDraftValue('warehouseCode')}
                        onChange={(e) => updateTextDraft('warehouseCode', e.target.value)}
                        className={fieldClass}
                      >
                        <option value="私人地址">私人地址</option>
                        <option value="塘厦仓">塘厦仓</option>
                        <option value="广州仓">广州仓</option>
                        <option value="义乌仓">义乌仓</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>公司：</span>
                      <input
                        value={textDraftValue('company')}
                        onChange={(e) => updateTextDraft('company', e.target.value)}
                        className={fieldClass}
                        placeholder="请输入"
                      />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>{requiredMark}地址一：</span>
                      <input
                        value={textDraftValue('address1')}
                        onChange={(e) => updateTextDraft('address1', e.target.value)}
                        className={fieldClass}
                      />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>地址二：</span>
                      <input
                        value={textDraftValue('address2')}
                        onChange={(e) => updateTextDraft('address2', e.target.value)}
                        className={fieldClass}
                        placeholder="请输入"
                      />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>地址三：</span>
                      <input
                        value={textDraftValue('address3')}
                        onChange={(e) => updateTextDraft('address3', e.target.value)}
                        className={fieldClass}
                        placeholder="请输入"
                      />
                    </label>
                    <div className="flex items-center gap-3">
                      <span className={labelClass}>城市/州/邮编：</span>
                      <div className="grid flex-1 grid-cols-3 gap-2">
                        <input value={textDraftValue('city')} onChange={(e) => updateTextDraft('city', e.target.value)} className={fieldClass} />
                        <input value={textDraftValue('state')} onChange={(e) => updateTextDraft('state', e.target.value)} className={fieldClass} />
                        <input value={textDraftValue('zipCode')} onChange={(e) => updateTextDraft('zipCode', e.target.value)} className={fieldClass} />
                      </div>
                    </div>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>{requiredMark}目的地：</span>
                      <select
                        value={textDraftValue('country')}
                        onChange={(e) => updateTextDraft('country', e.target.value)}
                        className={fieldClass}
                      >
                        <option value="美国">美国</option>
                        <option value="英国">英国</option>
                        <option value="德国">德国</option>
                        <option value="加拿大">加拿大</option>
                        <option value="日本">日本</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>电话：</span>
                      <input value={textDraftValue('phone')} onChange={(e) => updateTextDraft('phone', e.target.value)} className={fieldClass} />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>邮箱：</span>
                      <input value={textDraftValue('email')} onChange={(e) => updateTextDraft('email', e.target.value)} className={fieldClass} placeholder="请输入" />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>Amazon Reference ID：</span>
                      <input value={textDraftValue('amazonReferenceId')} onChange={(e) => updateTextDraft('amazonReferenceId', e.target.value)} className={fieldClass} placeholder="请输入" />
                    </label>
                    <div className="flex items-center gap-3 pt-5">
                      <span className={labelClass}>系统预计送达周：</span>
                    </div>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>预计送达周：</span>
                      <input value={textDraftValue('orderWeek')} onChange={(e) => updateTextDraft('orderWeek', e.target.value)} className="h-8 w-48 rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </label>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>关联单号：</span>
                      <input value={textDraftValue('associatedNo')} onChange={(e) => updateTextDraft('associatedNo', e.target.value)} className={fieldClass} placeholder="请输入" />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>委托抬头：</span>
                      <select value={textDraftValue('delegatedPickup')} onChange={(e) => updateTextDraft('delegatedPickup', e.target.value)} className={fieldClass}>
                        <option value="">请选择</option>
                        <option value="塘厦测试客户">塘厦测试客户</option>
                        <option value="深圳天图电子有限公司">深圳天图电子有限公司</option>
                      </select>
                    </label>
                    <div className="flex h-8 items-center gap-3">
                      <span className={labelClass}>合并报关：</span>
                      <span className="text-xs text-slate-400">{textDraftValue('combinedDeclaration')}</span>
                    </div>
                    <div className="flex h-8 items-center gap-3">
                      <span className={labelClass}>合并清关：</span>
                      <span className="text-xs text-slate-400">{textDraftValue('combinedClearance')}</span>
                    </div>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>PO Number：</span>
                      <input value={textDraftValue('poNumber')} onChange={(e) => updateTextDraft('poNumber', e.target.value)} className={fieldClass} placeholder="请输入" />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>参考单号1：</span>
                      <input value={textDraftValue('referenceNo1')} onChange={(e) => updateTextDraft('referenceNo1', e.target.value)} className={fieldClass} placeholder="请输入" />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>参考单号2：</span>
                      <input value={textDraftValue('referenceNo2')} onChange={(e) => updateTextDraft('referenceNo2', e.target.value)} className={fieldClass} placeholder="请输入" />
                    </label>
                    <label className="flex items-start gap-3">
                      <span className={`${labelClass} pt-2`}>内部备注：</span>
                      <textarea value={textDraftValue('internalNote')} onChange={(e) => updateTextDraft('internalNote', e.target.value)} className="h-12 w-full resize-none rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="请输入内部备注" />
                    </label>
                    <label className="flex items-start gap-3">
                      <span className={`${labelClass} pt-2`}>备注：</span>
                      <textarea value={textDraftValue('remarks')} onChange={(e) => updateTextDraft('remarks', e.target.value)} className="h-12 w-full resize-none rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="请输入备注" />
                    </label>
                    <div className="flex h-8 items-center gap-3">
                      <span className={labelClass}>交税方式：</span>
                      <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600">
                        {['自主税号', '自税递延', '包税', '不包税'].map(option => (
                          <label key={option} className="flex items-center gap-1.5">
                            <input type="radio" name="taxMethod" checked={textDraftValue('taxMethod') === option} onChange={() => updateTextDraft('taxMethod', option)} className="h-3 w-3 text-blue-600" />
                            <span className={option === '包税' ? 'font-bold text-blue-600' : ''}>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>报关方式：</span>
                      <select value={textDraftValue('customsDeclarationType')} onChange={(e) => updateTextDraft('customsDeclarationType', e.target.value)} className={fieldClass}>
                        <option value="托管报关">托管报关</option>
                        <option value="报关退税">报关退税</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>贸易方式：</span>
                      <select
                        value={textDraftValue('tradeMode')}
                        onChange={(e) => updateTextDraft('tradeMode', e.target.value)}
                        className={fieldClass}
                      >
                        <option value="">请选择</option>
                        {tradeModeOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>清关方式：</span>
                      <select value={textDraftValue('clearanceMethod')} onChange={(e) => updateTextDraft('clearanceMethod', e.target.value)} className={fieldClass}>
                        <option value="">请选择</option>
                        <option value="普通清关">普通清关</option>
                        <option value="递延清关">递延清关</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>VAT号：</span>
                      <input value={textDraftValue('vatNo')} onChange={(e) => updateTextDraft('vatNo', e.target.value)} className={fieldClass} placeholder="请输入" />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>IOSS号：</span>
                      <input value={textDraftValue('iossNo')} onChange={(e) => updateTextDraft('iossNo', e.target.value)} className={fieldClass} placeholder="请输入" />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className={labelClass}>EORI：</span>
                      <input value={textDraftValue('eori')} onChange={(e) => updateTextDraft('eori', e.target.value)} className={fieldClass} placeholder="请输入" />
                    </label>
                    <div className="flex h-8 items-center gap-3">
                      <span className={labelClass}>申报币种：</span>
                      <span className="text-xs font-semibold text-slate-700">{textDraftValue('currency') || 'USD'}</span>
                    </div>
                    <div className="flex h-8 items-center gap-3">
                      <span className={labelClass}>主品名：</span>
                      <span className="truncate text-xs font-semibold text-slate-700">{textDraftValue('description')}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className={`${labelClass} pt-0.5`}>物品属性：</span>
                      <div className="grid flex-1 grid-cols-7 gap-x-4 gap-y-3 text-xs text-slate-600">
                        {itemAttributeOptions.map(attribute => (
                          <label key={attribute} className="flex items-center gap-1.5 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={(editDraft.itemAttributes || []).includes(attribute)}
                              onChange={() => toggleItemAttribute(attribute)}
                              className="h-3 w-3 rounded border-slate-300 text-blue-600"
                            />
                            <span>{attribute}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex h-8 items-center gap-3 pt-3">
                      <span className={labelClass}>购买保险：</span>
                      <div className="flex items-center gap-6 text-xs text-slate-600">
                        {[true, false].map(value => (
                          <label key={String(value)} className="flex items-center gap-1.5">
                            <input type="radio" name="buyInsurance" checked={editDraft.buyInsurance === value} onChange={() => updateBooleanDraft('buyInsurance', value)} className="h-3 w-3 text-blue-600" />
                            <span>{value ? '是' : '否'}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex h-8 items-center gap-3">
                      <span className={labelClass}>是否购买国内查验宝：</span>
                      <div className="flex items-center gap-6 text-xs text-slate-600">
                        {[true, false].map(value => (
                          <label key={String(value)} className="flex items-center gap-1.5">
                            <input type="radio" name="domesticInspection" checked={editDraft.domesticInspection === value} onChange={() => updateBooleanDraft('domesticInspection', value)} className="h-3 w-3 text-blue-600" />
                            <span>{value ? '是' : '否'}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
