import { CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProfileField {
  key: string;
  label: string;
  completed: boolean;
}

interface ProfileCompletionCardProps {
  fields: ProfileField[];
}

export function ProfileCompletionCard({ fields }: ProfileCompletionCardProps) {
  const completedCount = fields.filter(f => f.completed).length;
  const totalCount = fields.length;
  const percentage = Math.round((completedCount / totalCount) * 100);


  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Profile Completion</h3>
        <span className="text-2xl font-bold text-foreground">{percentage}%</span>
      </div>

      <Progress value={percentage} className="h-2" />

      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center gap-2 text-sm">
            {field.completed ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground" />
            )}
            <span className={field.completed ? 'text-foreground' : 'text-muted-foreground'}>
              {field.label}
            </span>
          </div>
        ))}
      </div>

      {percentage < 100 && (
        <p className="text-xs text-muted-foreground">
          Complete your profile to unlock all features and improve your experience
        </p>
      )}
    </div>
  );
}

