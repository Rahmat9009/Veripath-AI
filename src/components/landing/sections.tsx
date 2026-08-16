import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CircleCheck,
  ExternalLink,
  FileText,
  Languages,
  Route,
  ShieldAlert,
} from 'lucide-react';
import { PageTab, Language } from '../../types';
import { useT } from '../../i18n/strings';
import { cn } from '../../lib/cn';
import { BarRule, Button, Callout, EvidenceStrip, Record, StatusChip, Tabs } from '../ui';
import { HeroObject } from '../hero/HeroObject';
import { SectionHead } from './Band';
import { FlowButton } from './FlowButton';
import { Layer } from './ScrollStory';

/**
 * The landing page's content, one section per export.
 *
 * These exist so the page can be presented two ways without the content being
 * written twice. On a desktop the scroll story mounts them as scenes on one
 * sticky stage; on a phone, or under reduced motion, `Home` mounts the same
 * components inside ordinary tonal bands. If a claim changes it changes in one
 * place, and the two presentations cannot drift apart — which matters more
 * here than usual, because these paragraphs are the product's honesty about
 * what it can and cannot tell someone.
 *
 * `Layer` marks the two or three parts of a section that should arrive in
 * sequence when its scene becomes active. It is inert outside the story, so
 * these components are unaffected in stacked mode.
 */

interface SectionProps {
  lang: Language;
  setActiveTab: (tab: PageTab) => void;
}

/* ------------------------------------------------------------------ */
/* The hero's second half — what the five checks amounted to           */
/*                                                                     */
/* In the stacked page this sits below the fold of the hero section.   */
/* In the story it is the scene after the hero, because the first      */
/* viewport is already full and this is the answer to what it shows.   */
/* ------------------------------------------------------------------ */

