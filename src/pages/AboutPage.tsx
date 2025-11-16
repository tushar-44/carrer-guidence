import { NavBar } from "@/components/navigation/nav-bar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/sections/footer";
import { Dashboard } from "@/sections/about-me";

export function AboutPage() {
  return (
    <>
      <SEO
        title="About CareerPath - Your Career Development Platform"
        description="Learn about CareerPath's mission to revolutionize career development through AI-powered assessments, expert mentorship, and personalized guidance."
        url="https://www.careerpath.dev/about"
      />
      <div className="flex min-h-svh flex-col">
        <NavBar />
        <main className="w-full max-w-[1550px] mx-auto flex-1 pt-20">
          <Dashboard />
        </main>
        <Footer />
      </div>
    </>
  );
}
