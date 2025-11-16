import { ContactForm } from "../footer/contact-form";
import { FooterBottom } from "../footer/footer-bottom";
import { FooterHero } from "../footer/footer-hero";


export function MobileFooter() {
  return (
    <section 
      id="footer-mobile" 
      className="w-full px-2.5 my-12"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Hero Content */}
          <FooterHero />

          {/* Right Column - Contact Form */}
          <ContactForm />
        </div>

        {/* Bottom Section */}
        <FooterBottom />
      </div>
    </section>
  );
}