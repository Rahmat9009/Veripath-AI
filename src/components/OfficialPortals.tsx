import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Language, PageTab, ResourceItem } from '../types';
import { OFFICIAL_RESOURCES } from '../data/mockData';
import { ArrowRight, Check, Copy, ExternalLink, Globe, Phone, Search, X } from 'lucide-react';
import { useT } from '../i18n/strings';
import { cn } from '../lib/cn';
import { Button, EmptyState, Field, LinkButton, PageHeader, Tabs, controlClass } from './ui';

/**
 * The Resources directory.
 *
 * A registry, not a card grid. The reader arrives with one question — "who can
 * confirm this, for this country" — so the page is ordered to answer it: search,
 * then destination, then purpose, then rows grouped by purpose. Structure is
 * carried by hairlines and left rules in the same idiom as the About page,
 * because thirty-seven bordered boxes are slower to scan than thirty-seven
 * ruled lines and read as a marketplace rather than a registry.
 *
 * Nothing here adds to the reference data. Every URL, domain, description and
 * telephone number is rendered exactly as `mockData` holds it, and no row
 * carries a freshness date, a verification status or an authority claim,
 * because `ResourceItem` holds no such field and inventing one would be the
 * single most damaging thing this page could do.
 */

interface OfficialPortalsProps {
  lang: Language;
  setActiveTab: (tab: PageTab) => void;
}

/** The numbers are the same in both languages; only their descriptions are not. */
const HELPLINE_NUMBERS = ['16135', '+880 9610102030', '16008', '19911'] as const;

/**
 * Which destination each line belongs to. Derived rather than new information:
 * two of the four name their country in their own label, and BMET and Probashi
 * Kalyan are already filed under `Home Country` in `OFFICIAL_RESOURCES` with
 * `bmet.gov.bd` and `probashi.gov.bd`. Used only to sort a relevant line to the
 * front — never to hide one, because three destinations have a helpline here
 * and the other ten do not, and an empty urgent-contacts panel would be worse
 * than four visible ones.
 */
const HELPLINE_DESTINATIONS = ['Home Country', 'Home Country', 'Qatar', 'Saudi Arabia'] as const;

/**
 * Read out of the reference list rather than written down beside it, so the
 * index can never advertise a destination with nothing behind it. Order is the
 * order the list holds, which puts Bangladesh clearance last.
 */
const DESTINATIONS = Array.from(new Set(OFFICIAL_RESOURCES.map((item) => item.country)));

/**
 * The reading order of the directory. Status and contracts come before study
 * and trade because that is the order of the questions people arrive with, and
 * it is fixed rather than derived so the page does not reshuffle itself as the
 * reference list grows.
 */
const PURPOSES: ResourceItem['category'][] = [
  'Visa & Status',
  'Labour & Contracts',
  'Government & Ministries',
  'Home Country & Clearance',
  'Study & Education',
  'Business & Trade',
];

/**
 * Counted strings are templates rather than concatenations, because Bengali
 * puts the number and its noun in the opposite order from English and a
 * `{count} {noun}` in JSX would silently force English word order.
 */
const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));

/**
 * English needs a singular; Bengali does not inflect the noun here and both
 * keys hold the same string. Two keys rather than a plural-rule engine — this
 * is the only counted noun on the page.
 */
const countLabel = (t: ReturnType<typeof useT>, n: number) =>
  fill(n === 1 ? t.portals.groupCountOne : t.portals.groupCount, { n });

const LABEL = 'font-mono text-label uppercase tracking-[0.08em]';

