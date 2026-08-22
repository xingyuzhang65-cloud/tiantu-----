import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Ban, Check, ChevronDown, ChevronLeft, ChevronRight, CirclePlus,
  Download, FileClock, ImagePlus, Plus, RotateCcw, Search, Settings, Trash2, Users, X,
} from 'lucide-react';

type ToastType = 'success' | 'info' | 'warning';
type CustomerStatus = '启用' | '停用';
type DrawerMode = 'create' | 'view' | 'edit';
type CustomerContactField = 'name' | 'position' | 'mobile' | 'email' | 'qq' | 'wechat' | 'address';

interface CustomerContactRow {
  id: number;
  name: string;
  position: string;
  mobile: string;
  email: string;
  qq: string;
  wechat: string;
  address: string;
}

interface CustomerInquiryRecord {
  customerId: number;
  inquiryNo: string;
  inquirer: string;
  inquiryTime: string;
}

interface CustomerManagementPageProps {
  addToast: (message: string, type: ToastType) => void;
  createSeed?: CustomerCreateSeed | null;
  onCreateSeedHandled?: () => void;
}

export interface CustomerCreateSeed {
  requestId: number;
  sourceCode: string;
  companyName: string;
  businessRep: string;
}

interface CustomerRecord {
  id: number;
  code: string;
  name: string;
  level: string;
  contact: string;
  phone: string;
  externalSettlement: string;
  internalSettlement: string;
  salesRep: string;
  merchandiser: string;
  financeRep: string;
  unsignedDays: string;
  contractEnd: string;
  validity: string;
  remaining: string;
  company: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  status: CustomerStatus;
  detail?: CustomerDraft;
  contactRows?: CustomerContactRow[];
  licenseName?: string;
}

const customerSeeds: Array<[string, string]> = [
  ['QD000045', '跃盛'], ['SZ003757', '蓝海通国际'], ['SH000150', '宁波晓海'],
  ['SZ003756', '伍卉通'], ['QD000044', '亿恒达'], ['SZ003755', '合连'],
  ['ZS000214', '晋江远腾'], ['SZ003754', '喜百年-海外仓'], ['ZS000213', '小哈喽'],
  ['ST000023', '广东弘信'], ['DG000074', '钛源'], ['SZ003753', '国泰京胜达'],
  ['DG000073', '长艳'], ['SZ003744', '速邮达-海外仓'], ['YW000457', '上海万峰-海外仓'],
  ['QD000043', '淘兴迈达'], ['QD000042', '缤新意'], ['SZ003743', '精言'],
  ['NB000047', '贝特尔-海外仓'], ['QD000041', '嘉凯运通'], ['SZ003742', 'admin321'],
  ['QD000040', '青岛中昱'], ['ZS000212', '嘉速达-海外仓'], ['SZ003741', '振源达-海外仓'],
  ['SH000149', '深圳聚盟'], ['XM000321', '佳德盛'], ['XM000320', '潮鸣'],
  ['NB000046', '通乐兴国际'], ['SZ003740', '鸿迈八方'], ['SZ003739', '小尔泰-海外仓'],
  ['NB000045', '炬科起源'], ['QD000039', '淘岛达'],
];

const salesNames = ['天佑（李云西）', '天全（张开泰）', '天睿（朱勋）', '天森（谭家文）', '天分（杨祥钧）', '天成（橘衣彦）'];
const intendedSalesNames = ['天期', '天金', '天成', '天宇', '天气', '天明'];
const financeNames = ['天贵（郑嘉慧）', '天昊', '天姐', '天君', '天则', '天筹（潘书琴）'];
const companies = ['青岛天图', '深圳天图', '上海天图', '中山天图', '东莞天图', '义乌天图', '厦门天图', '宁波天图'];

const emptyCustomerDraft = {
  code: '', name: '', level: '', externalSettlement: '', internalSettlement: '', salesRep: '',
  financeRep: '', merchandiser: '', company: '', loginAccount: '', creditLimit: '0', province: '',
  city: '', district: '', remark: '', overdueEnabled: '启用', robotCollection: '开启',
  recommendationType: '全量推单', billingNode: '', contractStatus: '未签订', legalName: '',
  unifiedSocialCreditCode: '', legalRepresentative: '', contactPhone: '', address: '',
  transportDomain: '', integrationSystem: '', integrationAccount: '', integrationNote: '',
};

type CustomerDraft = typeof emptyCustomerDraft;

const buildCustomerDraft = (seed?: CustomerCreateSeed | null) => ({
  ...emptyCustomerDraft,
  ...(seed ? {
    name: seed.companyName,
    legalName: seed.companyName,
    salesRep: seed.businessRep,
    remark: `由意向客户 ${seed.sourceCode} 发起开户`,
  } : {}),
});

const customerToDraft = (customer: CustomerRecord): CustomerDraft => ({
  ...emptyCustomerDraft,
  legalName: customer.name,
  contactPhone: customer.phone === '-' ? '' : customer.phone,
  ...(customer.detail ?? {}),
  code: customer.code,
  name: customer.name,
  level: customer.level,
  externalSettlement: customer.externalSettlement,
  internalSettlement: customer.internalSettlement,
  salesRep: customer.salesRep,
  financeRep: customer.financeRep,
  merchandiser: customer.merchandiser,
  company: customer.company,
});

