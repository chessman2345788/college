'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, IndianRupee, Heart, GitCompare, ArrowRight, BookOpen, Briefcase } from 'lucide-react';
import { useToast } from '@/components/providers';
import { useCompare } from '@/hooks/use-compare';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

interface CollegeCardProps {
  college: College;
  isInitiallySaved?: boolean;
  onSaveToggle?: (collegeId: string, isSaved: boolean) => void;
}

export default function CollegeCard({ college, isInitiallySaved = false, onSaveToggle }: CollegeCardProps) {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { toggleCompare, isInCompare } = useCompare();
  
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [isSaving, setIsSaving] = useState(false);

  const placement = college.placements?.[0];
  const feesInLakhs = (college.fees / 100000).toFixed(1);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== 'authenticated') {
      toast('Please sign in to save colleges', 'info');
      router.push('/login');
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        // Remove from saved
        const res = await fetch(`/api/saved/${college.id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) {
          setIsSaved(false);
          if (onSaveToggle) onSaveToggle(college.id, false);
          toast('Removed from saved colleges', 'success');
        } else {
          toast(data.message || 'Failed to unsave college', 'error');
        }
      } else {
        // Add to saved
        const res = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId: college.id }),
        });
        const data = await res.json();
        if (data.success) {
          setIsSaved(true);
          if (onSaveToggle) onSaveToggle(college.id, true);
          toast('College saved to dashboard', 'success');
        } else {
          toast(data.message || 'Failed to save college', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      toast('A network error occurred. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = toggleCompare(college.id);
    if (result.success) {
      toast(result.message, 'success');
    } else {
      toast(result.message, 'error');
    }
  };

  const isComparing = isInCompare(college.id);

  return (
    <Card className="group flex flex-col h-full bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300">
      
      {/* College Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={college.imageUrl}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm rounded-full text-xs font-bold text-zinc-900 dark:text-white border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
          <span>{college.rating.toFixed(1)}</span>
        </div>

        {/* Action Buttons: Save & Compare */}
        <div className="absolute top-4 right-4 flex gap-2">
          
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            aria-label="Save college bookmark"
            className={`p-2 rounded-full border transition-all duration-300 shadow-sm backdrop-blur-sm ${
              isSaved
                ? 'bg-rose-500 border-rose-600 text-white hover:bg-rose-600 scale-105'
                : 'bg-white/90 dark:bg-zinc-950/90 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-950'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''} ${isSaving ? 'animate-pulse' : ''}`} />
          </button>

          {/* Compare Toggle */}
          <button
            onClick={handleCompare}
            aria-label="Toggle comparison"
            className={`p-2 rounded-full border transition-all duration-300 shadow-sm backdrop-blur-sm ${
              isComparing
                ? 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700 scale-105'
                : 'bg-white/90 dark:bg-zinc-950/90 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-500 hover:bg-white dark:hover:bg-zinc-950'
            }`}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>
      </div>

      <CardHeader className="p-5 pb-2">
        {/* Location */}
        <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs mb-1">
          <MapPin className="w-3 h-3 text-indigo-500" />
          <span className="truncate">{college.location}</span>
        </div>
        
        {/* Name */}
        <h3 className="font-bold text-lg text-zinc-950 dark:text-zinc-50 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          <Link href={`/colleges/${college.id}`}>
            {college.name}
          </Link>
        </h3>
      </CardHeader>

      <CardContent className="px-5 py-2 flex-grow flex flex-col">
        {/* Description */}
        <p className="text-zinc-600 dark:text-zinc-300 text-sm line-clamp-2 mb-4 leading-relaxed">
          {college.description}
        </p>

        {/* Short Metrics Grid */}
        <div className="mt-auto grid grid-cols-2 gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-100 dark:border-zinc-800/40 text-xs">
          <div>
            <span className="block text-zinc-500 dark:text-zinc-400 font-medium">Annual Fees</span>
            <div className="flex items-center gap-0.5 mt-0.5 font-bold text-zinc-900 dark:text-white">
              <IndianRupee className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              <span>{feesInLakhs} Lakhs</span>
            </div>
          </div>
          <div>
            <span className="block text-zinc-500 dark:text-zinc-400 font-medium">Average Package</span>
            <div className="flex items-center gap-1 mt-0.5 font-bold text-emerald-600 dark:text-emerald-400">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{placement ? `${placement.avgPackage} LPA` : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Course Count Indicator */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>{college.courses?.length || 0} Courses Available</span>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/20">
        <Link
          href={`/colleges/${college.id}`}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            "w-full justify-between hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 text-zinc-700 dark:text-zinc-300 group/btn"
          )}
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>

    </Card>
  );
}
