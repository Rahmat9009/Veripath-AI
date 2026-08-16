import type React from 'react';
import { AlertTriangle, CircleAlert, CircleHelp } from 'lucide-react';
import { SAMPLE_CHECKS, SampleTone } from '../landing/sampleOffer';
import type { useT } from '../../i18n/strings';

/**
 * The hero's five checks, assembled from the shared sample definition.
 *
 * Structure comes from `sampleOffer.ts` and words come from the dictionary,
 * because only the words are translated. Held here rather than inside a
 * component so the tablist and the finding card read the same list and can
 * never disagree about which check produced which finding.
 *
 * None of the five outcomes is a pass. That is deliberate and load-bearing:
 * the sample offer is a bad offer, and a hero that showed a green VERIFIED
 * badge would be advertising a verification the product cannot perform.
 */

export type Outcome = SampleTone;

export interface HeroCheck {
  id: string;
  name: string;
  check: string;
  finding: string;
  outcome: Outcome;
  /** Index into the sample message, or null when the message is silent. */
  anchor: number | null;
  /** Upright height, from the mark's five-bar rhythm. */
  scale: number;
}

type Dict = ReturnType<typeof useT>;

/**
 * Marks for each outcome. `chip` is ink-side because the chip sits on a white
 * pill; `rule` and `dot` are the on-dark values, because they sit directly on
 * the navy stage where the ink-side tokens disappear.
 */
export const OUTCOME: Record<
  Outcome,
  { icon: React.ElementType; chip: string; rule: string; dot: string }
> = {
  warning: {
    icon: AlertTriangle,
    chip: 'text-alert',
    rule: 'bg-alert-on-dark',
    dot: 'text-alert-on-dark',
  },
  review: {
    icon: CircleAlert,
    chip: 'text-caution',
    rule: 'bg-caution-on-dark',
    dot: 'text-caution-on-dark',
  },
  insufficient: {
    icon: CircleHelp,
    chip: 'text-unknown',
    rule: 'bg-unknown-on-dark',
    dot: 'text-unknown-on-dark',
  },
};

export function buildChecks(t: Dict): HeroCheck[] {
  const names = [t.home.gate1Name, t.home.gate2Name, t.home.gate3Name, t.home.gate4Name, t.home.gate5Name];
  const details = [t.home.gate1Check, t.home.gate2Check, t.home.gate3Check, t.home.gate4Check, t.home.gate5Check];
  const findings = [
    t.home.gate1Finding,
    t.home.gate2Finding,
    t.home.gate3Finding,
    t.home.gate4Finding,
    t.home.gate5Finding,
  ];

  return SAMPLE_CHECKS.map((check, index) => ({
    ...check,
    name: names[index],
    check: details[index],
    finding: findings[index],
  }));
}

/** The approved label for an outcome. Never phrased any other way. */
export function outcomeLabel(t: Dict, outcome: Outcome): string {
  if (outcome === 'warning') return t.home.outcomeWarning;
  if (outcome === 'review') return t.home.outcomeReview;
  return t.home.outcomeInsufficient;
}
