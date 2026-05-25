'use client';

import type { ValidationIssue } from '@/lib/validation';

interface Props {
  issues: ValidationIssue[];
  compact?: boolean;
}

const STYLES: Record<
  ValidationIssue['level'],
  { box: string; icon: string; symbol: string }
> = {
  error: {
    box: 'bg-red-50 text-red-700 border-red-200',
    icon: 'text-red-500',
    symbol: '!',
  },
  warning: {
    box: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'text-amber-500',
    symbol: '⚠',
  },
  info: {
    box: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: 'text-sky-500',
    symbol: 'i',
  },
};

export default function ValidationPanel({ issues, compact }: Props) {
  const seen = new Set<string>();
  const deduped = issues.filter((i) => {
    if (seen.has(i.code)) return false;
    seen.add(i.code);
    return true;
  });

  if (deduped.length === 0) {
    if (compact) return null;
    return (
      <div className="bg-white border border-brand-stroke rounded-card p-3 flex items-center gap-2 shadow-card">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs text-brand-muted">Your design looks great.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {deduped.map((i, idx) => {
        const s = STYLES[i.level];
        return (
          <div
            key={idx}
            className={`rounded-xl px-3 py-2 text-xs flex gap-2 items-start border ${s.box}`}
          >
            <span className={`font-bold mt-0.5 ${s.icon}`}>{s.symbol}</span>
            <span className="leading-snug">{i.message}</span>
          </div>
        );
      })}
    </div>
  );
}
