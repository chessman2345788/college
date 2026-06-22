'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Star, ArrowUpDown, RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CollegeFiltersProps {
  locations: string[];
}

export default function CollegeFilters({ locations }: CollegeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL values
  const currentSearch = searchParams.get('search') ?? '';
  const currentLocation = searchParams.get('location') ?? 'all';
  const currentRating = searchParams.get('rating') ?? '0';
  const currentSort = searchParams.get('sort') ?? 'rating_desc';

  // Internal states
  const [searchText, setSearchText] = useState(currentSearch);
  const [location, setLocation] = useState(currentLocation);
  const [rating, setRating] = useState(currentRating);
  const [sort, setSort] = useState(currentSort);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchText(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    setLocation(currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    setRating(currentRating);
  }, [currentRating]);

  useEffect(() => {
    setSort(currentSort);
  }, [currentSort]);

  // Handle updates to router query
  const applyFilters = useCallback(
    ({
      s = searchText,
      l = location,
      r = rating,
      so = sort,
    }: {
      s?: string;
      l?: string;
      r?: string;
      so?: string;
    }) => {
      const params = new URLSearchParams();
      
      if (s.trim()) params.set('search', s.trim());
      if (l !== 'all') params.set('location', l);
      if (r !== '0') params.set('rating', r);
      params.set('sort', so);
      params.set('page', '1'); // Reset to page 1 on filter changes

      router.push(`/colleges?${params.toString()}`);
    },
    [searchText, location, rating, sort, router]
  );

  // Debounce search input changes (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText !== currentSearch) {
        applyFilters({ s: searchText });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText, currentSearch, applyFilters]);

  const handleReset = () => {
    setSearchText('');
    setLocation('all');
    setRating('0');
    setSort('rating_desc');
    router.push('/colleges');
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm sticky top-24 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-lg text-zinc-900 dark:text-white">Filters & Sort</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs text-zinc-500 hover:text-indigo-500 hover:bg-indigo-500/10 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>

      {/* Search Input */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="search" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Search Colleges
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="search"
            type="text"
            placeholder="Search name or course..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-zinc-900 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
          <MapPin className="w-4 h-4 text-indigo-500" />
          Location
        </Label>
        <Select
          value={location}
          onValueChange={(val) => {
            const v = val ?? 'all';
            setLocation(v);
            applyFilters({ l: v });
          }}
        >
          <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Minimum Rating Filter */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          Minimum Rating
        </Label>
        <Select
          value={rating}
          onValueChange={(val) => {
            const v = val ?? '0';
            setRating(v);
            applyFilters({ r: v });
          }}
        >
          <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl">
            <SelectValue placeholder="Any Rating" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <SelectItem value="0">Any Rating</SelectItem>
            <SelectItem value="3.5">3.5+ Stars</SelectItem>
            <SelectItem value="4.0">4.0+ Stars</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By Filter */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
          <ArrowUpDown className="w-4 h-4 text-indigo-500" />
          Sort By
        </Label>
        <Select
          value={sort}
          onValueChange={(val) => {
            const v = val ?? 'rating_desc';
            setSort(v);
            applyFilters({ so: v });
          }}
        >
          <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl">
            <SelectValue placeholder="Rating: High to Low" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
            <SelectItem value="rating_asc">Rating: Low to High</SelectItem>
            <SelectItem value="fees_desc">Fees: High to Low</SelectItem>
            <SelectItem value="fees_asc">Fees: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
