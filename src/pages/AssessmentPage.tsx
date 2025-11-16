import { SEO } from "@/components/seo/SEO";
import AssessmentPage from "@/app/(main)/assessment/page";

export function AssessmentPageWrapper() {
  return (
    <>
      <SEO
        title="Career Aptitude Assessment - CareerPath"
        description="Discover your ideal career in just 3 steps! Take our comprehensive career aptitude assessment to find the perfect career path for you."
        url="https://www.careerpath.dev/assessment"
      />
      <AssessmentPage />
    </>
  );
}
