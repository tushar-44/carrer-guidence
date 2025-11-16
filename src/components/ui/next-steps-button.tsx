import { cn } from "@/lib/utils";

interface NextStepsButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'primary';
}

export function NextStepsButton({ 
  children, 
  onClick, 
  className = "",
  variant = 'default' 
}: NextStepsButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-xl font-body font-medium transition-colors cursor-pointer",
        variant === 'default' && "border border-border text-foreground hover:border-ring",
        variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      {children}
    </button>
  );
}