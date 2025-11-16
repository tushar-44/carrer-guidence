import { cn } from '@/lib/utils';
import { motion, useSpring, useTransform, type SpringOptions } from 'framer-motion';
import { useEffect } from 'react';

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  as?: keyof React.JSX.IntrinsicElements;
};

export function AnimatedNumber({
  value,
  className,
  springOptions,
  as = 'span',
}: AnimatedNumberProps) {
  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  // Create motion component using motion() function
  const Component = motion(as);

  return (
    <Component className={cn('tabular-nums', className)}>
      {display}
    </Component>
  );
}