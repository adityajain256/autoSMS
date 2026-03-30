import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 focus-within:text-primary">
        {label && (
          <label className="text-sm font-semibold text-on-surface truncate">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-on-surface-variant/70">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-surface-lowest h-12 px-4 rounded transition-all outline-none",
              /* Base styling: 20% opacity outline variant */
              "border border-outline-variant/20 shadow-sm",
              /* Focus state: bottom border thickens to 2px primary, though we 
                 emulate it nicely here with outline or overriding border */
              "focus:border-primary focus:border-b-2 hover:border-outline-variant/40",
              /* Icons padding */
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              /* Error styling */
              error && "border-error focus:border-error focus:border-b-2",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-on-surface-variant/70">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-error font-medium">{error}</span>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
