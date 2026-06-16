'use client';

import { useLanguage } from './LanguageContext';

export type Step = 'phone' | 'design' | 'preview' | 'cart';

interface Props {
  current: Step;
  onStepClick?: (step: Step) => void;
}


/**
 * Horizontal step indicator. The `current` step reflects where the customer
 * is in the flow; previous steps are marked complete, following steps muted.
 * Clicking a step is optional — wire `onStepClick` to let the user jump.
 */
export default function StepIndicator({ current, onStepClick }: Props) {
  const { t } = useLanguage();
  const STEPS: { id: Step; label: string; shortLabel: string }[] = [
    { id: 'phone',   label: t('stepPhone'),   shortLabel: t('stepPhoneShort') },
    { id: 'design',  label: t('stepDesign'),  shortLabel: t('stepDesignShort') },
    { id: 'preview', label: t('stepPreview'), shortLabel: t('stepPreviewShort') },
    { id: 'cart',    label: t('stepCart'),    shortLabel: t('stepCartShort') },
  ];
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav
      aria-label="Design steps"
      className="max-w-3xl mx-auto px-2"
    >
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {STEPS.map((step, i) => {
          const status =
            i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming';
          const clickable = !!onStepClick && i <= currentIndex + 1;
          const Inner = (
            <span className="flex items-center gap-2">
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition ${
                  status === 'done'
                    ? 'bg-brand-primary text-brand-primary-label'
                    : status === 'current'
                      ? 'bg-brand-primary text-brand-primary-label ring-4 ring-brand-primary/20'
                      : 'bg-brand-paper text-brand-muted border border-brand-stroke'
                }`}
                aria-hidden="true"
              >
                {status === 'done' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
                  status === 'current'
                    ? 'text-brand-ink'
                    : status === 'done'
                      ? 'text-brand-ink/80'
                      : 'text-brand-muted'
                }`}
              >
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel}</span>
              </span>
            </span>
          );
          return (
            <li
              key={step.id}
              className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0"
              aria-current={status === 'current' ? 'step' : undefined}
            >
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(step.id)}
                  className="text-left"
                >
                  {Inner}
                </button>
              ) : (
                Inner
              )}
              {i < STEPS.length - 1 && (
                <span
                  className={`flex-1 h-0.5 rounded-full ${
                    i < currentIndex ? 'bg-brand-primary' : 'bg-brand-stroke'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
