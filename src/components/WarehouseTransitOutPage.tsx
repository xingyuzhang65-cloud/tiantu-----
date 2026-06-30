import React, { useState } from 'react';
import { ChevronDown, Download, Plus, Search, Settings2, Trash2 } from 'lucide-react';

interface WarehouseTransitOutPageProps {
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

interface TransitOrderRow {
  id: string;
  fromWarehouse: string;
  toWarehouse: string;
  tickets: number;
  pieces: number;
  volume: string;
  routeStatus: string;
  createTime: string;
  creator: string;
}

const transitOrders: TransitOrderRow[] = [
  ['ZZTXC202605290001', '塘厦仓', '金义仓', 1, 1, '0.021', '已装车', '2026-05-29 14:20:18', '管理员'],
  ['ZZTJC202604130003', '天津仓', '石家庄仓', 1, 1, '0.021', '已装车', '2026-04-13 17:17:53', '管理员'],
  ['ZZTXC202604130002', '塘厦仓', '福永仓', 1, 1, '0.021', '已装车', '2026-04-13 17:10:28', '天翔'],
  ['ZZTXC202604130001', '塘厦仓', '福永仓', 2, 2, '0.108', '已装车', '2026-04-13 17:04:02', '天翔'],
  ['ZZXMC202603310005', '厦门仓', '泉州仓', 2, 2, '0.042', '已装车', '2026-03-31 09:55:10', '管理员'],
  ['ZZXMC202603310004', '宁波仓', '厦门仓', 1, 1, '0.012', '已装车', '2026-03-31 09:54:28', '管理员'],
  ['ZZXMC202603310003', '厦门仓', '福州仓', 1, 1, '0.015', '已装车', '2026-03-31 09:53:45', '管理员'],
  ['ZZXMC202603310002', '厦门仓', '青岛仓', 1, 1, '0.021', '已装车', '2026-03-31 09:53:00', '管理员'],
  ['ZZGZC202603160005', '广州仓', '塘厦仓', 2, 2, '0.086', '已装车', '2026-03-16 16:45:23', '天翔'],
  ['ZZJHC202603160004', '金华仓', '港投仓', 1, 1, '0.065', '已装车', '2026-03-16 16:36:04', '管理员'],
  ['ZZTXC202603160003', '塘厦仓', '金华仓', 1, 1, '0.065', '已装车', '2026-03-16 16:34:27', '管理员'],
  ['ZZTXC202603160001', '塘厦仓', '金华仓', 1, 1, '0.065', '已装车', '2026-03-16 14:30:20', '管理员'],
  ['ZZJHC202512110001', '金华仓', '福州仓', 3, 14, '0.122', '已装车', '2025-12-11 14:27:01', '管理员'],
  ['ZZFSC202511220001', '佛山仓', '汕头仓', 1, 5, '0.005', '已装车', '2025-11-22 15:26:13', '管理员'],
  ['ZZQDC202509190009', '青岛仓', '南城仓', 1, 1, '0.032', '已装车', '2025-09-19 14:59:57', '管理员'],
  ['ZZFZC202509190008', '福州仓', '南城仓', 1, 2, '0.002', '已装车', '2025-09-19 14:59:20', '管理员'],
  ['ZZQDC202509190006', '青岛仓', '南城仓', 1, 1, '0.001', '已装车', '2025-09-19 14:57:16', '管理员'],
  ['ZZQDC202509190005', '青岛仓', '南城仓', 1, 1, '0.001', '已装车', '2025-09-19 14:34:37', '管理员'],
  ['ZZQDC202509190004', '青岛仓', '福州仓', 1, 1, '0.001', '已装车', '2025-09-19 14:27:09', '管理员'],
  ['ZZTXC202509190003', '塘厦仓', '义乌仓', 1, 1, '0.001', '已装车', '2025-09-19 11:41:30', '管理员'],
  ['ZZTXC202509190002', '塘厦仓', '义乌仓', 1, 1, '0.001', '已装车', '2025-09-19 11:39:21', '管理员'],
  ['ZZTXC202509190001', '塘厦仓', '福州仓', 1, 1, '0.001', '已装车', '2025-09-19 11:38:01', '管理员'],
  ['ZZFZC202507190002', '福州仓', '汕头仓', 1, 1, '0.288', '已装车', '2025-07-19 16:49:17', '管理员'],
  ['ZZFZC202507180004', '福州仓', '汕头仓', 1, 2, '0.002', '已装车', '2025-07-18 16:47:55', '管理员'],
  ['ZZQDC202507180003', '青岛仓', '汕头仓', 1, 2, '0.25', '已装车', '2025-07-18 16:35:58', '管理员'],
  ['ZZFSC202502140001', '佛山仓', '厦门仓', 2, 2, '0.036', '已装车', '2025-02-14 10:12:18', 'test'],
  ['ZZTXC202502130016', '上海仓', '泉州仓', 1, 2, '0', '已装车', '2025-02-13 18:08:48', 'test'],
  ['ZZFSC202502130014', '佛山仓', '中山仓', 1, 2, '0.002', '已装车', '2025-02-13 15:28:08', '管理员'],
  ['ZZTXC202502130005', '上海仓', '厦门仓', 8, 10, '0.002', '已装车', '2025-02-13 11:36:00', 'test'],
  ['ZZTXC202502130004', '上海仓', '韶光仓', 13, 13, '0.016', '已装车', '2025-02-13 10:52:41', '管理员'],
  ['ZZFSC202502130003', '佛山仓', '厦门仓', 12, 18, '0.739', '已装车', '2025-02-13 10:33:33', '管理员'],
].map(([id, fromWarehouse, toWarehouse, tickets, pieces, volume, routeStatus, createTime, creator]) => ({
  id: String(id),
  fromWarehouse: String(fromWarehouse),
  toWarehouse: String(toWarehouse),
  tickets: Number(tickets),
  pieces: Number(pieces),
  volume: String(volume),
  routeStatus: String(routeStatus),
  createTime: String(createTime),
  creator: String(creator),
}));

export default function WarehouseTransitOutPage({ addToast }: WarehouseTransitOutPageProps) {
  const [activeTab, setActiveTab] = useState('未出库');

  return (
    <div className="flex-1 overflow-auto bg-slate-100 p-4 font-sans text-slate-700 max-h-[calc(100vh-3rem)]">
      <div className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-[auto_minmax(220px,1fr)_auto_minmax(220px,1fr)_auto_minmax(220px,1fr)_140px_140px_140px] items-center gap-3 text-xs">
          <label className="font-semibold text-slate-700">运单号</label>
          <input className="h-8 rounded border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="支持批量搜索多个,号隔开" />
          <label className="font-semibold text-slate-700">中转单号</label>
          <input className="h-8 rounded border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="支持批量搜索多个,号隔开" />
          <label className="font-semibold text-slate-700">转入仓</label>
          <select className="h-8 rounded border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <option>转入仓</option>
            <option>金义仓</option>
            <option>福永仓</option>
            <option>厦门仓</option>
          </select>
          <button type="button" onClick={() => addToast('已查询中转出库数据', 'success')} className="flex h-8 items-center justify-center gap-1 rounded bg-[#004bb1] text-xs font-bold text-white hover:bg-[#003b91]">
            <Search className="h-3.5 w-3.5" />
            查询
          </button>
          <button type="button" onClick={() => addToast('已重置仓库筛选条件', 'info')} className="h-8 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50">重置</button>
          <button type="button" onClick={() => addToast('高级筛选已展开', 'info')} className="flex h-8 items-center justify-center gap-1 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <ChevronDown className="h-3.5 w-3.5" />
            展开
          </button>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-8 border-b border-slate-200 text-xs font-bold">
          {[
            ['未出库', 41],
            ['已出库', 61],
            ['全部', 102],
          ].map(([tab, count]) => (
            <button
              key={String(tab)}
              type="button"
              onClick={() => setActiveTab(String(tab))}
              className={`relative px-1 pb-3 ${activeTab === tab ? 'text-[#004bb1]' : 'text-slate-600 hover:text-[#004bb1]'}`}
            >
              {tab}({count})
              {activeTab === tab && <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-[#004bb1]" />}
            </button>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => addToast('创建中转单功能为展示', 'info')} className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-2 text-xs font-bold text-white hover:bg-[#003b91]">
              <Plus className="h-3.5 w-3.5" />
              创建中转单
            </button>
            <button type="button" onClick={() => addToast('导出中转单功能为展示', 'info')} className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-2 text-xs font-bold text-white hover:bg-[#003b91]">
              <Download className="h-3.5 w-3.5" />
              导出中转单
            </button>
            <button type="button" onClick={() => addToast('请选择要删除的中转单', 'warning')} className="flex items-center gap-1 rounded bg-rose-500 px-3 py-2 text-xs font-bold text-white hover:bg-rose-600">
              <Trash2 className="h-3.5 w-3.5" />
              删除
            </button>
          </div>
          <button type="button" onClick={() => addToast('表头列设置功能为展示', 'info')} className="rounded bg-[#004bb1] p-2 text-white hover:bg-[#003b91]" aria-label="表头设置">
            <Settings2 className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full min-w-[1380px] table-fixed border-collapse text-[11px]">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="w-10 border border-slate-200 px-2 py-2 text-center"><input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" /></th>
                <th className="w-44 border border-slate-200 px-3 py-2 text-center">中转单号</th>
                <th className="w-44 border border-slate-200 px-3 py-2 text-center">转出仓</th>
                <th className="w-44 border border-slate-200 px-3 py-2 text-center">转入仓</th>
                <th className="w-16 border border-slate-200 px-3 py-2 text-center">票数</th>
                <th className="w-16 border border-slate-200 px-3 py-2 text-center">件数</th>
                <th className="w-16 border border-slate-200 px-3 py-2 text-center">方数</th>
                <th className="w-44 border border-slate-200 px-3 py-2 text-center">当前中转路由</th>
                <th className="w-44 border border-slate-200 px-3 py-2 text-center">创建时间</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">创建人</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {transitOrders.map((row) => (
                <tr key={row.id} className="h-8 text-slate-700 hover:bg-blue-50/30">
                  <td className="border border-slate-200 px-2 text-center"><input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" /></td>
                  <td className="border border-slate-200 px-3 text-center font-mono font-semibold text-blue-500">{row.id}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.fromWarehouse}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.toWarehouse}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.tickets}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.pieces}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.volume}</td>
                  <td className="border border-slate-200 px-3 text-center">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-500">{row.routeStatus}</span>
                  </td>
                  <td className="border border-slate-200 px-3 text-center font-mono text-slate-500">{row.createTime}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.creator}</td>
                  <td className="border border-slate-200 px-3 text-center">
                    <button type="button" onClick={() => addToast(`查看 ${row.id} 日志`, 'info')} className="font-semibold text-blue-500 hover:underline">日志</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-5 border-t border-slate-100 px-2 py-3 text-xs text-slate-600">
          <span>共 41 条</span>
          <select className="h-8 rounded border border-slate-300 bg-white px-3 outline-none">
            <option>100条/页</option>
            <option>50条/页</option>
            <option>20条/页</option>
          </select>
          <button type="button" className="text-slate-300">&lt;</button>
          <span className="font-bold text-blue-500">1</span>
          <button type="button" className="text-slate-300">&gt;</button>
          <span>前往</span>
          <input value="1" readOnly className="h-8 w-14 rounded border border-slate-300 px-2 text-center outline-none" />
          <span>页</span>
        </div>
      </div>
    </div>
  );
}
