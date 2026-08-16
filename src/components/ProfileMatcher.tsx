import React, { useRef, useState } from 'react';
import { UserProfileInput, PathwayResult, Language } from '../types';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CircleCheck,
  ExternalLink,
  FileCheck,
  ListChecks,
  Scale,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import { useT } from '../i18n/strings';
import {
  DESTINATIONS,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
  FUND_SOURCES,
  Option,
  PURPOSES,
  RECORD_OPTIONS,
  optionLabel,
} from '../i18n/options';
import { assessedAt, groundingStatus, isSupportedDestination, statusLabel } from '../lib/status';
import { apiFetch } from '../lib/api';
import { cn } from '../lib/cn';
import { useResultOutcome } from '../hooks/useResultOutcome';
import {
  BackendUnavailable,
  Button,
  Callout,
  Disclosure,
  EvidenceStrip,
  Field,
  FieldRow,
  FormSection,
  PageHeader,
  Record,
  SkeletonRecord,
  StatusChip,
  UnsupportedDestination,
  controlClass,
} from './ui';

interface ProfileMatcherProps {
  lang: Language;
}

type Phase = 'idle' | 'loading' | 'result' | 'unavailable' | 'unsupported';

/** Sentinel for "my destination is not on this list". Never sent to the API. */
const NOT_LISTED = '__not_listed__';

/**
 * Fixed ids for the two fields that can be invalid, so a failed submit can
 * find the first of them and put the reader in it. In source order — the
 * order the form is read in, which is the order the errors should be visited
 * in.
 */
const FIELD_IDS = { destination: 'matcher-destination', budget: 'matcher-budget' } as const;
const ERROR_ORDER = ['destination', 'budget'] as const;

/** Small labelled block used throughout the result groups. */
const Detail: React.FC<{ term: string; children: React.ReactNode }> = ({ term, children }) => (
  <div className="border-t border-rule pt-3">
    <dt className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">{term}</dt>
    <dd className="mt-1.5 break-words text-body-s text-ink-muted">{children}</dd>
  </div>
);

/**
 * One line of the review panel: what was asked, and what this reader answered.
 * An unanswered row is a dash rather than a missing row, so the panel is a
 * picture of the whole form and not only of the parts that are filled in.
 */
const SummaryRow: React.FC<{ term: string; value?: string }> = ({ term, value }) => (
  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-rule py-2 last:border-b-0">
    <dt className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">{term}</dt>
    <dd className={cn('min-w-0 break-words text-body-s', value ? 'text-ink' : 'text-ink-faint')}>
      {value || '—'}
    </dd>
  </div>
);

