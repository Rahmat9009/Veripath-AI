import React, { useRef, useState } from 'react';
import { AuditResult, Language } from '../types';
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CircleCheck,
  ExternalLink,
  FileText,
  FileUp,
  Quote,
  ShieldAlert,
  Upload,
  X,
} from 'lucide-react';
import { useT } from '../i18n/strings';
import {
  assessedAt,
  groundingStatus,
  registryDisplay,
  severityTone,
  statusLabel,
  verdictDisplay,
} from '../lib/status';
import { apiFetch } from '../lib/api';
import { cn } from '../lib/cn';
import { useResultOutcome } from '../hooks/useResultOutcome';
import {
  BackendUnavailable,
  Button,
  Callout,
  EmptyState,
  EvidenceStrip,
  Field,
  FieldGrid,
  FieldRow,
  FormSection,
  PageHeader,
  Record,
  SeverityChip,
  SkeletonRecord,
  StatusChip,
  controlClass,
} from './ui';
import { toneSurface, toneText } from './ui/tone';

interface DocumentAuditorProps {
  lang: Language;
}

interface UploadedFile {
  id: string;
  name: string;
  data: string;
}

type Phase = 'idle' | 'loading' | 'result' | 'unavailable';

/**
 * What the frontend can actually turn into something the audit API can read:
 * an image or a PDF sent as base64, or plain text sent as text.
 *
 * Anything else is refused before a `FileReader` touches it. `.doc` and
 * `.docx` used to be advertised in the file picker and then read with
 * `readAsText`, which produced binary noise in the visible textarea and sent
 * it to be analysed as if it were the document's wording.
 */
const isSupportedFile = (file: File) =>
  file.type.startsWith('image/') ||
  file.type === 'application/pdf' ||
  file.type === 'text/plain' ||
  (!file.type && /\.txt$/i.test(file.name));

/**
 * What is sent as the document's wording when the reader attached scans and
 * typed nothing: a note naming the attachments, so the request carries a
 * description of what it holds.
 *
 * It used to be written into the visible textarea the moment a file was
 * chosen, which put machine bookkeeping in a box labelled "paste the text" and
 * overwrote whatever the reader had already typed there. It is composed here,
 * at the moment of sending, and the textarea stays theirs. What reaches the
 * API is unchanged.
 */
const attachmentNote = (files: { name: string }[]) =>
  `[ATTACHED PAPERS (${files.length}): ${files
    .map((file) => file.name)
    .join(', ')}] Multimodal visual scan(s) attached for combined AI analysis.`;

