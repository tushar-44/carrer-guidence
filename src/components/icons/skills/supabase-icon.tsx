import { useMemo } from "react";

export function SupabaseIcon({ className }: { className?: string }) {
  // Generate unique IDs for this instance
  const gradientId1 = useMemo(() => `supabase-gradient-1-${Math.random().toString(36).slice(2, 11)}`, []);
  const gradientId2 = useMemo(() => `supabase-gradient-2-${Math.random().toString(36).slice(2, 11)}`, []);
  const clipPathId = useMemo(() => `supabase-clip-${Math.random().toString(36).slice(2, 11)}`, []);
   
  return (
    <svg 
      className={className}
      width="54" 
      height="56" 
      viewBox="0 0 54 56" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${clipPathId})`}>
        <path 
          d="M31.5615 54.6539C30.1449 56.4385 27.2725 55.4607 27.2384 53.1821L26.7393 19.854H49.1417C53.1994 19.854 55.4624 24.5422 52.9393 27.7211L31.5615 54.6539Z"
          fill={`url(#${gradientId1})`}
        />
        <path 
          d="M31.5615 54.6539C30.1449 56.4385 27.2725 55.4607 27.2384 53.1821L26.7393 19.854H49.1417C53.1994 19.854 55.4624 24.5422 52.9393 27.7211L31.5615 54.6539Z" 
          fill={`url(#${gradientId2})`}
          fillOpacity="0.2"
        />
        <path 
          d="M22.4511 1.02668C23.8677 -0.758089 26.7401 0.219833 26.7743 2.49852L26.993 35.8265H4.87095C0.813144 35.8265 -1.44997 31.1384 1.0733 27.9594L22.4511 1.02668Z" 
          fill="#3ECF8E"
        />
      </g>
      <defs>
        <linearGradient 
          id={gradientId1}
          x1="26.7393" 
          y1="27.2437" 
          x2="46.6517" 
          y2="35.5922" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#249361"/>
          <stop offset="1" stopColor="#3ECF8E"/>
        </linearGradient>
        <linearGradient 
          id={gradientId2}
          x1="17.912" 
          y1="15.1536" 
          x2="26.9969" 
          y2="32.2498" 
          gradientUnits="userSpaceOnUse"
        >
          <stop/>
          <stop offset="1" stopOpacity="0"/>
        </linearGradient>
        <clipPath id={clipPathId}>
          <rect width="54" height="56" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}