'use client';

interface CurrencySelectorProps {
  selectedCurrency: string;
  detectedCurrency: string;
  onChange: (currency: string) => void;
  disabled?: boolean;
}

const CURRENCY_OPTIONS = [
  { code: 'GBP', symbol: '£', amount: '10.00', label: 'British Pound' },
  { code: 'EUR', symbol: '€', amount: '11.99', label: 'Euro' },
  { code: 'USD', symbol: '$', amount: '14.99', label: 'US Dollar' },
];

export default function CurrencySelector({
  selectedCurrency,
  detectedCurrency,
  onChange,
  disabled = false,
}: CurrencySelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Currency
      </label>
      <div className="relative">
        <select
          value={selectedCurrency}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="block w-full px-4 py-2 pr-10 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        >
          {CURRENCY_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.symbol}{option.amount} {option.code} - {option.label}
              {option.code === detectedCurrency && ' (Detected)'}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {detectedCurrency && detectedCurrency !== selectedCurrency && (
        <p className="mt-1 text-xs text-gray-500">
          We detected you're from a {CURRENCY_OPTIONS.find(o => o.code === detectedCurrency)?.label} region
        </p>
      )}
    </div>
  );
}