export const ProfileMatcher: React.FC<ProfileMatcherProps> = ({ lang }) => {
  const t = useT(lang);

  const [input, setInput] = useState<UserProfileInput>({
    targetDestination: '',
    purpose: '',
    highestEducation: '',
    fieldOfStudy: '',
    coreSkills: '',
    workExperienceYears: '',
    availableBudgetBDT: '',
    sourceOfFunds: '',
    criminalRecord: '',
  });

  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<PathwayResult | null>(null);
  const [assessedTime, setAssessedTime] = useState<string>('');
  const [errors, setErrors] = useState<{ destination?: string; budget?: string }>({});
  const resultRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof UserProfileInput>(key: K, value: UserProfileInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const renderOptions = (options: Option[]) =>
    options.map((option) => (
      <option key={option.value} value={option.value}>
        {optionLabel(option, lang)}
      </option>
    ));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: typeof errors = {};
    if (!input.targetDestination) nextErrors.destination = t.matcher.destinationRequired;
    if (input.availableBudgetBDT && !/^[\d\s,]+$/.test(input.availableBudgetBDT)) {
      nextErrors.budget = t.matcher.budgetInvalid;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Focus the first invalid control. That is the announcement as well as
      // the navigation: the control is labelled, and its `aria-describedby`
      // already points at the error, so moving into it reads the label and
      // then the reason. A separate live region here would say the same
      // sentence a second time.
      const firstInvalid = ERROR_ORDER.find((key) => nextErrors[key]);
      if (firstInvalid) {
        // After paint, so the error text exists to be read out with it.
        requestAnimationFrame(() => document.getElementById(FIELD_IDS[firstInvalid])?.focus());
      }
      return;
    }

    if (!isSupportedDestination(input.targetDestination)) {
      setPhase('unsupported');
      return;
    }

    setPhase('loading');
    setResult(null);

    try {
      const response = await apiFetch('/api/match-pathway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) throw new Error('Pathway request failed');

      const data: PathwayResult = await response.json();
      setResult(data);
      setAssessedTime(assessedAt());
      setPhase('result');
    } catch (err) {
      // VeriPath never fills an unreachable service with invented analysis.
      console.error('Pathway request failed:', err);
      setPhase('unavailable');
    }
  };

  const status = result ? groundingStatus(result.searchQueries) : 'insufficient-evidence';

  /** The visible label for a stored option value, in the reader's language. */
  const labelFor = (options: Option[], value: string) => {
    const found = options.find((option) => option.value === value);
    return found ? optionLabel(found, lang) : undefined;
  };

  /**
   * The fourth section of the form, shown where the answer will appear. It is
   * the same nine questions read back — what the assessment is about to be
   * built from — so nothing is submitted out of sight of the person
   * submitting it.
   */
  const reviewRows: Array<[string, string | undefined]> = [
    [
      t.matcher.destination,
      input.targetDestination === NOT_LISTED
        ? t.matcher.destinationNotListed
        : labelFor(DESTINATIONS, input.targetDestination),
    ],
    [t.matcher.purpose, labelFor(PURPOSES, input.purpose)],
    [t.matcher.education, labelFor(EDUCATION_LEVELS, input.highestEducation)],
    [t.matcher.fieldOfStudy, input.fieldOfStudy.trim() || undefined],
    [t.matcher.skills, input.coreSkills.trim() || undefined],
    [t.matcher.experience, labelFor(EXPERIENCE_LEVELS, input.workExperienceYears)],
    [t.matcher.budget, input.availableBudgetBDT.trim() || undefined],
    [t.matcher.funds, labelFor(FUND_SOURCES, input.sourceOfFunds)],
    [t.matcher.record, labelFor(RECORD_OPTIONS, input.criminalRecord)],
  ];
  const answeredCount = reviewRows.filter(([, value]) => Boolean(value)).length;

  // A sentence about the outcome, not the outcome itself — the result runs to
  // five collapsible groups and a reader should be told it has arrived, then
  // read it at their own pace.
  const outcomeMessage =
    phase === 'result' && result
      ? `${t.common.resultReady} ${t.matcher.resultTitle} ${result.destinationCountry}. ${statusLabel(status, lang)}.`
      : phase === 'unavailable'
        ? `${t.states.backendUnavailableTitle}. ${t.states.backendUnavailableBody}`
        : phase === 'unsupported'
          ? `${t.states.unsupportedTitle}. ${t.states.unsupportedBody}`
          : '';

  useResultOutcome(resultRef, phase === 'result' || phase === 'unavailable' || phase === 'unsupported');

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        lang={lang}
        kicker={t.matcher.kicker}
        title={t.matcher.title}
        intro={t.matcher.intro}
        showDisclaimer
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* ---------------------------------------------------------------- */}
        {/* Form                                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="min-w-0 lg:col-span-5">
          {/* One panel, three numbered groups divided by the same hairline the
              rest of the product is divided by — a single form to work down,
              rather than three boxes to work through. */}
          <form
            onSubmit={handleSubmit}
            className="min-w-0 rounded-record border border-rule bg-surface"
            noValidate
          >
            <FormSection step="01" legend={t.matcher.formLegend1}>
              <Field
                id={FIELD_IDS.destination}
                label={t.matcher.destination}
                meta={t.matcher.required}
                hint={t.matcher.destinationHint}
                error={errors.destination}
              >
                {(props) => (
                  <select
                    {...props}
                    className={controlClass}
                    value={input.targetDestination}
                    onChange={(e) => {
                      set('targetDestination', e.target.value);
                      if (errors.destination) setErrors((p) => ({ ...p, destination: undefined }));
                    }}
                  >
                    <option value="">{t.matcher.destinationPlaceholder}</option>
                    {renderOptions(DESTINATIONS)}
                    {/* Selecting this never reaches the API — it is answered
                        locally with the unsupported-destination state. */}
                    <option value={NOT_LISTED}>{t.matcher.destinationNotListed}</option>
                  </select>
                )}
              </Field>

              <Field label={t.matcher.purpose} meta={t.matcher.optional}>
                {(props) => (
                  <select
                    {...props}
                    className={controlClass}
                    value={input.purpose}
                    onChange={(e) => set('purpose', e.target.value)}
                  >
                    <option value="">{t.matcher.purposePlaceholder}</option>
                    {renderOptions(PURPOSES)}
                  </select>
                )}
              </Field>
            </FormSection>

            <FormSection step="02" legend={t.matcher.formLegend2}>
              <Field label={t.matcher.education} meta={t.matcher.optional}>
                {(props) => (
                  <select
                    {...props}
                    className={controlClass}
                    value={input.highestEducation}
                    onChange={(e) => set('highestEducation', e.target.value)}
                  >
                    <option value="">{t.matcher.educationPlaceholder}</option>
                    {renderOptions(EDUCATION_LEVELS)}
                  </select>
                )}
              </Field>

              <Field
                label={t.matcher.fieldOfStudy}
                meta={t.matcher.optional}
                hint={t.matcher.fieldOfStudyHint}
              >
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    className={controlClass}
                    value={input.fieldOfStudy}
                    onChange={(e) => set('fieldOfStudy', e.target.value)}
                  />
                )}
              </Field>

              <Field label={t.matcher.skills} meta={t.matcher.optional} hint={t.matcher.skillsHint}>
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    className={controlClass}
                    value={input.coreSkills}
                    onChange={(e) => set('coreSkills', e.target.value)}
                  />
                )}
              </Field>

              <Field label={t.matcher.experience} meta={t.matcher.optional}>
                {(props) => (
                  <select
                    {...props}
                    className={controlClass}
                    value={input.workExperienceYears}
                    onChange={(e) => set('workExperienceYears', e.target.value)}
                  >
                    <option value="">{t.matcher.experiencePlaceholder}</option>
                    {renderOptions(EXPERIENCE_LEVELS)}
                  </select>
                )}
              </Field>
            </FormSection>

            <FormSection step="03" legend={t.matcher.formLegend3}>
              <Field
                id={FIELD_IDS.budget}
                label={t.matcher.budget}
                meta={t.matcher.optional}
                hint={t.matcher.budgetHint}
                error={errors.budget}
              >
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    inputMode="numeric"
                    className={cn(controlClass, 'font-mono tabular')}
                    value={input.availableBudgetBDT}
                    onChange={(e) => {
                      set('availableBudgetBDT', e.target.value);
                      if (errors.budget) setErrors((p) => ({ ...p, budget: undefined }));
                    }}
                  />
                )}
              </Field>

              <Field label={t.matcher.funds} meta={t.matcher.optional}>
                {(props) => (
                  <select
                    {...props}
                    className={controlClass}
                    value={input.sourceOfFunds}
                    onChange={(e) => set('sourceOfFunds', e.target.value)}
                  >
                    <option value="">{t.matcher.fundsPlaceholder}</option>
                    {renderOptions(FUND_SOURCES)}
                  </select>
                )}
              </Field>

              <Field label={t.matcher.record} meta={t.matcher.optional}>
                {(props) => (
                  <select
                    {...props}
                    className={controlClass}
                    value={input.criminalRecord}
                    onChange={(e) => set('criminalRecord', e.target.value)}
                  >
                    <option value="">{t.matcher.recordPlaceholder}</option>
                    {renderOptions(RECORD_OPTIONS)}
                  </select>
                )}
              </Field>
            </FormSection>

            <div className="border-t border-rule px-4 py-5 sm:px-6">
              <Button type="submit" fullWidth disabled={phase === 'loading'}>
                <span>{phase === 'loading' ? t.matcher.submitting : t.matcher.submit}</span>
                {phase !== 'loading' && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </Button>
              <p className="mt-3 text-body-s text-ink-faint">{t.disclaimer.short}</p>
            </div>
          </form>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Result                                                            */}
        {/* ---------------------------------------------------------------- */}
        <div ref={resultRef} className="min-w-0 space-y-6 lg:col-span-7">
          {/* Always mounted, so the text changing inside it is what gets
              announced. A live region added at the same moment as its content
              is unreliable — some screen readers never see it appear. */}
          <p aria-live="polite" className="sr-only">
            {outcomeMessage}
          </p>

          {/* The idle column is not a blank panel waiting for a result: it is
              the review step, numbered on from the three in the form. */}
          {phase === 'idle' && (
            <Record
              label={`04 · ${t.matcher.reviewLabel}`}
              title={t.matcher.emptyTitle}
              action={
                <span className="tabular font-mono text-label uppercase tracking-[0.06em] text-ink-faint">
                  {answeredCount} / {reviewRows.length} {t.matcher.answered}
                </span>
              }
            >
              <div className="space-y-4">
                <p className="text-body-s text-ink-muted">{t.matcher.emptyBody}</p>
                <dl>
                  {reviewRows.map(([term, value]) => (
                    <SummaryRow key={term} term={term} value={value} />
                  ))}
                </dl>
                <p className="text-body-s text-ink-faint">{t.matcher.reviewNote}</p>
              </div>
            </Record>
          )}

          {phase === 'loading' && (
            <SkeletonRecord lang={lang} message={t.matcher.submitting} detail={t.matcher.loadingDetail} lines={5} />
          )}

          {phase === 'unavailable' && (
            <BackendUnavailable lang={lang} onRetry={() => setPhase('idle')} />
          )}

          {phase === 'unsupported' && (
            <UnsupportedDestination
              lang={lang}
              destination={input.targetDestination === NOT_LISTED ? undefined : input.targetDestination}
            />
          )}

          {phase === 'result' && result && (
            <div className="space-y-6 animate-fadeIn">
              {/* Summary ---------------------------------------------------- */}
              <Record
                label={t.matcher.resultKicker}
                title={`${t.matcher.resultTitle} ${result.destinationCountry}`}
                action={<StatusChip status={status} lang={lang} />}
                tone={status === 'insufficient-evidence' ? 'unknown' : 'caution'}
              >
                <div className="space-y-4">
                  {/* The words first. What the AI reported as a match is a
                      sentence, and it is the sentence the reader should carry
                      away — so it is set in the reading face at reading size,
                      above everything else in the record. */}
                  <div>
                    <p className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                      {t.matcher.matchLabel}
                    </p>
                    <p className="mt-1 font-serif text-title text-ink">{result.matchStatus}</p>
                  </div>

                  {result.summaryText && <p className="text-body text-ink-muted">{result.summaryText}</p>}

                  {/* The score, deliberately below the words and set as a
                      measurement rather than a verdict. It is ungrounded — no
                      office has produced it — so it may not be the largest
                      object in the record, and it is never drawn as a dial or
                      a bar, which would read as progress towards acceptance. */}
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-rule pt-3">
                    <span className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                      {t.matcher.indicatorLabel}
                    </span>
                    <span className="tabular font-mono text-data text-ink-muted">
                      {result.successProbability ?? '—'} / 100
                    </span>
                  </div>
                  <p className="text-body-s text-ink-faint">{t.matcher.indicatorNote}</p>

                  <EvidenceStrip
                    lang={lang}
                    checked={t.matcher.checkedProfile}
                    source={
                      result.searchQueries && result.searchQueries.length > 0
                        ? `${t.evidence.liveSearch}: ${result.searchQueries.join(' · ')}`
                        : undefined
                    }
                    status={status}
                    asOf={assessedTime}
                  />
                </div>
              </Record>

              {/* Grounding, stated in words directly beneath the assessment.
                  The chip in the header carries it too, but a chip is a label;
                  this says what having no retrieved source means for
                  everything below it. */}
              {status === 'insufficient-evidence' && (
                <Callout tone="unknown" icon={AlertTriangle} title={t.states.insufficientTitle}>
                  {t.states.insufficientBody}
                </Callout>
              )}

              {/* Warnings stay at the top, never behind a disclosure --------- */}
              {result.mentorWarnings && result.mentorWarnings.length > 0 && (
                <Record label={t.matcher.warningsTitle} tone="alert">
                  <ul className="space-y-2">
                    {result.mentorWarnings.map((warning) => (
                      <li key={warning} className="flex gap-2.5 text-body text-ink">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-alert" aria-hidden="true" />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </Record>
              )}

              {result.mentorAdvice && result.mentorAdvice.length > 0 && (
                <Record label={t.matcher.adviceTitle} tone="caution">
                  <ul className="space-y-2">
                    {result.mentorAdvice.map((advice) => (
                      <li key={advice} className="flex gap-2.5 text-body text-ink-muted">
                        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-caution" aria-hidden="true" />
                        <span>{advice}</span>
                      </li>
                    ))}
                  </ul>
                </Record>
              )}

              {/* Group 1: the route ---------------------------------------- */}
              <Disclosure
                label={t.matcher.groupRouteTitle}
                summary={t.matcher.groupRouteSummary}
                defaultOpen
              >
                <div className="space-y-5">
                  {result.profileAnalysis && (
                    <div>
                      <h3 className="font-serif text-title text-ink">{t.matcher.profileAnalysis}</h3>
                      <p className="mt-1.5 text-body-s text-ink-muted">{result.profileAnalysis}</p>
                    </div>
                  )}

                  {result.bestPath && (
                    <div className="rounded-control border border-rule bg-paper p-4">
                      <p className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                        {t.matcher.bestPath}
                      </p>
                      <p className="mt-1.5 text-body text-ink">{result.bestPath}</p>
                    </div>
                  )}

                  {result.strategicSuggestions?.length > 0 && (
                    <div>
                      <h3 className="font-serif text-title text-ink">{t.matcher.suggestions}</h3>
                      <ol className="mt-2 space-y-2">
                        {result.strategicSuggestions.map((item, index) => (
                          <li key={item} className="flex gap-3 border-b border-rule pb-2 text-body-s text-ink-muted last:border-b-0">
                            <span className="font-mono text-data tabular text-navy">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {result.verifiedPathwayMap?.length > 0 && (
                    <div>
                      <h3 className="font-serif text-title text-ink">{t.matcher.pathwayMap}</h3>
                      <div className="mt-2 grid gap-3 sm:grid-cols-2">
                        {result.verifiedPathwayMap.map((path) => (
                          <div key={path.title} className="rounded-control border border-rule bg-paper p-4">
                            <p className="font-medium text-ink">{path.title}</p>
                            <p className="mt-0.5 font-mono text-label uppercase text-ink-faint">{path.type}</p>
                            <dl className="mt-3 space-y-0">
                              <FieldRow label={t.matcher.channel} value={path.officialChannel} />
                              <FieldRow label={t.matcher.timeline} value={path.timeline} mono />
                              <FieldRow label={t.matcher.feeCap} value={path.costBDT} mono />
                            </dl>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Disclosure>

              {/* Group 2: costs -------------------------------------------- */}
              {(result.estimatedCostBreakdown?.length > 0 ||
                result.financialRealityCheck ||
                result.bankStatementAndFundsDetails) && (
                <Disclosure label={t.matcher.groupCostTitle} summary={t.matcher.groupCostSummary}>
                  <div className="space-y-5">
                    <Callout tone="caution" icon={AlertTriangle}>
                      {t.matcher.feeWarning}
                    </Callout>

                    {result.estimatedCostBreakdown?.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                          <caption className="sr-only">{t.matcher.costTable}</caption>
                          <thead>
                            <tr className="border-b border-rule-strong">
                              <th scope="col" className="py-2 pr-4 font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                                {t.matcher.costItem}
                              </th>
                              <th scope="col" className="py-2 pr-4 font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                                {t.matcher.costAmount}
                              </th>
                              <th scope="col" className="py-2 font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                                {t.matcher.costNote}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.estimatedCostBreakdown.map((row) => (
                              <tr key={row.feeItem} className="border-b border-rule align-top">
                                <td className="py-2.5 pr-4 text-body-s text-ink">{row.feeItem}</td>
                                <td className="py-2.5 pr-4 font-mono text-data tabular text-ink">
                                  {row.officialCostBDT}
                                </td>
                                <td className="py-2.5 text-body-s text-ink-muted">{row.notes}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {result.financialRealityCheck && (
                      <div>
                        <h3 className="flex items-center gap-2 font-serif text-title text-ink">
                          <Banknote className="h-4 w-4 text-navy" aria-hidden="true" />
                          {t.matcher.financialCheck}
                        </h3>
                        <p className="mt-1.5 text-body-s text-ink-muted">{result.financialRealityCheck}</p>
                      </div>
                    )}

                    {result.bankStatementAndFundsDetails && (
                      <div>
                        <h3 className="font-serif text-title text-ink">{t.matcher.fundsProof}</h3>
                        <dl className="mt-2 space-y-3">
                          <Detail term={t.matcher.detailRequiredBalance}>
                            {result.bankStatementAndFundsDetails.requiredBalanceProof}
                          </Detail>
                          <Detail term={t.matcher.detailSeasonedPeriod}>
                            {result.bankStatementAndFundsDetails.seasonedPeriodMonths}
                          </Detail>
                          <Detail term={t.matcher.detailSourceOfFunds}>
                            {result.bankStatementAndFundsDetails.acceptableSourceOfFunds}
                          </Detail>
                          <Detail term={t.matcher.detailTaxClearance}>
                            {result.bankStatementAndFundsDetails.taxClearanceRequirements}
                          </Detail>
                          <Detail term={t.matcher.detailSponsorAffidavit}>
                            {result.bankStatementAndFundsDetails.sponsorAffidavitGuidelines}
                          </Detail>
                        </dl>
                      </div>
                    )}
                  </div>
                </Disclosure>
              )}

              {/* Group 3: documents and steps ------------------------------ */}
              {(result.requiredDocumentsChecklist?.length > 0 ||
                result.stepByStepRoadmap?.length > 0 ||
                result.masterActionChecklist) && (
                <Disclosure label={t.matcher.groupStepsTitle} summary={t.matcher.groupStepsSummary}>
                  <div className="space-y-5">
                    {result.requiredDocumentsChecklist?.length > 0 && (
                      <div>
                        <h3 className="flex items-center gap-2 font-serif text-title text-ink">
                          <FileCheck className="h-4 w-4 text-navy" aria-hidden="true" />
                          {t.matcher.documents}
                        </h3>
                        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                          {result.requiredDocumentsChecklist.map((doc) => (
                            <li key={doc} className="flex gap-2.5 rounded-control border border-rule bg-paper p-3 text-body-s text-ink">
                              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.stepByStepRoadmap?.length > 0 && (
                      <div>
                        <h3 className="font-serif text-title text-ink">{t.matcher.roadmap}</h3>
                        <ol className="mt-2 border-l-2 border-navy">
                          {result.stepByStepRoadmap.map((step, index) => (
                            <li key={step.stepTitle} className="pb-5 pl-5 last:pb-0">
                              <p className="font-mono text-label uppercase tracking-[0.12em] text-navy">
                                {String(step.stepNumber || index + 1).padStart(2, '0')}
                              </p>
                              <p className="mt-1 font-medium text-ink">{step.stepTitle}</p>
                              <p className="mt-1 text-body-s text-ink-muted">{step.detail}</p>
                              {step.officialPortal && (
                                <a
                                  href={step.officialPortal}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 inline-flex min-h-[2.75rem] items-center gap-1.5 text-body-s font-medium text-navy underline underline-offset-2"
                                >
                                  <span>{t.matcher.officialPortal}</span>
                                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                </a>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {result.masterActionChecklist && (
                      <div>
                        <h3 className="flex items-center gap-2 font-serif text-title text-ink">
                          <ListChecks className="h-4 w-4 text-navy" aria-hidden="true" />
                          {t.matcher.checklist}
                        </h3>
                        <div className="mt-2 grid gap-4 md:grid-cols-3">
                          {(
                            [
                              [t.matcher.checklistPhase1, result.masterActionChecklist.preDeparturePreparation],
                              [t.matcher.checklistPhase2, result.masterActionChecklist.embassyInterviewTips],
                              [t.matcher.checklistPhase3, result.masterActionChecklist.postArrivalMandatorySteps],
                            ] as const
                          ).map(([phaseLabel, items]) => (
                            <div key={phaseLabel} className="rounded-control border border-rule bg-paper p-4">
                              <p className="font-mono text-label uppercase tracking-[0.08em] text-navy">
                                {phaseLabel}
                              </p>
                              <ul className="mt-2 space-y-1.5">
                                {items?.map((item) => (
                                  <li key={item} className="text-body-s text-ink-muted">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Disclosure>
              )}

              {/* Group 4: rights and conditions ---------------------------- */}
              {(result.laborLawsAndLegalRights ||
                result.destinationRealityCheck ||
                result.skillCompetencyRequirements ||
                result.backgroundImpact) && (
                <Disclosure label={t.matcher.groupRightsTitle} summary={t.matcher.groupRightsSummary}>
                  <div className="space-y-5">
                    {result.laborLawsAndLegalRights && (
                      <div>
                        <h3 className="flex items-center gap-2 font-serif text-title text-ink">
                          <Scale className="h-4 w-4 text-navy" aria-hidden="true" />
                          {t.matcher.laborLaws}
                        </h3>
                        <Callout tone="alert" icon={ShieldAlert} className="mt-2">
                          {result.laborLawsAndLegalRights.passportRetentionLaw}
                        </Callout>
                        <dl className="mt-3 space-y-3">
                          <Detail term={t.matcher.detailMinimumWage}>
                            {result.laborLawsAndLegalRights.minimumWageEnforcement}
                          </Detail>
                          <Detail term={t.matcher.detailOvertime}>
                            {result.laborLawsAndLegalRights.overtimeCompensationRules}
                          </Detail>
                          <Detail term={t.matcher.detailChangingEmployer}>
                            {result.laborLawsAndLegalRights.jobTransferAndEmployerChangeRights}
                          </Detail>
                          <Detail term={t.matcher.detailDisputePortal}>
                            {result.laborLawsAndLegalRights.disputeRedressalPortal}
                          </Detail>
                        </dl>
                      </div>
                    )}

                    {result.destinationRealityCheck && (
                      <div>
                        <h3 className="font-serif text-title text-ink">{t.matcher.reality}</h3>
                        <dl className="mt-2 space-y-3">
                          <Detail term={t.matcher.detailNetPay}>
                            {result.destinationRealityCheck.netSalaryExpectation}
                          </Detail>
                          <Detail term={t.matcher.detailLivingCost}>
                            {result.destinationRealityCheck.estimatedMonthlyLivingCost}
                          </Detail>
                          <Detail term={t.matcher.detailHousing}>
                            {result.destinationRealityCheck.housingAndAccommodationReality}
                          </Detail>
                          <Detail term={t.matcher.detailWorkAndClimate}>
                            {result.destinationRealityCheck.workCultureAndClimateReality}
                          </Detail>
                          <Detail term={t.matcher.detailProbation}>
                            {result.destinationRealityCheck.jobSecurityAndProbationRules}
                          </Detail>
                        </dl>
                      </div>
                    )}

                    {result.skillCompetencyRequirements && (
                      <div>
                        <h3 className="font-serif text-title text-ink">{t.matcher.skills2}</h3>
                        <dl className="mt-2 space-y-3">
                          <Detail term={t.matcher.detailTradeCertificate}>
                            {result.skillCompetencyRequirements.tradeCertificationNeeded}
                          </Detail>
                          <Detail term={t.matcher.detailLanguage}>
                            {result.skillCompetencyRequirements.languageProficiencyRequired}
                          </Detail>
                          <Detail term={t.matcher.detailPracticalTest}>
                            {result.skillCompetencyRequirements.practicalSkillsAssessment}
                          </Detail>
                          <Detail term={t.matcher.detailMinimumExperience}>
                            {result.skillCompetencyRequirements.minimumExperienceStandard}
                          </Detail>
                        </dl>
                      </div>
                    )}

                    {result.backgroundImpact && (
                      <div>
                        <h3 className="font-serif text-title text-ink">{t.matcher.background}</h3>
                        <p className="mt-1.5 text-body-s text-ink-muted">{result.backgroundImpact}</p>
                      </div>
                    )}
                  </div>
                </Disclosure>
              )}

              {/* Group 5: longer term -------------------------------------- */}
              {result.futureOpportunitiesAndCareer && (
                <Disclosure label={t.matcher.groupFutureTitle} summary={t.matcher.groupFutureSummary}>
                  <div>
                    <h3 className="flex items-center gap-2 font-serif text-title text-ink">
                      <TrendingUp className="h-4 w-4 text-navy" aria-hidden="true" />
                      {t.matcher.future}
                    </h3>
                    <dl className="mt-2 space-y-3">
                      <Detail term={t.matcher.detailResidency}>
                        {result.futureOpportunitiesAndCareer.permanentResidencyPathway}
                      </Detail>
                      <Detail term={t.matcher.detailFamilySponsorship}>
                        {result.futureOpportunitiesAndCareer.familySponsorshipEligibility}
                      </Detail>
                      <Detail term={t.matcher.detailSkillUpgrading}>
                        {result.futureOpportunitiesAndCareer.skillUpgradingOptions}
                      </Detail>
                      <Detail term={t.matcher.detailRemittance}>
                        {result.futureOpportunitiesAndCareer.legalRemittanceChannels}
                      </Detail>
                    </dl>
                  </div>
                </Disclosure>
              )}

              {/* What is still unsettled, at the foot of the record where a
                  reader arrives having read the whole of it. Neutral, not
                  `unknown`: the hatched unknown tone means "this was not
                  checked", and a standing limitation is not a grounding
                  state. The strip inside states the grounding. */}
              <Record label={t.matcher.resultKicker} title={t.disclaimer.short}>
                <p className="text-body-s text-ink-muted">{t.disclaimer.long}</p>
                <EvidenceStrip
                  lang={lang}
                  checked={t.matcher.checkedProfile}
                  source={
                    result.searchQueries && result.searchQueries.length > 0
                      ? t.evidence.liveSearch
                      : undefined
                  }
                  status={status}
                  asOf={assessedTime}
                />
              </Record>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
