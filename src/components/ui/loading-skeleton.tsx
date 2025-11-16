export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-secondary rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-secondary rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-secondary rounded w-5/6"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-secondary rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-secondary rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-secondary rounded w-full"></div>
        <div className="h-3 bg-secondary rounded w-5/6"></div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-6 bg-secondary rounded-full w-16"></div>
        <div className="h-6 bg-secondary rounded-full w-20"></div>
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-secondary rounded w-3/4"></div>
          <div className="h-4 bg-secondary rounded w-1/2"></div>
        </div>
        <div className="h-12 w-12 bg-secondary rounded-full"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-secondary rounded w-16"></div>
        <div className="h-6 bg-secondary rounded w-20"></div>
        <div className="h-6 bg-secondary rounded w-24"></div>
      </div>
      <div className="h-20 bg-secondary rounded w-full"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-secondary rounded w-16"></div>
        <div className="h-8 bg-secondary rounded w-16"></div>
        <div className="h-8 bg-secondary rounded w-16"></div>
      </div>
      <div className="h-10 bg-secondary rounded w-full"></div>
    </div>
  );
}

export function MentorCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-secondary rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-secondary rounded w-32"></div>
          <div className="h-4 bg-secondary rounded w-48"></div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-secondary rounded w-20"></div>
        <div className="h-6 bg-secondary rounded w-24"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="h-4 bg-secondary rounded w-16"></div>
          <div className="h-5 bg-secondary rounded w-12"></div>
        </div>
        <div className="space-y-1">
          <div className="h-4 bg-secondary rounded w-20"></div>
          <div className="h-5 bg-secondary rounded w-16"></div>
        </div>
      </div>
      <div className="h-10 bg-secondary rounded w-full"></div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-secondary rounded w-32"></div>
      <div className="h-24 bg-secondary rounded w-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-secondary rounded w-full"></div>
        <div className="h-4 bg-secondary rounded w-3/4"></div>
        <div className="h-4 bg-secondary rounded w-5/6"></div>
      </div>
    </div>
  );
}