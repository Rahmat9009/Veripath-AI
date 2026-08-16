import React from 'react';
import { PageTab, Language } from '../types';
import { VeripathLogo } from './VeripathLogo';
import { NAV_ITEMS } from '../lib/nav';
import { useT } from '../i18n/strings';

interface FooterProps {
  setActiveTab: (tab: PageTab) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, lang }) => {
  const t = useT(lang);
  const label = (item: (typeof NAV_ITEMS)[number]) => (lang === 'bn' ? item.bn : item.en);

  const tools = NAV_ITEMS.filter((item) => ['matcher', 'auditor'].includes(item.tab));
  const resources = NAV_ITEMS.filter((item) => ['updates', 'resources', 'about'].includes(item.tab));

  return (
    // The separation is padding *inside* the navy rather than margin above it.
    // As a margin it showed the body's paper, which was right when the page
    // ended in a card on a light ground and became a 64px cream stripe between
    // two navy blocks once the closing section became a full-width band. The
    // hairline is white-on-navy for the same reason: against the closing band
    // a `--color-rule` line read as a bright seam, and against the light
    // grounds of the other five pages the paper-to-navy edge is enough on its
    // own. Shared chrome — this changes the footer on all six pages.
    <footer className="border-t border-white/15 bg-navy-ink text-white">
      <div className="shell pb-12 pt-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-6">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              aria-label={t.shell.homeLink}
              className="inline-flex min-h-[2.75rem] items-center rounded-record bg-white px-4 py-3"
            >
              {/* The supplied artwork carries an opaque white plate behind the
                  wordmark, so on the navy ground the lockup sits on its own
                  light panel rather than showing a white box. */}
              <VeripathLogo variant="vertical" size="lg" />
            </button>
            <p className="max-w-[46ch] text-body-s text-white/75">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.footer.tools} className="md:col-span-3">
            <h2 className="font-mono text-label uppercase tracking-[0.12em] text-white/60">
              {t.footer.tools}
            </h2>
            <ul className="mt-3 space-y-1">
              {tools.map((item) => (
                <li key={item.tab}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.tab)}
                    className="inline-flex min-h-[2.75rem] items-center text-body-s text-white/85 underline-offset-4 hover:text-white hover:underline"
                  >
                    {label(item)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.resources} className="md:col-span-3">
            <h2 className="font-mono text-label uppercase tracking-[0.12em] text-white/60">
              {t.footer.resources}
            </h2>
            <ul className="mt-3 space-y-1">
              {resources.map((item) => (
                <li key={item.tab}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.tab)}
                    className="inline-flex min-h-[2.75rem] items-center text-body-s text-white/85 underline-offset-4 hover:text-white hover:underline"
                  >
                    {label(item)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6">
          <p className="max-w-[72ch] text-body text-white/85">{t.disclaimer.long}</p>
          <p className="mt-4 font-mono text-label uppercase tracking-[0.08em] text-white/60">
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};
