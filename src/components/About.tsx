import React from 'react';
import { PageTab, Language } from '../types';
import { ArrowRight } from 'lucide-react';
import { useT } from '../i18n/strings';
import { cn } from '../lib/cn';
import { BarRule, Button } from './ui';
import { Band } from './landing/Band';
import { Reveal } from './landing/motion';

/**
 * The About page.
 *
 * Built as a sequence of tonal bands rather than a stack of bordered records,
 * for the same reason the landing page is: the page's structure is carried by
 * its grounds, so the reader can tell a statement of capability from a
 * statement of method from a statement of limit without reading a single word
 * first. `App` exempts this route from the shared container (see
 * `BANDED_PAGES`) and each band applies `shell` itself.
 *
 * Deliberately quieter than the landing page. There is no pinned story, no
 * hero object, one entrance per band at most, and the only ornament on the
 * page is a masked hairline grid behind the masthead. Nothing here claims
 * anything the product does not already claim elsewhere; the honesty copy is
 * unchanged, and the new strings are labels for it.
 */

interface AboutProps {
  lang: Language;
  setActiveTab: (tab: PageTab) => void;
}

/** The mono strip that opens every band. */
const Kicker: React.FC<{ children: React.ReactNode; onDark?: boolean }> = ({
  children,
  onDark,
}) => (
  <div className="flex items-center gap-3">
    <BarRule theme={onDark ? 'dark' : 'light'} />
    <p
      className={cn(
        'font-mono text-label uppercase tracking-[0.14em]',
        onDark ? 'text-white/70' : 'text-navy'
      )}
    >
      {children}
    </p>
  </div>
);

