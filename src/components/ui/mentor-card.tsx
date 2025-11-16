import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Sparkles } from "lucide-react";

interface MentorCardProps {
  name: string;
  title: string;
  company: string;
  expertise: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

export function MentorCard({
  name,
  title,
  company,
  expertise,
  hourlyRate,
  rating,
  reviewCount,
  imageUrl
}: MentorCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.3s ease-out'
      }}
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-pink via-accent-purple to-accent-cyan rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200 animate-gradient-xy" />
      
      <Card className="relative h-full bg-card/95 backdrop-blur-sm border-border/50 overflow-hidden">
        {/* Availability indicator */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 bg-accent-green/20 text-accent-green px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
            Available
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={imageUrl}
                alt={name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300"
              />
              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent-cyan rounded-full flex items-center justify-center ring-2 ring-card">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors">
                {name}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{company}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Expertise tags */}
          <div className="flex flex-wrap gap-1.5">
            {expertise.slice(0, 3).map((skill, index) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="text-xs bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 transition-colors backdrop-blur-sm border-accent-purple/30"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Rating and reviews */}
          <div className="flex items-center justify-between py-2 border-y border-border/50">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{rating}</span>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">${hourlyRate}</div>
              <div className="text-xs text-muted-foreground">per hour</div>
            </div>
            <Button 
              size="sm" 
              className="group/btn relative overflow-hidden bg-gradient-to-r from-accent-purple to-accent-cyan hover:from-accent-purple/90 hover:to-accent-cyan/90 transition-all duration-300"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span className="relative z-10">Book Now</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            </Button>
          </div>

          {/* Next available slot */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
            Next available: <span className="text-foreground font-medium">Tomorrow, 2:00 PM</span>
          </div>
        </CardContent>

        {/* Hover glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 5 + 50}% ${mousePosition.y * 5 + 50}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
          }}
        />
      </Card>
    </div>
  );
}