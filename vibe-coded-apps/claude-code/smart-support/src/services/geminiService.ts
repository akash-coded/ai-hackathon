import { GoogleGenerativeAI } from '@google/generative-ai';
import { Ticket } from '../constants';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AnalyticsInsights {
  sentiment: {
    overall: string;
    positive: number;
    neutral: number;
    negative: number;
  };
  trends: string[];
  riskFlags: {
    ticketId: string;
    reason: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  recommendations: string[];
}

/**
 * Generates comprehensive analytics insights from all support tickets
 */
export async function generateAnalytics(tickets: Ticket[]): Promise<AnalyticsInsights> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze the following support tickets and provide comprehensive business insights in JSON format.

Support Tickets:
${JSON.stringify(tickets, null, 2)}

Please provide a detailed analysis with the following structure:
{
  "sentiment": {
    "overall": "positive/neutral/negative description",
    "positive": number (percentage 0-100),
    "neutral": number (percentage 0-100),
    "negative": number (percentage 0-100)
  },
  "trends": [
    "trend description 1",
    "trend description 2",
    "trend description 3"
  ],
  "riskFlags": [
    {
      "ticketId": "ticket id",
      "reason": "why this is high risk",
      "severity": "high/medium/low"
    }
  ],
  "recommendations": [
    "actionable recommendation 1",
    "actionable recommendation 2",
    "actionable recommendation 3"
  ]
}

Focus on:
- Customer sentiment patterns
- Common pain points and themes
- Tickets that pose business risks (billing issues, critical bugs, escalations)
- Actionable strategic guidance for improving customer satisfaction

Return ONLY valid JSON, no markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const insights: AnalyticsInsights = JSON.parse(cleanedText);
    return insights;
  } catch (error) {
    console.error('Error generating analytics:', error);

    // Return fallback insights if API fails
    return {
      sentiment: {
        overall: 'Unable to analyze sentiment. Please check your API connection.',
        positive: 0,
        neutral: 0,
        negative: 0
      },
      trends: ['Unable to generate trends. Please check your Gemini API key.'],
      riskFlags: [],
      recommendations: ['Please configure your Gemini API key to enable AI analytics.']
    };
  }
}

/**
 * Generates a quick one-sentence summary of a support ticket
 */
export async function getQuickSummary(ticket: Ticket): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Provide a concise one-sentence summary of this support ticket:

Customer: ${ticket.customer}
Issue: ${ticket.issue}
Priority: ${ticket.priority}
Category: ${ticket.category}

Summary (one sentence only, focus on the core problem):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Unable to generate summary. Please check your Gemini API key configuration.';
  }
}

/**
 * Validates if the Gemini API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return API_KEY.length > 0;
}
