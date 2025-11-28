import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Edit, Mail, Calendar } from 'lucide-react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export function ProfileSummaryCard() {
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
          delay: 0.2
        }
      );
    }
  }, []);

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

  return (
    <Card 
      ref={cardRef}
      className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2"
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg">
              {getInitials(profile?.full_name || user?.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">
                    {user?.email}
                  </span>
                  {isEmailVerified && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {profile?.created_at && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Calendar className="w-3 h-3" />
                <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            )}

            <Button
              onClick={() => navigate('/profile')}
              size="sm"
              className="w-full gap-2"
              variant="outline"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

