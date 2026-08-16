import React from 'react';
import { Language } from '../../types';
import { cn } from '../../lib/cn';

interface SkeletonRecordProps {
  lang: Language;
  /** Announced to screen readers while the request is in flight. */
  message: string;
  detail?: string;
  lines?: number;
  className?: string;
}

/**
 * A loading placeholder shaped like the record it will become, so the layout
 * does not jump when results arrive.
 */
export const SkeletonRecord: React.FC<SkeletonRecordProps> = ({
  message,
  detail,
  lines = 4,
  className,
}) => (
  <div
    role="status"
    aria-live="polite"
    className={cn('rounded-record border border-rule bg-surface', className)}
  >
    <div className="border-b border-rule px-4 py-3 sm:px-6">
      <p className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">{message}</p>
      {detail && <p className="mt-1 text-body-s text-ink-muted">{detail}</p>}
    </div>
    <div className="animate-loading space-y-3 px-4 py-5 sm:px-6" aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-3 rounded-control bg-rule"
          style={{ width: `${100 - index * 12}%` }}
        />
      ))}
    </div>
  </div>
);
