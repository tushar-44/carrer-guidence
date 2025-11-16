"use client";
import { useRef } from 'react';
import { HeroContent } from '@/sections/home/content/hero-content';
import MentorScene from '@/components/home/MentorScene';
import FloatingEducationIcon from '@/components/home/FloatingEducationIcon';

export default function HeroSection() {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <section ref={ref} className="relative w-full overflow-hidden pt-8">
      <div className="max-w-6xl mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 relative">
          <HeroContent />
        </div>

        <div className="flex-1 relative">
          <MentorScene />
          <div className="absolute top-6 right-6">
            <FloatingEducationIcon />
          </div>
        </div>
      </div>
    </section>
  );
}
