import type { ContentSection } from './types';

export const technologiesContent: ContentSection = {
  id: 'technologies',
  title: 'Technologies Used 🛠️',
  content: '',
  subsections: [
    {
      title: 'Frontend & Framework',
      content: `• **Next.js** - React-based full-stack framework for server-side rendering
• **React 19** - Modern UI components with advanced hooks and state management
• **TypeScript** - Type-safe development across the entire application
• **Three.js** - 3D graphics library for interactive T-shirt visualization
• **Fabric.js** - Canvas library for professional design editing tools`
    },
    {
      title: 'AI & Machine Learning',
      content: `• **OpenAI GPT-4o-mini** - Brand analysis and customer persona generation
• **Replicate API** - Flux models for high-quality design generation
• **OpenCV** - Computer vision algorithms for edge detection and image processing
• **Custom AI Pipeline** - Multi-modal coordination for research, analysis, and generation`
    },
    {
      title: 'Backend & Database',
      content: `• **MongoDB** - NoSQL database for flexible schema and complex nested data
• **Prisma ORM** - Type-safe database access and schema management
• **Flask** - Microservice for computer vision processing (deployed on Render)
• **Sharp** - High-performance image processing library`
    },
    {
      title: 'Authentication & Payments',
      content: `• **Clerk** - Complete authentication system with user management
• **Stripe** - Subscription billing and payment processing`
    },
    {
      title: 'State Management & Optimisation',
      content: `• **Valtio** - Reactive state management for complex UI interactions
• **Custom Hooks** - Specialised React hooks for 3D canvas and editor synchronisation`
    },
    {
      title: 'Deployment & DevOps',
      content: `• **Vercel** - Next.js application hosting and deployment
• **Render** - Computer vision microservice deployment`
    }
  ]
};