export const HeroFindings: React.FC<SectionProps> = ({ lang, setActiveTab }) => {
  const t = useT(lang);

  return (
    <div>
      {/* The scene's own head.
          It had none, and read as three columns of hero footnotes floating in
          a navy field. The kicker names what the reader has just watched
          happen; the title beneath it is not new copy but the strongest line
          the scene already carried — `lineResultTitle`, promoted out of the
          middle column into the heading it was always acting as. The column
          keeps its label and its body, so nothing is stated twice. */}
      <Layer index={0}>
        <div className="flex items-center gap-3">
          <BarRule theme="dark" />
          <p className="font-mono text-label uppercase tracking-[0.14em] text-white/70">
            {t.home.findingsKicker}
          </p>
        </div>
        <h2 className="mt-3 font-serif text-display-m font-semibold text-white">
          {t.home.lineResultTitle}
        </h2>
      </Layer>

      <Layer index={1}>
        <div className="mt-9 grid gap-8 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14">
          <div className="min-w-0 lg:col-span-5">
            <p className="max-w-[46ch] text-body text-white/70">{t.home.heroBody}</p>
            <p className="mt-4 max-w-[46ch] text-body-s text-white/55">{t.home.heroNote}</p>
          </div>

          <div className="min-w-0 lg:col-span-4">
            <p className="font-mono text-label uppercase tracking-[0.1em] text-white/50">
              {t.home.lineResultLabel}
            </p>
            <p className="mt-1.5 text-body-s text-white/70">{t.home.lineResultBody}</p>

            {/* What the five checks actually compared, stated once. */}
            <dl className="mt-3 border-t border-white/10 pt-3">
              <dt className="font-mono text-label uppercase tracking-[0.08em] text-white/50">
                {t.evidence.checked}
              </dt>
              <dd className="mt-1 text-body-s text-white/70">{t.home.sampleChecked}</dd>
            </dl>
          </div>

          <div className="min-w-0 lg:col-span-3">
            <p className="font-mono text-label uppercase tracking-[0.1em] text-white/50">
              {t.home.lineNextStepLabel}
            </p>
            <p className="mt-2 text-body-s text-white/80">{t.home.lineNextStepBody}</p>
            <button
              type="button"
              onClick={() => setActiveTab('auditor')}
              className="focus-ring-inverse mt-3 inline-flex min-h-[2.75rem] items-center gap-1.5 text-body-s font-medium text-white underline underline-offset-4"
            >
              <span>{t.home.sampleAuditCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Layer>

      <Layer index={2}>
        <p className="mt-8 border-t border-white/10 pt-5 text-body-s text-white/50">
          {t.home.lineCaption}
        </p>
      </Layer>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* The problem                                                         */
/* ------------------------------------------------------------------ */

export const ProblemSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useT(lang);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
      {/* An even split: at 5 of 12 this headline broke into six lines and
          read as a squeezed column rather than a statement. */}
      <Layer index={0} className="min-w-0 lg:col-span-6">
        <SectionHead
          kicker={t.home.challengeKicker}
          title={t.home.challengeTitle}
          body={t.home.challengeBody}
          onDark
          size="lg"
        />
      </Layer>

      {/* Three facets of one problem, not a sequence — so they are ruled
          apart rather than numbered, and carry no icons. */}
      <Layer index={1} as="dl" className="min-w-0 lg:col-span-6 lg:self-center">
        {[
          { title: t.home.challenge1Title, body: t.home.challenge1Body },
          { title: t.home.challenge2Title, body: t.home.challenge2Body },
          { title: t.home.challenge3Title, body: t.home.challenge3Body },
        ].map((item) => (
          <div key={item.title} className="border-t border-white/15 py-5 last:border-b">
            <dt className="font-serif text-title text-white">{item.title}</dt>
            <dd className="mt-2 text-body text-white/65">{item.body}</dd>
          </div>
        ))}
      </Layer>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* What VeriPath holds to                                              */
/* ------------------------------------------------------------------ */

export const PrinciplesSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useT(lang);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
      <Layer index={0} className="min-w-0 lg:col-span-5">
        <SectionHead
          kicker={t.home.principlesKicker}
          title={t.home.principlesTitle}
          body={t.home.principlesBody}
        />
      </Layer>

      {/* Four commitments, not a sequence — ruled, unnumbered. */}
      <Layer index={1} as="dl" className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:col-span-7">
        {[
          { title: t.home.principle1Title, body: t.home.principle1Body },
          { title: t.home.principle2Title, body: t.home.principle2Body },
          { title: t.home.principle3Title, body: t.home.principle3Body },
          { title: t.home.principle4Title, body: t.home.principle4Body },
        ].map((item) => (
          <div key={item.title} className="border-t-2 border-navy pt-3">
            <dt className="font-serif text-title text-ink">{item.title}</dt>
            <dd className="mt-1.5 text-body-s text-ink-muted">{item.body}</dd>
          </div>
        ))}
      </Layer>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* What VeriPath does — the four steps                                 */
/* ------------------------------------------------------------------ */

export const ProcessSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useT(lang);

  return (
    <div>
      <Layer index={0} className="max-w-[52ch]">
        <p className="font-mono text-label uppercase tracking-[0.14em] text-navy">
          {t.home.processKicker}
        </p>
        <h3 className="mt-3 font-serif text-display-m font-semibold text-ink">
          {t.home.processTitle}
        </h3>
        <p className="mt-3 text-body-l text-ink-muted">{t.home.processBody}</p>
      </Layer>

      {/* Genuinely sequential, so it is numbered — and laid across the band
          rather than down its left edge. */}
      <Layer index={1} as="ol" className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: t.home.step1Title, body: t.home.step1Body },
          { title: t.home.step2Title, body: t.home.step2Body },
          { title: t.home.step3Title, body: t.home.step3Body },
          { title: t.home.step4Title, body: t.home.step4Body },
        ].map((step, index) => (
          <li key={step.title} className="min-w-0 border-t border-rule-strong pt-4">
            <p className="tabular font-mono text-label uppercase tracking-[0.12em] text-navy">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h4 className="mt-2 font-serif text-title text-ink">{step.title}</h4>
            <p className="mt-1.5 text-body-s text-ink-muted">{step.body}</p>
          </li>
        ))}
      </Layer>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* The two tools — one per scene, mirrored                             */
/* ------------------------------------------------------------------ */

export const ToolMatcherSection: React.FC<SectionProps> = ({ lang, setActiveTab }) => {
  const t = useT(lang);

  return (
    <div>
      <Layer index={0}>
        <SectionHead kicker={t.home.toolsKicker} title={t.home.toolsTitle} />
      </Layer>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-12 xl:gap-x-16">
        <Layer index={1} className="min-w-0 lg:col-span-5">
          <p className="font-mono text-label uppercase tracking-[0.14em] text-navy">
            {t.home.tool1Role}
          </p>
          <h3 className="mt-3 font-serif text-display-m font-semibold text-ink">
            {t.home.tool1Name}
          </h3>
          <p className="mt-4 max-w-[44ch] text-body-l text-ink-muted">{t.home.tool1Body}</p>
          <div className="mt-6">
            <Button variant="secondary" onClick={() => setActiveTab('matcher')}>
              <span>{t.home.tool1Cta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Layer>

        <Layer index={2} className="min-w-0 lg:col-span-7">
          {/* No shadow: these sit in the page flow, so they are drawn, not
              lifted. Depth is reserved for things that genuinely float. */}
          <div className="rounded-record border border-rule bg-surface p-5 sm:p-6">
            <p className="flex items-center gap-2 text-body-s font-medium text-ink">
              <Route className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
              {t.home.tool1PreviewRoute}
            </p>
            <p className="mt-3 font-serif text-display-m text-ink">{t.home.tool1PreviewTitle}</p>
            <dl className="mt-5 grid gap-5 border-t border-rule pt-5 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                  {t.home.tool1PreviewFee}
                </dt>
                <dd className="mt-1 font-mono text-data tabular text-ink">
                  {t.home.tool1PreviewFeeValue}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                  {t.home.tool1PreviewTime}
                </dt>
                <dd className="mt-1 font-mono text-data tabular text-ink">
                  {t.home.tool1PreviewTimeValue}
                </dd>
              </div>
            </dl>
            <EvidenceStrip
              lang={lang}
              checked={t.home.tool1PreviewTitle}
              source={t.common.demoData}
              status="requires-confirmation"
            />
          </div>
        </Layer>
      </div>
    </div>
  );
};

export const ToolAuditorSection: React.FC<SectionProps> = ({ lang, setActiveTab }) => {
  const t = useT(lang);

  return (
    <div>
      {/* The tool names itself first.
          Its identity used to sit in the right-hand column, second in reading
          order, under a section head that belongs to the previous scene — so
          the scene opened on a sample panel with nothing saying what it was.
          The role and the name are the copy that was already here; they have
          only been promoted to the head of the scene, where the matcher's
          already are. */}
      <Layer index={0}>
        <div className="flex items-center gap-3">
          <BarRule />
          <p className="font-mono text-label uppercase tracking-[0.14em] text-navy">
            {t.home.tool2Role}
          </p>
        </div>
        <h3 className="mt-3 font-serif text-display-m font-semibold text-ink">
          {t.home.tool2Name}
        </h3>
      </Layer>

      {/* Still mirrored against the matcher: sample left, copy right. The copy
          comes first in the DOM, so on one column both tools read
          claim-then-sample. */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-12 xl:gap-x-16">
        <Layer index={1} className="min-w-0 lg:col-span-5 lg:order-2">
          <p className="max-w-[44ch] text-body-l text-ink-muted">{t.home.tool2Body}</p>
          <div className="mt-6">
            <Button variant="secondary" onClick={() => setActiveTab('auditor')}>
              <span>{t.home.tool2Cta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Layer>

        <Layer index={2} className="min-w-0 lg:col-span-7 lg:order-1">
          <div className="rounded-record border border-rule bg-surface p-5 sm:p-6">
            <p className="flex items-center gap-2 text-body-s font-medium text-ink">
              <FileText className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
              {t.home.tool2PreviewFile}
            </p>
            <div className="mt-4 rounded-control border border-caution/40 bg-caution-surface p-4">
              <p className="flex items-center gap-2 text-body-s font-medium text-ink">
                <AlertTriangle className="h-4 w-4 shrink-0 text-caution" aria-hidden="true" />
                {t.home.tool2PreviewClaim}
              </p>
              <p className="mt-1.5 text-body-s text-ink-muted">{t.home.tool2PreviewBody}</p>
            </div>
            <EvidenceStrip
              lang={lang}
              checked={t.home.tool2PreviewClaim}
              source={t.common.demoData}
              status="requires-confirmation"
            />
          </div>
        </Layer>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Reading a result — the canonical legend                             */
/* ------------------------------------------------------------------ */

export const ResultsSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useT(lang);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
      <div className="min-w-0 lg:col-span-5">
        <Layer index={0}>
          <SectionHead
            kicker={t.home.resultsKicker}
            title={t.home.resultsTitle}
            body={t.home.resultsBody}
          />
        </Layer>

        <Layer index={1} as="dl" className="mt-8">
          {[
            { title: t.home.finding1Title, body: t.home.finding1Body, icon: CircleCheck, tone: 'verified' },
            { title: t.home.finding2Title, body: t.home.finding2Body, icon: AlertTriangle, tone: 'caution' },
            { title: t.home.finding3Title, body: t.home.finding3Body, icon: ShieldAlert, tone: 'alert' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 border-t border-rule py-4 last:border-b">
              {/* Icon and word together, never colour alone. */}
              <item.icon
                className={cn(
                  'mt-0.5 h-5 w-5 shrink-0',
                  item.tone === 'verified' && 'text-verified',
                  item.tone === 'caution' && 'text-caution',
                  item.tone === 'alert' && 'text-alert'
                )}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <dt className="font-medium text-ink">{item.title}</dt>
                <dd className="mt-1 text-body-s text-ink-muted">{item.body}</dd>
              </div>
            </div>
          ))}
        </Layer>
      </div>

      <Layer index={2} className="min-w-0 lg:col-span-7">
        <div className="rounded-record border border-rule bg-surface p-5 sm:p-6">
          <p className="font-mono text-label uppercase tracking-[0.1em] text-ink-faint">
            {t.home.statusHeading}
          </p>
          <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {(
              [
                ['preliminary', t.home.legendPreliminary],
                ['requires-confirmation', t.home.legendRequiresConfirmation],
                ['needs-review', t.home.legendNeedsReview],
                ['insufficient-evidence', t.home.legendInsufficient],
                ['backend-unavailable', t.home.legendBackendUnavailable],
                ['unsupported-destination', t.home.legendUnsupportedDestination],
              ] as const
            ).map(([status, explanation]) => (
              <div key={status} className="min-w-0 border-t border-rule pt-3">
                <dt>
                  <StatusChip status={status} lang={lang} />
                </dt>
                <dd className="mt-2 text-body-s text-ink-muted">{explanation}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Layer>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Traceability — where a finding ends up                              */
/* ------------------------------------------------------------------ */

export const TraceSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useT(lang);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
      <div className="min-w-0 lg:col-span-4">
        <Layer index={0}>
          <SectionHead
            kicker={t.home.traceKicker}
            title={t.home.traceTitle}
            body={t.home.traceBody}
            onDark
          />
        </Layer>

        <Layer index={1} as="ol" className="mt-8">
          {[t.home.trace1, t.home.trace2, t.home.trace3, t.home.trace4].map((item, index) => (
            <li
              key={item}
              className="flex items-baseline gap-3 border-t border-white/15 py-3.5 last:border-b"
            >
              <span className="tabular font-mono text-label text-white/50">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 text-body text-white/85">{item}</span>
            </li>
          ))}
        </Layer>
      </div>

      {/* The sample record stays a light card lifted off the navy: the point
          of the section is that a finding ends somewhere you can go and
          check, so the thing you would act on is the one thing here that is
          not navy. */}
      <Layer index={2} className="min-w-0 lg:col-span-8">
        <Record
          label={t.common.demoData}
          action={<StatusChip status="requires-confirmation" lang={lang} />}
          className="shadow-lift"
        >
          <div className="space-y-4">
            <div>
              <p className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                {t.home.traceClaimLabel}
              </p>
              <p className="mt-1 font-serif text-title text-ink">{t.home.traceClaim}</p>
            </div>

            <div className="rounded-control border border-verified/40 bg-verified-surface p-4">
              <p className="flex items-center gap-2 font-medium text-ink">
                <CircleCheck className="h-4 w-4 shrink-0 text-verified" aria-hidden="true" />
                {t.home.traceResultTitle}
              </p>
              <p className="mt-1.5 text-body-s text-ink-muted">{t.home.traceResultBody}</p>
              <a
                href="https://www.mol.gov.qa"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-[2.75rem] items-center gap-1.5 text-body-s font-medium text-navy underline underline-offset-2"
              >
                <span>{t.common.openPortal}</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            <EvidenceStrip
              lang={lang}
              checked={t.home.traceChecked}
              source={t.home.traceSource}
              status="requires-confirmation"
            />
          </div>
        </Record>
      </Layer>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Closing — the instrument once more, smaller                         */
/*                                                                     */
/* The object returns at a fraction of its scene-one size to close the */
/* page where it opened. It is deliberately still: the hero's float is */
/* the only loop on the page, and a second breathing object would      */
/* halve the value of the first.                                       */
/* ------------------------------------------------------------------ */

export const ClosingSection: React.FC<SectionProps> = ({ lang, setActiveTab }) => {
  const t = useT(lang);

  return (
    <div className="mx-auto max-w-2xl text-center">
      <Layer index={0}>
        <div className="mx-auto h-[112px] w-[112px] sm:h-[148px] sm:w-[148px]">
          {/* Same `sizes` as the hero, so the browser reuses the file it
              already fetched and this reprise costs no extra bytes. */}
          <HeroObject />
        </div>
      </Layer>

      <Layer index={1}>
        <div className="mt-7 flex justify-center">
          <BarRule theme="dark" />
        </div>
        <h2 className="mt-5 font-serif text-section font-semibold text-white">
          {t.home.closingTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-[48ch] text-body-l text-white/80">{t.home.closingBody}</p>
        <div className="mt-7 flex justify-center">
          {/* The page's other flow control, and the last of them. It closes
              the page where the hero opened it. */}
          <FlowButton label={t.home.closingCta} onClick={() => setActiveTab('auditor')} />
        </div>
      </Layer>

      {/* The short form, not the long one. The footer states the long
          disclaimer verbatim below this, and printing both would render as
          the same paragraph twice on one screen. */}
      <Layer index={2}>
        <p className="mx-auto mt-8 max-w-[60ch] border-t border-white/20 pt-5 text-body-s text-white/70">
          {t.disclaimer.short}
        </p>
      </Layer>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Access and language — light, and interactive                        */
/* ------------------------------------------------------------------ */

export const AccessSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useT(lang);
  const [accessMode, setAccessMode] = useState<'standard' | 'bengali' | 'large'>('standard');

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
      <Layer index={0} className="min-w-0 lg:col-span-5">
        <SectionHead
          kicker={t.home.accessKicker}
          title={t.home.accessTitle}
          body={t.home.accessBody}
        />
        <ul className="mt-8">
          {[t.home.access1, t.home.access2, t.home.access3, t.home.access4].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 border-t border-rule py-3.5 text-body text-ink last:border-b"
            >
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified" aria-hidden="true" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      </Layer>

      <Layer index={1} className="min-w-0 lg:col-span-7">
        <Record label={t.home.accessDemoLabel}>
          <div className="space-y-4">
            <Tabs
              variant="pill"
              label={t.home.accessDemoLabel}
              value={accessMode}
              onChange={setAccessMode}
              items={[
                { id: 'standard', label: t.home.accessModeStandard },
                { id: 'bengali', label: t.home.accessModeBengali, icon: Languages },
                { id: 'large', label: t.home.accessModeLarge },
              ]}
            />

            <Callout tone="caution" icon={AlertTriangle} title={t.home.accessDemoTitle}>
              <p
                className={accessMode === 'large' ? 'text-body-l text-ink' : undefined}
                lang={accessMode === 'bengali' ? 'bn' : undefined}
              >
                {accessMode === 'bengali'
                  ? 'এই অফারের বেতন এই কাজের প্রকাশিত সীমার চেয়ে বেশি। টাকা দেওয়ার আগে লিখিতভাবে নিশ্চিত করুন।'
                  : t.home.accessDemoBody}
              </p>
            </Callout>
          </div>
        </Record>
      </Layer>
    </div>
  );
};