export const DocumentAuditor: React.FC<DocumentAuditorProps> = ({ lang }) => {
  const t = useT(lang);

  const [documentText, setDocumentText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [assessedTime, setAssessedTime] = useState('');
  /** Files the picker offered but this frontend cannot read. */
  const [rejectedNames, setRejectedNames] = useState<string[]>([]);
  /** Whether something is currently being dragged over the drop zone. */
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const runAudit = async () => {
    const typed = documentText.trim();
    if (!typed && uploadedFiles.length === 0) return;

    const text = typed || attachmentNote(uploadedFiles);

    setPhase('loading');
    setResult(null);

    try {
      const response = await apiFetch('/api/audit-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: text,
          filesData: uploadedFiles.map((f) => ({ name: f.name, data: f.data })),
        }),
      });

      if (!response.ok) throw new Error('Audit request failed');

      const data: AuditResult = await response.json();
      setResult(data);
      setAssessedTime(assessedAt());
      setPhase('result');
    } catch (err) {
      // Previously this failed silently and the button simply stopped spinning.
      console.error('Audit request failed:', err);
      setPhase('unavailable');
    }
  };

  const removeFile = (id: string) => setUploadedFiles((prev) => prev.filter((f) => f.id !== id));

  const clearFiles = () => {
    setUploadedFiles([]);
    setRejectedNames([]);
  };

  const handleFiles = (fileList: FileList | null) => {
    const chosen = Array.from(fileList || []);
    if (chosen.length === 0) return;

    // Word documents are ZIP archives and legacy .doc is a compound binary.
    // Neither can be read as text, and the previous code did exactly that —
    // dumping the archive header into the textarea and posting it for
    // analysis. Nothing the frontend cannot represent is allowed through.
    const files = chosen.filter(isSupportedFile);
    const rejected = chosen.filter((file) => !isSupportedFile(file));
    setRejectedNames(rejected.map((file) => file.name));
    if (files.length === 0) return;

    const collected: UploadedFile[] = [];
    let pending = files.length;

    // A file that cannot be read still has to settle, or a single unreadable
    // file in a batch would leave the whole batch permanently pending.
    const settle = () => {
      pending -= 1;
      if (pending > 0) return;
      setUploadedFiles((prev) => [...prev, ...collected]);
    };

    files.forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const reader = new FileReader();
      reader.onerror = settle;

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          if (base64) collected.push({ id, name: file.name, data: base64 });
          settle();
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = (event) => {
          const text = event.target?.result as string;
          if (text) {
            const encoded = 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(text)));
            collected.push({ id, name: file.name, data: encoded });
            // The wording of a text file belongs in the box the reader can
            // read and edit — but never over something they typed themselves.
            setDocumentText((prev) => (prev.trim() ? prev : text));
          }
          settle();
        };
        reader.readAsText(file);
      }
    });
  };

  const canSubmit = documentText.trim().length > 0 || uploadedFiles.length > 0;
  const status = result ? groundingStatus(result.searchQueries) : 'insufficient-evidence';
  // The verdict is read *through* the grounding status, so a result with no
  // retrieved source can never be presented as a clean one.
  const verdict = result
    ? verdictDisplay(result.authenticity?.verdict, result.riskLevel, status)
    : null;
  const registry = result ? registryDisplay(result.verification?.registryVerificationStatus) : null;

  // What the live region says once the request has settled. Deliberately a
  // sentence about the outcome rather than the outcome itself: the result is
  // several records long and a reader should be told it has arrived, then
  // read it at their own pace.
  const outcomeMessage =
    phase === 'result' && verdict
      ? `${t.common.resultReady} ${t.auditor[verdict.key]}. ${statusLabel(status, lang)}.`
      : phase === 'unavailable'
        ? `${t.states.backendUnavailableTitle}. ${t.states.backendUnavailableBody}`
        : '';

  useResultOutcome(resultRef, phase === 'result' || phase === 'unavailable');

  const severityLabel = (severity: 'HIGH' | 'MEDIUM' | 'LOW') =>
    severity === 'HIGH' ? t.auditor.severityHigh : severity === 'MEDIUM' ? t.auditor.severityMedium : t.auditor.severityLow;

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        lang={lang}
        kicker={t.auditor.kicker}
        title={t.auditor.title}
        intro={t.auditor.intro}
        showDisclaimer
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* ---------------------------------------------------------------- */}
        {/* Input                                                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="min-w-0 lg:col-span-5">
          {/* A form rather than a button with a click handler, so Enter from
              inside the panel does what Enter does everywhere else, and the
              disabled state during a request is the only submit path. */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void runAudit();
            }}
            className="min-w-0 rounded-record border border-rule bg-surface"
          >
            <FormSection step="01" legend={t.auditor.inputTitle} note={t.auditor.inputHint}>
              <Field label={t.auditor.textLabel}>
                {(props) => (
                  <textarea
                    {...props}
                    rows={8}
                    className={cn(controlClass, 'font-mono text-data leading-relaxed')}
                    placeholder={t.auditor.textPlaceholder}
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                  />
                )}
              </Field>
            </FormSection>

            <FormSection step="02" legend={t.auditor.uploadLabel}>
              {/* The button inside the zone is the control; this input is only
                  the mechanism behind it. `sr-only` hides it visually but
                  leaves it in the tab order, so a keyboard user met an
                  invisible, unlabelled stop immediately before the button that
                  does the same thing. Taken out of the tab order and out of
                  the accessibility tree, it is reachable only the way it is
                  meant to be. The drop zone around it adds no second stop —
                  dragging is a pointer affordance, and the button is the whole
                  of the keyboard path. */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.pdf,image/*"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }}
              />

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  if (!dragging) setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  handleFiles(event.dataTransfer.files);
                }}
                className={cn(
                  'rounded-record border border-dashed px-4 py-6 text-center transition-colors',
                  dragging ? 'border-navy bg-navy-tint' : 'border-rule-strong bg-paper'
                )}
              >
                <FileUp className="mx-auto h-6 w-6 text-ink-faint" aria-hidden="true" />
                <p className="mt-2 text-body-s text-ink-muted">{t.auditor.dropHint}</p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  <span>{t.auditor.uploadCta}</span>
                </Button>
                {/* Only what this frontend can actually read is named here. */}
                <p className="mt-3 text-body-s text-ink-faint">{t.auditor.uploadHint}</p>
              </div>

              {/* Refused files are named, so it is clear which ones were
                  dropped and why — silence would read as the upload simply
                  not working. */}
              {rejectedNames.length > 0 && (
                <Callout tone="caution" icon={AlertTriangle}>
                  <p>
                    {t.auditor.unsupportedFile} {rejectedNames.join(', ')}
                  </p>
                  <p className="mt-1">{t.auditor.supportedFiles}</p>
                </Callout>
              )}

              {uploadedFiles.length > 0 && (
                <div className="rounded-control border border-rule bg-paper p-3">
                  <div className="flex flex-wrap items-center justify-between gap-x-3">
                    <p className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                      {t.auditor.attached} ({uploadedFiles.length})
                    </p>
                    <button
                      type="button"
                      onClick={clearFiles}
                      className="min-h-[2.75rem] text-body-s font-medium text-navy underline underline-offset-2"
                    >
                      {t.auditor.clearAll}
                    </button>
                  </div>
                  <ul className="mt-1 space-y-1">
                    {uploadedFiles.map((file) => (
                      <li key={file.id} className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2 text-body-s text-ink">
                          <FileText className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                          <span className="truncate">{file.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          aria-label={`${t.auditor.removeFile} ${file.name}`}
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-navy-tint hover:text-navy"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </FormSection>

            <div className="border-t border-rule px-4 py-5 sm:px-6">
              <Button type="submit" fullWidth disabled={phase === 'loading' || !canSubmit}>
                {phase === 'loading' ? t.auditor.submitting : t.auditor.submit}
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

          {phase === 'idle' && (
            <EmptyState lang={lang} icon={FileText} title={t.auditor.emptyTitle} body={t.auditor.emptyBody} />
          )}

          {phase === 'loading' && (
            <SkeletonRecord lang={lang} message={t.auditor.submitting} detail={t.auditor.loadingDetail} lines={5} />
          )}

          {phase === 'unavailable' && <BackendUnavailable lang={lang} onRetry={() => void runAudit()} />}

          {phase === 'result' && result && verdict && (
            <div className="space-y-6 animate-fadeIn">
              {/* 1 · Assessment, and what it rests on ---------------------- */}
              <Record
                label={t.auditor.assessmentLabel}
                title={t.auditor[verdict.key]}
                action={<StatusChip status={status} lang={lang} />}
                tone={verdict.tone}
              >
                <div className="space-y-4">
                  {/* When nothing could be compared, the note says so rather
                      than explaining the scope of a comparison that did not
                      happen. */}
                  {verdict.key === 'verdictInsufficient' ? (
                    <Callout tone="unknown" icon={AlertTriangle}>
                      {t.auditor.verdictInsufficientNote}
                    </Callout>
                  ) : (
                    <Callout tone="neutral">{t.auditor.verdictNote}</Callout>
                  )}

                  {(result.authenticity?.realVsFakeExplanation || result.auditSummary) && (
                    <p className="text-body text-ink-muted">
                      {result.authenticity?.realVsFakeExplanation || result.auditSummary}
                    </p>
                  )}

                  {/* The two numbers, kept together on one subordinate line
                      beneath the words. They are the AI's own arithmetic, so
                      they are set as measurements — never as the headline, and
                      never as a dial, which would read as a score the document
                      had passed. */}
                  <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-rule pt-3">
                    <p className="min-w-0">
                      <span className="block font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                        {t.auditor.riskIndicator}
                      </span>
                      <span className="tabular mt-0.5 block font-mono text-data text-ink-muted">
                        {result.overallRiskScore ?? '—'} / 100
                      </span>
                    </p>
                    <p className="min-w-0">
                      <span className="block font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                        {t.auditor.authenticityIndicator}
                      </span>
                      <span className="tabular mt-0.5 block font-mono text-data text-ink-muted">
                        {result.authenticity?.authenticityScore !== undefined
                          ? `${result.authenticity.authenticityScore} / 100`
                          : '—'}
                      </span>
                    </p>
                  </div>
                  <p className="text-body-s text-ink-faint">{t.auditor.indicatorNote}</p>

                  {(result.authenticity?.fakeIndicatorsDetected?.length ||
                    result.authenticity?.genuineIndicatorsDetected?.length) && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {result.authenticity?.fakeIndicatorsDetected?.length > 0 && (
                        <div>
                          <p className="font-mono text-label uppercase tracking-[0.08em] text-alert">
                            {t.auditor.fakeSignals}
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {result.authenticity.fakeIndicatorsDetected.map((item) => (
                              <li key={item} className="text-body-s text-ink-muted">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.authenticity?.genuineIndicatorsDetected?.length > 0 && (
                        <div>
                          <p className="font-mono text-label uppercase tracking-[0.08em] text-verified">
                            {t.auditor.genuineSignals}
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {result.authenticity.genuineIndicatorsDetected.map((item) => (
                              <li key={item} className="text-body-s text-ink-muted">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <EvidenceStrip
                    lang={lang}
                    checked={t.auditor.checkedClaims}
                    source={
                      result.searchQueries && result.searchQueries.length > 0
                        ? t.evidence.liveSearch
                        : undefined
                    }
                    status={status}
                    asOf={assessedTime}
                  />
                </div>
              </Record>

              {/* 2 · Findings --------------------------------------------- */}
              {/* Each one is read as a chain rather than a paragraph: the
                  wording that was objected to, what it was read against, what
                  VeriPath concluded, and what the reader should confirm. The
                  same four beats as the evidence chain on About, stated as a
                  description list because here they are the parts of a single
                  finding rather than stages of a process. Where a link is
                  missing — no quotation, no named rule — the row is absent, so
                  a thin finding looks thin. */}
              {result.flags?.length > 0 && (
                <Record label={t.auditor.flagsTitle}>
                  <ul className="space-y-5">
                    {result.flags.map((flag, index) => (
                      <li
                        key={`${flag.title}-${index}`}
                        className={cn(
                          'rounded-control border border-l-2 p-4',
                          toneSurface[severityTone(flag.severity)]
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="min-w-0 font-medium text-ink">{flag.title}</p>
                          <SeverityChip
                            tone={severityTone(flag.severity)}
                            label={severityLabel(flag.severity)}
                            icon={flag.severity === 'HIGH' ? ShieldAlert : AlertTriangle}
                          />
                        </div>

                        <dl className="mt-3 space-y-2.5">
                          {flag.clauseSnippet && (
                            <ChainLink label={t.auditor.quotedText} icon={Quote}>
                              <blockquote className="border-l-2 border-rule-strong bg-surface/70 px-3 py-1.5 font-mono text-data text-ink">
                                {flag.clauseSnippet}
                              </blockquote>
                            </ChainLink>
                          )}

                          {flag.category && (
                            <ChainLink label={t.auditor.flagRule}>
                              <span className="text-body-s text-ink-muted">{flag.category}</span>
                            </ChainLink>
                          )}

                          <ChainLink label={t.auditor.flagFinding}>
                            <span className="text-body-s text-ink-muted">{flag.description}</span>
                          </ChainLink>

                          {flag.recommendation && (
                            <ChainLink label={t.auditor.whatToDo}>
                              <span className="text-body-s text-ink">{flag.recommendation}</span>
                            </ChainLink>
                          )}
                        </dl>
                      </li>
                    ))}
                  </ul>
                </Record>
              )}

              {/* 3 · Evidence used ---------------------------------------- */}
              {result.verification && registry && (
                <Record
                  label={t.auditor.verificationTitle}
                  action={
                    <SeverityChip
                      tone={registry.tone}
                      label={t.auditor[registry.key]}
                      icon={registry.tone === 'verified' ? CircleCheck : AlertTriangle}
                    />
                  }
                  tone={registry.tone}
                >
                  <div className="space-y-4">
                    <Callout tone="neutral">{t.auditor.registryNote}</Callout>

                    {result.verification.companySearchSummary && (
                      <p className="text-body-s text-ink-muted">{result.verification.companySearchSummary}</p>
                    )}

                    {result.searchQueries && result.searchQueries.length > 0 && (
                      <div>
                        <p className="font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                          {t.auditor.searchedWith}
                        </p>
                        <p className="mt-1 break-words font-mono text-data text-ink-muted">
                          {result.searchQueries.join(' · ')}
                        </p>
                      </div>
                    )}

                    {result.verification.officialVerificationLinks?.length > 0 && (
                      <div>
                        <h3 className="font-serif text-title text-ink">{t.auditor.portalsTitle}</h3>
                        <ul className="mt-2 space-y-2">
                          {result.verification.officialVerificationLinks.map((link) => (
                            <li key={link.url}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start justify-between gap-3 rounded-control border border-rule bg-paper p-3 transition-colors hover:border-navy"
                              >
                                <span className="min-w-0">
                                  <span className="block font-medium text-navy underline underline-offset-2">
                                    {link.portalName}
                                  </span>
                                  <span className="mt-0.5 block text-body-s text-ink-muted">
                                    {link.verificationInstruction}
                                  </span>
                                </span>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <EvidenceStrip
                      lang={lang}
                      checked={result.verification.companySearchSummary || t.auditor.verificationTitle}
                      source={
                        result.searchQueries && result.searchQueries.length > 0
                          ? t.evidence.liveSearch
                          : undefined
                      }
                      status={status}
                      asOf={assessedTime}
                    />
                  </div>
                </Record>
              )}

              {/* 4 · What the document is --------------------------------- */}
              {result.classification && (
                <Record
                  label={t.auditor.classificationTitle}
                  action={
                    result.classification.documentType ? (
                      <span className="rounded-full border border-rule bg-paper px-2.5 py-1 font-mono text-label uppercase text-ink-muted">
                        {result.classification.documentType}
                      </span>
                    ) : undefined
                  }
                >
                  <dl className="space-y-0">
                    <FieldRow label={t.auditor.whatIsIt} value={result.classification.whatIsThisPaper} />
                    <FieldRow label={t.auditor.whatItMeans} value={result.classification.whatDoesItMean} />
                    <FieldRow label={t.auditor.whatItIsFor} value={result.classification.whatIsItFor} />
                    {result.classification.issuingBody && (
                      <FieldRow label={t.auditor.issuingBody} value={result.classification.issuingBody} />
                    )}
                  </dl>
                </Record>
              )}

              {/* 5 · Details found ---------------------------------------- */}
              {result.elements && (
                <Record label={t.auditor.elementsTitle}>
                  <FieldGrid columns={2}>
                    <FieldRow
                      label={t.auditor.employer}
                      value={result.elements.employerOrCompany || t.common.notStated}
                    />
                    <FieldRow
                      label={t.auditor.candidate}
                      value={result.elements.candidateOrRecipient || t.common.notStated}
                    />
                    <FieldRow
                      label={t.auditor.jobTitle}
                      value={result.elements.jobTitleOrDesignation || t.common.notStated}
                    />
                    <FieldRow
                      label={t.auditor.salary}
                      mono
                      value={result.elements.salaryAndFinancials || t.common.notStated}
                    />
                    <FieldRow
                      label={t.auditor.fees}
                      mono
                      value={result.elements.demandedFeesOrCosts || t.common.notStated}
                    />
                    <FieldRow
                      label={t.auditor.licence}
                      mono
                      value={result.elements.licenseOrReferenceNumber || t.common.notStated}
                    />
                    <FieldRow
                      label={t.auditor.contact}
                      value={result.elements.contactDetails || t.common.notStated}
                    />
                    <FieldRow
                      label={t.auditor.issueDate}
                      mono
                      value={result.elements.issueOrValidityDate || t.common.notStated}
                    />
                  </FieldGrid>
                </Record>
              )}

              {/* 6 · Pay check -------------------------------------------- */}
              {result.salaryCheck?.comment && (
                <Callout
                  tone={result.salaryCheck.isRealistic ? 'neutral' : 'caution'}
                  icon={AlertTriangle}
                  title={t.auditor.salaryCheck}
                >
                  {result.salaryCheck.comment}
                </Callout>
              )}

              {/* 7 · Next steps ------------------------------------------- */}
              {result.recommendedActions?.length > 0 && (
                <Record label={t.auditor.actionsTitle}>
                  <ol className="space-y-3">
                    {result.recommendedActions.map((action, index) => (
                      <li key={action} className="flex gap-3 border-b border-rule pb-3 last:border-b-0 last:pb-0">
                        <span className={cn('tabular font-mono text-data', toneText.neutral)}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0 text-body text-ink-muted">{action}</span>
                      </li>
                    ))}
                  </ol>
                </Record>
              )}

              {result.officialRegistryAdvice && (
                <Callout tone="neutral" icon={Building2}>
                  {result.officialRegistryAdvice}
                </Callout>
              )}

              {/* 8 · Official sources ------------------------------------- */}
              {result.officialSourceLinks && result.officialSourceLinks.length > 0 && (
                <Record label={t.auditor.portalsTitle}>
                  <ul className="space-y-2">
                    {result.officialSourceLinks.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[2.75rem] items-center gap-1.5 text-body font-medium text-navy underline underline-offset-2"
                        >
                          <span>{link.name}</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </Record>
              )}

              {/* 9 · Limits ----------------------------------------------- */}
              {/* The last thing read, and the thing every record above is
                  qualified by: what a document check of this kind can and
                  cannot settle. Neutral, not `unknown`: the hatched unknown
                  tone means "this was not checked", and a standing limitation
                  is not a grounding state. The strip inside states the
                  grounding. */}
              <Record label={t.auditor.assessmentLabel} title={t.auditor.limitationsTitle}>
                <p className="text-body-s text-ink-muted">{t.auditor.verdictNote}</p>
                <EvidenceStrip
                  lang={lang}
                  checked={t.auditor.checkedClaims}
                  source={
                    result.searchQueries && result.searchQueries.length > 0
                      ? `${t.evidence.liveSearch}: ${result.searchQueries.join(' · ')}`
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

/**
 * One link of a finding's chain: a mono term in the margin and the thing it
 * names beside it. Below the breakpoint the term sits above its value, so a
 * narrow column never squeezes a quotation into a two-word gutter.
 */
const ChainLink: React.FC<{
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}> = ({ label, icon: Icon, children }) => (
  <div className="grid gap-1 border-t border-rule/70 pt-2.5 sm:grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] sm:gap-4">
    <dt className="flex items-center gap-1.5 font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
      {Icon && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
      {label}
    </dt>
    <dd className="min-w-0 break-words">{children}</dd>
  </div>
);
