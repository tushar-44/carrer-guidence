export const getPersonStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CareerPath",
    "url": "https://www.careerpath.dev",
    "logo": "https://www.careerpath.dev/logo.png",
    "description": "AI-powered career guidance platform connecting students with expert mentors and personalized career assessments",
    "foundingDate": "2024",
    "sameAs": [
      "https://www.linkedin.com/company/careerpath",
      "https://github.com/careerpath"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@careerpath.dev",
      "contactType": "customer service"
    },
    "knowsAbout": [
      "Career Guidance",
      "Mentorship",
      "Career Assessment",
      "Job Search",
      "Professional Development",
      "AI Technology",
      "Education Technology"
    ]
  });
  
export const getWebSiteStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CareerPath - Career Guidance Platform",
    "url": "https://www.careerpath.dev",
    "description": "CareerPath - Find your perfect career path with real-time guidance",
    "publisher": {
      "@type": "Organization",
      "name": "CareerPath"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.careerpath.dev/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  });
  
  export const getServiceStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Software Development",
    "provider": {
      "@type": "Person",
      "name": "Stavros Symeonidis"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Global"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Process Automation",
            "description": "Build custom LLM solutions and workflows to eliminate repetitive tasks"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "API Integration Solutions",
            "description": "Connect your systems seamlessly—from Xero to Shopify"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Intelligence Dashboards",
            "description": "Transform scattered data into actionable insights"
          }
        },
        {
            "@type": "Offer", 
            "itemOffered": {
                "@type": "Service",
                "name": "Predictive Analytics Models", 
                "description": "Forecast cash flow and business trends using machine learning on your Xero and CRM data"
            }
        }
      ]
    }
  });
  
  export const getCaseStudyStructuredData = (caseStudy: {
    title: string;
    description: string;
    image: string;
    url: string;
    datePublished: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.title,
    "description": caseStudy.description,
    "image": caseStudy.image,
    "url": caseStudy.url,
    "datePublished": caseStudy.datePublished,
    "author": {
      "@type": "Person",
      "name": "Stavros Symeonidis"
    },
    "publisher": {
      "@type": "Person",
      "name": "Stavros Symeonidis"
    }
  });