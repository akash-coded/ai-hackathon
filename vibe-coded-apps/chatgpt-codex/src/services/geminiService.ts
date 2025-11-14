import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Ticket } from '../constants';

// Initialize Gemini API only when a key is provided.
const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

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
  meta?: {
    source: 'gemini' | 'heuristic';
    note?: string;
  };
}

export interface QuickSummaryResult {
  text: string;
  source: 'gemini' | 'heuristic';
}

function countBy<T extends string | number>(items: T[]): Record<T, number> {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function getTopThemes(tickets: Ticket[]): string[] {
  const categoryCounts = Object.entries(countBy(tickets.map((t) => t.category)));
  categoryCounts.sort((a, b) => b[1] - a[1]);

  const themes: string[] = categoryCounts.slice(0, 3).map(([category, count]) => {
    const percentage = Math.round((count / tickets.length) * 100);
    return `${category} issues represent ${percentage}% of all tickets.`;
  });

  if (!themes.length) {
    themes.push('No dominant trends detected across the current ticket set.');
  }

  const escalationCount = tickets.filter((ticket) => ticket.status === 'escalated').length;
  if (escalationCount > 0) {
    themes.push(`${escalationCount} ticket${escalationCount > 1 ? 's' : ''} have been escalated and require rapid follow-up.`);
  }

  return themes.slice(0, 4);
}

function buildRiskFlags(tickets: Ticket[]): AnalyticsInsights['riskFlags'] {
  return tickets
    .filter((ticket) => ticket.priority === 'critical' || ticket.status === 'escalated')
    .map((ticket) => ({
      ticketId: ticket.id,
      reason:
        ticket.priority === 'critical'
          ? 'Critical priority ticket outstanding – customer impact likely severe.'
          : 'Escalated ticket requires leadership visibility and fast resolution.',
      severity: ticket.priority === 'critical' ? 'high' : 'medium'
    }));
}

function buildRecommendations(tickets: Ticket[]): string[] {
  const escalatedBilling = tickets.some(
    (ticket) => ticket.category.toLowerCase().includes('billing') && ticket.status === 'escalated'
  );
  const slowPerformance = tickets.some(
    (ticket) => ticket.category.toLowerCase().includes('performance') || ticket.issue.toLowerCase().includes('slow')
  );
  const documentationIssues = tickets.some((ticket) => ticket.category.toLowerCase().includes('documentation'));

  const recommendations: string[] = [];

  if (escalatedBilling) {
    recommendations.push(
      'Coordinate with finance to resolve escalated billing disputes within 24 hours and proactively communicate updates to affected customers.'
    );
  }

  if (slowPerformance) {
    recommendations.push(
      'Prioritise a performance triage: capture load metrics and deploy short-term fixes to improve dashboard responsiveness.'
    );
  }

  if (documentationIssues) {
    recommendations.push('Refresh the API integration documentation with a guided setup flow to reduce onboarding friction.');
  }

  if (!recommendations.length) {
    recommendations.push('Maintain current service levels and continue monitoring for new patterns in customer feedback.');
  }

  recommendations.push('Introduce a weekly cross-functional review of high-priority tickets to improve time-to-resolution.');

  return recommendations;
}

function getSentimentSplit(tickets: Ticket[]): AnalyticsInsights['sentiment'] {
  const total = tickets.length || 1;
  const negative = tickets.filter((ticket) => ticket.priority === 'critical' || ticket.status === 'escalated').length;
  const positive = tickets.filter((ticket) => ticket.status === 'resolved').length;
  const neutral = total - negative - positive;

  const positivePct = Math.round((positive / total) * 100);
  const neutralPct = Math.max(0, Math.round((neutral / total) * 100));
  const negativePct = Math.max(0, 100 - positivePct - neutralPct);

  let overall = 'Customer sentiment is stable with a balanced mix of open and resolved conversations.';
  if (negativePct >= 40) {
    overall = 'Customer sentiment is trending negative due to several critical or escalated issues awaiting action.';
  } else if (positivePct >= 40) {
    overall = 'Customer sentiment is cautiously positive thanks to the steady resolution of support requests.';
  }

  return {
    overall,
    positive: positivePct,
    neutral: neutralPct,
    negative: negativePct
  };
}

function generateHeuristicAnalytics(tickets: Ticket[]): AnalyticsInsights {
  return {
    sentiment: getSentimentSplit(tickets),
    trends: getTopThemes(tickets),
    riskFlags: buildRiskFlags(tickets),
    recommendations: buildRecommendations(tickets),
    meta: {
      source: 'heuristic',
      note:
        'Insights generated with on-device heuristics. Provide a Gemini API key to unlock live generative analysis.'
    }
  };
}

/**
 * Generates comprehensive analytics insights from all support tickets
 */
export async function generateAnalytics(tickets: Ticket[]): Promise<AnalyticsInsights> {
  if (!genAI) {
    return generateHeuristicAnalytics(tickets);
  }

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
    return {
      ...insights,
      meta: {
        source: 'gemini',
        note: 'Insights generated with Gemini 1.5 Flash.'
      }
    };
  } catch (error) {
    console.error('Error generating analytics:', error);

    // Return fallback insights if API fails
    return generateHeuristicAnalytics(tickets);
  }
}

/**
 * Generates a quick one-sentence summary of a support ticket
 */
function heuristicSummary(ticket: Ticket): QuickSummaryResult {
  const urgency =
    ticket.priority === 'critical'
      ? 'needs urgent attention from the team'
      : ticket.priority === 'high'
      ? 'should be addressed in the next response cycle'
      : 'can be resolved during regular support hours';

  const baseIssue = ticket.issue.trim().replace(/\.$/, '');
  const normalizedIssue =
    baseIssue.length > 0
      ? baseIssue.charAt(0).toLowerCase() + baseIssue.slice(1)
      : 'the customer raised an issue';

  const statusNote =
    ticket.status === 'resolved'
      ? 'is already resolved—confirm customer satisfaction'
      : ticket.status === 'in-progress'
      ? 'is actively being worked on—keep the customer informed'
      : ticket.status === 'escalated'
      ? 'is escalated and requires leadership alignment'
      : 'is waiting in the queue for triage';

  return {
    text: `${ticket.customer} reports a ${ticket.priority} ${ticket.category.toLowerCase()} issue where ${normalizedIssue}, ${urgency}, and ${statusNote}.`,
    source: 'heuristic'
  };
}

export async function getQuickSummary(ticket: Ticket): Promise<QuickSummaryResult> {
  if (!genAI) {
    return heuristicSummary(ticket);
  }

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

    return {
      text: summary,
      source: 'gemini'
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    return heuristicSummary(ticket);
  }
}

/**
 * Validates if the Gemini API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return API_KEY.length > 0;
}
