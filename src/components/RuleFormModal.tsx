import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { TradeModeRule, StationOption, ServiceOption, STATION_OPTIONS, SERVICE_OPTIONS } from '../types';

interface RuleFormModalProps {
  onClose: () => void;
  onSave: (draft: Omit<TradeModeRule, 'id' | 'createTime' | 'updateTime'> & { id?: number }) => void;
  editRule?: TradeModeRule | null;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export default function RuleFormModal({ onClose, onSave, editRule, addToast }: RuleFormModalProps) {
  const isEdit = !!editRule;

  // Form state
  const [stationCodes, setStationCodes] = useState<string[]>(editRule?.stationCodes || []);
  const [serviceCodes, setServiceCodes] = useState<string[]>(editRule?.serviceCodes || []);
  const [isRequired, setIsRequired] = useState<boolean | null>(editRule?.isRequired ?? null);

  // Dropdown states
  const [stationDropdownOpen, setStationDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = () => {
      setStationDropdownOpen(false);
      setServiceDropdownOpen(false);
    };
    if (stationDropdownOpen || serviceDropdownOpen) {
      window.addEventListener('click', handler);
      return () => window.removeEventListener('click', handler);
    }
  }, [stationDropdownOpen, serviceDropdownOpen]);

  // ─── Station handlers ─────────────────────────────────────────────────────
  const isStationAllSelected = stationCodes.length === STATION_OPTIONS.length;

  const toggleStationAll = () => {
    if (isStationAllSelected) {
      setStationCodes([]);
    } else {
      setStationCodes(STATION_OPTIONS.map(o => o.code));
    }
    if (errors.stationCodes) setErrors(prev => ({ ...prev, stationCodes: '' }));
  };

