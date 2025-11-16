import type { ContentSection } from './types';

export const reflectionContent: ContentSection = {
  id: 'reflection',
  title: 'Reflection 💭',
  content: '',
  subsections: [
    {
      title: 'Key Learnings',
      content: `**Architecture Prioritisation:** The most valuable lesson was focusing on core functionality (AI research, design generation, 3D visualisation) before building supporting infrastructure (authentication, payments, database optimisation). This approach accelerated user validation and market feedback.`
    },
    {
      title: 'Technical Achievements',
      content: `• Successfully coordinated multiple AI models for cohesive design generation
• Implemented sophisticated 3D texture mapping with real-time preview capabilities
• Won patent award (US #US10324916B2) in IP Hatch UK 2023 pitch competition
• Selected for elite AI Forge accelerator (12 of 500+ applicants) with this project
• Achieved smooth performance with complex 3D rendering and AI processing`
    },
    {
      title: 'Future Enhancements',
      content: `• **Enhanced Prediction Accuracy:** Deeper integration of device data and user behaviour patterns
• **Expanded Design Types:** Support for additional garment types beyond T-shirts
• **Collaborative Features:** Team-based design workflows for larger fashion brands
• **Performance Scaling:** Optimised infrastructure for handling larger user bases`
    }
  ]
};