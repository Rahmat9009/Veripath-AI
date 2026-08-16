import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

interface DisclosureProps {
  label: React.ReactNode;
  /** Short line describing what is inside, shown while collapsed. */
  summary?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Keyboard-accessible collapsible section. Used to give long result pages a
 * navigable shape instead of one unbroken scroll.
 */
export const Disclosure: React.FC<DisclosureProps> = ({
  label,
  summary,
  defaultOpen = false,
  children,
  className,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className={cn('bg-surface border border-rule rounded-record', className)}>
      {/* h2: these panels are top-level sections directly under the page h1. */}
      <h2>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-6"
        >
          <span className="min-w-0">
            <span className="block font-serif text-title text-ink">{label}</span>
            {summary && <span className="mt-1 block text-body-s text-ink-muted">{summary}</span>}
          </span>
          <ChevronDown
            className={cn(
              'h-5 w-5 shrink-0 text-navy transition-transform',
              open && 'rotate-180'
            )}
            aria-hidden="true"
          />
        </button>
      </h2>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="border-t border-rule px-4 py-5 sm:px-6"
      >
        {children}
      </div>
    </div>
  );
};
