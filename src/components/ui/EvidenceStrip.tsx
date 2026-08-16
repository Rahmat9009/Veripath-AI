import React from 'react';
import { Language } from '../../types';
import { AssessmentStatus, assessedAt, statusLabel } from '../../lib/status';
import { useT } from '../../i18n/strings';
import { cn } from '../../lib/cn';

interface EvidenceStripProps {
  lang: Language;
  /** What was compared, in plain language. */
  checked: string;
  /** Where the comparison came from, or the "no source" phrasing. */
  source?: string;
  status: AssessmentStatus;
  /** Defaults to now, rendered as "13 Aug 2026 · 14:02". */
  asOf?: string;
  className?: string;
}

/**
 * VeriPath's signature device. Every AI-produced conclusion in the product
 * ends in this same four-line footer, so the reader always sees what was
 * compared, against what, how far it got, and when — before they act on it.
 */
export const EvidenceStrip: React.FC<EvidenceStripProps> = ({
  lang,
  checked,
  source,
  status,
  asOf,
  className,
}) => {
  const t = useT(lang);
  const rows: Array<[string, string]> = [
    [t.evidence.checked, checked],
    [t.evidence.source, source || t.evidence.noSource],
    [t.evidence.status, statusLabel(status, lang)],
    [t.evidence.asOf, asOf || assessedAt()],
  ];

  return (
    <div className={cn('border-t border-rule pt-3 mt-4', className)}>
      <h3 className="sr-only">{t.evidence.heading}</h3>
      <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[minmax(0,max-content)_minmax(0,1fr)]">
        {rows.map(([term, value]) => (
          <React.Fragment key={term}>
            <dt className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint sm:pt-px">
              {term}
            </dt>
            <dd className="mb-1 min-w-0 break-words text-body-s text-ink-muted sm:mb-0">{value}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
};