export const OfficialPortals: React.FC<OfficialPortalsProps> = ({ lang, setActiveTab }) => {
  const t = useT(lang);

  const [destination, setDestination] = useState('All');
  const [purpose, setPurpose] = useState('All');
  const [query, setQuery] = useState('');

  /* Copy state is per-target, so only the row that was acted on changes. */
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [failedId, setFailedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const timer = useRef<number | undefined>(undefined);

  const searchRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const purposeRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const purposeLabel = (category: ResourceItem['category']) =>
    ({
      'Visa & Status': t.portals.catVisa,
      'Labour & Contracts': t.portals.catLabour,
      'Government & Ministries': t.portals.catGov,
      'Business & Trade': t.portals.catBusiness,
      'Study & Education': t.portals.catStudy,
      'Home Country & Clearance': t.portals.catHome,
    })[category];

  const destinationLabel = (country: string) =>
    country === 'Home Country' ? t.portals.homeCountry : country;

  /* ------------------------------------------------------------------ */
  /* Filtering                                                           */
  /*                                                                     */
  /* Three predicates applied in layers, and the layers are kept as       */
  /* separate values because the empty state has to be able to ask what   */
  /* would have matched with one of them lifted.                          */
  /* ------------------------------------------------------------------ */

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OFFICIAL_RESOURCES;
    return OFFICIAL_RESOURCES.filter((item) =>
      [
        item.title,
        item.country,
        // The words actually on screen, so searching "Bangladesh" finds the
        // clearance portals and a Bengali reader can search in Bengali.
        destinationLabel(item.country),
        item.description,
        item.domain,
        purposeLabel(item.category),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [query, t]);

  const byDestination = useMemo(
    () =>
      destination === 'All' ? searched : searched.filter((item) => item.country === destination),
    [searched, destination]
  );

  const filtered = useMemo(
    () => (purpose === 'All' ? byDestination : byDestination.filter((item) => item.category === purpose)),
    [byDestination, purpose]
  );

  /** What would match if the destination were lifted — the empty state's evidence. */
  const withoutDestination = useMemo(
    () => (purpose === 'All' ? searched : searched.filter((item) => item.category === purpose)),
    [searched, purpose]
  );

  /* Destination counts ignore the purpose filter and purpose counts respect the
     destination. That asymmetry is deliberate: the destination numbers must not
     move while the reader flips through purposes, or the index stops being a
     stable map of what the list covers. */
  const destinationCounts = useMemo(() => {
    const counts = new Map<string, number>();
    searched.forEach((item) => counts.set(item.country, (counts.get(item.country) ?? 0) + 1));
    return counts;
  }, [searched]);

  const purposeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    byDestination.forEach((item) => counts.set(item.category, (counts.get(item.category) ?? 0) + 1));
    return counts;
  }, [byDestination]);

  const groups = useMemo(
    () =>
      PURPOSES.map((category) => ({
        category,
        items: filtered
          .filter((item) => item.category === category)
          .sort((a, b) => a.country.localeCompare(b.country) || a.title.localeCompare(b.title)),
      })).filter((group) => group.items.length > 0),
    [filtered]
  );

  /* ------------------------------------------------------------------ */
  /* Copying                                                             */
  /* ------------------------------------------------------------------ */

  const flash = (id: string, ok: boolean, message: string) => {
    window.clearTimeout(timer.current);
    setCopiedId(ok ? id : null);
    setFailedId(ok ? null : id);
    setAnnouncement(message);
    /* Failure stays up far longer than success: it asks the reader to do
       something, and two seconds is not enough time to read an instruction. */
    timer.current = window.setTimeout(
      () => {
        setCopiedId(null);
        setFailedId(null);
        setAnnouncement('');
      },
      ok ? 2500 : 10000
    );
  };

  const copy = async (text: string, id: string, confirmation: string) => {
    try {
      // Absent on insecure origins, which is exactly where this used to fail
      // silently and leave the reader believing they had the address.
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(text);
      flash(id, true, confirmation);
    } catch {
      flash(id, false, t.portals.copyFailed);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Clearing                                                            */
  /*                                                                     */
  /* Focus follows the filter that was lifted, so the reader is left       */
  /* standing at the control that changed rather than at the top of the    */
  /* document.                                                             */
  /* ------------------------------------------------------------------ */

  const focusFirstIn = (ref: React.RefObject<HTMLDivElement | null>) =>
    ref.current?.querySelector('button')?.focus();

  const clearSearch = () => {
    setQuery('');
    searchRef.current?.focus();
  };
  const clearDestination = () => {
    setDestination('All');
    focusFirstIn(destinationRef);
  };
  const clearPurpose = () => {
    setPurpose('All');
    focusFirstIn(purposeRef);
  };
  const clearAll = () => {
    setQuery('');
    setDestination('All');
    setPurpose('All');
    searchRef.current?.focus();
  };

  const hasFilters = Boolean(query.trim()) || destination !== 'All' || purpose !== 'All';

  /* ------------------------------------------------------------------ */
  /* Filter options                                                      */
  /*                                                                     */
  /* The count is drawn twice: once visibly as tabular digits, once as     */
  /* screen-reader text, so the button is named "Qatar, 3 portals" rather  */
  /* than "Qatar 3".                                                       */
  /* ------------------------------------------------------------------ */

  const cell = (label: string, count: number) => (
    <>
      <span className="min-w-0">{label}</span>
      {/* `relative` is load-bearing, not decoration. `sr-only` is
          `position:absolute`, and with no positioned ancestor its containing
          block would be far up the tree — so inside a horizontally scrolled
          nowrap row these spans escaped the scroller's clip entirely and were
          laid out at their static position, roughly 1140px out. The page then
          carried ~835px of empty horizontal scroll at 320px. Giving each one a
          positioned parent puts its containing block back inside the pill. */}
      <span className="relative">
        <span className="sr-only">{`, ${countLabel(t, count)}`}</span>
      </span>
      <span aria-hidden="true" className={cn(LABEL, 'tabular ml-2 shrink-0 opacity-80')}>
        {count}
      </span>
    </>
  );

  const destinationItems = [
    { id: 'All', label: cell(t.portals.allCountries, searched.length) },
    ...DESTINATIONS.map((country) => ({
      id: country,
      label: cell(destinationLabel(country), destinationCounts.get(country) ?? 0),
    })),
  ];

  const purposeItems = [
    { id: 'All', label: cell(t.portals.allCategories, byDestination.length) },
    ...PURPOSES.map((category) => ({
      id: category,
      label: cell(purposeLabel(category), purposeCounts.get(category) ?? 0),
    })),
  ];

  const helplines = useMemo(() => {
    const rows = [
      { id: 'tel-bmet', authority: t.portals.helpline1Authority, note: t.portals.helpline1Note },
      { id: 'tel-probashi', authority: t.portals.helpline2Authority, note: t.portals.helpline2Note },
      { id: 'tel-qatar-mol', authority: t.portals.helpline3Authority, note: t.portals.helpline3Note },
      { id: 'tel-saudi-mhrsd', authority: t.portals.helpline4Authority, note: t.portals.helpline4Note },
    ].map((row, index) => ({
      ...row,
      number: HELPLINE_NUMBERS[index],
      destination: HELPLINE_DESTINATIONS[index],
      matches: destination !== 'All' && HELPLINE_DESTINATIONS[index] === destination,
    }));
    // Stable sort: a matching line moves to the front, the published order of
    // the rest is untouched.
    return rows.sort((a, b) => Number(b.matches) - Number(a.matches));
  }, [t, destination]);

  const guidance = [
    { title: t.portals.guide1Title, body: t.portals.guide1Body },
    { title: t.portals.guide2Title, body: t.portals.guide2Body },
    { title: t.portals.guide3Title, body: t.portals.guide3Body },
  ];

  const emptyHints = [
    destination !== 'All' && withoutDestination.length > 0
      ? fill(t.portals.emptyElsewhere, { n: withoutDestination.length })
      : null,
    purpose !== 'All' && byDestination.length > 0
      ? fill(t.portals.emptyOtherPurpose, { n: byDestination.length })
      : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-10 pb-4">
      {/* 1 · Utility header ------------------------------------------------ */}
      <PageHeader lang={lang} kicker={t.portals.kicker} title={t.portals.title} intro={t.portals.intro}>
        <p className={cn(LABEL, 'text-ink-faint')}>
          <span className="tabular">{fill(t.portals.statPortals, { n: OFFICIAL_RESOURCES.length })}</span>
          <span aria-hidden="true" className="px-2">
            ·
          </span>
          <span className="tabular">{fill(t.portals.statDestinations, { n: DESTINATIONS.length })}</span>
        </p>

        <div className="mt-4">
          <Field label={t.portals.searchLabel}>
            {(props) => (
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                  aria-hidden="true"
                />
                <input
                  {...props}
                  ref={searchRef}
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  className={cn(controlClass, 'pl-9')}
                  placeholder={t.portals.searchPlaceholder}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            )}
          </Field>
        </div>
      </PageHeader>

      {/* The one place copy results are announced. Present from first paint so
          the region exists before its content ever changes. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* 2 · Destination index --------------------------------------------- */}
      <section aria-labelledby="portals-destination">
        <h2 id="portals-destination" className={cn(LABEL, 'text-ink-faint')}>
          {t.portals.countryLabel}
        </h2>
        {/* Every destination stays on screen, including on a 320px phone. A
            native select would hide thirteen of the fourteen behind a modal,
            and the fact that the list covers thirteen destinations is the most
            useful thing the page can say before it is asked anything. */}
        <div ref={destinationRef} className="mt-3">
          <Tabs
            variant="pill"
            layout="grid"
            label={t.portals.countryLabel}
            value={destination}
            onChange={setDestination}
            items={destinationItems}
            className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          />
        </div>
      </section>

      {/* 3 · Purpose filter and result summary ------------------------------ */}
      <section aria-labelledby="portals-purpose">
        <h2 id="portals-purpose" className={cn(LABEL, 'text-ink-faint')}>
          {t.portals.categoryLabel}
        </h2>
        {/* Bled to the viewport edge on phones so the row reads as continuing
            past the screen rather than as a truncated list. */}
        <div ref={purposeRef} className="-mx-4 mt-3 sm:mx-0">
          <Tabs
            variant="pill"
            label={t.portals.categoryLabel}
            value={purpose}
            onChange={setPurpose}
            items={purposeItems}
            /* The gutter belongs to the scroller, not to its wrapper: as
               padding on the wrapper it simply inset the row again and the
               bleed was a no-op. Here the first pill starts at the text
               margin and the row runs to the screen edge, which is what tells
               the reader it continues. Wraps instead of scrolling from `sm`. */
            className="px-4 sm:flex-wrap sm:px-0"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-rule py-3">
          <p role="status" aria-live="polite" aria-atomic="true" className={cn(LABEL, 'tabular text-ink')}>
            {fill(t.portals.resultSummary, { shown: filtered.length, total: OFFICIAL_RESOURCES.length })}
          </p>

          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {query.trim() && (
                <ActiveFilter
                  label={t.portals.searchLabel}
                  value={query.trim()}
                  clearLabel={t.portals.clearSearch}
                  onClear={clearSearch}
                />
              )}
              {destination !== 'All' && (
                <ActiveFilter
                  label={t.portals.countryLabel}
                  value={destinationLabel(destination)}
                  clearLabel={t.portals.clearDestination}
                  onClear={clearDestination}
                />
              )}
              {purpose !== 'All' && (
                <ActiveFilter
                  label={t.portals.categoryLabel}
                  value={purposeLabel(purpose as ResourceItem['category'])}
                  clearLabel={t.portals.clearPurpose}
                  onClear={clearPurpose}
                />
              )}
              <Button variant="quiet" size="sm" onClick={clearAll}>
                {t.portals.clearAll}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 4 · Directory ------------------------------------------------------ */}
      <section aria-labelledby="portals-directory">
        <h2 id="portals-directory" className="sr-only">
          {t.portals.directoryLabel}
        </h2>

        {groups.length === 0 ? (
          <EmptyState
            lang={lang}
            icon={Globe}
            title={t.portals.emptyTitle}
            /* Names the filter that is responsible rather than shrugging. */
            body={emptyHints.length ? emptyHints.join(' · ') : t.portals.emptyBody}
            actions={
              <>
                {query.trim() && (
                  <Button variant="secondary" onClick={clearSearch}>
                    {t.portals.clearSearch}
                  </Button>
                )}
                {destination !== 'All' && withoutDestination.length > 0 && (
                  <Button variant="secondary" onClick={clearDestination}>
                    {t.portals.clearDestination}
                  </Button>
                )}
                {purpose !== 'All' && byDestination.length > 0 && (
                  <Button variant="secondary" onClick={clearPurpose}>
                    {t.portals.clearPurpose}
                  </Button>
                )}
                <Button variant="quiet" onClick={clearAll}>
                  {t.portals.clearAll}
                </Button>
              </>
            }
          />
        ) : (
          <div className="space-y-10">
            {groups.map((group) => {
              const headingId = `portals-group-${group.category.replace(/\W+/g, '-').toLowerCase()}`;
              return (
                <section key={group.category} aria-labelledby={headingId}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-2 border-navy pb-2">
                    <h3 id={headingId} className="font-serif text-title text-ink">
                      {purposeLabel(group.category)}
                    </h3>
                    <p className={cn(LABEL, 'tabular text-ink-faint')}>
                      {countLabel(t, group.items.length)}
                    </p>
                  </div>

                  {/* Bled on phones so the hairlines run edge to edge and the
                      list reads as a register rather than a stack of boxes. */}
                  <ul className="-mx-4 sm:mx-0">
                    {group.items.map((item) => (
                      <li
                        key={item.id}
                        /* Each rule is coloured on its own side. `border-rule`
                           plus `border-l-navy` would be two utilities of equal
                           specificity setting the same property, settled by
                           stylesheet order rather than by intent — `cn` is a
                           plain join with no conflict resolution. */
                        className={cn(
                          'relative border-t border-t-rule border-b-rule border-l-2 border-l-transparent',
                          'px-4 py-5 transition-colors last:border-b sm:px-5',
                          'hover:border-l-navy hover:bg-vellum/60 focus-within:border-l-navy'
                        )}
                      >
                        <p className={cn(LABEL, 'text-ink-faint')}>{destinationLabel(item.country)}</p>

                        <h4 className="mt-1.5 font-serif text-title text-ink">
                          {/* The anchor's ::after covers the row, so the whole
                              row is one target with one tab stop. The domain
                              and the copy control are raised above it below,
                              which keeps the address selectable — the copy
                              failure message tells the reader to do exactly
                              that. */}
                          <a
                            href={item.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'no-underline decoration-navy/40 underline-offset-4 hover:underline',
                              "after:absolute after:inset-0 after:content-['']"
                            )}
                          >
                            {item.title}
                            <ExternalLink
                              className="ml-1.5 inline h-3.5 w-3.5 shrink-0 align-[-0.1em] text-ink-faint"
                              aria-hidden="true"
                            />
                            <span className="sr-only"> ({t.portals.opensNewTab})</span>
                          </a>
                        </h4>

                        <p className="mt-1.5 max-w-[72ch] text-body-s text-ink-muted">
                          {item.description}
                        </p>

                        <div className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-rule pt-3">
                          {/* The instrument of verification, so it is set in
                              ink at data size rather than tucked away as a
                              footnote. `break-words`, not `break-all`, so a
                              domain breaks at a label boundary. */}
                          <p className="min-w-0 break-words font-mono text-data text-ink">
                            <span className="sr-only">{t.portals.domainLabel}: </span>
                            {item.domain}
                          </p>

                          <div className="flex shrink-0 items-center gap-2">
                            {copiedId === item.id && (
                              <span aria-hidden="true" className={cn(LABEL, 'text-verified')}>
                                {t.portals.copied}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                copy(
                                  item.officialUrl,
                                  item.id,
                                  fill(t.portals.copiedOf, { title: item.title })
                                )
                              }
                              aria-label={fill(t.portals.copyOf, { title: item.title })}
                              className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-control border border-rule px-3 text-body-s text-ink-muted transition-colors hover:border-navy hover:text-navy"
                            >
                              {copiedId === item.id ? (
                                <Check className="h-4 w-4 text-verified" aria-hidden="true" />
                              ) : (
                                <Copy className="h-4 w-4" aria-hidden="true" />
                              )}
                              <span className="hidden sm:inline">{t.portals.copy}</span>
                            </button>
                          </div>
                        </div>

                        {failedId === item.id && (
                          <p className="relative z-10 mt-2 border-l-2 border-alert pl-3 text-body-s text-alert">
                            {t.portals.copyFailed}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </section>

      {/* 5 · Urgent contacts ------------------------------------------------ */}
      <section aria-labelledby="portals-helplines" className="border-t-2 border-alert pt-6">
        <h2 id="portals-helplines" className="font-serif text-title text-ink">
          {t.portals.helplinesTitle}
        </h2>
        <p className="mt-1 max-w-[60ch] text-body-s text-ink-muted">{t.portals.helplinesBody}</p>

        <ul className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {helplines.map((line) => (
            <li key={line.id} className="min-w-0 border-t-2 border-navy pt-3">
              <p className={cn(LABEL, 'text-ink-faint')}>{destinationLabel(line.destination)}</p>
              {line.matches && (
                <p className={cn(LABEL, 'mt-1 text-navy')}>{t.portals.helplineMatches}</p>
              )}

              <h3 className="mt-1 text-body font-medium text-ink">{line.authority}</h3>

              {/* Plain selectable text rather than a link: the two actions
                  below are explicit, and on a desktop browser `tel:` does
                  nothing useful while copying does. */}
              <p className="mt-2 break-words font-mono text-body-l tabular text-ink">{line.number}</p>
              <p className={cn(LABEL, 'text-ink-faint')}>{line.note}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <LinkButton
                  href={`tel:${line.number.replace(/\s/g, '')}`}
                  variant="secondary"
                  size="sm"
                  className="flex-1 whitespace-nowrap"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>{t.portals.helplineCall}</span>
                </LinkButton>
                {/* `whitespace-nowrap` so the pair stacks onto two rows when
                    the labels no longer fit side by side — Bengali needs the
                    room — rather than each growing to two lines of text. */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 whitespace-nowrap"
                  onClick={() =>
                    copy(
                      line.number,
                      line.id,
                      fill(t.portals.helplineCopiedOf, { authority: line.authority })
                    )
                  }
                  aria-label={fill(t.portals.helplineCopyOf, { authority: line.authority })}
                >
                  {copiedId === line.id ? (
                    <Check className="h-4 w-4 text-verified" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{t.portals.helplineCopy}</span>
                </Button>
              </div>

              {failedId === line.id && (
                <p className="mt-2 border-l-2 border-alert pl-3 text-body-s text-alert">
                  {t.portals.copyFailed}
                </p>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-6 border-t border-rule pt-3 text-body-s text-ink-faint">
          {t.portals.helplineNote}
        </p>
      </section>

      {/* 6 · Using official sources ----------------------------------------- */}
      <section aria-labelledby="portals-guidance">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-x-12">
          <div className="min-w-0 lg:col-span-4">
            <p className={cn('font-mono text-label uppercase tracking-[0.12em] text-navy')}>
              {t.portals.guidanceKicker}
            </p>
            <h2 id="portals-guidance" className="mt-3 max-w-[18ch] font-serif text-display-m text-ink">
              {t.portals.guidanceTitle}
            </h2>
          </div>

          <dl className="min-w-0 lg:col-span-8">
            {guidance.map((rule) => (
              <div
                key={rule.title}
                className="grid gap-x-8 gap-y-1.5 border-t border-rule py-5 last:border-b sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
              >
                <dt className="font-serif text-title text-ink">{rule.title}</dt>
                <dd className="min-w-0 max-w-[58ch] text-body text-ink-muted">{rule.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 7 · Close ----------------------------------------------------------- */}
      <section aria-labelledby="portals-close" className="border-t border-rule pt-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0 max-w-[46ch]">
            <h2 id="portals-close" className="font-serif text-title text-ink">
              {t.portals.closeTitle}
            </h2>
            <p className="mt-2 text-body text-ink-muted">{t.portals.closeBody}</p>
          </div>
          <Button variant="secondary" onClick={() => setActiveTab('auditor')}>
            <span>{t.portals.closeAction}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </div>
  );
};

interface ActiveFilterProps {
  label: string;
  value: string;
  clearLabel: string;
  onClear: () => void;
}

/**
 * A filter that is currently narrowing the list, and the control that lifts it.
 * One object rather than a label beside a button, because the thing the reader
 * wants to remove and the way to remove it are the same thing.
 */
const ActiveFilter: React.FC<ActiveFilterProps> = ({ label, value, clearLabel, onClear }) => (
  <button
    type="button"
    onClick={onClear}
    className="inline-flex min-h-[2.75rem] max-w-full items-center gap-2 rounded-control border border-navy/30 bg-navy-tint px-3 text-body-s text-navy transition-colors hover:border-navy"
  >
    <span className={cn(LABEL, 'shrink-0 text-ink-faint')}>{label}</span>
    <span className="min-w-0 truncate font-medium">{value}</span>
    <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    <span className="sr-only">— {clearLabel}</span>
  </button>
);
