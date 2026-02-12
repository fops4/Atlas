import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/format';

interface FinancialInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const FinancialInput: React.FC<FinancialInputProps> = ({
  value,
  onChange,
  label,
  placeholder = '0',
  error,
  disabled = false,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState('');

  // Format number with thousand separators
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Parse formatted string back to number
  const parseNumber = (str: string): number => {
    const cleaned = str.replace(/\s/g, '').replace(/\./g, '');
    return parseInt(cleaned, 10) || 0;
  };

  useEffect(() => {
    setDisplayValue(value > 0 ? formatNumber(value) : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericValue = parseNumber(input);
    onChange(numericValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
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
            'block w-full rounded-md border pr-16 pl-4 py-2.5 text-gray-900 font-mono',
            'placeholder:text-gray-400',
            'focus:ring-2 focus:ring-holding-500 focus:border-holding-500',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error
              ? 'border-alert-300 focus:ring-alert-500 focus:border-alert-500'
              : 'border-gray-300'
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm font-medium">FCFA</span>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-alert-600">{error}</p>
      )}
    </div>
  );
};
