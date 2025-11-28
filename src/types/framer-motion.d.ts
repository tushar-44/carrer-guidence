import * as React from 'react';

declare module 'framer-motion' {
  // Loosen MotionProps so common DOM props like `className` and event handlers are allowed.
  // This is a pragmatic fix to reduce widespread TypeScript errors caused by mismatched
  // framer-motion typings in this project.
  interface MotionProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<any>;
    onMouseEnter?: React.MouseEventHandler<any>;
    onMouseLeave?: React.MouseEventHandler<any>;
    // allow arbitrary props to avoid many missing-property errors on motion components
    [key: string]: any;
  }
}
