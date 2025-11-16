import { SEO } from "@/components/seo/SEO";
import { Jobs } from "@/sections/skills";

export function JobsPage() {
  return (
    <>
      <SEO
        title="Explore Global Job Listings - CareerPath"
        description="Find your dream job with our curated global job listings. Filter by stream, salary, and location to discover opportunities that match your career goals."
        url="https://www.careerpath.dev/jobs"
      />
      <Jobs />
    </>
  );
}