  const toggleStation = (code: string) => {
    setStationCodes(prev => {
      const next = prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code];
      return next;
    });
    if (errors.stationCodes) setErrors(prev => ({ ...prev, stationCodes: '' }));
  };

  const removeStation = (code: string) => {
    setStationCodes(prev => prev.filter(c => c !== code));
  };

  // ─── Service handlers ─────────────────────────────────────────────────────
  const isServiceAllSelected = serviceCodes.length === SERVICE_OPTIONS.length;

  const toggleServiceAll = () => {
    if (isServiceAllSelected) {
      setServiceCodes([]);
    } else {
      setServiceCodes(SERVICE_OPTIONS.map(o => o.code));
    }
    if (errors.serviceCodes) setErrors(prev => ({ ...prev, serviceCodes: '' }));
  };

  const toggleService = (code: string) => {
    setServiceCodes(prev => {
      const next = prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code];
      return next;
    });
    if (errors.serviceCodes) setErrors(prev => ({ ...prev, serviceCodes: '' }));
  };

  const removeService = (code: string) => {
    setServiceCodes(prev => prev.filter(c => c !== code));
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (stationCodes.length === 0) {
      newErrors.stationCodes = '请至少选择一个送货货站';
    }

    if (serviceCodes.length === 0) {
      newErrors.serviceCodes = '请至少选择一个服务类型';
    }

    if (isRequired === null) {
      newErrors.isRequired = '请选择贸易方式是否必填';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('请完善表单中的必填项', 'warning');
      return;
    }

    onSave({
      id: editRule?.id,
      stationCodes,
      serviceCodes,
      isRequired: isRequired ?? true,
      status: editRule?.status ?? true,
      updateUser: '天朗（付豪）',
    });
  };

  const dropdownBtnClass = "flex items-center justify-between w-full rounded border text-xs px-3 py-2 bg-white focus:outline-none transition-colors";
  const tagClass = "inline-flex items-center gap-1 rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] text-blue-700 font-medium";

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-950/55 pt-16 font-sans">
      <div className="w-[540px] rounded-xl bg-white shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="inline-block w-1.5 h-4 bg-blue-600 rounded-sm" />
            {isEdit ? '编辑贸易方式规则' : '新增贸易方式规则'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. 送货货站 — Multi-select with 全选 */}
          <fieldset>
            <legend className="block text-[11px] font-semibold text-slate-600 mb-2">
              <span className="text-red-500 mr-1">*</span>送货货站
            </legend>
            <div className="space-y-2">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setStationDropdownOpen(!stationDropdownOpen)}
                  className={`${dropdownBtnClass} ${
                    errors.stationCodes ? 'border-red-400' : 'border-slate-300'
                  }`}
                >
                  <span className={stationCodes.length === 0 ? 'text-slate-400' : 'text-slate-700'}>
                    {stationCodes.length === 0
                      ? '请选择送货货站（可多选）'
                      : `已选 ${stationCodes.length} 个货站`}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
                {stationDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl py-1">
                    {/* 全选 option */}
                    <button
                      key="all"
                      type="button"
                      onClick={toggleStationAll}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-xs text-left hover:bg-blue-50 transition-colors font-semibold border-b border-slate-100 ${
                        isStationAllSelected ? 'text-blue-700' : 'text-slate-600'
                      }`}
                    >
                      <span className={`inline-flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                        isStationAllSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300'
                      }`}>
                        {isStationAllSelected && <Check className="h-3 w-3" />}
                      </span>
                      全选
                    </button>
                    {STATION_OPTIONS.map(opt => {
                      const isSelected = stationCodes.includes(opt.code);
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => toggleStation(opt.code)}
                          className={`flex w-full items-center justify-between px-3 py-2 text-xs text-left hover:bg-blue-50 transition-colors ${
                            isSelected ? 'text-blue-700 font-medium' : 'text-slate-600'
                          }`}
                        >
                          <span>{opt.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected station tags */}
              {stationCodes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {stationCodes.map(code => {
                    const opt = STATION_OPTIONS.find(o => o.code === code);
                    return (
                      <span key={code} className={tagClass}>
                        {opt?.name || code}
                        <button
                          type="button"
                          onClick={() => removeStation(code)}
                          className="ml-0.5 text-blue-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {errors.stationCodes && (
                <span className="text-[9px] text-red-500">{errors.stationCodes}</span>
              )}
            </div>
          </fieldset>

          {/* 2. 服务类型 — Multi-select with 全选 */}
          <fieldset>
            <legend className="block text-[11px] font-semibold text-slate-600 mb-2">
              <span className="text-red-500 mr-1">*</span>服务类型
            </legend>
            <div className="space-y-2">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                  className={`${dropdownBtnClass} ${
                    errors.serviceCodes ? 'border-red-400' : 'border-slate-300'
                  }`}
                >
                  <span className={serviceCodes.length === 0 ? 'text-slate-400' : 'text-slate-700'}>
                    {serviceCodes.length === 0
                      ? '请选择服务类型（可多选）'
                      : `已选 ${serviceCodes.length} 个服务`}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
                {serviceDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl py-1">
                    {/* 全选 option */}
                    <button
                      key="all"
                      type="button"
                      onClick={toggleServiceAll}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-xs text-left hover:bg-blue-50 transition-colors font-semibold border-b border-slate-100 ${
                        isServiceAllSelected ? 'text-blue-700' : 'text-slate-600'
                      }`}
                    >
                      <span className={`inline-flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                        isServiceAllSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300'
                      }`}>
                        {isServiceAllSelected && <Check className="h-3 w-3" />}
                      </span>
                      全选
                    </button>
                    {SERVICE_OPTIONS.map(opt => {
                      const isSelected = serviceCodes.includes(opt.code);
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => toggleService(opt.code)}
                          className={`flex w-full items-center justify-between px-3 py-2 text-xs text-left hover:bg-blue-50 transition-colors ${
                            isSelected ? 'text-blue-700 font-medium' : 'text-slate-600'
                          }`}
                        >
                          <span>{opt.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected service tags */}
              {serviceCodes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {serviceCodes.map(code => {
                    const opt = SERVICE_OPTIONS.find(o => o.code === code);
                    return (
                      <span key={code} className={tagClass}>
                        {opt?.name || code}
                        <button
                          type="button"
                          onClick={() => removeService(code)}
                          className="ml-0.5 text-blue-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {errors.serviceCodes && (
                <span className="text-[9px] text-red-500">{errors.serviceCodes}</span>
              )}
            </div>
          </fieldset>

          {/* 3. 是否必填贸易方式 — Radio */}
          <fieldset>
            <legend className="block text-[11px] font-semibold text-slate-600 mb-2">
              <span className="text-red-500 mr-1">*</span>是否必填贸易方式
            </legend>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="isRequired"
                  checked={isRequired === true}
                  onChange={() => {
                    setIsRequired(true);
                    if (errors.isRequired) setErrors(prev => ({ ...prev, isRequired: '' }));
                  }}
                  className="h-3.5 w-3.5 text-blue-600"
                />
                <span>是</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="isRequired"
                  checked={isRequired === false}
                  onChange={() => {
                    setIsRequired(false);
                    if (errors.isRequired) setErrors(prev => ({ ...prev, isRequired: '' }));
                  }}
                  className="h-3.5 w-3.5 text-blue-600"
                />
                <span>否</span>
              </label>
            </div>
            {errors.isRequired && (
              <span className="text-[9px] text-red-500 mt-1 block">{errors.isRequired}</span>
            )}
          </fieldset>

        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-[#004bb1] px-5 py-2 text-xs font-bold text-white hover:bg-[#003b91] shadow-md shadow-blue-150 transition-all"
          >
            保存并生效
          </button>
        </div>
      </div>
    </div>
  );
}
