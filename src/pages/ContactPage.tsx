import { NavBar } from "@/components/navigation/nav-bar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/sections/footer";

export function ContactPage() {
  return (
    <>
      <SEO
        title="Contact Us - CareerPath"
        description="Get in touch with the CareerPath team. We're here to help you navigate your career journey and answer any questions you may have."
        url="https://www.careerpath.dev/contact"
      />
      <div className="flex min-h-svh flex-col">
        <NavBar />
        <main className="w-full max-w-[1550px] mx-auto flex-1 flex items-center justify-center pt-20">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="font-body text-lg text-muted-foreground mb-8">
              Have questions about your career path? Need help with our platform?
              We're here to support your professional development journey.
            </p>
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="font-heading text-xl text-foreground mb-2">Contact Information</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p><strong>Email:</strong> support@careerpath.dev</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Career Street, Professional City, PC 12345</p>
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-heading text-xl text-foreground mb-2">Business Hours</h3>
                  <div className="text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
