'use client';

import { useLanguage } from './LanguageContext';

interface SummaryRow {
  label: string;
  value: string;
}

interface Props {
  open: boolean;
  rows: SummaryRow[];
  busy?: boolean;
  busyMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Lightweight modal shown right before the cart redirect. Lists exactly the
 * line-item properties that will be sent to Shopify so the customer can
 * confirm their order details one last time.
 */
export default function CartSummaryModal({
  open,
  rows,
  busy,
  busyMessage,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useLanguage();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 px-3 py-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-title"
      onClick={busy ? undefined : onCancel}
    >
      <div
        className="bg-brand-paper w-full max-w-md rounded-card shadow-pop overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3 border-b border-brand-stroke">
          <h2
            id="summary-title"
            className="font-extrabold text-lg text-brand-ink"
          >
            {t('summaryTitle')}
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            {t('summarySubtitle')}
          </p>
        </div>

        <dl className="px-5 py-4 space-y-2.5">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <dt className="text-brand-muted shrink-0">{r.label}</dt>
              <dd className="font-semibold text-brand-ink text-right break-words">
                {r.value}
              </dd>
            </div>
          ))}
        </dl>

        {busy && busyMessage && (
          <p className="px-5 pb-2 text-xs text-brand-muted text-center">
            {busyMessage}
          </p>
        )}

        <div className="px-5 pb-5 pt-2 flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={busy}
            className="w-full font-bold py-3 rounded-pill bg-brand-primary text-brand-primary-label shadow-pop hover:bg-brand-primary-hover transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? t('summaryWorking') : t('summaryConfirm')}
          </button>
          <button
            onClick={onCancel}
            disabled={busy}
            className="w-full text-sm font-semibold py-2 text-brand-ink/70 hover:text-brand-primary transition disabled:opacity-50"
          >
            {t('backToEditing')}
          </button>
        </div>
      </div>
    </div>
  );
}
