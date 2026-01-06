'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';
import { SchoolMatch } from '@/components/dashboard/MatchCard';
import MatchCard from '@/components/dashboard/MatchCard';
import MatchFilters, { MatchFilters as FilterState } from '@/components/dashboard/MatchFilters';
import MatchSort, { SortOption } from '@/components/dashboard/MatchSort';
import QuickApplyButton from '@/components/dashboard/QuickApplyButton';
import { BookOpen, User, Settings } from 'lucide-react';

export default function MatchesPage() {
  const { teacher, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<SchoolMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering and sorting state
  const [filters, setFilters] = useState<FilterState>({
    locations: [],
    schoolTypes: [],
    salaryRange: null,
    matchScoreMin: 0
  });
  const [sortBy, setSortBy] = useState<SortOption>('match_score');

  useEffect(() => {
    if (!authLoading && !teacher) {
      router.push('/login');
    } else if (!authLoading && teacher && !teacher.has_paid) {
      router.push('/dashboard');
    } else if (teacher?.has_paid) {
      fetchMatches();
    }
  }, [teacher, authLoading]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMyMatches();
      setMatches(data as SchoolMatch[] || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load matches';
      console.error('Failed to fetch matches:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique filter options from matches
  const filterOptions = useMemo(() => {
    const locations = new Set<string>();
    const schoolTypes = new Set<string>();

    // Helper to capitalize and normalize location names
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

    matches.forEach(match => {
      // Normalize and dedupe city/province (they can be the same for municipalities like Beijing)
      const city = match.city?.trim();
      const province = match.province?.trim();
      const normalizedCity = city?.toLowerCase();
      const normalizedProvince = province?.toLowerCase();

      if (city) locations.add(capitalize(city));
      // Only add province if it's different from city
      if (province && normalizedProvince !== normalizedCity) {
        locations.add(capitalize(province));
      }
      if (match.school_type) schoolTypes.add(match.school_type);
    });

    return {
      locations: Array.from(locations).sort(),
      schoolTypes: Array.from(schoolTypes).sort()
    };
  }, [matches]);

  // Parse salary range from string like "25,000-35,000 RMB/month"
  const parseSalaryRange = (range: string): { min: number; max: number } => {
    const numbers = range.match(/[\d,]+/g);
    if (!numbers || numbers.length < 2) return { min: 0, max: 999999 };

    return {
      min: parseInt(numbers[0].replace(/,/g, '')),
      max: parseInt(numbers[1].replace(/,/g, ''))
    };
  };

  // Apply filters and sorting to matches
  const filteredMatches = useMemo(() => {
    let filtered = [...matches];

    // Apply location filter
    if (filters.locations.length > 0) {
      filtered = filtered.filter(match =>
        filters.locations.some(loc =>
          match.city.toLowerCase().includes(loc.toLowerCase()) ||
          match.province?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    // Apply school type filter
    if (filters.schoolTypes.length > 0) {
      filtered = filtered.filter(match =>
        filters.schoolTypes.includes(match.school_type)
      );
    }

    // Apply salary range filter - check for OVERLAP not containment
    // e.g., "25,000-35,000" should match both "20k-30k" and "30k-40k" filters
    if (filters.salaryRange) {
      filtered = filtered.filter(match => {
        const salary = parseSalaryRange(match.salary_range);
        // Two ranges overlap if: salary.min <= filter.max AND salary.max >= filter.min
        return salary.min <= filters.salaryRange!.max &&
               salary.max >= filters.salaryRange!.min;
      });
    }

    // Apply match score filter
    if (filters.matchScoreMin > 0) {
      filtered = filtered.filter(match => match.match_score >= filters.matchScoreMin);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match_score':
          return b.match_score - a.match_score;
        case 'salary': {
          const salaryA = parseSalaryRange(a.salary_range);
          const salaryB = parseSalaryRange(b.salary_range);
          return salaryB.max - salaryA.max;
        }
        case 'location':
          return a.city.localeCompare(b.city);
        default:
          return 0;
      }
    });

    return filtered;
  }, [matches, filters, sortBy]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="container mx-auto px-6 h-20 max-w-7xl">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <span className="text-gray-900 font-montserrat text-2xl font-bold tracking-tight group-hover:text-gray-700 transition-colors">
                EduConnect
              </span>
              <span
                className="text-brand-red font-chinese text-[1.75rem] font-bold group-hover:scale-105 transition-transform duration-200"
                style={{textShadow: '1px 1px 3px rgba(230, 74, 74, 0.3)'}}
              >
                中国
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-brand-red font-medium text-[15px] tracking-tight transition-all duration-200 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/matches"
                className="text-brand-red font-semibold text-[15px] tracking-tight transition-all duration-200 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Matches
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-brand-red font-medium text-[15px] tracking-tight transition-all duration-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Profile
              </Link>
              <div className="flex items-center gap-3 ml-4 border-l border-gray-200 pl-6">
                <span className="text-sm text-gray-600">
                  {teacher?.first_name} {teacher?.last_name}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (error) {
                      console.error('Sign out error:', error);
                    }
                  }}
                  className="text-sm text-gray-500 hover:text-brand-red transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content - with padding for fixed header */}
      <main className="pt-20">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 max-w-7xl py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your School Matches</h1>
                <p className="mt-1 text-sm text-gray-600">
                  {filteredMatches.length} of {matches.length} matches shown
                </p>
              </div>
              <MatchSort sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-6 max-w-7xl py-6">
          {/* Filters */}
          <MatchFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableLocations={filterOptions.locations}
            availableSchoolTypes={filterOptions.schoolTypes}
          />

          {/* Match Cards */}
          {filteredMatches.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No matches found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filter criteria to see more results
                </p>
                <button
                  onClick={() => setFilters({ locations: [], schoolTypes: [], salaryRange: null, matchScoreMin: 0 })}
                  className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match}>
                  <QuickApplyButton
                    matchId={match.id}
                    matchCity={match.city}
                    matchProvince={match.province}
                    isAlreadyApplied={match.is_submitted}
                    onSuccess={() => fetchMatches()}
                  />
                </MatchCard>
              ))}
            </div>
          )}

          {/* Info Note */}
          <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> School names are kept confidential to protect both schools and teachers.
              Our team will submit applications on your behalf after reviewing your profile.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
