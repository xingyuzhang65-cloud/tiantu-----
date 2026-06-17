import React, { useEffect, useState } from 'react';
import {
  X, Plus, Minus, FileSpreadsheet, UploadCloud, Info,
  Sparkles, BrainCircuit, CheckCircle2, Loader2, FileText, Image, ArrowRight
} from 'lucide-react';
import { Waybill, SidebarTab, OrderType } from '../types';
import AiInvoicePage from './AiInvoicePage';

// Station & Service name → code mapping for API
const STATION_NAME_TO_CODE: Record<string, string> = {
  '深圳天图货站': 'sz_tiantu',
  '上海分拨货站': 'shanghai_distribution',
  '塘厦仓': 'tangxia',
  '东莞塘厦分中心': 'dongguan_tangxia',
  '义乌中转营地': 'yiwu_transfer',
};

const SERVICE_NAME_TO_CODE: Record<string, string> = {
  '美国21日达': 'us_21day',
  '海德运通': 'haide_express',
  '美森尊卡限时达': 'matson_vip',
  '常润空快3日卡': 'changrun_air',
  '卡派高派拼箱': 'lcl_direct',
  '深圳天图海派专线': 'sz_tiantu_sea',
};

interface CreateModalProps {
  onClose: () => void;
  onSave: (waybill: Waybill) => void;
  operatorName: string;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  initialOrderType?: OrderType;
}

