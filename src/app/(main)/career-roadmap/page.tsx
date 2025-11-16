import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BookOpen, Users, Target, TrendingUp } from 'lucide-react';
import { getComprehensiveCareerRecommendations, type CareerMatchResult } from '@/lib/careerMatching';
import type { CareerRecommendation } from '@/constants/index';

export default function CareerRoadmapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [careerData, setCareerData] = useState<CareerMatchResult | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const assessmentData = searchParams.get('assessmentData');
    const userProfile = searchParams.get('userProfile');

    if (assessmentData && userProfile) {
      try {
        const assessmentScores = JSON.parse(decodeURIComponent(assessmentData));
        const userProfileData = JSON.parse(decodeURIComponent(userProfile));

        const recommendations = getComprehensiveCareerRecommendations(assessmentScores, userProfileData);
        setCareerData(recommendations);
        setSelectedCareer(recommendations.careers[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing assessment data:', error);
        navigate('/assessment');
      }
    } else {
      navigate('/assessment');
    }
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your personalized career roadmap...</p>
        </div>
      </div>
    );
  }

  if (!careerData || !selectedCareer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load career recommendations.</p>
          <Button onClick={() => navigate('/assessment')}>Take Assessment Again</Button>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      case 'mentorship': return <Users className="h-4 w-4" />;
      case 'book': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Career Roadmap</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on your assessment results, we've created a personalized career development plan
            to help you achieve your professional goals.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
            <TabsTrigger value="skills">Skill Gaps</TabsTrigger>
            <TabsTrigger value="courses">Recommended Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Career Match */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Your Top Career Match
                  </CardTitle>
                  <CardDescription>
                    Based on your assessment scores and interests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedCareer.title}</h3>
                      <p className="text-gray-600 mt-1">{selectedCareer.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">
                        {selectedCareer.matchPercentage}%
                      </div>
                      <p className="text-sm text-gray-500">Match Score</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Salary Range</p>
                      <p className="font-semibold">{selectedCareer.salaryRange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Growth Potential</p>
                      <p className="font-semibold">{selectedCareer.growthPotential}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Career Options</CardTitle>
                  <CardDescription>Other careers that match your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerData.careers.slice(1, 4).map((career) => (
                      <div
                        key={career.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCareer(career)}
                      >
                        <div>
                          <p className="font-medium">{career.title}</p>
                          <p className="text-sm text-gray-500">{career.matchPercentage}% match</p>
                        </div>
                        <Badge variant={selectedCareer.id === career.id ? "default" : "secondary"}>
                          {career.matchPercentage}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">High Priority Skill Gaps</p>
                      <p className="text-2xl font-bold text-red-600">
                        {careerData.skillGaps.filter(gap => gap.priority === 'high').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recommended Courses</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {careerData.recommendedCourses.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Roadmap Steps</p>
                      <p className="text-2xl font-bold text-green-600">
                        {careerData.roadmap.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Roadmap for {selectedCareer.title}
                </CardTitle>
                <CardDescription>
                  Step-by-step plan to achieve your career goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {careerData.roadmap.map((step, index) => (
                    <div key={step.id} className="border-l-4 border-blue-500 pl-6 pb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {step.duration}
                        </div>
                      </div>

                      <div className="ml-11">
                        <p className="text-sm text-gray-500 mb-2">Recommended Resources:</p>
                        <div className="space-y-2">
                          {step.resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex} className="flex items-center gap-2 text-sm">
                              {getResourceIcon(resource.type)}
                              <span className="font-medium">{resource.title}</span>
                              {resource.platform && (
                                <Badge variant="outline" className="text-xs">
                                  {resource.platform}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
                <CardDescription>
                  Skills you need to develop for {selectedCareer.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {careerData.skillGaps.map((gap, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{gap.skill}</h3>
                        <Badge className={getPriorityColor(gap.priority)}>
                          {gap.priority} priority
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Current Level</p>
                          <p className="font-semibold">{gap.currentLevel}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Required Level</p>
                          <p className="font-semibold">{gap.requiredLevel}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gap</p>
                          <p className="font-semibold text-red-600">-{gap.gap}%</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{gap.currentLevel}%</span>
                        </div>
                        <Progress value={gap.currentLevel} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerData.recommendedCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.provider}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">{course.level}</Badge>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{course.rating}</span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">{course.duration}</span>
                      <span className="font-semibold text-green-600">{course.price}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full" asChild>
                      <a href={course.url} target="_blank" rel="noopener noreferrer">
                        Enroll Now
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <Button
            size="lg"
            onClick={() => window.location.href = '/mentors'}
            className="mr-4"
          >
            Find Mentors
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.location.href = '/jobs'}
          >
            Explore Jobs
          </Button>
        </div>
      </div>
    </div>
  );
}
