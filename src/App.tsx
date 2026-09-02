import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TableSection from './components/TableSection';
import CreateModal from './components/CreateModal';
import NotificationToast, { ToastMessage } from './components/NotificationToast';
import RuleConfigPage from './components/RuleConfigPage';
import WarehouseTransitOutPage from './components/WarehouseTransitOutPage';
import OverseasTransitPage from './components/OverseasTransitPage';
import WarehouseShipmentPage from './components/WarehouseShipmentPage';
import OverseasTransitOrderPage from './components/OverseasTransitOrderPage';
import ExpressOrderPage from './components/ExpressOrderPage';
import UserManagementPage from './components/UserManagementPage';
import CustomerManagementPage, { type CustomerCreateSeed } from './components/CustomerManagementPage';
import IntendedCustomerPage from './components/IntendedCustomerPage';
import MarketingDashboardPage from './components/MarketingDashboardPage';
import PriceInquiryPage from './components/PriceInquiryPage';
import HelpCenterPage from './components/HelpCenterPage';
import HelpCenterReader from './components/HelpCenterReader';
import { Waybill, OrderType, WaybillChangeLog } from './types';
import { Settings, HelpCircle, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function App() {
  const [openTabs, setOpenTabs] = useState<string[]>(['运单', '常量管理']);
  const [currentTab, setCurrentTab] = useState<string>('运单');
  const [currentSubView, setCurrentSubView] = useState<string>('运单');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('濉樺帵浠?');
  const [customerCreateSeed, setCustomerCreateSeed] = useState<CustomerCreateSeed | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [modalOrderType, setModalOrderType] = useState<OrderType>('快速下单');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const [waybillLogs, setWaybillLogs] = useState<WaybillChangeLog[]>([]);
  const logIdRef = useRef(1);
  const addWaybillLog = (waybillId: string, action: WaybillChangeLog['action'], field: string, oldValue: string, newValue: string, operator = '天朗（付豪）') => {
    setWaybillLogs((prev) => [{ id: logIdRef.current++, waybillId, action, field, oldValue, newValue, operator, timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ') }, ...prev]);
  };

  const [waybills, setWaybills] = useState<Waybill[]>([]);

  const handleTabChange = (tabName: string) => setCurrentTab(tabName);
  const handleCloseTab = (tabName: string) => {
    const updatedTabs = openTabs.filter((t) => t !== tabName);
    setOpenTabs(updatedTabs);
    if (currentTab === tabName) setCurrentTab(updatedTabs[updatedTabs.length - 1] || '运单');
  };

  const handleSaveWaybill = (newWaybill: Waybill) => {
    setWaybills((prev) => [newWaybill, ...prev]);
    addWaybillLog(newWaybill.id, '创建', '运单', '-', '创建运单');
  };
  const handleDeleteWaybills = (idsToDelete: string[]) => setWaybills((prev) => prev.filter((w) => !idsToDelete.includes(w.id)));
  const handleUpdateWaybillStatus = (id: string, nextStatus: Waybill['status']) => setWaybills((prev) => prev.map((w) => (w.id === id ? { ...w, status: nextStatus } : w)));
  const handleUpdateWaybill = (id: string, patch: Partial<Waybill>) => setWaybills((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  const openHelpCenter = () => {
    setCurrentTab('帮助中心预览');
    if (!openTabs.includes('帮助中心预览')) setOpenTabs((prev) => [...prev, '帮助中心预览']);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      <Sidebar currentSubView={currentSubView} onSubViewChange={(view) => { setCurrentSubView(view); if (!openTabs.includes(view)) setOpenTabs((prev) => [...prev, view]); setCurrentTab(view); }} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header currentTab={currentTab} onTabChange={handleTabChange} selectedWarehouse={selectedWarehouse} onWarehouseChange={setSelectedWarehouse} openTabs={openTabs} onCloseTab={handleCloseTab} addToast={addToast} onOpenHelpCenter={openHelpCenter} />

        {currentTab === '运单' || currentTab === '跟单运单' || currentTab === '业务运单' ? (
          <TableSection waybills={waybills} waybillLogs={waybillLogs} onAddWaybillClick={(orderType: OrderType) => { setModalOrderType(orderType); setIsCreateOpen(true); }} onDeleteWaybills={handleDeleteWaybills} onUpdateWaybillStatus={handleUpdateWaybillStatus} onUpdateWaybill={handleUpdateWaybill} addToast={addToast} />
        ) : currentTab === '贸易方式配置' || currentTab === '贸易方式校验规则查询' ? (
          <RuleConfigPage addToast={addToast} />
        ) : currentTab === '帮助中心' ? (
          <HelpCenterPage addToast={addToast} onOpenReader={openHelpCenter} />
        ) : currentTab === '帮助中心预览' ? (
          <HelpCenterReader />
        ) : currentTab === '海外中转单' ? (
          <OverseasTransitOrderPage addToast={addToast} />
        ) : currentTab === '海外暂存' ? (
          <OverseasTransitPage addToast={addToast} initialView="list" mode="storage" />
        ) : currentTab === '快递单' ? (
          <ExpressOrderPage addToast={addToast} />
        ) : currentTab === '仓库出货' ? (
          <WarehouseShipmentPage addToast={addToast} />
        ) : currentTab === '海外中转单管理' ? (
          <OverseasTransitPage addToast={addToast} initialView="list" />
        ) : currentTab === '中转出库' || currentTab === '仓库概览' || currentTab === '中转入库' ? (
          <WarehouseTransitOutPage addToast={addToast} />
        ) : currentTab === '意向客户' ? (
          <IntendedCustomerPage addToast={addToast} onStartOpening={(customer) => { setCustomerCreateSeed({ requestId: Date.now(), sourceCode: customer.code, companyName: customer.companyName, businessRep: customer.businessRep, merchandiser: customer.merchandiser }); setCurrentSubView('客户'); setCurrentTab('客户'); setOpenTabs((tabs) => (tabs.includes('客户') ? tabs : [...tabs, '客户'])); }} />
        ) : currentTab === '客户' ? (
          <CustomerManagementPage addToast={addToast} createSeed={customerCreateSeed} onCreateSeedHandled={() => setCustomerCreateSeed(null)} />
        ) : currentTab === '用户' ? (
          <UserManagementPage addToast={addToast} />
        ) : currentTab === '营销数据看板' ? (
          <MarketingDashboardPage addToast={addToast} />
        ) : (
          <div className="flex-1 overflow-y-auto p-6">常量管理</div>
        )}

        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span>天图通操作后台 v4.62</span>
            <span>|</span>
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-blue-500" />全链路安全监控已就绪</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />support@tiantuexpress.com</span>
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />400-888-2026</span>
          </div>
        </div>
      </div>

      {isCreateOpen && <CreateModal onClose={() => setIsCreateOpen(false)} onSave={(newWaybill) => { handleSaveWaybill(newWaybill); setIsCreateOpen(false); }} operatorName="天朗（付豪）" addToast={addToast} initialOrderType={modalOrderType} />}
      <NotificationToast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
