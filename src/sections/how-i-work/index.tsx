import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MentorCard } from '@/components/ui/mentor-card';
import { Users, Star, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Mentors() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      // Animate stats
      gsap.fromTo(statsRef.current?.children || [],
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate cards
      gsap.fromTo(cardsRef.current?.children || [],
        { opacity: 0, y: 50, rotateX: -15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
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
  // Mock mentor data
  const mentors = [
    {
      name: "Sarah Chen",
      title: "Senior Software Engineer",
      company: "Google",
      expertise: ["React", "TypeScript", "System Design"],
      hourlyRate: 75,
      rating: 5,
      reviewCount: 47,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      title: "Product Manager",
      company: "Meta",
      expertise: ["Product Strategy", "User Research", "Analytics"],
      hourlyRate: 85,
      rating: 5,
      reviewCount: 32,
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. Emily Watson",
      title: "Data Science Lead",
      company: "Netflix",
      expertise: ["Machine Learning", "Python", "Big Data"],
      hourlyRate: 90,
      rating: 5,
      reviewCount: 28,
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Alex Kim",
      title: "UX Design Director",
      company: "Airbnb",
      expertise: ["UX Design", "Prototyping", "User Testing"],
      hourlyRate: 80,
      rating: 5,
      reviewCount: 41,
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "James Wilson",
      title: "DevOps Engineer",
      company: "Amazon",
      expertise: ["AWS", "Kubernetes", "CI/CD"],
      hourlyRate: 70,
      rating: 4.9,
      reviewCount: 35,
      imageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Lisa Zhang",
      title: "Marketing Director",
      company: "Spotify",
      expertise: ["Digital Marketing", "Growth Hacking", "Analytics"],
      hourlyRate: 65,
      rating: 4.8,
      reviewCount: 29,
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ]

  return (
    <section
      ref={sectionRef}
      id="mentors"
      className="py-20 px-6 md:px-12 lg:px-16 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-purple/10 via-transparent to-accent-cyan/10 pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent-purple/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div ref={titleRef} className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 bg-accent-purple/20 text-accent-purple px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-accent-purple/30">
              <Users className="w-4 h-4" />
              Expert Mentorship Network
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Connect with Industry Mentors
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Bridge your skill gap. Connect with professionals who are working in your ideal industry right now.
          </p>
        </div>

        {/* Stats section */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 group/stat">
            <div className="w-12 h-12 bg-accent-cyan/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover/stat:bg-accent-cyan/30 transition-colors">
              <Users className="w-6 h-6 text-accent-cyan" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">500+</div>
            <div className="text-sm text-muted-foreground">Expert Mentors</div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 group/stat">
            <div className="w-12 h-12 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover/stat:bg-accent-orange/30 transition-colors">
              <Star className="w-6 h-6 text-accent-orange" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 group/stat">
            <div className="w-12 h-12 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover/stat:bg-accent-green/30 transition-colors">
              <Award className="w-6 h-6 text-accent-green" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">10k+</div>
            <div className="text-sm text-muted-foreground">Sessions Completed</div>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor, index) => (
            <MentorCard key={index} {...mentor} />
          ))}
        </div>
      </div>
    </section>
  );
}
