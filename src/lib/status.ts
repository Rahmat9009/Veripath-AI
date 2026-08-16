import { Language } from '../types';

/**
 * The closed set of statuses VeriPath is allowed to show for anything the AI
 * produced. Nothing in the interface may describe an AI result in other terms:
 * no "verified", no "authentic", no "guaranteed".
 */
export type AssessmentStatus =
  | 'preliminary'
  | 'requires-confirmation'
  | 'needs-review'
  | 'insufficient-evidence'
  | 'backend-unavailable'
  | 'unsupported-destination';

/** Visual weight of a status. `unknown` additionally renders with a hatch fill. */
export type StatusTone = 'verified' | 'caution' | 'alert' | 'unknown' | 'neutral';

interface StatusDefinition {
  tone: StatusTone;
  en: string;
  bn: string;
}

const STATUS: Record<AssessmentStatus, StatusDefinition> = {
  preliminary: {
    tone: 'neutral',
    en: 'Preliminary AI assessment',
    bn: 'প্রাথমিক এআই মূল্যায়ন',
  },
  'requires-confirmation': {
    tone: 'caution',
    en: 'Requires official confirmation',
    bn: 'সরকারি নিশ্চিতকরণ প্রয়োজন',
  },
  'needs-review': {
    tone: 'caution',
    en: 'Needs human review',
    bn: 'মানুষের পর্যালোচনা প্রয়োজন',
  },
  'insufficient-evidence': {
    tone: 'unknown',
    en: 'Insufficient evidence',
    bn: 'পর্যাপ্ত প্রমাণ নেই',
  },
  'backend-unavailable': {
    tone: 'unknown',
    en: 'Backend unavailable',
    bn: 'ব্যাকএন্ড উপলব্ধ নয়',
  },
  'unsupported-destination': {
    tone: 'unknown',
    en: 'Unsupported destination',
    bn: 'এই গন্তব্য সমর্থিত নয়',
  },
};

export function statusLabel(status: AssessmentStatus, lang: Language): string {
  return lang === 'bn' ? STATUS[status].bn : STATUS[status].en;
}

export function statusTone(status: AssessmentStatus): StatusTone {
  return STATUS[status].tone;
}

/**
 * Risk findings describe the document, not the AI's confidence, so they carry
 * their own severity scale alongside an assessment status.
 */
export type Severity = 'HIGH' | 'MEDIUM' | 'LOW';

export function severityTone(severity: Severity): StatusTone {
  if (severity === 'HIGH') return 'alert';
  if (severity === 'MEDIUM') return 'caution';
  return 'verified';
}

/**
 * The server returns a grounded result and a rule-based fallback in the same
 * shape, with no flag to tell them apart. The presence of `searchQueries` is
 * the only available signal that live sources were consulted, so it decides
 * whether a result may claim any source at all.
 */
export function groundingStatus(searchQueries?: string[]): AssessmentStatus {
  return searchQueries && searchQueries.length > 0 ? 'requires-confirmation' : 'insufficient-evidence';
}

/** Destinations the Profile Matcher form actually offers. */
export const SUPPORTED_DESTINATIONS = [
  'Italy (Flussi Seasonal & Work)',
  'Qatar (Construction & Hospitality)',
  'Saudi Arabia (General & Skilled Work)',
  'United Arab Emirates (Employment & Service)',
  'Malaysia (Manufacturing & Services)',
  'Singapore (Construction & Marine)',
  'South Korea (EPS Skilled Work)',
  'Japan (TITP & SSW Worker)',
  'United Kingdom (Skilled Worker)',
  'Canada (Express Entry / PNP)',
  'Germany (Opportunity Card / Skilled)',
  'Romania / EU Work Permit',
] as const;

export function isSupportedDestination(destination: string): boolean {
  return SUPPORTED_DESTINATIONS.some((d) => d === destination);
}

/**
 * The audit API returns determinations — "VERIFIED REAL", "FOUND & VALID".
 * VeriPath is not entitled to state those as facts, so the raw value is kept
 * for the tone only and the interface renders a reframed phrase instead.
 * These map API values onto translation keys; the wording lives in the
 * dictionary so both languages stay in step.
 */
export type VerdictKey =
  | 'verdictNoConflicts'
  | 'verdictFewConflicts'
  | 'verdictConflicts'
  | 'verdictSerious'
  | 'verdictInsufficient';

/**
 * The verdict a result is presented under, subordinate to how well grounded
 * that result is.
 *
 * The order of the branches is the whole point. A warning is stated whatever
 * the evidence, because a warning costs the reader caution and nothing else.
 * Reassurance is stated only when a source was actually retrieved: without
 * one there is nothing to have found "no conflicts" *against*, and saying so
 * would be the interface claiming more than it knows.
 *
 * `grounding` is required rather than optional on purpose. As an optional
 * parameter a call site that forgot it would silently get the old behaviour,
 * which was to fall through to the most reassuring state — the exact failure
 * this exists to prevent. Omitting it is now a type error.
 */
export function verdictDisplay(
  verdict: string | undefined,
  riskLevel: string | undefined,
  grounding: AssessmentStatus
): { key: VerdictKey; tone: StatusTone } {
  const value = verdict || '';

  // Risk findings are never suppressed for want of a source.
  if (value === 'HIGH RISK FAKE' || riskLevel === 'CRITICAL') {
    return { key: 'verdictSerious', tone: 'alert' };
  }
  if (value === 'SUSPICIOUS / UNVERIFIED' || riskLevel === 'MODERATE') {
    return { key: 'verdictConflicts', tone: 'caution' };
  }

  // Everything below this line is a form of reassurance, so it requires
  // evidence. `requires-confirmation` is the only status that means a source
  // was reached; anything else — insufficient evidence, an unreachable
  // service, a status added later — is not enough to reassure anyone.
  if (grounding !== 'requires-confirmation') {
    return { key: 'verdictInsufficient', tone: 'unknown' };
  }

  if (value === 'PROBABLY LEGITIMATE') {
    return { key: 'verdictFewConflicts', tone: 'caution' };
  }
  return { key: 'verdictNoConflicts', tone: 'verified' };
}

export type RegistryKey =
  | 'registryMatched'
  | 'registryNotFound'
  | 'registryFlagged'
  | 'registryManual';

export function registryDisplay(status?: string): { key: RegistryKey; tone: StatusTone } {
  switch (status) {
    case 'FOUND & VALID':
      return { key: 'registryMatched', tone: 'verified' };
    case 'UNREGISTERED / NOT FOUND':
      return { key: 'registryNotFound', tone: 'alert' };
    case 'WARNING / BLACKLISTED':
      return { key: 'registryFlagged', tone: 'alert' };
    default:
      return { key: 'registryManual', tone: 'unknown' };
  }
}

/** Timestamp for evidence strips: "13 Aug 2026 · 14:02". */
export function assessedAt(date: Date = new Date()): string {
  const day = date.getDate();
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${month} ${year} · ${time}`;
}
