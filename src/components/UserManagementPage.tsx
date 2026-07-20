import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, CirclePlus, Filter, FolderTree, RotateCcw, Search, Settings, Trash2, Users } from 'lucide-react';

interface Props { addToast: (text: string, type?: 'success' | 'info' | 'warning') => void; }
interface UserRecord { id: number; type: '内部用户' | '外部用户'; department: string; account: string; name: string; warehouses: string; defaultWarehouse: string; createdAt: string; creator: string; updatedAt: string; updater: string; enabled: boolean; role: string; enterpriseWechat?: string; }
interface NewUserDraft { type: '' | UserRecord['type']; name: string; account: string; company: string; department: string; warehouse: string; defaultWarehouse: string; enabled: boolean; passwordExpires: boolean; enterpriseWechat: string; }

const emptyDraft: NewUserDraft = { type: '', name: '', account: '', company: '', department: '', warehouse: '', defaultWarehouse: '', enabled: false, passwordExpires: true, enterpriseWechat: '' };

const makeUser = (id: number, type: UserRecord['type'], department: string, account: string, name: string, enabled = true, role = '客户'): UserRecord => ({
  id, type, department, account, name,
  warehouses: type === '内部用户' ? '保定仓, 沧州仓, 潍坊仓' : '',
  defaultWarehouse: type === '内部用户' ? '塘厦仓' : '',
  createdAt: `2026-07-${id < 5 ? '20' : id < 11 ? '18' : '17'} ${String(16 - id % 8).padStart(2, '0')}:${String(15 + id * 3).slice(-2)}:24`,
  creator: type === '内部用户' ? '天杰' : id < 5 ? '天枚（潘书琴）' : '天旺',
  updatedAt: `2026-07-${id < 5 ? '20' : id < 11 ? '18' : '17'} ${String(17 - id % 7).padStart(2, '0')}:${String(20 + id * 2).slice(-2)}:40`,
  updater: id % 4 === 0 ? '系统' : type === '内部用户' ? '天杰' : '天枚（潘书琴）', enabled, role,
});

const seed: UserRecord[] = [
  makeUser(1, '外部用户', '', '俄易通-海外仓', '俄易通-海外仓', true, '海外仓客户'),
  makeUser(2, '内部用户', '中山销售二十一部', '天意', '陈丰蔚', true, '业务专员'),
  makeUser(3, '外部用户', '', '厦门博远-海外仓', '厦门博远-海外仓', true, '海外仓客户'),
  makeUser(4, '外部用户', '', '鹏昇-海外仓', '鹏昇-海外仓', true, '海外仓客户'),
  makeUser(5, '外部用户', '', '华颂宇', '华颂宇'),
  makeUser(6, '外部用户', '', '杭州翼鹏', '杭州翼鹏'),
  makeUser(7, '外部用户', '', '四咪', '四咪', false),
  makeUser(8, '内部用户', '广州销售七部', '颜振安', '颜振安（天定）', true, '业务专员'),
  makeUser(9, '内部用户', '广州销售七部', '天皓', '刘小君（天皓）', true, '销售主管'),
  makeUser(10, '内部用户', '广州销售七部', '天忠', '天忠（郑培祖）', true, '业务专员'),
  makeUser(11, '外部用户', '', '广州中维国际', '广州中维国际', false),
  makeUser(12, '内部用户', '总部销售十三部', '天睿', '天睿（陈小昌）', true, '销售主管'),
  makeUser(13, '内部用户', '汕头销售十四部', '天控', '天控（朱亚晨）', true, '业务专员'),
];

