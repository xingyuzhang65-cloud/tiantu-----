import React, { useMemo, useState } from 'react';
import { Building2, Clock3, Download, Edit3, FileClock, Plus, Search, Settings, X } from 'lucide-react';
import InquiryQuoteResult, { CANADA_EAST_QUOTE_RESULT } from './InquiryQuoteResult';

type ToastType = 'success' | 'info' | 'warning';
type ModalType = 'inquiry' | 'edit';

interface IntendedCustomerPageProps {
  addToast: (message: string, type: ToastType) => void;
  onStartOpening?: (customer: Pick<IntendedCustomer, 'code' | 'companyName' | 'businessRep' | 'merchandiser'>) => void;
}

interface IntendedCustomer {
  id: number;
  code: string;
  companyName: string;
  businessRep: string;
  merchandiser: string;
  inquiryCount: number;
  lastInquiryAt: string;
  createdAt: string;
  creator: string;
}

interface IntendedCustomerDraft {
  companyName: string;
  businessRep: string;
  merchandiser: string;
}

interface IntendedCustomerFilters {
  code: string;
  companyName: string;
  businessRep: string;
  merchandiser: string;
  inquiryNo: string;
  inquiryChannel: string;
  inquiryTimeFrom: string;
  inquiryTimeTo: string;
}

interface OperationLog {
  id: number;
  time: string;
  operator: string;
  action: string;
  content: string;
}

interface InquiryRecord {
  customerId: number;
  inquiryNo: string;
  isQuoted: '是' | '否';
  inquiryChannel: string;
  inquiryTime: string;
  quoteTime: string;
  quoteResult: string;
}

const businessRepOptions = ['天期', '天金', '天成', '天宇', '天气', '天明'];
const merchandiserOptions = ['天睿', '天全', '天旺', '天朗'];
const inquiryChannelOptions = ['微信询价', '电话询价', '邮件询价', '官网询价', '线下询价'];

const seedCustomers: IntendedCustomer[] = [
  { id: 1, code: 'SZ003758', companyName: '深圳华南跨境有限公司', businessRep: '天期', merchandiser: '天睿', inquiryCount: 3, lastInquiryAt: '2026-08-20 16:35:00', createdAt: '2026-08-18 09:24:12', creator: '天朗' },
  { id: 2, code: 'SZ003759', companyName: '广州XX有限公司', businessRep: '天金', merchandiser: '天全', inquiryCount: 5, lastInquiryAt: '2026-08-19 17:42:00', createdAt: '2026-08-17 15:08:40', creator: '天睿' },
  { id: 3, code: 'SZ003760', companyName: '义乌XX有限公司', businessRep: '天成', merchandiser: '天旺', inquiryCount: 8, lastInquiryAt: '2026-08-18 14:03:00', createdAt: '2026-08-16 11:32:05', creator: '天全' },
  { id: 4, code: 'SZ003761', companyName: '宁波远洋汽配有限公司', businessRep: '天宇', merchandiser: '天朗', inquiryCount: 2, lastInquiryAt: '2026-08-16 09:12:00', createdAt: '2026-08-15 08:46:21', creator: '天旺' },
  { id: 5, code: 'SZ003762', companyName: '东莞智造出海科技有限公司', businessRep: '天气', merchandiser: '天睿', inquiryCount: 1, lastInquiryAt: '2026-08-15 13:50:00', createdAt: '2026-08-12 16:20:18', creator: '天朗' },
  { id: 6, code: 'SZ003763', companyName: '杭州拾光智能家居有限公司', businessRep: '天明', merchandiser: '天全', inquiryCount: 6, lastInquiryAt: '2026-08-12 16:28:00', createdAt: '2026-08-11 10:05:33', creator: '天睿' },
];

const inputClass = 'h-8 rounded border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const primaryButton = 'inline-flex h-8 items-center justify-center gap-1.5 rounded bg-blue-600 px-3 text-xs font-medium text-white transition hover:bg-blue-700';
const plainButton = 'inline-flex h-8 items-center justify-center gap-1.5 rounded border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600';
const emptyCustomerDraft: IntendedCustomerDraft = { companyName: '', businessRep: '', merchandiser: '' };

