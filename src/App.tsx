import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TableSection from './components/TableSection';
import CreateModal from './components/CreateModal';
import NotificationToast, { ToastMessage } from './components/NotificationToast';
import { Waybill, OrderType } from './types';
import { Settings, HelpCircle, Layers, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export default function App() {
  // Tabs management
  const [openTabs, setOpenTabs] = useState<string[]>(['运单', '常量管理']);
  const [currentTab, setCurrentTab] = useState<string>('运单');
  const [currentSubView, setCurrentSubView] = useState<string>('运单');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('塘厦仓');

  // Keep the waybill list as the default landing view after refresh.
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [modalOrderType, setModalOrderType] = useState<OrderType>('快捷下单');

  // Active Toast list
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Function to drop a new notification toast
  const addToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Mock Logistics Data - Pre-populated with details identical to the user's screenshot
  const [waybills, setWaybills] = useState<Waybill[]>([
    {
      id: 'HD2606161063',
      fbaCode: 'FBA19G6M4C7B',
      description: '需要补充报关抬头, 已到港',
      createTime: '2026-06-16 15:42:25',
      pickupTime: '2026-06-16 16:43:57',
      groupCode: 'USSZ202606160504',
      carrier: '海德运通',
      zipCode: '85043-2356',
      station: '深圳天图',
      customerType: 'vip',
      status: '已收货',
      packagesCount: 15,
      country: '美国',
      insurance: true,
      remarks: '请尽快核对随箱发票',
      customerName: '深圳天图电子有限公司 (VIP)',
      customsDeclarationType: '报关退税',
      tradeMode: '9610'
    },
    {
      id: 'HD2606161099',
      fbaCode: 'FBA19G6N5Y1Z',
      description: '美森快船VIP装运中',
      createTime: '2026-06-16 14:15:22',
      pickupTime: '2026-06-16 15:00:23',
      groupCode: 'USSZ202606160504',
      carrier: '美森尊卡限时达',
      zipCode: '90001-A42',
      station: '深圳天图',
      customerType: 'vip',
      status: '转运中',
      packagesCount: 4,
      country: '美国',
      insurance: false,
      remarks: '带锂电池产品',
      customerName: '付豪跨境电商事业群',
      customsDeclarationType: '托管报关',
      tradeMode: '9710'
    },
    {
      id: 'HD2606162231',
      fbaCode: 'FBA21KK9D12W',
      description: '包装破损，已安排重新缠膜',
      createTime: '2026-06-16 13:02:11',
      pickupTime: '2026-06-16 14:15:33',
      groupCode: 'USSZ202606161109',
      carrier: '卡派高派拼箱',
      zipCode: 'EC1A-1BB',
      station: '上海分拨货站',
      customerType: '基础价格',
      status: '异常件',
      packagesCount: 30,
      country: '英国',
      insurance: true,
      remarks: '品名: 蓝牙耳机充电仓',
      customerName: '深圳天图电子有限公司 (VIP)',
      customsDeclarationType: '报关退税',
      tradeMode: '9810'
    },
    {
      id: 'HD2606163345',
      fbaCode: 'FBA19X8B7C9D',
      description: '空运普货3日急件',
      createTime: '2026-06-16 11:24:55',
      pickupTime: '未揽收',
      groupCode: 'USSZ202606161405',
      carrier: '常润空快3日卡',
      zipCode: '80331-MUC',
      station: '东莞塘厦分中心',
      customerType: '基础价格',
      status: '待揽收',
      packagesCount: 8,
      country: '德国',
      insurance: false,
      remarks: '纸箱尺寸 40*40*50',
      customerName: '常晟供应链集团',
      customsDeclarationType: '报关退税',
      tradeMode: '0110'
    },
    {
      id: 'HD2606164412',
      fbaCode: 'FBA19K7C5W2Y',
      description: '大件托盘海运拼车',
      createTime: '2026-06-16 09:12:44',
      pickupTime: '2026-06-16 10:22:15',
      groupCode: 'USSZ202606160504',
      carrier: '海德运通',
      zipCode: '85043-2356',
      station: '义乌中转营地',
      customerType: 'vip',
      status: '转运中',
      packagesCount: 22,
      country: '美国',
      insurance: true,
      remarks: '2个托盘缠拉伸膜',
      customerName: '上海豪迅美中快递中心',
      customsDeclarationType: '托管报关',
      tradeMode: '1039'
    },
    {
      id: 'HD2606158812',
      fbaCode: 'FBA24M9V1K3S',
      description: '清关顺利，已经交付UPS派送',
      createTime: '2026-06-15 16:32:10',
      pickupTime: '2026-06-15 18:22:30',
      groupCode: 'USSZ202606159981',
      carrier: '海德运通',
      zipCode: '90001-F32B',
      station: '深圳天图',
      customerType: '基础价格',
      status: '已收货',
      packagesCount: 12,
      country: '美国',
      insurance: true,
      remarks: '后补清关要素',
      customerName: '英国海航直运有限公司',
      customsDeclarationType: '报关退税',
      tradeMode: '9610'
    },
    {
      id: 'HD2606157720',
      fbaCode: 'FBA25Q1A8L2N',
      description: '资料待补齐，贸易方式未确认',
      createTime: '2026-06-15 14:08:19',
      pickupTime: '未揽收',
      groupCode: 'USSZ202606157720',
      carrier: '美国21日达',
      zipCode: '91752-ONT8',
      station: '塘厦仓',
      customerType: '普通客户',
      status: '待揽收',
      packagesCount: 6,
      country: '美国',
      insurance: false,
      remarks: '客户暂未提交报关贸易方式',
      customerName: '东莞跨境贸易样品客户',
      customsDeclarationType: '报关退税'
    },
    {
      id: 'HD2606156638',
      fbaCode: 'FBA26B7C2M9P',
      description: '托管资料审核中',
      createTime: '2026-06-15 10:36:42',
      pickupTime: '2026-06-15 12:05:18',
      groupCode: 'USSZ202606156638',
      carrier: '美森尊卡限时达',
      zipCode: '90001-LAX',
      station: '深圳天图货站',
      customerType: '基础价格',
      status: '转运中',
      packagesCount: 9,
      country: '美国',
      insurance: true,
      remarks: '旧单迁移，贸易方式为空',
      customerName: '深圳星链家居出口部',
      customsDeclarationType: '托管报关'
    },
    {
      id: 'HD2606145526',
      fbaCode: 'FBA27N4R6T8V',
      description: '欧洲线普货待补申报',
      createTime: '2026-06-14 17:22:08',
      pickupTime: '2026-06-14 18:40:30',
      groupCode: 'USSZ202606145526',
      carrier: '卡派高派拼箱',
      zipCode: '80331-MUC',
      station: '上海分拨货站',
      customerType: 'vip',
      status: '已收货',
      packagesCount: 18,
      country: '德国',
      insurance: false,
      remarks: '历史导入数据未带贸易方式字段',
      customerName: '上海欧线供应链客户'
    }
  ]);

  // Tab operators
  const handleTabChange = (tabName: string) => {
    setCurrentTab(tabName);
    addToast(`导航至 [${tabName}] 工作窗口`, 'info');
  };

  const handleCloseTab = (tabName: string) => {
    const updatedTabs = openTabs.filter(t => t !== tabName);
    setOpenTabs(updatedTabs);
    
    // Auto shift active tab
    if (currentTab === tabName) {
      setCurrentTab(updatedTabs[updatedTabs.length - 1] || '运单');
    }
    addToast(`已关闭 [${tabName}] 标签页`, 'info');
  };

  // Add new manual waybill callback
  const handleSaveWaybill = (newWaybill: Waybill) => {
    setWaybills(prev => [newWaybill, ...prev]);
  };

  // Delete waybills
  const handleDeleteWaybills = (idsToDelete: string[]) => {
    setWaybills(prev => prev.filter(w => !idsToDelete.includes(w.id)));
  };

  // Update Waybill Status
  const handleUpdateWaybillStatus = (id: string, nextStatus: Waybill['status']) => {
    setWaybills(prev => prev.map(w => {
      if (w.id === id) {
        let updateTime = w.pickupTime;
        if (nextStatus !== '待揽收' && w.pickupTime === '未揽收') {
          // auto fill pickup time
          updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        } else if (nextStatus === '待揽收') {
          updateTime = '未揽收';
        }
        return { ...w, status: nextStatus, pickupTime: updateTime };
      }
      return w;
    }));
  };

  const handleUpdateWaybill = (id: string, patch: Partial<Waybill>) => {
    setWaybills(prev => prev.map(w => (w.id === id ? { ...w, ...patch } : w)));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      
      {/* Sidebar subsystem (Multi-level custom panel) */}
      <Sidebar 
        currentSubView={currentSubView}
        onSubViewChange={(view) => {
          setCurrentSubView(view);
          if (!openTabs.includes(view)) {
            setOpenTabs(prev => [...prev, view]);
          }
          setCurrentTab(view);
          addToast(`已切换子视图: ${view}`, 'info');
        }}
      />

      {/* Primary Workspace Panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header toolbar component */}
        <Header 
          currentTab={currentTab}
          onTabChange={handleTabChange}
          selectedWarehouse={selectedWarehouse}
          onWarehouseChange={setSelectedWarehouse}
          openTabs={openTabs}
          onCloseTab={handleCloseTab}
          addToast={addToast}
        />

        {/* Inner page router/view switch by Tabs */}
        {currentTab === '运单' || currentTab === '跟单运单' || currentTab === '业务运单' ? (
          <TableSection 
            waybills={waybills}
            onAddWaybillClick={(orderType: OrderType) => {
              setModalOrderType(orderType);
              setIsCreateOpen(true);
              addToast(`手动申报面板 [${orderType}] 连接中`, 'info');
            }}
            onDeleteWaybills={handleDeleteWaybills}
            onUpdateWaybillStatus={handleUpdateWaybillStatus}
            onUpdateWaybill={handleUpdateWaybill}
            addToast={addToast}
          />
        ) : (
          /* General Constant Parameter manager and settings views */
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm max-w-4xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-150 pb-3">
                <Settings className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">常量管理与计费系数</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                本面板支持对集货货站、附加费收费比例、各渠道的基础费率系数（Volumetric Weight Factor）进行微调。数据修改成功后自动应用到“创建运单”核算中。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-semibold text-xs text-slate-700 block">空派重泡货界定参数</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">1 CBM = </span>
                    <input type="text" defaultValue="167 KGS" className="rounded border bg-white px-2 py-1 text-xs font-mono w-28 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <span className="text-[10px] text-slate-400">（美东线专供）</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-semibold text-xs text-slate-700 block">港口附加燃料附加费点数</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">加点比率 (FSC) </span>
                    <input type="text" defaultValue="14.22 %" className="rounded border bg-white px-2 py-1 text-xs font-mono w-28 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => addToast('参数配置更新成功，系统缓存已洗牌', 'success')}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-all duration-150 shadow-md shadow-blue-100"
                >
                  保存参数
                </button>
              </div>
            </div>

            {/* Useful industrial documentation cards */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 max-w-4xl shadow-md flex items-center justify-between">
              <div className="space-y-1.5 max-w-lg">
                <span className="inline-block bg-blue-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">天图跨境安全须知</span>
                <h4 className="text-sm font-bold">跨境出口货物检验要素与反恐舱单申报要求</h4>
                <p className="text-[11px] text-slate-350 leading-relaxed">
                  凡属带电、带磁、液体粉末的亚马逊集港产品，务必在备注栏目详细注释MSDS和随航证书编号，否则可能会引起扣港清拆。
                </p>
              </div>
              <HelpCircle className="h-10 w-10 text-blue-500 opacity-60 hidden sm:block shrink-0 ml-4" />
            </div>
          </div>
        )}

        {/* Global Floating Footer Help Desk Info (Minimal, professional logistics footer) */}
        <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 select-none">
          <div className="flex items-center gap-4">
            <span>天图通逊操作后台 v4.62 (高级版)</span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              全链路安全监控已就绪
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              support@tiantuexpress.com
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              400-888-2026
            </span>
          </div>
        </div>
      </div>

      {/* Floating active Create Waybill Modal Overlay */}
      {isCreateOpen && (
        <CreateModal 
          onClose={() => {
            setIsCreateOpen(false);
            addToast('已暂关闭运单申报对话框，您可以在主页随时点击“创建运单”重新调起。', 'info');
          }}
          onSave={(newWaybill) => {
            handleSaveWaybill(newWaybill);
            setIsCreateOpen(false);
          }}
          operatorName="天朗（付豪）"
          addToast={addToast}
          initialOrderType={modalOrderType}
        />
      )}

      {/* Toast alert managers */}
      <NotificationToast toasts={toasts} removeToast={removeToast} />

    </div>
  );
}
