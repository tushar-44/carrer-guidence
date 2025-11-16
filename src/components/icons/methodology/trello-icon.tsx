export function TrelloIcon({ className }: { className?: string }) {
    return (
      <svg 
        className={className} 
        width="28" 
        height="28" 
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M24.14 0.5H3.87714C2.012 0.5 0.5 2.01104 0.5 3.875V24.125C0.5 25.989 2.012 27.5 3.87714 27.5H24.14C25.9985 27.4905 27.5 25.9823 27.5 24.125V3.875C27.5 2.0177 25.9985 0.509427 24.14 0.5ZM6.125 3.875H10.625C11.8677 3.875 12.875 4.88236 12.875 6.125V21.875C12.875 23.1177 11.8677 24.125 10.625 24.125H6.125C4.88236 24.125 3.875 23.1177 3.875 21.875V6.125C3.875 4.88236 4.88236 3.875 6.125 3.875ZM21.875 3.875H17.375C16.1323 3.875 15.125 4.88236 15.125 6.125V14C15.125 15.2427 16.1323 16.25 17.375 16.25H21.875C23.1177 16.25 24.125 15.2427 24.125 14V6.125C24.125 4.88236 23.1177 3.875 21.875 3.875Z" 
          fill="url(#paint0_linear_trello)" 
        />
        <defs>
          <linearGradient 
            id="paint0_linear_trello" 
            x1="14.0086" 
            y1="27.5" 
            x2="14.0086" 
            y2="0.5" 
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0052CC"/>
            <stop offset="0.51698" stopColor="#217EF8"/>
            <stop offset="1" stopColor="#2684FF"/>
          </linearGradient>
        </defs>
      </svg>
    )
  }