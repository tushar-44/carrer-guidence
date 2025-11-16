import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from "@/components/navigation/nav-bar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/sections/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Building, ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { getJobById } from '@/data/jobs';
import { JobApplicationModal } from '@/components/job/JobApplicationModal';
import { useApplicationStore } from '@/stores/applicationStore';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState(false);
  const { applications } = useApplicationStore();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  const job = id ? getJobById(id) : undefined;
  
  // Check if already applied
  const hasApplied = job ? applications.some(app => app.jobId === job.id) : false;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
          <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save to jobStore
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.company}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <>
      <SEO
        title={`${job.title} at ${job.company} | CareerPath`}
        description={`Apply for ${job.title} position at ${job.company}. ${job.description.substring(0, 150)}...`}
        url={`https://www.careerpath.dev/jobs/${job.id}`}
      />
      <div className="flex min-h-svh flex-col">
        <NavBar />
        <main className="w-full max-w-[1550px] mx-auto flex-1 py-8 px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/jobs')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Jobs
                    </Button>
                    <div className="ml-auto flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveJob}
                      >
                        <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                        {isSaved ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                      {job.title}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-4">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{job.salary}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Posted {job.postedDate}
                      </Badge>
                      {job.remote && (
                        <Badge variant="secondary" className="text-xs">
                          Remote
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Sidebar */}
            <div className="space-y-6">
              {/* Apply Now Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {hasApplied ? 'Application Submitted' : 'Apply for this position'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  {hasApplied ? (
                    <>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-green-700 dark:text-green-400 font-medium">
                          ✓ You've already applied for this position
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="lg"
                        onClick={() => navigate('/dashboard')}
                      >
                        View Application Status
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setIsApplyModalOpen(true)}
                      >
                        Apply Now
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Application deadline: {job.deadline}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        <p>💡 Tip: Customize your resume for this role</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    About {job.company}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Domain</span>
                    <span className="font-medium">{job.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Experience</span>
                    <span className="font-medium">{job.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">{job.type}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <img src={job.companyLogo} alt={job.company} className="w-16 h-16 object-cover rounded mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">{job.description.substring(0, 150)}...</p>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Similar Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Similar Jobs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      
      {job && (
        <JobApplicationModal
          job={job}
          open={isApplyModalOpen}
          onOpenChange={setIsApplyModalOpen}
        />
      )}
    </>
  );
}
