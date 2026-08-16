import React from 'react';
import { AlertTriangle, CircleAlert, CircleHelp, CircleCheck, Info, PlugZap } from 'lucide-react';
import { Language } from '../../types';
import { AssessmentStatus, StatusTone, statusLabel, statusTone } from '../../lib/status';
import { cn } from '../../lib/cn';

const ICONS: Record<AssessmentStatus, React.ElementType> = {
  preliminary: Info,
  'requires-confirmation': AlertTriangle,
  'needs-review': CircleAlert,
  'insufficient-evidence': CircleHelp,
  'backend-unavailable': PlugZap,
  'unsupported-destination': CircleHelp,
};

const CHIP: Record<StatusTone, string> = {
  verified: 'border-verified/45 bg-verified-surface text-verified',
  caution: 'border-caution/45 bg-caution-surface text-caution',
  alert: 'border-alert/45 bg-alert-surface text-alert',
  unknown: 'border-unknown/45 bg-unknown-surface text-unknown hatch',
  neutral: 'border-navy/30 bg-navy-tint text-navy',
};

interface StatusChipProps {
  status: AssessmentStatus;
  lang: Language;
  className?: string;
}

/**
 * The only way an AI conclusion may be labelled. Always icon + word + colour,
 * and the word always comes from the approved set.
 */
export const StatusChip: React.FC<StatusChipProps> = ({ status, lang, className }) => {
  const Icon = ICONS[status];
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1',
        'font-mono text-label uppercase tracking-[0.06em]',
        CHIP[statusTone(status)],
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{statusLabel(status, lang)}</span>
    </span>
  );
};

interface SeverityChipProps {
  tone: StatusTone;
  label: string;
  icon?: React.ElementType;
  className?: string;
}

/** For document findings, which describe the paperwork rather than the AI. */
export const SeverityChip: React.FC<SeverityChipProps> = ({ tone, label, icon: Icon, className }) => (
  <span
    className={cn(
      'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1',
      'font-mono text-label uppercase tracking-[0.06em]',
      CHIP[tone],
      className
    )}
  >
    {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
    <span>{label}</span>
  </span>
);
