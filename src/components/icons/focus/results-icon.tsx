export function ResultsIcon({ className }: { className?: string }) {
    return (
      <svg 
        className={className} 
        width="102" 
        height="110" 
        viewBox="0 0 102 110" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M87.125 0C81.26 0 76.5 4.73846 76.5 10.5769V99.4231C76.5 105.262 81.26 110 87.125 110H91.375C97.24 110 102 105.262 102 99.4231V10.5769C102 4.73282 97.24 0 91.375 0H87.125ZM38.25 35.9615C38.25 30.1174 43.01 25.3846 48.875 25.3846H53.125C58.9957 25.3846 63.75 30.1231 63.75 35.9615V99.4231C63.75 105.262 58.99 110 53.125 110H48.875C46.0571 110 43.3546 108.886 41.362 106.902C39.3694 104.919 38.25 102.228 38.25 99.4231V35.9615ZM0 61.3462C0 55.5021 4.76 50.7692 10.625 50.7692H14.875C20.7457 50.7692 25.5 55.5077 25.5 61.3462V99.4231C25.5 105.262 20.74 110 14.875 110H10.625C7.80707 110 5.10456 108.886 3.11199 106.902C1.11942 104.919 0 102.228 0 99.4231V61.3462Z" 
          fill="url(#paint0_linear_results)" 
        />
        <defs>
          <linearGradient 
            id="paint0_linear_results" 
            x1="51" 
            y1="-13" 
            x2="51" 
            y2="110" 
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#56CCF2"/>
            <stop offset="1" stopColor="#2F80ED"/>
          </linearGradient>
        </defs>
      </svg>
    )
  }