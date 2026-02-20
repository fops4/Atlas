import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  validate?: (value: string) => string | null;
  onValidatedChange?: (value: string) => void;
}

/**
 * Enhanced Input with XSS protection and validation
 */
export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  error: externalError,
  validate,
  onValidatedChange,
  className,
  value,
  onChange,
  ...props
}) => {
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Sanitize input to prevent XSS
    const sanitizedValue = DOMPurify.sanitize(e.target.value);
    
    // 2. Perform validation if provided
    if (validate) {
      const errorMsg = validate(sanitizedValue);
      setInternalError(errorMsg);
    }

    // 3. Trigger external callbacks
    if (onChange) {
      // Re-construct event with sanitized value
      const newEvent = { ...e, target: { ...e.target, value: sanitizedValue } };
      onChange(newEvent as any);
    }

    if (onValidatedChange) {
      onValidatedChange(sanitizedValue);
    }
  };

  const error = externalError || internalError;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          value={value}
          onChange={handleChange}
          className={cn(
            "w-full px-4 py-2 bg-white border rounded-lg outline-none transition-all text-sm",
            error 
              ? "border-red-500 focus:ring-red-200" 
              : "border-slate-200 focus:border-brand-blue focus:ring-brand-blue/20",
            className
          )}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};
