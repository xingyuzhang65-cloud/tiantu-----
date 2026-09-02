import React, { useMemo, useState } from 'react';
// Help-center document management UI.
import {
  Archive, ArrowDown, BookOpen, Check, ChevronDown, CircleHelp, Download,
  FileText, Filter, FolderOpen, History, MoreHorizontal, Pencil, Plus,
  Search, Settings2, Trash2, UploadCloud, X
} from 'lucide-react';

type Doc = {
  id: string;
  name: string;
  department: string;
  roles: string[];
  customerVisible: boolean;
  uploadTime: string;
  updateTime: string;
  operator: string;
  type: string;
  size: string;
  summary: string;
};

type Log = {
  id: number;
  time: string;
  operator: string;
  action: string;
  document: string;
  detail: string;
  result: '成功' | '失败';
};

interface HelpCenterPageProps {
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  onOpenReader?: () => void;
}

const departments = ['业务部', '操作部', '财务部', '客服部', '管理部', '系统配置部', '数据分析部'];
const roles = [
  { value: 'business_specialist', label: '业务专员' },
  { value: 'operation_clerk', label: '操作文员' },
  { value: 'finance_manager', label: '财务主管' },
  { value: 'admin', label: '系统管理员' },
];

const seedDocs: Doc[] = [
  { id: 'DOC_2026_001', name: '安速客户跟单操作手册', department: '业务部', roles: ['business_specialist', 'operation_clerk', 'finance_manager', 'admin'], customerVisible: true, uploadTime: '2026-05-20 10:20:00', updateTime: '2026-06-01 18:10:11', operator: '天帆', type: 'PDF', size: '12.8 MB', summary: '从客户下单、预报、轨迹追踪到最终签收的全链路跟单标准作业流程。' },
  { id: 'DOC_2026_002', name: '运单异常跟进规范', department: '业务部', roles: ['business_specialist'], customerVisible: false, uploadTime: '2026-05-10 09:30:00', updateTime: '2026-05-28 14:30:00', operator: '周航', type: 'PDF', size: '8.4 MB', summary: '面向业务专员说明异常运单的识别、分派、处理与复盘机制。' },
  { id: 'DOC_2026_003', name: '来款登记核销指南', department: '财务部', roles: ['finance_manager'], customerVisible: false, uploadTime: '2026-05-08 14:15:00', updateTime: '2026-05-25 09:15:00', operator: '李晓', type: 'Word', size: '3.1 MB', summary: '介绍财务角色进行来款登记、客户余额核销和异常账款处理的标准步骤。' },
  { id: 'DOC_2026_004', name: '角色权限配置说明', department: '系统配置部', roles: ['operation_clerk', 'admin'], customerVisible: false, uploadTime: '2026-05-18 16:45:00', updateTime: '2026-06-01 16:45:30', operator: '天帆', type: 'HTML', size: '1.2 MB', summary: '说明角色字典、权限分配、可见范围配置与帮助文档授权之间的关系。' },
  { id: 'DOC_2026_005', name: '经营报表查看指南', department: '数据分析部', roles: ['admin'], customerVisible: false, uploadTime: '2026-04-28 11:22:00', updateTime: '2026-05-20 11:22:00', operator: '王思雨', type: 'Excel', size: '5.7 MB', summary: '说明经营报表的数据口径、筛选方式和导出策略。' },
];

const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

