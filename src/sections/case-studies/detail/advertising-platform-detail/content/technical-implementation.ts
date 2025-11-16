import type { ContentSection } from './types';

export const technicalImplementationContent: ContentSection = {
  id: 'technical-implementation',
  title: 'Technical Implementation ⚙️',
  content: '',
  subsections: [
    {
      title: '📧 Email-Based Integration Architecture',
      content: `**Microsoft Ecosystem Integration**

• Microsoft Form submission triggers Power Automate workflow
• Power Automate transforms form Q&A into structured JSON payload
• JSON sent via email to unique organisation address: \`forms+uuid@unyte.ai\`
• ForwardEmail.net catches emails and forwards to Supabase webhook
• UUID enables automatic attribution to correct organisation/account
• Form data appears instantly in organisation's Unyte dashboard`
    },
    {
      title: '🚀 Multi-Platform Campaign Generation',
      content: `**Automated Campaign Creation**

• Click "Create Campaign for [Platform]" within form details
• Client information auto-populates platform-specific campaign forms
• All required fields filled automatically based on form submission data
• Single-click campaign submission to Google Ads, Meta, TikTok, LinkedIn, or other platforms`
    },
    {
      title: '🏢 Multi-Tenant Architecture',
      content: `**Scalable Organisation Management**

• UUID-based organisation isolation
• Secure data segregation between agency accounts
• Scalable email routing system supporting unlimited organisations
• Cost-effective solution that bypasses expensive API integration costs`
    }
  ]
};