import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WhatIsCareerPath } from './content/what-is-careerpath'
import { FeaturesOverview } from './content/features-overview'
import { StatsSection } from './content/stats-section'
import { HowItWorks } from './content/how-it-works'
import { WhyCareerPath } from './content/why-careerpath'
import { Testimonials } from './content/testimonials'
import { TrustSignals } from './content/trust-signals'
import { HeroContent } from './content/hero-content'

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Scroll-triggered animations for sections
    const sections = gsap.utils.toArray<HTMLElement>('.animate-on-scroll');

    sections.forEach((section) => {
      gsap.fromTo(section,
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
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
    >
      {/* Hero Section */}
      <div className="relative h-screen">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="/final image.png"
          alt="Hero Background"
        />
        <HeroContent />
      </div>

      {/* What is CareerPath Section */}
      <div className="animate-on-scroll">
        <WhatIsCareerPath />
      </div>

      {/* Features Overview Section */}
      <div className="animate-on-scroll">
        <FeaturesOverview />
      </div>

      {/* Stats Section */}
      <div className="animate-on-scroll">
        <StatsSection />
      </div>

      {/* How It Works Section */}
      <div className="animate-on-scroll">
        <HowItWorks />
      </div>

      {/* Why CareerPath Section */}
      <div className="animate-on-scroll">
        <WhyCareerPath />
      </div>

      {/* Testimonials Section */}
      <div className="animate-on-scroll">
        <Testimonials />
      </div>

      {/* Trust Signals Section */}
      <div className="animate-on-scroll">
        <TrustSignals />
      </div>
    </section>
  )
}
