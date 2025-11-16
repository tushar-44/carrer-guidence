import { useMemo } from "react";

export function LlmsIcon({ className }: { className?: string }) {
  // Generate unique gradient IDs for this instance
  const gradientId1 = useMemo(() => `llms-gradient-1-${Math.random().toString(36).slice(2, 11)}`, []);
  const gradientId2 = useMemo(() => `llms-gradient-2-${Math.random().toString(36).slice(2, 11)}`, []);
   
  return (
    <svg 
      className={className}
      width="56" 
      height="56" 
      viewBox="0 0 56 56" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M21.7777 12.4448L20.1728 16.7818C18.0684 22.4688 17.0162 25.3123 14.9419 27.3868C12.8676 29.461 10.0241 30.5131 4.33703 32.6178L0 34.2225L4.33703 35.8272C10.0241 37.9319 12.8676 38.984 14.9419 41.0582C17.0162 43.1327 18.0684 45.9762 20.1728 51.663L21.7777 56.0002L23.3824 51.663C25.487 45.9762 26.5392 43.1327 28.6134 41.0582C30.6879 38.984 33.5314 37.9319 39.2182 35.8272L43.5554 34.2225L39.2182 32.6178C33.5314 30.5131 30.6879 29.461 28.6134 27.3868C26.5392 25.3123 25.487 22.4688 23.3824 16.7818L21.7777 12.4448Z"
        fill={`url(#${gradientId1})`} 
      />
      <path 
        d="M46.6663 0L45.9784 1.85873C45.0765 4.29602 44.6257 5.5147 43.7366 6.40367C42.8477 7.29266 41.6291 7.74362 39.1919 8.64549L37.333 9.33329L39.1919 10.0211C41.6291 10.923 42.8477 11.3739 43.7366 12.2629C44.6257 13.1519 45.0765 14.3706 45.9784 16.8079L46.6663 18.6666L47.3542 16.8079C48.2561 14.3706 48.7069 13.1519 49.596 12.2629C50.4849 11.3739 51.7035 10.923 54.1407 10.0211L55.9996 9.33329L54.1407 8.64549C51.7035 7.74362 50.4849 7.29266 49.596 6.40367C48.7069 5.5147 48.2561 4.29602 47.3542 1.85873L46.6663 0Z" 
        fill={`url(#${gradientId2})`} 
      />
      <defs>
        <linearGradient 
          id={gradientId1}
          x1="26.4445" 
          y1="62.2222" 
          x2="26.8334" 
          y2="19.4448" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FC5C7D"/>
          <stop offset="1" stopColor="#6A82FB"/>
        </linearGradient>
        <linearGradient 
          id={gradientId2}
          x1="48.6664" 
          y1="21.3332" 
          x2="48.833" 
          y2="2.99998" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FC5C7D"/>
          <stop offset="1" stopColor="#6A82FB"/>
        </linearGradient>
      </defs>
    </svg>
  )
}