import type { ContentSection } from './types';

export const solutionContent: ContentSection = {
  id: 'solution',
  title: 'Solution ✨',
  content: '',
  subsections: [
    {
      title: 'High-Level Approach',
      content: `Built an innovative email-based integration that transforms Microsoft Forms submissions into automated campaign setups across multiple advertising platforms.`
    },
    {
      title: 'Core Features',
      content: `• **🔄 Seamless Microsoft Forms integration** via Power Automate
• **🆔 UUID-based email routing** for multi-tenant organisation attribution
• **📝 Auto-populated campaign forms** for Google Ads, Meta, TikTok, LinkedIn, and other platforms
• **🎯 One-click campaign submission** workflow`
    },
    {
      title: 'Architecture Overview',
      content: `**Email-based Integration:** Email serves as the integration layer between Microsoft ecosystem and Unyte platform

**Multi-Platform Support:** Single form submission creates campaigns across Google Ads, Meta, TikTok, LinkedIn, and other major platforms

**Multi-Tenant Architecture:** UUID-based organisation routing with ForwardEmail.net providing reliable message routing to Supabase backend`
    }
  ]
};