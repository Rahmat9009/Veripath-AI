import React from 'react';
import { cn } from '../../lib/cn';

interface FieldRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Fees, dates, reference numbers — anything that should align in a column. */
  mono?: boolean;
  className?: string;
}

/** A label–value pair. Values that are data are set in mono tabular figures. */
export const FieldRow: React.FC<FieldRowProps> = ({ label, value, mono, className }) => (
  <div className={cn('border-b border-rule py-2.5 last:border-b-0', className)}>
    <dt className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">{label}</dt>
    <dd className={cn('mt-1 break-words text-ink', mono ? 'font-mono text-data tabular' : 'text-body')}>{value}</dd>
  </div>
);

interface FieldGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export const FieldGrid: React.FC<FieldGridProps> = ({ children, columns = 2, className }) => (
  <dl
    className={cn(
      'grid gap-x-8',
      columns === 1 && 'grid-cols-1',
      columns === 2 && 'sm:grid-cols-2',
      columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
      className
    )}
  >
    {children}
  </dl>
);
