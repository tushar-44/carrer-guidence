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

export function Home() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
    >
      {/* Hero Section */}
      <div className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center" style={{ backgroundImage: "url('/Untitled design (1).png')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-16 flex flex-col items-center gap-8">
          <HomeTitle />
          <HomeInfoGrid />
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
