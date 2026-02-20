import { AnchorHTMLAttributes, forwardRef } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { cn } from '../../lib/utils';

export interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  to?: string;
  href?: string;
  variant?: 'default' | 'subtle' | 'button';
  underline?: 'none' | 'hover' | 'always';
  external?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      to,
      href,
      variant = 'default',
      underline = 'hover',
      external = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 rounded',
      'cursor-pointer'
    );

    const variants = {
      default: cn(
        'text-brand-blue hover:text-blue-700',
        'font-medium'
      ),
      subtle: cn(
        'text-slate-600 hover:text-slate-900'
      ),
      button: cn(
        'inline-flex items-center justify-center px-4 py-2',
        'bg-brand-blue text-white rounded-lg',
        'hover:bg-blue-700 hover:-translate-y-0.5',
        'active:scale-[0.98]'
      )
    };

    const underlineStyles = {
      none: '',
      hover: cn(
        'relative',
        'after:content-[""] after:absolute after:bottom-0 after:left-0',
        'after:w-0 after:h-0.5 after:bg-current',
        'after:transition-all after:duration-200',
        'hover:after:w-full'
      ),
      always: 'underline underline-offset-2'
    };

    const linkClassName = cn(
      baseStyles,
      variants[variant],
      variant !== 'button' && underlineStyles[underline],
      className
    );

    // External link
    if (external || href) {
      return (
        <a
          ref={ref}
          href={href || to}
          className={linkClassName}
          target="_blank"
          rel="noopener noreferrer"
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    // Internal link
    return (
      <RouterLink
        ref={ref as any}
        to={to || '/'}
        className={linkClassName}
        {...props}
      >
        {children}
      </RouterLink>
    );
  }
);

Link.displayName = 'Link';
