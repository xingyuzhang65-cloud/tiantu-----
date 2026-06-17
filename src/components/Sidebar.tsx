import React, { useState } from 'react';
import { 
  FileText, Warehouse, Box, ClipboardList, CreditCard, 
  MessageSquareCode, BarChart3, Settings, Users, 
  DownloadCloud, Cpu, Megaphone, ChevronDown, ChevronRight,
  TrendingUp, Compass, ArrowRightLeft, Layers, Wrench, Printer, Package
} from 'lucide-react';

interface SidebarProps {
  currentSubView: string;
  onSubViewChange: (view: string) => void;
}

export default function Sidebar({ currentSubView, onSubViewChange }: SidebarProps) {
  const [activeRail, setActiveRail] = useState('单据');
  const [waybillExpanded, setWaybillExpanded] = useState(true);

  // Outer rail menu items
  const railItems = [
    { name: '单据', icon: FileText },
    { name: '仓库', icon: Warehouse },
    { name: '产品', icon: Box },
    { name: '订单', icon: ClipboardList },
    { name: '财务', icon: CreditCard },
    { name: '询价', icon: MessageSquareCode },
    { name: '统计', icon: BarChart3 },
    { name: '配置', icon: Settings },
    { name: '管理', icon: Users },
    { name: '导出', icon: DownloadCloud },
    { name: '系统', icon: Cpu },
    { name: '营销', icon: Megaphone },
  ];

  return (
    <div className="flex h-screen select-none border-r border-[#e5e7eb] bg-white">
      {/* Outer Rail (Dark Blue / Steel Gray branding) */}
      <div className="flex w-16 flex-col items-center border-r border-slate-700 bg-slate-900 py-3 text-slate-400">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-blue-600 font-bold text-white shadow-md">
          TT
        </div>
        
        <div className="flex-1 space-y-3 overflow-y-auto px-1 scrollbar-none w-full">
          {railItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRail === item.name;
            return (
              <button
                key={item.name}
                id={`rail-item-${item.name}`}
                onClick={() => {
                  setActiveRail(item.name);
                  if (item.name === '配置') {
                    onSubViewChange('贸易方式配置');
                  }
                }}
                className={`group flex w-full flex-col items-center justify-center py-2 transition-all duration-150 relative ${
                  isActive 
                    ? 'text-white font-medium bg-slate-800' 
                    : 'hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r" />
                )}
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="mt-1 text-[10px] scale-90 tracking-wider font-sans">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inner Active Sidebar Panel */}
      <div className="flex w-[210px] flex-col bg-slate-50 text-slate-800">
        {/* Tiantu Logo Section */}
        <div className="flex flex-col border-b border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            {/* Custom SVG logo resembling the original Tiantu wing/shield logo */}
            <svg id="tiantu-logo" className="h-7 w-7 text-blue-600" viewBox="0 0 100 100" fill="currentColor">
              <path d="M10 20 L40 10 L75 35 L40 45 Z" fill="#2563EB" />
              <path d="M40 45 L75 35 L90 80 L45 90 Z" fill="#F59E0B" opacity="0.9" />
              <path d="M10 20 L40 45 L45 90 L20 60 Z" fill="#1D4ED8" />
            </svg>
            <div>
              <h1 className="font-sans font-bold text-[15px] leading-tight tracking-tight text-slate-900">
                Tiantu 天图通逊
              </h1>
              <p className="text-[10px] text-slate-500 scale-90 -translate-x-1 font-sans">
                聚焦美英 空海运专线
              </p>
            </div>
          </div>
        </div>

        {/* Submenu and groups */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {/* Group 1: 运单管理 (Collapsible) */}
          <div className="space-y-1">
            <button
              id="btn-fold-waybills"
              onClick={() => setWaybillExpanded(!waybillExpanded)}
              className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/50"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>运单</span>
              </div>
              {waybillExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>

            {waybillExpanded && (
              <div className="ml-4 pl-2 border-l border-slate-200 space-y-0.5">
                {[
                  { name: '运单', count: 129 },
                  { name: '跟单运单', count: 0 },
                  { name: '业务运单', count: 2 },
                ].map((subItem) => {
                  const isSelected = currentSubView === subItem.name;
                  return (
                    <button
                      key={subItem.name}
                      id={`submenu-item-${subItem.name}`}
                      onClick={() => onSubViewChange(subItem.name)}
                      className={`flex w-full items-center justify-between rounded px-3 py-1.5 text-xs transition-colors duration-150 ${
                        isSelected
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-800'
                      }`}
                    >
                      <span>{subItem.name}</span>
                      {subItem.count > 0 && (
                        <span className={`rounded-full px-1.5 text-[9px] ${
                          isSelected ? 'bg-blue-150 text-blue-700 font-bold' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {subItem.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Group 2: 提单 */}
          <div className="space-y-1">
            <div className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200/50">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-slate-500" />
                <span>提单</span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          {/* Group 3: 工单 */}
          <div className="space-y-1">
            <div className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200/50">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-slate-500" />
                <span>工单</span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          {/* Group 4: 打单 */}
          <div className="space-y-1">
            <div className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200/50">
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-slate-500" />
                <span>打单</span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          {/* Group 5: 预留仓 */}
          <div className="space-y-1">
            <div className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200/50">
              <div className="flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-slate-500" />
                <span>预留仓</span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          {/* Group 6: 海外中转单管理 */}
          <div className="space-y-1">
            <div className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200/50">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-slate-500" />
                <span className="truncate">海外中转单管理</span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          {/* Group 7: 货件管理 */}
          <div className="space-y-1">
            <div className="flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200/50">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-500" />
                <span>货件管理</span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Lower helpful tips */}
        <div className="p-3 border-t border-slate-200 bg-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 mb-1">
            <TrendingUp className="h-3 w-3 text-blue-500" />
            <span>智能专线推荐</span>
          </div>
          美英空派专线时效保障，快至 3 日送达。
        </div>
      </div>
    </div>
  );
}
