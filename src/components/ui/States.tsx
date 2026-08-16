import React from 'react';
import { Language } from '../../types';
import { useT } from '../../i18n/strings';
import { AssessmentStatus } from '../../lib/status';
import { StatusChip } from './StatusChip';
import { Button } from './Button';
import { cn } from '../../lib/cn';

interface StateBlockProps {
  lang: Language;
  status?: AssessmentStatus;
  title: string;
  body?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
}

/** Shared shell for empty, unavailable and unsupported states. */
export const StateBlock: React.FC<StateBlockProps> = ({
  lang,
  status,
  title,
  body,
  icon: Icon,
  action,
  className,
}) => (
  <div
    className={cn(
      'rounded-record border border-unknown/35 bg-unknown-surface text-unknown hatch',
      'px-5 py-8 text-center sm:px-8',
      className
    )}
  >
    <div className="mx-auto max-w-md space-y-3">
      {Icon && <Icon className="mx-auto h-8 w-8 text-unknown" aria-hidden="true" />}
      {status && (
        <div className="flex justify-center">
          <StatusChip status={status} lang={lang} className="bg-surface" />
        </div>
      )}
      <h2 className="font-serif text-title text-ink">{title}</h2>
      {body && <p className="text-body-s text-ink-muted">{body}</p>}
      {action && <div className="flex justify-center pt-1">{action}</div>}
    </div>
  </div>
);

interface BackendUnavailableProps {
  lang: Language;
  onRetry?: () => void;
  className?: string;
}

/**
 * Shown whenever a request fails. VeriPath never fills the gap with invented
 * analysis — an unreachable service is reported as an unreachable service.
 */
export const BackendUnavailable: React.FC<BackendUnavailableProps> = ({ lang, onRetry, className }) => {
  const t = useT(lang);
  return (
    <StateBlock
      lang={lang}
      status="backend-unavailable"
      title={t.states.backendUnavailableTitle}
      body={t.states.backendUnavailableBody}
      action={
        onRetry ? (
          <Button variant="secondary" onClick={onRetry}>
            {t.common.retry}
          </Button>
        ) : undefined
      }
      className={className}
    />
  );
};

interface UnsupportedDestinationProps {
  lang: Language;
  destination?: string;
  className?: string;
}

export const UnsupportedDestination: React.FC<UnsupportedDestinationProps> = ({
  lang,
  destination,
  className,
}) => {
  const t = useT(lang);
  return (
    <StateBlock
      lang={lang}
      status="unsupported-destination"
      title={destination ? `${t.states.unsupportedTitle} — ${destination}` : t.states.unsupportedTitle}
      body={t.states.unsupportedBody}
      className={className}
    />
  );
};

interface EmptyStateProps {
  lang: Language;
  title?: string;
  body?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  /**
   * More than one way out. An empty result usually has a specific cause — one
   * filter too many — and offering only "clear everything" throws away the
   * work the reader has already done. Falls back to `action`, so every
   * existing call site is unaffected.
   */
  actions?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  lang,
  title,
  body,
  icon,
  action,
  actions,
  className,
}) => {
  const t = useT(lang);
  const footer = actions ?? action;
  return (
    <div
      className={cn(
        'rounded-record border border-rule bg-surface px-5 py-10 text-center sm:px-8',
        className
      )}
    >
      <div className="mx-auto max-w-md space-y-3">
        {icon && React.createElement(icon, { className: 'mx-auto h-8 w-8 text-ink-faint', 'aria-hidden': 'true' })}
        <h2 className="font-serif text-title text-ink">{title || t.states.emptyTitle}</h2>
        {body && <p className="text-body-s text-ink-muted">{body}</p>}
        {footer && <div className="flex flex-wrap justify-center gap-3 pt-1">{footer}</div>}
      </div>
    </div>
  );
};
