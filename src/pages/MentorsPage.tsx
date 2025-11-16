import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SEO } from "@/components/seo/SEO";
import { supabase } from '@/lib/supabaseClient';
import type { Mentor } from '@/data/mentors';
import { Search, Star, Clock, CheckCircle, Loader2 } from 'lucide-react';

export default function MentorsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('mentors')
          .select('*')
          .eq('vetting_status', 'Approved');

        if (error) {
          console.warn('Supabase not available, using local data:', error);
          // Fallback to local data
          const { mentors } = await import('@/data/mentors');
          setMentors(mentors);
        } else {
          setMentors(data || []);
        }
      } catch (err) {
        console.error('Error fetching mentors:', err);
        // Fallback to local data on any error
        try {
          const { mentors } = await import('@/data/mentors');
          setMentors(mentors);
        } catch (fallbackErr) {
          console.error('Fallback data load failed:', fallbackErr);
          setError('Failed to load mentor data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Get unique expertise areas
  const expertiseAreas = Array.from(
    new Set(mentors.flatMap(m => m.expertise || []))
  );

  // Filter mentors
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = searchQuery === '' ||
      mentor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise?.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mentor.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesExpertise = selectedExpertise === 'all' ||
      mentor.expertise?.includes(selectedExpertise);

    const matchesRating = selectedRating === 'all' ||
      mentor.rating >= parseFloat(selectedRating);

    const matchesAvailability = selectedAvailability === 'all' ||
      mentor.availability?.some(a => a.day === selectedAvailability);

    return matchesSearch && matchesExpertise && matchesRating && matchesAvailability;
  });

  return (
    <>
      <SEO
        title="Connect with Industry Mentors - CareerPath"
        description="Get personalized career guidance from industry experts. Book 1-on-1 mentorship sessions with verified professionals."
        url="https://www.careerpath.dev/mentors"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Connect with Industry <span className="text-blue-600 dark:text-blue-400">Mentors</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get personalized guidance from experienced professionals who've been where you want to go
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search mentors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                  <SelectTrigger>
                    <SelectValue placeholder="Expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Expertise</SelectItem>
                    {expertiseAreas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.7">4.7+ Stars</SelectItem>
                    <SelectItem value="4.9">4.9+ Stars</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                  <SelectTrigger>
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Day</SelectItem>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading mentors...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">Error loading mentors: {error}</p>
            </div>
          )}

          {/* Mentor Cards Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <Card
                  key={mentor.id}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/mentors/${mentor.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={mentor.image} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {mentor.name}
                            </CardTitle>
                            {mentor.verified && (
                              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {mentor.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {mentor.company}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise?.slice(0, 2).map((exp: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                      {mentor.expertise?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{mentor.expertise.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{mentor.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{mentor.totalSessions} sessions</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-semibold">${mentor.hourlyRate}/hr</span>
                        </div>
                        <p className="text-xs text-gray-500">{mentor.responseTime}</p>
                      </div>
                    </div>

                    <Button className="w-full" variant="default">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No mentors found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

