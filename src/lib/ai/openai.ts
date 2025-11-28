// OpenAI Client Configuration
import OpenAI from 'openai';

const apiKey = import.meta.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key not configured. AI features will be disabled.');
}

export const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Only for development, move to backend in production
}) : null;

export const isOpenAIConfigured = !!apiKey;

// Helper function to check if OpenAI is available
export const checkOpenAIAvailability = (): boolean => {
  if (!isOpenAIConfigured) {
    console.warn('OpenAI is not configured. Please add OPENAI_API_KEY to your environment variables.');
    return false;
  }
  return true;
};