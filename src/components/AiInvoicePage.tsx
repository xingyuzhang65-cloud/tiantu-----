import React, { useState } from 'react';
import { 
  ArrowLeft, UploadCloud, Plus, Minus, CheckCircle2, 
  Loader2, FileSpreadsheet, Trash2, ArrowRight
} from 'lucide-react';
import { Waybill } from '../types';

interface AiInvoicePageProps {
  onCancel: () => void;
  onSave: (waybills: Waybill[]) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  operatorName: string;
}

interface CargoRow {
  boxNo: string;
  poNumber: string;
  englishName: string;
  chineseName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  material: string;
  customsRegCode: string;
  usage: string;
  brand: string;
  model: string;
  imageLink: string;
  hscode: string;
}

export default function AiInvoicePage({ onCancel, onSave, addToast, operatorName }: AiInvoicePageProps) {
  // Form states mapping precisely to the fields in the screenshot
  const [customer, setCustomer] = useState('');
  const [deliveryStation, setDeliveryStation] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [service, setService] = useState('');
  const [warehouseCode, setWarehouseCode] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [deliveryWeek, setDeliveryWeek] = useState('');
  const [receiverCompany, setReceiverCompany] = useState('');
  const [receiverAddr1, setReceiverAddr1] = useState('');
  const [receiverAddr2, setReceiverAddr2] = useState('');
  const [receiverAddr3, setReceiverAddr3] = useState('');
  const [receiverCity, setReceiverCity] = useState('');
  const [receiverState, setReceiverState] = useState('');
  const [receiverZip, setReceiverZip] = useState('');
  const [receiverCountry, setReceiverCountry] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [customerOrderNo, setCustomerOrderNo] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [hasElectric, setHasElectric] = useState('');
  const [hasMagnet, setHasMagnet] = useState('');
  const [taxPayment, setTaxPayment] = useState('');
  const [declarationType, setDeclarationType] = useState('');
  const [tradeMode, setTradeMode] = useState('');
  const [clearanceType, setClearanceType] = useState('');
  const [vatNo, setVatNo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyTaxNo, setCompanyTaxNo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [exportValue, setExportValue] = useState<number | string>('');
  const [currency, setCurrency] = useState('');

  // Interactive cargo rows (spreadsheet style)
  const [cargoRows, setCargoRows] = useState<CargoRow[]>([
    { boxNo: 'BOX-001', poNumber: '', englishName: '', chineseName: '', unitPrice: 0, quantity: 0, totalPrice: 0, material: '', customsRegCode: '', usage: '', brand: '', model: '', imageLink: '', hscode: '' },
    { boxNo: 'BOX-002', poNumber: '', englishName: '', chineseName: '', unitPrice: 0, quantity: 0, totalPrice: 0, material: '', customsRegCode: '', usage: '', brand: '', model: '', imageLink: '', hscode: '' },
    { boxNo: 'BOX-003', poNumber: '', englishName: '', chineseName: '', unitPrice: 0, quantity: 0, totalPrice: 0, material: '', customsRegCode: '', usage: '', brand: '', model: '', imageLink: '', hscode: '' },
    { boxNo: 'BOX-004', poNumber: '', englishName: '', chineseName: '', unitPrice: 0, quantity: 0, totalPrice: 0, material: '', customsRegCode: '', usage: '', brand: '', model: '', imageLink: '', hscode: '' }
  ]);

  // Loading States
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  // Auto calculate export value from items total
  const recalculateExportValue = (rows: CargoRow[]) => {
    const total = rows.reduce((sum, r) => sum + (r.unitPrice * r.quantity || 0), 0);
    setExportValue(total);
  };

  const handleCargoRowChange = (index: number, field: keyof CargoRow, value: any) => {
    const updated = [...cargoRows];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto totalPrice calculate
    if (field === 'unitPrice' || field === 'quantity') {
      const price = parseFloat(updated[index].unitPrice as any) || 0;
      const qty = parseInt(updated[index].quantity as any) || 0;
      updated[index].totalPrice = price * qty;
    }
    setCargoRows(updated);
    recalculateExportValue(updated);
  };

  const addCargoRow = () => {
    const nextBoxNum = cargoRows.length + 1;
    const newRow: CargoRow = {
      boxNo: `BOX-00${nextBoxNum}`,
      poNumber: '',
      englishName: '',
      chineseName: '',
      unitPrice: 0,
      quantity: 0,
      totalPrice: 0,
      material: '',
      customsRegCode: '',
      usage: '',
      brand: '',
      model: '',
      imageLink: '',
      hscode: ''
    };
    setCargoRows([...cargoRows, newRow]);
    addToast('已追加一行申报箱条目', 'info');
  };

  const removeCargoRow = (idx: number) => {
    if (cargoRows.length <= 1) {
      addToast('必须保留至少一箱货品申报单', 'warning');
      return;
    }
    const updated = cargoRows.filter((_, i) => i !== idx);
    setCargoRows(updated);
    recalculateExportValue(updated);
  };

  // Simulated file upload that fills form with high fidelity template data
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      setIsParsing(true);
      setParsingStep('📡 正在建立天图智能AI解析链路...');
      addToast(`开始对文档 ${file.name} 进行多维智能文本提取 (DEMO模式)`, 'info');

      // Simple pre-fill simulation sequence
      setTimeout(() => {
        setCustomer('付豪跨境电商事业群');
        setDeliveryStation('塘厦仓');
        setDeliveryDate('2026-06-16');
        setService('美线空派');
        setWarehouseCode('ONT8');
        setReceiverName('John Doe');
        setDeliveryWeek('2026年第25周');
        setReceiverCompany('FBA Premium Centers');
        setReceiverAddr1('1234 Logistics Blvd');
        setReceiverAddr2('Suite 400');
        setReceiverCity('Phoenix');
        setReceiverState('Arizona');
        setReceiverZip('85043-2356');
        setReceiverCountry('美国');
        setReceiverPhone('1-321-456-7890');
        setReceiverEmail('receiver@fba.com');
        setCustomerOrderNo('CUST99812423');
        setReferenceId('REF-2026-X49');
        setHasElectric('是');
        setHasMagnet('否');
        setTaxPayment('DDP');
        setDeclarationType('一般贸易报关');
        setClearanceType('一般贸易清关');
        setVatNo('GB123456789');
        setCompanyName('付豪跨境电商事业群');
        setCompanyTaxNo('TAX-8912-3B');
        setRemarks('本单通过随箱发票AI自动提取，货品信息已智能填入表格。');
        setExportValue(3150);
        setCurrency('USD');

        setCargoRows([
          {
            boxNo: 'BOX-001',
            poNumber: 'PO-90141',
            englishName: 'Bluetooth Monitors with Charger',
            chineseName: '车载蓝牙显示器（带充电仓）',
            unitPrice: 15,
            quantity: 120,
            totalPrice: 1800,
            material: 'ABS+塑胶外壳+电芯',
            customsRegCode: 'ZS129031231',
            usage: '车载汽车定位交互',
            brand: 'Tiantu_Tech',
            model: 'TM-X90',
            imageLink: 'http://img.tiantu.com/tm-x90.png',
            hscode: '8528.59.1000'
          },
          {
            boxNo: 'BOX-002',
            poNumber: 'PO-90142',
            englishName: 'Automotive Wireless Charger',
            chineseName: '车载无线充电机',
            unitPrice: 9,
            quantity: 150,
            totalPrice: 1350,
            material: '阻燃PC+电磁感应面板',
            customsRegCode: 'ZS392104321',
            usage: '智能手机车载吸磁充电',
            brand: 'Changsheng',
            model: 'CS-WC01',
            imageLink: 'http://img.tiantu.com/cs-wc01.png',
            hscode: '8504.40.9570'
          }
        ]);

        setIsParsing(false);
        addToast('💡 发票导入成功！已提取 3150 美金订单明细并自动填充！', 'success');
      }, 1000);
    }
  };

  const handleOrderSubmit = () => {
    if (!declarationType) {
      addToast('请选择报关方式', 'warning');
      return;
    }
    if (!clearanceType) {
      addToast('请选择清关方式', 'warning');
      return;
    }

    const validRows = cargoRows.filter(r => r.chineseName && r.quantity > 0);
    if (validRows.length === 0) {
      addToast('请至少填写多箱申报清单中的一票货物名称及数量！', 'warning');
      return;
    }

    const generatedWaybills: Waybill[] = validRows.map((row, idx) => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const waybillId = `HD260616${idx}${randomNum}`;
      return {
        id: waybillId,
        fbaCode: warehouseCode || 'ONT8',
        description: `随箱申报: ${row.chineseName} (${row.model || '标准'}) [箱号: ${row.boxNo}]`,
        createTime: new Date().toLocaleString().replace(/\//g, '-'),
        pickupTime: '未揽收',
        groupCode: `USSZ202606${Math.floor(100000 + Math.random() * 900000)}`,
        carrier: service || '美线海卡',
        zipCode: receiverZip || '85043-2356',
        station: deliveryStation || '塘厦仓',
        customerType: 'vip',
        status: '待揽收',
        packagesCount: 1,
        country: receiverCountry || '美国',
        orderWeek: deliveryWeek || '2026-W25',
        insurance: true,
        hasUploadedInvoice: true,
        remarks: `发票解析单 ${customerOrderNo}. 材质: ${row.material}. 备注: ${remarks}`,
        customerName: customer || '付豪跨境电商事业群',
        customsDeclarationType: declarationType || undefined,
        tradeMode: tradeMode || undefined,
        clearanceType: clearanceType || undefined
      };
    });

    onSave(generatedWaybills);
    addToast(`恭喜！通过随箱发票共生成并下单了 ${generatedWaybills.length} 票集装箱单据！`, 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6 select-none relative z-10 selection:bg-blue-150">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 bg-white -mx-6 -mt-6 px-6 pt-4 sticky top-0 shadow-sm z-30">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="inline-block w-1.5 h-4.5 bg-blue-600 rounded-sm" />
              解析发票下单(新星版)
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              高精准商业发票 / 随箱装箱单 1:1 特制极速填报操作盘
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleOrderSubmit}
            className="rounded bg-[#004bb1] hover:bg-[#003b91] px-5 py-1.5 text-xs font-bold text-white shadow-sm transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>下单</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Upload area perfectly matching specifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg py-8 px-4 bg-slate-50/50 hover:bg-slate-50 transition-all">
          <label className="flex flex-col items-center justify-center cursor-pointer text-center">
            <UploadCloud className="h-10 w-10 text-[#004bb1] mb-2" />
            <span className="rounded bg-[#004bb1] hover:bg-[#003b91] text-white text-xs font-bold px-5 py-2 shadow transition-all block mb-2">
              点击上传
            </span>
            <span className="text-xs text-slate-500">
              请上传发票，文件大小不超过100M
            </span>
            <input 
              type="file" 
              accept=".pdf,image/*,.xlsx,.xls,.csv" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
          {fileName && (
            <div className="mt-4 inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded text-xs font-medium">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>当前已加载: {fileName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Parsing Loader */}
      {isParsing && (
        <div className="rounded-xl border border-blue-150 bg-blue-50/20 p-8 flex flex-col items-center justify-center space-y-2.5 shadow-inner">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-blue-900 animate-pulse">{parsingStep}</p>
        </div>
      )}

      {/* Main 30-Field Detail Form Container */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span className="font-bold text-xs text-slate-800 tracking-wider">委托基本信息 & 完税收件人名册</span>
        </div>

        {/* 30-field Multi-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
          
          {/* Unit 1 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>客户
            </label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="付豪跨境电商事业群">付豪跨境电商事业群</option>
              <option value="深圳天图电子有限公司 (VIP)">深圳天图电子有限公司 (VIP)</option>
              <option value="常晟供应链集团">常晟供应链集团</option>
              <option value="上海豪迅美中快递中心">上海豪迅美中快递中心</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>送货货站
            </label>
            <select
              value={deliveryStation}
              onChange={(e) => setDeliveryStation(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择送货货站</option>
              <option value="塘厦仓">塘厦仓</option>
              <option value="广州仓">广州仓</option>
              <option value="义乌仓">义乌仓</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>国内送仓时间
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-0.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Unit 2 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>服务
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="美线空派">美线空派</option>
              <option value="美线海卡">美线海卡</option>
              <option value="义乌天图">义乌天图</option>
              <option value="英线海卡">英线海卡</option>
              <option value="德线空派">德线空派</option>
              <option value="日本快线">日本快线</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>仓库代码
            </label>
            <select
              value={warehouseCode}
              onChange={(e) => setWarehouseCode(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="ONT8">ONT8</option>
              <option value="LGB8">LGB8</option>
              <option value="LAX9">LAX9</option>
              <option value="BHX4">BHX4</option>
              <option value="CGN7">CGN7</option>
              <option value="YVR4">YVR4</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>收件人姓名
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Unit 3 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              预计送达周
            </label>
            <select
              value={deliveryWeek}
              onChange={(e) => setDeliveryWeek(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">选择周</option>
              <option value="2026年第25周">2026年第25周</option>
              <option value="2026年第26周">2026年第26周</option>
              <option value="2026年第27周">2026年第27周</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              收件人公司
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={receiverCompany}
              onChange={(e) => setReceiverCompany(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              <span className="text-red-500 mr-0.5">*</span>收件人地址一
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={receiverAddr1}
              onChange={(e) => setReceiverAddr1(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Unit 4 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              收件人地址二
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={receiverAddr2}
              onChange={(e) => setReceiverAddr2(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              收件人地址三
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={receiverAddr3}
              onChange={(e) => setReceiverAddr3(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>收件人城市
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={receiverCity}
              onChange={(e) => setReceiverCity(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Unit 5 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              收件人省/州
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={receiverState}
              onChange={(e) => setReceiverState(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>收件人邮编
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={receiverZip}
              onChange={(e) => setReceiverZip(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>收件人国家
            </label>
            <select
              value={receiverCountry}
              onChange={(e) => setReceiverCountry(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="美国">美国</option>
              <option value="英国">英国</option>
              <option value="德国">德国</option>
              <option value="加拿大">加拿大</option>
              <option value="日本">日本</option>
            </select>
          </div>

          {/* Unit 6 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              收件人电话
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              收件人邮箱
            </label>
            <input
              type="email"
              placeholder="请输入"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>客户订单号
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={customerOrderNo}
              onChange={(e) => setCustomerOrderNo(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          {/* Unit 7 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Reference ID
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              带电
            </label>
            <select
              value={hasElectric}
              onChange={(e) => setHasElectric(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="否">否</option>
              <option value="是">是</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              带磁
            </label>
            <select
              value={hasMagnet}
              onChange={(e) => setHasMagnet(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="否">否</option>
              <option value="是">是</option>
            </select>
          </div>

          {/* Unit 8 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>交易方式
            </label>
            <select
              value={taxPayment}
              onChange={(e) => setTaxPayment(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="DDP">DDP</option>
              <option value="DDU">DDU</option>
              <option value="FOB">FOB</option>
              <option value="EXW">EXW</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>报关方式
            </label>
            <select
              value={declarationType}
              onChange={(e) => setDeclarationType(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="报关退税">报关退税</option>
              <option value="托管报关">托管报关</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              贸易方式
            </label>
            <select
              value={tradeMode}
              onChange={(e) => setTradeMode(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="9610">9610</option>
              <option value="9710">9710</option>
              <option value="9810">9810</option>
              <option value="0110">0110</option>
              <option value="1039">1039</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-0.5">*</span>清关方式
            </label>
            <select
              value={clearanceType}
              onChange={(e) => setClearanceType(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="快件清关">快件清关</option>
              <option value="一般贸易清关">一般贸易清关</option>
            </select>
          </div>

          {/* Unit 9 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              VAT号
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={vatNo}
              onChange={(e) => setVatNo(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              公司名称
            </label>
            <select
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择</option>
              <option value="付豪跨境电商事业群">付豪跨境电商事业群</option>
              <option value="深圳天图电子有限公司 (VIP)">深圳天图电子有限公司 (VIP)</option>
              <option value="常晟供应链集团">常晟供应链集团</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              公司税号
            </label>
            <input
              type="text"
              placeholder="请输入"
              value={companyTaxNo}
              onChange={(e) => setCompanyTaxNo(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          {/* Unit 10 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              备注
            </label>
            <input
              type="text"
              placeholder="请输入内部备注"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              真实出口货值
            </label>
            <div className="flex h-8 w-full items-center rounded border border-slate-300 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setExportValue(prev => Math.max(0, (typeof prev === 'number' ? prev : 0) - 100))}
                className="flex h-full w-8 items-center justify-center bg-slate-100 hover:bg-slate-200 border-r border-[#cbd5e1] text-slate-600 font-bold"
              >
                <Minus className="h-3 w-3" />
              </button>
              <input
                type="number"
                placeholder="请输入"
                value={exportValue}
                onChange={(e) => setExportValue(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))}
                className="h-full w-full bg-white text-center text-xs font-semibold focus:outline-none border-none py-0 px-2"
              />
              <button
                type="button"
                onClick={() => setExportValue(prev => (typeof prev === 'number' ? prev : 0) + 100)}
                className="flex h-full w-8 items-center justify-center bg-slate-100 hover:bg-slate-200 border-l border-[#cbd5e1] text-slate-600 font-bold"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              币种
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">请选择币种</option>
              <option value="USD">USD</option>
              <option value="CNY">CNY</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

        </div>
      </div>

      {/* Spreadsheet items list (cargo lines) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <FileSpreadsheet className="h-4.5 w-4.5 text-blue-600" />
            <span>智能拆箱 & 货品申报大明细表 (按箱精确理货)</span>
          </div>

          <button
            type="button"
            onClick={addCargoRow}
            className="rounded border border-indigo-200 bg-indigo-50/50 text-indigo-700 font-semibold text-xs px-2.5 py-1 hover:bg-indigo-50 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>追加纸箱品项</span>
          </button>
        </div>

        {/* Horizontal Scroll Sheet */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left border-collapse min-w-[1500px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold select-none">
                <th className="py-2.5 px-3 border-r border-slate-200 w-20 text-center">操作</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-28 text-center">货箱编号</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-32">PO Number</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-52">产品英文品名 *</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-52">产品中文品名 *</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-32 text-right">产品申报单价 * (USD)</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-28 text-right">产品申报数量 *</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-32 text-right">产品申报总价 * (USD)</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-36">产品材质 *</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-36">产品海关注册码 *</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-36">产品用途 *</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-36">产品品牌 *</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-36">产品型号 *</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-44">产品图片链接 *</th>
                <th className="py-2.5 px-3 w-36">产品海关编码 *</th>
              </tr>
            </thead>
            <tbody>
              {cargoRows.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-150 hover:bg-slate-50/40 transition-colors">
                  
                  {/* Delete cell */}
                  <td className="p-1 px-3 border-r border-slate-150 text-center">
                    <button
                      type="button"
                      onClick={() => removeCargoRow(idx)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5 mx-auto" />
                    </button>
                  </td>

                  {/* boxNo */}
                  <td className="p-1 border-r border-slate-150 bg-slate-50/35">
                    <input
                      type="text"
                      value={row.boxNo}
                      onChange={(e) => handleCargoRowChange(idx, 'boxNo', e.target.value)}
                      className="w-full text-center bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs font-mono"
                    />
                  </td>

                  {/* poNumber */}
                  <td className="p-1 border-r border-slate-150">
                    <input
                      type="text"
                      placeholder="e.g. PO-901"
                      value={row.poNumber}
                      onChange={(e) => handleCargoRowChange(idx, 'poNumber', e.target.value)}
                      className="w-full bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1 font-mono"
                    />
                  </td>

                  {/* englishName */}
                  <td className="p-1 border-r border-slate-150">
                    <input
                      type="text"
                      placeholder="e.g. bluetooth charger"
                      value={row.englishName}
                      onChange={(e) => handleCargoRowChange(idx, 'englishName', e.target.value)}
                      className="w-full bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1"
                    />
                  </td>

                  {/* chineseName */}
                  <td className="p-1 border-r border-slate-150">
                    <input
                      type="text"
                      placeholder="车载蓝牙充电机"
                      value={row.chineseName}
                      onChange={(e) => handleCargoRowChange(idx, 'chineseName', e.target.value)}
                      className="w-full bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1 font-medium text-slate-800"
                    />
                  </td>

                  {/* unitPrice */}
                  <td className="p-1 border-r border-slate-150 text-right">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={row.unitPrice || ''}
                      onChange={(e) => handleCargoRowChange(idx, 'unitPrice', e.target.value)}
                      className="w-full text-right bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1 font-mono font-semibold"
                    />
                  </td>

                  {/* quantity */}
                  <td className="p-1 border-r border-slate-150 text-right">
                    <input
                      type="number"
                      placeholder="0"
                      value={row.quantity || ''}
                      onChange={(e) => handleCargoRowChange(idx, 'quantity', e.target.value)}
                      className="w-full text-right bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1 font-mono font-semibold text-blue-600"
                    />
                  </td>

                  {/* totalPrice */}
                  <td className="p-1 border-r border-slate-150 text-right bg-slate-50/40 text-slate-700 font-mono font-bold text-[11px] px-2">
                    ${(row.unitPrice * row.quantity || 0).toLocaleString()}
                  </td>

                  {/* material */}
                  <td className="p-1 border-r border-slate-150">
                    <input
                      type="text"
                      placeholder="e.g. ABS+塑胶"
                      value={row.material}
                      onChange={(e) => handleCargoRowChange(idx, 'material', e.target.value)}
                      className="w-full bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1"
                    />
                  </td>

                  {/* customsRegCode */}
                  <td className="p-1 border-r border-slate-150">
                    <input
                      type="text"
                      placeholder="海关注册"
                      value={row.customsRegCode}
                      onChange={(e) => handleCargoRowChange(idx, 'customsRegCode', e.target.value)}
                      className="w-full bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1 font-mono"
                    />
                  </td>

                  {/* usage */}
                  <td className="p-1 border-r border-slate-150">
                    <input
                      type="text"
                      placeholder="产品用途"
                      value={row.usage}
                      onChange={(e) => handleCargoRowChange(idx, 'usage', e.target.value)}
                      className="w-full bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1"
                    />
                  </td>

                  {/* brand */}
                  <td className="p-1 border-r border-slate-150">
                    <input
                      type="text"
                      placeholder="品牌"
                      value={row.brand}
                      onChange={(e) => handleCargoRowChange(idx, 'brand', e.target.value)}
                      className="w-full bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1"
                    />
                  </td>

                  {/* model */}
                  <td className="p-1 border-r border-slate-150">
                    <input
                      type="text"
                      placeholder="型号"
                      value={row.model}
                      onChange={(e) => handleCargoRowChange(idx, 'model', e.target.value)}
                      className="w-full bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1"
                    />
                  </td>

                  {/* imageLink */}
                  <td className="p-1 border-r border-slate-150">
                    <input
                      type="text"
                      placeholder="http://"
                      value={row.imageLink}
                      onChange={(e) => handleCargoRowChange(idx, 'imageLink', e.target.value)}
                      className="w-full bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1 text-blue-500 hover:underline"
                    />
                  </td>

                  {/* hscode */}
                  <td className="p-1">
                    <input
                      type="text"
                      placeholder="海关编码"
                      value={row.hscode}
                      onChange={(e) => handleCargoRowChange(idx, 'hscode', e.target.value)}
                      className="w-full bg-transparent border-none py-0.5 focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none rounded text-xs px-1 font-mono"
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between">
          <span>共 {cargoRows.length} 箱申报品级明细，已填报合格申报共 {cargoRows.filter(r => r.chineseName && r.quantity > 0).length} 条</span>
          <span className="font-bold text-slate-700">总计拼箱货值: {(typeof exportValue === 'number' ? exportValue : 0).toLocaleString()} {currency || '--'}</span>
        </div>
      </div>

    </div>
  );
}
