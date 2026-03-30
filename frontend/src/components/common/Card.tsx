import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-lowest rounded-xl p-6 shadow-ambient border ghost-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
