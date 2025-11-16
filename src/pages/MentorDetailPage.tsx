import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from "@/components/navigation/nav-bar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/sections/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Star, Briefcase, Award, Users, ArrowLeft } from "lucide-react";
import { getMentorById } from '@/data/mentors';
import { BookingModal } from '@/components/mentors/BookingModal';

export function MentorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  
  const mentor = id ? getMentorById(id) : undefined;

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mentor not found</h2>
          <Button onClick={() => navigate('/mentors')}>Back to Mentors</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${mentor.name} - Career Mentor | CareerPath`}
        description={`Book a session with ${mentor.name}, ${mentor.title}. ${mentor.experience} of experience in mentoring developers.`}
        url={`https://www.careerpath.dev/mentors/${mentor.id}`}
      />
      <div className="flex min-h-svh flex-col">
        <NavBar />
        <main className="w-full max-w-[1550px] mx-auto flex-1 py-8 px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mentor Profile */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/mentors')}
                    className="mb-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Mentors
                  </Button>
                  <div className="flex flex-col md:flex-row gap-6">
                    <Avatar className="w-24 h-24 mx-auto md:mx-0">
                      <AvatarImage src={mentor.image} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left">
                      <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                        {mentor.name}
                      </h1>
                      <p className="text-lg text-muted-foreground mb-3">{mentor.title}</p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{mentor.rating}</span>
                          <span className="text-muted-foreground">({mentor.totalSessions} sessions)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{mentor.experience} years</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {mentor.specializations.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle>About {mentor.name.split(' ')[0]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{mentor.bio}</p>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievements & Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mentor.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education & Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{mentor.education}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {mentor.languages.map((language) => (
                        <Badge key={language} variant="outline">{language}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Book a Session</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <span className="text-3xl font-bold text-primary">${mentor.hourlyRate}</span>
                    <span className="text-muted-foreground">/hour</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    60-minute personalized mentoring session
                  </p>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setBookingModalOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a Session
                  </Button>
                </CardContent>
              </Card>

              {/* Availability Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mentor.availability.map((day) => (
                    <div key={day.day} className="flex justify-between items-center">
                      <span className="font-medium text-sm">{day.day}</span>
                      <div className="flex gap-1">
                        {day.slots.slice(0, 2).map((slot) => (
                          <Badge key={slot} variant="outline" className="text-xs">
                            {slot}
                          </Badge>
                        ))}
                        {day.slots.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{day.slots.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Session Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sessions Completed</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Rating</span>
                    <span className="font-medium">4.9/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="font-medium">Less than 2 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      
      <BookingModal
        mentor={mentor}
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
      />
    </>
  );
}
