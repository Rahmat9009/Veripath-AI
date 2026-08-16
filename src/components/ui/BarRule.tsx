import React from 'react';
import { cn } from '../../lib/cn';

interface BarRuleProps {
  /** `dark` for navy grounds, where the navy bars need to lift off. */
  theme?: 'light' | 'dark';
  className?: string;
}

/**
 * Five vertical strokes echoing the shield in the VeriPath mark — the same
 * rhythm and the same two brand colours, at a scale where it reads as a rule
 * rather than a second logo. Marks the start of a section.
 */
export const BarRule: React.FC<BarRuleProps> = ({ theme = 'light', className }) => {
  const navy = theme === 'dark' ? '#7FA3D1' : '#153C6D';
  const bars: Array<{ h: number; fill: string }> = [
    { h: 10, fill: navy },
    { h: 16, fill: '#00C853' },
    { h: 22, fill: '#00C853' },
    { h: 16, fill: navy },
    { h: 10, fill: navy },
  ];

  return (
    <span className={cn('inline-flex items-center gap-[3px]', className)} aria-hidden="true">
      {bars.map((bar, index) => (
        <span
          key={index}
          className="block w-[3px] rounded-full"
          style={{ height: `${bar.h}px`, backgroundColor: bar.fill }}
        />
      ))}
    </span>
  );
};