export default function CreateModal({ onClose, onSave, operatorName, addToast, initialOrderType }: CreateModalProps) {
  // Tabs: '快捷下单' | 'excel导入下单' | '解析发票下单'
  const [orderType, setOrderType] = useState<OrderType>(initialOrderType || '快捷下单');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('单票');

  // Manual Form states
  const [customer, setCustomer] = useState('');
  const [deliveryStation, setDeliveryStation] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [customerOrderNo, setCustomerOrderNo] = useState('');
  const [packagesCount, setPackagesCount] = useState<number>(1);
  const [country, setCountry] = useState('');
  const [service, setService] = useState('');
  const [customsDeclarationType, setCustomsDeclarationType] = useState('');
  const [tradeMode, setTradeMode] = useState('');
  const [expectedWeek, setExpectedWeek] = useState('');
  const [buyInspection, setBuyInspection] = useState<boolean>(false);
  const [remarks, setRemarks] = useState('');

  // For '多票' state to hold added list of waybills/packages
  const [multiWaybills, setMultiWaybills] = useState<Waybill[]>([]);
  const [templateType, setTemplateType] = useState('单票运单导入');

  // Excel drag state
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Invoice Parsing States
  const [invoiceText, setInvoiceText] = useState('');
  const [invoiceFileName, setInvoiceFileName] = useState<string | null>(null);
  const [invoiceFileBase64, setInvoiceFileBase64] = useState<string | null>(null);
  const [invoiceFileMime, setInvoiceFileMime] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStep, setParseStep] = useState<string>('');
  
  // Custom interactive parsed draft
  const [parsedDraft, setParsedDraft] = useState<{
    customerName: string;
    country: string;
    station: string;
    packagesCount: number;
    carrier: string;
    fbaCode: string;
    remarks: string;
    description: string;
  } | null>(null);

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const shouldShowCustomsDeclaration = false;

  // ─── Dynamic Trade Mode Validation ────────────────────────────────────────
  const [tradeModeRequired, setTradeModeRequired] = useState(false);
  const [matchedRuleName, setMatchedRuleName] = useState<string | null>(null);
  const shouldShowTradeMode = tradeModeRequired;

  // Watch station + service changes → check if trade mode is required
  useEffect(() => {
    if (!deliveryStation || !service) {
      setTradeModeRequired(false);
      setMatchedRuleName(null);
      if (!tradeModeRequired && errors.tradeMode) {
        setErrors(prev => { const { tradeMode, ...rest } = prev; return rest; });
      }
      return;
    }

    const stationCode = STATION_NAME_TO_CODE[deliveryStation];
    const serviceCode = SERVICE_NAME_TO_CODE[service];

    if (!stationCode || !serviceCode) {
      setTradeModeRequired(false);
      setMatchedRuleName(null);
      return;
    }

    let cancelled = false;

    fetch('/api/check-trade-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stationCode, serviceCode }),
    })
      .then(res => res.json())
      .then(json => {
        if (cancelled) return;
        if (json.success) {
          setTradeModeRequired(json.data.isRequired);
          setMatchedRuleName(json.data.matchedRuleName || null);
          // Clear error when trade mode becomes non-required
          if (!json.data.isRequired && errors.tradeMode) {
            setErrors(prev => { const { tradeMode, ...rest } = prev; return rest; });
          }
        }
      })
      .catch(() => {
        // API offline — no opinion
      });

    return () => { cancelled = true; };
  }, [deliveryStation, service]);

  useEffect(() => {
    if (!shouldShowCustomsDeclaration && customsDeclarationType) {
      setCustomsDeclarationType('');
    }
    if (!shouldShowCustomsDeclaration && errors.customsDeclarationType) {
      setErrors(prev => {
        const { customsDeclarationType: _customsDeclarationType, ...rest } = prev;
        return rest;
      });
    }
  }, [shouldShowCustomsDeclaration, customsDeclarationType, errors.customsDeclarationType]);

  useEffect(() => {
    if (!shouldShowTradeMode && tradeMode) {
      setTradeMode('');
    }
  }, [shouldShowTradeMode, tradeMode]);

  // Counter helpers
  const increment = () => setPackagesCount(prev => prev + 1);
  const decrement = () => setPackagesCount(prev => Math.max(1, prev - 1));

  // Auto generate client order no
  const generateOrderNo = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    setCustomerOrderNo(`CUST${random}`);
    addToast('已自动生成高精客户单号', 'info');
  };

  const handleAddMultiWaybill = () => {
    const newErrors: { [key: string]: string } = {};
    if (!customer) newErrors.customer = '请选择用户/客户';
    if (!deliveryStation) newErrors.deliveryStation = '请选择送货货站';
    if (!deliveryDate) newErrors.deliveryDate = '请选择国内送仓时间';
    if (!customerOrderNo) newErrors.customerOrderNo = '请输入客户单号';
    if (!country) newErrors.country = '请选择国家或地区';
    if (!service) newErrors.service = '请选择服务类型';
    if (tradeModeRequired && !tradeMode) {
      newErrors.tradeMode = `根据规则"${matchedRuleName}"，贸易方式为必填项`;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('请完善当前多票单据的必填项！', 'warning');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const newId = `HD${dateStr}${randomNum}`;
    const fbaRandom = 'FBA' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const groupRandom = 'USSZ202606' + Math.floor(100000 + Math.random() * 900000);

    const waybillItem: Waybill = {
      id: newId,
      fbaCode: fbaRandom,
      description: remarks || '自主申报多票运单，集装上架中',
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      pickupTime: '未揽收',
      groupCode: groupRandom,
      carrier: service,
      zipCode: country === '美国' ? '85043-2356' : country === '英国' ? 'EC1A-1BB' : '80331-MUC',
      station: deliveryStation,
      customerType: 'vip',
      status: '待揽收',
      packagesCount: packagesCount,
      country: country,
      orderWeek: expectedWeek || '2026年第25周',
      insurance: buyInspection,
      hasUploadedInvoice: false,
      remarks: remarks,
      customerName: customer,
      customsDeclarationType: undefined,
      tradeMode: undefined,
    };

    setMultiWaybills(prev => [...prev, waybillItem]);
    addToast(`已添加运单 ${newId} 至当前多票队列`, 'success');
    
    // Auto reset partial fields
    const nextRand = Math.floor(100000 + Math.random() * 900000);
    setCustomerOrderNo(`CUST${nextRand}`);
    setPackagesCount(1);
    setRemarks('');
    setCustomsDeclarationType('');
    setTradeMode('');
    setErrors({});
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (orderType === '快捷下单' && sidebarTab === '多票') {
      if (multiWaybills.length === 0) {
        addToast('您的多票队列中还没有申报的运单，请在下方表单中点击“+”添加。', 'warning');
        return;
      }
      multiWaybills.forEach(item => {
        onSave(item);
      });
      addToast(`批量下单成功！共创建了 ${multiWaybills.length} 门运单`, 'success');
      onClose();
      return;
    }

    if (orderType === 'excel导入下单') {
      if (!uploadedFile) {
        setErrors({ file: '请提供要导入的 Excel 文件！' });
        addToast('请拖入或选择您的 Excel 模板', 'warning');
        return;
      }
      // Mock importing Excel rows
      const randomId = 'HD' + Date.now().toString().slice(-10);
      const randomFBA = 'FBA' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const randomGroup = 'USSZ' + Date.now().toString().slice(-8);
      const newWaybill: Waybill = {
        id: randomId,
        fbaCode: randomFBA,
        description: 'Excel智能导入成功 (未报关)',
        createTime: new Date().toLocaleString().replace(/\//g, '-'),
        pickupTime: '待揽入库',
        groupCode: randomGroup,
        carrier: '海德运通',
        zipCode: '90001-F32B',
        station: '深圳天图',
        customerType: '基础价格',
        status: '待揽收',
        packagesCount: 12,
        country: '美国',
        orderWeek: '2026-W25',
        insurance: true,
        hasUploadedInvoice: true,
        remarks: '通过 Excel 批量进架: ' + uploadedFile
      };
      onSave(newWaybill);
      addToast('Excel 文件行数据解析成功，已导入 1 条包装货柜！', 'success');
      onClose();
      return;
    }

    if (orderType === '解析发票下单') {
      if (!parsedDraft) {
        addToast('请先解析发票提取完有效信息！', 'warning');
        return;
      }

      // Submit the editable parsed draft waybill
      const randomId = 'HD' + Date.now().toString().slice(-10);
      const randomGroup = 'USSZ' + Date.now().toString().slice(-8);
      const newWaybill: Waybill = {
        id: randomId,
        fbaCode: parsedDraft.fbaCode || 'FBA_DRAFT',
        description: parsedDraft.description || 'AI智能解析下单：随箱普货审核完毕',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        pickupTime: '未揽收',
        groupCode: randomGroup,
        carrier: parsedDraft.carrier || '海德运通',
        zipCode: parsedDraft.country === '美国' ? '85043-2356' : parsedDraft.country === '英国' ? 'EC1A-1BB' : '80331-MUC',
        station: parsedDraft.station || '深圳天图货站',
        customerType: parsedDraft.customerName?.includes('VIP') ? 'vip' : '基础价格',
        status: '待揽收',
        packagesCount: parsedDraft.packagesCount || 1,
        country: parsedDraft.country || '美国',
        orderWeek: '2026年第25周',
        insurance: true,
        hasUploadedInvoice: true,
        remarks: parsedDraft.remarks,
        customerName: parsedDraft.customerName
      };

      onSave(newWaybill);
      addToast(`AI 发票运单解析确认，已创建运单 ${randomId}！`, 'success');
      onClose();
      return;
    }

    // Validation for Manual form
    const newErrors: { [key: string]: string } = {};
    if (!customer) newErrors.customer = '请选择用户/客户';
    if (!deliveryStation) newErrors.deliveryStation = '请选择送货货站';
    if (!deliveryDate) newErrors.deliveryDate = '请选择国内送仓时间';
    if (!customerOrderNo) newErrors.customerOrderNo = '请输入客户单号';
    if (!country) newErrors.country = '请选择国家或地区';
    if (!service) newErrors.service = '请选择服务类型';
    if (tradeModeRequired && !tradeMode) {
      newErrors.tradeMode = `根据规则"${matchedRuleName}"，贸易方式为必填项`;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('请完善带标 * 的必填栏目信息', 'warning');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const newId = `HD${dateStr}${randomNum}`;
    const fbaRandom = 'FBA' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const groupRandom = 'USSZ202606' + Math.floor(100000 + Math.random() * 900000);

    const newWaybill: Waybill = {
      id: newId,
      fbaCode: fbaRandom,
      description: remarks || '自主填单下单，准备集货入库',
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      pickupTime: '未揽收',
      groupCode: groupRandom,
      carrier: service,
      zipCode: country === '美国' ? '85043-2356' : country === '英国' ? 'EC1A-1BB' : '80331-MUC',
      station: deliveryStation,
      customerType: 'vip',
      status: '待揽收',
      packagesCount: packagesCount,
      country: country,
      orderWeek: expectedWeek,
      insurance: buyInspection,
      hasUploadedInvoice: false,
      remarks: remarks,
      customerName: customer,
      customsDeclarationType: undefined,
      tradeMode: tradeMode || undefined,
    };

    onSave(newWaybill);
    addToast(`手动创建成功！运单号为 ${newId}`, 'success');
    onClose();
  };

  // Mock Drop files for Excel tab
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv')) {
        setUploadedFile(file.name);
        addToast(`成功识别文件: ${file.name}`, 'info');
      } else {
        addToast('仅支持 .xlsx, .xls, .csv 电子表格模板格式', 'warning');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file.name);
      addToast(`加载文件: ${file.name}`, 'info');
    }
  };

  // Drag and Drop for Invoice file
  const handleInvoiceFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processInvoiceFile(e.dataTransfer.files[0]);
    }
  };

  const handleInvoiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processInvoiceFile(e.target.files[0]);
    }
  };

  const processInvoiceFile = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      addToast('发票智能解析仅支持图片形式(PNG/JPEG)或 PDF 发票文档', 'warning');
      return;
    }
    setInvoiceFileName(file.name);
    setInvoiceFileMime(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setInvoiceFileBase64(event.target.result as string);
        addToast(`成功载入发票文档: ${file.name}，已转换为图像解析格式`, 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Load Demo Invoicing data for easy visual evaluation
  const loadDemoInvoice = () => {
    const demo = `INVOICE #INV-2026-90412
INVOICE DATE: 2026-06-16
SHIPPER / CLIENT: 付豪跨境电商事业群 (Fuhao Cross-border eCommerce Group)
DESTINATION WAREHOUSE: FBA Center - ONT8, USA, CA 91752
HUB CENTER: 东莞塘厦分中心 (Dongguan Tangxia HUB)
LOGISTICS CHANNEL: 美森尊卡限时达 (Matson VIP Premium Cargo)
CARGO SPECS: Automotive Bluetooth monitors & Electronic chargers (Built-in battery, MSDS certified)
VOLUME OVERVIEW: 22 Cartons of export general goods.
INSURED: High Value Protection Plan YES.
SPECIAL HANDLINGS: Water-proof stretch film packaging, handle with care.`;
    setInvoiceText(demo);
    addToast('已自动垫底示范商业发票文本，可直接点击“开始 智能AI解析”体验！', 'success');
  };

  // Real API integration with Gemini model
  const handleStartParseInvoice = async () => {
    if (!invoiceText && !invoiceFileBase64) {
      addToast('请至少提供发票文本（可一键导入示范）或拖入发票图片/PDF文件！', 'warning');
      return;
    }

    setIsParsing(true);
    setParsedDraft(null);

    // Micro-steps progress sequence
    const steps = [
      '📡 启动 AI 天图智能对接通道...',
      '🔍 正在对提供的源发票/报关面单数据进行多点语义扫描...',
      '📈 正识别货代委托主体并对齐天图常驻 VIP 名册...',
      '🏷️ 正在检测目的国、配送货站和匹配最精准的物流渠道...',
      '💡 正在拆封货包品名描述，核准箱子件数并组装运单 Draft...'
    ];

    let stepIndex = 0;
    setParseStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setParseStep(steps[stepIndex]);
      } else {
        clearInterval(stepInterval);
      }
    }, 1200);

    try {
      const response = await fetch('/api/parse-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: invoiceText,
          fileBase64: invoiceFileBase64,
          mimeType: invoiceFileMime
        })
      });

      const resData = await response.json();
      clearInterval(stepInterval);

      if (resData.success) {
        setParsedDraft(resData.data);
        addToast('Gemini 完美提取发票结构，单票申报草稿组装就绪！', 'success');
      } else {
        addToast(resData.message || 'AI 连线异常，请稍后检查设置面板中的 Key 配额', 'warning');
        // Fallback draft so user can still test in case API key fails
        setParsedDraft({
          customerName: '付豪跨境电商事业群',
          country: '美国',
          station: '东莞塘厦分中心',
          packagesCount: 22,
          carrier: '美森尊卡限时达',
          fbaCode: 'ONT8',
          remarks: '由于未配置有效 Gemini API KEY，系统自动激活备用沙盒解析方案。' + (invoiceText ? ' 识别输入: ' + invoiceText.slice(0, 30) : ''),
          description: '电子配件一批 (沙盒提取)'
        });
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error(err);
      addToast('连接服务器解析失败，已触发自动沙盒备份机制。', 'info');
      // Graceful fallback to maintain offline preview reliability
      setParsedDraft({
        customerName: '付豪跨境电商事业群',
        country: '美国',
        station: '东莞塘厦分中心',
        packagesCount: 18,
        carrier: '美森尊卡限时达',
        fbaCode: 'ONT8',
        remarks: '沙盒备份智能提取：原发票内容转运中。原装拉伸膜包裹。',
        description: '随箱货物理查无异常'
      });
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans selection:bg-blue-150">
      {/* Watermarked Modal Outer Frame */}
      <div className="relative w-full max-w-[1020px] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Diagonal Watermark Container */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 opacity-[0.035] overflow-hidden">
          <div className="absolute -inset-10 flex flex-wrap gap-x-24 gap-y-20 justify-center rotate-[-22deg] text-xs font-semibold text-slate-800 uppercase tracking-widest">
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap">
                {operatorName} &nbsp; 2026-06-16
              </div>
            ))}
          </div>
        </div>

        {orderType === '解析发票下单' ? (
          <AiInvoicePage 
            onCancel={() => setOrderType('快捷下单')}
            onSave={(waybills) => {
              waybills.forEach(w => onSave(w));
              onClose();
            }}
            addToast={addToast}
            operatorName={operatorName}
          />
        ) : (
          <>
            {/* Modal Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-slate-150 bg-slate-50 px-6 py-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="inline-block w-1.5 h-4.5 bg-blue-600 rounded-sm" />
            创建运单
          </h2>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="relative z-10 p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Order Type Tabs Selector */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <button
              id="tab-manual"
              type="button"
              onClick={() => { setOrderType('快捷下单'); setErrors({}); }}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                orderType === '快捷下单'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              快捷下单
            </button>
            <button
              id="tab-excel"
              type="button"
              onClick={() => { setOrderType('excel导入下单'); setErrors({}); }}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                orderType === 'excel导入下单'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              excel导入下单
            </button>
            <button
              id="tab-invoice"
              type="button"
              onClick={() => { setOrderType('解析发票下单'); setErrors({}); }}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                orderType === '解析发票下单'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-100 animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              解析发票下单 (新星版)
            </button>
          </div>

          {/* Tab 1: 快捷下单 (Original Standard Manual Delivery Form) */}
          {orderType === '快捷下单' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Single / Multi Toggle row */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-150">
                <div className="flex items-center gap-1 rounded bg-slate-200/60 p-0.5 w-fit">
                  <button
                    id="subtab-single"
                    type="button"
                    onClick={() => setSidebarTab('单票')}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                      sidebarTab === '单票'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    单票
                  </button>
                  <button
                    id="subtab-multi"
                    type="button"
                    onClick={() => {
                      setSidebarTab('多票');
                      addToast('多票模式已启用：多包裹分票记建队列', 'info');
                    }}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                      sidebarTab === '多票'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    多票
                  </button>
                </div>

                <div className="flex-1 max-w-[340px] relative">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    <span className="text-red-500 mr-1">*</span>用户/客户
                  </label>
                  <select
                    id="select-customer"
                    value={customer}
                    onChange={(e) => {
                      setCustomer(e.target.value);
                      if (errors.customer) setErrors(prev => ({ ...prev, customer: '' }));
                    }}
                    className={`w-full rounded-lg border bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                      errors.customer ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  >
                    <option value="">请选择</option>
                    <option value="深圳天图电子有限公司 (VIP)">深圳天图电子有限公司 (VIP)</option>
                    <option value="付豪跨境电商事业群">付豪跨境电商事业群</option>
                    <option value="常晟供应链集团">常晟供应链集团</option>
                    <option value="上海豪迅美中快递中心">上海豪迅美中快递中心</option>
                    <option value="英国海航直运有限公司">英国海航直运有限公司</option>
                  </select>
                  {errors.customer && <span className="absolute text-[9px] text-red-500 -bottom-3.5 left-0">{errors.customer}</span>}
                </div>
              </div>

              {/* MODE 1: SINGLE WAYBILL TICKET */}
              {sidebarTab === '单票' && (
                <div className="border border-slate-150 rounded-xl bg-white p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs text-slate-800 tracking-wide">基本信息</span>
                  </div>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                    
                    {/* Delivery Station */}
                    <div className="relative">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        <span className="text-red-500 mr-1">*</span>送货货站
                      </label>
                      <select
                        id="select-station"
                        value={deliveryStation}
                        onChange={(e) => {
                          setDeliveryStation(e.target.value);
                          if (errors.deliveryStation) setErrors(prev => ({ ...prev, deliveryStation: '' }));
                        }}
                        className={`w-full rounded-lg border bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                          errors.deliveryStation ? 'border-red-400' : 'border-slate-300'
                        }`}
                      >
                        <option value="">请选择送货开单货站</option>
                        <option value="深圳天图货站">深圳天图货站</option>
                        <option value="上海分拨货站">上海分拨货站</option>
                        <option value="塘厦仓">塘厦仓</option>
                        <option value="东莞塘厦分中心">东莞塘厦分中心</option>
                        <option value="义乌中转营地">义乌中转营地</option>
                      </select>
                      {errors.deliveryStation && <span className="absolute text-[9px] text-red-500 -bottom-3.5 left-0">{errors.deliveryStation}</span>}
                    </div>

                    {/* Date picker */}
                    <div className="relative">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        <span className="text-red-500 mr-1">*</span>国内送仓时间
                      </label>
                      <input
                        id="input-delivery-date"
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => {
                          setDeliveryDate(e.target.value);
                          if (errors.deliveryDate) setErrors(prev => ({ ...prev, deliveryDate: '' }));
                        }}
                        className={`w-full rounded-lg border bg-white px-3 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                          errors.deliveryDate ? 'border-red-400' : 'border-slate-300'
                        }`}
                      />
                      {errors.deliveryDate && <span className="absolute text-[9px] text-red-500 -bottom-3.5 left-0">{errors.deliveryDate}</span>}
                    </div>

                    {/* Customer Order No */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-slate-600">
                          <span className="text-red-500 mr-1">*</span>客户单号
                        </label>
                        <button
                          type="button"
                          onClick={generateOrderNo}
                          className="text-[10px] text-blue-600 hover:underline"
                        >
                          生成单号
                        </button>
                      </div>
                      <input
                        id="input-customer-order"
                        type="text"
                        placeholder="请输入客户单号"
                        value={customerOrderNo}
                        onChange={(e) => {
                          setCustomerOrderNo(e.target.value);
                          if (errors.customerOrderNo) setErrors(prev => ({ ...prev, customerOrderNo: '' }));
                        }}
                        className={`w-full rounded-lg border bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                          errors.customerOrderNo ? 'border-red-400' : 'border-slate-300'
                        }`}
                      />
                      {errors.customerOrderNo && <span className="absolute text-[9px] text-red-500 -bottom-3.5 left-0">{errors.customerOrderNo}</span>}
                    </div>

                    {/* Package piece count stepper */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        <span className="text-red-500 mr-1">*</span>件数
                      </label>
                      <div className="flex h-8 w-full max-w-[130px] items-center rounded-lg border border-slate-300 overflow-hidden">
                        <button
                          type="button"
                          onClick={decrement}
                          className="flex h-full w-10 items-center justify-center bg-slate-100 hover:bg-slate-200 border-r border-slate-300 text-slate-600 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          id="input-packages-count"
                          type="number"
                          min="1"
                          value={packagesCount}
                          onChange={(e) => setPackagesCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="h-full w-full bg-white text-center text-xs font-semibold focus:outline-none border-none py-0"
                        />
                        <button
                          type="button"
                          onClick={increment}
                          className="flex h-full w-10 items-center justify-center bg-slate-100 hover:bg-slate-200 border-l border-slate-300 text-slate-600 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Country Selection */}
                    <div className="relative">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        <span className="text-red-500 mr-1">*</span>国家或地区
                      </label>
                      <select
                        id="select-country"
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          if (errors.country) setErrors(prev => ({ ...prev, country: '' }));
                        }}
                        className={`w-full rounded-lg border bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                          errors.country ? 'border-red-400' : 'border-slate-300'
                        }`}
                      >
                        <option value="">请选择国家或地区</option>
                        <option value="美国">美国 (USA)</option>
                        <option value="英国">英国 (United Kingdom)</option>
                        <option value="德国">德国 (Germany)</option>
                        <option value="加拿大">加拿大 (Canada)</option>
                        <option value="日本">日本 (Japan)</option>
                      </select>
                      {errors.country && <span className="absolute text-[9px] text-red-500 -bottom-3.5 left-0">{errors.country}</span>}
                    </div>

                    {/* Service Carrier Selection */}
                    <div className="relative">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        <span className="text-red-500 mr-1">*</span>服务
                      </label>
                      <select
                        id="select-service"
                        value={service}
                        onChange={(e) => {
                          setService(e.target.value);
                          if (errors.service) setErrors(prev => ({ ...prev, service: '' }));
                        }}
                        className={`w-full rounded-lg border bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                          errors.service ? 'border-red-400' : 'border-slate-300'
                        }`}
                      >
                        <option value="">请选择服务类型</option>
                        <option value="美国21日达">美国21日达</option>
                        <option value="海德运通">海德运通 (HT Express)</option>
                        <option value="美森尊卡限时达">美森尊卡限时达 (Matson VIP)</option>
                        <option value="常润空快3日卡">常润空快3日卡 (Air Fast)</option>
                        <option value="卡派高派拼箱">卡派高派拼箱 (LCL Direct)</option>
                        <option value="深圳天图海派专线">深圳天图海派专线</option>
                      </select>
                      {errors.service && <span className="absolute text-[9px] text-red-500 -bottom-3.5 left-0">{errors.service}</span>}
                    </div>

                    {shouldShowCustomsDeclaration && (
                      <div className="relative">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          <span className="text-red-500 mr-1">*</span>报关方式
                        </label>
                        <select
                          id="select-customs-declaration-type"
                          value={customsDeclarationType}
                          onChange={(e) => {
                            setCustomsDeclarationType(e.target.value);
                            if (errors.customsDeclarationType) setErrors(prev => ({ ...prev, customsDeclarationType: '' }));
                          }}
                          className={`w-full rounded-lg border bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                            errors.customsDeclarationType ? 'border-red-400' : 'border-slate-300'
                          }`}
                        >
                          <option value="">请选择报关方式</option>
                          <option value="报关退税">报关退税</option>
                          <option value="托管报关">托管报关</option>
                        </select>
                        {errors.customsDeclarationType && <span className="absolute text-[9px] text-red-500 -bottom-3.5 left-0">{errors.customsDeclarationType}</span>}
                      </div>
                    )}

                    {shouldShowTradeMode && (
                      <div className="relative">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          <span className="text-red-500 mr-1">*</span>贸易方式
                          {matchedRuleName && (
                            <span className="ml-1 text-[10px] font-normal text-blue-500">
                              （规则: {matchedRuleName}）
                            </span>
                          )}
                        </label>
                        <select
                          id="select-trade-mode"
                          value={tradeMode}
                          onChange={(e) => {
                            setTradeMode(e.target.value);
                            if (errors.tradeMode) setErrors(prev => ({ ...prev, tradeMode: '' }));
                          }}
                          className={`w-full rounded-lg border bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                            errors.tradeMode ? 'border-red-400' : 'border-slate-300'
                          }`}
                        >
                          <option value="">请选择贸易方式</option>
                          <option value="9610">9610</option>
                          <option value="9710">9710</option>
                          <option value="9810">9810</option>
                          <option value="0110">0110</option>
                          <option value="1039">1039</option>
                        </select>
                        {errors.tradeMode && (
                          <span className="absolute text-[9px] text-red-500 -bottom-3.5 left-0">{errors.tradeMode}</span>
                        )}
                        {!errors.tradeMode && matchedRuleName && (
                          <span className="text-[9px] text-blue-400 mt-0.5 block">
                            📋 匹配校验规则，必须填写贸易方式
                          </span>
                        )}
                      </div>
                    )}

                    {/* Estimated week */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        预计送达周
                      </label>
                      <select
                        id="select-week"
                        value={expectedWeek}
                        onChange={(e) => setExpectedWeek(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">请选择周</option>
                        <option value="2026年第25周">2026-W25 (06.15 - 06.21)</option>
                        <option value="2026年第26周">2026-W26 (06.22 - 06.28)</option>
                        <option value="2026年第27周">2026-W27 (06.29 - 07.05)</option>
                        <option value="2026年第28周">2026-W28 (07.06 - 07.12)</option>
                      </select>
                    </div>

                    {/* Domestic Inspection (查验宝) Radio buttons */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        是否购买国内查验宝
                      </label>
                      <div className="flex items-center gap-6 py-1.5">
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            id="radio-inspection-yes"
                            type="radio"
                            name="buyInspection"
                            checked={buyInspection === true}
                            onChange={() => setBuyInspection(true)}
                            className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-opacity-50"
                          />
                          <span>是</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            id="radio-inspection-no"
                            type="radio"
                            name="buyInspection"
                            checked={buyInspection === false}
                            onChange={() => setBuyInspection(false)}
                            className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-opacity-50"
                          />
                          <span>否</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                          <Info className="h-3.5 w-3.5 text-blue-500 inline" />
                          国内查验保提供退赔保证。
                        </span>
                      </div>
                    </div>

                    {/* Remarks input */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        备注
                      </label>
                      <input
                        id="input-remarks"
                        type="text"
                        placeholder="请输入品名详细说明或申报要求"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                  </div>
                </div>
              )}

              {/* MODE 2: MULTI WAYBILL TICKETS ("多票" SPREADSHEET FORM CARD - MATCHES SCREENSHOT 1) */}
              {sidebarTab === '多票' && (
                <div className="space-y-4">
                  
                  {/* Outer card border matching Screenshot 1 */}
                  <div className="border border-slate-150 rounded-xl bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-xs text-slate-800 tracking-wide">基本信息</span>
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                        多票动态叠批申报
                      </span>
                    </div>

                    {/* Column Table Horizontal Form Header & Row Inputs */}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[960px] text-xs text-left border-collapse">
                        <thead>
                          <tr className="text-slate-500 font-semibold select-none border-b border-slate-100">
                            <th className="py-2 px-2 w-[15%]"><span className="text-red-500 mr-0.5">*</span>送货货站</th>
                            <th className="py-2 px-2 w-[15%]"><span className="text-red-500 mr-0.5">*</span>国内送仓时间</th>
                            <th className="py-2 px-2 w-[18%]"><span className="text-red-500 mr-0.5">*</span>客户单号</th>
                            <th className="py-2 px-2 w-[13%]"><span className="text-red-500 mr-0.5">*</span>件数</th>
                            <th className="py-2 px-2 w-[14%]"><span className="text-red-500 mr-0.5">*</span>国家或地区</th>
                            <th className="py-2 px-2 w-[15%]"><span className="text-red-500 mr-0.5">*</span>服务</th>
                            {shouldShowCustomsDeclaration && (
                              <th className="py-2 px-2 w-[13%]"><span className="text-red-500 mr-0.5">*</span>报关方式</th>
                            )}
                            {shouldShowTradeMode && (
                              <th className="py-2 px-2 w-[11%]"><span className="text-red-500 mr-0.5">*</span>贸易方式</th>
                            )}
                            <th className="py-2 px-2 w-[10%]">预计送达周</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="align-top">
                            {/* Station selector */}
                            <td className="p-1.5">
                              <select
                                value={deliveryStation}
                                onChange={(e) => {
                                  setDeliveryStation(e.target.value);
                                  if (errors.deliveryStation) setErrors(prev => ({ ...prev, deliveryStation: '' }));
                                }}
                                className={`w-full bg-slate-50 border rounded px-1.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 ${
                                  errors.deliveryStation ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                                }`}
                              >
                                <option value="">请选择</option>
                                <option value="深圳天图货站">深圳天图货站</option>
                                <option value="上海分拨货站">上海分拨货站</option>
                                <option value="塘厦仓">塘厦仓</option>
                                <option value="东莞塘厦分中心">东莞塘厦分中心</option>
                                <option value="义乌中转营地">义乌中转营地</option>
                              </select>
                            </td>

                            {/* Date */}
                            <td className="p-1.5">
                              <input
                                type="date"
                                value={deliveryDate}
                                onChange={(e) => {
                                  setDeliveryDate(e.target.value);
                                  if (errors.deliveryDate) setErrors(prev => ({ ...prev, deliveryDate: '' }));
                                }}
                                className={`w-full bg-slate-50 border rounded px-1.5 py-0.5 text-xs focus:ring-1 focus:ring-blue-500 ${
                                  errors.deliveryDate ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                                }`}
                              />
                            </td>

                            {/* Cust Order No */}
                            <td className="p-1.5">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="CUST-xx"
                                  value={customerOrderNo}
                                  onChange={(e) => {
                                    setCustomerOrderNo(e.target.value);
                                    if (errors.customerOrderNo) setErrors(prev => ({ ...prev, customerOrderNo: '' }));
                                  }}
                                  className={`w-full bg-slate-50 border rounded px-1.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 font-mono ${
                                    errors.customerOrderNo ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={generateOrderNo}
                                  className="absolute right-1 top-1.5 text-[9px] text-blue-600 font-semibold"
                                >
                                  自动
                                </button>
                              </div>
                            </td>

                            {/* Pieces stepper */}
                            <td className="p-1.5">
                              <div className="flex items-center border border-slate-300 rounded bg-slate-50 h-[28px] overflow-hidden">
                                <button
                                  type="button"
                                  onClick={decrement}
                                  className="px-1 text-slate-500 hover:bg-slate-200 h-full border-r border-slate-300"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={packagesCount}
                                  onChange={(e) => setPackagesCount(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-full text-center text-xs border-none font-bold bg-transparent h-full py-0"
                                />
                                <button
                                  type="button"
                                  onClick={increment}
                                  className="px-1 text-slate-500 hover:bg-slate-200 h-full border-l border-slate-300"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Country selector */}
                            <td className="p-1.5">
                              <select
                                value={country}
                                onChange={(e) => {
                                  setCountry(e.target.value);
                                  if (errors.country) setErrors(prev => ({ ...prev, country: '' }));
                                }}
                                className={`w-full bg-slate-50 border rounded px-1.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 ${
                                  errors.country ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                                }`}
                              >
                                <option value="">请选择</option>
                                <option value="美国">美国</option>
                                <option value="英国">英国</option>
                                <option value="德国">德国</option>
                                <option value="加拿大">加拿大</option>
                                <option value="日本">日本</option>
                              </select>
                            </td>

                            {/* Service */}
                            <td className="p-1.5">
                              <select
                                value={service}
                                onChange={(e) => {
                                  setService(e.target.value);
                                  if (errors.service) setErrors(prev => ({ ...prev, service: '' }));
                                }}
                                className={`w-full bg-slate-50 border rounded px-1.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 ${
                                  errors.service ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                                }`}
                              >
                                <option value="">请选择</option>
                                <option value="美国21日达">美国21日达</option>
                                <option value="海德运通">海德运通 (HT Express)</option>
                                <option value="美森尊卡限时达">美森尊卡限时达</option>
                                <option value="常润空快3日卡">常润空快3日卡</option>
                                <option value="卡派高派拼箱">卡派高派拼箱</option>
                                <option value="深圳天图海派专线">深圳天图海派专线</option>
                              </select>
                            </td>

                            {shouldShowCustomsDeclaration && (
                              <td className="p-1.5">
                                <select
                                  value={customsDeclarationType}
                                  onChange={(e) => {
                                    setCustomsDeclarationType(e.target.value);
                                    if (errors.customsDeclarationType) setErrors(prev => ({ ...prev, customsDeclarationType: '' }));
                                  }}
                                  className={`w-full bg-slate-50 border rounded px-1.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 ${
                                    errors.customsDeclarationType ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                                  }`}
                                >
                                  <option value="">请选择</option>
                                  <option value="报关退税">报关退税</option>
                                  <option value="托管报关">托管报关</option>
                                </select>
                              </td>
                            )}

                            {shouldShowTradeMode && (
                              <td className="p-1.5">
                                <select
                                  value={tradeMode}
                                  onChange={(e) => {
                                    setTradeMode(e.target.value);
                                    if (errors.tradeMode) setErrors(prev => ({ ...prev, tradeMode: '' }));
                                  }}
                                  className={`w-full bg-slate-50 border rounded px-1.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 ${
                                    errors.tradeMode ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                                  }`}
                                >
                                  <option value="">请选择</option>
                                  <option value="9610">9610</option>
                                  <option value="9710">9710</option>
                                  <option value="9810">9810</option>
                                  <option value="0110">0110</option>
                                  <option value="1039">1039</option>
                                </select>
                              </td>
                            )}

                            {/* Estimated week selector */}
                            <td className="p-1.5">
                              <select
                                value={expectedWeek}
                                onChange={(e) => setExpectedWeek(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 text-xs focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">W25</option>
                                <option value="2026年第25周">2026-W25</option>
                                <option value="2026年第26周">2026-W26</option>
                                <option value="2026年第27周">2026-W27</option>
                              </select>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Checkbox, Remarks and Operator Plus row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 bg-slate-50/55 p-2 rounded-lg border border-slate-100">
                      
                      {/* Radios check */}
                      <div className="md:col-span-4 flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-slate-500">查验宝:</span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="buyMultiCheck"
                              checked={buyInspection === true}
                              onChange={() => setBuyInspection(true)}
                              className="h-3.5 w-3.5"
                            />
                            <span>是</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="buyMultiCheck"
                              checked={buyInspection === false}
                              onChange={() => setBuyInspection(false)}
                              className="h-3.5 w-3.5"
                            />
                            <span>否</span>
                          </label>
                        </div>
                      </div>

                      {/* Remarks */}
                      <div className="md:col-span-6">
                        <input
                          type="text"
                          placeholder="随包裹备注品名或特殊要求（非必填）"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          className="w-full rounded bg-white border border-slate-300 px-2 py-1 text-xs"
                        />
                      </div>

                      {/* Add button */}
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddMultiWaybill}
                          className="w-full md:w-auto rounded bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-1 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                        >
                          <Plus className="h-4 w-4" />
                          <span>追加单据</span>
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Multi queued tickets lists */}
                  {multiWaybills.length > 0 && (
                    <div className="border border-slate-150 rounded-xl bg-white p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">批下单待办队列 ({multiWaybills.length} 门)</span>
                        <button
                          type="button"
                          onClick={() => { setMultiWaybills([]); addToast('已清空多票队列', 'info'); }}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          清空队列
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto border border-slate-100 rounded-lg">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-indigo-100 text-slate-500">
                              <th className="p-2">运单代码</th>
                              <th className="p-2">客户单号</th>
                              <th className="p-2">送货货站</th>
                              <th className="p-2">目的国家</th>
                              <th className="p-2">件数</th>
                              <th className="p-2">服务类型</th>
                              <th className="p-2 text-center">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {multiWaybills.map((w, idx) => (
                              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="p-2 font-mono font-bold text-blue-700">{w.id}</td>
                                <td className="p-2 font-mono text-slate-700">{w.remarks || '无'}</td>
                                <td className="p-2">{w.station}</td>
                                <td className="p-2">{w.country}</td>
                                <td className="p-2 font-bold text-slate-800">{w.packagesCount} 件</td>
                                <td className="p-2">{w.carrier}</td>
                                <td className="p-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMultiWaybills(prev => prev.filter((_, i) => i !== idx));
                                      addToast('已将该单移出队列', 'info');
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    删除
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Action Buttons for Tab 1 */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-350 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#004bb1] px-5 py-2 text-xs font-semibold text-white hover:bg-[#003b91] shadow-md shadow-blue-150 transition-all cursor-pointer"
                >
                  确定下单
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Excel导入下单 */}
          {orderType === 'excel导入下单' && (
            <div className="space-y-4">
              
              {/* Dropdowns exactly reflecting Screenshot 2 */}
              <div className="border border-slate-150 rounded-xl bg-white p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-800 tracking-wide font-sans">导入参数设定 (Excel Standard Mapping)</span>
                </div>

                <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                  
                  {/* Select user */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      <span className="text-red-500 mr-1">*</span>用户/客户
                    </label>
                    <select
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="付豪跨境电商事业群">付豪跨境电商事业群</option>
                      <option value="深圳天图电子有限公司 (VIP)">深圳天图电子有限公司 (VIP)</option>
                      <option value="常晟供应链集团">常晟供应链集团</option>
                    </select>
                  </div>

                  {/* Template Type Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      模板类型
                    </label>
                    <select
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="单票运单导入">单票运单导入 (Standard Waybill template)</option>
                      <option value="多票运单导入">多票运单批导 (Multi-package waybill import)</option>
                      <option value="拼箱发货大板导入">拼箱发货大板导入 (LCL cargo sheet)</option>
                    </select>
                  </div>

                  {/* Delivery Station */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      <span className="text-red-500 mr-1">*</span>送货货站
                    </label>
                    <select
                      value={deliveryStation}
                      onChange={(e) => setDeliveryStation(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="深圳天图货站">深圳天图货站</option>
                      <option value="上海分拨货站">上海分拨货站</option>
                      <option value="塘厦仓">塘厦仓</option>
                      <option value="东莞塘厦分中心">东莞塘厦分中心</option>
                    </select>
                  </div>

                  {/* Date picker */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      <span className="text-red-500 mr-1">*</span>国内送仓时间
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Expected week */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      预计送达周
                    </label>
                    <select
                      value={expectedWeek}
                      onChange={(e) => setExpectedWeek(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="2026年第25周">2026-W25 (06.15 - 06.21)</option>
                      <option value="2026年第26周">2026-W26 (06.22 - 06.28)</option>
                    </select>
                  </div>

                  {/* Domestic inspection */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      是否购买国内查验宝
                    </label>
                    <div className="flex items-center gap-4 py-1.5">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="buyExcelInspection"
                          checked={buyInspection === true}
                          onChange={() => setBuyInspection(true)}
                          className="h-3.5 w-3.5"
                        />
                        <span>是</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="buyExcelInspection"
                          checked={buyInspection === false}
                          onChange={() => setBuyInspection(false)}
                          className="h-3.5 w-3.5"
                        />
                        <span>否</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              {/* Guide spec bar */}
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-150 text-blue-700 text-xs leading-relaxed flex items-start gap-2.5">
                <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Excel 批量上传规范说明：</span>
                  随箱货件物理拆包时，请提前下载下方的 XLS 格式。通过一键配置自动完成国家目的仓批录，极速生成。
                  <button 
                    type="button"
                    onClick={() => addToast('模板格式 [Tiantu_Waybill_Template_2026.xlsx] 开始下载...', 'success')}
                    className="mt-1 block text-blue-600 hover:underline font-semibold text-left cursor-pointer"
                  >
                    获取最新标准导入格式.xlsx ↓
                  </button>
                </div>
              </div>

              {/* Drag n drop container */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
                  dragOver ? 'border-blue-500 bg-blue-50/20' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/40'
                }`}
              >
                <div className="rounded-full bg-slate-100 p-3 mb-3 text-slate-500">
                  <UploadCloud className="h-8 w-8 text-blue-600 animate-bounce" />
                </div>
                
                {uploadedFile ? (
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-center">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      {uploadedFile}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      表格挂载成功！点击下方确认按钮完成录入大盘
                    </p>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="mt-2 text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      重新上传
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-slate-700">
                      拖拽 Excel/CSV 表格至此区域，或者
                    </p>
                    <label className="inline-block cursor-pointer text-xs font-bold text-blue-600 hover:underline">
                      <span>浏览本地文件</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">
                      支持 .xlsx, .xls, .csv 等表格格式，一次最大支持批入 500 FBA 包裹
                    </p>
                  </div>
                )}
              </div>

              {errors.file && <p className="text-xs text-red-600 font-medium">{errors.file}</p>}

              {/* Action Buttons for Tab 2 */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-350 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!uploadedFile) {
                      addToast('请提供要导入的 Excel 文件！', 'warning');
                      return;
                    }
                    const randomNum = Math.floor(1000 + Math.random() * 9000);
                    const newId = `HD260616${randomNum}`;
                    const mockWaybill: Waybill = {
                      id: newId,
                      fbaCode: 'ONT8',
                      description: `列调导入: ${uploadedFile}`,
                      createTime: new Date().toLocaleString().replace(/\//g, '-'),
                      pickupTime: '未揽收',
                      groupCode: `USSZ202606${Math.floor(100000 + Math.random() * 900000)}`,
                      carrier: '卡派高派拼箱',
                      zipCode: '85043-2356',
                      station: deliveryStation || '深圳天图货站',
                      customerType: '普通客户',
                      status: '待揽收',
                      packagesCount: 180, 
                      country: '美国',
                      orderWeek: expectedWeek || '2026年第25周',
                      insurance: buyInspection,
                      hasUploadedInvoice: true,
                      remarks: `Excel录入. (模板: ${templateType})`,
                      customerName: customer || '付豪跨境电商事业群'
                    };
                    onSave(mockWaybill);
                    addToast(`批量文件 ${uploadedFile} 配置加载成功！生成了 1 行高配批条目`, 'success');
                    onClose();
                  }}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-200 transition-colors cursor-pointer"
                >
                  确认导入下单
                </button>
              </div>

            </div>
          )}

        </div>
      </>
    )}

      </div>
    </div>
  );
}
