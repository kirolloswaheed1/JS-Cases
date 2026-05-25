'use client';

import { useMemo, useState } from 'react';
import { ASSET_CATEGORIES, type AssetItem } from '@/lib/assets-library';
import type { StickerObject } from '@/lib/design-types';

interface Props {
  onAddSticker: (asset: AssetItem, categoryId: string) => void;
  selected: StickerObject | null;
  onUpdate: (patch: Partial<StickerObject>) => void;
}

const PRESET_COLORS = [
  '#0A0A0A',
  '#FFFFFF',
  '#FF4D8D',
  '#FFC7DA',
  '#FFD84D',
  '#A0D8F1',
  '#C8B6FF',
  '#B7E4C7',
  '#E63946',
  '#FFA500',
];

export default function AssetsPanel({ onAddSticker, selected, onUpdate }: Props) {
  const [activeCategory, setActiveCategory] = useState(ASSET_CATEGORIES[0].id);
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const all = ASSET_CATEGORIES.flatMap((c) =>
        c.assets.map((a) => ({ ...a, categoryId: c.id }))
      );
      return all.filter(
        (a) => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
      );
    }
    const cat = ASSET_CATEGORIES.find((c) => c.id === activeCategory);
    return (cat?.assets ?? []).map((a) => ({ ...a, categoryId: activeCategory }));
  }, [activeCategory, query]);

  return (
    <div className="bg-white border border-brand-stroke rounded-card p-4 space-y-3">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stickers…"
          className="w-full border border-brand-stroke rounded-pill pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
        />
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </div>

      {/* Category chips */}
      {!query && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {ASSET_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`shrink-0 px-3 py-1.5 rounded-pill text-xs font-semibold transition whitespace-nowrap ${
                activeCategory === c.id
                  ? 'bg-brand-ink text-white'
                  : 'bg-brand-paper text-brand-ink hover:bg-brand-primary-soft'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
        {visible.map((a) => (
          <button
            key={`${a.categoryId}-${a.id}`}
            onClick={() => onAddSticker(a, a.categoryId)}
            title={a.name}
            className="aspect-square rounded-xl bg-brand-paper hover:bg-brand-primary-soft border border-transparent hover:border-brand-primary/40 transition p-2 flex items-center justify-center hover-wiggle"
          >
            <span
              className="block w-full h-full"
              style={{ color: a.defaultColor || '#0A0A0A' }}
              // dangerouslySetInnerHTML is safe here — these SVGs are
              // hard-coded literals in our own assets library, not user input.
              dangerouslySetInnerHTML={{ __html: a.svg }}
            />
          </button>
        ))}
        {visible.length === 0 && (
          <p className="col-span-4 text-center text-xs text-brand-muted py-6">
            No stickers match that search.
          </p>
        )}
      </div>

      {/* Selected sticker controls */}
      {selected && (
        <div className="pt-3 border-t border-brand-stroke">
          <p className="text-xs font-semibold text-brand-ink mb-2">Sticker color</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onUpdate({ fill: c })}
                className={`w-7 h-7 rounded-full border-2 shadow-soft ${
                  selected.fill === c ? 'border-brand-primary' : 'border-white'
                }`}
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
      )}
    </div>
  );
}
