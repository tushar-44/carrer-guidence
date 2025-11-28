import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HomeTitle } from './content/home-title'
import { HomeInfoGrid } from './content/home-info-grid'
import { AvailabilityStatus } from './content/availability-status'
import { WhatIsCareerPath } from './content/what-is-careerpath'
import { FeaturesOverview } from './content/features-overview'
import { StatsSection } from './content/stats-section'
import { HowItWorks } from './content/how-it-works'
import { WhyCareerPath } from './content/why-careerpath'
import { Testimonials } from './content/testimonials'
import { TrustSignals } from './content/trust-signals'

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      // Advanced scroll-triggered animations for sections
      const sections = gsap.utils.toArray<HTMLElement>('.animate-on-scroll');

      if (sections.length > 0) {
        sections.forEach((section, index) => {
          if (section) {
            gsap.fromTo(section,
              {
                opacity: 0,
                y: 80,
                scale: 0.9,
                rotationX: -15
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationX: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 85%",
                  end: "bottom 20%",
                  toggleActions: "play none none reverse",
                  markers: false
                },
                delay: index * 0.1
              }
            );
          }
        });
      }

      // Parallax effect for hero background
      const heroSection = document.querySelector('#home > div:first-child');
      if (heroSection) {
        gsap.to(heroSection, {
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
    >
      {/* Hero Section with Background Image */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Optimized background image with lazy loading */}
        <img 
          src="/final-image.png"
          alt="Hero background"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700"
          onLoad={(e) => {
            (e.target as HTMLImageElement).style.opacity = '1';
          }}
        />
        
        {/* Advanced gradient overlays for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-blue-900/30"></div>
        {/* Additional overlay for text area */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)' }}></div>
        
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 blur-sm"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: Math.random() * 2 + 's'
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 md:px-8 lg:px-16 flex flex-col items-center gap-10 w-full pt-24 sm:pt-32 md:pt-40">
          {/* Text above image row */}
          <div className="flex flex-col items-center gap-10 mb-12 sm:mb-16 w-full">
            <div className="w-full">
              <HomeTitle />
            </div>
            <div className="w-full">
              <HomeInfoGrid />
            </div>
          </div>

          {/* Character illustrations row with advanced animations */}
          <div className="mt-12 sm:mt-16 flex justify-center gap-3 sm:gap-4 md:gap-6 w-full flex-wrap px-4">
            {[
              { src: "/9881382.jpg", alt: "Character 1", delay: 0 },
              { src: "/14140043_5384286.jpg", alt: "Character 2", delay: 0.1 },
              { src: "/42113142_8899769.jpg", alt: "Character 3", delay: 0.2 },
              { src: "/91730735_10058509.jpg", alt: "Character 4", delay: 0.3 }
            ].map((char, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${char.delay}s both`
                }}
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/30 group-hover:border-white/60 transition-all duration-300 shadow-lg">
                  <img 
                    src={char.src} 
                    alt={char.alt} 
                    className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-white/40 group-hover:border-white/80 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-purple-500/50" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/60 text-sm font-body">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Status */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <AvailabilityStatus />
      </div>

      {/* What is CareerPath Section */}
      <div className="bg-transparent">
        <WhatIsCareerPath />
      </div>

      {/* Features Overview Section */}
      <div className="bg-slate-900">
        <FeaturesOverview />
      </div>

      {/* Stats Section */}
      <div className="bg-transparent">
        <StatsSection />
      </div>

      {/* How It Works Section */}
      <div className="bg-slate-900">
        <HowItWorks />
      </div>

      {/* Why CareerPath Section */}
      <div className="bg-transparent">
        <WhyCareerPath />
      </div>

      {/* Testimonials Section */}
      <div className="bg-slate-900">
        <Testimonials />
      </div>

      {/* Trust Signals Section */}
      <div className="bg-transparent">
        <TrustSignals />
      </div>
    </section>
  )
}