export default function HelpCenterPage({ addToast, onOpenReader }: HelpCenterPageProps) {
  const [docs, setDocs] = useState<Doc[]>(seedDocs);
  const [selected, setSelected] = useState<string[]>([]);
  const [filters, setFilters] = useState({ name: '', department: '', role: '', operator: '', customerVisible: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [modal, setModal] = useState<{ open: boolean; doc?: Doc }>({ open: false });
  const [logs, setLogs] = useState<Log[]>([
    { id: 1, time: '2026-06-01 18:10:11', operator: '天帆', action: '编辑', document: '安速客户跟单操作手册', detail: '更新时间刷新', result: '成功' },
    { id: 2, time: '2026-05-28 14:30:00', operator: '周航', action: '新增', document: '运单异常跟进规范', detail: '创建文档', result: '成功' },
    { id: 3, time: '2026-05-22 11:08:32', operator: '天帆', action: '下载', document: '来款登记核销指南', detail: '下载原始文件', result: '成功' },
  ]);
  const [logTarget, setLogTarget] = useState<Doc | null>(undefined as unknown as Doc | null);
  const [batch, setBatch] = useState<{ open: boolean; type: 'department' | 'roles' | 'customer' } | null>(null);
  const [batchValue, setBatchValue] = useState('');
  const [batchRoles, setBatchRoles] = useState<string[]>([]);
  const [showColumns, setShowColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({ department: true, roles: true, upload: true, update: true, operator: true, customer: true });

  const filteredDocs = useMemo(() => docs.filter(doc => {
    if (filters.name && !doc.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.department && doc.department !== filters.department) return false;
    if (filters.role && !doc.roles.includes(filters.role)) return false;
    if (filters.operator && doc.operator !== filters.operator) return false;
    if (filters.customerVisible && String(doc.customerVisible) !== filters.customerVisible) return false;
    return true;
  }).sort((a, b) => b.updateTime.localeCompare(a.updateTime)), [docs, filters]);
  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / pageSize));
  const currentDocs = filteredDocs.slice((page - 1) * pageSize, page * pageSize);
  const allCurrentSelected = currentDocs.length > 0 && currentDocs.every(doc => selected.includes(doc.id));
  const roleLabel = (value: string) => roles.find(role => role.value === value)?.label || value;

  const addLog = (action: string, document: string, detail: string) => {
    setLogs(prev => [{ id: Date.now(), time: now(), operator: '天朗（付豪）', action, document, detail, result: '成功' }, ...prev]);
  };

  const openCreate = () => setModal({ open: true, doc: undefined });
  const openEdit = (doc: Doc) => setModal({ open: true, doc });
  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(allCurrentSelected ? selected.filter(id => !currentDocs.some(doc => doc.id === id)) : [...new Set([...selected, ...currentDocs.map(doc => doc.id)])]);

  const removeDocs = (ids: string[]) => {
    if (!ids.length) { addToast('请先勾选文件！', 'warning'); return; }
    const names = docs.filter(doc => ids.includes(doc.id)).map(doc => doc.name);
    const confirmation = ids.length === 1
      ? '确认删除该文件吗？删除后用户将无法继续在帮助中心查看该文档，请谨慎操作。'
      : `确认删除已选择的 ${ids.length} 个文件吗？删除后用户将无法继续查看相关文档，请谨慎操作。`;
    if (!window.confirm(confirmation)) return;
    setDocs(prev => prev.filter(doc => !ids.includes(doc.id)));
    setSelected([]);
    names.forEach(name => addLog(ids.length > 1 ? '批量删除' : '删除', name, '删除帮助文档'));
    addToast(`已删除 ${ids.length} 个帮助文档`, 'success');
  };

  const downloadDocs = (ids: string[]) => {
    if (!ids.length) { addToast('请先勾选文件！', 'warning'); return; }
    ids.forEach(id => {
      const doc = docs.find(item => item.id === id);
      if (!doc) return;
      const blob = new Blob([`安速帮助文档\n\n${doc.name}\n\n${doc.summary}`], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${doc.name}.txt`; anchor.click(); URL.revokeObjectURL(url);
      addLog('下载', doc.name, '下载原始文件');
    });
    addToast(`已开始下载 ${ids.length} 个文件`, 'success');
  };

  const saveDoc = (draft: Omit<Doc, 'id' | 'uploadTime' | 'updateTime' | 'operator'>, editing?: Doc) => {
    if (!draft.name.trim() || !draft.department || draft.roles.length === 0) { addToast('请完善必填项后再提交', 'warning'); return; }
    const duplicated = docs.some(doc => doc.name.trim() === draft.name.trim() && doc.id !== editing?.id);
    if (duplicated) { addToast('当前已存在相同文件名称，请修改后重新提交', 'warning'); return; }
    const timestamp = now();
    if (editing) {
      setDocs(prev => prev.map(doc => doc.id === editing.id ? { ...doc, ...draft, updateTime: timestamp, operator: '天朗（付豪）' } : doc));
      addLog('编辑', draft.name, '修改文档配置');
      addToast('文档配置已更新', 'success');
    } else {
      const newDoc: Doc = { ...draft, id: `DOC_${Date.now()}`, uploadTime: timestamp, updateTime: timestamp, operator: '天朗（付豪）' };
      setDocs(prev => [newDoc, ...prev]);
      addLog('新增', newDoc.name, '上传并创建帮助文档');
      addToast('文档上传成功', 'success');
    }
    setModal({ open: false });
  };

  const applyBatch = () => {
    if (!selected.length) { addToast('请先勾选文件！', 'warning'); return; }
    if (batch?.type === 'department' && !batchValue) return;
    if (batch?.type === 'roles' && !batchRoles.length) return;
    const timestamp = now();
    setDocs(prev => prev.map(doc => {
      if (!selected.includes(doc.id)) return doc;
      return {
        ...doc,
        ...(batch?.type === 'department' ? { department: batchValue } : {}),
        ...(batch?.type === 'roles' ? { roles: batchRoles } : {}),
        ...(batch?.type === 'customer' ? { customerVisible: batchValue === 'true' } : {}),
        updateTime: timestamp,
        operator: '天朗（付豪）',
      };
    }));
    addLog('批量修改', `${selected.length} 个文档`, batch?.type === 'department' ? `部门 → ${batchValue}` : batch?.type === 'roles' ? `可见权限 → ${batchRoles.map(roleLabel).join('、')}` : `客户可见 → ${batchValue === 'true' ? '是' : '否'}`);
    addToast(`已批量修改 ${selected.length} 个文档`, 'success');
    setSelected([]); setBatch(null); setBatchValue(''); setBatchRoles([]);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#f3f6fb] p-5 lg:p-6">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-slate-900"><BookOpen className="h-5 w-5 text-blue-600" /><h1 className="text-lg font-bold">配置中心 / 帮助中心</h1><span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">文档管理</span></div>
            <p className="mt-1 text-xs text-slate-500">统一维护操作手册，按部门和角色精准控制可见范围</p>
          </div>
          <button onClick={onOpenReader} className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"><CircleHelp className="h-4 w-4" />查看帮助中心</button>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-blue-600" /><h2 className="text-sm font-bold text-slate-800">帮助文档管理</h2><span className="text-xs text-slate-400">共 {filteredDocs.length} 条</span></div><div className="flex items-center gap-2 text-xs text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-500" />更新时间跟随上传成功刷新</div></div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr_1fr_1fr_auto]">
              <label className="text-xs text-slate-500">文件名称<input value={filters.name} onChange={e => { setFilters({ ...filters, name: e.target.value }); setPage(1); }} placeholder="请输入文件名称" className="mt-1.5 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none ring-blue-100 focus:border-blue-400 focus:ring-2" /></label>
              <label className="text-xs text-slate-500">部门<select value={filters.department} onChange={e => { setFilters({ ...filters, department: e.target.value }); setPage(1); }} className="mt-1.5 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"><option value="">请选择部门</option>{departments.map(item => <option key={item}>{item}</option>)}</select></label>
              <label className="text-xs text-slate-500">可见权限<select value={filters.role} onChange={e => { setFilters({ ...filters, role: e.target.value }); setPage(1); }} className="mt-1.5 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"><option value="">请选择可见角色</option>{roles.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
              <label className="text-xs text-slate-500">操作人<select value={filters.operator} onChange={e => { setFilters({ ...filters, operator: e.target.value }); setPage(1); }} className="mt-1.5 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"><option value="">请选择操作人</option>{['天帆', '周航', '李晓', '王思雨', '天朗（付豪）'].map(item => <option key={item}>{item}</option>)}</select></label>
              <label className="text-xs text-slate-500">客户是否可见<select value={filters.customerVisible} onChange={e => { setFilters({ ...filters, customerVisible: e.target.value }); setPage(1); }} className="mt-1.5 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"><option value="">请选择</option><option value="true">客户可见</option><option value="false">客户不可见</option></select></label>
              <div className="flex items-end gap-2"><button onClick={() => setPage(1)} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"><Search className="h-3.5 w-3.5" />搜索</button><button onClick={() => { setFilters({ name: '', department: '', role: '', operator: '', customerVisible: '' }); setPage(1); }} className="h-9 rounded-md border border-slate-200 bg-white px-4 text-xs font-medium text-slate-600 transition hover:bg-slate-100">重置</button></div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-2"><button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"><Plus className="h-3.5 w-3.5" />新增</button><button onClick={() => removeDocs(selected)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" />删除</button><button onClick={() => setLogTarget(null)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"><History className="h-3.5 w-3.5" />日志</button><button onClick={() => downloadDocs(selected)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"><Download className="h-3.5 w-3.5" />下载</button><div className="relative"><button onClick={() => setBatch(batch ? null : { open: true, type: 'department' })} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">批量操作<ChevronDown className="h-3.5 w-3.5" /></button>{batch === null && null}</div></div><div className="relative"><button onClick={() => setShowColumns(v => !v)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 hover:bg-slate-50"><Filter className="h-3.5 w-3.5" />列设置</button>{showColumns && <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">{Object.entries({ department: '部门', roles: '可见权限', upload: '上传时间', update: '更新时间', operator: '操作人', customer: '客户是否可见' }).map(([key, label]) => <label key={key} className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50"><input type="checkbox" checked={visibleColumns[key as keyof typeof visibleColumns]} onChange={e => setVisibleColumns({ ...visibleColumns, [key]: e.target.checked })} />{label}</label>)}</div>}</div></div>

            {selected.length > 0 && <div className="mt-3 flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-slate-600"><Check className="h-4 w-4 text-blue-600" />已选择 <strong className="text-blue-600">{selected.length}</strong> 个文档<button onClick={() => setSelected([])} className="ml-auto text-blue-600 hover:underline">清除选择</button></div>}
            {batch && <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-blue-200 bg-[#f5f9ff] px-3 py-2 text-xs text-slate-600"><span className="font-semibold text-blue-700">批量操作</span><span>已选择 {selected.length} 个文档</span><button onClick={() => setBatch({ open: true, type: 'department' })} className={`rounded px-2 py-1 ${batch.type === 'department' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>修改部门</button><button onClick={() => setBatch({ open: true, type: 'roles' })} className={`rounded px-2 py-1 ${batch.type === 'roles' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>修改权限</button><button onClick={() => setBatch({ open: true, type: 'customer' })} className={`rounded px-2 py-1 ${batch.type === 'customer' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}>修改客户可见</button><button onClick={applyBatch} className="ml-auto rounded bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700">确认修改</button><button onClick={() => setBatch(null)} className="p-1 text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button></div>}

            <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[980px] text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="w-10 px-3 py-3 text-center"><input type="checkbox" checked={allCurrentSelected} onChange={toggleAll} /></th><th className="px-3 py-3">文件名称</th>{visibleColumns.department && <th className="px-3 py-3">部门</th>}{visibleColumns.roles && <th className="px-3 py-3">可见权限</th>}{visibleColumns.upload && <th className="px-3 py-3">上传时间</th>}{visibleColumns.update && <th className="px-3 py-3">更新时间</th>}{visibleColumns.operator && <th className="px-3 py-3">操作人</th>}{visibleColumns.customer && <th className="px-3 py-3">客户是否可见</th>}<th className="px-3 py-3">操作</th></tr></thead><tbody className="divide-y divide-slate-100">{currentDocs.map(doc => <tr key={doc.id} className={selected.includes(doc.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}><td className="px-3 py-3 text-center"><input type="checkbox" checked={selected.includes(doc.id)} onChange={() => toggleSelect(doc.id)} /></td><td className="max-w-[260px] px-3 py-3"><div className="flex items-center gap-2"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600"><FileText className="h-3.5 w-3.5" /></div><div className="min-w-0"><div className="truncate font-semibold text-slate-700" title={doc.name}>{doc.name}</div><div className="mt-0.5 text-[10px] text-slate-400">{doc.type} · {doc.size}</div></div></div></td>{visibleColumns.department && <td className="px-3 py-3 text-slate-600">{doc.department}</td>}{visibleColumns.roles && <td className="px-3 py-3"><div className="flex max-w-[220px] flex-wrap gap-1">{doc.roles.map(role => <span key={role} className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">{roleLabel(role)}</span>)}</div></td>}{visibleColumns.upload && <td className="whitespace-nowrap px-3 py-3 text-slate-500">{doc.uploadTime}</td>}{visibleColumns.update && <td className="whitespace-nowrap px-3 py-3 text-slate-500">{doc.updateTime}</td>}{visibleColumns.operator && <td className="px-3 py-3 text-slate-600">{doc.operator}</td>}{visibleColumns.customer && <td className="px-3 py-3">{doc.customerVisible ? <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700">客户可见</span> : <span className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-500">不可见</span>}</td>}<td className="px-3 py-3"><div className="flex items-center gap-1"><button onClick={() => openEdit(doc)} className="rounded px-2 py-1 text-blue-600 hover:bg-blue-50"><Pencil className="mr-1 inline h-3 w-3" />编辑</button><button onClick={() => setLogTarget(doc)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100"><History className="mr-1 inline h-3 w-3" />日志</button><button onClick={() => removeDocs([doc.id])} className="rounded px-2 py-1 text-red-500 hover:bg-red-50"><Trash2 className="mr-1 inline h-3 w-3" />删除</button></div></td></tr>)}{currentDocs.length === 0 && <tr><td colSpan={10} className="py-16 text-center text-slate-400"><Archive className="mx-auto mb-2 h-8 w-8 text-slate-300" />暂无符合条件的帮助文档</td></tr>}</tbody></table></div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500"><span>共 {filteredDocs.length} 条数据</span><div className="flex items-center gap-2"><span>每页</span><select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="h-7 rounded border border-slate-200 bg-white px-1.5"><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option></select><span>条</span><button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded border border-slate-200 bg-white px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40">上一页</button><span className="rounded bg-blue-600 px-2.5 py-1 text-white">{page}</span><span>/ {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded border border-slate-200 bg-white px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40">下一页</button></div></div>
          </div>
        </section>
      </div>

      {batch && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30 p-4" onClick={() => setBatch(null)}><div className="w-full max-w-md rounded-xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h3 className="font-bold text-slate-800">{batch.type === 'department' ? '批量修改部门' : batch.type === 'roles' ? '批量修改可见权限' : '批量修改客户是否可见'}</h3><button onClick={() => setBatch(null)}><X className="h-4 w-4 text-slate-400" /></button></div><div className="space-y-4 p-5"><div className="rounded-md bg-blue-50 px-3 py-2 text-xs text-slate-600">已选择 <strong className="text-blue-600">{selected.length}</strong> 个文档</div>{batch.type === 'department' && <label className="block text-xs text-slate-500">目标部门<select value={batchValue} onChange={e => setBatchValue(e.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="">请选择部门</option>{departments.map(item => <option key={item}>{item}</option>)}</select></label>}{batch.type === 'roles' && <div><span className="text-xs text-slate-500">可见权限</span><div className="mt-2 grid grid-cols-2 gap-2">{roles.map(role => <label key={role.value} className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-xs"><input type="checkbox" checked={batchRoles.includes(role.value)} onChange={e => setBatchRoles(e.target.checked ? [...batchRoles, role.value] : batchRoles.filter(x => x !== role.value))} />{role.label}</label>)}</div><button onClick={() => setBatchRoles(batchRoles.length === roles.length ? [] : roles.map(role => role.value))} className="mt-2 text-xs text-blue-600 hover:underline">{batchRoles.length === roles.length ? '取消全选' : '全选角色'}</button></div>}{batch.type === 'customer' && <div><span className="text-xs text-slate-500">客户是否可见</span><div className="mt-2 flex gap-5 text-sm"><label className="flex items-center gap-2"><input type="radio" name="batch-customer" checked={batchValue === 'true'} onChange={() => setBatchValue('true')} />客户可见</label><label className="flex items-center gap-2"><input type="radio" name="batch-customer" checked={batchValue === 'false'} onChange={() => setBatchValue('false')} />客户不可见</label></div></div>}</div><div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4"><button onClick={() => setBatch(null)} className="rounded-md border border-slate-200 px-4 py-2 text-xs text-slate-600">取消</button><button onClick={applyBatch} className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white">确认修改</button></div></div></div>}

      {modal.open && <DocumentModal doc={modal.doc} onClose={() => setModal({ open: false })} onSave={saveDoc} />}
      {(logTarget || logTarget === null) && <LogModal logs={logTarget ? logs.filter(log => log.document === logTarget.name) : logs} title={logTarget ? `${logTarget.name} · 操作日志` : '帮助中心 · 全局操作日志'} onClose={() => setLogTarget(undefined as unknown as null)} />}
    </div>
  );
}

function DocumentModal({ doc, onClose, onSave }: { doc?: Doc; onClose: () => void; onSave: (draft: Omit<Doc, 'id' | 'uploadTime' | 'updateTime' | 'operator'>, editing?: Doc) => void }) {
  const [name, setName] = useState(doc?.name || '');
  const [department, setDepartment] = useState(doc?.department || '');
  const [selectedRoles, setSelectedRoles] = useState(doc?.roles || []);
  const [customerVisible, setCustomerVisible] = useState(doc?.customerVisible ?? true);
  const [fileName, setFileName] = useState(doc ? `${doc.name}.${doc.type.toLowerCase()}` : '');
  const isAll = selectedRoles.length === roles.length;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-6 py-4"><div><h3 className="text-lg font-bold text-slate-800">{doc ? '编辑文件' : '新增文件'}</h3><p className="mt-0.5 text-xs text-slate-400">文档权限会实时同步到管理端与客户端帮助中心</p></div><button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button></div><div className="space-y-5 px-6 py-6"><label className="block"><span className="text-xs font-semibold text-slate-700"><i className="mr-1 text-red-500">*</i>文件名称</span><input value={name} maxLength={200} onChange={e => setName(e.target.value)} placeholder="请输入文件名称" className="mt-1.5 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /><span className="mt-1 block text-right text-[10px] text-slate-400">{name.length}/200</span></label><label className="block"><span className="text-xs font-semibold text-slate-700"><i className="mr-1 text-red-500">*</i>所属部门</span><select value={department} onChange={e => setDepartment(e.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="">请选择部门</option>{departments.map(item => <option key={item}>{item}</option>)}</select></label><div><span className="text-xs font-semibold text-slate-700"><i className="mr-1 text-red-500">*</i>可见权限</span><div className="mt-2 flex flex-wrap gap-2">{roles.map(role => <label key={role.value} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs ${selectedRoles.includes(role.value) ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}><input type="checkbox" checked={selectedRoles.includes(role.value)} onChange={e => setSelectedRoles(e.target.checked ? [...selectedRoles, role.value] : selectedRoles.filter(value => value !== role.value))} />{role.label}</label>)}</div><button onClick={() => setSelectedRoles(isAll ? [] : roles.map(role => role.value))} className="mt-2 text-xs text-blue-600 hover:underline">{isAll ? '取消全选' : '全选角色'}</button></div><div><span className="text-xs font-semibold text-slate-700"><i className="mr-1 text-red-500">*</i>客户是否可见</span><div className="mt-2 flex gap-5 text-sm"><label className="flex items-center gap-2"><input type="radio" name="customer" checked={!customerVisible} onChange={() => setCustomerVisible(false)} />不可见</label><label className="flex items-center gap-2"><input type="radio" name="customer" checked={customerVisible} onChange={() => setCustomerVisible(true)} />可见</label></div></div><div><span className="text-xs font-semibold text-slate-700"><i className="mr-1 text-red-500">*</i>上传文件</span><label className="mt-1.5 flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-blue-300 bg-blue-50/40 text-center"><UploadCloud className="h-9 w-9 text-blue-500" /><span className="mt-2 text-sm font-semibold text-slate-700">拖拽文件到此处，或 <span className="text-blue-600">点击上传</span></span><span className="mt-1 text-xs text-slate-400">支持 PDF、Word、Excel、PPT、HTML，单个文件不超过 100MB</span><input type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.html" onChange={e => setFileName(e.target.files?.[0]?.name || '')} />{fileName && <span className="mt-2 rounded bg-white px-2 py-1 text-xs text-blue-700 shadow-sm">{fileName}</span>}</label></div></div><div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4"><button onClick={onClose} className="rounded-md border border-slate-200 px-5 py-2 text-xs text-slate-600">取消</button><button onClick={() => onSave({ name, department, roles: selectedRoles, customerVisible, type: fileName ? (fileName.split('.').pop()?.toUpperCase() || 'PDF') : doc?.type || 'PDF', size: doc?.size || '待上传', summary: doc?.summary || '安速系统操作手册，帮助用户快速完成业务操作。' }, doc)} className="rounded-md bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700">确定</button></div></div></div>;
}

function LogModal({ logs, title, onClose }: { logs: Log[]; title: string; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"><div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div className="flex items-center gap-2"><History className="h-4 w-4 text-blue-600" /><h3 className="font-bold text-slate-800">{title}</h3></div><button onClick={onClose}><X className="h-4 w-4 text-slate-400" /></button></div><div className="max-h-[60vh] overflow-auto p-5"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-3 py-2">操作时间</th><th className="px-3 py-2">操作账号</th><th className="px-3 py-2">操作类型</th><th className="px-3 py-2">文件名称</th><th className="px-3 py-2">修改前 → 修改后</th><th className="px-3 py-2">结果</th></tr></thead><tbody className="divide-y divide-slate-100">{logs.map(log => <tr key={log.id}><td className="whitespace-nowrap px-3 py-3 text-slate-500">{log.time}</td><td className="px-3 py-3 text-slate-700">{log.operator}</td><td className="px-3 py-3"><span className="rounded bg-blue-50 px-2 py-1 text-blue-700">{log.action}</span></td><td className="px-3 py-3 text-slate-700">{log.document}</td><td className="px-3 py-3 text-slate-500">{log.detail}</td><td className="px-3 py-3 text-emerald-600">{log.result}</td></tr>)}{logs.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-slate-400">暂无操作记录</td></tr>}</tbody></table></div><div className="flex justify-end border-t border-slate-100 px-5 py-4"><button onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-xs text-slate-600">关闭</button></div></div></div>;
}
