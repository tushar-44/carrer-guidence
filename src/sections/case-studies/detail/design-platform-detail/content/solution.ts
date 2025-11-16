import type { ContentSection } from './types';

export const solutionContent: ContentSection = {
  id: 'solution',
  title: 'Solution ✨',
  content: '',
  subsections: [
    {
      title: 'High-Level Approach',
      content: `Built an AI-powered fashion design platform that acts as a complete design agency, combining intelligent market research with visual design generation and interactive 3D preview capabilities.`
    },
    {
      title: 'Core Features',
      content: `• **🔍 AI Research Engine:** Automated brand analysis and customer persona generation using GPT-4
• **🎨 Smart Design Creation:** AI-generated visual designs tailored to brand identity and target market
• **👕 Interactive 3D Visualisation:** Real-time T-shirt preview with advanced texture mapping
• **✏️ Professional Editor:** Vector-based design editing with OpenCV-powered shape detection
• **🔮 Predictive Taste Technology:** Patent-pending system for understanding customer preferences`
    },
    {
      title: 'Architecture Overview',
      content: `**Multi-tier AI Pipeline:** Research → Analysis → Generation → Visualisation → Editing

**Microservices Design:** Separate computer vision service for image processing

**Real-time 3D Rendering:** Three.js with advanced UV mapping and texture management

**Scalable Backend:** Next.js with MongoDB for flexible data architecture`
    }
  ]
};