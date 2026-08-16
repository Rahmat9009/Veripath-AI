import React, { useEffect, useId, useRef, useState } from 'react';
import { PageTab, Language } from '../types';
import { Check, Menu, Settings, ShieldCheck, X } from 'lucide-react';
import { VeripathLogo } from './VeripathLogo';
import { NAV_ITEMS } from '../lib/nav';
import { useT } from '../i18n/strings';
import { cn } from '../lib/cn';
import { Button } from './ui';

interface A11yControls {
  largeText: boolean;
  highContrast: boolean;
  setLargeText: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
}

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  a11y: A11yControls;
}

/** A labelled on/off control that reports its state to assistive technology. */
const Switch: React.FC<{
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  onLabel: string;
  offLabel: string;
}> = ({ label, hint, checked, onChange, onLabel, offLabel }) => (
  <div className="flex items-start justify-between gap-4 border-t border-rule py-3">
    <span className="min-w-0">
      <span className="block text-body font-medium text-ink">{label}</span>
      <span className="block text-body-s text-ink-muted">{hint}</span>
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex h-11 shrink-0 items-center gap-2 rounded-control border px-3 text-body-s font-medium transition-colors',
        checked ? 'border-navy bg-navy text-white' : 'border-rule-strong bg-surface text-ink-muted'
      )}
    >
      <span
        className={cn(
          'block h-2.5 w-2.5 rounded-full',
          checked ? 'bg-brand-green' : 'bg-rule-strong'
        )}
        aria-hidden="true"
      />
      {checked ? onLabel : offLabel}
    </button>
  </div>
);

/**
 * A masthead rather than an app bar.
 *
 * It stays on a light ground on every page: the supplied logo artwork carries
 * an opaque plate behind the mark, so a transparent header over the navy hero
 * would show a white box around it. The hairline base rule meets the hero's
 * navy band directly, which is where the page's first architectural edge is.
 */
export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, lang, setLang, a11y }) => {
  const t = useT(lang);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape or an outside click, and hand focus back to the trigger.
  useEffect(() => {
    if (!settingsOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSettingsOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setSettingsOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [settingsOpen]);

  // The mobile menu gets the same treatment, kept separate so closing one
  // never closes the other.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuTriggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || menuTriggerRef.current?.contains(target)) return;
      setMenuOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [menuOpen]);

  const go = (tab: PageTab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-surface">
      <div className="shell">
        <div className="flex min-h-[4.25rem] items-center justify-between gap-4 sm:min-h-[4.75rem]">
          <button
            type="button"
            onClick={() => go('home')}
            aria-label={t.shell.homeLink}
            className="flex min-w-0 shrink items-center py-2"
          >
            <span className="hidden sm:block">
              <VeripathLogo variant="mark" size="md" />
            </span>
            <span className="sm:hidden">
              <VeripathLogo variant="mark" size="sm" />
            </span>
          </button>

          {/* The primary navigation sits on the header's own base rule, so the
              active item reads as a tab cut into the masthead edge. */}
          <nav aria-label={t.shell.primaryNav} className="hidden min-w-0 lg:block">
            <ul className="-mb-px flex min-w-0 items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = activeTab === item.tab;
                return (
                  <li key={item.tab}>
                    <button
                      type="button"
                      onClick={() => go(item.tab)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'inline-flex min-h-[2.75rem] items-center whitespace-nowrap border-b-2 px-3 text-body-s transition-colors',
                        active
                          ? 'border-navy font-medium text-navy'
                          : 'border-transparent text-ink-muted hover:border-rule-strong hover:text-ink'
                      )}
                    >
                      {lang === 'bn' ? item.bn : item.en}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="inline-flex min-h-[2.75rem] shrink-0 items-center rounded-control border border-rule px-2 text-body-s font-medium text-ink-muted transition-colors hover:border-navy hover:text-navy sm:px-3"
              lang={lang === 'en' ? 'bn' : 'en'}
            >
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setSettingsOpen((open) => !open)}
              aria-expanded={settingsOpen}
              aria-controls={panelId}
              aria-label={t.shell.openSettings}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-control border transition-colors',
                settingsOpen
                  ? 'border-navy bg-navy-tint text-navy'
                  : 'border-rule text-ink-muted hover:border-navy hover:text-navy'
              )}
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Wrapper, not a `hidden` class on the Button: the Button's own
                `inline-flex` would win the display conflict. */}
            <span className="hidden md:block">
              <Button size="sm" onClick={() => go('auditor')}>
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.shell.verifyCta}</span>
              </Button>
            </span>

            <button
              ref={menuTriggerRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? t.shell.closeMenu : t.shell.openMenu}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-control border transition-colors lg:hidden',
                menuOpen
                  ? 'border-navy bg-navy-tint text-navy'
                  : 'border-rule text-ink-muted hover:border-navy hover:text-navy'
              )}
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            {settingsOpen && (
              <div
                ref={panelRef}
                id={panelId}
                className="absolute right-0 top-[3.25rem] z-50 w-[min(20rem,calc(100vw-2rem))] rounded-record border border-rule bg-surface p-4 shadow-float"
              >
                <div className="flex items-center justify-between gap-3 pb-1">
                  <h2 className="font-serif text-title text-ink">{t.shell.settings}</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      triggerRef.current?.focus();
                    }}
                    aria-label={t.common.close}
                    className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-navy-tint hover:text-navy"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <p className="text-body font-medium text-ink">{t.shell.language}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(
                      [
                        ['en', 'English'],
                        ['bn', 'বাংলা'],
                      ] as const
                    ).map(([code, label]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setLang(code)}
                        aria-pressed={lang === code}
                        lang={code}
                        className={cn(
                          'inline-flex min-h-[2.75rem] items-center justify-between gap-2 rounded-control border px-3 text-body-s font-medium transition-colors',
                          lang === code
                            ? 'border-navy bg-navy text-white'
                            : 'border-rule text-ink-muted hover:border-navy hover:text-navy'
                        )}
                      >
                        <span>{label}</span>
                        {lang === code && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <Switch
                    label={t.shell.textSize}
                    hint={t.shell.textSizeHint}
                    checked={a11y.largeText}
                    onChange={a11y.setLargeText}
                    onLabel={t.shell.on}
                    offLabel={t.shell.off}
                  />
                  <Switch
                    label={t.shell.contrast}
                    hint={t.shell.contrastHint}
                    checked={a11y.highContrast}
                    onChange={a11y.setHighContrast}
                    onLabel={t.shell.on}
                    offLabel={t.shell.off}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Narrow screens get a real menu rather than a strip that scrolls
          sideways behind a native scrollbar. Rows are full width and 48px
          tall, which is what a thumb needs. */}
      {menuOpen && (
        <div
          ref={menuRef}
          id={menuId}
          className="border-t border-rule bg-surface lg:hidden"
        >
          <nav aria-label={t.shell.primaryNav} className="shell py-2">
            <ul>
              {NAV_ITEMS.map((item) => {
                const active = activeTab === item.tab;
                return (
                  <li key={item.tab} className="border-b border-rule last:border-b-0">
                    <button
                      type="button"
                      onClick={() => go(item.tab)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex min-h-[3rem] w-full items-center gap-3 text-left text-body transition-colors',
                        active ? 'font-medium text-navy' : 'text-ink-muted hover:text-ink'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'block h-4 w-0.5 shrink-0 rounded-full',
                          active ? 'bg-brand-green' : 'bg-transparent'
                        )}
                      />
                      {lang === 'bn' ? item.bn : item.en}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="py-3 md:hidden">
              <Button fullWidth onClick={() => go('auditor')}>
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.shell.verifyCta}</span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
