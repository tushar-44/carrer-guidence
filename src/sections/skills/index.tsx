import { useState, useEffect, useRef } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JobCard } from "@/components/ui/job-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, MapPin, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import type { Job } from '@/data/jobs';

gsap.registerPlugin(ScrollTrigger);

// State for jobs data
export function Jobs() {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [domains, setDomains] = useState<string[]>([]);
  const [selectedStream, setSelectedStream] = useState("All Streams");
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // First try to fetch from Supabase
        const { data, error } = await supabase
          .from('jobs')
          .select('*');

        if (error) {
          console.warn('Supabase not available, using local data:', error);
          // Fallback to local data
          const { jobs } = await import('@/data/jobs');
          setJobsData(jobs);
          const uniqueDomains = Array.from(new Set(jobs.map((job) => job.domain)));
          setDomains(uniqueDomains);
        } else {
          // If we have data from Supabase, use it
          if (data && data.length > 0) {
            setJobsData(data as Job[]);
            const uniqueDomains = Array.from(new Set(data.map((job) => job.domain)));
            setDomains(uniqueDomains);
          } else {
            // If Supabase is empty, use local data
            console.warn('Supabase jobs table is empty, using local data');
            const { jobs } = await import('@/data/jobs');
            setJobsData(jobs);
            const uniqueDomains = Array.from(new Set(jobs.map((job) => job.domain)));
            setDomains(uniqueDomains);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        // Fallback to local data on any error
        try {
          const { jobs } = await import('@/data/jobs');
          setJobsData(jobs);
          const uniqueDomains = Array.from(new Set(jobs.map((job) => job.domain)));
          setDomains(uniqueDomains);
        } catch (fallbackErr) {
          console.error('Fallback data load failed:', fallbackErr);
          setError('Failed to load job data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate filters
      gsap.fromTo(filtersRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: filtersRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate job cards
      gsap.fromTo(cardsRef.current?.children || [],
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="jobs"
      className="py-20 px-6 md:px-12 lg:px-16 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/10 via-transparent to-accent-purple/10 pointer-events-none" />
      <div className="absolute top-20 left-0 w-96 h-96 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-accent-purple/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Section Headers */}
        <div ref={titleRef} className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 bg-accent-cyan/20 text-accent-cyan px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-accent-cyan/30">
              <Briefcase className="w-4 h-4" />
              Job Marketplace
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Explore Global Job Listings
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Land your dream role. Access exclusive job listings and get matched with opportunities that align with your career goals.
          </p>
        </div>

        {/* Enhanced Filter Section */}
        <div ref={filtersRef} className="mb-8">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>

              {/* Stream Filter */}
              <Select value={selectedStream} onValueChange={setSelectedStream}>
                <SelectTrigger className="bg-background/50">
                  <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select a stream" />
                </SelectTrigger>
                <SelectContent>
                  {["All Domains", ...domains].map((stream) => (
                    <SelectItem key={stream} value={stream}>
                      {stream}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select defaultValue="all-locations">
                <SelectTrigger className="bg-background/50">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-locations">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button className="px-3 py-1.5 text-xs bg-accent-purple/20 text-accent-purple rounded-full hover:bg-accent-purple/30 transition-colors backdrop-blur-sm border border-accent-purple/30">
                Remote Only
              </button>
              <button className="px-3 py-1.5 text-xs bg-accent-green/20 text-accent-green rounded-full hover:bg-accent-green/30 transition-colors backdrop-blur-sm border border-accent-green/30">
                High Salary
              </button>
              <button className="px-3 py-1.5 text-xs bg-accent-cyan/20 text-accent-cyan rounded-full hover:bg-accent-cyan/30 transition-colors backdrop-blur-sm border border-accent-cyan/30">
                Entry Level
              </button>
              <button className="px-3 py-1.5 text-xs bg-accent-pink/20 text-accent-pink rounded-full hover:bg-accent-pink/30 transition-colors backdrop-blur-sm border border-accent-pink/30">
                Senior Roles
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading jobs...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">Error loading jobs: {error}</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {jobsData.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex items-center justify-center gap-6">
          <p className="font-body font-light text-muted-foreground text-base">
            Can't find the right opportunity?
          </p>
          <button 
            className="px-6 py-2 border border-border rounded-full font-heading text-sm text-foreground hover:border-foreground/50 transition-colors duration-300 cursor-pointer hover:opacity-80"
          >
            SET JOB ALERTS
          </button>
        </div>
      </div>
    </section>
  );
}