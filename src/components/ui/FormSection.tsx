import React from 'react';
import { cn } from '../../lib/cn';

interface FormSectionProps {
  /** The section's place in the sequence, already formatted: "01", "02". */
  step: string;
  legend: string;
  /** One line of guidance, only where the legend is not enough on its own. */
  note?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * One numbered group of inputs inside a form panel.
 *
 * A real `<fieldset>` with a real `<legend>`, so the grouping is in the
 * document rather than only in the spacing: a screen reader announces the
 * legend with each control inside it, which is how "is this question about my
 * money or my schooling?" gets answered without sight of the layout.
 *
 * Structure adapted from Untitled UI's form section — the numeral, the legend
 * and the guidance line stacked against a full-width rule. Its card surface,
 * two-column label gutter and grey-on-grey palette are not used: sections here
 * sit inside one bordered panel and are separated by the same hairline that
 * separates everything else in the product, so a form reads as one document
 * rather than a stack of tiles.
 *
 * The rule lives on the top edge and is dropped on the first section, so a
 * panel never opens with a line immediately under its own border.
 */
export const FormSection: React.FC<FormSectionProps> = ({
  step,
  legend,
  note,
  children,
  className,
}) => (
  <fieldset
    className={cn(
      'min-w-0 border-t border-rule px-4 py-5 first:border-t-0 sm:px-6 sm:py-6',
      className
    )}
  >
    {/* w-full and p-0: a legend is not a block box by default in every engine,
        and the browser default padding would pull the numeral out of line with
        the fields beneath it. */}
    <legend className="block w-full p-0">
      <span className="flex items-baseline gap-3">
        <span className="tabular font-mono text-label text-navy" aria-hidden="true">
          {step}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-title text-ink">{legend}</span>
          {note && <span className="mt-1 block text-body-s text-ink-muted">{note}</span>}
        </span>
      </span>
    </legend>
    <div className="mt-5 space-y-4">{children}</div>
  </fieldset>
);
