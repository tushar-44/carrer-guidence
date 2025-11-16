import type { ContentSection } from './types';

export const processContent: ContentSection = {
  id: 'process',
  title: 'Process 🔄',
  content: '',
  subsections: [
    {
      title: 'Development Methodology',
      content: `**Iterative Build-and-Test Approach:** 6-month solo development cycle with continuous market validation`
    },
    {
      title: 'Market Collaboration',
      content: `• **Designer Feedback Loop:** Regular testing with fashion designers for UI/UX optimisation
• **User Validation:** Iterative improvements based on real user interactions with 75+ active users
• **Market Research:** Continuous analysis of fashion trends and brand needs`
    },
    {
      title: 'Technical Evolution',
      content: `• **Infrastructure Learning:** Discovered the importance of building core functionality first
• **Performance Optimisation:** Implemented object pooling, canvas caching, and progressive loading
• **Patent Integration:** Developed sophisticated user preference prediction algorithms`
    }
  ]
};