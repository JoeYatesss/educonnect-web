'use client';

interface MultiSelectChipsProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  required?: boolean;
  error?: string;
  columns?: 2 | 3 | 4;
}

export default function MultiSelectChips({
  label,
  options,
  selected,
  onChange,
  required = false,
  error,
  columns = 3,
}: MultiSelectChipsProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && '*'}
        </label>
        {selected.length > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {selected.length} selected
          </span>
        )}
      </div>
      <div className={`grid ${gridCols[columns]} gap-2`}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                isSelected
                  ? 'bg-brand-red text-white border-brand-red'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
