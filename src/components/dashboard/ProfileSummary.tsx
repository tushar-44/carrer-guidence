import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/userStore';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, Edit } from 'lucide-react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export function ProfileSummary() {
  const { currentUser } = useUserStore();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 20
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.2)",
          delay: 0.1
        }
      );
    }
  }, []);

  const getUserTitle = (type: string) => {
    switch (type) {
      case 'class-8-9': return 'Class 8-9 Student';
      case 'class-10-12': return 'Class 10-12 Student';
      case 'graduates': return 'Graduate Student';
      case 'job-seeker': return 'Job Seeker';
      case 'mentor': return 'Career Mentor';
      default: return 'Aspiring Professional';
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isEmailVerified = user?.email_confirmed_at ? true : false;
  const displayName = profile?.full_name || currentUser?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div 
      ref={cardRef}
      className="bento-no-min h-full flex flex-col items-center justify-center text-center p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={() => navigate('/profile')}
    >
      <Avatar className="w-24 h-24 border-4 border-primary mb-4">
        <AvatarImage src={profile?.avatar_url || currentUser?.avatar} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground font-heading text-3xl">
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>
      <h3 className="font-heading text-2xl text-foreground mb-2">
        {displayName}
      </h3>
      <div className="flex items-center gap-2 mb-2">
        <p className="font-body text-sm text-muted-foreground">
          {currentUser?.type ? getUserTitle(currentUser.type) : 'Aspiring Professional'}
        </p>
        {isEmailVerified && (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        )}
      </div>
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        <Badge variant="outline">Frontend</Badge>
        <Badge variant="outline">React</Badge>
        <Badge variant="outline">TypeScript</Badge>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="gap-2"
        onClick={(e) => {
          e.stopPropagation();
          navigate('/profile');
        }}
      >
        <Edit className="w-4 h-4" />
        Edit Profile
      </Button>
    </div>
  );
}
