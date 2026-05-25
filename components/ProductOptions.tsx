'use client';

import { PHONE_MODELS } from '@/lib/phone-models';
import { CASE_COLORS } from '@/lib/case-colors';

interface Props {
  modelId: string;
  caseColor: string;
  backgroundColor: string;
  onModelChange: (id: string) => void;
  onCaseColorChange: (hex: string) => void;
  onBackgroundChange: (hex: string) => void;
  showOnlyColors?: boolean;
}

export default function ProductOptions({
  modelId,
  caseColor,
  backgroundColor,
  onModelChange,
  onCaseColorChange,
  onBackgroundChange,
  showOnlyColors,
}: Props) {
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
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Samsung">
              {PHONE_MODELS.filter((m) => m.brand === 'Samsung').map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      )}

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
