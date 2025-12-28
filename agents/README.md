# AI Agents 🤖

This directory contains the LangChain/LangGraph definitions for the AI agents that power the intelligent features of the Portfolio Tracker.

## 🧠 Agents

### 1. Market Analyst (`market_analyst.py`)
*   **Role**: Analyzes individual stocks or market trends.
*   **Tools**: Can access `yfinance` data (via `skills/`) and search web (optional/planned).
*   **Input**: Ticker symbol or question.
*   **Output**: Summary of price action, news sentiment, and technical indicators.

### 2. Portfolio Manager (`portfolio_manager.py`)
*   **Role**: Provides holistic advice on the user's portfolio.
*   **Capabilities**:
    *   Asset Allocation analysis.
    *   Risk assessment.
    *   Rebalancing suggestions.

## 🛠 Usage

These agents are imported and invoked by the main FastAPI application (via `routers/`). They are generally not meant to be run as standalone scripts, though they can be tested individually.
