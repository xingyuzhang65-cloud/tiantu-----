import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, PenLine } from 'lucide-react';
import { TradeModeRule, STATION_OPTIONS, SERVICE_OPTIONS } from '../types';
import RuleFormModal from './RuleFormModal';

// ─── Mock data for static deployments (GitHub Pages) ──────────────────────
const MOCK_RULES: TradeModeRule[] = [
  {
    id: 1,
    stationCodes: ['tangxia'],
    serviceCodes: ['us_air_express', 'us_sea_truck'],
    isRequired: true,
    status: true,
    updateUser: '天朗（付豪）',
    createTime: '2026-06-10 09:15:30',
    updateTime: '2026-06-20 14:22:10',
  },
  {
    id: 2,
    stationCodes: ['tangxia'],
    serviceCodes: ['de_air', 'uk_sea'],
    isRequired: true,
    status: true,
    updateUser: '天朗（付豪）',
    createTime: '2026-06-12 10:30:00',
    updateTime: '2026-06-18 16:45:22',
  },
  {
    id: 3,
    stationCodes: ['guangzhou'],
    serviceCodes: ['us_air_express', 'us_sea_truck', 'de_air'],
    isRequired: true,
    status: true,
    updateUser: '张运营',
    createTime: '2026-06-11 14:20:15',
    updateTime: '2026-06-21 09:10:05',
  },
  {
    id: 4,
    stationCodes: ['guangzhou'],
    serviceCodes: ['uk_sea', 'japan_express'],
    isRequired: false,
    status: true,
    updateUser: '张运营',
    createTime: '2026-06-13 08:55:40',
    updateTime: '2026-06-13 08:55:40',
  },
  {
    id: 5,
    stationCodes: ['yiwu'],
    serviceCodes: ['yiwu_tiantu'],
    isRequired: true,
    status: true,
    updateUser: '李客服',
    createTime: '2026-06-14 11:05:00',
    updateTime: '2026-06-19 13:30:18',
  },
  {
    id: 6,
    stationCodes: ['yiwu'],
    serviceCodes: ['us_sea_truck', 'uk_sea'],
    isRequired: false,
    status: false,
    updateUser: '李客服',
    createTime: '2026-06-15 16:40:22',
    updateTime: '2026-06-22 10:20:33',
  },
  {
    id: 7,
    stationCodes: ['tangxia', 'guangzhou'],
    serviceCodes: ['us_air_express', 'us_sea_truck', 'de_air', 'uk_sea'],
    isRequired: true,
    status: true,
    updateUser: '天朗（付豪）',
    createTime: '2026-06-16 09:25:10',
    updateTime: '2026-06-23 08:15:45',
  },
  {
    id: 8,
    stationCodes: ['tangxia', 'guangzhou', 'yiwu'],
    serviceCodes: ['japan_express'],
    isRequired: false,
    status: true,
    updateUser: '张运营',
    createTime: '2026-06-17 13:10:30',
    updateTime: '2026-06-17 13:10:30',
  },
  {
    id: 9,
    stationCodes: ['guangzhou', 'yiwu'],
    serviceCodes: ['yiwu_tiantu', 'de_air'],
    isRequired: true,
    status: false,
    updateUser: '李客服',
    createTime: '2026-06-18 10:45:55',
    updateTime: '2026-06-20 17:00:12',
  },
];

interface RuleConfigPageProps {
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export default function RuleConfigPage({ addToast }: RuleConfigPageProps) {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [rules, setRules] = useState<TradeModeRule[]>([]);
  const [loading, setLoading] = useState(true);
  const apiAvailable = useRef(true);
  const mockIdCounter = useRef(10);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TradeModeRule | null>(null);

  // ─── API Helpers ────────────────────────────────────────────────────────────
  const fetchRules = useCallback(async () => {
    try {
      const res = await fetch('/api/trade-mode-rules');
      const json = await res.json();
      if (json.success) {
        setRules(json.data);
        apiAvailable.current = true;
      }
    } catch (err) {
      // API unavailable (e.g. GitHub Pages) — use built-in mock data
      console.warn('API /api/trade-mode-rules unreachable, using local mock data');
      setRules([...MOCK_RULES]);
      apiAvailable.current = false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

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
    const isEdit = !!draft.id;

    // Try API first; fall back to local state on failure
    if (apiAvailable.current) {
      try {
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
          return;
        } else {
          addToast(json.message || '保存失败', 'warning');
          return;
        }
      } catch {
        // API failed — toggle to offline mode and fall through to local save
        apiAvailable.current = false;
      }
    }

    // ─── Offline / mock save ───────────────────────────────────────────────
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    if (isEdit) {
      setRules(prev => prev.map(r =>
        r.id === draft.id
          ? {
              ...r,
              ...draft,
              updateTime: now,
            } as TradeModeRule
          : r
      ));
      addToast('规则已更新（离线模式）', 'success');
    } else {
      const newRule: TradeModeRule = {
        id: mockIdCounter.current++,
        stationCodes: draft.stationCodes,
        serviceCodes: draft.serviceCodes,
        isRequired: draft.isRequired,
        status: draft.status,
        updateUser: draft.updateUser || '当前用户',
        createTime: now,
        updateTime: now,
      };
      setRules(prev => [...prev, newRule]);
      addToast('规则创建成功（离线模式）', 'success');
    }
    setModalOpen(false);
    setEditingRule(null);
  };

  const handleDelete = async (id: number) => {
    const rule = rules.find(r => r.id === id);
    const stationNames = (rule?.stationCodes || []).map(getStationName).join('、');
    if (!confirm(`确认删除"${stationNames}"的规则吗？此操作无法撤销。`)) return;

    if (apiAvailable.current) {
      try {
        const res = await fetch(`/api/trade-mode-rules/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          addToast('规则已删除', 'success');
          fetchRules();
          return;
        }
      } catch {
        apiAvailable.current = false;
      }
    }

    // ─── Offline / mock delete ─────────────────────────────────────────────
    setRules(prev => prev.filter(r => r.id !== id));
    addToast('规则已删除（离线模式）', 'success');
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

  return (
    <div className="flex-1 overflow-auto bg-slate-100 p-4 space-y-4 font-sans">
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
                <th className="w-56 py-3 px-3 text-xs">送货货站</th>
                <th className="w-56 py-3 px-3 text-xs">服务类型</th>
                <th className="w-28 py-3 px-3 text-xs">更新人</th>
                <th className="w-40 py-3 px-3 text-xs">更新时间</th>
                <th className="w-32 py-3 px-3 text-xs text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11.5px] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 text-xs">
                    <div className="animate-pulse">加载规则数据中...</div>
                  </td>
                </tr>
              ) : paginatedRules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 text-xs">
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
