import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'active:scale-[0.98]',
      'cursor-pointer'
    );
    
    const variants = {
      primary: cn(
        'bg-brand-blue text-white shadow-sm',
        'hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md',
        'focus:ring-brand-blue',
        'disabled:hover:translate-y-0 disabled:hover:shadow-sm'
      ),
      secondary: cn(
        'bg-slate-100 text-slate-700 shadow-sm',
        'hover:bg-slate-200 hover:-translate-y-0.5 hover:shadow-md',
        'focus:ring-slate-400',
        'disabled:hover:translate-y-0 disabled:hover:shadow-sm'
      ),
      outline: cn(
        'bg-transparent border-2 border-slate-300 text-slate-700',
        'hover:bg-slate-50 hover:border-slate-400 hover:-translate-y-0.5',
        'focus:ring-slate-400',
        'disabled:hover:translate-y-0 disabled:hover:bg-transparent'
      ),
      ghost: cn(
        'bg-transparent text-slate-600',
        'hover:bg-slate-100 hover:-translate-y-0.5',
        'focus:ring-slate-400',
        'disabled:hover:translate-y-0 disabled:hover:bg-transparent'
      ),
      danger: cn(
        'bg-red-600 text-white shadow-sm',
        'hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md',
        'focus:ring-red-500',
        'disabled:hover:translate-y-0 disabled:hover:shadow-sm'
      )
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const iconSize = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner size="sm" />}
        {!isLoading && leftIcon && (
          <span className={cn(iconSize[size], 'flex-shrink-0')} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{isLoading && loadingText ? loadingText : children}</span>
        {!isLoading && rightIcon && (
          <span className={cn(iconSize[size], 'flex-shrink-0')} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
