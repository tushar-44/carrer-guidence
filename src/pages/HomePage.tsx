import { SEO } from "@/components/seo/SEO";
import { Home } from "@/sections/home/index-new";

export function HomePage() {
  console.log("HomePage Mounted");

  return (
    <>
      <SEO
        title="CareerPath - Find Your Perfect Career Path"
        description="Discover your ideal career in just 3 steps! Take our comprehensive career aptitude assessment to find the perfect career path for you."
        url="https://www.careerpath.dev"
      />
      <Home />
    </>
  );
}
