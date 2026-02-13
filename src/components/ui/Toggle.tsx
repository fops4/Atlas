import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      className,
      label,
      description,
      size = 'md',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    const sizes = {
      sm: {
        track: 'w-9 h-5',
        thumb: 'w-3.5 h-3.5',
        translate: 'peer-checked:translate-x-4'
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-4 h-4',
        translate: 'peer-checked:translate-x-5'
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-5 h-5',
        translate: 'peer-checked:translate-x-7'
      }
    };

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            className="sr-only peer"
            disabled={disabled}
            role="switch"
            {...props}
          />
          <label
            htmlFor={toggleId}
            className={cn(
              'relative rounded-full cursor-pointer',
              'transition-all duration-200 ease-in-out',
              'peer-focus:ring-2 peer-focus:ring-brand-blue peer-focus:ring-offset-2',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              'bg-slate-300 peer-checked:bg-brand-blue',
              'hover:bg-slate-400 peer-checked:hover:bg-blue-700',
              sizes[size].track,
              className
            )}
          >
            <span
              className={cn(
                'absolute top-1 left-1 bg-white rounded-full',
                'transition-transform duration-200 ease-in-out',
                'shadow-sm',
                sizes[size].thumb,
                sizes[size].translate
              )}
            />
          </label>
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={toggleId}
                className={cn(
                  'block text-sm font-medium cursor-pointer text-slate-700',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