const departments = ['中山销售十部','报关行','中山销售二十一部','厦门销售九部','上海销售十一部','青岛销售十一部','福州销售十九部','汕头销售十四部','广州销售七部','广州销售十二部','义乌销售八部','总部销售十八部','总部销售一部','宁波销售四部','总部销售二部','总部销售六部','总部销售八部','总部销售十三部'];
const inputClass = 'h-8 min-w-0 flex-1 rounded border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 placeholder:text-slate-300';
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className='flex min-w-0 items-center gap-2'><span className='w-[58px] shrink-0 text-right text-xs font-medium'>{label}</span>{children}</label>; }
const modalInputClass = 'h-7 w-full rounded border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100';
function ModalField({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <label className='flex items-center gap-2'><span className='w-[78px] shrink-0 text-right text-xs text-slate-600'>{required && <span className='mr-1 text-red-500'>*</span>}{label}：</span><div className='min-w-0 flex-1'>{children}</div></label>; }

export default function UserManagementPage({ addToast }: Props) {
  const [users, setUsers] = useState(seed); const [checked, setChecked] = useState<number[]>([]);
  const [department, setDepartment] = useState(''); const [account, setAccount] = useState(''); const [name, setName] = useState('');
  const [status, setStatus] = useState(''); const [type, setType] = useState(''); const [role, setRole] = useState('');
  const [treeKeyword, setTreeKeyword] = useState(''); const [filtersOpen, setFiltersOpen] = useState(true); const [batchOpen, setBatchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false); const [draft, setDraft] = useState<NewUserDraft>(emptyDraft);
  const [filters, setFilters] = useState({ department: '', account: '', name: '', status: '', type: '', role: '' });
  const rows = useMemo(() => users.filter((u) => (!filters.department || u.department === filters.department) && (!filters.account || u.account.toLowerCase().includes(filters.account.toLowerCase())) && (!filters.name || u.name.toLowerCase().includes(filters.name.toLowerCase())) && (!filters.status || (filters.status === '启用' ? u.enabled : !u.enabled)) && (!filters.type || u.type === filters.type) && (!filters.role || u.role === filters.role)), [users, filters]);
  const search = () => { setFilters({ department, account, name, status, type, role }); addToast('用户筛选条件已应用', 'success'); };
  const reset = () => { setDepartment(''); setAccount(''); setName(''); setStatus(''); setType(''); setRole(''); setFilters({ department: '', account: '', name: '', status: '', type: '', role: '' }); addToast('筛选条件已重置', 'info'); };
  const remove = (ids: number[]) => { if (!ids.length) return addToast('请先选择需要批量处理的用户', 'warning'); setUsers((list) => list.filter((u) => !ids.includes(u.id))); setChecked([]); setBatchOpen(false); addToast(`已删除 ${ids.length} 个用户`, 'success'); };
  const toggle = (user: UserRecord) => { setUsers((list) => list.map((u) => u.id === user.id ? { ...u, enabled: !u.enabled } : u)); addToast(`${user.name}已${user.enabled ? '停用' : '启用'}`, user.enabled ? 'warning' : 'success'); };
  const updateDraft = <K extends keyof NewUserDraft>(key: K, value: NewUserDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const closeCreate = () => { setCreateOpen(false); setDraft(emptyDraft); };
  const saveUser = () => {
    if (!draft.type || !draft.name.trim() || !draft.account.trim() || !draft.company) { addToast('请完整填写用户类型、用户姓名、登录账号和所属公司', 'warning'); return; }
    if (users.some((user) => user.account === draft.account.trim())) { addToast('登录账号已存在，请更换账号', 'warning'); return; }
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;
    setUsers((list) => [{ id: nextId, type: draft.type as UserRecord['type'], department: draft.department, account: draft.account.trim(), name: draft.name.trim(), warehouses: draft.warehouse, defaultWarehouse: draft.defaultWarehouse, createdAt: now, creator: '天朗（付豪）', updatedAt: now, updater: '天朗（付豪）', enabled: draft.enabled, role: draft.type === '内部用户' ? '业务专员' : '客户', enterpriseWechat: draft.enterpriseWechat.trim() }, ...list]);
    addToast(`用户 ${draft.name.trim()} 创建成功，默认密码为 123456`, 'success'); closeCreate();
  };
  const allChecked = rows.length > 0 && rows.every((u) => checked.includes(u.id));
  return <>
    <div className='relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f4f7fb] text-slate-700'>
      {filtersOpen ? <section className='border-b border-slate-200 bg-white px-4 py-3 shadow-sm'>
        <div className='grid grid-cols-4 gap-4'>
          <Field label='登录账号'><input value={account} onChange={(e) => setAccount(e.target.value)} placeholder='登录账号' className={inputClass}/></Field>
          <Field label='用户名称'><input value={name} onChange={(e) => setName(e.target.value)} placeholder='用户名称' className={inputClass}/></Field>
          <Field label='用户状态'><select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}><option value=''>用户状态</option><option>启用</option><option>停用</option></select></Field>
          <Field label='用户类型'><select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}><option value=''>用户类型</option><option>内部用户</option><option>外部用户</option></select></Field>
          <Field label='用户角色'><select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}><option value=''>用户角色</option><option>业务专员</option><option>销售主管</option><option>客户</option><option>海外仓客户</option></select></Field>
        <div className='col-span-3 flex justify-center gap-3'>
          <button onClick={search} className='flex h-8 min-w-[118px] items-center justify-center gap-1.5 rounded bg-[#0757b5] px-5 text-xs font-medium text-white hover:bg-blue-700'><Search className='h-3.5 w-3.5'/>查询</button>
          <button onClick={reset} className='flex h-8 min-w-[118px] items-center justify-center gap-1.5 rounded border border-slate-200 bg-white px-5 text-xs hover:bg-slate-50'><RotateCcw className='h-3.5 w-3.5'/>重置</button>
          <button onClick={() => setFiltersOpen(false)} className='flex h-8 min-w-[118px] items-center justify-center gap-1.5 rounded border border-slate-200 bg-white px-5 text-xs hover:bg-slate-50'><ChevronDown className='h-3.5 w-3.5 rotate-180'/>收起</button>
        </div></div>
      </section> : <button onClick={() => setFiltersOpen(true)} className='absolute right-5 top-3 z-20 flex items-center gap-1 rounded border bg-white px-3 py-1.5 text-xs shadow-sm'><Filter className='h-3.5 w-3.5'/>展开筛选</button>}
      <div className='flex min-h-0 flex-1 gap-3 p-3'>
        <aside className='flex w-[205px] shrink-0 flex-col overflow-hidden rounded border border-slate-200 bg-white shadow-sm'>
          <div className='border-b p-2.5'><div className='relative'><Search className='absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-300'/><input value={treeKeyword} onChange={(e) => setTreeKeyword(e.target.value)} placeholder='输入关键字进行过滤' className='h-8 w-full rounded border border-slate-200 pl-8 pr-2 text-xs outline-none focus:border-blue-500'/></div></div>
          <div className='flex-1 overflow-y-auto px-2 py-2 text-xs'>
            <button onClick={() => { setDepartment(''); setFilters((f) => ({ ...f, department: '' })); }} className={`flex w-full items-center gap-1.5 rounded px-2 py-1.5 ${!department ? 'bg-blue-50 font-semibold text-blue-600' : ''}`}><ChevronDown className='h-3 w-3'/><FolderTree className='h-3.5 w-3.5 text-blue-500'/>天图通逊</button>
            <div className='ml-3 border-l pl-2'>
              {departments.filter((item) => item.includes(treeKeyword.trim())).map((item) => <button key={item} onClick={() => { setDepartment(item); setFilters((f) => ({ ...f, department: item })); }} className={`flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left ${department === item ? 'bg-blue-50 font-medium text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}><span className='text-slate-300'>└</span><span className='truncate'>{item}</span></button>)}
              <button className='flex w-full items-center gap-1 px-2 py-1.5 font-medium'><ChevronDown className='h-3 w-3'/>产品部</button>
              {['业务部','深圳总部','福永分部','财务部','跟单部'].map((item) => <button key={item} className='ml-4 flex items-center gap-1 px-2 py-1 text-slate-500'><ChevronRight className='h-3 w-3'/>{item}</button>)}
            </div>
          </div>
        </aside>
        <section className='flex min-w-0 flex-1 flex-col overflow-hidden rounded border border-slate-200 bg-white shadow-sm'>
          <div className='flex h-12 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-3'>
            <div className='flex items-center gap-2'>
              <div className='mr-1 flex items-center gap-2 border-r border-slate-200 pr-3'>
                <span className='text-xs font-semibold text-slate-800'>用户列表</span>
                <span className='rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500'>{rows.length} 条结果</span>
              </div>
              <button onClick={() => setCreateOpen(true)} className='flex h-8 items-center gap-1.5 rounded bg-[#0757b5] px-3 text-xs font-medium text-white transition hover:bg-blue-700'><CirclePlus className='h-3.5 w-3.5'/>新建</button>
              <div className='relative'><button onClick={() => setBatchOpen(!batchOpen)} className='flex h-8 items-center gap-1 rounded bg-[#0757b5] px-3 text-xs font-medium text-white'>批量操作<ChevronDown className='h-3.5 w-3.5'/></button>{batchOpen && <div className='absolute left-0 top-9 z-30 w-32 rounded border bg-white py-1 shadow-lg'><button onClick={() => remove(checked)} className='flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50'><Trash2 className='h-3.5 w-3.5'/>批量删除</button></div>}</div>
              {checked.length > 0 && <span className='text-[11px] text-slate-400'>已选择 {checked.length} 项</span>}
            </div>
            <button title='设置显示列' onClick={() => addToast('已打开表格列配置', 'info')} className='flex h-8 w-9 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'><Settings className='h-4 w-4'/></button>
          </div>
          <div className='min-h-0 flex-1 overflow-auto bg-white'><table className='w-full min-w-[1540px] table-fixed border-collapse text-[11px]'>
            <colgroup><col className='w-10'/><col className='w-[86px]'/><col className='w-[132px]'/><col className='w-[130px]'/><col className='w-[145px]'/><col className='w-[170px]'/><col className='w-[88px]'/><col className='w-[138px]'/><col className='w-[112px]'/><col className='w-[138px]'/><col className='w-[112px]'/><col className='w-[70px]'/><col className='w-[300px]'/></colgroup>
            <thead className='sticky top-0 z-10 bg-[#f6f8fb] text-slate-600 shadow-[0_1px_0_#e2e8f0]'><tr><th className='border-b border-r border-slate-200 px-2 py-2.5 text-center'><input className='h-3.5 w-3.5 accent-[#0757b5]' type='checkbox' checked={allChecked} onChange={() => setChecked(allChecked ? [] : rows.map((u) => u.id))}/></th>{['用户类型','所属部门','登录账号','用户姓名','货站','默认货站','创建时间','创建人','更新时间','更新人','状态','操作'].map((heading) => <th key={heading} className={`whitespace-nowrap border-b border-r border-slate-200 px-3 py-2.5 text-left font-semibold ${heading === '操作' ? 'sticky right-0 bg-[#f6f8fb] text-center shadow-[-4px_0_8px_rgba(15,23,42,0.04)]' : ''}`}>{heading}</th>)}</tr></thead>
            <tbody>{rows.map((user, index) => {
              const isChecked = checked.includes(user.id);
              return <tr key={user.id} className={`group transition-colors ${isChecked ? 'bg-blue-50/80' : index % 2 ? 'bg-slate-50/30' : 'bg-white'} hover:bg-[#f3f8ff]`}>
                <td className='border-b border-r border-slate-100 px-2 py-2.5 text-center'><input className='h-3.5 w-3.5 accent-[#0757b5]' type='checkbox' checked={isChecked} onChange={() => setChecked((ids) => ids.includes(user.id) ? ids.filter((id) => id !== user.id) : [...ids, user.id])}/></td>
                <td className='border-b border-r border-slate-100 px-3 py-2.5'><span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${user.type === '内部用户' ? 'bg-violet-50 text-violet-600' : 'bg-sky-50 text-sky-600'}`}>{user.type}</span></td>
                <td className='truncate border-b border-r border-slate-100 px-3 py-2.5 text-slate-600' title={user.department}>{user.department || <span className='text-slate-300'>—</span>}</td>
                <td className='truncate border-b border-r border-slate-100 px-3 py-2.5 font-medium text-slate-800' title={user.account}>{user.account}</td>
                <td className='border-b border-r border-slate-100 px-3 py-2'>
                  <div className='flex min-w-0 items-center gap-2'><span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-[10px] font-semibold text-blue-600'>{user.name.slice(0, 1)}</span><span className='truncate font-medium text-slate-700' title={user.name}>{user.name}</span></div>
                </td>
                <td className='truncate border-b border-r border-slate-100 px-3 py-2.5 text-slate-500' title={user.warehouses}>{user.warehouses || <span className='text-slate-300'>—</span>}</td>
                <td className='truncate border-b border-r border-slate-100 px-3 py-2.5'>{user.defaultWarehouse || <span className='text-slate-300'>—</span>}</td>
                <td className='whitespace-nowrap border-b border-r border-slate-100 px-3 py-2.5 font-mono text-[10px] text-slate-500'>{user.createdAt}</td>
                <td className='truncate border-b border-r border-slate-100 px-3 py-2.5' title={user.creator}>{user.creator}</td>
                <td className='whitespace-nowrap border-b border-r border-slate-100 px-3 py-2.5 font-mono text-[10px] text-slate-500'>{user.updatedAt}</td>
                <td className='truncate border-b border-r border-slate-100 px-3 py-2.5' title={user.updater}>{user.updater}</td>
                <td className='border-b border-r border-slate-100 px-2 py-2.5 text-center'><span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${user.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}><span className={`h-1.5 w-1.5 rounded-full ${user.enabled ? 'bg-emerald-500' : 'bg-red-400'}`}/>{user.enabled ? '启用' : '停用'}</span></td>
                <td className={`sticky right-0 whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-center shadow-[-4px_0_8px_rgba(15,23,42,0.04)] ${isChecked ? 'bg-blue-50' : index % 2 ? 'bg-[#fcfcfd]' : 'bg-white'} group-hover:bg-[#f3f8ff]`}>
                  <button onClick={() => addToast(`正在编辑 ${user.name}`, 'info')} className='mr-2 font-medium text-blue-600 hover:underline'>编辑</button><button onClick={() => toggle(user)} className='mr-2 text-blue-500 hover:underline'>{user.enabled ? '停用' : '启用'}</button><button onClick={() => remove([user.id])} className='mr-2 text-red-500 hover:underline'>删除</button><button onClick={() => addToast(`${user.name} 的密码已重置`, 'success')} className='mr-2 text-blue-500 hover:underline'>重置密码</button><button onClick={() => addToast(`正在配置 ${user.name} 的角色`, 'info')} className='mr-2 text-blue-500 hover:underline'>编辑角色</button><button onClick={() => addToast(`正在关联 ${user.name} 的客户`, 'info')} className='text-blue-500 hover:underline'>关联客户</button>
                </td>
              </tr>;
            })}
            {!rows.length && <tr><td colSpan={13} className='py-20 text-center text-xs text-slate-400'><Users className='mx-auto mb-2 h-8 w-8'/>暂无符合条件的用户</td></tr>}</tbody>
          </table></div>
          <footer className='flex h-11 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-4 text-xs text-slate-500'>
            <div className='flex items-center gap-2'><span>当前显示</span><span className='font-medium text-slate-700'>1–{rows.length}</span><span>，共 4625 条</span>{checked.length > 0 && <span className='ml-2 rounded bg-blue-50 px-2 py-0.5 text-blue-600'>已选择 {checked.length} 项</span>}</div>
            <div className='flex items-center gap-2'><select className='h-7 rounded border border-slate-200 bg-white px-2 outline-none hover:border-blue-300'><option>100条/页</option><option>50条/页</option></select>
            <button className='flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-300' disabled><ChevronLeft className='h-3.5 w-3.5'/></button>{[1,2,3,4,5,6].map((page) => <button key={page} className={`h-7 min-w-7 rounded border px-2 transition ${page === 1 ? 'border-blue-500 bg-blue-50 font-semibold text-blue-600' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'}`}>{page}</button>)}<span>...</span><button className='h-7 min-w-7 rounded px-2 hover:bg-slate-50'>65</button><button className='flex h-7 w-7 items-center justify-center rounded border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'><ChevronRight className='h-3.5 w-3.5'/></button>
            <span>前往</span><input defaultValue='1' className='h-7 w-10 rounded border border-slate-200 text-center outline-none focus:border-blue-500'/><span>页</span></div>
          </footer>
        </section>
      </div>
      {createOpen && <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55' onMouseDown={(event) => { if (event.target === event.currentTarget) closeCreate(); }}>
        <div className='w-[660px] overflow-hidden rounded-sm bg-white shadow-2xl' onMouseDown={(event) => event.stopPropagation()}>
          <div className='flex h-11 items-center border-b border-slate-200 px-4'><h3 className='text-sm font-semibold text-slate-800'>新增用户</h3></div>
          <div className='px-7 pb-4 pt-5'>
            <div className='grid grid-cols-2 gap-x-8 gap-y-3'>
              <ModalField label='用户类型' required><select value={draft.type} onChange={(event) => updateDraft('type', event.target.value as NewUserDraft['type'])} className={modalInputClass}><option value=''>请选择</option><option>内部用户</option><option>外部用户</option></select></ModalField>
              <ModalField label='所属公司' required><select value={draft.company} onChange={(event) => updateDraft('company', event.target.value)} className={modalInputClass}><option value=''>请选择</option><option>深圳天图通逊物流有限公司</option><option>广州天图供应链有限公司</option><option>天图海外仓事业部</option></select></ModalField>
              <ModalField label='用户姓名' required><input value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} placeholder='请输入' className={modalInputClass}/></ModalField>
              <ModalField label='所属部门'><select value={draft.department} onChange={(event) => updateDraft('department', event.target.value)} className={modalInputClass}><option value=''>请选择</option>{departments.map((item) => <option key={item}>{item}</option>)}</select></ModalField>
              <ModalField label='登录账号' required><input value={draft.account} onChange={(event) => updateDraft('account', event.target.value)} placeholder='请输入' className={modalInputClass}/></ModalField>
              <ModalField label='货站'><select value={draft.warehouse} onChange={(event) => updateDraft('warehouse', event.target.value)} className={modalInputClass}><option value=''>请选择</option><option>塘厦仓</option><option>广州仓</option><option>义乌仓</option><option>保定仓</option></select></ModalField>
              <ModalField label='默认货站'><select value={draft.defaultWarehouse} onChange={(event) => updateDraft('defaultWarehouse', event.target.value)} className={modalInputClass}><option value=''>请选择</option><option>塘厦仓</option><option>广州仓</option><option>义乌仓</option><option>保定仓</option></select></ModalField>
              <ModalField label='状态' required><select value={draft.enabled ? '启用' : '停用'} onChange={(event) => updateDraft('enabled', event.target.value === '启用')} className={modalInputClass}><option>停用</option><option>启用</option></select></ModalField>
              <ModalField label='企业微信'><input value={draft.enterpriseWechat} onChange={(event) => updateDraft('enterpriseWechat', event.target.value)} placeholder='请输入企业微信' className={modalInputClass}/></ModalField>
              <ModalField label='密码到期' required><div className='flex h-7 items-center gap-6 text-xs text-slate-600'><label className='flex cursor-pointer items-center gap-1.5'><input className='accent-[#0757b5]' type='radio' name='passwordExpires' checked={draft.passwordExpires} onChange={() => updateDraft('passwordExpires', true)}/>是</label><label className='flex cursor-pointer items-center gap-1.5'><input className='accent-[#0757b5]' type='radio' name='passwordExpires' checked={!draft.passwordExpires} onChange={() => updateDraft('passwordExpires', false)}/>否</label></div></ModalField>
            </div>
            <div className='mt-4 flex items-end justify-end gap-2'>
              <span className='mr-2 text-[11px] text-slate-400'>默认登录密码：123456</span>
              <button onClick={saveUser} className='h-7 rounded bg-[#0757b5] px-4 text-xs font-medium text-white transition hover:bg-blue-700'>保存</button>
              <button onClick={closeCreate} className='h-7 rounded border border-slate-200 bg-white px-4 text-xs text-slate-600 transition hover:bg-slate-50'>取消</button>
            </div>
          </div>
        </div>
      </div>}
    </div>
  </>;
}
