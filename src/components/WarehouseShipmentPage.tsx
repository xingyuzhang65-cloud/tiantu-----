import React, { useState } from 'react';
import { ChevronDown, Download, Search, Settings2, Trash2 } from 'lucide-react';

interface WarehouseShipmentPageProps {
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

interface ShipmentRow {
  shipmentNo: string;
  billNo: string;
  template: string;
  note: string;
  businessUnit: string;
  departTime: string;
  fromSite: string;
  toSite: string;
  boxes: number;
  weight: string;
  loadStart: string;
  volume: string;
  loadEnd: string;
  volumeRatio: string;
  progress: string;
  loss: string;
  customs: string;
  declaredValue: string;
  tag: string;
}

const shipmentRows: ShipmentRow[] = [
  ['CH000006139', 'MY0640', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '多伦多', 12, '180', '', '0.432', '', '0%', '否', '否', '72000', ''],
  ['CH000006138', '', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 3, '56.4', '', '0.063', '', '0%', '否', '否', '60', ''],
  ['CH000006137', '', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '广州南沙港', 3, '54', '', '0.234', '', '0%', '否', '否', '20260', ''],
  ['CH000006136', 'MY0639', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '卡尔加里', 8, '120', '', '0.288', '', '0%', '否', '否', '48000', ''],
  ['CH000006135', 'MY0638', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '塘厦仓', 8, '120', '', '0.288', '', '0%', '否', '否', '48000', ''],
  ['CH000006134', 'MY0637', '亚马逊美国海运', '', '深圳天图', '', '广州仓', '亚特兰大', 8, '120', '', '0.288', '', '0%', '否', '否', '48000', ''],
  ['CH000006133', 'MY0636', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '亚特兰大', 13, '195', '', '0.468', '', '0%', '否', '否', '78000', ''],
  ['CH000006132', '062010', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006131', '06299', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006130', '06298', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006129', '0629567', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006128', '062956', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006127', 'MY0635', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '鄂州机场', 13, '195', '', '0.468', '', '0%', '否', '否', '78000', ''],
  ['CH000006126', '06295', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006125', '06294', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006124', '06293', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006123', '06292', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006122', '06291', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006121', 'MY0634', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '美国萨瓦纳', 13, '195', '', '0.468', '', '0%', '否', '否', '78000', ''],
  ['CH000006120', 'MY0633', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006119', 'MY0632', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '塘厦仓', 13, '195', '', '0.468', '', '0%', '否', '否', '78000', ''],
  ['CH000006118', 'MY0631', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '广州南沙港', 11, '165', '', '0.396', '', '0%', '否', '否', '66000', ''],
  ['CH000006117', '0627', '测试二', '', '深圳市天图通逊...', '', '塘厦仓', '塘厦仓', 1, '0', '', '0', '', '0%', '否', '否', '1120', ''],
  ['CH000006116', 'MY0629', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '广州南沙港', 11, '165', '', '0.396', '', '0%', '否', '否', '66000', ''],
  ['CH000006115', 'MY0628', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '广州南沙港', 3, '45', '', '0.108', '', '0%', '否', '否', '18000', ''],
  ['CH000006114', 'MY0627', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '广州南沙港', 1, '15', '', '0.036', '', '0%', '否', '否', '6000', ''],
  ['CH000006113', '', '', '', '深圳天图', '', '塘厦仓', '美国芝加哥国际机场', 1, '18', '', '0.078', '', '0%', '否', '否', '130', ''],
  ['CH000006112', '', '美国海运', '预打板测试数据-10箱大于', '深圳天图', '', '塘厦仓', '塘厦仓', 58, '1103.97', '', '6.356', '', '0%', '否', '否', '8918.8', 'PRE-PA'],
  ['CH000006111', 'ZHYJ1044', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '美国萨瓦纳', 4, '72', '', '0.312', '', '0%', '否', '否', '12260', ''],
  ['CH000006110', 'ZHYJ1043', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '美国萨瓦纳', 5, '84', '', '0.306', '', '0%', '否', '否', '12033', ''],
  ['CH000006109', 'ZHYJ1042', '亚马逊美国海运', '', '深圳天图', '', '塘厦仓', '美国萨瓦纳', 6, '108', '', '0.468', '', '0%', '否', '否', '306', ''],
].map(([shipmentNo, billNo, template, note, businessUnit, departTime, fromSite, toSite, boxes, weight, loadStart, volume, loadEnd, volumeRatio, progress, loss, customs, declaredValue, tag]) => ({
  shipmentNo: String(shipmentNo),
  billNo: String(billNo),
  template: String(template),
  note: String(note),
  businessUnit: String(businessUnit),
  departTime: String(departTime),
  fromSite: String(fromSite),
  toSite: String(toSite),
  boxes: Number(boxes),
  weight: String(weight),
  loadStart: String(loadStart),
  volume: String(volume),
  loadEnd: String(loadEnd),
  volumeRatio: String(volumeRatio),
  progress: String(progress),
  loss: String(loss),
  customs: String(customs),
  declaredValue: String(declaredValue),
  tag: String(tag),
}));

export default function WarehouseShipmentPage({ addToast }: WarehouseShipmentPageProps) {
  const [activeTab, setActiveTab] = useState('待出货');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fieldClass = "h-8 w-full rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const labelClass = "w-24 shrink-0 text-right text-xs text-slate-600";
  const requiredMark = <span className="mr-0.5 text-red-500">*</span>;

  const selectPlaceholder = (
    <>
      <option value="">请选择</option>
      <option value="塘厦仓">塘厦仓</option>
      <option value="广州仓">广州仓</option>
      <option value="深圳天图">深圳天图</option>
      <option value="亚马逊美国海运">亚马逊美国海运</option>
    </>
  );

  return (
    <div className="flex-1 overflow-auto bg-slate-100 p-4 font-sans text-slate-700 max-h-[calc(100vh-3rem)]">
      <div className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-[auto_minmax(220px,1fr)_auto_minmax(220px,1fr)_auto_minmax(220px,1fr)_140px_140px_140px] items-center gap-3 text-xs">
          <label className="font-semibold text-slate-700">运单号</label>
          <input className="h-8 rounded border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="支持批量搜索多个,号隔开" />
          <label className="font-semibold text-slate-700">出货单</label>
          <input className="h-8 rounded border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="支持批量搜索多个,号隔开" />
          <label className="font-semibold text-slate-700">经营单位</label>
          <input className="h-8 rounded border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="经营单位" />
          <button type="button" onClick={() => addToast('已查询仓库出货数据', 'success')} className="flex h-8 items-center justify-center gap-1 rounded bg-[#004bb1] text-xs font-bold text-white hover:bg-[#003b91]">
            <Search className="h-3.5 w-3.5" />
            查询
          </button>
          <button type="button" onClick={() => addToast('已重置出货筛选条件', 'info')} className="h-8 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50">重置</button>
          <button type="button" onClick={() => addToast('高级筛选已展开', 'info')} className="flex h-8 items-center justify-center gap-1 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <ChevronDown className="h-3.5 w-3.5" />
            展开
          </button>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-8 text-xs font-bold">
            {[
              ['待出货', null],
              ['已出货', null],
              ['全部', null],
            ].map(([tab]) => (
              <button
                key={String(tab)}
                type="button"
                onClick={() => setActiveTab(String(tab))}
                className={`relative px-1 pb-3 ${activeTab === tab ? 'text-[#004bb1]' : 'text-slate-600 hover:text-[#004bb1]'}`}
              >
                {tab}
                {activeTab === tab && <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-[#004bb1]" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pb-2">
            <button type="button" onClick={() => setCreateModalOpen(true)} className="rounded bg-[#004bb1] px-3 py-2 text-xs font-bold text-white hover:bg-[#003b91]">创建出货单</button>
            <button type="button" onClick={() => addToast('导出出货单功能为展示', 'info')} className="flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              <Download className="h-3.5 w-3.5" />
              导出出货单
            </button>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => addToast('放入提单功能为展示', 'info')} className="rounded bg-[#004bb1] px-3 py-2 text-xs font-bold text-white hover:bg-[#003b91]">放入提单</button>
            <button type="button" onClick={() => addToast('出站功能为展示', 'info')} className="rounded bg-[#004bb1] px-3 py-2 text-xs font-bold text-white hover:bg-[#003b91]">出站</button>
            <button type="button" onClick={() => addToast('统计已更新', 'success')} className="rounded bg-[#004bb1] px-3 py-2 text-xs font-bold text-white hover:bg-[#003b91]">更新统计</button>
            <button type="button" onClick={() => addToast('请选择要删除的出货单', 'warning')} className="flex items-center gap-1 rounded bg-rose-500 px-3 py-2 text-xs font-bold text-white hover:bg-rose-600">
              <Trash2 className="h-3.5 w-3.5" />
              删除
            </button>
            <button type="button" onClick={() => addToast('批量操作功能为展示', 'info')} className="flex items-center gap-1 rounded bg-[#004bb1] px-3 py-2 text-xs font-bold text-white hover:bg-[#003b91]">
              批量操作
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <button type="button" onClick={() => addToast('表头列设置功能为展示', 'info')} className="rounded bg-[#004bb1] p-2 text-white hover:bg-[#003b91]" aria-label="表头设置">
            <Settings2 className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full min-w-[1780px] table-fixed border-collapse text-[11px]">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="w-10 border border-slate-200 px-2 py-2 text-center"><input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" /></th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">出货单号</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">提单号</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">运踪模板</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">备注</th>
                <th className="w-32 border border-slate-200 px-3 py-2 text-center">经营单位</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">发出时间</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">发出站点</th>
                <th className="w-32 border border-slate-200 px-3 py-2 text-center">发往站点</th>
                <th className="w-16 border border-slate-200 px-3 py-2 text-center">箱数</th>
                <th className="w-16 border border-slate-200 px-3 py-2 text-center">实重</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">装货开始时间</th>
                <th className="w-20 border border-slate-200 px-3 py-2 text-center">体积</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">装货结束时间</th>
                <th className="w-20 border border-slate-200 px-3 py-2 text-center">体积比</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">装货进度</th>
                <th className="w-16 border border-slate-200 px-3 py-2 text-center">报失</th>
                <th className="w-16 border border-slate-200 px-3 py-2 text-center">清关</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">申报价值</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">垫付标识</th>
                <th className="w-20 border border-slate-200 px-3 py-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {shipmentRows.map((row) => (
                <tr key={row.shipmentNo} className="h-8 text-slate-700 hover:bg-blue-50/30">
                  <td className="border border-slate-200 px-2 text-center"><input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" /></td>
                  <td className="border border-slate-200 px-3 text-center font-mono text-slate-700">{row.shipmentNo}</td>
                  <td className="border border-slate-200 px-3 text-center font-mono">{row.billNo}</td>
                  <td className="border border-slate-200 px-3 text-center truncate" title={row.template}>{row.template}</td>
                  <td className="border border-slate-200 px-3 text-center font-semibold text-red-500 truncate" title={row.note}>{row.note}</td>
                  <td className="border border-slate-200 px-3 text-center truncate" title={row.businessUnit}>{row.businessUnit}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.departTime}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.fromSite}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.toSite}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.boxes}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.weight}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.loadStart}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.volume}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.loadEnd}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.volumeRatio}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.progress}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.loss}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.customs}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.declaredValue}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.tag}</td>
                  <td className="border border-slate-200 px-3 text-center">
                    <button type="button" onClick={() => addToast(`查看 ${row.shipmentNo} 日志`, 'info')} className="font-semibold text-blue-500 hover:underline">日志</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-5 border-t border-slate-100 px-2 py-3 text-xs text-slate-600">
          <span>共 742 条</span>
          <select className="h-8 rounded border border-slate-300 bg-white px-3 outline-none">
            <option>100条/页</option>
            <option>50条/页</option>
            <option>20条/页</option>
          </select>
          <button type="button" className="text-slate-300">&lt;</button>
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <button key={page} type="button" className={page === 1 ? 'font-bold text-blue-500' : 'font-bold text-slate-600'}>{page}</button>
          ))}
          <span className="font-bold text-slate-600">...</span>
          <button type="button" className="font-bold text-slate-600">8</button>
          <button type="button" className="text-slate-500">&gt;</button>
          <span>前往</span>
          <input value="1" readOnly className="h-8 w-14 rounded border border-slate-300 px-2 text-center outline-none" />
          <span>页</span>
        </div>
      </div>

      {createModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-950/45 pt-5">
          <div className="relative w-[520px] overflow-hidden rounded-sm bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-bold text-slate-900">创建出货单</h3>
            </div>

            <div className="relative px-7 py-6">
              <div className="pointer-events-none absolute inset-0 select-none overflow-hidden text-[12px] font-semibold text-slate-200/70">
                {Array.from({ length: 20 }, (_, index) => (
                  <span
                    key={index}
                    className="absolute -rotate-[20deg] whitespace-nowrap"
                    style={{
                      left: `${(index % 3) * 35 + 8}%`,
                      top: `${Math.floor(index / 3) * 15 + 3}%`,
                    }}
                  >
                    管理员2026-06-30
                  </span>
                ))}
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-5 pl-24 text-xs text-slate-700">
                  <span className="text-red-500">*</span>
                  <span>线路</span>
                  {['美线', '欧线'].map((item, index) => (
                    <label key={item} className="flex items-center gap-1.5">
                      <input type="radio" name="shipmentRoute" defaultChecked={index === 1} className="h-3.5 w-3.5 text-blue-600" />
                      <span className={index === 1 ? 'font-semibold text-blue-600' : ''}>{item}</span>
                    </label>
                  ))}
                </div>

                {[
                  ['发出站点', 'select'],
                  ['发往站点', 'select'],
                  ['归属公司', 'select'],
                  ['服务', 'select'],
                  ['运踪模板', 'select'],
                  ['起运港', 'select'],
                  ['目的港', 'select'],
                ].map(([label, type]) => (
                  <label key={label} className="flex items-center gap-3">
                    <span className={labelClass}>{requiredMark}{label}</span>
                    {type === 'select' ? (
                      <select className={fieldClass} defaultValue="">
                        {selectPlaceholder}
                      </select>
                    ) : (
                      <input className={fieldClass} />
                    )}
                  </label>
                ))}

                <label className="flex items-center gap-3">
                  <span className={labelClass}>ETD</span>
                  <input className={fieldClass} placeholder="◎ 选择日期时间" />
                </label>
                <label className="flex items-center gap-3">
                  <span className={labelClass}>ETA</span>
                  <input className={fieldClass} placeholder="◎ 选择日期时间" />
                </label>
                <label className="flex items-center gap-3">
                  <span className={labelClass}>船名</span>
                  <input className={fieldClass} />
                </label>
                <label className="flex items-center gap-3">
                  <span className={labelClass}>航次</span>
                  <input className={fieldClass} />
                </label>
                <label className="flex items-center gap-3">
                  <span className={labelClass}>发出时间</span>
                  <input className={fieldClass} placeholder="◎ 选择日期时间" />
                </label>
                <label className="flex items-start gap-3">
                  <span className={`${labelClass} pt-2`}>参考号</span>
                  <textarea className="h-12 w-full resize-none rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="请输入内容" />
                </label>
                <label className="flex items-start gap-3">
                  <span className={`${labelClass} pt-2`}>备注</span>
                  <textarea className="h-12 w-full resize-none rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="请输入内容" />
                </label>
                <label className="flex items-center gap-3">
                  <span className={labelClass}>{requiredMark}欧线自动打单</span>
                  <select className={fieldClass} defaultValue="否">
                    <option>否</option>
                    <option>是</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  addToast('出货单创建成功', 'success');
                  setCreateModalOpen(false);
                }}
                className="rounded bg-[#004bb1] px-5 py-1.5 text-xs font-bold text-white hover:bg-[#003b91]"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="rounded border border-slate-300 bg-white px-5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
