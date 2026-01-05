'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

export interface MatchFilters {
  locations: string[];
  schoolTypes: string[];
  salaryRange: { min: number; max: number } | null;
  matchScoreMin: number;
}

interface MatchFiltersProps {
  filters: MatchFilters;
  onFiltersChange: (filters: MatchFilters) => void;
  availableLocations: string[];
  availableSchoolTypes: string[];
}

export default function MatchFilters({
  filters,
  onFiltersChange,
  availableLocations,
  availableSchoolTypes
}: MatchFiltersProps) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSchoolTypeDropdown, setShowSchoolTypeDropdown] = useState(false);
  const [showSalaryDropdown, setShowSalaryDropdown] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const schoolTypeRef = useRef<HTMLDivElement>(null);
  const salaryRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (schoolTypeRef.current && !schoolTypeRef.current.contains(event.target as Node)) {
        setShowSchoolTypeDropdown(false);
      }
      if (salaryRef.current && !salaryRef.current.contains(event.target as Node)) {
        setShowSalaryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLocation = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location];
    onFiltersChange({ ...filters, locations: newLocations });
  };

  const toggleSchoolType = (type: string) => {
    const newTypes = filters.schoolTypes.includes(type)
      ? filters.schoolTypes.filter(t => t !== type)
      : [...filters.schoolTypes, type];
    onFiltersChange({ ...filters, schoolTypes: newTypes });
  };

  const setSalaryRange = (min: number, max: number) => {
    onFiltersChange({ ...filters, salaryRange: { min, max } });
    setShowSalaryDropdown(false);
  };

  const clearSalaryRange = () => {
    onFiltersChange({ ...filters, salaryRange: null });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      locations: [],
      schoolTypes: [],
      salaryRange: null,
      matchScoreMin: 0
    });
  };

  const hasActiveFilters =
    filters.locations.length > 0 ||
    filters.schoolTypes.length > 0 ||
    filters.salaryRange !== null ||
    filters.matchScoreMin > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-auto text-sm text-brand-red hover:text-red-600 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Location Filter */}
        <div ref={locationRef} className="relative">
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              filters.locations.length > 0
                ? 'border-brand-red bg-red-50 text-brand-red'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Location
            {filters.locations.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-brand-red text-white rounded-full text-xs font-medium">
                {filters.locations.length}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showLocationDropdown && (
            <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {availableLocations.length > 0 ? (
                <div className="p-2">
                  {availableLocations.map(location => (
                    <label
                      key={location}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.locations.includes(location)}
                        onChange={() => toggleLocation(location)}
                        className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                      />
                      <span className="text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-gray-500 text-center">
                  No locations available
                </div>
              )}
            </div>
          )}
        </div>

        {/* School Type Filter */}
        <div ref={schoolTypeRef} className="relative">
          <button
            onClick={() => setShowSchoolTypeDropdown(!showSchoolTypeDropdown)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              filters.schoolTypes.length > 0
                ? 'border-brand-red bg-red-50 text-brand-red'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            School Type
            {filters.schoolTypes.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-brand-red text-white rounded-full text-xs font-medium">
                {filters.schoolTypes.length}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showSchoolTypeDropdown && (
            <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-2">
                {availableSchoolTypes.map(type => (
                  <label
                    key={type}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.schoolTypes.includes(type)}
                      onChange={() => toggleSchoolType(type)}
                      className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Salary Range Filter */}
        <div ref={salaryRef} className="relative">
          <button
            onClick={() => setShowSalaryDropdown(!showSalaryDropdown)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              filters.salaryRange !== null
                ? 'border-brand-red bg-red-50 text-brand-red'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Salary Range
            {filters.salaryRange && (
              <X
                className="w-4 h-4 ml-1 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSalaryRange();
                }}
              />
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showSalaryDropdown && (
            <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setSalaryRange(15000, 20000)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  15,000 - 20,000 RMB/month
                </button>
                <button
                  onClick={() => setSalaryRange(20000, 30000)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  20,000 - 30,000 RMB/month
                </button>
                <button
                  onClick={() => setSalaryRange(30000, 40000)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  30,000 - 40,000 RMB/month
                </button>
                <button
                  onClick={() => setSalaryRange(40000, 999999)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  40,000+ RMB/month
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Match Score Filter */}
        <div className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-lg bg-white">
          <label className="text-sm text-gray-700 whitespace-nowrap">Min Score:</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.matchScoreMin}
            onChange={(e) => onFiltersChange({ ...filters, matchScoreMin: parseInt(e.target.value) })}
            className="w-32 accent-brand-red"
          />
          <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
            {filters.matchScoreMin}%+
          </span>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.locations.map(location => (
            <span
              key={location}
              className="inline-flex items-center gap-1 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-xs font-medium"
            >
              {location}
              <button
                onClick={() => toggleLocation(location)}
                className="hover:bg-brand-red/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.schoolTypes.map(type => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-xs font-medium"
            >
              {type}
              <button
                onClick={() => toggleSchoolType(type)}
                className="hover:bg-brand-red/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.salaryRange && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-red/10 text-brand-red rounded-full text-xs font-medium">
              {filters.salaryRange.min.toLocaleString()} - {filters.salaryRange.max === 999999 ? '∞' : filters.salaryRange.max.toLocaleString()} RMB
              <button
                onClick={clearSalaryRange}
                className="hover:bg-brand-red/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
