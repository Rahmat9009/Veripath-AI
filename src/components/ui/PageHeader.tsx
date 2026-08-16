import React from 'react';
import { Language } from '../../types';
import { useT } from '../../i18n/strings';
import { cn } from '../../lib/cn';

interface PageHeaderProps {
  lang: Language;
  /** Small mono line above the title naming the tool. */
  kicker: string;
  title: string;
  intro?: string;
  /** Filters, refresh controls and the like. */
  children?: React.ReactNode;
  /** Set on tools that produce AI assessments. */
  showDisclaimer?: boolean;
  className?: string;
}

/** Consistent opening for every inner page. */
export const PageHeader: React.FC<PageHeaderProps> = ({
  lang,
  kicker,
  title,
  intro,
  children,
  showDisclaimer,
  className,
}) => {
  const t = useT(lang);
  return (
    <header className={cn('border-b border-rule pb-6', className)}>
      <p className="font-mono text-label uppercase tracking-[0.12em] text-navy">{kicker}</p>
      <h1 className="mt-2 font-serif text-display-m text-ink sm:text-display-l">{title}</h1>
      {intro && <p className="mt-3 max-w-[64ch] text-body-l text-ink-muted">{intro}</p>}
      {showDisclaimer && (
        <p className="mt-4 border-l-2 border-caution bg-caution-surface px-3 py-2 text-body-s text-ink">
          {t.disclaimer.long}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </header>
  );
};
