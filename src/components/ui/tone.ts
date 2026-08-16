import { StatusTone } from '../../lib/status';

/**
 * Every tone renders as colour *and* shape, never colour alone. The `unknown`
 * tone additionally carries the hatch fill so "not checked" is distinguishable
 * from "checked and clear" at a glance and in greyscale.
 */
export const toneSurface: Record<StatusTone, string> = {
  verified: 'bg-verified-surface border-verified/35 text-ink',
  caution: 'bg-caution-surface border-caution/35 text-ink',
  alert: 'bg-alert-surface border-alert/35 text-ink',
  unknown: 'bg-unknown-surface border-unknown/35 text-ink hatch',
  neutral: 'bg-surface border-rule text-ink',
};

export const toneText: Record<StatusTone, string> = {
  verified: 'text-verified',
  caution: 'text-caution',
  alert: 'text-alert',
  unknown: 'text-unknown',
  neutral: 'text-navy',
};

export const toneBorder: Record<StatusTone, string> = {
  verified: 'border-verified',
  caution: 'border-caution',
  alert: 'border-alert',
  unknown: 'border-unknown',
  neutral: 'border-rule-strong',
};
