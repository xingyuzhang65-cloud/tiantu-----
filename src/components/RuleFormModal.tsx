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
  const [ruleName, setRuleName] = useState(editRule?.ruleName || '');
  const [isAllStation, setIsAllStation] = useState(editRule?.isAllStation ?? true);
  const [isAllService, setIsAllService] = useState(editRule?.isAllService ?? true);
  const [isRequired, setIsRequired] = useState(editRule?.isRequired ?? true);
  const [status, setStatus] = useState(editRule?.status ?? true);
  const [stationCodes, setStationCodes] = useState<string[]>(editRule?.stationCodes || []);
  const [serviceCodes, setServiceCodes] = useState<string[]>(editRule?.serviceCodes || []);

  // Dropdown states for multi-select
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

  const toggleStation = (code: string) => {
    setStationCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
    if (errors.stationCodes) setErrors(prev => ({ ...prev, stationCodes: '' }));
  };

  const toggleService = (code: string) => {
    setServiceCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
    if (errors.serviceCodes) setErrors(prev => ({ ...prev, serviceCodes: '' }));
  };

  const removeStation = (code: string) => {
    setStationCodes(prev => prev.filter(c => c !== code));
  };

  const removeService = (code: string) => {
    setServiceCodes(prev => prev.filter(c => c !== code));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!ruleName.trim()) {
      newErrors.ruleName = '请输入规则名称';
    } else if (ruleName.trim().length > 50) {
      newErrors.ruleName = '规则名称不能超过50个字符';
    }

    if (!isAllStation && stationCodes.length === 0) {
      newErrors.stationCodes = '请至少选择一个送货货站';
    }

    if (!isAllService && serviceCodes.length === 0) {
      newErrors.serviceCodes = '请至少选择一个服务类型';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('请完善表单中的必填项', 'warning');
      return;
    }

    onSave({
      id: editRule?.id,
      ruleName: ruleName.trim(),
      isAllStation,
      isAllService,
      isRequired,
      status,
      stationCodes: isAllStation ? [] : stationCodes,
      serviceCodes: isAllService ? [] : serviceCodes,
    });
  };

  const sharedDropdownBtnClass = "flex items-center justify-between w-full rounded border text-xs px-3 py-1.5 bg-white focus:outline-none transition-colors";
  const tagClass = "inline-flex items-center gap-1 rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] text-blue-700 font-medium";

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-950/55 pt-16 font-sans">
      <div className="w-[580px] rounded-xl bg-white shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="inline-block w-1.5 h-4 bg-blue-600 rounded-sm" />
            {isEdit ? '编辑校验规则' : '新增校验规则'}
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
          {/* 1. Rule Name */}
          <div className="relative">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-red-500 mr-1">*</span>规则名称
            </label>
            <input
              type="text"
              value={ruleName}
              onChange={(e) => {
                setRuleName(e.target.value);
                if (errors.ruleName) setErrors(prev => ({ ...prev, ruleName: '' }));
              }}
              placeholder="请输入规则名称，限50字符"
              maxLength={50}
              className={`w-full rounded-lg border bg-white px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                errors.ruleName ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
              }`}
            />
            {errors.ruleName && (
              <span className="absolute text-[9px] text-red-500 -bottom-4 left-0">{errors.ruleName}</span>
            )}
          </div>

          {/* 2. Station — Radio + conditional multi-select */}
          <fieldset>
            <legend className="block text-[11px] font-semibold text-slate-600 mb-2">
              <span className="text-red-500 mr-1">*</span>适用送货货站
            </legend>
            <div className="flex items-center gap-6 mb-3">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="isAllStation"
                  checked={isAllStation}
                  onChange={() => setIsAllStation(true)}
                  className="h-3.5 w-3.5 text-blue-600"
                />
                <span>全部货站</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="isAllStation"
                  checked={!isAllStation}
                  onChange={() => setIsAllStation(false)}
                  className="h-3.5 w-3.5 text-blue-600"
                />
                <span>指定货站</span>
              </label>
            </div>

            {!isAllStation && (
              <div className="space-y-2">
                {/* Station multi-select dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setStationDropdownOpen(!stationDropdownOpen)}
                    className={`${sharedDropdownBtnClass} ${
                      errors.stationCodes ? 'border-red-400' : 'border-slate-300'
                    }`}
                  >
                    <span className={stationCodes.length === 0 ? 'text-slate-400' : 'text-slate-700'}>
                      {stationCodes.length === 0 ? '请选择货站（可多选）' : `已选 ${stationCodes.length} 个货站`}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>
                  {stationDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl py-1">
                      {STATION_OPTIONS.map(opt => {
                        const isSelected = stationCodes.includes(opt.code);
                        return (
                          <button
                            key={opt.code}
                            type="button"
                            onClick={() => toggleStation(opt.code)}
                            className={`flex w-full items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-blue-50 transition-colors ${
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
            )}
          </fieldset>

          {/* 3. Service Type — Radio + conditional multi-select */}
          <fieldset>
            <legend className="block text-[11px] font-semibold text-slate-600 mb-2">
              <span className="text-red-500 mr-1">*</span>适用服务类型
            </legend>
            <div className="flex items-center gap-6 mb-3">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="isAllService"
                  checked={isAllService}
                  onChange={() => setIsAllService(true)}
                  className="h-3.5 w-3.5 text-blue-600"
                />
                <span>全部服务</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="isAllService"
                  checked={!isAllService}
                  onChange={() => setIsAllService(false)}
                  className="h-3.5 w-3.5 text-blue-600"
                />
                <span>指定服务</span>
              </label>
            </div>

            {!isAllService && (
              <div className="space-y-2">
                {/* Service multi-select dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                    className={`${sharedDropdownBtnClass} ${
                      errors.serviceCodes ? 'border-red-400' : 'border-slate-300'
                    }`}
                  >
                    <span className={serviceCodes.length === 0 ? 'text-slate-400' : 'text-slate-700'}>
                      {serviceCodes.length === 0 ? '请选择服务类型（可多选）' : `已选 ${serviceCodes.length} 个服务`}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>
                  {serviceDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl py-1">
                      {SERVICE_OPTIONS.map(opt => {
                        const isSelected = serviceCodes.includes(opt.code);
                        return (
                          <button
                            key={opt.code}
                            type="button"
                            onClick={() => toggleService(opt.code)}
                            className={`flex w-full items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-blue-50 transition-colors ${
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
            )}
          </fieldset>

          {/* 4. Trade Mode Required */}
          <fieldset>
            <legend className="block text-[11px] font-semibold text-slate-600 mb-2">
              <span className="text-red-500 mr-1">*</span>贸易方式
            </legend>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="isRequired"
                  checked={isRequired}
                  onChange={() => setIsRequired(true)}
                  className="h-3.5 w-3.5 text-blue-600"
                />
                <span>必填</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="isRequired"
                  checked={!isRequired}
                  onChange={() => setIsRequired(false)}
                  className="h-3.5 w-3.5 text-blue-600"
                />
                <span>非必填</span>
              </label>
            </div>
          </fieldset>

          {/* 5. Status */}
          <fieldset>
            <legend className="block text-[11px] font-semibold text-slate-600 mb-2">
              <span className="text-red-500 mr-1">*</span>是否启用
            </legend>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === true}
                  onChange={() => setStatus(true)}
                  className="h-3.5 w-3.5 text-blue-600"
                />
                <span>启用</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === false}
                  onChange={() => setStatus(false)}
                  className="h-3.5 w-3.5 text-blue-600"
                />
                <span>禁用</span>
              </label>
            </div>
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
