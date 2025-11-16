import { useMemo } from "react";

export function CloudIcon({ className }: { className?: string }) {
  // Generate unique gradient ID for this instance
  const gradientId = useMemo(() => `cloud-gradient-${Math.random().toString(36).slice(2, 11)}`, []);
   
  return (
    <svg 
      className={className} 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M6.38687 9.98359C6.45685 6.94319 8.94344 4.5 12.0007 4.5C14.4558 4.5 16.5415 6.07501 17.3051 8.26898C19.9715 8.72575 22.0001 11.0476 22.0001 13.8439C22.0001 16.9678 19.4676 19.5003 16.3437 19.5003H6.76578C4.13371 19.5003 2 17.3666 2 14.7345C2 12.23 3.93195 10.1767 6.38687 9.98359Z" 
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient 
          id={gradientId}
          x1="12" 
          y1="4.5" 
          x2="12" 
          y2="19.5003" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white"/>
          <stop offset="0.5" stopColor="#6DD5FA"/>
          <stop offset="1" stopColor="#2980B9"/>
        </linearGradient>
      </defs>
    </svg>
  )
}