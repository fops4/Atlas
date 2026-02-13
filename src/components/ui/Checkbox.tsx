import { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="sr-only peer"
            disabled={disabled}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={cn(
              'w-5 h-5 rounded border-2 flex items-center justify-center',
              'transition-all duration-200 ease-in-out cursor-pointer',
              'peer-focus:ring-2 peer-focus:ring-brand-blue peer-focus:ring-offset-2',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              error
                ? 'border-red-500 peer-checked:bg-red-500 peer-checked:border-red-500'
                : 'border-slate-300 peer-checked:bg-brand-blue peer-checked:border-brand-blue',
              'hover:border-slate-400 peer-checked:hover:bg-blue-700',
              className
            )}
          >
            <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
          </label>
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={checkboxId}
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

Checkbox.displayName = 'Checkbox';