const customerContactsToDraft = (customer: CustomerRecord): CustomerContactRow[] => {
  if (customer.contactRows) return customer.contactRows.map((contact) => ({ ...contact }));
  if (customer.contact === '-' && customer.phone === '-') return [];
  return [{
    id: customer.id * 1000,
    name: customer.contact === '-' ? '' : customer.contact,
    position: '',
    mobile: customer.phone === '-' ? '' : customer.phone,
    email: '',
    qq: '',
    wechat: '',
    address: '',
  }];
};

const initialCustomers: CustomerRecord[] = customerSeeds.map(([code, name], index) => {
  const day = 20 - Math.floor(index / 4);
  const hour = 16 - (index % 8);
  const hasContract = [7, 13, 14, 17, 18, 22, 23, 25, 26, 29].includes(index);
  const contractEnd = hasContract ? (index % 3 === 1 ? '2027/02/28' : '2027/08/01') : '';
  return {
    id: index + 1, code, name, level: 'vip', contact: '-', phone: '-',
    externalSettlement: index % 4 === 2 ? '周结' : index % 3 === 2 ? '现结' : '半月结',
    internalSettlement: index % 4 === 2 ? '周结' : index % 3 === 2 ? '现结' : index % 5 === 0 ? '月结10天' : '半月结',
    salesRep: salesNames[index % salesNames.length],
    merchandiser: index % 4 === 0 ? '天睿' : index % 4 === 1 ? '天全' : '天旺',
    financeRep: financeNames[index % financeNames.length],
    unsignedDays: `${Math.min(3, Math.floor(index / 6))}天`,
    contractEnd,
    validity: contractEnd ? '未到期' : '',
    remaining: contractEnd === '2027/02/28' ? '192天' : contractEnd ? '346天' : '',
    company: companies[index % companies.length],
    creator: index % 5 === 0 ? '天睿' : index % 3 === 0 ? '天全' : '天旺',
    createdAt: `2026-08-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(42 - (index % 6) * 6).padStart(2, '0')}:${String(23 - (index % 5) * 3).padStart(2, '0')}`,
    updatedAt: `2026-08-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(16 - (index % 3) * 3).padStart(2, '0')}:${String(11 + (index % 7) * 4).padStart(2, '0')}`,
    status: '启用',
  };
});

const inputClass = 'h-7 w-full rounded-sm border border-[#dce3ec] bg-white px-2.5 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#1677d2] focus:ring-1 focus:ring-blue-100';
const primaryButton = 'inline-flex h-7 items-center justify-center gap-1.5 rounded-sm bg-[#0757b5] px-3 text-[11px] font-medium text-white transition hover:bg-[#064a9b]';
const plainButton = 'inline-flex h-7 items-center justify-center gap-1.5 rounded-sm border border-[#dbe2ea] bg-white px-3 text-[11px] text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600';
const formatDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const initialCustomerInquiryRecords: CustomerInquiryRecord[] = initialCustomers.flatMap((customer, index) => {
  const count = index % 4 === 0 ? 0 : (index % 3) + 1;
  const baseTime = new Date(customer.updatedAt.replace(' ', 'T'));
  return Array.from({ length: count }, (_, itemIndex) => {
    const inquiryTime = new Date(baseTime);
    inquiryTime.setDate(baseTime.getDate() - itemIndex);
    inquiryTime.setMinutes(baseTime.getMinutes() - itemIndex * 17);
    return {
      customerId: customer.id,
      inquiryNo: `XJ${customer.code.replace(/\D/g, '').padStart(6, '0')}${String(count - itemIndex).padStart(3, '0')}`,
      inquirer: customer.salesRep,
      inquiryTime: formatDateTime(inquiryTime),
    };
  });
});

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className='flex min-w-0 items-center gap-2'><span className='shrink-0 whitespace-nowrap text-[11px] font-semibold text-slate-700'>{label}</span><span className='min-w-0 flex-1'>{children}</span></label>;
}

function Cell({ value }: { value: string }) {
  return <td className='truncate border-b border-r border-[#e5e9ef] px-2 text-center' title={value}>{value || <span className='text-slate-300'>&nbsp;</span>}</td>;
}

function ModalField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className='grid grid-cols-[108px_minmax(0,1fr)] items-center gap-2 text-[11px] text-slate-600'><span className='text-right'>{required && <b className='mr-1 text-red-500'>*</b>}{label}：</span>{children}</label>;
}

