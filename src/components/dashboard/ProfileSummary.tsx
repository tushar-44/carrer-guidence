import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/stores/userStore';

export function ProfileSummary() {
  const { currentUser } = useUserStore();

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

  return (
    <div className="bento-no-min h-full flex flex-col items-center justify-center text-center p-6">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-4">
        <span className="font-heading text-3xl text-primary-foreground">
          {currentUser?.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'JD'}
        </span>
      </div>
      <h3 className="font-heading text-2xl text-foreground mb-2">
        {currentUser?.name || 'John Doe'}
      </h3>
      <p className="font-body text-sm text-muted-foreground mb-4">
        {currentUser?.type ? getUserTitle(currentUser.type) : 'Aspiring Professional'}
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        <Badge variant="outline">Frontend</Badge>
        <Badge variant="outline">React</Badge>
        <Badge variant="outline">TypeScript</Badge>
      </div>
    </div>
  );
}