const formatInquiryTime = (value: string) => value && value.length >= 16 ? value.slice(5, 16) : value || '-';
const formatCreatedTime = (value: string) => value && value.length >= 10 ? value.slice(5, 10) : value || '-';
const nextCustomerCode = (customers: IntendedCustomer[]) => `SZ${String(Math.max(3757, ...customers.map((item) => Number(item.code.replace(/\D/g, '')) || 0)) + 1).padStart(6, '0')}`;
const escapeCsvValue = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
const formatDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
const toTimestamp = (value: string) => {
  if (!value) return null;
  const timestamp = new Date(value.replace(' ', 'T')).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const buildInquiryRecords = (customer: IntendedCustomer): InquiryRecord[] => {
  if (!customer.inquiryCount || !customer.lastInquiryAt) return [];
  const lastInquiryTime = new Date(customer.lastInquiryAt.replace(' ', 'T'));
  return Array.from({ length: customer.inquiryCount }, (_, index) => {
    const sequence = customer.inquiryCount - index;
    const inquiryTime = new Date(lastInquiryTime);
    inquiryTime.setDate(lastInquiryTime.getDate() - index);
    inquiryTime.setMinutes(lastInquiryTime.getMinutes() - index * 13);
    const quoted = index % 2 === 0 ? '是' : '否';
    const quoteTime = quoted === '是' ? formatDateTime(new Date(inquiryTime.getTime() + 45 * 60000)) : '';
    return {
      customerId: customer.id,
      inquiryNo: `XJ${customer.code.slice(2)}${String(sequence).padStart(3, '0')}`,
      isQuoted: quoted,
      inquiryChannel: inquiryChannelOptions[(customer.id + index) % inquiryChannelOptions.length],
      inquiryTime: formatDateTime(inquiryTime),
      quoteTime,
      quoteResult: quoted === '是' ? CANADA_EAST_QUOTE_RESULT : '',
    };
  });
};

const initialInquiryRecords: InquiryRecord[] = seedCustomers.flatMap(buildInquiryRecords);
const getLatestInquiryRecord = (records: InquiryRecord[], customerId: number) => records
  .filter((item) => item.customerId === customerId)
  .sort((first, second) => second.inquiryTime.localeCompare(first.inquiryTime))[0];

const initialOperationLogs: OperationLog[] = seedCustomers.map((customer) => ({
  id: customer.id,
  time: customer.createdAt,
  operator: '系统',
  action: '创建',
  content: `创建意向客户 ${customer.code}（${customer.companyName}）`,
})).reverse();

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className='flex min-w-0 items-center gap-2'>
      <span className='shrink-0 whitespace-nowrap text-xs font-semibold text-slate-700'>{label}</span>
      <span className='min-w-0 flex-1'>{children}</span>
    </label>
  );
}

function RequiredMark() {
  return <b className='mr-1 text-red-500'>*</b>;
}

