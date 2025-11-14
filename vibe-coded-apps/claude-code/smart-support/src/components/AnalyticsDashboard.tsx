import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp, AlertTriangle, Lightbulb, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { mockTickets } from '../constants';
import { generateAnalytics, isApiKeyConfigured, AnalyticsInsights } from '../services/geminiService';
import ProcessingView from './ProcessingView';

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<AnalyticsInsights | null>(null);

  const handleGenerateInsights = async () => {
    if (!isApiKeyConfigured()) {
      setError('Please configure your Gemini API key in the .env file to use AI analytics.');
      return;
    }

    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const result = await generateAnalytics(mockTickets);
      setInsights(result);
    } catch (err) {
      setError('Failed to generate insights. Please try again.');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Analytics Officer</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Comprehensive AI-powered analysis of support tickets
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerateInsights}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">
                {loading ? 'Analyzing...' : 'Generate Insights'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty State */}
        {!loading && !insights && !error && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to Analyze Your Support Tickets
              </h2>
              <p className="text-gray-600 mb-6">
                Click "Generate Insights" to get AI-powered analytics on customer sentiment,
                common themes, risk flags, and actionable recommendations.
              </p>
              <p className="text-sm text-gray-500">
                Analyzing {mockTickets.length} support tickets
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ProcessingView message="Analyzing support tickets with AI..." />
          </div>
        )}

        {/* Insights Display */}
        {insights && !loading && (
          <div className="space-y-6">
            {/* Sentiment Analysis */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Overall Customer Sentiment</h2>
                  <p className="text-sm text-gray-500">AI-powered sentiment analysis</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg">{insights.sentiment.overall}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Positive</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{insights.sentiment.positive}%</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Minus className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Neutral</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-600">{insights.sentiment.neutral}%</p>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsDown className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-900">Negative</span>
                  </div>
                  <p className="text-3xl font-bold text-red-600">{insights.sentiment.negative}%</p>
                </div>
              </div>
            </div>

            {/* Common Themes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Common Themes</h2>
                  <p className="text-sm text-gray-500">Patterns identified across tickets</p>
                </div>
              </div>

              <ul className="space-y-3">
                {insights.trends.map((trend, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 pt-0.5">{trend}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* High-Risk Tickets */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">High-Risk Tickets</h2>
                  <p className="text-sm text-gray-500">Tickets requiring immediate attention</p>
                </div>
              </div>

              {insights.riskFlags.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No high-risk tickets identified</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {insights.riskFlags.map((flag, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        flag.severity === 'high'
                          ? 'bg-red-50 border-red-500'
                          : flag.severity === 'medium'
                          ? 'bg-orange-50 border-orange-500'
                          : 'bg-yellow-50 border-yellow-500'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">
                            Ticket {flag.ticketId}
                          </p>
                          <p className="text-gray-700">{flag.reason}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            flag.severity === 'high'
                              ? 'bg-red-100 text-red-800'
                              : flag.severity === 'medium'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {flag.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actionable Recommendations */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Actionable Recommendations</h2>
                  <p className="text-sm text-gray-500">Strategic guidance to improve support</p>
                </div>
              </div>

              <ul className="space-y-3">
                {insights.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800">{recommendation}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
