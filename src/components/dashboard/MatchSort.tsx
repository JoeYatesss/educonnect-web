'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';

export type SortOption = 'match_score' | 'salary' | 'location';

interface MatchSortProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

export default function MatchSort({ sortBy, onSortChange }: MatchSortProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { value: 'match_score' as SortOption, label: 'Match Score (Highest)' },
    { value: 'salary' as SortOption, label: 'Salary (Highest)' },
    { value: 'location' as SortOption, label: 'Location (A-Z)' }
  ];

  const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Match Score (Highest)';

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-sm text-gray-700"
      >
        <ArrowUpDown className="w-4 h-4" />
        <span className="font-medium">Sort by:</span>
        <span>{currentLabel}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {showDropdown && (
        <div className="absolute z-10 mt-2 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-1">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setShowDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors ${
                  sortBy === option.value
                    ? 'bg-brand-red/10 text-brand-red font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
                {sortBy === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
