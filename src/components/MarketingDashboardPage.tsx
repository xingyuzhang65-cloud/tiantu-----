import React, { useMemo, useState } from 'react';
import {
  AlertTriangle, BarChart3, Building2, ChevronRight, Clock3, Download,
  Filter, PackageCheck, RefreshCw, Search, Settings2, Ship, Target,
  TrendingDown, TrendingUp, UserPlus, Users, Warehouse,
} from 'lucide-react';

interface Props { addToast: (text: string, type?: 'success' | 'info' | 'warning') => void; }
type DashboardTab = '经营总览' | '组织业绩' | '客户分析' | '维度分析' | '数据明细' | '口径与权限';

const tabs: DashboardTab[] = ['经营总览', '组织业绩', '客户分析', '维度分析', '数据明细', '口径与权限'];
const trend = [720, 810, 760, 920, 1040, 980, 1160, 1240, 1180, 1360, 1480, 1570];
const previousTrend = [680, 720, 740, 790, 860, 900, 940, 1010, 1060, 1130, 1210, 1290];
const teams = [
  { name: '美线一部', volume: 2860, ratio: 92, change: 18.6 },
  { name: '欧洲业务部', volume: 2410, ratio: 78, change: 12.3 },
  { name: '广州销售七部', volume: 2086, ratio: 67, change: 8.9 },
  { name: '义乌销售八部', volume: 1760, ratio: 57, change: -3.2 },
  { name: '福州销售十九部', volume: 1426, ratio: 46, change: 6.8 },
];
const customers = [
  { name: '深圳星链家居出口部', owner: '天朗', volume: 486, change: 24.8, lastDate: '2026-07-20', status: '重点客户' },
  { name: '常景供应链集团', owner: '天意', volume: 428, change: 15.2, lastDate: '2026-07-19', status: '正常走货' },
  { name: '上海豪迅美中快递中心', owner: '天杰', volume: 372, change: -26.4, lastDate: '2026-07-15', status: '货量下滑' },
  { name: '英国海航直运有限公司', owner: '天枚', volume: 316, change: 8.5, lastDate: '2026-07-18', status: '正常走货' },
  { name: '广州中维国际', owner: '天旺', volume: 0, change: -100, lastDate: '2026-04-12', status: '沉默客户' },
];
const details = [
  ['HD2607201063', '深圳星链家居出口部', '天朗', '美线一部', '美国', '美森快船', '塘厦仓', '2026-07-20 15:42', '32.86', '计入'],
  ['HD2607201099', '常景供应链集团', '天意', '广州销售七部', '美国', '空派专线', '广州仓', '2026-07-20 14:15', '18.42', '计入'],
  ['HD2607192231', '上海豪迅美中快递中心', '天杰', '欧洲业务部', '英国', '英线海卡', '义乌仓', '2026-07-19 13:02', '26.31', '计入'],
  ['HD2607193345', '广州中维国际', '天旺', '义乌销售八部', '美国', '海外仓出库', '洛杉矶仓', '2026-07-19 11:24', '12.08', '排除·重复'],
  ['HD2607184412', '英国海航直运有限公司', '天枚', '福州销售十九部', '加拿大', '海派专线', '塘厦仓', '2026-07-18 09:12', '21.64', '计入'],
];

const kpis = [
  { label: '实际方数', value: '12,846.32', unit: 'm³', change: '+8.7%', direction: 'up', icon: PackageCheck, tone: 'blue' },
  { label: '实际票数', value: '2,438', unit: '票', change: '+5.2%', direction: 'up', icon: Ship, tone: 'cyan' },
  { label: '走货客户数', value: '526', unit: '家', change: '+3.8%', direction: 'up', icon: Users, tone: 'violet' },
  { label: '首单新客数', value: '48', unit: '家', change: '+14.3%', direction: 'up', icon: UserPlus, tone: 'emerald' },
  { label: '新客方数', value: '736.58', unit: 'm³', change: '+11.6%', direction: 'up', icon: Target, tone: 'amber' },
  { label: '沉默客户数', value: '63', unit: '家', change: '+6', direction: 'down', icon: Clock3, tone: 'rose' },
  { label: '同比增长率', value: '22.4', unit: '%', change: '去年同期', direction: 'up', icon: TrendingUp, tone: 'blue' },
  { label: '环比增长率', value: '8.7', unit: '%', change: '上一周期', direction: 'up', icon: BarChart3, tone: 'cyan' },
];

function PanelTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className='flex items-center justify-between border-b border-slate-100 px-4 py-3'><div><h3 className='text-sm font-semibold text-slate-800'>{title}</h3>{subtitle && <p className='mt-0.5 text-[10px] text-slate-400'>{subtitle}</p>}</div>{action}</div>;
}