export const About: React.FC<AboutProps> = ({ lang, setActiveTab }) => {
  const t = useT(lang);

  const facts: Array<[string, string]> = [
    [t.about.whatIsTerm, t.about.whatIsDef],
    [t.about.whoForTerm, t.about.whoForDef],
    [t.about.notTerm, t.about.notDef],
  ];

  const does = [
    { title: t.about.does1Title, body: t.about.does1Body },
    { title: t.about.does2Title, body: t.about.does2Body },
    { title: t.about.does3Title, body: t.about.does3Body },
    { title: t.about.does4Title, body: t.about.does4Body },
  ];

  const cannot = [t.about.cannot1, t.about.cannot2, t.about.cannot3, t.about.cannot4];

  const chain = [
    { label: t.about.chain1Label, body: t.about.chain1Body },
    { label: t.about.chain2Label, body: t.about.chain2Body },
    { label: t.about.chain3Label, body: t.about.chain3Body },
    { label: t.about.chain4Label, body: t.about.chain4Body },
  ];

  const hold = [
    { title: t.about.hold1Title, body: t.about.hold1Body },
    { title: t.about.hold2Title, body: t.about.hold2Body },
    { title: t.about.hold3Title, body: t.about.hold3Body },
    { title: t.about.hold4Title, body: t.about.hold4Body },
  ];

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/* 1 · Masthead                                                       */}
      {/*                                                                    */}
      {/* Asymmetric: the title takes seven tracks and the standing summary  */}
      {/* five, set beside it rather than beneath it, so the first object on */}
      {/* the page is the honesty system itself and not an introduction to   */}
      {/* it. No top rule — this sits directly under the header. No reveal — */}
      {/* it is above the fold and should simply be there.                   */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative bg-paper">
        <div aria-hidden="true" className="ledger-grid pointer-events-none absolute inset-0" />

        <div className="shell relative py-12 sm:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
            <div className="min-w-0 lg:col-span-7">
              <Kicker>{t.about.kicker}</Kicker>
              <h1 className="mt-4 max-w-[22ch] font-serif text-display-m font-semibold text-ink sm:text-display-l">
                {t.about.title}
              </h1>
              <p className="mt-5 max-w-[54ch] text-lead text-ink-muted">{t.about.intro}</p>
            </div>

            {/* The summary is a definition list, not a card: a 2px navy rule
                over it and hairlines between its rows, in the same idiom as
                the evidence strip that closes every result in the product. */}
            <div className="min-w-0 lg:col-span-5 lg:self-center">
              <div className="border-t-2 border-navy pt-4">
                <h2 className="font-mono text-label uppercase tracking-[0.1em] text-ink-faint">
                  {t.about.factsLabel}
                </h2>
                <dl className="mt-2">
                  {facts.map(([term, def]) => (
                    <div
                      key={term}
                      className="grid gap-x-6 gap-y-1 border-t border-rule py-3.5 last:border-b sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)]"
                    >
                      <dt className="font-medium text-body text-ink">{term}</dt>
                      <dd className="min-w-0 text-body-s text-ink-muted">{def}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* 2 · The register — what it does, what it cannot do                 */}
      {/*                                                                    */}
      {/* Two lists on one grid rather than two bordered boxes. The          */}
      {/* distinction is carried three ways at once: position, a mono column */}
      {/* head, and the left rule of every entry — solid where the claim is  */}
      {/* something VeriPath does, dashed where it is something only someone */}
      {/* else can. Dashed rather than merely a different colour, so the     */}
      {/* difference survives greyscale and high-contrast on the same        */}
      {/* principle as the `hatch` fill used for unknown status.             */}
      {/*                                                                    */}
      {/* Every rule is coloured on its own side. `border-rule` plus         */}
      {/* `border-l-verified` would be two utilities of equal specificity    */}
      {/* setting the same property, settled by stylesheet order rather than */}
      {/* by intent — `cn` is a plain join with no conflict resolution.      */}
      {/* ----------------------------------------------------------------- */}
      <Band tone="vellum" size="tight">
        <Kicker>{t.about.registerKicker}</Kicker>

        <div className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:gap-x-16">
          <section className="min-w-0">
            <h2 className="font-mono text-label uppercase tracking-[0.1em] text-ink-faint">
              {t.about.doesTitle}
            </h2>
            <dl className="mt-4">
              {does.map((item) => (
                <div
                  key={item.title}
                  className="border-t border-t-rule border-b-rule border-l-2 border-l-verified py-4 pl-4 last:border-b sm:pl-5"
                >
                  <dt className="font-serif text-title text-ink">{item.title}</dt>
                  <dd className="mt-1.5 max-w-[54ch] text-body-s text-ink-muted">{item.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* The spine. A single hairline between the columns from `md` up,
              where the two lists sit side by side; below that they stack and
              the head of the second list is separation enough. */}
          <section className="min-w-0 md:border-l md:border-rule-strong md:pl-10 lg:pl-14">
            <h2 className="font-mono text-label uppercase tracking-[0.1em] text-ink-faint">
              {t.about.cannotTitle}
            </h2>
            <ul className="mt-4">
              {cannot.map((item) => (
                <li
                  key={item}
                  className="border-t border-t-rule border-b-rule border-l-2 border-l-caution [border-left-style:dashed] py-4 pl-4 last:border-b sm:pl-5"
                >
                  <span className="block max-w-[54ch] text-body text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Band>

      {/* ----------------------------------------------------------------- */}
      {/* 3 · The evidence chain                                             */}
      {/*                                                                    */}
      {/* The one navy band on the page, and its centre of gravity: the four */}
      {/* stages a finding passes through, in order. The register above says */}
      {/* what VeriPath does; this says the sequence it happens in, which is */}
      {/* why the entries are terse labels rather than a second list.        */}
      {/*                                                                    */}
      {/* Structure adapted from Untitled UI's progress steps — the marker,  */}
      {/* the connector as a sibling that fills the remaining track, the     */}
      {/* horizontal/vertical swap. Its colours, rounded markers and         */}
      {/* opacity-based states are not used: opacity states fail in          */}
      {/* high-contrast mode, and none of these steps is "incomplete".       */}
      {/* ----------------------------------------------------------------- */}
      <Band tone="navy" size="tight">
        <Reveal>
          <Kicker onDark>{t.about.chainKicker}</Kicker>
          <h2 className="mt-4 max-w-[24ch] font-serif text-display-m font-semibold text-white">
            {t.about.chainTitle}
          </h2>
        </Reveal>

        <Reveal as="ol" className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4" delay={0.1}>
          {chain.map((step, index) => {
            const last = index === chain.length - 1;
            return (
              <li key={step.label} className="min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-control border',
                      'font-mono text-label text-white',
                      // The fourth marker is the only one that changes: it is
                      // the only step that leaves VeriPath.
                      last ? 'border-brand-green' : 'border-white/35'
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {/* Drawn only where all four steps sit on one row. Below
                      that the ordered list and the numerals carry the
                      sequence on their own, which is steadier than a rail
                      that has to change direction twice. */}
                  {!last && (
                    <span
                      aria-hidden="true"
                      className="chain-link hidden h-px flex-1 opacity-45 lg:block"
                    />
                  )}
                </div>

                <h3 className="mt-4 font-serif text-title text-white">
                  <span className="sr-only">
                    {t.about.chainStep} {index + 1}
                    {': '}
                  </span>
                  {step.label}
                </h3>
                <p className="mt-1.5 max-w-[34ch] text-body-s text-white/65">{step.body}</p>
              </li>
            );
          })}
        </Reveal>
      </Band>

      {/* ----------------------------------------------------------------- */}
      {/* 4 · Method                                                         */}
      {/*                                                                    */}
      {/* Running prose at a reading measure, with its heading set out in the */}
      {/* margin. The limits paragraph keeps the caution rule it has always  */}
      {/* had, without the tinted panel — on a paper ground a left rule is    */}
      {/* enough, and the surrounding text stays one colour.                 */}
      {/* ----------------------------------------------------------------- */}
      <Band tone="paper" size="tight">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          <div className="min-w-0 lg:col-span-4">
            <Kicker>{t.about.howKicker}</Kicker>
            <h2 className="mt-4 max-w-[18ch] font-serif text-display-m font-semibold text-ink">
              {t.about.howTitle}
            </h2>
          </div>

          <div className="min-w-0 lg:col-span-8">
            <p className="max-w-[68ch] text-body-l text-ink-muted">{t.about.howBody}</p>

            <div className="mt-8 border-l-2 border-caution pl-5">
              <h3 className="font-serif text-title text-ink">{t.about.limitsTitle}</h3>
              <p className="mt-1.5 max-w-[64ch] text-body text-ink-muted">{t.about.limitsBody}</p>
            </div>
          </div>
        </div>
      </Band>

      {/* ----------------------------------------------------------------- */}
      {/* 5 · What we hold to                                                */}
      {/*                                                                    */}
      {/* Four commitments as marginal notes: the title set out in the left  */}
      {/* margin and the sentence in the reading column, ruled apart. The    */}
      {/* landing page states its principles as a grid of ruled cards, so    */}
      {/* this is deliberately a different instrument in the same voice —    */}
      {/* the two pages should not read as one page printed twice.           */}
      {/* ----------------------------------------------------------------- */}
      <Band tone="vellum" size="tight">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          <div className="min-w-0 lg:col-span-4">
            <Kicker>{t.about.holdKicker}</Kicker>
            <h2 className="mt-4 max-w-[16ch] font-serif text-display-m font-semibold text-ink">
              {t.about.holdTitle}
            </h2>
          </div>

          <Reveal as="dl" className="min-w-0 lg:col-span-8">
            {hold.map((item) => (
              <div
                key={item.title}
                className="grid gap-x-8 gap-y-1.5 border-t border-rule py-5 last:border-b sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
              >
                <dt className="font-serif text-title text-ink">{item.title}</dt>
                <dd className="min-w-0 max-w-[58ch] text-body text-ink-muted">{item.body}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </Band>

      {/* ----------------------------------------------------------------- */}
      {/* 6 · Your document                                                  */}
      {/* ----------------------------------------------------------------- */}
      <Band tone="paper" size="tight">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          <div className="min-w-0 lg:col-span-4">
            <Kicker>{t.about.dataKicker}</Kicker>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <h2 className="font-serif text-title text-ink">{t.about.dataTitle}</h2>
            <p className="mt-2 max-w-[68ch] text-body text-ink-muted">{t.about.dataBody}</p>
          </div>
        </div>
      </Band>

      {/* ----------------------------------------------------------------- */}
      {/* 7 · Close                                                          */}
      {/*                                                                    */}
      {/* Left-aligned rather than centred, so the page ends in the same     */}
      {/* register it was set in.                                            */}
      {/* ----------------------------------------------------------------- */}
      <Band tone="navy" size="tight">
        <div className="max-w-[46ch]">
          <BarRule theme="dark" />
          <h2 className="mt-4 font-serif text-display-m font-semibold text-white">
            {t.about.ctaTitle}
          </h2>
          <p className="mt-3 text-body-l text-white/75">{t.about.ctaBody}</p>
          <div className="mt-7">
            <Button variant="inverse" onClick={() => setActiveTab('auditor')}>
              <span>{t.about.ctaButton}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Band>
    </>
  );
};
