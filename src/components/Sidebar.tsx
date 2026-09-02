import React, { useState } from 'react';
import {
  ArrowRightLeft,
  BarChart3,
  BookOpen,
  Box,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Cpu,
  CreditCard,
  DownloadCloud,
  FileText,
  Layers,
  Megaphone,
  Package,
  PackageOpen,
  Printer,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  UserCog,
  UserPlus,
  Users,
  Warehouse,
  Wrench,
} from 'lucide-react';

interface SidebarProps {
  currentSubView: string;
  onSubViewChange: (view: string) => void;
}

const railItems = [
  { name: '单据', icon: FileText },
  { name: '仓库', icon: Warehouse },
  { name: '产品', icon: Box },
  { name: '订单', icon: ClipboardList },
  { name: '财务', icon: CreditCard },
  { name: '询价', icon: BookOpen },
  { name: '统计', icon: BarChart3 },
  { name: '配置', icon: Settings },
  { name: '管理', icon: Users },
  { name: '导出', icon: DownloadCloud },
  { name: '系统', icon: Cpu },
  { name: '营销', icon: Megaphone },
];

export default function Sidebar({ currentSubView, onSubViewChange }: SidebarProps) {
  const [activeRail, setActiveRail] = useState('单据');
  const [waybillExpanded, setWaybillExpanded] = useState(true);
  const [printExpanded, setPrintExpanded] = useState(true);
  const [warehouseTransferExpanded, setWarehouseTransferExpanded] = useState(true);
  const [productExpanded, setProductExpanded] = useState(true);
  const [accountSettingsExpanded, setAccountSettingsExpanded] = useState(true);

  const activateRail = (name: string, fallback?: string) => {
    setActiveRail(name);
    if (fallback) onSubViewChange(fallback);
  };

  const renderItem = (name: string) => {
    const isSelected = currentSubView === name;
    return (
      <button
        key={name}
        id={`submenu-item-${name}`}
        onClick={() => onSubViewChange(name)}
        className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
          isSelected ? 'bg-blue-50 font-semibold text-blue-600' : 'text-slate-700 hover:bg-slate-200/50'
        }`}
      >
        <span className="truncate">{name}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen select-none border-r border-[#e5e7eb] bg-white">
      <div className="flex w-16 flex-col items-center border-r border-slate-700 bg-slate-900 py-3 text-slate-400">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-blue-600 font-bold text-white shadow-md">TT</div>

        <div className="flex w-full flex-1 flex-col gap-3 overflow-y-auto px-1 scrollbar-none">
          {railItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRail === item.name;
            return (
              <button
                key={item.name}
                id={`rail-item-${item.name}`}
                onClick={() => {
                  switch (item.name) {
                    case '单据':
                      activateRail(item.name, '运单');
                      break;
                    case '仓库':
                      activateRail(item.name, '仓库概览');
                      break;
                    case '产品':
                      activateRail(item.name, '产品服务');
                      break;
                    case '订单':
                      activateRail(item.name, '快递单');
                      break;
                    case '管理':
                      activateRail(item.name, '意向客户');
                      break;
                    case '配置':
                      activateRail(item.name, '帮助中心');
                      break;
                    case '营销':
                      activateRail(item.name, '营销数据看板');
                      break;
                    default:
                      setActiveRail(item.name);
                      break;
                  }
                }}
                className={`relative flex w-full flex-col items-center justify-center py-2 transition-all duration-150 ${
                  isActive ? 'bg-slate-800 font-medium text-white' : 'hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {isActive && <div className="absolute bottom-0 left-0 top-0 w-1 rounded-r bg-blue-500" />}
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="mt-1 text-[10px] font-sans font-medium tracking-wider">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex w-[210px] flex-col bg-slate-50 text-slate-800">
        <div className="flex flex-col border-b border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <svg className="h-7 w-7 text-blue-600" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
              <path d="M10 20 L40 10 L75 35 L40 45 Z" fill="#2563EB" />
              <path d="M40 45 L75 35 L90 80 L45 90 Z" fill="#F59E0B" opacity="0.9" />
              <path d="M10 20 L40 45 L45 90 L20 60 Z" fill="#1D4ED8" />
            </svg>
            <div>
              <h1 className="text-[15px] font-bold leading-tight tracking-tight text-slate-900">Tiantu 天图通</h1>
              <p className="text-[10px] text-slate-500">聚焦跨境物流业务</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {activeRail === '单据' && (
            <>
              <div className="space-y-1">
                <button
                  onClick={() => setWaybillExpanded(!waybillExpanded)}
                  className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/50"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span>运单</span>
                  </div>
                  {waybillExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
                {waybillExpanded && <div className="ml-4 space-y-0.5 border-l border-slate-200 pl-2">{['运单', '跟单运单', '业务运单'].map(renderItem)}</div>}
              </div>

              <div className="space-y-1">
                <button className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/50">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-slate-500" />
                    <span>提单</span>
                  </div>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-1">
                <button className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/50">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-slate-500" />
                    <span>工单</span>
                  </div>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setPrintExpanded(!printExpanded)}
                  className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/50"
                >
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4 text-slate-500" />
                    <span>打单</span>
                  </div>
                  {printExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
                {printExpanded && <div className="ml-4 space-y-0.5 border-l border-slate-200 pl-2">{['快递单', '推送单'].map(renderItem)}</div>}
              </div>
            </>
          )}

          {activeRail === '仓库' && (
            <>
              <button id="submenu-item-仓库概览" onClick={() => onSubViewChange('仓库概览')} className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-medium ${currentSubView === '仓库概览' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-200/50'}`}>
                <Warehouse className="h-4 w-4" />
                <span>仓库概览</span>
              </button>
              {['仓库收货', '仓库出货'].map(renderItem)}

              <div className="space-y-1">
                <button
                  onClick={() => setWarehouseTransferExpanded(!warehouseTransferExpanded)}
                  className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/50"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-4 w-4 text-slate-600" />
                    <span>中转管理</span>
                  </div>
                  {warehouseTransferExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
                {warehouseTransferExpanded && <div className="ml-4 space-y-0.5 border-l border-slate-200 pl-2">{['中转入库', '中转出库'].map(renderItem)}</div>}
              </div>

              {['仓库暂存', '仓库配置', '仓库费用', '仓库报表', '排队管理', '仓库统计'].map((name) => (
                <button key={name} onClick={() => onSubViewChange(name)} className={`flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium ${currentSubView === name ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-200/50'}`}>
                  <span>{name}</span>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </button>
              ))}
            </>
          )}

          {activeRail === '产品' && (
            <>
              <button id="submenu-item-产品服务" onClick={() => onSubViewChange('产品服务')} className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-medium ${currentSubView === '产品服务' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-200/50'}`}>
                <PackageOpen className="h-4 w-4" />
                <span>产品服务</span>
              </button>
              <div className="space-y-1">
                <button onClick={() => setProductExpanded(!productExpanded)} className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/50">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-slate-600" />
                    <span>产品配置</span>
                  </div>
                  {productExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
                {productExpanded && <div className="ml-4 space-y-0.5 border-l border-slate-200 pl-2">{['贸易方式配置', '贸易方式校验规则查询'].map(renderItem)}</div>}
              </div>
            </>
          )}

          {activeRail === '订单' && <div className="space-y-0.5">{['快递单', '推送单'].map(renderItem)}</div>}
          {activeRail === '管理' && (
            <div className="space-y-0.5">
              <button id="submenu-item-意向客户" onClick={() => onSubViewChange('意向客户')} className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-medium ${currentSubView === '意向客户' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-200/50'}`}>
                <UserPlus className="h-4 w-4" />
                <span>意向客户</span>
              </button>
              <button id="submenu-item-客户" onClick={() => onSubViewChange('客户')} className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-medium ${currentSubView === '客户' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-200/50'}`}>
                <Users className="h-4 w-4" />
                <span>客户</span>
              </button>
              <button id="submenu-item-用户" onClick={() => onSubViewChange('用户')} className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-medium ${currentSubView === '用户' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-200/50'}`}>
                <UserCog className="h-4 w-4" />
                <span>用户</span>
              </button>
            </div>
          )}

          {activeRail === '配置' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700">
                <Settings className="h-4 w-4 text-blue-600" />
                <span>配置中心</span>
              </div>
              <div className="ml-4 space-y-0.5 border-l border-slate-200 pl-2">
                <button id="submenu-item-帮助中心" onClick={() => onSubViewChange('帮助中心')} className={`flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs ${currentSubView === '帮助中心' ? 'bg-blue-50 font-semibold text-blue-600' : 'text-slate-600 hover:bg-slate-200/50'}`}>
                  <CircleHelp className="h-3.5 w-3.5" />
                  <span>帮助中心</span>
                </button>
                <button id="submenu-item-贸易方式配置" onClick={() => onSubViewChange('贸易方式配置')} className={`flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs ${currentSubView === '贸易方式配置' ? 'bg-blue-50 font-semibold text-blue-600' : 'text-slate-600 hover:bg-slate-200/50'}`}>
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>贸易方式配置</span>
                </button>
              </div>
            </div>
          )}

          {activeRail === '营销' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700">
                <Megaphone className="h-4 w-4 text-blue-600" />
                <span>营销管理</span>
              </div>
              <div className="ml-4 border-l border-slate-200 pl-2">
                <button id="submenu-item-营销数据看板" onClick={() => onSubViewChange('营销数据看板')} className={`flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs ${currentSubView === '营销数据看板' ? 'bg-blue-50 font-semibold text-blue-600' : 'text-slate-600 hover:bg-slate-200/50'}`}>
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>营销数据看板</span>
                </button>
              </div>
            </div>
          )}

          {activeRail !== '单据' && activeRail !== '仓库' && activeRail !== '产品' && activeRail !== '订单' && activeRail !== '管理' && activeRail !== '配置' && activeRail !== '营销' && (
            <div className="px-3 py-4 text-center text-xs text-slate-400">暂无子菜单</div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-100 p-3 text-[11px] text-slate-500">
          <div className="mb-1 flex items-center gap-1.5 font-medium text-slate-700">
            <TrendingUp className="h-3 w-3 text-blue-500" />
            <span>智能专线推荐</span>
          </div>
          美英空派专线时效保障，快至 3 日送达。
        </div>
      </div>
    </div>
  );
}
