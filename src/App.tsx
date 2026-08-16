import React, { Suspense, lazy, useEffect, useState } from 'react';
import { PageTab, Language } from './types';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Footer } from './components/Footer';
import { useA11ySettings } from './hooks/useA11ySettings';
import { useT } from './i18n/strings';

/**
 * Home is imported eagerly — it is the landing page, and making the first
 * paint wait on a second round trip would be the wrong trade for a product
 * used on slow connections. The other five pages are split out: together with
 * the reference data two of them pull in, they are roughly a fifth of the
 * source that used to load before anyone had chosen to go anywhere.
 */
const ProfileMatcher = lazy(() =>
  import('./components/ProfileMatcher').then((m) => ({ default: m.ProfileMatcher }))
);
const DocumentAuditor = lazy(() =>
  import('./components/DocumentAuditor').then((m) => ({ default: m.DocumentAuditor }))
);
const NewsFeed = lazy(() => import('./components/NewsFeed').then((m) => ({ default: m.NewsFeed })));
const OfficialPortals = lazy(() =>
  import('./components/OfficialPortals').then((m) => ({ default: m.OfficialPortals }))
);
const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })));

/**
 * Shown only while a page's code is in flight. It holds a floor height so the
 * footer does not jump up the screen and back down, and announces itself, so a
 * screen-reader user is told the page is loading rather than meeting silence.
 */
const PageLoading: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useT(lang);
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p
        role="status"
        className="animate-loading font-mono text-label uppercase tracking-[0.14em] text-ink-faint"
      >
        {t.common.loading}
      </p>
    </div>
  );
};

/**
 * Warms the two pages the landing page's calls to action point at, once the
 * browser is otherwise idle, so choosing to act does not then cost a download.
 *
 * Skipped when the connection reports save-data or 2g. On those connections
 * the stall this avoids is cheaper than the bytes it spends, and this product
 * is used on exactly those connections.
 */
function usePrefetchPrimaryTools() {
  useEffect(() => {
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return;

    const schedule =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000));
    const handle = schedule(() => {
      void import('./components/DocumentAuditor');
      void import('./components/ProfileMatcher');
    });

    return () => {
      if (window.cancelIdleCallback && typeof handle === 'number') {
        window.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle as number);
      }
    };
  }, []);
}

/**
 * The pages that carry their own full-width tonal bands and therefore apply
 * `shell` themselves, band by band, rather than sitting inside the shared
 * container. Stated once so the class on `main` and the pages cannot drift.
 */
const BANDED_PAGES = new Set<PageTab>(['home', 'about']);

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('home');

  // Applies display preferences to <html> and keeps the document language in
  // step with the toggle, so assistive technology reads the right language.
  // Language lives here with text size and contrast because it is the same
  // kind of decision and has to survive a reload for the same reason.
  const a11y = useA11ySettings();
  const lang = a11y.lang;
  const t = useT(lang);

  usePrefetchPrimaryTools();

  const goTo = (tab: PageTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper font-sans text-ink antialiased selection:bg-navy selection:text-white">
      <a
        href="#main"
        className="skip-link rounded-control bg-navy px-4 py-2 text-body font-medium text-white"
      >
        {t.shell.skipToContent}
      </a>

      <Navbar
        activeTab={activeTab}
        setActiveTab={goTo}
        lang={lang}
        setLang={a11y.setLang}
        a11y={a11y}
      />

      {/* The landing and about pages are composed of full-width tonal bands, so
          they opt out of the shared container and apply `shell` band by band.
          Every other page keeps the container it has always had. */}
      <main
        id="main"
        tabIndex={-1}
        aria-label={t.shell.mainLabel}
        className={BANDED_PAGES.has(activeTab) ? 'flex-1' : 'shell flex-1 py-10'}
      >
        {activeTab === 'home' ? (
          <Home setActiveTab={goTo} lang={lang} largeText={a11y.largeText} />
        ) : (
          <Suspense fallback={<PageLoading lang={lang} />}>
            {activeTab === 'matcher' && <ProfileMatcher lang={lang} />}
            {activeTab === 'auditor' && <DocumentAuditor lang={lang} />}
            {activeTab === 'updates' && <NewsFeed lang={lang} />}
            {activeTab === 'resources' && <OfficialPortals lang={lang} setActiveTab={goTo} />}
            {activeTab === 'about' && <About lang={lang} setActiveTab={goTo} />}
          </Suspense>
        )}
      </main>

      <Footer setActiveTab={goTo} lang={lang} />
    </div>
  );
}