function DrawerSection({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return <section className='border-b border-slate-100 px-5 py-4'><div className='mb-4 flex items-center gap-2'><span className='h-4 w-1 rounded bg-[#0757b5]'/><h4 className='text-[13px] font-semibold text-slate-800'>{title}</h4>{note && <span className='text-[10px] text-slate-400'>（{note}）</span>}</div>{children}</section>;
}

export default function CustomerManagementPage({ addToast, createSeed, onCreateSeedHandled }: CustomerManagementPageProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [company, setCompany] = useState('');
  const [level, setLevel] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState({ code: '', name: '', status: '', company: '', level: '' });
  const [checked, setChecked] = useState<number[]>([]);
  const [batchOpen, setBatchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(Boolean(createSeed));
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [activeCustomerId, setActiveCustomerId] = useState<number | null>(null);
  const [draft, setDraft] = useState(() => buildCustomerDraft(createSeed));
  const [contacts, setContacts] = useState<CustomerContactRow[]>([]);
  const [licenseName, setLicenseName] = useState('');
  const [inquiryRecords, setInquiryRecords] = useState<CustomerInquiryRecord[]>(initialCustomerInquiryRecords);
  const [manualInquiryNo, setManualInquiryNo] = useState('');
  const handledSeedIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!createSeed || handledSeedIdRef.current === createSeed.requestId) return;
    handledSeedIdRef.current = createSeed.requestId;
    setDrawerMode('create');
    setActiveCustomerId(null);
    setDraft(buildCustomerDraft(createSeed));
    setContacts([]);
    setLicenseName('');
    setCreateOpen(true);
    onCreateSeedHandled?.();
  }, [createSeed, onCreateSeedHandled]);

  const rows = useMemo(() => customers.filter((customer) =>
    (!filters.code || customer.code.toLowerCase().includes(filters.code.toLowerCase())) &&
    (!filters.name || customer.name.includes(filters.name)) &&
    (!filters.status || customer.status === filters.status) &&
    (!filters.company || customer.company === filters.company) &&
    (!filters.level || customer.level === filters.level)
  ), [customers, filters]);

  const allChecked = rows.length > 0 && rows.every((row) => checked.includes(row.id));
  const drawerReadonly = drawerMode === 'view';
  const drawerTitle = drawerMode === 'view' ? '查看客户' : drawerMode === 'edit' ? '编辑客户' : '新建客户';
  const activeCustomer = activeCustomerId === null ? null : customers.find((customer) => customer.id === activeCustomerId) ?? null;
  const inquiryItems = activeCustomerId === null ? [] : inquiryRecords.filter((item) => item.customerId === activeCustomerId);

  const search = () => {
    setFilters({ code: code.trim(), name: name.trim(), status, company, level });
    addToast('客户筛选条件已应用', 'success');
  };

  const reset = () => {
    setCode(''); setName(''); setStatus(''); setCompany(''); setLevel('');
    setFilters({ code: '', name: '', status: '', company: '', level: '' });
    addToast('客户筛选条件已重置', 'info');
  };

  const openBlankCreateDrawer = () => {
    setDrawerMode('create');
    setActiveCustomerId(null);
    setDraft(buildCustomerDraft());
    setContacts([]);
    setLicenseName('');
    setCreateOpen(true);
  };

  const closeCustomerDrawer = () => {
    setCreateOpen(false);
    setDrawerMode('create');
    setActiveCustomerId(null);
    setManualInquiryNo('');
  };

  const openViewDrawer = (customer: CustomerRecord) => {
    setDrawerMode('view');
    setActiveCustomerId(customer.id);
    setDraft(customerToDraft(customer));
    setContacts(customerContactsToDraft(customer));
    setLicenseName(customer.licenseName ?? '');
    setManualInquiryNo('');
    setCreateOpen(true);
  };

  const openEditDrawer = (customer: CustomerRecord) => {
    setDrawerMode('edit');
    setActiveCustomerId(customer.id);
    setDraft(customerToDraft(customer));
    setContacts(customerContactsToDraft(customer));
    setLicenseName(customer.licenseName ?? '');
    setManualInquiryNo('');
    setCreateOpen(true);
  };

  const changeStatus = (ids: number[], nextStatus: CustomerStatus) => {
    if (!ids.length) return addToast('请先选择客户', 'warning');
    setCustomers((current) => current.map((item) => ids.includes(item.id) ? { ...item, status: nextStatus } : item));
    setChecked([]); setBatchOpen(false);
    addToast(`已${nextStatus === '启用' ? '启用' : '停用'} ${ids.length} 个客户`, 'success');
  };

  const exportRows = () => {
    const data = checked.length ? rows.filter((row) => checked.includes(row.id)) : rows;
    const csv = ['客户编码,客户名称,客户等级,外部结算方式,内部结算方式,销售代表,所属公司,状态', ...data.map((row) => [row.code, row.name, row.level, row.externalSettlement, row.internalSettlement, row.salesRep, row.company, row.status].join(','))].join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = '客户列表.csv'; anchor.click(); URL.revokeObjectURL(url);
    addToast(`已导出 ${data.length} 条客户数据`, 'success');
  };

  const saveCustomer = () => {
    if (drawerReadonly) return;
    if (!draft.name.trim()) return addToast('请填写客户名称', 'warning');
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (drawerMode === 'edit') {
      if (activeCustomerId === null) return addToast('未找到要编辑的客户', 'warning');
      let updatedName = draft.name.trim();
      setCustomers((current) => current.map((item) => {
        if (item.id !== activeCustomerId) return item;
        updatedName = draft.name.trim();
        return {
          ...item,
          name: updatedName,
          level: draft.level || 'vip',
          contact: contacts[0]?.name || '-',
          phone: contacts[0]?.mobile || '-',
          externalSettlement: draft.externalSettlement || '现结',
          internalSettlement: draft.internalSettlement || '现结',
          salesRep: draft.salesRep || '天朗（付豪）',
          merchandiser: draft.merchandiser || '天朗',
          financeRep: draft.financeRep || '天贵（郑嘉慧）',
          company: draft.company || '深圳天图',
          updatedAt: now,
          detail: { ...draft, code: item.code, name: updatedName },
          contactRows: contacts.map((contact) => ({ ...contact })),
          licenseName,
        };
      }));
      closeCustomerDrawer();
      addToast(`客户 ${updatedName} 更新成功`, 'success');
      return;
    }
    const generatedCode = draft.code.trim() || `SZ${String(Math.max(3757, ...customers.map((item) => Number(item.code.replace(/\D/g, '')) || 0)) + 1).padStart(6, '0')}`;
    if (customers.some((item) => item.code.toLowerCase() === generatedCode.toLowerCase())) return addToast('客户编码已存在', 'warning');
    const next: CustomerRecord = {
      id: Math.max(0, ...customers.map((item) => item.id)) + 1,
      code: generatedCode, name: draft.name.trim(), level: draft.level || 'vip', contact: contacts[0]?.name || '-', phone: contacts[0]?.mobile || '-',
      externalSettlement: draft.externalSettlement || '现结', internalSettlement: draft.internalSettlement || '现结',
      salesRep: draft.salesRep || '天朗（付豪）', merchandiser: draft.merchandiser || '天朗', financeRep: draft.financeRep || '天贵（郑嘉慧）',
      unsignedDays: '0天', contractEnd: '', validity: '', remaining: '',
      company: draft.company || '深圳天图', creator: '天朗', createdAt: now, updatedAt: now, status: '启用',
      detail: { ...draft, code: generatedCode, name: draft.name.trim() },
      contactRows: contacts.map((contact) => ({ ...contact })),
      licenseName,
    };
    setCustomers((current) => [next, ...current]);
    closeCustomerDrawer();
    setDraft(buildCustomerDraft());
    setContacts([]);
    setLicenseName('');
    addToast(`客户 ${next.name} 创建成功`, 'success');
  };

  const updateContact = (id: number, field: CustomerContactField, value: string) => {
    setContacts((current) => current.map((contact) => contact.id === id ? { ...contact, [field]: value } : contact));
  };

  const addManualInquiryRecord = () => {
    if (drawerMode !== 'edit') return;
    if (!activeCustomer) return;
    const inquiryNo = manualInquiryNo.trim();
    if (!inquiryNo) return addToast('请输入询价单号', 'warning');
    if (inquiryRecords.some((item) => item.inquiryNo.toLowerCase() === inquiryNo.toLowerCase())) return addToast('询价单号已存在', 'warning');
    const nextRecord: CustomerInquiryRecord = {
      customerId: activeCustomer.id,
      inquiryNo,
      inquirer: draft.salesRep || activeCustomer.salesRep,
      inquiryTime: formatDateTime(new Date()),
    };
    setInquiryRecords((current) => [nextRecord, ...current]);
    setManualInquiryNo('');
    addToast(`询价单 ${inquiryNo} 已加入当前客户`, 'success');
  };

  return (
    <div className='relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f7fa] text-slate-600'>
      <section className='shrink-0 border-b border-[#edf0f4] bg-white px-3 py-2 shadow-[0_2px_7px_rgba(15,23,42,0.03)]'>
        <div className='flex items-center gap-4'>
          <div className='grid min-w-0 flex-1 grid-cols-3 gap-4'>
            <FilterField label='客户编码'>
              <input value={code} onChange={(event) => setCode(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && search()} placeholder='请输入' className={inputClass}/>
            </FilterField>
            <FilterField label='客户名称'>
              <input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && search()} placeholder='客户名称' className={inputClass}/>
            </FilterField>
            <FilterField label='状态'>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}>
                <option value=''>状态</option><option>启用</option><option>停用</option>
              </select>
            </FilterField>
          </div>
          <div className='flex shrink-0 items-center gap-3'>
            <button onClick={search} className={primaryButton + ' min-w-[108px]'}><Search className='h-3.5 w-3.5'/>查询</button>
            <button onClick={reset} className={plainButton + ' min-w-[108px]'}><RotateCcw className='h-3.5 w-3.5'/>重置</button>
            <button onClick={() => setAdvancedOpen((open) => !open)} className={plainButton + ' min-w-[108px]'}>
              <ChevronDown className={'h-3.5 w-3.5 transition ' + (advancedOpen ? 'rotate-180' : '')}/>{advancedOpen ? '收起' : '展开'}
            </button>
          </div>
        </div>
        {advancedOpen && <div className='mt-2 grid max-w-[900px] grid-cols-2 gap-4 border-t border-slate-100 pt-2'>
          <FilterField label='客户等级'>
            <select value={level} onChange={(event) => setLevel(event.target.value)} className={inputClass}><option value=''>客户等级</option><option>vip</option><option>普通客户</option></select>
          </FilterField>
          <FilterField label='所属公司'>
            <select value={company} onChange={(event) => setCompany(event.target.value)} className={inputClass}><option value=''>所属公司</option>{companies.map((item) => <option key={item}>{item}</option>)}</select>
          </FilterField>
        </div>}
      </section>

      <section className='m-2.5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm bg-white shadow-[0_1px_8px_rgba(15,23,42,0.05)]'>
        <div className='flex h-11 shrink-0 items-center justify-between border-b border-[#edf0f4] px-3'>
          <div className='flex items-center gap-2'>
            <button onClick={openBlankCreateDrawer} className={primaryButton}><CirclePlus className='h-3.5 w-3.5'/>新建</button>
            <button onClick={() => changeStatus(checked, '停用')} className='inline-flex h-7 items-center gap-1.5 rounded-sm bg-[#dc4047] px-3 text-[11px] font-medium text-white transition hover:bg-red-600'><Ban className='h-3.5 w-3.5'/>停用</button>
            <button onClick={() => changeStatus(checked, '启用')} className={primaryButton}><Check className='h-3.5 w-3.5'/>启用</button>
            <button onClick={exportRows} className={primaryButton}><Download className='h-3.5 w-3.5'/>导出</button>
            <div className='relative'>
              <button onClick={() => setBatchOpen((open) => !open)} className={primaryButton}>批量操作<ChevronDown className='h-3.5 w-3.5'/></button>
              {batchOpen && <div className='absolute left-0 top-8 z-30 w-32 rounded-sm border border-slate-200 bg-white py-1 shadow-lg'>
                <button onClick={() => changeStatus(checked, '启用')} className='flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-slate-600 hover:bg-blue-50'><Check className='h-3.5 w-3.5 text-blue-600'/>批量启用</button>
                <button onClick={() => changeStatus(checked, '停用')} className='flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-slate-600 hover:bg-red-50'><Ban className='h-3.5 w-3.5 text-red-500'/>批量停用</button>
              </div>}
            </div>
            <button onClick={() => addToast('已打开客户操作日志', 'info')} className={primaryButton}><FileClock className='h-3.5 w-3.5'/>查看日志</button>
            {checked.length > 0 && <span className='ml-1 text-[10px] text-slate-400'>已选择 {checked.length} 项</span>}
          </div>
          <button title='表格列设置' onClick={() => addToast('已打开表格列设置', 'info')} className='flex h-7 w-8 items-center justify-center rounded-sm bg-[#0757b5] text-white transition hover:bg-blue-700'><Settings className='h-3.5 w-3.5'/></button>
        </div>

        <div className='min-h-0 flex-1 overflow-auto bg-white'>
          <table className='w-full min-w-[2250px] table-fixed border-collapse text-[10px] text-slate-600'>
            <colgroup>
              <col className='w-10'/><col className='w-[104px]'/><col className='w-[125px]'/><col className='w-[78px]'/><col className='w-[90px]'/><col className='w-[92px]'/><col className='w-[112px]'/><col className='w-[112px]'/><col className='w-[112px]'/><col className='w-[96px]'/><col className='w-[112px]'/><col className='w-[112px]'/><col className='w-[105px]'/><col className='w-[88px]'/><col className='w-[100px]'/><col className='w-[100px]'/><col className='w-[92px]'/><col className='w-[138px]'/><col className='w-[138px]'/><col className='w-[170px]'/>
            </colgroup>
            <thead className='sticky top-0 z-10 bg-[#f6f8fb] text-[#536173] shadow-[0_1px_0_#dfe5ec]'>
              <tr>
                <th className='border-b border-r border-[#dfe5ec] px-2 py-2 text-center'>
                  <input aria-label='全选客户' className='h-3.5 w-3.5 accent-[#0757b5]' type='checkbox' checked={allChecked} onChange={() => setChecked(allChecked ? checked.filter((id) => !rows.some((row) => row.id === id)) : Array.from(new Set([...checked, ...rows.map((row) => row.id)])))}/>
                </th>
                {['客户编码','客户名称','客户等级','联系人','联系方式','外部结算方式','内部结算方式','销售代表','跟单代表','财务代表','未签订合同时间','合同到期日期','效期状态','距合同到期','所属公司','添加人','创建时间','更新时间','操作'].map((heading) =>
                  <th key={heading} className={'whitespace-nowrap border-b border-r border-[#dfe5ec] px-2 py-2 text-center font-semibold ' + (heading === '操作' ? 'sticky right-0 bg-[#f6f8fb] shadow-[-3px_0_7px_rgba(15,23,42,0.05)]' : '')}>{heading}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((customer) => {
                const selected = checked.includes(customer.id);
                return <tr key={customer.id} className={'group h-[27px] transition hover:bg-[#f4f8ff] ' + (selected ? 'bg-blue-50' : 'bg-white')}>
                  <td className='border-b border-r border-[#e5e9ef] px-2 text-center'>
                    <input aria-label={'选择 ' + customer.name} className='h-3.5 w-3.5 accent-[#0757b5]' type='checkbox' checked={selected} onChange={() => setChecked((ids) => ids.includes(customer.id) ? ids.filter((id) => id !== customer.id) : [...ids, customer.id])}/>
                  </td>
                  <Cell value={customer.code}/><Cell value={customer.name}/><Cell value={customer.level}/><Cell value={customer.contact}/><Cell value={customer.phone}/>
                  <Cell value={customer.externalSettlement}/><Cell value={customer.internalSettlement}/><Cell value={customer.salesRep}/><Cell value={customer.merchandiser}/><Cell value={customer.financeRep}/>
                  <Cell value={customer.unsignedDays}/><Cell value={customer.contractEnd}/><Cell value={customer.validity}/><Cell value={customer.remaining}/><Cell value={customer.company}/><Cell value={customer.creator}/>
                  <Cell value={customer.createdAt}/><Cell value={customer.updatedAt}/>
                  <td className={'sticky right-0 whitespace-nowrap border-b border-[#e5e9ef] px-2 text-center shadow-[-3px_0_7px_rgba(15,23,42,0.04)] group-hover:bg-[#f4f8ff] ' + (selected ? 'bg-blue-50' : 'bg-white')}>
                    <button onClick={() => openViewDrawer(customer)} className='mr-2 text-[#1685e5] hover:underline'>查看</button>
                    <button onClick={() => openEditDrawer(customer)} className='mr-2 text-[#1685e5] hover:underline'>编辑</button>
                    <button onClick={() => addToast(customer.name + ' 的密码已重置', 'success')} className='text-[#1685e5] hover:underline'>重置密码</button>
                  </td>
                </tr>;
              })}
              {!rows.length && <tr><td colSpan={20} className='py-24 text-center text-xs text-slate-400'><Users className='mx-auto mb-2 h-8 w-8'/>暂无符合条件的客户</td></tr>}
            </tbody>
          </table>
        </div>

        <footer className='flex h-10 shrink-0 items-center justify-end gap-3 border-t border-[#e4e8ee] bg-white px-4 text-[11px] text-slate-500'>
          <span>共 5655 条</span>
          <select className='h-7 rounded-sm border border-[#dbe2ea] bg-white px-2 outline-none'><option>100条/页</option><option>50条/页</option></select>
          <button aria-label='上一页' className='flex h-7 w-7 items-center justify-center text-slate-300' disabled><ChevronLeft className='h-3.5 w-3.5'/></button>
          {[1,2,3,4,5,6].map((page) => <button key={page} className={'h-7 min-w-7 px-2 ' + (page === 1 ? 'font-semibold text-[#1677d2]' : 'text-slate-600 hover:text-blue-600')}>{page}</button>)}
          <span>...</span><button className='h-7 min-w-7 px-2 hover:text-blue-600'>57</button>
          <button aria-label='下一页' className='flex h-7 w-7 items-center justify-center hover:text-blue-600'><ChevronRight className='h-3.5 w-3.5'/></button>
          <span>前往</span><input defaultValue='1' className='h-7 w-10 rounded-sm border border-[#dbe2ea] text-center outline-none focus:border-blue-500'/><span>页</span>
        </footer>
      </section>

      {createOpen && <div className='fixed inset-0 z-50 bg-slate-950/45' onMouseDown={(event) => event.target === event.currentTarget && closeCustomerDrawer()}>
        <aside className='absolute inset-y-0 right-0 flex w-[min(940px,78vw)] min-w-[720px] flex-col bg-white shadow-2xl'>
          <header className='flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-4'>
            <h3 className='flex items-center gap-2 text-sm font-semibold text-slate-900'><span className='h-5 w-1 rounded bg-slate-800'/>{drawerTitle}</h3>
            <div className='flex items-center gap-2'>{!drawerReadonly && <button onClick={saveCustomer} className={primaryButton + ' min-w-[54px]'}>保存</button>}<button onClick={closeCustomerDrawer} className={plainButton + ' min-w-[54px]'}>{drawerReadonly ? '关闭' : '取消'}</button><button onClick={closeCustomerDrawer} className='ml-1 text-slate-400 hover:text-slate-700'><X className='h-4 w-4'/></button></div>
          </header>
          <div className='min-h-0 flex-1 overflow-y-auto bg-white'>
            <fieldset disabled={drawerReadonly} className='contents'>
            <DrawerSection title='基础信息'>
              <div className='grid grid-cols-2 gap-x-7 gap-y-3'>
                <ModalField label='客户名称' required><input autoFocus value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder='请输入' className={inputClass}/></ModalField>
                <ModalField label='客户等级' required><select value={draft.level} onChange={(event) => setDraft((current) => ({ ...current, level: event.target.value }))} className={inputClass}><option value=''>请选择</option><option>vip</option><option>普通客户</option><option>基础价格</option></select></ModalField>
                <ModalField label='外部结算方式' required><select value={draft.externalSettlement} onChange={(event) => setDraft((current) => ({ ...current, externalSettlement: event.target.value }))} className={inputClass}><option value=''>请选择</option><option>现结</option><option>周结</option><option>半月结</option><option>月结15天</option></select></ModalField>
                <ModalField label='内部结算方式' required><select value={draft.internalSettlement} onChange={(event) => setDraft((current) => ({ ...current, internalSettlement: event.target.value }))} className={inputClass}><option value=''>请选择</option><option>现结</option><option>周结</option><option>半月结</option><option>月结10天</option></select></ModalField>
                <ModalField label='销售代表' required><select value={draft.salesRep} onChange={(event) => setDraft((current) => ({ ...current, salesRep: event.target.value }))} className={inputClass}><option value=''>请选择</option>{[...salesNames, ...intendedSalesNames].map((item) => <option key={item}>{item}</option>)}</select></ModalField>
                <ModalField label='财务代表' required><select value={draft.financeRep} onChange={(event) => setDraft((current) => ({ ...current, financeRep: event.target.value }))} className={inputClass}><option value=''>请选择</option>{financeNames.map((item) => <option key={item}>{item}</option>)}</select></ModalField>
                <ModalField label='跟单代表' required><select value={draft.merchandiser} onChange={(event) => setDraft((current) => ({ ...current, merchandiser: event.target.value }))} className={inputClass}><option value=''>请选择</option><option>天睿</option><option>天全</option><option>天旺</option><option>天朗</option></select></ModalField>
                <ModalField label='所属公司' required><select value={draft.company} onChange={(event) => setDraft((current) => ({ ...current, company: event.target.value }))} className={inputClass}><option value=''>请选择</option>{companies.map((item) => <option key={item}>{item}</option>)}</select></ModalField>
                <ModalField label='登录账号'><input value={draft.loginAccount} onChange={(event) => setDraft((current) => ({ ...current, loginAccount: event.target.value }))} placeholder='请输入' className={inputClass}/></ModalField>
                <ModalField label='信用额度'><div className='flex h-7 overflow-hidden rounded-sm border border-[#dce3ec]'><button onClick={() => setDraft((current) => ({ ...current, creditLimit: String(Math.max(0, Number(current.creditLimit) - 1000)) }))} className='w-8 border-r text-slate-400 hover:bg-slate-50'>−</button><input value={draft.creditLimit} onChange={(event) => setDraft((current) => ({ ...current, creditLimit: event.target.value }))} className='min-w-0 flex-1 text-center text-[11px] outline-none'/><button onClick={() => setDraft((current) => ({ ...current, creditLimit: String((Number(current.creditLimit) || 0) + 1000) }))} className='w-8 border-l text-slate-400 hover:bg-slate-50'>＋</button></div></ModalField>
                <ModalField label='省/市/区'><div className='grid grid-cols-3 gap-1'><select value={draft.province} onChange={(event) => setDraft((current) => ({ ...current, province: event.target.value }))} className={inputClass}><option value=''>省</option><option>广东省</option><option>浙江省</option><option>上海市</option></select><select value={draft.city} onChange={(event) => setDraft((current) => ({ ...current, city: event.target.value }))} className={inputClass}><option value=''>市</option><option>深圳市</option><option>广州市</option><option>义乌市</option></select><select value={draft.district} onChange={(event) => setDraft((current) => ({ ...current, district: event.target.value }))} className={inputClass}><option value=''>区</option><option>南山区</option><option>龙岗区</option><option>天河区</option></select></div></ModalField>
                <ModalField label='备注'><textarea value={draft.remark} onChange={(event) => setDraft((current) => ({ ...current, remark: event.target.value }))} placeholder='请输入' className={inputClass + ' h-12 resize-none py-2'}/></ModalField>
                <ModalField label='详细地址' required><textarea value={draft.address} onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))} placeholder='请输入' className={inputClass + ' h-12 resize-none py-2'}/></ModalField>
                <ModalField label='逾期锁单' required><div className='flex h-7 items-center gap-5'><label className='flex items-center gap-1.5'><input type='radio' checked={draft.overdueEnabled === '启用'} onChange={() => setDraft((current) => ({ ...current, overdueEnabled: '启用' }))}/>启用</label><label className='flex items-center gap-1.5'><input type='radio' checked={draft.overdueEnabled === '停用'} onChange={() => setDraft((current) => ({ ...current, overdueEnabled: '停用' }))}/>停用</label></div></ModalField>
                <ModalField label='机器人催款' required><select value={draft.robotCollection} onChange={(event) => setDraft((current) => ({ ...current, robotCollection: event.target.value }))} className={inputClass}><option>开启</option><option>关闭</option></select></ModalField>
                <ModalField label='推单类型' required><select value={draft.recommendationType} onChange={(event) => setDraft((current) => ({ ...current, recommendationType: event.target.value }))} className={inputClass}><option>全量推单</option><option>按需推单</option><option>关闭推单</option></select></ModalField>
                <ModalField label='计费时间节点' required><select value={draft.billingNode} onChange={(event) => setDraft((current) => ({ ...current, billingNode: event.target.value }))} className={inputClass}><option value=''>请选择</option><option>下单时间</option><option>收货时间</option><option>出库时间</option></select></ModalField>
                <ModalField label='签订合同' required><select value={draft.contractStatus} onChange={(event) => setDraft((current) => ({ ...current, contractStatus: event.target.value }))} className={inputClass}><option>未签订</option><option>已签订</option></select></ModalField>
              </div>
            </DrawerSection>
            <DrawerSection title='认证资料' note='所有资料均为必填'>
              <div className='grid grid-cols-2 gap-x-7 gap-y-3'>
                <ModalField label='公司名' required><input value={draft.legalName} onChange={(event) => setDraft((current) => ({ ...current, legalName: event.target.value }))} placeholder='请输入' className={inputClass}/></ModalField>
                <ModalField label='统一社会信用代码' required><input value={draft.unifiedSocialCreditCode} onChange={(event) => setDraft((current) => ({ ...current, unifiedSocialCreditCode: event.target.value }))} placeholder='请输入' className={inputClass}/></ModalField>
                <ModalField label='公司法人'><input value={draft.legalRepresentative} onChange={(event) => setDraft((current) => ({ ...current, legalRepresentative: event.target.value }))} placeholder='请输入' className={inputClass}/></ModalField>
                <ModalField label='联系人电话'><input value={draft.contactPhone} onChange={(event) => setDraft((current) => ({ ...current, contactPhone: event.target.value }))} placeholder='请输入' className={inputClass}/></ModalField>
                <div className='col-span-2 grid grid-cols-[108px_minmax(0,1fr)] gap-2 text-[11px]'><span className='pt-2 text-right text-slate-600'><b className='mr-1 text-red-500'>*</b>营业执照：</span><div><label className='flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-blue-400 hover:text-blue-600'><ImagePlus className='mb-2 h-6 w-6'/><span>{licenseName || '点击上传'}</span><input type='file' accept='image/jpeg,image/png' className='hidden' onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 5 * 1024 * 1024) return addToast('营业执照文件不能超过 5M', 'warning'); setLicenseName(file.name); }}/></label><p className='mt-2 text-[10px] text-slate-400'>支持 JPG/PNG 格式，文件大小不超过 5M</p></div></div>
                <ModalField label='安速子域名'><input value={draft.transportDomain} onChange={(event) => setDraft((current) => ({ ...current, transportDomain: event.target.value }))} placeholder='请输入' className={inputClass}/></ModalField>
              </div>
            </DrawerSection>
            <DrawerSection title='联系信息'>
              <div className='mb-2 flex justify-end'><button onClick={() => setContacts((current) => [...current, { id: Date.now(), name: '', position: '', mobile: '', email: '', qq: '', wechat: '', address: '' }])} className={primaryButton}><Plus className='h-3.5 w-3.5'/>新建</button></div>
              <div className='overflow-x-auto border border-slate-200'><table className='w-full min-w-[790px] table-fixed text-[10px]'><thead className='bg-slate-50 text-slate-600'><tr>{['联系人','职务','手机号','邮箱','QQ','微信号','详细地址','操作'].map((head) => <th key={head} className='border-r border-slate-200 px-2 py-2 font-medium last:border-r-0'>{head}</th>)}</tr></thead><tbody>{contacts.map((contact) => <tr key={contact.id}>{(['name','position','mobile','email','qq','wechat','address'] as const).map((field) => <td key={field} className='border-r border-t border-slate-200 p-1'><input value={contact[field]} onChange={(event) => updateContact(contact.id, field, event.target.value)} className='h-7 w-full px-1.5 outline-none focus:bg-blue-50'/></td>)}<td className='border-t border-slate-200 text-center'><button onClick={() => setContacts((current) => current.filter((item) => item.id !== contact.id))} className='text-red-500 hover:text-red-700'><Trash2 className='h-3.5 w-3.5'/></button></td></tr>)}{!contacts.length && <tr><td colSpan={8} className='h-24 text-center text-slate-400'>暂无数据</td></tr>}</tbody></table></div>
            </DrawerSection>
            <DrawerSection title='对接信息'>
              <div className='grid grid-cols-2 gap-x-7 gap-y-3'><ModalField label='对接系统'><select value={draft.integrationSystem} onChange={(event) => setDraft((current) => ({ ...current, integrationSystem: event.target.value }))} className={inputClass}><option value=''>请选择</option><option>API 接口</option><option>客户 ERP</option><option>电商平台</option></select></ModalField><ModalField label='对接账号'><input value={draft.integrationAccount} onChange={(event) => setDraft((current) => ({ ...current, integrationAccount: event.target.value }))} placeholder='请输入' className={inputClass}/></ModalField><div className='col-span-2'><ModalField label='对接备注'><textarea value={draft.integrationNote} onChange={(event) => setDraft((current) => ({ ...current, integrationNote: event.target.value }))} placeholder='请输入' className={inputClass + ' h-14 resize-none py-2'}/></ModalField></div></div>
            </DrawerSection>
            </fieldset>
            {drawerMode !== 'create' && <DrawerSection title='询价记录'>
              <div className='space-y-3'>
                <div className='rounded-sm bg-slate-50 px-3 py-2 text-[11px]'>
                  <b className='text-slate-700'>{activeCustomer?.name || draft.name}</b>
                  <span className='ml-2 font-mono text-slate-400'>{activeCustomer?.code || draft.code}</span>
                </div>
                {drawerMode === 'edit' && <div className='flex items-center gap-2 rounded-sm border border-blue-100 bg-blue-50/60 p-3'>
                  <input value={manualInquiryNo} onChange={(event) => setManualInquiryNo(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addManualInquiryRecord()} className={inputClass + ' flex-1 bg-white'} placeholder='请输入询价单号'/>
                  <button onClick={addManualInquiryRecord} className={primaryButton}><Plus className='h-3.5 w-3.5'/>加入当前客户</button>
                </div>}
                <div className='overflow-hidden rounded-sm border border-slate-200'>
                  <table className='w-full table-fixed text-left text-[11px]'>
                    <thead className='bg-slate-50 text-slate-500'>
                      <tr>{['询价号','询价人','询价时间'].map((heading) => <th key={heading} className='border-b border-slate-200 px-3 py-2 font-medium'>{heading}</th>)}</tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                      {inquiryItems.map((item) => <tr key={item.inquiryNo}><td className='px-3 py-2 font-mono text-blue-600'>{item.inquiryNo}</td><td className='px-3 py-2 text-slate-700'>{item.inquirer}</td><td className='px-3 py-2 text-slate-500'>{item.inquiryTime}</td></tr>)}
                      {!inquiryItems.length && <tr><td colSpan={3} className='py-10 text-center text-xs text-slate-400'>暂无询价记录</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </DrawerSection>}
          </div>
        </aside>
      </div>}
    </div>
  );
}
