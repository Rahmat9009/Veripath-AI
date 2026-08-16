import React from 'react';
import { cn } from '../../lib/cn';
import { StatusTone } from '../../lib/status';
import { toneSurface, toneText } from './tone';

interface CalloutProps {
  tone?: StatusTone;
  icon?: React.ElementType;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** An inline note. Tone is semantic; there is no decorative variant. */
export const Callout: React.FC<CalloutProps> = ({
  tone = 'neutral',
  icon: Icon,
  title,
  children,
  className,
}) => (
  <div className={cn('flex min-w-0 gap-3 rounded-record border px-4 py-3', toneSurface[tone], className)}>
    {Icon && <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', toneText[tone])} aria-hidden="true" />}
    <div className="min-w-0 space-y-1">
      {title && <p className="font-medium text-body text-ink">{title}</p>}
      {children && <div className="text-body-s text-ink-muted">{children}</div>}
    </div>
  </div>
);
