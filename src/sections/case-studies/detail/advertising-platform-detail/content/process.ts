import type { ContentSection } from './types';

export const processContent: ContentSection = {
  id: 'process',
  title: 'Process 🔄',
  content: '',
  subsections: [
    {
      title: 'Development Methodology',
      content: `**Waterfall approach:** 6-week development cycle with daily client updates ensuring alignment on business requirements and technical constraints.`
    },
    {
      title: 'Client Collaboration',
      content: `• **🤝 Continuous communication:** Client updates every 1-2 days to validate technical approach
• **📋 Requirements validation:** Daily feedback sessions on architecture decisions
• **🔍 Solution alignment:** Ensuring technical approach met all business constraints`
    },
    {
      title: 'Solution Exploration',
      content: `• **🔍 Multi-approach evaluation:** Extensive evaluation of multiple integration approaches before selecting email-based solution
• **💡 Creative problem-solving:** Email-based architecture emerged as optimal solution meeting all technical and budget constraints
• **✅ Constraint satisfaction:** Final solution satisfied every business and technical requirement`
    }
  ]
};