import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      description,
      error,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className="sr-only peer"
            disabled={disabled}
            {...props}
          />
          <label
            htmlFor={radioId}
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              'transition-all duration-200 ease-in-out cursor-pointer',
              'peer-focus:ring-2 peer-focus:ring-brand-blue peer-focus:ring-offset-2',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              error
                ? 'border-red-500'
                : 'border-slate-300 peer-checked:border-brand-blue',
              'hover:border-slate-400',
              className
            )}
          >
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all duration-200',
                error
                  ? 'peer-checked:bg-red-500'
                  : 'peer-checked:bg-brand-blue',
                'scale-0 peer-checked:scale-100'
              )}
            />
          </label>
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={radioId}
                className={cn(
                  'block text-sm font-medium cursor-pointer',
                  error ? 'text-red-700' : 'text-slate-700',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
            {error && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-3', className)} role="radiogroup">
        {children}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
