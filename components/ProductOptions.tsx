'use client';

import { PHONE_MODELS } from '@/lib/phone-models';
import { CASE_COLORS } from '@/lib/case-colors';

interface Props {
  modelId: string;
  customPhoneModel: string;
  caseType: 'solid' | 'transparent';
  caseColor: string;
  backgroundColor: string;
  onModelChange: (id: string) => void;
  onCustomPhoneModelChange: (v: string) => void;
  onCaseTypeChange: (t: 'solid' | 'transparent') => void;
  onCaseColorChange: (hex: string) => void;
  onBackgroundChange: (hex: string) => void;
  showOnlyColors?: boolean;
}

export default function ProductOptions({
  modelId,
  customPhoneModel,
  caseType,
  caseColor,
  backgroundColor,
  onModelChange,
  onCustomPhoneModelChange,
  onCaseTypeChange,
  onCaseColorChange,
  onBackgroundChange,
  showOnlyColors,
}: Props) {
  const selectedModel = PHONE_MODELS.find((m) => m.id === modelId);
  const isOther = selectedModel?.isOther ?? false;

  return (
    <div className="bg-white border border-brand-stroke rounded-card p-4 space-y-5 shadow-card">
      {!showOnlyColors && (
        <div>
          <h3 className="font-bold text-sm mb-2">Phone model</h3>
          <select
            value={modelId}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full border border-brand-stroke rounded-xl px-3 py-2.5 text-sm bg-white font-semibold focus:outline-none focus:border-brand-primary"
          >
            <optgroup label="iPhone">
              {PHONE_MODELS.filter((m) => m.brand === 'iPhone').map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </optgroup>
            <optgroup label="Samsung">
              {PHONE_MODELS.filter((m) => m.brand === 'Samsung').map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </optgroup>
            <optgroup label="Other">
              {PHONE_MODELS.filter((m) => m.brand === 'Other').map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </optgroup>
          </select>

          {isOther && (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={customPhoneModel}
                onChange={(e) => onCustomPhoneModelChange(e.target.value)}
                placeholder="Write your phone model"
                maxLength={80}
                className="w-full border border-brand-stroke rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-primary"
              />
              <p className="text-xs text-brand-muted bg-brand-cream rounded-lg px-3 py-2">
                Our team will confirm availability before production.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Case type — Solid Color vs Transparent */}
      <div>
        <h3 className="font-bold text-sm mb-2">Case type</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onCaseTypeChange('solid')}
            className={`py-2.5 rounded-xl border-2 text-xs font-bold transition ${
              caseType === 'solid'
                ? 'border-brand-primary bg-brand-primary text-brand-primary-label'
                : 'border-brand-stroke bg-white text-brand-ink hover:border-brand-primary/50'
            }`}
          >
            Solid color
          </button>
          <button
            onClick={() => onCaseTypeChange('transparent')}
            className={`py-2.5 rounded-xl border-2 text-xs font-bold transition relative overflow-hidden ${
              caseType === 'transparent'
                ? 'border-brand-primary text-brand-primary-hover'
                : 'border-brand-stroke text-brand-ink hover:border-brand-primary/50'
            }`}
            style={{
              backgroundImage:
                caseType === 'transparent'
                  ? 'repeating-conic-gradient(#F3EBE0 0% 25%, #FFFFFF 0% 50%) 50% / 12px 12px'
                  : 'repeating-conic-gradient(#EFEAE2 0% 25%, #FFFFFF 0% 50%) 50% / 10px 10px',
            }}
          >
            Transparent
          </button>
        </div>
        <p className="text-xs text-brand-muted mt-2">
          {caseType === 'transparent'
            ? 'Clear case — your design will print on a clear case.'
            : 'Choose a case color below.'}
        </p>
      </div>

      {/* Case color — only relevant when solid */}
      {caseType === 'solid' && (
        <div>
          <h3 className="font-bold text-sm mb-2">Case color</h3>
          <div className="grid grid-cols-5 gap-2">
            {CASE_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => onCaseColorChange(c.hex)}
                title={c.name}
                className={`aspect-square rounded-xl border-2 transition shadow-card ${
                  caseColor === c.hex
                    ? 'border-brand-primary scale-105 ring-2 ring-brand-primary/30'
                    : 'border-white hover:border-brand-stroke'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <p className="text-xs text-brand-muted mt-2">
            {CASE_COLORS.find((c) => c.hex === caseColor)?.name ?? 'Custom'}
          </p>
        </div>
      )}

      <div>
        <h3 className="font-bold text-sm mb-2">Background</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onBackgroundChange('transparent')}
            className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition ${
              backgroundColor === 'transparent'
                ? 'border-brand-primary bg-brand-primary-soft text-brand-primary-hover'
                : 'border-brand-stroke text-brand-muted hover:bg-brand-paper'
            }`}
          >
            None
          </button>
          <label className="relative w-10 h-10 rounded-xl border border-brand-stroke overflow-hidden cursor-pointer">
            <input
              type="color"
              value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="w-full h-full"
              style={{
                background:
                  backgroundColor === 'transparent'
                    ? 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)'
                    : backgroundColor,
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
