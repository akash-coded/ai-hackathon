import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { mockTickets, TICKET_STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import { getQuickSummary } from '../services/geminiService';
import type { QuickSummaryResult } from '../services/geminiService';

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);
  const [activeSummary, setActiveSummary] = useState<
    { ticketId: string; text: string; source?: QuickSummaryResult['source'] } | null
  >(null);

  const handleQuickSummary = async (ticketId: string) => {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    setLoadingSummary(ticketId);
    setActiveSummary(null);

    try {
      const summary = await getQuickSummary(ticket);
      setActiveSummary({ ticketId, text: summary.text, source: summary.source });
    } catch (error) {
      setActiveSummary({
        ticketId,
        text: 'Failed to generate summary. Please try again.'
      });
    } finally {
      setLoadingSummary(null);
    }
  };

  const stats = {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === 'open').length,
    escalated: mockTickets.filter(t => t.status === 'escalated').length,
    critical: mockTickets.filter(t => t.priority === 'critical').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Support Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">AI-powered customer support analytics</p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">AI Analytics Officer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.open}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">{stats.open}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Escalated</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.escalated}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.critical}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-orange-600">!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Support Tickets</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quick Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                      <div className="line-clamp-2">{ticket.issue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${TICKET_STATUS_COLORS[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${PRIORITY_COLORS[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="relative">
                        <button
                          onClick={() => handleQuickSummary(ticket.id)}
                          disabled={loadingSummary === ticket.id}
                          className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                        >
                          <Sparkles className="w-3 h-3" />
                          {loadingSummary === ticket.id ? 'Loading...' : 'AI Summary'}
                        </button>

                        {/* Summary Tooltip */}
                        {activeSummary?.ticketId === ticket.id && (
                          <div className="absolute z-10 w-80 p-4 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 left-0">
                            <div className="flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-gray-900 mb-1">AI Summary</p>
                                <p className="text-sm text-gray-700">{activeSummary.text}</p>
                                {activeSummary.source && (
                                  <p className="text-[10px] uppercase tracking-wide font-semibold text-purple-500 mt-2">
                                    {activeSummary.source === 'gemini'
                                      ? 'Powered by Gemini 1.5 Flash'
                                      : 'Generated with on-device heuristics'}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => setActiveSummary(null)}
                              className="mt-3 text-xs text-purple-600 hover:text-purple-700 font-medium"
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
