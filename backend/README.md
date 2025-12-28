# Portfolio Tracker Backend 🛠️

The backend service for the Investment Portfolio Tracker, built with **FastAPI**. It handles data persistence via Supabase and powers the AI agents.

## 🏗 Tech Stack

*   **Framework**: FastAPI
*   **Database**: Supabase (PostgreSQL)
*   **AI**: LangChain (OpenAI models)
*   **Data Source**: Yahoo Finance (`yfinance`)

## 🚀 Getting Started

1.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate # Windows: venv\Scripts\activate
    ```

2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3.  Configure `.env` file:
    ```env
    SUPABASE_URL=...
    SUPABASE_KEY=...
    OPENAI_API_KEY=...
    NEWSAPI_KEY=...
    ```

4.  Run the server:
    ```bash
    uvicorn main:app --reload --port 8000
    ```

## 📂 Key Directories

*   `routers/`: API route definitions.
*   `agents/`: AI agent logic (LangGraph).
*   `skills/`: Helper functions.
