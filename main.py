from fastapi import FastAPI
from dotenv import load_dotenv
from database import get_supabase_client
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Investment Portfolio Tracker Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import portfolio
app.include_router(portfolio.router)

@app.get("/")
def read_root():
    return {"status": "Agent Service Running"}

@app.get("/health")
def health_check():
    try:
        supabase = get_supabase_client()
        # Simple check to verify client initialization
        if supabase:
             return {"status": "healthy", "database": "connected"}
        return {"status": "unhealthy", "database": "not initialized"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}

from agents.market_analyst import analyze_market_trend
from agents.portfolio_manager import suggest_rebalancing
from pydantic import BaseModel

class TickerRequest(BaseModel):
    ticker: str

class PortfolioRequest(BaseModel):
    portfolio: list[dict]

@app.post("/agent/market-analyst")
def run_market_analyst(request: TickerRequest):
    return analyze_market_trend(request.ticker)

@app.post("/agent/portfolio-manager")
def run_portfolio_manager(request: PortfolioRequest):
    return suggest_rebalancing(request.portfolio)
