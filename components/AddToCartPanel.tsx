'use client';

import type { PhoneModel } from '@/lib/phone-models';
import { CASE_COLORS } from '@/lib/case-colors';

interface Props {
  model: PhoneModel;
  caseColor: string;
  objectCount: number;
  status: {
    state: 'idle' | 'exporting' | 'uploading' | 'redirecting' | 'success' | 'error';
    message?: string;
  };
  disabled: boolean;
  onAdd: () => void;
  compact?: boolean;
}

const STATUS_LABEL: Record<Props['status']['state'], string> = {
  idle: 'Add Custom Case to Cart',
  exporting: 'Preparing print file…',
  uploading: 'Uploading design…',
  redirecting: 'Redirecting to checkout…',
  success: 'Done!',
  error: 'Try again',
};

export default function AddToCartPanel({
  model,
  caseColor,
  objectCount,
  status,
  disabled,
  onAdd,
  compact,
}: Props) {
  const colorName = CASE_COLORS.find((c) => c.hex === caseColor)?.name ?? caseColor;
  const busy =
    status.state === 'exporting' ||
    status.state === 'uploading' ||
    status.state === 'redirecting';

  return (
    <div className={`bg-white border border-brand-stroke rounded-card shadow-card ${compact ? 'p-3' : 'p-4'}`}>
      {!compact && (
        <div className="space-y-1.5 mb-3 text-xs">
          <div className="flex justify-between">
            <span className="text-brand-muted">Model</span>
            <span className="font-semibold">{model.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Color</span>
            <span className="font-semibold">{colorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Elements</span>
            <span className="font-semibold">{objectCount}</span>
          </div>
        </div>
      )}

      <button
        onClick={onAdd}
        disabled={disabled || busy}
        className={`w-full font-bold py-3.5 rounded-pill transition text-sm ${
          disabled
            ? 'bg-brand-stroke text-brand-muted cursor-not-allowed'
            : busy
            ? 'bg-brand-ink text-white cursor-wait'
            : 'bg-brand-primary text-white shadow-pop hover:bg-brand-primary-hover active:scale-[0.98]'
        }`}
      >
        {busy ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Spinner /> {STATUS_LABEL[status.state]}
          </span>
        ) : (
          STATUS_LABEL[status.state]
        )}
      </button>

      {status.state === 'success' && (
        <p className="text-xs text-green-600 mt-2 text-center">
          Your custom case is ready. Redirecting you to checkout.
        </p>
      )}
      {status.state === 'error' && (
        <p className="text-xs text-red-600 mt-2 text-center">
          {status.message || "We couldn't prepare your design. Please try again."}
        </p>
      )}
      {disabled && status.state === 'idle' && (
        <p className="text-xs text-brand-muted mt-2 text-center">
          Fix the highlighted issue before continuing.
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
