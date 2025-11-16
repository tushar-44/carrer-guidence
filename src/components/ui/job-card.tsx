import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock, Bookmark, ExternalLink, TrendingUp } from "lucide-react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  skills: string[];
  postedDate: string;
}

export function JobCard({
  title,
  company,
  location,
  salary,
  type,
  description,
  skills,
  postedDate
}: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glassmorphic background with gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
      
      <Card className="relative h-full bg-card/80 backdrop-blur-md border-border/50 overflow-hidden transition-all duration-300 group-hover:shadow-2xl">
        {/* Trending badge */}
        {postedDate.includes("day") && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 bg-accent-orange/20 text-accent-orange px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              <TrendingUp className="w-3 h-3" />
              Hot
            </div>
          </div>
        )}

        {/* Bookmark button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-primary/10 transition-all duration-300 group/bookmark"
        >
          <Bookmark 
            className={`w-4 h-4 transition-all duration-300 ${
              isSaved 
                ? 'fill-primary text-primary scale-110' 
                : 'text-muted-foreground group-hover/bookmark:text-primary'
            }`}
          />
        </button>

        <CardHeader className="pb-3 pt-12">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-heading mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {title}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-medium">{company}</p>
            </div>
            <Badge 
              variant="outline" 
              className="ml-2 bg-primary/10 text-primary border-primary/20 whitespace-nowrap"
            >
              {type}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Job details with icons */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
              <MapPin className="w-4 h-4 text-accent-cyan" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
              <DollarSign className="w-4 h-4 text-accent-green" />
              <span className="font-medium text-foreground">{salary}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-accent-orange" />
              <span>{postedDate}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Skills with animated appearance */}
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill, index) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="text-xs bg-secondary/50 hover:bg-secondary transition-all duration-300"
                style={{
                  animationDelay: `${index * 50}ms`,
                  opacity: isHovered ? 1 : 0.8
                }}
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-accent-cyan to-accent-purple hover:from-accent-cyan/90 hover:to-accent-purple/90 transition-all duration-300"
              size="sm"
            >
              <span className="relative z-10 flex items-center gap-2">
                Apply Now
                <ExternalLink className="w-3 h-3" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300"
            >
              Details
            </Button>
          </div>

          {/* Match score */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Match Score</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-green to-accent-cyan rounded-full transition-all duration-1000"
                    style={{ width: isHovered ? '85%' : '0%' }}
                  />
                </div>
                <span className="font-medium text-accent-green">85%</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Animated gradient overlay on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 70%)'
          }}
        />
      </Card>
    </div>
  );
}