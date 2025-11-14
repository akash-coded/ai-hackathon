# Smart Support - AI-Powered Customer Support Analytics

A world-class MVP built with React, TypeScript, TailwindCSS, and Google's Gemini AI to provide intelligent analytics and insights for customer support tickets.

## Features

### 1. Business Dashboard
- **Real-time Ticket Monitoring**: View all support tickets with status, priority, and category filters
- **Statistics Overview**: Key metrics including total tickets, open tickets, escalated tickets, and critical issues
- **Quick AI Summary**: Get instant one-sentence summaries of any ticket using AI
- **Interactive UI**: Hover tooltips and responsive design for optimal user experience

### 2. AI Analytics Officer
- **Overall Customer Sentiment**: AI-powered sentiment analysis showing positive, neutral, and negative percentages
- **Common Themes**: Identify recurring patterns and trends across all support tickets
- **High-Risk Tickets**: Automatically flag tickets that require immediate attention
- **Actionable Recommendations**: Strategic guidance to improve customer satisfaction and support operations

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom gradients and animations
- **Routing**: React Router v6
- **AI Integration**: Google Gemini 1.5 Flash API
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Language**: TypeScript

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Google Gemini API key (get one at https://makersuite.google.com/app/apikey)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API Key**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Run the application**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`

## Project Structure

```
smart-support/
├── src/
│   ├── components/
│   │   ├── BusinessDashboard.tsx    # Main dashboard with ticket table
│   │   ├── AnalyticsDashboard.tsx   # AI analytics view
│   │   └── ProcessingView.tsx       # Loading state component
│   ├── services/
│   │   └── geminiService.ts         # Gemini AI integration
│   ├── constants.ts                 # Mock data and type definitions
│   ├── App.tsx                      # Router configuration
│   └── index.css                    # Global styles with Tailwind
├── .env.example                     # Environment variables template
└── README.md                        # This file
```

## Usage Guide

### Viewing Support Tickets
1. Launch the application
2. The main dashboard displays all support tickets in a table
3. Each ticket shows:
   - Ticket ID
   - Customer name
   - Issue description
   - Status (open, in-progress, resolved, escalated)
   - Priority (low, medium, high, critical)
   - Category

### Getting Quick AI Summaries
1. Click the "AI Summary" button in the Quick Actions column for any ticket
2. An AI-generated one-sentence summary appears in a tooltip
3. Click "Close" to dismiss the summary

### Generating Comprehensive Analytics
1. Click the "AI Analytics Officer" button in the top right
2. Click "Generate Insights" on the analytics page
3. Wait for the AI to analyze all tickets (typically 5-10 seconds)
4. Review the four key sections:
   - **Overall Customer Sentiment**: Sentiment breakdown with percentages
   - **Common Themes**: Top patterns identified across tickets
   - **High-Risk Tickets**: Tickets flagged for immediate attention
   - **Actionable Recommendations**: Strategic guidance for improvement

### Navigation
- Use the back arrow on the Analytics page to return to the main dashboard
- All navigation is smooth and instant with React Router

## Development Methodology

This MVP was built using **Vibe Coding** principles:
- Conversational ideation with AI
- Prompt-driven UI generation
- Iterative refinement through dialogue
- Context engineering for seamless file integration

## Production Considerations

### Security
- API keys are stored in environment variables (never committed to git)
- Input validation on all user interactions
- Error boundaries for graceful failure handling

### Performance
- Gemini 1.5 Flash model for fast AI responses
- React component memoization where appropriate
- Lazy loading for route-based code splitting
- Optimized TailwindCSS bundle

### Scalability
- Modular component architecture
- Service layer for API interactions
- Type-safe TypeScript throughout
- Easy to extend with additional AI features

## API Configuration

The application uses Google's Gemini API. To get an API key:

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

**Note**: The free tier includes generous limits suitable for development and MVP testing.

## Troubleshooting

### "Please configure your Gemini API key" message
- Ensure your `.env` file exists in the project root
- Verify the API key is correct and starts with `VITE_`
- Restart the dev server after adding/changing environment variables

### AI features not working
- Check your internet connection
- Verify your API key is valid
- Check the browser console for error messages
- Ensure you haven't exceeded API rate limits

### Build errors
- Delete `node_modules` and run `npm install` again
- Clear the Vite cache: `rm -rf node_modules/.vite`
- Ensure you're using Node.js 18 or higher

## License

This project is built for demonstration purposes as an AI hackathon submission.

## Built With

Built with Claude Code using prompt-driven development and vibe coding methodology.
