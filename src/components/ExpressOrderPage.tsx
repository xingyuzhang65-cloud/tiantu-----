import React, { useState } from 'react';
import { ChevronDown, Search, Settings2 } from 'lucide-react';

interface ExpressOrderPageProps {
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

interface ExpressOrderRow {
  waybillNo: string;
  customerOrderNo: string;
  platform: string;
  businessUnit: string;
  expressType: string;
  customerName: string;
  shippingAccount: string;
  service: string;
  recipient: string;
  destination: string;
  zipCode: string;
  pieces: number;
  weight: string;
  declaredValue: string;
  currency: string;
  remote: string;
  error: string;
  createTime: string;
}

const expressRows: ExpressOrderRow[] = [
  ['PT60414174609404000...', 'YJ24090903412-PT0003...', '欧速清', '广州天图', '欧线', '又人供应链', '心一供应链', 'UPS-6981X11', 'SMF3', '美国', '95206-8202', 15, '150', '810', 'USD', '否', '服务提示', '2026-05-25 14:21:56'],
  ['PT60414174609404000...', 'WTT240911013-PT0003...', '欧速清', '深圳天图', '欧线', '舰氏国际', '心一供应链', 'UPS-6981X11', 'GEU3', '美国', '85326', 2, '20', '312.48', 'USD', '否', '服务提示', '2026-05-25 14:21:56'],
  ['PT60414150526960000...', 'CC260310149-PT00087...', 'k5', '深圳天图', '欧线', '塘厦测试客户', 'XY', 'DEDPPD', 'NBZSMX', '英国', '91710', 1, '10', '200', 'USD', '否', '客户系统已取消', '2026-05-25 14:16:57'],
  ['USSZAS2605230006', 'USSZAS2605230006', 'QOT', '深圳天图', '欧线', '郑志强', '', 'EU-UPS-X1', '', '美国', '', 1, '10', '0', 'USD', '否', '没有找到可用服务', '2026-05-25 14:15:51'],
  ['USSZAS2605230004', 'USSZAS2605230004', 'QOT', '深圳天图', '欧线', '郑志强', '', 'EU-UPS-X1', '', '美国', '', 1, '10', '0', 'USD', '否', '没有找到可用服务', '2026-05-25 14:15:51'],
  ['UKSZ202601190001', '2026011903', '欧拉拉', '深圳天图', '欧线', '郑志强', 'SZYY001', 'OLL-EU-FBA', 'RDU4', '德国', '28303', 1, '10', '6000', 'CNY', '否', 'depot code error', '2026-03-07 16:00:08'],
  ['UKSZ202601200012', '2026012004', '欧速清', '深圳天图', '欧线', '郑志强', '心一供应链', 'UPS-6982', '', '德国', '', 1, '10', '0', 'CNY', '否', '收件人姓名异常', '2026-03-07 15:59:39'],
  ['SZ202512050008', '120510', 'CONWEST', '深圳天图', '欧线', '塘厦测试客户', '', '5', '天等', '德国', '430000', 1, '12', '6000', 'CNY', '否', 'CW系统不支持', '2025-12-05 18:50:35'],
  ['SZ202512050004', '120506', 'CONWEST', '深圳天图', '欧线', '塘厦测试客户', '', '5', '天等', '法国', '430000', 1, '20', '6000', 'CNY', '否', 'CW渠道仅支持部分地区', '2025-12-05 17:27:55'],
  ['USSZ202512050002', '120502', 'CONWEST', '深圳天图', '欧线', '塘厦测试客户', '', '5', 'DTM2', '美国', '44145', 1, '10', '6000', 'USD', '否', '打单平台仅支持英文', '2025-12-05 17:04:38'],
  ['USSZ202512040027', '120410', 'CONWEST', '深圳天图', '欧线', '香港港投', '', '5', 'ABE3', '德国', '18031-1536', 1, '10', '6000', 'USD', '否', 'CW渠道仅支持部分服务', '2025-12-05 16:41:24'],
  ['USSZ202512040025', '120408', 'CONWEST', '深圳天图', '欧线', '万邦易达-海外仓', '', '5', 'ABE3', '美国', '18031-1536', 1, '10', '6000', 'USD', '否', 'CW渠道仅支持部分服务', '2025-12-04 21:44:21'],
  ['USSZ202511250002', 'USSZAS2508261010_09...', '进取', '深圳天图', '美线', '郑志强-美国海外...', 'zhangfang@tiantun...', 'FEDEX-OVERSIZE NJ', 'ABE2', '美国', '18031-1533', 1, '10.21', '229.86', 'USD', '否', '填写收件人失败', '2025-11-28 11:18:02'],
  ['UKGZ202510240028', '2025102426', '欧速清', '广州天图', '欧线', '迈诺特测试群3', '心一供应链', 'UPS-6981', 'ABE3', '英国', '18031-1536', 1, '15', '150', 'USD', '否', '服务商未响应', '2025-11-04 15:31:26'],
  ['USTT202509250014', 'ORD2025091016004054...', 'ZX', '深圳市天图通逊...', '欧线', '安盛', 'SZXY', '0030004', 'ONT8', '美国', '92551-9534', 1, '11', '11', 'USD', '否', '收件人公司缺失', '2025-10-24 18:30:18'],
  ['SZ202509150003', '20250915-1', '佳邮ShipOS', '深圳天图', '美线', '塘厦测试客户', '', '1620', 'ABE2', '加拿大', 'L6Y 6L5', 1, '10', '150', 'CAD', '否', '接口报错：地址异常', '2025-10-23 15:03:02'],
  ['USSZ202509150016', '0915-7', '佳邮ShipOS', '深圳天图', '美线', '塘厦测试客户', '', '1620', 'ABE2', '美国', '97317-8983', 1, '10', '150', 'USD', '否', '接口报错：服务不可达', '2025-10-23 14:47:08'],
  ['USSZ202509230051', '098799322', 'Dragon', '深圳天图', '美线', '迈诺特测试群1', '', '221122', '芝加哥仓', '美国', '97317-8983', 1, '10', '110', 'USD', '否', '### Error quota', '2025-10-15 14:07:04'],
  ['USSZ202509150008', '5252525', 'Dragon', '深圳天图', '美线', '火箭国际物流', '', '221121', '芝加哥仓', '美国', '92336-1123', 2, '75', '0', 'USD', '否', '### Error upload', '2025-10-13 16:23:17'],
  ['USSZ202509190020', 'USSZAS2411110002_09...', 'K-新智慧', '深圳天图', '欧线', '郑志强-美国海外...', 'tiantutongxun', 'DPD_SEA_TTU', 'ONT8', '美国', '92551-9534', 2, '57', '800', 'USD', '否', '所选服务不匹配', '2025-09-27 18:18:02'],
  ['USSZ202509250002', '0925-1', '欧拉拉', '深圳天图', '欧线', '塘厦测试客户', 'SZXY001', 'OLL-EU-FBA', 'MGE1', '美国', '30517-3002', 1, '15', '738', 'USD', '否', 'Connect timeout', '2025-09-26 11:39:33'],
  ['USSZ202509020017', '1414141414', '中国', '深圳天图', '美线', '塘厦测试客户', 'US1038', 'UPS@Gr3-14住宅', 'MGE1', '美国', '30517-3002', 1, '42.5', '0', 'USD', '否', '根据排货规则匹配失败', '2025-09-02 17:32:45'],
  ['USSZAS2509020003', 'USSZAS2509020003', '欧速清', '深圳天图', '欧线', '郑志强', '心一供应链', 'UPS-6981X11', '', '美国', '', 1, '10', '0', 'USD', '否', '收件人姓名异常', '2025-09-02 16:47:14'],
  ['UKSZ202508040003', 'ITTEST20250804', 'YSD-新智慧', '深圳天图', '欧线', '美线测试账号', 'tiantutongxun', '108', '', '英国', '', 3, '30', '0', 'USD', '否', 'depot code error', '2025-08-04 10:56:16'],
  ['UKGZ202506230043', 'test678678679-1', '通途国际', '广州天图', '欧线', '迈诺特测试群2', '7662230', '越南运正报班车', 'YYZ7', '加拿大', 'L7E 4L8', 1, '3', '181.5', 'EUR', '否', '未设置单号规则', '2025-07-01 17:10:21'],
  ['USSZ202506130020', 'TEST34343534', '佳邮', '深圳天图', '美线', '多多贸易', '', '3928', 'YYZ7', '加拿大', 'L7E 4L8', 1, '1.2', '1', 'USD', '否', '余额不足', '2025-06-13 12:07:32'],
  ['USSZ202506070013', 'TESTS25060300023', '中国', '深圳天图', '美线', '火箭国际物流', 'US1038', 'UPS@Gr3-GLA住宅', 'ZGCK', '美国', '15062', 2, '66', '200', 'USD', '否', '服务商提示', '2025-06-09 10:53:51'],
].map(([waybillNo, customerOrderNo, platform, businessUnit, expressType, customerName, shippingAccount, service, recipient, destination, zipCode, pieces, weight, declaredValue, currency, remote, error, createTime]) => ({
  waybillNo: String(waybillNo),
  customerOrderNo: String(customerOrderNo),
  platform: String(platform),
  businessUnit: String(businessUnit),
  expressType: String(expressType),
  customerName: String(customerName),
  shippingAccount: String(shippingAccount),
  service: String(service),
  recipient: String(recipient),
  destination: String(destination),
  zipCode: String(zipCode),
  pieces: Number(pieces),
  weight: String(weight),
  declaredValue: String(declaredValue),
  currency: String(currency),
  remote: String(remote),
  error: String(error),
  createTime: String(createTime),
}));

export default function ExpressOrderPage({ addToast }: ExpressOrderPageProps) {
  const [activeTab, setActiveTab] = useState('待处理');

  return (
    <div className="flex-1 overflow-auto bg-slate-100 p-4 font-sans text-slate-700 max-h-[calc(100vh-3rem)]">
      <div className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-[auto_minmax(220px,1fr)_auto_minmax(220px,1fr)_auto_minmax(220px,1fr)_140px_140px_140px] items-center gap-3 text-xs">
          <label className="font-semibold text-slate-700">运单号</label>
          <input className="h-8 rounded border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="输入运单号精准查询" />
          <label className="font-semibold text-slate-700">客户单号</label>
          <input className="h-8 rounded border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="输入客户单号精准查询" />
          <label className="font-semibold text-slate-700">经营单位</label>
          <input className="h-8 rounded border border-slate-300 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="经营单位" />
          <button type="button" onClick={() => addToast('已查询快递单数据', 'success')} className="flex h-8 items-center justify-center gap-1 rounded bg-[#004bb1] text-xs font-bold text-white hover:bg-[#003b91]">
            <Search className="h-3.5 w-3.5" />
            查询
          </button>
          <button type="button" onClick={() => addToast('已重置快递单筛选条件', 'info')} className="h-8 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50">重置</button>
          <button type="button" onClick={() => addToast('高级筛选已展开', 'info')} className="flex h-8 items-center justify-center gap-1 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <ChevronDown className="h-3.5 w-3.5" />
            展开
          </button>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-8 border-b border-slate-200 text-xs font-bold">
          {[
            ['待处理', 95],
            ['待生成标签', 1],
            ['已生成标签', 81],
            ['已取消', 303],
            ['全部', 480],
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
            <button type="button" onClick={() => addToast('快递单数据已更新', 'success')} className="rounded bg-[#004bb1] px-3 py-2 text-xs font-bold text-white hover:bg-[#003b91]">更新</button>
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
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">运单号</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">客户单号</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">打单平台</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">经营单位</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">快递类型</th>
                <th className="w-32 border border-slate-200 px-3 py-2 text-center">客户名称</th>
                <th className="w-32 border border-slate-200 px-3 py-2 text-center">发货账号</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">服务</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">收件人</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">目的地</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">邮编</th>
                <th className="w-16 border border-slate-200 px-3 py-2 text-center">件数</th>
                <th className="w-16 border border-slate-200 px-3 py-2 text-center">实重</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">申报价值</th>
                <th className="w-24 border border-slate-200 px-3 py-2 text-center">打单币种</th>
                <th className="w-16 border border-slate-200 px-3 py-2 text-center">偏远</th>
                <th className="w-40 border border-slate-200 px-3 py-2 text-center">错误</th>
                <th className="w-36 border border-slate-200 px-3 py-2 text-center">创建时间</th>
                <th className="w-28 border border-slate-200 px-3 py-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {expressRows.map((row) => (
                <tr key={`${row.waybillNo}-${row.customerOrderNo}`} className="h-8 text-slate-700 hover:bg-blue-50/30">
                  <td className="border border-slate-200 px-2 text-center"><input type="checkbox" readOnly className="h-3.5 w-3.5 rounded border-slate-300" /></td>
                  <td className="border border-slate-200 px-3 text-center font-mono truncate" title={row.waybillNo}>{row.waybillNo}</td>
                  <td className="border border-slate-200 px-3 text-center font-mono truncate" title={row.customerOrderNo}>{row.customerOrderNo}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.platform}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.businessUnit}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.expressType}</td>
                  <td className="border border-slate-200 px-3 text-center truncate" title={row.customerName}>{row.customerName}</td>
                  <td className="border border-slate-200 px-3 text-center truncate" title={row.shippingAccount}>{row.shippingAccount}</td>
                  <td className="border border-slate-200 px-3 text-center truncate" title={row.service}>{row.service}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.recipient}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.destination}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.zipCode}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.pieces}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.weight}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.declaredValue}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.currency}</td>
                  <td className="border border-slate-200 px-3 text-center">{row.remote}</td>
                  <td className="border border-slate-200 px-3 text-center truncate" title={row.error}>{row.error}</td>
                  <td className="border border-slate-200 px-3 text-center font-mono text-slate-500">{row.createTime}</td>
                  <td className="border border-slate-200 px-3 text-center">
                    <button type="button" onClick={() => addToast(`删除 ${row.waybillNo} 为展示`, 'warning')} className="mr-2 font-semibold text-rose-500 hover:underline">删除</button>
                    <button type="button" onClick={() => addToast(`强制取消 ${row.waybillNo} 为展示`, 'info')} className="font-semibold text-blue-500 hover:underline">强制取消</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-5 border-t border-slate-100 px-2 py-3 text-xs text-slate-600">
          <span>共 95 条</span>
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
