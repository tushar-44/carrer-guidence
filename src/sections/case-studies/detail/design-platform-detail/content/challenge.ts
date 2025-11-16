import type { ContentSection } from './types';

export const challengeContent: ContentSection = {
  id: 'challenge',
  title: 'Challenge 🎯',
  content: '',
  subsections: [
    {
      title: 'Business Pain Points',
      content: `Small T-shirt brands face three critical challenges that limit their growth and market success:

• **Design Direction Uncertainty:** Brands don't know what designs will resonate with their target market
• **Technical Design Barriers:** Limited access to professional design tools and expertise
• **Customer Understanding Gap:** Lack of insight into who their ideal customers are and what they prefer`
    },
    {
      title: 'Technical Constraints',
      content: `• **User Taste Prediction:** Need for sophisticated algorithms to predict individual customer preferences
• **Real-time 3D Rendering:** Complex texture mapping and UV coordinate management for interactive visualisation
• **Multi-Modal AI Integration:** Coordinating brand research, customer analysis, and design generation systems
• **Performance Optimisation:** Maintaining smooth user experience with heavy 3D rendering and AI processing`
    },
    {
      title: 'User Needs',
      content: `Fashion entrepreneurs needed a solution that could function as a complete design agency, providing market research, customer insights, and professional-quality design output without requiring technical expertise or significant upfront investment.`
    }
  ]
};