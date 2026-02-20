import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface FinancialInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export const FinancialInput: React.FC<FinancialInputProps> = ({
  value,
  onChange,
  label,
  placeholder = '0',
  error,
  disabled = false,
  className = '',
  required = false,
}) => {
  const [displayValue, setDisplayValue] = useState('');

  // Format number with thousand separators (space)
  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR').replace(/,/g, ' ');
  };

  // Parse formatted string back to number
  const parseNumber = (str: string): number => {
    const cleaned = str.replace(/\s/g, '');
    return parseInt(cleaned, 10) || 0;
  };

  useEffect(() => {
    setDisplayValue(value > 0 ? formatNumber(value) : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^\d\s]/g, '');
    const numericValue = parseNumber(input);
    
    // Prevent exceeding reasonable limits (e.g., 999M)
    if (numericValue > 999999999) return;
    
    setDisplayValue(numericValue > 0 ? formatNumber(numericValue) : '');
    onChange(numericValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'block w-full rounded-lg border pr-16 pl-4 py-2.5 text-slate-900 font-mono transition-all',
            'placeholder:text-slate-400',
            'focus:ring-2 focus:ring-brand-blue focus:border-brand-blue',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300'
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-slate-500 sm:text-sm font-medium">FCFA</span>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
