import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: 'success' | 'pending' | 'error' | 'neutral';
  children: React.ReactNode;
}

export function Badge({ className, status = 'neutral', children, ...props }: BadgeProps) {
  const statusStyles = {
    success: 'bg-primary-container text-on-primary-container',
    pending: 'bg-secondary-container text-on-secondary-container',
    error: 'bg-error-container text-on-error-container',
    neutral: 'bg-surface-variant text-on-surface',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider',
        statusStyles[status],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
