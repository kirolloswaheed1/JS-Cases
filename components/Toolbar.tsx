'use client';

type Tab = 'product' | 'upload' | 'text' | 'stickers' | 'colors';

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  mobile?: boolean;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'product',
    label: 'Phone',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <circle cx="12" cy="18" r="1" />
      </svg>
    ),
  },
  {
    id: 'upload',
    label: 'Upload',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
    ),
  },
  {
    id: 'text',
    label: 'Text',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7V4h16v3M9 20h6M12 4v16" />
      </svg>
    ),
  },
  {
    id: 'stickers',
    label: 'Stickers',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-9-9v6h6c0 .8 0 1.6-.2 2.4" strokeLinecap="round" />
        <path d="M14 21l7-7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'colors',
    label: 'Colors',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="8" cy="9" r="1.5" />
        <circle cx="15" cy="8" r="1.5" />
        <circle cx="17" cy="14" r="1.5" />
        <circle cx="10" cy="16" r="1.5" />
      </svg>
    ),
  },
];

export default function Toolbar({ activeTab, onChange, mobile }: Props) {
  if (mobile) {
    return (
      <div className="flex items-center justify-around bg-brand-paper rounded-pill p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-pill text-xs font-medium transition ${
              activeTab === t.id
                ? 'bg-white text-brand-ink shadow-soft'
                : 'text-brand-muted'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-stroke rounded-card p-2 space-y-1 shadow-card">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === t.id
              ? 'bg-brand-primary text-white shadow-pop'
              : 'text-brand-ink hover:bg-brand-primary-soft'
          }`}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}
