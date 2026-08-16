import React from 'react';
import { cn } from '../../lib/cn';
import { StatusTone } from '../../lib/status';
import { toneBorder } from './tone';

interface RecordProps {
  /** Small mono strip naming what this block is. */
  label?: React.ReactNode;
  title?: React.ReactNode;
  /** Sits opposite the label — usually a StatusChip. */
  action?: React.ReactNode;
  tone?: StatusTone;
  /** Heading level for the label. Records sit directly under the page h1. */
  headingLevel?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
}

/**
 * The structural unit of the interface: a hairline-bordered block with a
 * labelled header strip. Replaces the floating rounded card — depth is
 * reserved for things that genuinely float.
 */
export const Record: React.FC<RecordProps> = ({
  label,
  title,
  action,
  tone = 'neutral',
  headingLevel = 2,
  children,
  className,
  bodyClassName,
  id,
}) => (
  <section
    id={id}
    className={cn(
      // min-w-0: Records are often grid/flex children, where the default
      // min-width:auto would stop them shrinking below their content.
      'bg-surface border rounded-record min-w-0',
      tone === 'neutral' ? 'border-rule' : cn(toneBorder[tone], 'border-l-2'),
      className
    )}
  >
    {(label || title || action) && (
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-rule px-4 py-3 sm:px-6">
        <div className="min-w-0">
          {/* The label names the section, so it carries the heading level and
              the title steps down beneath it. Keeps the document outline
              unbroken without changing how either one looks. */}
          {label &&
            React.createElement(
              `h${headingLevel}`,
              { className: 'font-mono text-label uppercase tracking-[0.08em] text-ink-faint' },
              label
            )}
          {title &&
            React.createElement(
              `h${label ? Math.min(headingLevel + 1, 6) : headingLevel}`,
              { className: 'font-serif text-title text-ink mt-1 [&:first-child]:mt-0' },
              title
            )}
        </div>
        {action && <div className="min-w-0 max-w-full">{action}</div>}
      </header>
    )}
    <div className={cn('px-4 py-4 sm:px-6 sm:py-5', bodyClassName)}>{children}</div>
  </section>
);
