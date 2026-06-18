import React, { useState, useEffect, useCallback } from 'react';
import { Search, RotateCcw, Plus, Trash2, PenLine, Check, X, ExternalLink } from 'lucide-react';
import { TradeModeRule, STATION_OPTIONS, SERVICE_OPTIONS } from '../types';
import RuleFormModal from './RuleFormModal';

interface RuleConfigPageProps {
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export default function RuleConfigPage({ addToast }: RuleConfigPageProps) {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [rules, setRules] = useState<TradeModeRule[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStation, setFilterStation] = useState('');
  const [filterService, setFilterService] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // ''=全部, '1'=启用, '0'=禁用

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TradeModeRule | null>(null);

  // ─── API Helpers ────────────────────────────────────────────────────────────
  const fetchRules = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStation) params.set('stationCode', filterStation);
      if (filterService) params.set('serviceCode', filterService);
      if (filterStatus) params.set('status', filterStatus);

      const res = await fetch(`/api/trade-mode-rules?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRules(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterStation, filterService, filterStatus]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  // ─── Filter Handlers ────────────────────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setLoading(true);
    fetchRules();
  };

  const handleReset = () => {
    setFilterStation('');
    setFilterService('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  // ─── CRUD Handlers ──────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingRule(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (rule: TradeModeRule) => {
    setEditingRule(rule);
    setModalOpen(true);
  };

  const handleSave = async (draft: Omit<TradeModeRule, 'id' | 'createTime' | 'updateTime'> & { id?: number }) => {
    try {
      const isEdit = !!draft.id;
      const url = isEdit ? `/api/trade-mode-rules/${draft.id}` : '/api/trade-mode-rules';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });

      const json = await res.json();
      if (json.success) {
        addToast(isEdit ? '规则已更新' : '规则创建成功', 'success');
        setModalOpen(false);
        setEditingRule(null);
        fetchRules();
      } else {
        addToast(json.message || '保存失败', 'warning');
      }
    } catch {
      addToast('网络异常，保存失败', 'warning');
    }
  };

  const handleDelete = async (id: number) => {
    const rule = rules.find(r => r.id === id);
    const stationNames = (rule?.stationCodes || []).map(getStationName).join('、');
    if (!confirm(`确认删除"${stationNames}"的规则吗？此操作无法撤销。`)) return;
    try {
      const res = await fetch(`/api/trade-mode-rules/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        addToast('规则已删除', 'success');
        fetchRules();
      }
    } catch {
      addToast('删除失败', 'warning');
    }
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const getStationName = (code: string) => STATION_OPTIONS.find(o => o.code === code)?.name || code;
  const getServiceName = (code: string) => SERVICE_OPTIONS.find(o => o.code === code)?.name || code;

  const stationNamesForRule = (r: TradeModeRule) =>
    r.stationCodes.length === 0 ? '-' : r.stationCodes.map(getStationName).join('、');

  const serviceNamesForRule = (r: TradeModeRule) =>
    r.serviceCodes.length === 0 ? '-' : r.serviceCodes.map(getServiceName).join('、');

  // Pagination
  const totalItems = rules.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRules = rules.slice(startIndex, startIndex + itemsPerPage);

  const filterSelectClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none";

  return (
    <div className="flex-1 overflow-auto bg-slate-100 p-4 space-y-4 font-sans">
      {/* ─── Search Filters ────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Search className="h-4 w-4 text-blue-600" />
            <span>贸易方式校验规则查询</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">送货货站</label>
              <select
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                className={filterSelectClass}
              >
                <option value="">全部货站</option>
                {STATION_OPTIONS.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">服务类型</label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className={filterSelectClass}
              >
                <option value="">全部服务</option>
                {SERVICE_OPTIONS.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">状态</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={filterSelectClass}
              >
                <option value="">全部</option>
                <option value="1">启用</option>
                <option value="0">禁用</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Search className="h-3 w-3" />
              <span>查询</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>重置</span>
            </button>
          </div>
        </form>
      </div>

      {/* ─── Operations Bar ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded bg-[#004bb1] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#003b91] transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>新增规则</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          共 <strong className="text-slate-600">{totalItems}</strong> 条规则
        </div>
      </div>

      {/* ─── Data Table ────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wide">
                <th className="w-16 py-3 px-3 text-center text-xs">序号</th>
                <th className="w-44 py-3 px-3 text-xs">送货货站</th>
                <th className="w-44 py-3 px-3 text-xs">服务类型</th>
                <th className="w-36 py-3 px-3 text-xs text-center">是否必填贸易方式</th>
                <th className="w-24 py-3 px-3 text-xs text-center">状态</th>
                <th className="w-28 py-3 px-3 text-xs">更新人</th>
                <th className="w-36 py-3 px-3 text-xs">更新时间</th>
                <th className="w-32 py-3 px-3 text-xs text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11.5px] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 text-xs">
                    <div className="animate-pulse">加载规则数据中...</div>
                  </td>
                </tr>
              ) : paginatedRules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 text-xs">
                    暂无匹配的校验规则，请点击「新增规则」创建
                  </td>
                </tr>
              ) : (
                paginatedRules.map((rule, idx) => {
                  const rowNum = startIndex + idx + 1;
                  return (
                    <tr
                      key={rule.id}
                      className="transition-colors hover:bg-blue-50/20"
                    >
                      <td className="py-3 px-3 text-center font-mono text-slate-500">{rowNum}</td>
                      <td className="py-3 px-3 text-slate-600">
                        {stationNamesForRule(rule)}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {serviceNamesForRule(rule)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {rule.isRequired ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                            <Check className="h-3 w-3" />
                            必填
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                            <X className="h-3 w-3" />
                            非必填
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          rule.status
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {rule.status ? '启用' : '禁用'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {rule.updateUser || '-'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">
                        {rule.updateTime || rule.createTime || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(rule)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs"
                          >
                            <PenLine className="h-3 w-3" />
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(rule.id)}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium text-xs"
                          >
                            <Trash2 className="h-3 w-3" />
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between border-t border-slate-150 bg-slate-50 px-5 py-3">
            <span className="text-xs text-slate-500">
              共 <strong className="text-slate-800">{totalItems}</strong> 条记录
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                &lt; 上一页
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pNum = i + 1;
                return (
                  <button
                    key={pNum}
                    onClick={() => setCurrentPage(pNum)}
                    className={`h-7 w-7 rounded-lg text-xs font-semibold transition-all ${
                      pNum === currentPage
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                下一页 &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Info Panel ────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-blue-150 bg-blue-50/40 p-5 max-w-4xl">
        <div className="flex items-start gap-3">
          <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-800">贸易方式动态校验规则说明</h4>
            <p>
              本配置模块管理运单系统中「贸易方式」字段的可配置化校验逻辑。当客户在前台创建运单时，
              系统会根据所选 <strong>送货货站</strong> 和 <strong>服务类型</strong> 的组合，
              动态匹配规则并决定「贸易方式」字段是否必填。
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li><strong>匹配优先级：</strong>最新创建的启用规则优先匹配（ID 降序）。</li>
              <li><strong>防重校验：</strong>同一 [货站 + 服务] 组合只允许存在一条启用规则。</li>
              <li><strong>即时生效：</strong>规则保存后即刻在运单创建页面生效，无需刷新。</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Modal ─────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <RuleFormModal
          onClose={() => {
            setModalOpen(false);
            setEditingRule(null);
          }}
          onSave={handleSave}
          editRule={editingRule}
          addToast={addToast}
        />
      )}
    </div>
  );
}
