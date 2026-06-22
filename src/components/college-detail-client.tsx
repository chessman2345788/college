'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, IndianRupee, Heart, GitCompare, BookOpen, Briefcase, Award, GraduationCap, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/providers';
import { useCompare } from '@/hooks/use-compare';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Course {
  id: string;
  name: string;
  duration: string;
}

interface Placement {
  avgPackage: number;
  highestPackage: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
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
  reviews: Review[];
}

interface CollegeDetailClientProps {
  college: College;
  isInitiallySaved: boolean;
}

type TabType = 'overview' | 'courses' | 'placements' | 'reviews';

export default function CollegeDetailClient({ college, isInitiallySaved }: CollegeDetailClientProps) {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { toggleCompare, isInCompare } = useCompare();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [isSaving, setIsSaving] = useState(false);


  const [reviews, setReviews] = useState<Review[]>(college.reviews || []);
  const [ratingVal, setRatingVal] = useState<number>(college.rating);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const placement = college.placements?.[0];
  const feesInLakhs = (college.fees / 100000).toFixed(1);
  const isComparing = isInCompare(college.id);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      toast('Please sign in to write a review', 'info');
      router.push('/login');
      return;
    }

    if (!reviewComment.trim() || reviewComment.length < 5) {
      toast('Please enter a comment (at least 5 characters)', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeId: college.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast('Review submitted successfully!', 'success');
        setReviews((prev) => [data.data, ...prev]);
        setRatingVal(data.newAverageRating);
        setReviewComment('');
        setReviewRating(5);
      } else {
        toast(data.message || 'Failed to submit review', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('A network error occurred. Please try again.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSave = async () => {
    if (status !== 'authenticated') {
      toast('Please sign in to save colleges', 'info');
      router.push('/login');
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved/${college.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setIsSaved(false);
          toast('Removed from saved colleges', 'success');
        } else {
          toast(data.message || 'Failed to unsave', 'error');
        }
      } else {
        const res = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId: college.id }),
        });
        const data = await res.json();
        if (data.success) {
          setIsSaved(true);
          toast('College saved successfully', 'success');
        } else {
          toast(data.message || 'Failed to save', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      toast('A network error occurred. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompare = () => {
    const result = toggleCompare(college.id);
    if (result.success) {
      toast(result.message, 'success');
    } else {
      toast(result.message, 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 gap-1.5 pl-0">
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Button>
      </div>

      <div className="relative overflow-hidden bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 shadow-sm">
        
        <div className="relative w-full md:w-80 h-56 rounded-2xl overflow-hidden bg-zinc-150 dark:bg-zinc-850 flex-shrink-0">
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm rounded-full text-xs font-bold text-zinc-900 dark:text-white border border-zinc-200/50 dark:border-zinc-800/50">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span>{ratingVal.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>{college.location}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 dark:text-white leading-tight">
              {college.name}
            </h1>

            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-3">
              {college.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant={isSaved ? 'destructive' : 'outline'}
              className="gap-2 rounded-xl"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved to Dashboard' : 'Save College'}
            </Button>

            <Button
              onClick={handleCompare}
              variant={isComparing ? 'default' : 'secondary'}
              className={`gap-2 rounded-xl ${
                isComparing ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''
              }`}
            >
              <GitCompare className="w-4 h-4" />
              {isComparing ? 'Comparing' : 'Compare College'}
            </Button>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <Card className="bg-white/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 text-center shadow-sm">
          <div className="mx-auto w-10 h-10 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2">
            <IndianRupee className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Annual Fees</span>
          <span className="block text-lg font-black text-zinc-900 dark:text-white mt-1">₹{feesInLakhs} Lakhs</span>
        </Card>

        <Card className="bg-white/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 text-center shadow-sm">
          <div className="mx-auto w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Average Placement</span>
          <span className="block text-lg font-black text-zinc-900 dark:text-white mt-1">
            {placement ? `${placement.avgPackage} LPA` : 'N/A'}
          </span>
        </Card>

        <Card className="bg-white/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 text-center shadow-sm">
          <div className="mx-auto w-10 h-10 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-2">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Highest Placement</span>
          <span className="block text-lg font-black text-zinc-900 dark:text-white mt-1">
            {placement ? `${placement.highestPackage} LPA` : 'N/A'}
          </span>
        </Card>

        <Card className="bg-white/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 text-center shadow-sm">
          <div className="mx-auto w-10 h-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Courses</span>
          <span className="block text-lg font-black text-zinc-900 dark:text-white mt-1">
            {college.courses?.length || 0} Streams
          </span>
        </Card>

      </div>

      <div className="flex flex-col gap-6">
        
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6 overflow-x-auto pb-px select-none">
          {(['overview', 'courses', 'placements', 'reviews'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold capitalize border-b-2 transition-all flex-shrink-0 ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-[250px]">
          
          {activeTab === 'overview' && (
            <Card className="bg-white/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-500" />
                  Institution Overview
                </h3>
                <p className="text-zinc-650 dark:text-zinc-300 text-sm leading-relaxed">
                  {college.description}
                </p>
                <p className="text-zinc-650 dark:text-zinc-300 text-sm leading-relaxed">
                  Founded with the target of building research and engineering values, {college.name} is classified as one of the principal institutes for higher education. Offering excellent residential hosteling, standard research laboratories, and a global academic partnership framework, this campus hosts a thriving campus culture.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-150">Key Facilities & Features</h4>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-5">
                    <li>Fully WiFi-enabled academic blocks and campus library</li>
                    <li>Advanced technical laboratories and research incubator hubs</li>
                    <li>Highly active coding and development student organizations</li>
                    <li>Vibrant calendar including national-level science & cultural fests</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-150">Admission Overview</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Admissions are strictly merit-based. Engineering streams require candidates to clear national examinations (such as JEE Main / Advanced) followed by institutional counselling services. Fee payments are structured annually with scholarship concessions available for meritorious students.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'courses' && (
            <Card className="bg-white/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  Available Programs & Courses
                </h3>
                
                {college.courses?.length === 0 ? (
                  <p className="text-sm text-zinc-500">No courses listed for this college.</p>
                ) : (
                  <div className="overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase text-zinc-500">
                          <th className="p-4">Course Name</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4">Stream Classification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {college.courses.map((course) => (
                          <tr key={course.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                            <td className="p-4 font-semibold text-zinc-900 dark:text-white">{course.name}</td>
                            <td className="p-4">{course.duration}</td>
                            <td className="p-4">
                              {course.name.includes('Computer Science') || course.name.includes('Artificial Intelligence') || course.name.includes('Data Science')
                                ? 'Software / Computing'
                                : course.name.includes('MBA')
                                ? 'Management / Commerce'
                                : 'Engineering / Core'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'placements' && (
            <Card className="bg-white/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-500" />
                  Placement Performance & package Statistics
                </h3>
                
                {!placement ? (
                  <p className="text-sm text-zinc-500">No placement records available for this college.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="block text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Average Package</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{placement.avgPackage}</span>
                          <span className="text-sm font-semibold text-emerald-600">Lakhs Per Annum (LPA)</span>
                        </div>
                        <p className="text-xs text-emerald-850 dark:text-emerald-400/80 mt-2 leading-relaxed">
                          This indicates the mean package bagged by graduating students. CSE/IT averages are typically 25% higher.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        <span className="block text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Highest Package Offered</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-black text-amber-700 dark:text-amber-300">{placement.highestPackage}</span>
                          <span className="text-sm font-semibold text-amber-600">Lakhs Per Annum (LPA)</span>
                        </div>
                        <p className="text-xs text-amber-850 dark:text-amber-400/80 mt-2 leading-relaxed">
                          The peak offer received, generally from international software organizations or premium domestic companies.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Industry Recruitment Trends</h4>
                      <p className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
                        {college.name} features an active Career Development Cell (CDC) that conducts annual placement drives inviting top companies like Google, Microsoft, Amazon, Adobe, McKinsey, Deloitte, Tata Motors, and Larsen & Toubro.
                      </p>
                      <div className="space-y-2.5 pt-2">
                        <div>
                          <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500 mb-1">
                            <span>IT / Software Engineering Placement</span>
                            <span>92%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '92%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500 mb-1">
                            <span>Core Engineering Streams Placement</span>
                            <span>78%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '78%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="bg-white/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sticky top-24 shadow-sm">
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-4">
                    Share Your Experience
                  </h3>
                  {status === 'authenticated' ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                          Your Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((value) => {
                            const isStarred = hoverRating !== null ? value <= hoverRating : value <= reviewRating;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setReviewRating(value)}
                                onMouseEnter={() => setHoverRating(value)}
                                onMouseLeave={() => setHoverRating(null)}
                                className="p-0.5 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    isStarred ? 'fill-amber-400 stroke-amber-400' : 'stroke-zinc-300 dark:stroke-zinc-700'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                          Review Comment
                        </label>
                        <textarea
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="What did you like or dislike about the campus, placements, infrastructure, or faculty? (min 5 chars)..."
                          className="w-full p-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 text-zinc-900 dark:text-white placeholder-zinc-400 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-650/10 font-bold"
                      >
                        {isSubmittingReview ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                          'Submit Review'
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <p className="text-sm text-zinc-550 dark:text-zinc-450 leading-relaxed">
                        Join the student community to write reviews, rate campuses, and save your favorites.
                      </p>
                      <Link
                        href="/login"
                        className="inline-flex w-full justify-center items-center px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm transition-colors"
                      >
                        Sign In to Review
                      </Link>
                    </div>
                  )}
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="bg-white/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 space-y-6 shadow-sm">
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    Student Reviews ({reviews.length})
                  </h3>

                  {reviews.length === 0 ? (
                    <p className="text-sm text-zinc-500 italic">No student reviews posted yet. Be the first to share your experience!</p>
                  ) : (
                    <div className="space-y-6 divide-y divide-zinc-200 dark:divide-zinc-800">
                      {reviews.map((rev, index) => (
                        <div key={rev.id} className={`pt-6 ${index === 0 ? 'pt-0' : ''}`}>
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">{rev.userName}</span>
                            <div className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-800 dark:text-amber-400 rounded-full text-xs font-bold border border-amber-500/10">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{rev.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="text-zinc-650 dark:text-zinc-350 text-sm leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
