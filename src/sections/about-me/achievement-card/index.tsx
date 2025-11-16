import { AnimatedCounter } from '@/components/ui/animated-counter';

interface AchievementCardProps {
  title: React.ReactNode;
  description: string;
  className?: string;
  value?: number;
  suffix?: string;
}

export function AchievementCard({ 
  title, 
  description, 
  className = "",
  value,
  suffix = ""
}: AchievementCardProps) {
  return (
    <div className={`bento-no-min ${className} flex flex-col justify-between items-center text-center relative overflow-hidden group`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 w-full">
        <h3 className="font-heading text-2xl text-foreground [@media(min-width:1391px)]:mb-0 mb-4 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        {value !== undefined && (
          <div className="text-4xl font-bold text-primary my-4">
            <AnimatedCounter end={value} suffix={suffix} />
          </div>
        )}
      </div>
      
      <span className="font-body text-sm text-muted-foreground font-light relative z-10">
        {description}
      </span>

      {/* Decorative element */}
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
    </div>
  );
}