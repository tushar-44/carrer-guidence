import { MobileHome } from "@/sections/home-mobile";
import { HowIWorkMobile } from "@/sections/how-i-work-mobile";
import { CaseStudiesMobile } from "@/sections/case-studies-mobile";
import { SkillsMobile } from "@/sections/skills-mobile";
import { AboutMeMobile } from "@/sections/about-me-mobile";
import { MobileFooter } from "@/sections/footer-mobile";
import { Sidebar } from "@/components/navigation/sidebar/sidebar";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export function MobileHomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Global Progressive Blur at top of screen */}
      <ProgressiveBlur
        direction="top"
        className="fixed top-0 left-0 w-full h-32 z-40 pointer-events-none"
        blurIntensity={1}
      />
      
      {/* Add the existing Sidebar component */}
      <Sidebar />
      
      {/* Mobile Home Section */}
      <MobileHome />
      
      {/* Mobile How I Work Section */}
      <HowIWorkMobile />
      
      {/* Mobile Case Studies Section */}
      <CaseStudiesMobile />

      {/* Mobile Skills Section */}
      <SkillsMobile />

      {/* Mobile About Me Section */}
      <AboutMeMobile />

      {/* Mobile Footer Section */}
      <MobileFooter />
    </div>
  );
}