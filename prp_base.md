# Project Requirements & Planning Base (PRP Base)

## Project Overview
An Investment Portfolio Tracker application that leverages AI to provide portfolio management and market analysis.
- **Frontend**: Next.js 14, Tailwind CSS, Shadcn UI
- **Backend**: Python (FastAPI)
- **Database**: Supabase (PostgreSQL)
- **AI/ML**: LangGraph/LangChain for Multi-Agent Systems
- **Data**: Yahoo Finance, NewsAPI

## Core Features
1. **Portfolio Tracking**: Real-time value tracking of user investments.
2. **AI Market Analyst**: Agent that analyzes market trends and news.
3. **Portfolio Manager Agent**: AI suggestions for rebalancing and optimization.
4. **News Aggregation**: Smart filtering of financial news.

## Architecture
- **Web App**: Handles UI/UX and user interaction.
- **Agent Service**: Python based microservice handling complex logic and data retrieval.
- **Supabase**: Handles auth, database, and real-time subscriptions.
