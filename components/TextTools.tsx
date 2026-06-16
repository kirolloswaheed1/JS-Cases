'use client';

import { useLanguage } from './LanguageContext';

import type { TextObject } from '@/lib/design-types';

interface Props {
  onAddText: (text: string) => void;
  selected: TextObject | null;
  onUpdate: (patch: Partial<TextObject>) => void;
}

const FONTS = [
  'Poppins',
  'Montserrat',
  'Playfair Display',
  'Cairo',
  'Tajawal',
  'Amiri',
  'Reem Kufi',
  'Arial',
  'Helvetica',
];

const PRESET_COLORS = [
  '#0A0A0A',
  '#FFFFFF',
  '#FF4D8D',
  '#FFD84D',
  '#A0D8F1',
  '#C8B6FF',
  '#E63946',
  '#B7E4C7',
];

export default function TextTools({ onAddText, selected, onUpdate }: Props) {
  const { t } = useLanguage();
  return (
    <div className="bg-white border border-brand-stroke rounded-card p-4 space-y-4 shadow-card">
      <button
        onClick={() => onAddText(t('textPlaceholder'))}
        className="w-full bg-brand-ink text-white font-bold py-2.5 rounded-pill hover:bg-black transition"
      >
        + {t('addText')}
      </button>

      {selected ? (
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">
              {t('addText')}
            </label>
            {selected.textLayout === 'multiline' ? (
              <textarea
                value={selected.text}
                onChange={(e) => onUpdate({ text: e.target.value })}
                dir="auto"
                rows={3}
                className="w-full border border-brand-stroke rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary resize-y"
              />
            ) : (
              <input
                type="text"
                value={selected.text}
                onChange={(e) => onUpdate({ text: e.target.value })}
                dir="auto"
                className="w-full border border-brand-stroke rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
              />
            )}
          </div>

          {/* Text layout — horizontal / multiline / stacked */}
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">
              {t('textLayout')}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(
                [
                  { id: 'horizontal', label: 'Horizontal', preview: 'Ab' },
                  { id: 'multiline', label: 'Multi-line', preview: '¶' },
                  { id: 'stacked',  label: 'Stacked',    preview: 'A\nB' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdate({ textLayout: opt.id })}
                  className={`py-1.5 text-xs rounded-lg border font-semibold ${
                    (selected.textLayout ?? 'horizontal') === opt.id
                      ? 'border-brand-primary bg-brand-primary-soft text-brand-primary-hover'
                      : 'border-brand-stroke text-brand-muted hover:border-brand-primary/40'
                  }`}
                  title={opt.label}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {selected.textLayout === 'stacked' && (
              <p className="text-[11px] text-brand-muted mt-1">
                Each character is shown on its own line.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">
              {t('textFont')}
            </label>
            <select
              value={selected.fontFamily}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              className="w-full border border-brand-stroke rounded-lg px-3 py-2 text-sm bg-white"
            >
              {FONTS.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1">
                Size
              </label>
              <input
                type="number"
                value={selected.fontSize}
                min={8}
                max={200}
                onChange={(e) =>
                  onUpdate({ fontSize: Math.max(8, Number(e.target.value) || 0) })
                }
                className="w-full border border-brand-stroke rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1">
                Spacing
              </label>
              <input
                type="number"
                value={selected.letterSpacing}
                onChange={(e) => onUpdate({ letterSpacing: Number(e.target.value) || 0 })}
                className="w-full border border-brand-stroke rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">
              Line height {(selected.lineHeight ?? 1.2).toFixed(2)}×
            </label>
            <input
              type="range"
              min={0.8}
              max={3}
              step={0.05}
              value={selected.lineHeight ?? 1.2}
              onChange={(e) => onUpdate({ lineHeight: Number(e.target.value) })}
              className="w-full accent-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">
              {t('textStyle')}
            </label>
            <div className="flex gap-1">
              {(['normal', 'bold', 'italic', 'bold italic'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdate({ fontStyle: s })}
                  className={`flex-1 py-1.5 text-xs rounded-lg border ${
                    selected.fontStyle === s
                      ? 'border-brand-primary bg-brand-primary-soft text-brand-primary'
                      : 'border-brand-stroke text-brand-muted'
                  }`}
                >
                  {s === 'bold italic' ? 'B+I' : s[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1">
              Align
            </label>
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => onUpdate({ align: a })}
                  className={`flex-1 py-1.5 text-xs capitalize rounded-lg border ${
                    selected.align === a
                      ? 'border-brand-primary bg-brand-primary-soft text-brand-primary'
                      : 'border-brand-stroke text-brand-muted'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-muted mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdate({ fill: c })}
                  className={`w-7 h-7 rounded-full border-2 ${
                    selected.fill === c ? 'border-brand-primary' : 'border-white'
                  } shadow-soft`}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
              <label className="w-7 h-7 rounded-full border border-brand-stroke cursor-pointer overflow-hidden relative">
                <input
                  type="color"
                  value={selected.fill}
                  onChange={(e) => onUpdate({ fill: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-brand-muted">
          Tap a text element to edit it.
        </p>
      )}
    </div>
  );
}
