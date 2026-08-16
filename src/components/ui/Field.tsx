import React, { useId } from 'react';
import { cn } from '../../lib/cn';

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  /**
   * A short note set opposite the label — "Required", "Optional".
   *
   * It exists because the alternative was writing the word into the label
   * itself (`${label} · ${optional}`), which put it inside the control's
   * accessible name: every select on the Profile Matcher announced as
   * "Highest education · Optional". Here it is a sibling of the label, so it
   * is read as the aside it is and can be set apart typographically.
   *
   * Optional, and omitted by default, so every existing field renders exactly
   * the markup it did before.
   */
  meta?: React.ReactNode;
  /**
   * A stable id for the control, when the page needs to be able to find it —
   * a form moving focus to its first invalid field, for instance. Left unset,
   * the field generates its own, which is right for everything else.
   */
  id?: string;
  /** Receives the wiring so the control is always labelled and described. */
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean | undefined;
  }) => React.ReactNode;
  className?: string;
}

export const Field: React.FC<FieldProps> = ({
  label,
  hint,
  error,
  meta,
  children,
  className,
  id: fixedId,
}) => {
  const generatedId = useId();
  const id = fixedId ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      {meta ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <label htmlFor={id} className="text-body-s font-medium text-ink">
            {label}
          </label>
          <span className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
            {meta}
          </span>
        </div>
      ) : (
        <label htmlFor={id} className="block text-body-s font-medium text-ink">
          {label}
        </label>
      )}
      {hint && (
        <p id={hintId} className="text-body-s text-ink-faint">
          {hint}
        </p>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error && (
        <p id={errorId} className="text-body-s text-alert">
          {error}
        </p>
      )}
    </div>
  );
};

/** Shared control styling so inputs, selects and textareas match exactly. */
export const controlClass = cn(
  'w-full rounded-control border border-rule-strong bg-surface px-3 py-2.5',
  'text-body text-ink placeholder:text-ink-faint',
  'min-h-[2.75rem] transition-colors hover:border-navy/60'
);
