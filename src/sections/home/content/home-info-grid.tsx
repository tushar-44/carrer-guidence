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
    <div ref={gridRef} className="flex flex-col gap-8 items-center">
      {/* Description */}
      <p className="font-body font-light text-[18px] text-white leading-relaxed text-center max-w-2xl">
        CareerPath empowers students and professionals to unlock their potential through AI-driven career assessments, one-on-one mentorship from industry leaders, and a comprehensive job marketplace. Whether you're just starting your journey or looking to pivot to a new field, our platform provides the tools, insights, and connections you need to make informed decisions and achieve your career goals with confidence.
      </p>

      {/* Contact Info */}
      <div className="flex flex-col gap-3 items-center">
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleConnectClick} className="bg-brand-gold text-brand-slate hover:bg-brand-gold/90 px-6 py-3 rounded-full font-heading text-sm">Get Started</button>
          <a href="/mentors" className="bg-brand-green text-brand-cream hover:bg-brand-green/90 px-6 py-3 rounded-full font-heading text-sm inline-block text-center">Book a Mentor</a>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="transition-opacity p-1 hover:bg-accent rounded z-10 cursor-pointer"
            aria-label="Copy email address"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
            <Copy className="w-4 h-4 text-slate-700 hover:text-slate-900" />
            )}
          </button>
          <span className="font-body font-light text-base text-white">
            {emailDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}
