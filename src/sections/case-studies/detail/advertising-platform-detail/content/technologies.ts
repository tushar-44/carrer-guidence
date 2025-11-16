import type { ContentSection } from './types';

export const technologiesContent: ContentSection = {
  id: 'technologies',
  title: 'Technologies Used 🛠️',
  content: '',
  subsections: [
    {
      title: 'Frontend & Framework',
      content: `• **Next.js 15** - React-based full-stack framework
• **TypeScript** - Type-safe development
• **React 19** - Modern UI components
• **shadcn/ui** - Component library and design system`
    },
    {
      title: 'Backend & Database',
      content: `• **Supabase** - PostgreSQL database and authentication
• **ForwardEmail.net** - Email forwarding service`
    },
    {
      title: 'Integrations',
      content: `• **Google Ads API** - Campaign creation automation
• **Meta API** - Facebook/Instagram advertising
• **TikTok API** - TikTok advertising campaigns
• **LinkedIn API** - Professional network advertising
• **Microsoft Forms** - Client data collection
• **Power Automate** - Microsoft workflow automation`
    },
    {
      title: 'Infrastructure',
      content: `• **Vercel** - Deployment and hosting
• **Email-based architecture** - Cost-effective integration layer`
    }
  ]
};