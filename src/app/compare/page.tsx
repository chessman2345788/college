'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GitCompare, Star, MapPin, IndianRupee, Briefcase, Award, Trash2, ArrowLeft, Plus, Search } from 'lucide-react';
import { useCompare } from '@/hooks/use-compare';
import { useToast } from '@/components/providers';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Course {
  id: string;
  name: string;
}

interface Placement {
  avgPackage: number;
  highestPackage: number;
}

interface College {
  id: string;
  name: string;
  location: string;
  description: string;
  fees: number;
  rating: number;
  imageUrl: string;
  courses: Course[];
  placements: Placement[];
}

export default function ComparePage() {
  const { toast } = useToast();
  const { compareIds, removeFromCompare, addToCompare, isMounted } = useCompare();

  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search state for adding new colleges directly
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch comparison data when IDs change
  useEffect(() => {
    if (!isMounted || compareIds.length === 0) {
      setColleges([]);
      return;
    }

    const fetchColleges = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/compare?ids=${compareIds.join(',')}`);
        const data = await res.json();
        if (data.success) {
          setColleges(data.data);
        } else {
          toast(data.message || 'Failed to retrieve comparison data', 'error');
        }
      } catch (err) {
        console.error(err);
        toast('Failed to load colleges for comparison', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchColleges();
  }, [compareIds, isMounted, toast]);

  // Handle direct searching for adding colleges
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/colleges?search=${searchQuery}&limit=5`);
        const data = await res.json();
        if (data.success) {
          // Filter out colleges that are already in comparison
          const filtered = data.data.colleges.filter(
            (c: College) => !compareIds.includes(c.id)
          );
          setSearchResults(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, compareIds]);

  const handleAddCollege = (collegeId: string) => {
    const res = addToCompare(collegeId);
    if (res.success) {
      toast(res.message, 'success');
      setSearchQuery('');
      setSearchResults([]);
    } else {
      toast(res.message, 'error');
    }
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <GitCompare className="w-8 h-8 text-indigo-500" />
            Compare Colleges
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Map colleges side-by-side. Compare fees structures, placement packages, location, and courses.
          </p>
        </div>
        <Link
          href="/colleges"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            "rounded-xl flex items-center gap-1.5"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Find Colleges
        </Link>
      </div>

      {/* Selector input for adding colleges if count < 3 */}
      {compareIds.length < 3 && (
        <Card className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl max-w-xl shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-850 dark:text-zinc-150">
                Add College to Compare ({compareIds.length}/3 selected)
              </h3>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by name to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-zinc-900 dark:text-white"
              />
            </div>

            {/* Live Search Results drop-down overlay */}
            {searchResults.length > 0 && (
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md divide-y divide-zinc-200 dark:divide-zinc-800">
                {searchResults.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleAddCollege(c.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-indigo-500/5 transition-colors group"
                  >
                    <div>
                      <span className="block font-semibold text-sm text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {c.name}
                      </span>
                      <span className="text-xs text-zinc-500">{c.location}</span>
                    </div>
                    <Plus className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            )}

            {searchQuery.trim() && searchResults.length === 0 && !isSearching && (
              <p className="text-xs text-zinc-500 italic">No matching colleges found.</p>
            )}

            {isSearching && (
              <p className="text-xs text-zinc-500 animate-pulse">Searching...</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Comparative View */}
      {isLoading ? (
        
        /* Loading Skeleton Table */
        <div className="bg-white/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4 animate-pulse">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-20 bg-zinc-250 dark:bg-zinc-850 rounded w-full" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
        </div>
      ) : compareIds.length === 0 ? (
        
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white/50 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl min-h-[350px]">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full mb-4">
            <GitCompare className="w-10 h-10" />
          </div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">No Colleges Selected</h3>
          <p className="text-zinc-550 dark:text-zinc-400 text-sm max-w-sm mt-2 mb-6 leading-relaxed">
            Select up to 3 colleges using the compare icons on college cards or search for them above to map them side-by-side.
          </p>
          <Link
            href="/colleges"
            className={cn(
              buttonVariants({ variant: 'default' }),
              "bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            )}
          >
            Explore Colleges
          </Link>
        </div>
      ) : (
        
        /* Comparison Table Container (Horizontal Scroll on Mobile) */
        <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl shadow-sm">
          <Table className="min-w-[700px] w-full border-collapse">
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <TableRow>
                <TableHead className="w-1/4 p-4 font-bold text-zinc-500 text-xs uppercase">Feature Criteria</TableHead>
                {colleges.map((col) => (
                  <TableHead key={col.id} className="p-4 text-center font-semibold text-zinc-900 dark:text-white relative">
                    <div className="flex flex-col items-center gap-2 py-2">
                      <img
                        src={col.imageUrl}
                        alt={col.name}
                        className="w-20 h-14 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800 mb-1"
                      />
                      <span className="font-bold text-sm block line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400">
                        <Link href={`/colleges/${col.id}`}>{col.name}</Link>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCompare(col.id)}
                        className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-7 px-2.5 rounded-lg flex items-center gap-1 mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    </div>
                  </TableHead>
                ))}
                {/* Pad columns to match 3 items if less than 3 selected */}
                {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
                  <TableHead key={idx} className="p-4 text-center text-zinc-400 italic text-xs">
                    Slot Available
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {/* Row 1: Location */}
              <TableRow className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10">
                <TableCell className="p-4 font-bold text-zinc-850 dark:text-zinc-200 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  Location
                </TableCell>
                {colleges.map((col) => (
                  <TableCell key={col.id} className="p-4 text-center text-zinc-650 dark:text-zinc-350 text-sm font-medium">
                    {col.location}
                  </TableCell>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
                  <TableCell key={idx} className="p-4 text-center text-zinc-400 text-xs italic">
                    -
                  </TableCell>
                ))}
              </TableRow>

              {/* Row 2: Rating */}
              <TableRow className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10">
                <TableCell className="p-4 font-bold text-zinc-850 dark:text-zinc-200 text-sm flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Rating
                </TableCell>
                {colleges.map((col) => (
                  <TableCell key={col.id} className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 rounded-full font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{col.rating.toFixed(1)} / 5.0</span>
                    </div>
                  </TableCell>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
                  <TableCell key={idx} className="p-4 text-center text-zinc-400 text-xs italic">
                    -
                  </TableCell>
                ))}
              </TableRow>

              {/* Row 3: Fees */}
              <TableRow className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10">
                <TableCell className="p-4 font-bold text-zinc-850 dark:text-zinc-200 text-sm flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-indigo-500" />
                  Annual Tuition Fees
                </TableCell>
                {colleges.map((col) => (
                  <TableCell key={col.id} className="p-4 text-center text-zinc-900 dark:text-white font-bold text-sm">
                    ₹{(col.fees / 100000).toFixed(2)} Lakhs
                  </TableCell>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
                  <TableCell key={idx} className="p-4 text-center text-zinc-400 text-xs italic">
                    -
                  </TableCell>
                ))}
              </TableRow>

              {/* Row 4: Average Package */}
              <TableRow className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10">
                <TableCell className="p-4 font-bold text-zinc-850 dark:text-zinc-200 text-sm flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  Average CTC Package
                </TableCell>
                {colleges.map((col) => (
                  <TableCell key={col.id} className="p-4 text-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    {col.placements?.[0] ? `${col.placements[0].avgPackage} LPA` : 'N/A'}
                  </TableCell>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
                  <TableCell key={idx} className="p-4 text-center text-zinc-400 text-xs italic">
                    -
                  </TableCell>
                ))}
              </TableRow>

              {/* Row 5: Highest Package */}
              <TableRow className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10">
                <TableCell className="p-4 font-bold text-zinc-850 dark:text-zinc-200 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-500" />
                  Highest CTC Package
                </TableCell>
                {colleges.map((col) => (
                  <TableCell key={col.id} className="p-4 text-center text-amber-600 dark:text-amber-500 font-bold text-sm">
                    {col.placements?.[0] ? `${col.placements[0].highestPackage} LPA` : 'N/A'}
                  </TableCell>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
                  <TableCell key={idx} className="p-4 text-center text-zinc-400 text-xs italic">
                    -
                  </TableCell>
                ))}
              </TableRow>

              {/* Row 6: Core Courses */}
              <TableRow className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10">
                <TableCell className="p-4 font-bold text-zinc-850 dark:text-zinc-200 text-sm flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-500" />
                  Key Courses
                </TableCell>
                {colleges.map((col) => (
                  <TableCell key={col.id} className="p-4 text-center text-xs">
                    <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
                      {col.courses?.slice(0, 3).map((course) => (
                        <span
                          key={course.id}
                          className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-650 dark:text-zinc-350"
                        >
                          {course.name.replace('B.Tech ', '').replace('Engineering', 'Engg')}
                        </span>
                      ))}
                      {col.courses?.length > 3 && (
                        <span className="text-[9px] text-zinc-400 italic">+{col.courses.length - 3} more</span>
                      )}
                    </div>
                  </TableCell>
                ))}
                {Array.from({ length: 3 - colleges.length }).map((_, idx) => (
                  <TableCell key={idx} className="p-4 text-center text-zinc-400 text-xs italic">
                    -
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

    </div>
  );
}
