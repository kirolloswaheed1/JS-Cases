'use client';

import { useMemo, useState } from 'react';
import { ASSET_CATEGORIES, type AssetItem } from '@/lib/assets-library';
import type { StickerObject } from '@/lib/design-types';

interface Props {
  onAddSticker: (asset: AssetItem, categoryId: string) => void;
  selected: StickerObject | null;
  onUpdate: (patch: Partial<StickerObject>) => void;
}

export default function AssetsPanel({ onAddSticker, selected }: Props) {
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
              className={`shrink-0 px-4 py-1.5 rounded-pill text-xs font-bold transition whitespace-nowrap ${
                activeCategory === c.id
                  ? 'bg-brand-primary text-brand-primary-label'
                  : 'bg-brand-paper text-brand-ink hover:bg-brand-primary-soft border border-brand-stroke'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
        {visible.map((a) => (
          <button
            key={`${a.categoryId}-${a.id}`}
            onClick={() => onAddSticker(a, a.categoryId)}
            title={a.name}
            className="aspect-square rounded-xl bg-brand-paper hover:bg-brand-primary-soft border border-brand-stroke hover:border-brand-primary/50 transition p-2 flex items-center justify-center hover-wiggle"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.src}
              alt={a.name}
              loading="lazy"
              className="max-w-full max-h-full object-contain pointer-events-none"
            />
          </button>
        ))}
        {visible.length === 0 && (
          <p className="col-span-3 text-center text-xs text-brand-muted py-6">
            No stickers match that search.
          </p>
        )}
      </div>

      {selected && (
        <p className="text-xs text-brand-muted pt-2 border-t border-brand-stroke">
          Tap a sticker on the case to move, resize, or rotate it.
        </p>
      )}
    </div>
  );
}