function KpiCard({ item, onClick }: { key?: string; item: typeof kpis[number]; onClick: () => void }) {
  const Icon = item.icon; const positive = item.direction === 'up';
  const tones: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', cyan: 'bg-cyan-50 text-cyan-600', violet: 'bg-violet-50 text-violet-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', rose: 'bg-rose-50 text-rose-600' };
  return <button onClick={onClick} className='group rounded-lg border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md'>
    <div className='flex items-start justify-between'><div><p className='text-[11px] font-medium text-slate-500'>{item.label}</p><div className='mt-2 flex items-end gap-1.5'><strong className='text-[22px] font-semibold leading-none tracking-tight text-slate-900'>{item.value}</strong><span className='text-[10px] text-slate-400'>{item.unit}</span></div></div><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[item.tone]}`}><Icon className='h-4 w-4'/></span></div>
    <div className='mt-3 flex items-center gap-1 text-[10px]'><span className={`flex items-center gap-0.5 font-medium ${positive ? 'text-emerald-600' : 'text-rose-500'}`}>{positive ? <TrendingUp className='h-3 w-3'/> : <TrendingDown className='h-3 w-3'/>}{item.change}</span><span className='text-slate-400'>{item.change.includes('%') ? '较上一周期' : ''}</span></div>
  </button>;
}

function TrendChart({ comparison }: { comparison: string }) {
  const max = 1700; const width = 700; const height = 170; const padX = 28; const padY = 14;
  const points = trend.map((value, index) => `${padX + index * ((width - padX * 2) / (trend.length - 1))},${height - padY - value / max * (height - padY * 2)}`).join(' ');
  const previous = previousTrend.map((value, index) => `${padX + index * ((width - padX * 2) / (previousTrend.length - 1))},${height - padY - value / max * (height - padY * 2)}`).join(' ');
  const area = `M ${points.split(' ').join(' L ')} L ${width - padX},${height - padY} L ${padX},${height - padY} Z`;
  return <div className='px-4 pb-3 pt-2'><svg className='h-[180px] w-full' viewBox={`0 0 ${width} 195`} role='img' aria-label='本月实际方数趋势及对比曲线'>
    <defs><linearGradient id='marketingTrendArea' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stopColor='#2563eb' stopOpacity='0.22'/><stop offset='100%' stopColor='#2563eb' stopOpacity='0.01'/></linearGradient></defs>
    {[0, 400, 800, 1200, 1600].map((tick) => { const y = height - padY - tick / max * (height - padY * 2); return <g key={tick}><line x1={padX} x2={width - padX} y1={y} y2={y} stroke='#e8edf4' strokeWidth='1'/><text x='2' y={y + 3} fill='#94a3b8' fontSize='9'>{tick}</text></g>; })}
    <path d={area} fill='url(#marketingTrendArea)'/><polyline points={points} fill='none' stroke='#2563eb' strokeWidth='2.5' strokeLinejoin='round' strokeLinecap='round'/>
    {comparison !== '无对比' && <polyline points={previous} fill='none' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='5 4' strokeLinejoin='round'/>}
    {trend.map((value, index) => { const x = padX + index * ((width - padX * 2) / (trend.length - 1)); const y = height - padY - value / max * (height - padY * 2); return <circle key={index} cx={x} cy={y} r='2.8' fill='white' stroke='#2563eb' strokeWidth='2'><title>{`7月${index * 2 + 1}日：${value} m³`}</title></circle>; })}
    {[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23].map((day, index) => <text key={day} x={padX + index * ((width - padX * 2) / 11)} y='190' textAnchor='middle' fill='#94a3b8' fontSize='9'>{`7/${String(day).padStart(2, '0')}`}</text>)}
  </svg></div>;
}

export default function MarketingDashboardPage({ addToast }: Props) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('经营总览');
  const [period, setPeriod] = useState('本月'); const [comparison, setComparison] = useState('环比');
  const [businessLine, setBusinessLine] = useState('全部业务线'); const [region, setRegion] = useState('全部区域');
  const [channel, setChannel] = useState('全部渠道'); const [organization, setOrganization] = useState('全部组织');
  const [warehouseFilter, setWarehouseFilter] = useState('全部仓库'); const [customerState, setCustomerState] = useState('全部客户状态');
  const [documentType, setDocumentType] = useState('全部单据'); const [caliber, setCaliber] = useState('口径 V1.3');
  const [granularity, setGranularity] = useState('日'); const [dimension, setDimension] = useState('国家/区域');
  const filterSummary = useMemo(() => [period, businessLine, region, channel, warehouseFilter, organization, customerState].filter((item) => !item.startsWith('全部')).join(' · ') || '本月 · 全部授权数据', [period, businessLine, region, channel, warehouseFilter, organization, customerState]);
  const selectClass = 'h-8 rounded border border-slate-200 bg-white px-2.5 text-[11px] text-slate-600 outline-none transition hover:border-blue-300 focus:border-blue-500';
  const resetFilters = () => { setPeriod('本月'); setComparison('环比'); setBusinessLine('全部业务线'); setRegion('全部区域'); setChannel('全部渠道'); setWarehouseFilter('全部仓库'); setOrganization('全部组织'); setCustomerState('全部客户状态'); setDocumentType('全部单据'); setCaliber('口径 V1.3'); addToast('全局筛选已重置', 'info'); };

  return <div className='flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f3f6fa] text-slate-700'>
    <div className='flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4'>
      <div className='flex h-full items-center gap-5'><div className='flex items-center gap-2'><span className='flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-white'><BarChart3 className='h-4 w-4'/></span><span className='text-sm font-semibold text-slate-800'>营销数据看板</span></div>
        <nav className='flex h-full items-end gap-1'>{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`relative h-9 px-3 text-xs transition ${activeTab === tab ? 'font-semibold text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>{tab}{activeTab === tab && <span className='absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600'/>}</button>)}</nav>
      </div>
      <div className='flex items-center gap-3 text-[10px] text-slate-400'><span className='flex items-center gap-1'><Clock3 className='h-3.5 w-3.5'/>数据更新：2026-07-21 08:00</span><button onClick={() => addToast('数据刷新任务已提交', 'success')} className='flex items-center gap-1 text-blue-600 hover:underline'><RefreshCw className='h-3.5 w-3.5'/>刷新</button><button onClick={() => addToast(`正在按当前筛选导出${activeTab}`, 'success')} className='flex h-7 items-center gap-1 rounded bg-blue-600 px-3 text-white hover:bg-blue-700'><Download className='h-3.5 w-3.5'/>导出</button></div>
    </div>

    <div className='shrink-0 border-b border-slate-200 bg-white px-4 py-2.5'>
      <div className='flex flex-wrap items-center gap-2'><span className='mr-1 flex items-center gap-1 text-[11px] font-medium text-slate-600'><Filter className='h-3.5 w-3.5 text-blue-500'/>全局筛选</span>
        <select value={period} onChange={(event) => setPeriod(event.target.value)} className={selectClass}><option>本周</option><option>上周</option><option>本月</option><option>上月</option><option>本季度</option><option>本年</option><option>自定义日期</option></select>
        <select value={comparison} onChange={(event) => setComparison(event.target.value)} className={selectClass}><option>无对比</option><option>同比</option><option>环比</option></select>
        <select value={businessLine} onChange={(event) => setBusinessLine(event.target.value)} className={selectClass}><option>全部业务线</option><option>美线</option><option>欧线</option><option>加拿大线</option></select>
        <select value={region} onChange={(event) => setRegion(event.target.value)} className={selectClass}><option>全部区域</option><option>美国</option><option>英国</option><option>加拿大</option><option>欧洲</option></select>
        <select value={channel} onChange={(event) => setChannel(event.target.value)} className={selectClass}><option>全部渠道</option><option>美森快船</option><option>空派专线</option><option>海派专线</option><option>海外仓出库</option></select>
        <select value={warehouseFilter} onChange={(event) => setWarehouseFilter(event.target.value)} className={selectClass}><option>全部仓库</option><option>塘厦仓</option><option>广州仓</option><option>义乌仓</option><option>洛杉矶仓</option></select>
        <select value={organization} onChange={(event) => setOrganization(event.target.value)} className={selectClass}><option>全部组织</option><option>美线一部</option><option>欧洲业务部</option><option>广州销售七部</option><option>义乌销售八部</option></select>
        <select value={customerState} onChange={(event) => setCustomerState(event.target.value)} className={selectClass}><option>全部客户状态</option><option>首单新客</option><option>正常走货</option><option>沉默客户</option><option>唤醒客户</option><option>货量下滑</option></select>
        <select value={documentType} onChange={(event) => setDocumentType(event.target.value)} className={selectClass}><option>全部单据</option><option>运单</option><option>海外暂存单</option><option>海外中转单</option><option>海外仓出库单</option></select>
        <select value={caliber} onChange={(event) => setCaliber(event.target.value)} className={selectClass}><option>口径 V1.3</option><option>口径 V1.2</option></select>
        <button onClick={resetFilters} className='h-8 rounded border border-slate-200 px-3 text-[11px] text-slate-500 hover:bg-slate-50'>重置</button>
        <span className='ml-auto rounded bg-blue-50 px-2.5 py-1 text-[10px] text-blue-600'>当前：{filterSummary}</span>
      </div>
    </div>

    <main className='min-h-0 flex-1 overflow-y-auto p-3'>
      {activeTab === '经营总览' && <div className='space-y-3'>
        <section className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          {kpis.map((item) => <KpiCard key={item.label} item={item} onClick={() => addToast(`已按「${item.label}」下钻到明细`, 'info')}/>) }
        </section>

        <section className='grid gap-3 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]'>
          <div className='rounded-lg border border-slate-200 bg-white shadow-sm'>
            <PanelTitle title='实际方数趋势' subtitle={`统计周期：${period} · 单位：m³`} action={<div className='flex items-center gap-2'><div className='flex rounded border border-slate-200 p-0.5'>{['日', '周', '月'].map((item) => <button key={item} onClick={() => setGranularity(item)} className={`rounded px-2 py-1 text-[10px] ${granularity === item ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{item}</button>)}</div><span className='flex items-center gap-1 text-[10px] text-slate-400'><i className='h-0.5 w-4 bg-blue-600'/>本期</span>{comparison !== '无对比' && <span className='flex items-center gap-1 text-[10px] text-slate-400'><i className='h-0 w-4 border-t border-dashed border-slate-400'/>{comparison}</span>}</div>}/>
            <TrendChart comparison={comparison}/>
          </div>

          <div className='rounded-lg border border-slate-200 bg-white shadow-sm'>
            <PanelTitle title='团队业绩排名' subtitle='按实际方数降序 · 点击查看组织业绩' action={<button onClick={() => setActiveTab('组织业绩')} className='flex items-center text-[10px] text-blue-600 hover:underline'>全部团队<ChevronRight className='h-3 w-3'/></button>}/>
            <div className='space-y-3.5 p-4'>
              {teams.map((team, index) => <button key={team.name} onClick={() => { setOrganization(team.name); setActiveTab('组织业绩'); }} className='block w-full text-left'>
                <div className='mb-1.5 flex items-center justify-between text-[11px]'><span className='flex min-w-0 items-center gap-2'><b className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] ${index < 3 ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{index + 1}</b><span className='truncate text-slate-700'>{team.name}</span></span><span className='ml-3 shrink-0 font-medium text-slate-800'>{team.volume.toLocaleString()} <em className='not-italic text-slate-400'>m³</em></span></div>
                <div className='flex items-center gap-2'><div className='h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100'><div className='h-full rounded-full bg-blue-500' style={{ width: `${team.ratio}%` }}/></div><span className={`w-11 text-right text-[10px] ${team.change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{team.change >= 0 ? '+' : ''}{team.change}%</span></div>
              </button>)}
            </div>
          </div>
        </section>

        <section className='grid gap-3 xl:grid-cols-3'>
          <div className='rounded-lg border border-slate-200 bg-white shadow-sm'>
            <PanelTitle title='国家 / 区域构成' subtitle='实际方数占比'/>
            <div className='flex items-center gap-5 p-4'>
              <div className='relative h-28 w-28 shrink-0 rounded-full' style={{ background: 'conic-gradient(#2563eb 0 56%, #38bdf8 56% 73%, #8b5cf6 73% 86%, #cbd5e1 86% 100%)' }}><div className='absolute inset-[17px] flex flex-col items-center justify-center rounded-full bg-white'><b className='text-base text-slate-800'>12,846</b><span className='text-[9px] text-slate-400'>总方数 m³</span></div></div>
              <div className='min-w-0 flex-1 space-y-2.5'>{[['美国', '56%', 'bg-blue-600'], ['英国', '17%', 'bg-sky-400'], ['加拿大', '13%', 'bg-violet-500'], ['其他', '14%', 'bg-slate-300']].map((row) => <div key={row[0]} className='flex items-center justify-between text-[11px]'><span className='flex items-center gap-2 text-slate-600'><i className={`h-2 w-2 rounded-sm ${row[2]}`}/>{row[0]}</span><b className='font-medium text-slate-800'>{row[1]}</b></div>)}</div>
            </div>
          </div>

          <div className='rounded-lg border border-slate-200 bg-white shadow-sm'>
            <PanelTitle title='仓库贡献排名' subtitle='按实际方数统计'/>
            <div className='space-y-3 p-4'>{[['塘厦仓', 3580, 88], ['广州仓', 2926, 72], ['义乌仓', 2540, 62], ['洛杉矶仓', 1860, 46], ['深圳仓', 1340, 33]].map((row, index) => <div key={String(row[0])}><div className='mb-1 flex items-center justify-between text-[10px]'><span className='text-slate-600'>{index + 1}. {row[0]}</span><b className='font-medium text-slate-800'>{Number(row[1]).toLocaleString()} m³</b></div><div className='h-1.5 overflow-hidden rounded-full bg-slate-100'><div className='h-full rounded-full bg-cyan-500' style={{ width: `${row[2]}%` }}/></div></div>)}</div>
          </div>

          <div className='rounded-lg border border-slate-200 bg-white shadow-sm'>
            <PanelTitle title='经营预警' subtitle='规则触发 · 截止今日' action={<span className='rounded bg-rose-50 px-2 py-1 text-[10px] text-rose-500'>共 11 项</span>}/>
            <div className='divide-y divide-slate-100 px-4'>{[
              { title: '90 天沉默客户', text: '广州中维国际等 6 家客户', tag: '高', tone: 'bg-rose-50 text-rose-600' },
              { title: '货量环比下降超过 20%', text: '上海豪迅美中快递中心等 4 家', tag: '中', tone: 'bg-amber-50 text-amber-600' },
              { title: '重点客户排名显著变化', text: '常景供应链集团上升 8 位', tag: '低', tone: 'bg-blue-50 text-blue-600' },
            ].map((alert) => <button key={alert.title} onClick={() => setActiveTab('客户分析')} className='flex w-full items-center gap-3 py-3 text-left'><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${alert.tone}`}><AlertTriangle className='h-4 w-4'/></span><span className='min-w-0 flex-1'><b className='block text-[11px] font-medium text-slate-700'>{alert.title}</b><span className='mt-0.5 block truncate text-[10px] text-slate-400'>{alert.text}</span></span><span className={`rounded px-1.5 py-0.5 text-[9px] ${alert.tone}`}>{alert.tag}</span><ChevronRight className='h-3.5 w-3.5 text-slate-300'/></button>)}</div>
          </div>
        </section>
      </div>}

      {activeTab === '组织业绩' && <div className='grid gap-3 xl:grid-cols-[230px_minmax(0,1fr)]'>
        <aside className='rounded-lg border border-slate-200 bg-white shadow-sm'>
          <PanelTitle title='组织范围' subtitle='按当前组织归属快照统计'/>
          <div className='p-3'><div className='mb-3 flex rounded border border-slate-200 p-0.5'><button className='flex-1 rounded bg-blue-600 py-1.5 text-[10px] text-white'>业绩团队</button><button onClick={() => addToast('已切换为当前管理组织视角', 'info')} className='flex-1 rounded py-1.5 text-[10px] text-slate-500'>管理组织</button></div>
            <div className='space-y-1 text-[11px]'><button onClick={() => setOrganization('全部组织')} className={`flex w-full items-center gap-2 rounded px-2 py-2 text-left ${organization === '全部组织' ? 'bg-blue-50 font-medium text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}><Building2 className='h-3.5 w-3.5'/>天图通逊</button>{teams.map((team) => <button key={team.name} onClick={() => setOrganization(team.name)} className={`ml-3 flex w-[calc(100%-12px)] items-center justify-between rounded px-2 py-2 text-left ${organization === team.name ? 'bg-blue-50 font-medium text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}><span>{team.name}</span><ChevronRight className='h-3 w-3'/></button>)}</div>
          </div>
        </aside>
        <section className='space-y-3'>
          <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>{[['实际方数', '12,846.32 m³', '+8.7%'], ['实际票数', '2,438 票', '+5.2%'], ['走货客户', '526 家', '+3.8%'], ['人均方数', '312.46 m³', '+9.3%']].map((item) => <div key={item[0]} className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'><p className='text-[10px] text-slate-500'>{item[0]}</p><div className='mt-2 text-lg font-semibold text-slate-900'>{item[1]}</div><p className='mt-2 text-[10px] text-emerald-600'>{item[2]} <span className='text-slate-400'>较上一周期</span></p></div>)}</div>
          <div className='overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm'><PanelTitle title={organization === '全部组织' ? '组织业绩明细' : `${organization} · 业绩明细`} subtitle='点击团队可继续下钻至销售人员'/><div className='overflow-x-auto'><table className='w-full min-w-[820px] text-left text-[11px]'><thead className='bg-slate-50 text-slate-500'><tr>{['排名', '组织 / 团队', '实际方数(m³)', '实际票数', '走货客户', '首单新客', '同比', '环比', '贡献占比'].map((head) => <th key={head} className='whitespace-nowrap px-4 py-2.5 font-medium'>{head}</th>)}</tr></thead><tbody className='divide-y divide-slate-100'>{teams.map((team, index) => <tr key={team.name} className='cursor-pointer hover:bg-blue-50/40' onClick={() => addToast(`已下钻查看 ${team.name} 销售人员明细`, 'info')}><td className='px-4 py-3 text-slate-400'>{index + 1}</td><td className='px-4 py-3 font-medium text-blue-600'>{team.name}</td><td className='px-4 py-3 font-medium text-slate-800'>{team.volume.toLocaleString()}</td><td className='px-4 py-3'>{[548, 466, 412, 336, 286][index]}</td><td className='px-4 py-3'>{[118, 96, 84, 72, 63][index]}</td><td className='px-4 py-3'>{[12, 9, 8, 6, 5][index]}</td><td className='px-4 py-3 text-emerald-600'>+{[22.6, 18.2, 13.4, 5.1, 8.6][index]}%</td><td className={`px-4 py-3 ${team.change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{team.change >= 0 ? '+' : ''}{team.change}%</td><td className='px-4 py-3'><div className='flex items-center gap-2'><div className='h-1.5 w-16 rounded-full bg-slate-100'><div className='h-full rounded-full bg-blue-500' style={{ width: `${team.ratio}%` }}/></div>{Math.round(team.volume / 12846 * 100)}%</div></td></tr>)}</tbody></table></div></div>
        </section>
      </div>}

      {activeTab === '客户分析' && <div className='space-y-3'>
        <section className='grid grid-cols-2 gap-3 lg:grid-cols-5'>{[
          ['首单新客', '48', '+6'], ['正常走货', '526', '+19'], ['沉默客户', '63', '+6'], ['唤醒客户', '17', '+4'], ['货量下滑', '42', '-8'],
        ].map((item, index) => <button key={item[0]} onClick={() => addToast(`已筛选客户分群：${item[0]}`, 'info')} className={`rounded-lg border bg-white p-4 text-left shadow-sm transition hover:border-blue-300 ${index === 2 || index === 4 ? 'border-rose-100' : 'border-slate-200'}`}><p className='text-[10px] text-slate-500'>{item[0]}</p><div className='mt-1.5 flex items-end justify-between'><b className='text-xl font-semibold text-slate-900'>{item[1]}<em className='ml-1 text-[10px] font-normal not-italic text-slate-400'>家</em></b><span className={`text-[10px] ${item[2].startsWith('-') ? 'text-emerald-600' : index === 2 ? 'text-rose-500' : 'text-emerald-600'}`}>{item[2]}</span></div></button>)}</section>
        <section className='grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]'>
          <div className='overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm'><PanelTitle title='客户经营列表' subtitle='支持按方数、变化率和最近走货时间排序' action={<div className='relative'><Search className='absolute left-2 top-1.5 h-3.5 w-3.5 text-slate-400'/><input className='h-7 w-44 rounded border border-slate-200 pl-7 pr-2 text-[10px] outline-none focus:border-blue-500' placeholder='搜索客户名称'/></div>}/><div className='overflow-x-auto'><table className='w-full min-w-[760px] text-left text-[11px]'><thead className='bg-slate-50 text-slate-500'><tr>{['客户名称', '归属销售', '实际方数(m³)', '环比变化', '最近走货', '客户状态', '操作'].map((head) => <th key={head} className='px-4 py-2.5 font-medium'>{head}</th>)}</tr></thead><tbody className='divide-y divide-slate-100'>{customers.map((customer) => <tr key={customer.name} className='hover:bg-slate-50'><td className='px-4 py-3 font-medium text-slate-800'>{customer.name}</td><td className='px-4 py-3'>{customer.owner}</td><td className='px-4 py-3 font-medium'>{customer.volume}</td><td className={`px-4 py-3 ${customer.change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{customer.change >= 0 ? '+' : ''}{customer.change}%</td><td className='px-4 py-3 text-slate-500'>{customer.lastDate}</td><td className='px-4 py-3'><span className={`rounded px-2 py-1 text-[9px] ${customer.status === '沉默客户' || customer.status === '货量下滑' ? 'bg-rose-50 text-rose-600' : customer.status === '重点客户' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{customer.status}</span></td><td className='px-4 py-3'><button onClick={() => addToast(`已打开 ${customer.name} 的客户详情`, 'info')} className='text-blue-600 hover:underline'>查看详情</button></td></tr>)}</tbody></table></div></div>
          <div className='rounded-lg border border-slate-200 bg-white shadow-sm'><PanelTitle title='客户 Top 5' subtitle='按实际方数排名'/><div className='space-y-4 p-4'>{customers.map((customer, index) => <div key={customer.name}><div className='mb-1.5 flex items-center justify-between text-[10px]'><span className='max-w-[180px] truncate text-slate-600'>{index + 1}. {customer.name}</span><b className='text-slate-800'>{customer.volume} m³</b></div><div className='h-2 overflow-hidden rounded bg-slate-100'><div className='h-full rounded bg-violet-500' style={{ width: `${Math.max(4, customer.volume / 486 * 100)}%` }}/></div></div>)}</div></div>
        </section>
      </div>}

      {activeTab === '维度分析' && <div className='space-y-3'>
        <div className='flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm'><div><h3 className='text-sm font-semibold text-slate-800'>多维经营分析</h3><p className='mt-0.5 text-[10px] text-slate-400'>对比排名、贡献占比与周期变化</p></div><div className='flex rounded border border-slate-200 p-0.5'>{['国家/区域', '渠道/服务', '仓库'].map((item) => <button key={item} onClick={() => setDimension(item)} className={`rounded px-3 py-1.5 text-[10px] ${dimension === item ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{item}</button>)}</div></div>
        <div className='grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]'>
          <div className='rounded-lg border border-slate-200 bg-white shadow-sm'><PanelTitle title={`${dimension}方数排名`} subtitle='实际方数与贡献占比'/><div className='space-y-5 p-5'>{(dimension === '国家/区域' ? [['美国', 7194, 100], ['英国', 2184, 30], ['加拿大', 1670, 23], ['德国', 1034, 14], ['其他', 764, 11]] : dimension === '渠道/服务' ? [['美森快船', 3860, 100], ['空派专线', 2946, 76], ['海派专线', 2510, 65], ['海外仓出库', 1942, 50], ['其他渠道', 1588, 41]] : [['塘厦仓', 3580, 100], ['广州仓', 2926, 82], ['义乌仓', 2540, 71], ['洛杉矶仓', 1860, 52], ['深圳仓', 1340, 37]]).map((row, index) => <div key={String(row[0])} className='grid grid-cols-[120px_minmax(0,1fr)_100px] items-center gap-3 text-[11px]'><span className='truncate text-slate-600'>{index + 1}. {row[0]}</span><div className='h-5 overflow-hidden rounded bg-slate-100'><div className='flex h-full items-center justify-end rounded bg-blue-500 pr-2 text-[9px] text-white' style={{ width: `${row[2]}%` }}>{Math.round(Number(row[1]) / 12846 * 100)}%</div></div><b className='text-right font-medium text-slate-800'>{Number(row[1]).toLocaleString()} m³</b></div>)}</div></div>
          <div className='rounded-lg border border-slate-200 bg-white shadow-sm'><PanelTitle title='交叉分析' subtitle={`${dimension} × 业务线`}/><div className='overflow-x-auto p-4'><table className='w-full text-[10px]'><thead><tr className='text-slate-400'><th className='pb-3 text-left font-medium'>维度</th><th className='pb-3 text-right font-medium'>美线</th><th className='pb-3 text-right font-medium'>欧线</th><th className='pb-3 text-right font-medium'>加拿大线</th></tr></thead><tbody className='divide-y divide-slate-100'>{[['TOP 1', '4,860', '1,240', '860'], ['TOP 2', '2,940', '1,068', '542'], ['TOP 3', '1,680', '916', '468'], ['其他', '1,224', '752', '296']].map((row) => <tr key={row[0]}><td className='py-3 text-slate-600'>{row[0]}</td><td className='py-3 text-right font-medium text-blue-600'>{row[1]}</td><td className='py-3 text-right'>{row[2]}</td><td className='py-3 text-right'>{row[3]}</td></tr>)}</tbody></table></div><div className='mx-4 mb-4 rounded bg-slate-50 p-3 text-[10px] leading-5 text-slate-500'>当前维度中，美线贡献 <b className='text-slate-800'>68.4%</b>，环比提升 <b className='text-emerald-600'>3.2 个百分点</b>。</div></div>
        </div>
      </div>}

      {activeTab === '数据明细' && <div className='overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm'>
        <PanelTitle title='营销口径数据明细' subtitle='由根订单去重并按业务阶段归属 · 共 2,438 条' action={<div className='flex items-center gap-2'><div className='relative'><Search className='absolute left-2 top-1.5 h-3.5 w-3.5 text-slate-400'/><input className='h-7 w-48 rounded border border-slate-200 pl-7 pr-2 text-[10px] outline-none focus:border-blue-500' placeholder='订单 / 客户 / 销售'/></div><button onClick={() => addToast('已导出当前权限范围内的营销明细', 'success')} className='flex h-7 items-center gap-1 rounded bg-blue-600 px-3 text-[10px] text-white'><Download className='h-3.5 w-3.5'/>导出明细</button></div>}/>
        <div className='overflow-x-auto'><table className='w-full min-w-[1300px] text-left text-[10px]'><thead className='bg-slate-50 text-slate-500'><tr>{['根订单号', '来源订单号', '客户', '销售', '业绩团队', '国家', '渠道', '货站/仓库', '实际发生时间', '实际方数(m³)', '计入口径', '排除原因'].map((head) => <th key={head} className='whitespace-nowrap px-3 py-2.5 font-medium'>{head}</th>)}</tr></thead><tbody className='divide-y divide-slate-100'>{details.map((row) => <tr key={row[0]} className='hover:bg-slate-50'><td className='px-3 py-3 font-medium text-blue-600'>ROOT-{row[0]}</td><td className='px-3 py-3'>{row[0]}</td><td className='px-3 py-3'>{row[1]}</td><td className='px-3 py-3'>{row[2]}</td><td className='px-3 py-3'>{row[3]}</td><td className='px-3 py-3'>{row[4]}</td><td className='px-3 py-3'>{row[5]}</td><td className='px-3 py-3'>{row[6]}</td><td className='px-3 py-3 whitespace-nowrap'>{row[7]}</td><td className='px-3 py-3 font-medium'>{row[8]}</td><td className='px-3 py-3'><span className={`rounded px-2 py-1 ${row[9] === '计入' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{row[9] === '计入' ? '是' : '否'}</span></td><td className='px-3 py-3 text-rose-500'>{row[9] === '计入' ? '-' : row[9].replace('排除·', '')}</td></tr>)}</tbody></table></div>
        <div className='flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400'><span>显示 1-5 / 共 2,438 条</span><div className='flex gap-1'><button className='rounded border border-slate-200 px-2 py-1'>上一页</button><button className='rounded bg-blue-600 px-2.5 py-1 text-white'>1</button><button className='rounded border border-slate-200 px-2.5 py-1'>2</button><button className='rounded border border-slate-200 px-2 py-1'>下一页</button></div></div>
      </div>}

      {activeTab === '口径与权限' && <div className='space-y-3'>
        <section className='grid gap-3 lg:grid-cols-3'>
          {[{ icon: Settings2, title: '数据口径版本', value: 'V1.3', detail: '2026-07-01 生效 · 当前使用中' }, { icon: Clock3, title: '数据更新策略', value: 'T+1 08:00', detail: '最近成功：2026-07-21 07:42' }, { icon: Warehouse, title: '订单去重规则', value: '根订单 + 业务阶段', detail: '海外仓入库、出库分阶段计量' }].map((item) => { const Icon = item.icon; return <div key={item.title} className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'><div className='flex items-center gap-2 text-[11px] text-slate-500'><Icon className='h-4 w-4 text-blue-600'/>{item.title}</div><div className='mt-3 text-lg font-semibold text-slate-900'>{item.value}</div><p className='mt-1 text-[10px] text-slate-400'>{item.detail}</p></div>; })}
        </section>
        <section className='grid gap-3 xl:grid-cols-2'>
          <div className='rounded-lg border border-slate-200 bg-white shadow-sm'><PanelTitle title='经营规则配置' subtitle='修改后进入审核并保留版本记录' action={<button onClick={() => addToast('规则草稿已保存，等待审核', 'success')} className='rounded bg-blue-600 px-3 py-1.5 text-[10px] text-white'>保存规则</button>}/><div className='divide-y divide-slate-100 px-4'>{[['沉默客户阈值', '连续 90 天无实际走货', '90 天'], ['货量下滑阈值', '本周期较上一周期下降', '-20%'], ['首单新客定义', '客户首次产生有效走货', '首次'], ['单据排除范围', '取消、作废、测试、重复单', '4 类']].map((row) => <div key={row[0]} className='grid grid-cols-[130px_minmax(0,1fr)_80px] items-center gap-3 py-3 text-[11px]'><b className='font-medium text-slate-700'>{row[0]}</b><span className='text-slate-400'>{row[1]}</span><button onClick={() => addToast(`正在编辑${row[0]}`, 'info')} className='rounded border border-slate-200 px-2 py-1.5 text-blue-600'>{row[2]}</button></div>)}</div></div>
          <div className='rounded-lg border border-slate-200 bg-white shadow-sm'><PanelTitle title='角色数据权限' subtitle='遵循最小权限与组织范围继承'/><div className='overflow-x-auto p-4'><table className='w-full text-left text-[10px]'><thead className='text-slate-400'><tr><th className='pb-3 font-medium'>角色</th><th className='pb-3 font-medium'>数据范围</th><th className='pb-3 font-medium'>导出</th><th className='pb-3 font-medium'>配置</th></tr></thead><tbody className='divide-y divide-slate-100'>{[['管理层', '全公司授权数据', '允许', '只读'], ['业务线负责人', '所属业务线', '允许', '只读'], ['团队负责人', '所属团队', '允许', '只读'], ['销售人员', '本人客户与订单', '允许', '无'], ['数据管理员', '全量数据', '允许', '编辑']].map((row) => <tr key={row[0]}><td className='py-3 font-medium text-slate-700'>{row[0]}</td><td className='py-3 text-slate-500'>{row[1]}</td><td className='py-3 text-emerald-600'>{row[2]}</td><td className='py-3'>{row[3]}</td></tr>)}</tbody></table></div></div>
        </section>
        <div className='rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-[10px] leading-5 text-blue-700'>所有筛选、导出、口径变更和权限调整均记录审计日志；组织归属按实际业务发生时的组织快照回溯，避免历史组织调整影响统计结果。</div>
      </div>}
    </main>
  </div>;
}
