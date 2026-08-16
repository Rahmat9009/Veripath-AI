/**
 * The structural facts about the sample offer, in one place.
 *
 * The hero chamber and the worked example both mark the same lines of the same
 * invented message. Held here so the two can never disagree about which claim
 * is flagged or how — the strings themselves stay in the dictionary, because
 * they are translated and these are not.
 */

/** Outcomes a check can reach. None of them is "verified" — by design. */
export type SampleTone = 'warning' | 'review' | 'insufficient';

export interface SampleCheck {
  /** Keys the dictionary lookup: gate1Name … gate5Name follow this order. */
  id: string;
  outcome: SampleTone;
  /**
   * Index into the sample message's lines, or null when the check is about
   * something the message never says. Two of the five are null, and that is
   * the honest answer: the employer licence and the official source are
   * absent, not wrong.
   */
  anchor: number | null;
  /** Upright height in the hero gate, taken from the mark's five-bar rhythm. */
  scale: number;
}

export const SAMPLE_CHECKS: SampleCheck[] = [
  { id: 'fee', outcome: 'warning', anchor: 3, scale: 0.52 },
  { id: 'guarantee', outcome: 'warning', anchor: 1, scale: 0.74 },
  { id: 'deadline', outcome: 'review', anchor: 4, scale: 1 },
  { id: 'employer', outcome: 'review', anchor: null, scale: 0.74 },
  { id: 'source', outcome: 'insufficient', anchor: null, scale: 0.52 },
];

/** Line index → tone, for marking the message itself. Derived, not restated. */
export const SAMPLE_FLAGS = new Map<number, SampleTone>(
  SAMPLE_CHECKS.filter((c) => c.anchor !== null).map((c) => [c.anchor as number, c.outcome])
);

/** Marks and rules on a light ground. */
export const TONE_ON_LIGHT: Record<SampleTone, { text: string; rule: string }> = {
  warning: { text: 'text-alert', rule: 'bg-alert' },
  review: { text: 'text-caution', rule: 'bg-caution' },
  insufficient: { text: 'text-unknown', rule: 'bg-unknown' },
};

/** The same three meanings at values that read on the navy ground. */
export const TONE_ON_DARK: Record<SampleTone, { text: string; rule: string }> = {
  warning: { text: 'text-alert-on-dark', rule: 'bg-alert-on-dark' },
  review: { text: 'text-caution-on-dark', rule: 'bg-caution-on-dark' },
  insufficient: { text: 'text-unknown-on-dark', rule: 'bg-unknown-on-dark' },
};