export default function IntendedCustomerPage({ addToast, onStartOpening }: IntendedCustomerPageProps) {
  const [customers, setCustomers] = useState(seedCustomers);
  const emptyFilters: IntendedCustomerFilters = { code: '', companyName: '', businessRep: '', merchandiser: '', inquiryNo: '', inquiryChannel: '', inquiryTimeFrom: '', inquiryTimeTo: '' };
  const [searchDraft, setSearchDraft] = useState<IntendedCustomerFilters>(emptyFilters);
  const [filters, setFilters] = useState<IntendedCustomerFilters>(emptyFilters);
  const [activeCustomer, setActiveCustomer] = useState<IntendedCustomer | null>(null);
  const [modal, setModal] = useState<ModalType | null>(null);
  const [editDraft, setEditDraft] = useState<IntendedCustomer | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState<IntendedCustomerDraft>(emptyCustomerDraft);
  const [pageLogOpen, setPageLogOpen] = useState(false);
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>(initialOperationLogs);
  const [inquiryRecords] = useState<InquiryRecord[]>(initialInquiryRecords);

  const rows = useMemo(() => {
    const codeValue = filters.code.trim().toLowerCase();
    const companyNameValue = filters.companyName.trim();
    const businessRepValue = filters.businessRep.trim();
    const merchandiserValue = filters.merchandiser.trim();
    const inquiryNoValue = filters.inquiryNo.trim().toLowerCase();
    const inquiryChannelValue = filters.inquiryChannel.trim();
    const inquiryTimeFrom = toTimestamp(filters.inquiryTimeFrom);
    const inquiryTimeTo = toTimestamp(filters.inquiryTimeTo);
    return customers.filter((item) => {
      const latestInquiry = getLatestInquiryRecord(inquiryRecords, item.id);
      const latestInquiryTime = toTimestamp(latestInquiry?.inquiryTime || item.lastInquiryAt);
      return (
        (!codeValue || item.code.toLowerCase().includes(codeValue)) &&
        (!companyNameValue || item.companyName.includes(companyNameValue)) &&
        (!businessRepValue || item.businessRep.includes(businessRepValue)) &&
        (!merchandiserValue || item.merchandiser.includes(merchandiserValue)) &&
        (!inquiryNoValue || (latestInquiry?.inquiryNo || '').toLowerCase().includes(inquiryNoValue)) &&
        (!inquiryChannelValue || latestInquiry?.inquiryChannel === inquiryChannelValue) &&
        (inquiryTimeFrom === null || (latestInquiryTime !== null && latestInquiryTime >= inquiryTimeFrom)) &&
        (inquiryTimeTo === null || (latestInquiryTime !== null && latestInquiryTime <= inquiryTimeTo))
      );
    });
  }, [customers, filters, inquiryRecords]);

  const inquiryItems = activeCustomer ? inquiryRecords.filter((item) => item.customerId === activeCustomer.id) : [];

  const addOperationLog = (action: string, content: string) => setOperationLogs((current) => [
    { id: Date.now() + Math.random(), time: formatDateTime(new Date()), operator: '天朗', action, content },
    ...current,
  ]);

  const updateCustomer = (id: number, changes: Partial<IntendedCustomer>) => {
    setCustomers((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  };

  const search = () => setFilters({
    code: searchDraft.code.trim(),
    companyName: searchDraft.companyName.trim(),
    businessRep: searchDraft.businessRep.trim(),
    merchandiser: searchDraft.merchandiser.trim(),
    inquiryNo: searchDraft.inquiryNo.trim(),
    inquiryChannel: searchDraft.inquiryChannel.trim(),
    inquiryTimeFrom: searchDraft.inquiryTimeFrom,
    inquiryTimeTo: searchDraft.inquiryTimeTo,
  });

  const reset = () => {
    setSearchDraft(emptyFilters);
    setFilters(emptyFilters);
  };

  const showModal = (customer: IntendedCustomer, type: ModalType) => {
    setActiveCustomer(customer);
    setModal(type);
    if (type === 'edit') setEditDraft({ ...customer });
  };

  const closeModal = () => {
    setModal(null);
    setActiveCustomer(null);
    setEditDraft(null);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreateDraft(emptyCustomerDraft);
  };

  const exportRows = () => {
    const csv = [
      ['客户编码', '公司名称', '业务代表', '跟单代表', '询价单号', '询价渠道', '最近询价时间', '询价次数', '创建时间', '创建人'].map(escapeCsvValue).join(','),
      ...rows.map((row) => {
        const latestInquiry = getLatestInquiryRecord(inquiryRecords, row.id);
        return [
          row.code,
          row.companyName,
          row.businessRep,
          row.merchandiser,
          latestInquiry?.inquiryNo || '-',
          latestInquiry?.inquiryChannel || '-',
          latestInquiry?.inquiryTime || '-',
          row.inquiryCount,
          row.createdAt,
          row.creator,
        ].map(escapeCsvValue).join(',');
      }),
    ].join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = '意向客户列表.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    addOperationLog('导出', `导出 ${rows.length} 条意向客户数据`);
    addToast(`已导出 ${rows.length} 条意向客户数据`, 'success');
  };

  const saveCreate = () => {
    const companyName = createDraft.companyName.trim();
    const businessRep = createDraft.businessRep.trim();
    const merchandiser = createDraft.merchandiser.trim();
    if (!companyName) return addToast('请填写公司名称', 'warning');
    if (!businessRep) return addToast('请选择业务代表', 'warning');
    if (!merchandiser) return addToast('请选择跟单代表', 'warning');
    const now = formatDateTime(new Date());
    const next: IntendedCustomer = {
      id: Math.max(0, ...customers.map((item) => item.id)) + 1,
      code: nextCustomerCode(customers),
      companyName,
      businessRep,
      merchandiser,
      inquiryCount: 0,
      lastInquiryAt: '',
      createdAt: now,
      creator: '天朗',
    };
    setCustomers((current) => [next, ...current]);
    addOperationLog('新增', `新增意向客户 ${next.code}（${next.companyName}）`);
    addToast(`意向客户 ${next.code} 已新增`, 'success');
    closeCreate();
  };

  const saveEdit = () => {
    if (!editDraft || !editDraft.companyName.trim()) return addToast('请填写公司名称', 'warning');
    if (!editDraft.businessRep.trim()) return addToast('请选择业务代表', 'warning');
    if (!editDraft.merchandiser.trim()) return addToast('请选择跟单代表', 'warning');
    updateCustomer(editDraft.id, {
      companyName: editDraft.companyName.trim(),
      businessRep: editDraft.businessRep.trim(),
      merchandiser: editDraft.merchandiser.trim(),
    });
    addOperationLog('编辑', `编辑意向客户 ${editDraft.code}（${editDraft.companyName.trim()}）`);
    addToast('意向客户信息已更新', 'success');
    closeModal();
  };

  const renderActions = (customer: IntendedCustomer) => (
    <>
      <button onClick={() => showModal(customer, 'inquiry')} className='mr-3 text-blue-600 hover:underline'>询价记录</button>
      <button onClick={() => showModal(customer, 'edit')} className='mr-3 text-blue-600 hover:underline'>编辑</button>
      <button
        onClick={() => onStartOpening?.({
          code: customer.code,
          companyName: customer.companyName,
          businessRep: customer.businessRep,
          merchandiser: customer.merchandiser,
        })}
        className='text-emerald-600 hover:underline'
      >
        发起开户
      </button>
    </>
  );

  const renderRow = (customer: IntendedCustomer) => {
    const latestInquiry = getLatestInquiryRecord(inquiryRecords, customer.id);
    return (
      <tr key={customer.id} className='transition hover:bg-blue-50/40'>
        <td className='whitespace-nowrap px-4 py-3 font-mono text-blue-600'>{customer.code}</td>
        <td className='px-4 py-3 font-medium text-slate-700'>{customer.companyName}</td>
        <td className='whitespace-nowrap px-4 py-3'>{customer.businessRep}</td>
        <td className='whitespace-nowrap px-4 py-3'>{customer.merchandiser}</td>
        <td className='whitespace-nowrap px-4 py-3 font-mono text-blue-600'>{latestInquiry?.inquiryNo || '-'}</td>
        <td className='whitespace-nowrap px-4 py-3'>{latestInquiry?.inquiryChannel || '-'}</td>
        <td className='whitespace-nowrap px-4 py-3 text-slate-500'>
          <span className='inline-flex items-center gap-1.5'>
            <Clock3 className='h-3.5 w-3.5 text-slate-400' />
            {formatInquiryTime(latestInquiry?.inquiryTime || customer.lastInquiryAt)}
          </span>
        </td>
        <td className='px-4 py-3 text-center font-medium text-slate-700'>{customer.inquiryCount}</td>
        <td className='whitespace-nowrap px-4 py-3 text-slate-500'>{formatCreatedTime(customer.createdAt)}</td>
        <td className='whitespace-nowrap px-4 py-3'>{customer.creator}</td>
        <td className='whitespace-nowrap px-4 py-3'>{renderActions(customer)}</td>
      </tr>
    );
  };

  return (
    <div className='flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f7fa] text-slate-600'>
      <section className='shrink-0 border-b border-slate-200 bg-white px-4 py-3'>
        <div className='flex flex-wrap items-center gap-3'>
          <div className='grid min-w-0 flex-1 grid-cols-4 gap-3'>
            <FilterField label='客户编码'>
              <input value={searchDraft.code} onChange={(event) => setSearchDraft((current) => ({ ...current, code: event.target.value }))} onKeyDown={(event) => event.key === 'Enter' && search()} placeholder='请输入客户编码' className={inputClass + ' w-full'} />
            </FilterField>
            <FilterField label='公司名称'>
              <input value={searchDraft.companyName} onChange={(event) => setSearchDraft((current) => ({ ...current, companyName: event.target.value }))} onKeyDown={(event) => event.key === 'Enter' && search()} placeholder='请输入公司名称' className={inputClass + ' w-full'} />
            </FilterField>
            <FilterField label='业务代表'>
              <input value={searchDraft.businessRep} onChange={(event) => setSearchDraft((current) => ({ ...current, businessRep: event.target.value }))} onKeyDown={(event) => event.key === 'Enter' && search()} placeholder='请输入业务代表' className={inputClass + ' w-full'} />
            </FilterField>
            <FilterField label='跟单代表'>
              <input value={searchDraft.merchandiser} onChange={(event) => setSearchDraft((current) => ({ ...current, merchandiser: event.target.value }))} onKeyDown={(event) => event.key === 'Enter' && search()} placeholder='请输入跟单代表' className={inputClass + ' w-full'} />
            </FilterField>
            <FilterField label='询价单号'>
              <input value={searchDraft.inquiryNo} onChange={(event) => setSearchDraft((current) => ({ ...current, inquiryNo: event.target.value }))} onKeyDown={(event) => event.key === 'Enter' && search()} placeholder='请输入询价单号' className={inputClass + ' w-full'} />
            </FilterField>
            <FilterField label='询价渠道'>
              <select value={searchDraft.inquiryChannel} onChange={(event) => setSearchDraft((current) => ({ ...current, inquiryChannel: event.target.value }))} className={inputClass + ' w-full'}>
                <option value=''>全部渠道</option>
                {inquiryChannelOptions.map((channel) => <option key={channel}>{channel}</option>)}
              </select>
            </FilterField>
            <FilterField label='询价时间'>
              <div className='grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1'>
                <input type='datetime-local' value={searchDraft.inquiryTimeFrom} onChange={(event) => setSearchDraft((current) => ({ ...current, inquiryTimeFrom: event.target.value }))} className={inputClass + ' w-full px-1.5'} />
                <span className='text-slate-400'>至</span>
                <input type='datetime-local' value={searchDraft.inquiryTimeTo} onChange={(event) => setSearchDraft((current) => ({ ...current, inquiryTimeTo: event.target.value }))} className={inputClass + ' w-full px-1.5'} />
              </div>
            </FilterField>
          </div>
          <button onClick={search} className={primaryButton}><Search className='h-3.5 w-3.5' />查询</button>
          <button onClick={reset} className={plainButton}>重置</button>
        </div>
      </section>

      <section className='m-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm'>
        <div className='shrink-0 border-b border-slate-100 px-4 py-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div>
                <h2 className='flex items-center gap-2 text-sm font-semibold text-slate-800'>
                  <Building2 className='h-4 w-4 text-blue-600' />
                  意向客户
                </h2>
                <p className='mt-1 text-[11px] text-slate-400'>管理意向客户及开户资料</p>
              </div>
              <button onClick={() => setCreateOpen(true)} className={primaryButton}><Plus className='h-3.5 w-3.5' />新增意向客户</button>
              <button onClick={exportRows} className={primaryButton}><Download className='h-3.5 w-3.5' />导出</button>
              <button onClick={() => setPageLogOpen(true)} className={primaryButton}><FileClock className='h-3.5 w-3.5' />查看日志</button>
            </div>
            <div className='flex items-center gap-2'>
              <span className='rounded-full bg-blue-50 px-2.5 py-1 text-[11px] text-blue-600'>共 {rows.length} 条</span>
              <button title='表格列设置' onClick={() => addToast('已打开表格列设置', 'info')} className='flex h-7 w-8 items-center justify-center rounded-sm bg-[#0757b5] text-white transition hover:bg-blue-700'><Settings className='h-3.5 w-3.5' /></button>
            </div>
          </div>
        </div>
        <div className='min-h-0 flex-1 overflow-auto'>
          <table className='w-full min-w-[1320px] text-left text-xs'>
            <thead className='sticky top-0 z-10 bg-slate-50 text-slate-500'>
              <tr>
                {['客户编码', '公司名称', '业务代表', '跟单代表', '询价单号', '询价渠道', '最近询价时间', '询价次数', '创建时间', '创建人', '操作'].map((heading) => (
                  <th key={heading} className='whitespace-nowrap border-b border-slate-200 px-4 py-3 font-medium'>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {rows.map(renderRow)}
              {!rows.length && <tr><td colSpan={11} className='py-20 text-center text-xs text-slate-400'>暂无符合条件的意向客户</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {createOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4' onMouseDown={(event) => event.target === event.currentTarget && closeCreate()}>
          <div className='w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl'>
            <div className='flex items-center justify-between border-b border-slate-100 px-5 py-3'>
              <h3 className='text-sm font-semibold text-slate-800'>新增意向客户</h3>
              <button onClick={closeCreate} className='text-slate-400 hover:text-slate-600'><X className='h-4 w-4' /></button>
            </div>
            <div className='space-y-4 p-5'>
              <label className='block text-xs text-slate-600'>
                <RequiredMark />公司名称
                <input autoFocus value={createDraft.companyName} onChange={(event) => setCreateDraft((current) => ({ ...current, companyName: event.target.value }))} className={inputClass + ' mt-1 w-full'} placeholder='请输入公司名称' />
              </label>
              <label className='block text-xs text-slate-600'>
                <RequiredMark />业务代表
                <select value={createDraft.businessRep} onChange={(event) => setCreateDraft((current) => ({ ...current, businessRep: event.target.value }))} className={inputClass + ' mt-1 w-full'}>
                  <option value=''>请选择业务代表</option>
                  {businessRepOptions.map((rep) => <option key={rep}>{rep}</option>)}
                </select>
              </label>
              <label className='block text-xs text-slate-600'>
                <RequiredMark />跟单代表
                <select value={createDraft.merchandiser} onChange={(event) => setCreateDraft((current) => ({ ...current, merchandiser: event.target.value }))} className={inputClass + ' mt-1 w-full'}>
                  <option value=''>请选择跟单代表</option>
                  {merchandiserOptions.map((rep) => <option key={rep}>{rep}</option>)}
                </select>
              </label>
              <div className='flex justify-end gap-2'>
                <button onClick={closeCreate} className={plainButton}>取消</button>
                <button onClick={saveCreate} className={primaryButton}><Plus className='h-3.5 w-3.5' />保存</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pageLogOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4' onMouseDown={(event) => event.target === event.currentTarget && setPageLogOpen(false)}>
          <div className='w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl'>
            <div className='flex items-center justify-between border-b border-slate-100 px-5 py-3'>
              <h3 className='text-sm font-semibold text-slate-800'>意向客户操作日志</h3>
              <button onClick={() => setPageLogOpen(false)} className='text-slate-400 hover:text-slate-600'><X className='h-4 w-4' /></button>
            </div>
            <div className='max-h-[520px] space-y-3 overflow-y-auto p-5'>
              {operationLogs.map((item) => (
                <div key={item.id} className='grid grid-cols-[132px_70px_70px_minmax(0,1fr)] gap-3 border-b border-slate-100 pb-3 text-xs last:border-b-0'>
                  <span className='text-slate-400'>{item.time}</span>
                  <span className='font-medium text-slate-700'>{item.operator}</span>
                  <span className='text-blue-600'>{item.action}</span>
                  <span className='text-slate-600'>{item.content}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modal && activeCustomer && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4' onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
          <div className={`max-h-[90vh] w-full ${modal === 'inquiry' ? 'max-w-5xl' : 'max-w-lg'} overflow-hidden rounded-lg bg-white shadow-2xl`}>
            <div className='flex items-center justify-between border-b border-slate-100 px-5 py-3'>
              <h3 className='text-sm font-semibold text-slate-800'>{modal === 'inquiry' ? '询价记录' : '编辑意向客户'}</h3>
              <button onClick={closeModal} className='text-slate-400 hover:text-slate-600'><X className='h-4 w-4' /></button>
            </div>
            {modal === 'inquiry' && (
              <div className='max-h-[calc(90vh-50px)] space-y-3 overflow-y-auto p-5'>
                <div className='rounded bg-slate-50 p-3 text-xs'>
                  <b className='text-slate-700'>{activeCustomer.companyName}</b>
                  <span className='ml-2 text-slate-400'>{activeCustomer.code}</span>
                </div>
                <div className='overflow-x-auto rounded border border-slate-200'>
                  <table className='w-full min-w-[940px] table-fixed text-left text-xs'>
                    <colgroup>
                      <col className='w-[155px]' />
                      <col className='w-[105px]' />
                      <col className='w-[95px]' />
                      <col className='w-[165px]' />
                      <col className='w-[420px]' />
                    </colgroup>
                    <thead className='bg-slate-50 text-slate-500'>
                      <tr>
                        {['询价单号', '询价渠道', '是否已报价', '报价时间', '报价结果'].map((heading) => (
                          <th key={heading} className='border-b border-slate-200 px-3 py-2 font-medium'>{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                      {inquiryItems.map((item) => (
                        <tr key={item.inquiryNo}>
                          <td className='px-3 py-2 font-mono text-blue-600'>{item.inquiryNo}</td>
                          <td className='px-3 py-2 text-slate-700'>{item.inquiryChannel}</td>
                          <td className='px-3 py-2 text-slate-700'>{item.isQuoted}</td>
                          <td className='px-3 py-2 text-slate-500'>{item.quoteTime || '-'}</td>
                          <td className='min-w-0 px-3 py-2 text-slate-700'><InquiryQuoteResult value={item.quoteResult} /></td>
                        </tr>
                      ))}
                      {!inquiryItems.length && <tr><td colSpan={5} className='py-10 text-center text-xs text-slate-400'>暂无询价记录</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {modal === 'edit' && editDraft && (
              <div className='space-y-4 p-5'>
                <label className='block text-xs text-slate-600'>
                  <RequiredMark />公司名称
                  <input value={editDraft.companyName} onChange={(event) => setEditDraft({ ...editDraft, companyName: event.target.value })} className={inputClass + ' mt-1 w-full'} />
                </label>
                <label className='block text-xs text-slate-600'>
                  <RequiredMark />业务代表
                  <select value={editDraft.businessRep} onChange={(event) => setEditDraft({ ...editDraft, businessRep: event.target.value })} className={inputClass + ' mt-1 w-full'}>
                    <option value=''>请选择业务代表</option>
                    {businessRepOptions.map((rep) => <option key={rep}>{rep}</option>)}
                  </select>
                </label>
                <label className='block text-xs text-slate-600'>
                  <RequiredMark />跟单代表
                  <select value={editDraft.merchandiser} onChange={(event) => setEditDraft({ ...editDraft, merchandiser: event.target.value })} className={inputClass + ' mt-1 w-full'}>
                    <option value=''>请选择跟单代表</option>
                    {merchandiserOptions.map((rep) => <option key={rep}>{rep}</option>)}
                  </select>
                </label>
                <div className='flex justify-end gap-2'>
                  <button onClick={closeModal} className={plainButton}>取消</button>
                  <button onClick={saveEdit} className={primaryButton}><Edit3 className='h-3.5 w-3.5' />保存</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
