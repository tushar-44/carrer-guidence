import { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { useDrawerStore } from "@/stores/drawerStore";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HomeInfoGrid() {
  const [copied, setCopied] = useState(false);
  const { open: openDrawer } = useDrawerStore();
  const gridRef = useRef<HTMLDivElement>(null);

  // Original email for copy functionality
  const originalEmail = "info@careerpath.dev";

  // Email with invisible characters to prevent mobile auto-detection
  const emailDisplay = "info" + String.fromCharCode(8203) + "@" + String.fromCharCode(8203) + "careerpath.dev";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(originalEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleConnectClick = () => {
    console.log('🎯 Opening contact drawer from home section');
    openDrawer();
  };

  useEffect(() => {
    if (gridRef.current) {
      const children = gsap.utils.toArray(gridRef.current.children);

      gsap.fromTo(children,
        {
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <div ref={gridRef} className="flex flex-col gap-8 items-center w-full px-4 sm:px-6 md:px-8">
      {/* Description with better visibility */}
      <div className="relative">
        {/* Text backdrop for better readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl -z-10"></div>
        <p className="font-body font-light text-[16px] sm:text-[18px] md:text-[20px] text-white leading-relaxed text-center max-w-3xl mx-auto px-6 py-4 relative z-10 drop-shadow-lg">
          CareerPath empowers students and professionals to unlock their potential through AI-driven career assessments, one-on-one mentorship from industry leaders, and a comprehensive job marketplace. Whether you're just starting your journey or looking to pivot to a new field, our platform provides the tools, insights, and connections you need to make informed decisions and achieve your career goals with confidence.
        </p>
      </div>

      {/* Contact Info with prominent buttons */}
      <div className="flex flex-col gap-4 items-center w-full">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <button 
            onClick={handleConnectClick} 
            className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-full font-heading text-base sm:text-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 transform hover:scale-105 min-w-[180px] flex items-center justify-center"
          >
            <span className="relative z-10">GET STARTED</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </button>
          <a 
            href="/mentors" 
            className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 rounded-full font-heading text-base sm:text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 transform hover:scale-105 min-w-[180px] flex items-center justify-center text-center"
          >
            <span className="relative z-10">BOOK A MENTOR</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </a>
        </div>
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <button
            onClick={handleCopy}
            className="transition-opacity p-1 hover:bg-white/20 rounded z-10 cursor-pointer"
            aria-label="Copy email address"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
            <Copy className="w-4 h-4 text-white/80 hover:text-white" />
            )}
          </button>
          <span className="font-body font-light text-sm sm:text-base text-white drop-shadow-md">
            {emailDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}
