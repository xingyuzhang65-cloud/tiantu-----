import React, { useMemo, useRef, useState } from 'react';
import {
  Bell,
  Box,
  Check,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  Grid2X2Plus,
  Home,
  Menu,
  MessageCircleMore,
  MessageSquareText,
  PackageSearch,
  PanelTop,
  Plane,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Warehouse,
  X,
} from 'lucide-react';

interface PriceInquiryPageProps {
  onNavigate: (view: string) => void;
  activeView?: '价格查询' | '询价列表';
}

type FieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

const Field = ({ label, required = true, children, className = '' }: FieldProps) => (
  <label className={`tiantu-field ${className}`}>
    <span className="tiantu-label">
      {required && <b>*</b>}
      {label}：
    </span>
    <span className="tiantu-control-wrap">{children}</span>
  </label>
);

const Select = ({ placeholder, options = [] }: { placeholder: string; options?: string[] }) => (
  <select defaultValue="" className="tiantu-control">
    <option value="" disabled>{placeholder}</option>
    {options.map((option) => <option key={option}>{option}</option>)}
  </select>
);

const MultiSelect = ({
  placeholder,
  options,
  value,
  open,
  onToggleOpen,
  onChange,
}: {
  placeholder: string;
  options: string[];
  value: string[];
  open: boolean;
  onToggleOpen: () => void;
  onChange: (nextValue: string[]) => void;
}) => {
  const selectedText = value.length ? value.join('、') : placeholder;

  return (
    <span className="tiantu-multiselect">
      <button type="button" className={`tiantu-multiselect-trigger ${value.length ? 'selected' : ''}`} onClick={onToggleOpen}>
        <span>{selectedText}</span>
        <ChevronDown className={`h-[12px] w-[12px] shrink-0 text-[#aeb8c4] ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <span className="tiantu-multiselect-menu">
          {options.map((option) => {
            const checked = value.includes(option);
            return (
              <button
                key={option}
                type="button"
                className={`tiantu-multiselect-option ${checked ? 'checked' : ''}`}
                onClick={() => onChange(checked ? value.filter((item) => item !== option) : [...value, option])}
              >
                <i>{checked && <Check className="h-[10px] w-[10px]" strokeWidth={3} />}</i>
                <span>{option}</span>
              </button>
            );
          })}
        </span>
      )}
    </span>
  );
};

const mainRail = [
  { name: '首页', icon: Home, target: '运单' },
  { name: '单据', icon: FileText, target: '运单' },
  { name: '仓库', icon: Warehouse, target: '仓库出货' },
  { name: '产品', icon: Box, target: '产品服务' },
  { name: '订单', icon: ClipboardList },
  { name: '财务', icon: CreditCard },
  { name: '询价', icon: MessageCircleMore },
  { name: '统计', icon: PanelTop },
  { name: '配置', icon: Settings },
  { name: '管理', icon: Users, target: '用户' },
  { name: '导出', icon: Download },
  { name: '系统', icon: ShieldCheck },
  { name: '营销', icon: Plane, target: '营销数据看板' },
  { name: '统计', icon: PackageSearch },
  { name: '配置', icon: Settings },
  { name: '报关', icon: FileCheck2 },
  { name: '清关', icon: ClipboardList },
];

const inquiryMenu = ['价格查询', '询价列表', '报价列表', '报价配置', '用户询价列表', '询价复核', '询价托盘'];
const tabs = ['运单', '指令管理', '创建客户指令', '海外暂存', '海外中转单', '404', '价格查询'];

const inquiryListRows = [
  { id: 'XJ2608170008', customer: '深圳天图电子有限公司', mode: '海运', service: '美国海卡', warehouse: '塘厦仓', destination: '美国 / Los Angeles', zip: '90001', goods: '家具配件', weight: '680', volume: '4.8', cabinet: '40HQ', addressType: '商业地址', customs: '是', tax: '否', targetPrice: '12.8/KG', cc: '天朗、天全', status: '待报价', creator: '天朗', createdAt: '2026-08-17 16:58:22' },
  { id: 'XJ2608170007', customer: '上海豪迅美中快递中心', mode: '空运', service: '美国空派', warehouse: '广州仓', destination: '美国 / Chicago', zip: '60601', goods: '蓝牙耳机', weight: '132', volume: '1.1', cabinet: '-', addressType: '私人地址', customs: '否', tax: '是', targetPrice: '35.5/KG', cc: '天气、天明', status: '已报价', creator: '天全', createdAt: '2026-08-17 15:42:10' },
  { id: 'XJ2608170006', customer: '常晟供应链集团', mode: '海运', service: '美国海派', warehouse: '义乌仓', destination: '美国 / Dallas', zip: '75201', goods: '厨房用品', weight: '420', volume: '3.2', cabinet: '20GP', addressType: '商业地址', customs: '是', tax: '是', targetPrice: '9.6/KG', cc: '天朗、天宇', status: '报价中', creator: '天气', createdAt: '2026-08-17 14:18:36' },
  { id: 'XJ2608170005', customer: '深圳星链家居出口部', mode: '铁路', service: '美国海卡', warehouse: '塘厦仓', destination: '美国 / Seattle', zip: '98101', goods: '灯具', weight: '980', volume: '7.5', cabinet: '40GP', addressType: '亚马逊仓库', customs: '否', tax: '否', targetPrice: '11.2/KG', cc: '天成', status: '待报价', creator: '天明', createdAt: '2026-08-17 11:03:49' },
  { id: 'XJ2608160012', customer: '东莞跨境贸易样品客户', mode: '卡航', service: '美国海派', warehouse: '广州仓', destination: '美国 / Phoenix', zip: '85043', goods: '汽配样品', weight: '76', volume: '0.6', cabinet: '-', addressType: '海外仓', customs: '是', tax: '否', targetPrice: '18.0/KG', cc: '天朗、天气', status: '已取消', creator: '天宇', createdAt: '2026-08-16 18:22:04' },
];

function TiantuLogo() {
  return (
    <div className="flex h-[84px] flex-col items-center justify-center bg-white">
      <svg className="h-[45px] w-[96px]" viewBox="0 0 150 70" aria-label="Tiantu 天图通逊">
        <path d="M9 16 137 2 48 33 17 27Z" fill="#f6a600" />
        <path d="M28 25 128 5 50 43 50 62 32 52Z" fill="#0b73bd" />
        <path d="M52 34 134 8 64 47 58 62 48 58Z" fill="#19a2df" />
        <text x="58" y="46" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="700" fontStyle="italic" fill="#0b73bd">Tiantu</text>
        <text x="63" y="61" fontFamily="Microsoft YaHei, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.5" fill="#3d4856">天图通逊</text>
      </svg>
      <div className="-mt-1 text-[8px] font-semibold tracking-[2px] text-[#273445]">聚焦美英 空海运专线</div>
    </div>
  );
}

function Watermarks() {
  const marks = useMemo(() => Array.from({ length: 42 }), []);
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[58px] bottom-0 z-40 grid grid-cols-6 grid-rows-7 overflow-hidden opacity-[0.055]">
      {marks.map((_, index) => (
        <div key={index} className="flex items-center justify-center whitespace-nowrap text-[12px] font-medium text-slate-500">
          <span className="-rotate-[17deg]">天朗（付豪） 2026-08-17</span>
        </div>
      ))}
    </div>
  );
}

function InquiryListContent() {
  const columns = ['询价编号', '客户', '运输模式', '服务名称', '拣货仓库', '目的地', '邮编', '产品信息', '总重量(KG)', '方数', '柜型', '地址类型', '客户报关', '包税', '目标价', '抄送人（报价结果）', '状态', '创建人', '创建时间', '操作'];

  return (
    <>
      <section className="tiantu-list-panel">
        <div className="tiantu-list-filters">
          <Field label="询价编号" required={false} className="w-[255px]"><input className="tiantu-control" placeholder="请输入" /></Field>
          <Field label="客户" required={false} className="w-[285px]"><Select placeholder="请选择" options={['深圳天图电子有限公司', '上海豪迅美中快递中心', '常晟供应链集团']} /></Field>
          <Field label="运输模式" required={false} className="w-[245px]"><Select placeholder="请选择运输模式" options={['海运', '空运', '铁路', '卡航']} /></Field>
          <Field label="状态" required={false} className="w-[230px]"><Select placeholder="请选择" options={['待报价', '报价中', '已报价', '已取消']} /></Field>
          <Field label="抄送人（报价结果）" required={false} className="tiantu-long-field tiantu-filter-cc"><Select placeholder="请选择" options={['天朗', '天全', '天气', '天明', '天成', '天宇']} /></Field>
          <div className="tiantu-filter-actions">
            <button type="button" className="tiantu-action primary">查询</button>
            <button type="button" className="tiantu-action">重置</button>
          </div>
        </div>
      </section>

      <section className="tiantu-table-panel">
        <div className="mb-[10px] flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#253142]">询价列表</span>
          <button type="button" className="tiantu-action primary">导出</button>
        </div>
        <div className="tiantu-table-wrap">
          <table className="tiantu-inquiry-table">
            <thead>
              <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
            </thead>
            <tbody>
              {inquiryListRows.map((row) => (
                <tr key={row.id}>
                  <td className="font-medium text-[#0757b4]">{row.id}</td>
                  <td>{row.customer}</td>
                  <td>{row.mode}</td>
                  <td>{row.service}</td>
                  <td>{row.warehouse}</td>
                  <td>{row.destination}</td>
                  <td>{row.zip}</td>
                  <td>{row.goods}</td>
                  <td>{row.weight}</td>
                  <td>{row.volume}</td>
                  <td>{row.cabinet}</td>
                  <td>{row.addressType}</td>
                  <td>{row.customs}</td>
                  <td>{row.tax}</td>
                  <td>{row.targetPrice}</td>
                  <td>{row.cc}</td>
                  <td><span className={`tiantu-status ${row.status}`}>{row.status}</span></td>
                  <td>{row.creator}</td>
                  <td>{row.createdAt}</td>
                  <td><button type="button" className="text-[#0757b4] hover:underline">查看</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tiantu-pagination">
          <span>共 {inquiryListRows.length} 条</span>
          <button type="button">上一页</button>
          <strong>1</strong>
          <button type="button">下一页</button>
        </div>
      </section>
    </>
  );
}

export default function PriceInquiryPage({ onNavigate, activeView = '价格查询' }: PriceInquiryPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileCount, setFileCount] = useState(0);
  const [liftGate, setLiftGate] = useState('');
  const [ccOpen, setCcOpen] = useState(false);
  const [ccUsers, setCcUsers] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const visibleTabs = activeView === '询价列表' && !tabs.includes('询价列表') ? [...tabs, '询价列表'] : tabs;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setNotice('询价信息已提交');
    window.setTimeout(() => setNotice(''), 2200);
  };

  return (
    <div className="relative flex h-screen min-h-[720px] w-screen overflow-hidden bg-[#f4f7fb] font-['Microsoft_YaHei','PingFang_SC',Arial,sans-serif] text-[#202b3c]">
      <aside className="relative z-30 flex w-[40px] shrink-0 flex-col overflow-hidden rounded-tr-[38px] bg-gradient-to-b from-[#064eaa] via-[#075bb8] to-[#8bc5ec] pt-[73px] text-white">
        <nav className="flex min-h-0 flex-1 flex-col">
          {mainRail.map(({ name, icon: Icon, target }, index) => {
            const active = name === '询价' && index === 6;
            return (
              <button
                key={`${name}-${index}`}
                type="button"
                onClick={() => target && onNavigate(target)}
                className={`flex h-[44px] shrink-0 flex-col items-center justify-center gap-[2px] text-[10px] transition-colors ${active ? 'bg-[#eef2f6] font-semibold text-[#15273d]' : 'text-white/95 hover:bg-white/10'}`}
              >
                <Icon className="h-[15px] w-[15px]" strokeWidth={active ? 2.5 : 2.1} />
                <span>{name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <aside className="relative z-30 w-[140px] shrink-0 border-r border-[#e9edf3] bg-white">
        <TiantuLogo />
        <div className="flex h-[54px] items-center gap-2 border-b border-[#f0f2f5] px-[24px] text-[12px] font-medium text-[#516071]">
          <MessageSquareText className="h-4 w-4 text-[#6c7785]" />
          <span>美国询价</span>
        </div>
        <nav className="text-[12px] text-[#475568]">
          {inquiryMenu.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onNavigate(item)}
              className={`flex h-[40px] w-full items-center px-[46px] text-left whitespace-nowrap transition-colors ${item === activeView ? 'bg-[#f1f4f8] font-semibold text-[#0756ae]' : 'hover:bg-slate-50'}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="relative z-20 flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-50 flex h-[35px] shrink-0 items-center justify-between border-b border-[#edf0f4] bg-white px-[10px]">
          <div className="flex min-w-0 items-center gap-[7px] overflow-hidden">
            <Menu className="h-[17px] w-[17px] shrink-0 text-[#10243a]" strokeWidth={2.8} />
            <ChevronLeft className="h-[14px] w-[14px] shrink-0 text-[#10243a]" fill="currentColor" />
            <div className="flex min-w-0 items-center gap-[5px] overflow-hidden">
              {visibleTabs.map((tab) => {
                const active = tab === activeView;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => !active && tab !== '404' && onNavigate(tab)}
                    className={`flex h-[22px] shrink-0 items-center gap-[6px] rounded-[3px] border px-[10px] text-[10px] ${active ? 'border-[#0757b4] bg-[#0757b4] font-semibold text-white' : 'border-[#e3e7ec] bg-white text-[#657181]'}`}
                  >
                    {tab}<X className="h-[9px] w-[9px]" />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-[18px] text-[#26374a]">
            <span className="text-[13px]">▶</span>
            <button type="button" className="relative" aria-label="消息">
              <Bell className="h-[15px] w-[15px] text-[#748093]" />
              <span className="absolute -right-[7px] -top-[7px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#ef686c] px-[3px] text-[9px] leading-none text-white">0</span>
            </button>
            <Download className="h-[15px] w-[15px]" />
            <span className="rounded-full bg-[#e8f0f7] px-[9px] py-[2px] text-[10px] text-[#60758a]">⌾ 塘厦仓</span>
            <div className="flex items-center gap-[7px] text-[11px]">
              <UserRound className="h-[13px] w-[13px] fill-[#6c7682] text-[#6c7682]" />
              <span>天朗（付豪）</span>
              <ChevronDown className="h-[11px] w-[11px] text-[#8994a1]" />
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 bg-[#f3f6fa] pb-[18px] pl-[8px] pr-[17px] pt-[17px]">
          <form onSubmit={handleSubmit} className="relative h-full overflow-y-auto bg-white pb-[42px] pl-[20px] pr-[32px] pt-[14px] shadow-[0_1px_8px_rgba(22,48,78,0.08)]">
            <h1 className="-ml-[8px] mb-[31px] text-[16px] font-bold text-[#111b28]">{activeView === '询价列表' ? '询价列表' : '询价'}</h1>

            {activeView === '询价列表' ? (
              <InquiryListContent />
            ) : (
              <>
                <section className="tiantu-card h-[146px]">
                  <h2>基本信息</h2>
                  <div className="tiantu-grid tiantu-grid-five">
                    <Field label="运输模式"><Select placeholder="请选择运输模式" options={['海运', '空运', '铁路', '卡航']} /></Field>
                    <Field label="服务名称"><Select placeholder="请选择服务名称" options={['美国海卡', '美国海派', '美国空派']} /></Field>
                    <Field label="拣货仓库"><Select placeholder="请选择拣货仓库" options={['塘厦仓', '广州仓', '义乌仓']} /></Field>
                    <Field label="是否客户报关"><Select placeholder="请选择是否客户报关" options={['是', '否']} /></Field>
                    <Field label="是否包税"><Select placeholder="请选择是否包税" options={['是', '否']} /></Field>

                    <Field label="收货地址"><textarea className="tiantu-control h-[44px] resize-none py-[7px]" maxLength={300} placeholder="请输入收货地址" /></Field>
                    <Field label="国家"><Select placeholder="请选择" options={['美国', '英国', '加拿大', '德国']} /></Field>
                    <Field label="城市"><input className="tiantu-control" placeholder="请输入" /></Field>
                    <Field label="邮编"><input className="tiantu-control" placeholder="请输入" /></Field>
                    <span />
                  </div>
                </section>

                <section className="tiantu-card mt-[14px] h-[120px]">
                  <h2>货物信息</h2>
                  <div className="tiantu-grid tiantu-grid-five items-start">
                    <Field label="产品信息"><input className="tiantu-control" placeholder="请输入" /></Field>
                    <Field label="总重量"><span className="tiantu-stepper"><button type="button">−</button><input aria-label="总重量" placeholder="总重量(KG)" /><button type="button">＋</button></span></Field>
                    <Field label="方数"><span className="tiantu-stepper"><button type="button">−</button><input aria-label="方数" /><button type="button">＋</button></span></Field>
                    <Field label="柜型"><Select placeholder="请选择柜型" options={['20GP', '40GP', '40HQ', '45HQ']} /></Field>
                    <Field label="产品图片" required={false}>
                      <span className="flex items-start gap-2">
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => setFileCount(event.target.files?.length || 0)} />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="h-[28px] rounded-[3px] bg-[#0757b4] px-[12px] text-[10px] font-semibold text-white">点击上传</button>
                        <small className="pt-[7px] text-[9px] text-[#657181]">{fileCount ? `已选择${fileCount}张` : '最多上传9张图片'}</small>
                      </span>
                    </Field>
                  </div>
                </section>

                <section className="tiantu-card mt-[14px] h-[90px]">
                  <h2>运输要求</h2>
                  <div className="flex items-center gap-[4px] pl-[52px]">
                    <Field label="地址类型" className="w-[312px]"><Select placeholder="请选择地址类型" options={['商业地址', '私人地址', '亚马逊仓库', '海外仓']} /></Field>
                    <Field label="是否需要升降台/尾板" required={false} className="w-[280px]">
                      <span className="flex h-[27px] items-center gap-[14px] text-[11px] text-[#536173]">
                        <button type="button" onClick={() => setLiftGate('是')} className="flex items-center gap-1.5"><i className={`tiantu-radio ${liftGate === '是' ? 'active' : ''}`} />是</button>
                        <button type="button" onClick={() => setLiftGate('否')} className="flex items-center gap-1.5"><i className={`tiantu-radio ${liftGate === '否' ? 'active' : ''}`} />否</button>
                      </span>
                    </Field>
                  </div>
                </section>

                <section className="tiantu-card mt-[14px] h-[108px]">
                  <h2>其他</h2>
                  <div className="tiantu-other-grid">
                    <Field label="客户" className="w-[245px]"><Select placeholder="请选择" options={['深圳天图电子有限公司', '上海豪迅美中快递中心', '常晟供应链集团']} /></Field>
                    <Field label="抄送人（报价结果）" required={false} className="tiantu-long-field tiantu-other-cc">
                      <MultiSelect
                        placeholder="请选择"
                        options={['天朗', '天全', '天气', '天明', '天成', '天宇']}
                        value={ccUsers}
                        open={ccOpen}
                        onToggleOpen={() => setCcOpen((current) => !current)}
                        onChange={setCcUsers}
                      />
                    </Field>
                    <Field label="目标价" required={false} className="w-[250px]"><input className="tiantu-control" placeholder="请输入" /></Field>
                    <Field label="备注" required={false} className="w-[330px]"><textarea className="tiantu-control h-[44px] resize-none py-[7px]" maxLength={100} placeholder="请输入" /></Field>
                  </div>
                </section>

                <div className="mt-[23px] flex justify-center">
                  <button type="submit" className="h-[27px] rounded-[3px] bg-[#0757b4] px-[18px] text-[10px] font-semibold text-white shadow-sm hover:bg-[#064b9b]">立即询价</button>
                </div>
              </>
            )}

            {notice && <div className="fixed left-1/2 top-[58px] z-[80] -translate-x-1/2 rounded bg-[#20344d] px-4 py-2 text-xs text-white shadow-lg">{notice}</div>}

            <div className="absolute right-[8px] top-[620px] flex flex-col gap-[11px]">
              <button type="button" aria-label="快捷工具" className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[#f2dce5] bg-white text-[#f39ab8] shadow-sm"><Grid2X2Plus className="h-4 w-4" /></button>
              <button type="button" aria-label="智能助手" className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#f39ab8] text-white shadow-sm"><Sparkles className="h-4 w-4" /></button>
            </div>
          </form>
        </div>
      </main>

      <Watermarks />

      <style>{`
        .tiantu-card {
          position: relative;
          border: 1px solid #e8ebef;
          border-radius: 11px;
          background: #fff;
          padding: 15px 17px;
          box-shadow: 0 2px 8px rgba(31, 51, 75, 0.14);
        }
        .tiantu-card h2 {
          margin: 0 0 12px;
          font-size: 12px;
          line-height: 17px;
          font-weight: 700;
          color: #253142;
        }
        .tiantu-grid {
          display: grid;
          align-items: start;
          gap: 10px 42px;
        }
        .tiantu-grid-five {
          grid-template-columns: repeat(5, 260px);
          justify-content: start;
          padding-left: 52px;
          column-gap: 60px;
        }
        .tiantu-other-grid {
          display: grid;
          grid-template-columns: 245px 360px 250px 330px;
          align-items: start;
          gap: 54px;
          padding-left: 75px;
        }
        .tiantu-other-cc {
          width: 360px;
        }
        .tiantu-field {
          display: flex;
          min-width: 0;
          align-items: flex-start;
          color: #4e5d70;
          font-size: 10px;
          line-height: 27px;
        }
        .tiantu-label {
          display: inline-flex;
          flex: 0 0 auto;
          justify-content: flex-end;
          white-space: nowrap;
        }
        .tiantu-label b {
          margin-right: 3px;
          color: #ef7777;
          font-weight: 500;
        }
        .tiantu-long-field .tiantu-label {
          width: 116px;
        }
        .tiantu-control-wrap {
          display: block;
          min-width: 0;
          flex: 1;
        }
        .tiantu-control {
          display: block;
          width: 100%;
          height: 27px;
          border: 1px solid #dce3eb;
          border-radius: 3px;
          background: #fff;
          padding: 0 10px;
          color: #465568;
          font-family: inherit;
          font-size: 10px;
          line-height: 25px;
          outline: none;
        }
        .tiantu-control::placeholder { color: #bdc6d0; }
        .tiantu-control:focus { border-color: #70a8df; box-shadow: 0 0 0 1px rgba(7, 87, 180, .08); }
        select.tiantu-control { color: #b7c0cb; }
        .tiantu-list-panel {
          border: 1px solid #e8ebef;
          border-radius: 8px;
          background: #fff;
          padding: 15px 17px;
          box-shadow: 0 2px 8px rgba(31, 51, 75, 0.10);
        }
        .tiantu-list-filters {
          display: grid;
          grid-template-columns: 255px 285px 245px 230px 360px 1fr;
          align-items: flex-start;
          gap: 12px 18px;
          padding-left: 22px;
        }
        .tiantu-filter-cc {
          width: 360px;
        }
        .tiantu-filter-actions {
          grid-column: 6;
          display: flex;
          height: 27px;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }
        .tiantu-action {
          height: 27px;
          border: 1px solid #dce3eb;
          border-radius: 3px;
          background: #fff;
          padding: 0 13px;
          color: #536173;
          font-size: 10px;
          line-height: 25px;
        }
        .tiantu-action.primary {
          border-color: #0757b4;
          background: #0757b4;
          color: #fff;
          font-weight: 600;
        }
        .tiantu-table-panel {
          margin-top: 14px;
          min-height: 448px;
          border: 1px solid #e8ebef;
          border-radius: 8px;
          background: #fff;
          padding: 15px 17px 12px;
          box-shadow: 0 2px 8px rgba(31, 51, 75, 0.10);
        }
        .tiantu-table-wrap {
          width: 100%;
          overflow: auto;
          border: 1px solid #e4e9f0;
          border-radius: 4px;
        }
        .tiantu-inquiry-table {
          min-width: 1880px;
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 10px;
          color: #465568;
        }
        .tiantu-inquiry-table th {
          height: 34px;
          border-right: 1px solid #e6ebf1;
          border-bottom: 1px solid #dfe6ee;
          background: #f6f8fb;
          padding: 0 9px;
          color: #4d5b6c;
          font-weight: 600;
          text-align: left;
          white-space: nowrap;
        }
        .tiantu-inquiry-table td {
          height: 38px;
          border-right: 1px solid #edf1f5;
          border-bottom: 1px solid #edf1f5;
          padding: 0 9px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tiantu-inquiry-table tr:hover td { background: #f8fbff; }
        .tiantu-status {
          display: inline-flex;
          height: 20px;
          align-items: center;
          border-radius: 3px;
          padding: 0 7px;
          background: #eef5ff;
          color: #0757b4;
          font-weight: 600;
        }
        .tiantu-status.已报价 { background: #edf8f2; color: #22975b; }
        .tiantu-status.报价中 { background: #fff7e7; color: #b36b00; }
        .tiantu-status.已取消 { background: #f2f4f7; color: #7b8794; }
        .tiantu-pagination {
          display: flex;
          height: 34px;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          color: #667386;
          font-size: 10px;
        }
        .tiantu-pagination button,
        .tiantu-pagination strong {
          min-width: 24px;
          height: 22px;
          border: 1px solid #dce3eb;
          border-radius: 3px;
          padding: 0 7px;
          background: #fff;
          line-height: 20px;
          text-align: center;
        }
        .tiantu-pagination strong {
          border-color: #0757b4;
          background: #0757b4;
          color: #fff;
          font-weight: 600;
        }
        .tiantu-multiselect {
          position: relative;
          display: block;
          width: 100%;
        }
        .tiantu-multiselect-trigger {
          display: flex;
          width: 100%;
          height: 27px;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          border: 1px solid #dce3eb;
          border-radius: 3px;
          background: #fff;
          padding: 0 9px 0 10px;
          color: #b7c0cb;
          font-family: inherit;
          font-size: 10px;
          line-height: 25px;
          outline: none;
        }
        .tiantu-multiselect-trigger span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tiantu-multiselect-trigger.selected { color: #465568; }
        .tiantu-multiselect-trigger:focus { border-color: #70a8df; box-shadow: 0 0 0 1px rgba(7, 87, 180, .08); }
        .tiantu-multiselect-menu {
          position: absolute;
          top: 31px;
          left: 0;
          z-index: 90;
          display: block;
          width: 100%;
          overflow: hidden;
          border: 1px solid #dce3eb;
          border-radius: 3px;
          background: #fff;
          box-shadow: 0 8px 18px rgba(31, 51, 75, .14);
        }
        .tiantu-multiselect-option {
          display: flex;
          width: 100%;
          height: 28px;
          align-items: center;
          gap: 7px;
          padding: 0 10px;
          color: #465568;
          font-size: 10px;
          line-height: 28px;
          text-align: left;
        }
        .tiantu-multiselect-option:hover { background: #f3f7fb; }
        .tiantu-multiselect-option.checked { color: #0757b4; }
        .tiantu-multiselect-option i {
          display: flex;
          height: 12px;
          width: 12px;
          shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid #d7dfe7;
          border-radius: 2px;
          color: #fff;
        }
        .tiantu-multiselect-option.checked i {
          border-color: #0757b4;
          background: #0757b4;
        }
        .tiantu-stepper {
          display: grid;
          height: 27px;
          grid-template-columns: 25px 1fr 25px;
          overflow: hidden;
          border: 1px solid #dce3eb;
          border-radius: 3px;
          background: #fff;
        }
        .tiantu-stepper button {
          color: #8895a4;
          font-size: 12px;
          line-height: 25px;
          background: #f6f8fa;
        }
        .tiantu-stepper button:first-child { border-right: 1px solid #e0e6ed; }
        .tiantu-stepper button:last-child { border-left: 1px solid #e0e6ed; }
        .tiantu-stepper input {
          min-width: 0;
          border: 0;
          padding: 0 7px;
          text-align: center;
          color: #536173;
          font-size: 10px;
          outline: none;
        }
        .tiantu-stepper input::placeholder { color: #aeb9c6; }
        .tiantu-radio {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 1px solid #d7dfe7;
          border-radius: 50%;
          background: #fff;
        }
        .tiantu-radio.active { border: 3px solid #3988d7; }
        @media (max-width: 1400px) {
          .tiantu-grid { column-gap: 20px; }
          .tiantu-grid-five { grid-template-columns: repeat(4, minmax(0, 1fr)); padding-left: 0; }
          .tiantu-list-filters { grid-template-columns: repeat(2, minmax(0, 1fr)); padding-left: 0; }
          .tiantu-filter-cc,
          .tiantu-filter-actions { grid-column: auto; width: auto; }
          .tiantu-other-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); padding-left: 0; }
          .tiantu-other-cc { width: auto; }
          .tiantu-card { height: auto !important; min-height: 110px; }
        }
      `}</style>
    </div>
  );
}
