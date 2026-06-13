'use client';

import type { DesignObject } from '@/lib/design-types';

interface Props {
  objects: DesignObject[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<DesignObject>) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
}

const ICONS = {
  image: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  ),
  text: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  ),
  sticker: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-9-9v6h6c0 .8 0 1.6-.2 2.4" />
      <path d="M14 21l7-7" />
    </svg>
  ),
};

function label(obj: DesignObject): string {
  if (obj.type === 'text') return obj.text.slice(0, 24) || 'Text';
  if (obj.type === 'sticker') return obj.name || 'Sticker';
  return obj.name || 'Image';
}

export default function LayersPanel({
  objects,
  selectedId,
  onSelect,
  onUpdate,
  onDelete,
  onReorder,
}: Props) {
  // Show top-most layers first (last in array = drawn last = on top).
  const ordered = [...objects].reverse();

  return (
    <div className="bg-white border border-brand-stroke rounded-card p-4 space-y-2 shadow-card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-sm">Layers</h3>
        <span className="text-xs text-brand-muted">{objects.length} item{objects.length === 1 ? '' : 's'}</span>
      </div>

      {ordered.length === 0 ? (
        <p className="text-xs text-brand-muted text-center py-6">
          Add an image, text, or sticker to start designing.
        </p>
      ) : (
        <ul className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin -mx-1 px-1">
          {ordered.map((obj) => {
            const isSelected = obj.id === selectedId;
            return (
              <li
                key={obj.id}
                className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm transition ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary-soft'
                    : 'border-brand-stroke bg-white hover:border-brand-primary/40'
                }`}
              >
                <button
                  onClick={() => onSelect(obj.id)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left"
                  title="Select"
                >
                  <span
                    className={`shrink-0 ${
                      isSelected ? 'text-brand-primary' : 'text-brand-muted'
                    }`}
                  >
                    {ICONS[obj.type]}
                  </span>
                  <span className="truncate font-medium">{label(obj)}</span>
                </button>

                {/* Reorder up / down */}
                <button
                  onClick={() => onReorder(obj.id, 'up')}
                  className="p-1 rounded hover:bg-brand-paper text-brand-muted"
                  title="Bring forward"
                  aria-label="Bring forward"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m18 15-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => onReorder(obj.id, 'down')}
                  className="p-1 rounded hover:bg-brand-paper text-brand-muted"
                  title="Send backward"
                  aria-label="Send backward"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Visibility toggle */}
                <button
                  onClick={() => onUpdate(obj.id, { visible: !obj.visible })}
                  className="p-1 rounded hover:bg-brand-paper text-brand-muted"
                  title={obj.visible ? 'Hide' : 'Show'}
                  aria-label={obj.visible ? 'Hide layer' : 'Show layer'}
                >
                  {obj.visible ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.88 5.08A10 10 0 0 1 22 12s-3.5 7-10 7a10 10 0 0 1-5.5-1.7" />
                      <path d="m2 2 20 20" strokeLinecap="round" />
                      <path d="M6.6 6.6A10 10 0 0 0 2 12s3.5 7 10 7" />
                    </svg>
                  )}
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDelete(obj.id)}
                  className="p-1 rounded hover:bg-brand-primary-soft text-brand-primary"
                  title="Delete"
                  aria-label="Delete layer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-brand-muted pt-2 border-t border-brand-stroke">
        Top of the list = on top of the design.
      </p>
    </div>
  );
}
