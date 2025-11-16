import type { ContentSection } from './types';

export const challengeContent: ContentSection = {
  id: 'challenge',
  title: 'Challenge 🎯',
  content: '',
  subsections: [
    {
      title: 'Business Pain Points',
      content: `Manual campaign creation takes excessive time and introduces costly human errors that delay launches and reduce efficiency for enterprise advertising agencies.`
    },
    {
      title: 'Technical Constraints',
      content: `• **💰 Near-zero budget** for development and infrastructure
• **🏢 Microsoft ecosystem requirement** - Client needed seamless integration with existing Microsoft ecosystem (Forms + Power Automate)
• **🔒 No OAuth permissions** allowed for security reasons
• **💸 Power Automate HTTP API costs** - HTTP API calls incur additional costs, making standard API integration financially prohibitive
• **⚡ Zero setup requirement** - Solution must require zero complex setup from agency users`
    },
    {
      title: 'User Needs',
      content: `One-click campaign creation that works within existing Microsoft workflows without additional authentication or technical overhead.`
    }
  ]
};