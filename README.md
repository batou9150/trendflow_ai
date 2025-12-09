# TrendFlow AI

TrendFlow AI is an advanced, AI-powered platform designed to revolutionize marketing workflows. By leveraging the power of Google's Gemini AI, it helps agencies and businesses spot emerging market trends, generate targeted content, and manage marketing campaigns efficiently.

## Features

### 📊 Dashboard
A centralized hub providing a high-level overview of your marketing ecosystem. Monitor key metrics, active campaigns, and recent trend alerts at a glance.

### 📈 Trend Spotter
Stay ahead of the curve. This module analyzes data to identify rising topics, keywords, and consumer sentiments.
- **Trend Analysis**: Visualize growth and volume of emerging trends.
- **Sentiment Tracking**: Understand how the market feels about specific topics.

### 🏭 Content Factory
The creative engine of the platform. Use generative AI to produce high-quality marketing assets tailored to specific client voices and trends.
- **Multi-Format Generation**: Create blog posts, social media captions, and emails.
- **Customizable Voices**: tailored generations based on client "Brand Voice" profiles.
- **Product Integration**: Seamlessly upload and integrate product images into your content workflow.

### 📣 Campaigns
Manage your marketing initiatives from conception to launch. Track status, schedules, and platform distribution for all your client campaigns.

## Tech Stack

- **Frontend**: [React](https://react.dev/) w/ [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **AI Integration**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (Gemini Models)
- **Visualization**: [Recharts](https://recharts.org/) for data analytics
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (Latest LTS recommended)
- A Google Cloud Project with Gemini API access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trendflow_ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the Application**
   Start the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

- `/components` - Reusable UI components and feature-specific views.
- `/services` - API integrations (including Gemini AI service).
- `/constants.ts` - Mock data and configuration constants.
- `/types.ts` - TypeScript type definitions.
