import React, { useRef, useState } from 'react';
import { ArrowRight, FileText, Info } from 'lucide-react';
import { Language } from '../../types';
import { useT } from '../../i18n/strings';
import { cn } from '../../lib/cn';
import { Button, EvidenceStrip, SeverityChip, StatusChip } from '../ui';
import { SAMPLE_FLAGS, TONE_ON_LIGHT } from './sampleOffer';
import { SectionHead } from './Band';
import { Reveal } from './motion';
import { useSceneContext } from './ScrollStory';

type StepId = 'offer' | 'findings' | 'next';

interface WorkedExampleProps {
  lang: Language;
  onAudit: () => void;
}

/**
 * The product demonstration: one invented offer carried through the auditor.
 *
 * The three steps are a real sequence — what arrived, what came back, what to
 * do — so they are numbered. The panel keeps a floor height: the steps differ
 * in length, and without one the page would jump every time a reader chose a
 * different step.
 */
export const WorkedExample: React.FC<WorkedExampleProps> = ({ lang, onAudit }) => {
  const t = useT(lang);
  const [step, setStep] = useState<StepId>('offer');
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const inScene = useSceneContext() !== null;

  const steps: Array<{ id: StepId; label: string; body: string }> = [
    { id: 'offer', label: t.home.sampleTabOffer, body: t.home.demoStep1Body },
    { id: 'findings', label: t.home.sampleTabFindings, body: t.home.demoStep2Body },
    { id: 'next', label: t.home.sampleTabNext, body: t.home.demoStep3Body },
  ];

  const lines = [
    t.home.sampleLine1,
    t.home.sampleLine2,
    t.home.sampleLine3,
    t.home.sampleLine4,
    t.home.sampleLine5,
    t.home.sampleFooter,
  ];

  const move = (index: number) => {
    const next = (index + steps.length) % steps.length;
    setStep(steps[next].id);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(index + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      move(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      move(steps.length - 1);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
      <Reveal className="min-w-0 lg:col-span-5">
        <SectionHead
          kicker={t.home.demoKicker}
          title={t.home.demoTitle}
          body={t.home.demoBody}
          size="lg"
        />

        <div
          role="tablist"
          aria-label={t.home.demoKicker}
          aria-orientation="vertical"
          className="mt-8 lg:mt-10"
        >
          {steps.map((item, index) => {
            const selected = item.id === step;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  refs.current[index] = el;
                }}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="worked-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setStep(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                // Every row carries the same 2px rule and only its colour
                // changes, so selecting a step never moves the list.
                className={cn(
                  'group flex w-full items-baseline gap-4 border-t-2 py-4 text-left transition-colors',
                  selected ? 'border-navy' : 'border-rule hover:border-rule-strong'
                )}
              >
                <span
                  className={cn(
                    'tabular font-mono text-label tracking-[0.08em] transition-colors',
                    selected ? 'text-navy' : 'text-ink-faint'
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      'block font-serif text-title transition-colors',
                      selected ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="mt-1 block text-body-s text-ink-muted">{item.body}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal className="min-w-0 lg:col-span-7 lg:h-full" delay={0.12} from="none">
        {/* Fills its column so the two halves of the section end together;
            the floor height keeps the shorter steps from collapsing it. */}
        <div
          id="worked-panel"
          role="tabpanel"
          aria-live="polite"
          // The floor height exists so that choosing a shorter step cannot
          // make the page jump under the reader. On the pinned stage there is
          // no page to jump: the panel is inside a scene of fixed height and
          // the layout around it cannot move, so the floor buys nothing and
          // costs the scene about 120px of dead panel. Dropped there, kept
          // everywhere else.
          className={cn(
            'flex flex-col rounded-record border border-rule bg-surface lg:h-full',
            !inScene && 'min-h-[30rem] sm:min-h-[27rem]'
          )}
        >
          {/* Provenance sits in the panel's own header, ahead of the content,
              so it is read before anything that could look like a result. */}
          <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-rule px-4 py-3 sm:px-6">
            <h3 className="font-mono text-label uppercase tracking-[0.1em] text-ink-faint">
              {t.home.sampleLabel}
            </h3>
            <StatusChip status="preliminary" lang={lang} />
          </header>

          {/* Each step's provenance line is pushed to the panel's bottom edge,
              so the space left by a shorter step reads as composition rather
              than as a block that failed to fill. */}
          <div key={step} className="animate-fadeIn flex flex-1 flex-col px-4 py-5 sm:px-6 sm:py-6">
            {step === 'offer' && (
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-3 border-b border-rule pb-4">
                  <FileText className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                  <p className="min-w-0 font-mono text-label uppercase tracking-[0.08em] text-ink-faint">
                    {t.home.sampleSender} · {t.home.sampleTime}
                  </p>
                </div>

                {/* The same three lines the hero marks, from the same source of
                    truth, so the two demonstrations can never disagree. */}
                <ul className="mt-4 space-y-px">
                  {lines.map((line, index) => {
                    const tone = SAMPLE_FLAGS.get(index);
                    const toneStyle = tone ? TONE_ON_LIGHT[tone] : null;
                    return (
                      <li key={line} className="flex gap-3 py-1.5">
                        <span
                          aria-hidden="true"
                          className={cn(
                            'w-0.5 shrink-0 rounded-full',
                            toneStyle ? toneStyle.rule : 'bg-transparent'
                          )}
                        />
                        <span
                          className={cn(
                            'min-w-0 text-body',
                            tone ? 'font-medium text-ink' : 'text-ink-muted'
                          )}
                        >
                          {line}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-auto flex items-start gap-2.5 border-t border-rule pt-4 text-body-s text-ink-faint">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{t.home.sampleCaption}</span>
                </p>
              </div>
            )}

            {step === 'findings' && (
              <div className="flex flex-1 flex-col">
                <SeverityChip tone="alert" label={t.home.sampleFindingCount} />
                <h4 className="mt-3 font-serif text-title text-ink">
                  {t.home.sampleFindingTitle}
                </h4>
                <p className="mt-2 max-w-[62ch] text-body text-ink-muted">
                  {t.home.sampleFindingBody}
                </p>
                {/* No official source was retrieved for an invented message, so
                    the check is labelled as unfinished rather than confirmed. */}
                <div className="mt-auto">
                  <EvidenceStrip
                    lang={lang}
                    checked={t.home.sampleChecked}
                    source={t.home.sampleSource}
                    status="insufficient-evidence"
                  />
                </div>
              </div>
            )}

            {step === 'next' && (
              <div className="flex flex-1 flex-col">
                <h4 className="font-serif text-title text-ink">{t.home.sampleNextTitle}</h4>
                <ol className="mt-4">
                  {[t.home.sampleNext1, t.home.sampleNext2, t.home.sampleNext3].map(
                    (item, index) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-3 border-t border-rule py-3 last:border-b"
                      >
                        <span className="tabular font-mono text-label text-navy">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0 text-body text-ink">{item}</span>
                      </li>
                    )
                  )}
                </ol>

                <div className="mt-6">
                  <Button variant="secondary" onClick={onAudit}>
                    <span>{t.home.sampleAnalyseCta}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

                <p className="mt-auto border-t border-rule pt-4 text-body-s text-ink-muted">
                  {t.disclaimer.short}
                </p>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
};
