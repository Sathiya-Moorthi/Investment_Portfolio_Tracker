# Investment Portfolio Tracker 🚀

A comprehensive personal investment tracking application built with a modern tech stack. It allows users to track diverse assets (Stocks, Gold, Crypto, Chit Funds, etc.), visualize performance, and get AI-powered market insights.

## 🏗 Tech Stack

*   **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), Tailwind CSS, Shadcn UI
*   **Backend**: [Python](https://www.python.org/) (FastAPI), Uvicorn
*   **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **AI/Agents**: LangChain, LangGraph (Market Analyst & Portfolio Manager agents)
*   **Integrations**: Yahoo Finance (`yfinance`)

## 📂 Project Structure

*   `scripts_frontend/`: Next.js web application for the dashboard and UI.
*   `backend/`: FastAPI backend server and AI agents.
    *   `routers/`: FastAPI route handlers (endpoints).
    *   `agents/`: specialized AI agents for market analysis and portfolio management.
    *   `skills/`: Reusable tools and functions (e.g., stock data fetching).
    *   `main.py`: Entry point for the FastAPI backend server.

## 🚀 Getting Started

### Prerequisites

*   Python 3.10+
*   Node.js 18+
*   Supabase Account & Project

### Backend Setup

1.  **Create a Virtual Environment** (in root):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
2.  **Navigate to Backend**:
    ```bash
    cd backend
    ```
3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure Environment**:
    Create a `.env` file in the `backend/` directory with:
    ```env
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_anon_key
    OPENAI_API_KEY=your_openai_key
    NEWSAPI_KEY=your_newsapi_key
    ```
5.  **Run the Server**:
    ```bash
    uvicorn main:app --reload --port 8000
    ```

### Frontend Setup

1.  Navigate to `scripts_frontend/`:
    ```bash
    cd scripts_frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000).

## 📊 Features

*   **Multi-Asset Tracking**: Support for Stocks, Mutual Funds, Gold, Real Estate, and more.
*   **Price Refresh**: Real-time price updates for public assets via Yahoo Finance.
*   **Analytics Dashboard**: Net Worth, P/L, Asset Allocation charts.
*   **AI Insights**: Chat with a "Market Analyst" agent (powered by LangChain).

## 📝 License

[MIT](LICENSE)
