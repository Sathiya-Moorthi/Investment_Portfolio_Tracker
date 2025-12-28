from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_supabase_client
import uuid
from datetime import datetime

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

from typing import Optional

class HoldingRequest(BaseModel):
    symbol: str
    quantity: float
    average_price: float
    asset_type: str = "STOCK"
    conviction_level: Optional[str] = None
    investment_thesis: Optional[str] = None
    risks: Optional[str] = None
    target_value: Optional[float] = None
    time_horizon: Optional[str] = None
    notes: Optional[str] = None
    details: dict = {}

@router.get("/")
def get_portfolios():
    supabase = get_supabase_client()
    # For MVP, just return all portfolios or a specific one
    # Note: If RLS is enabled and we use anon key, this might return nothing if not logged in.
    # We assume RLS is disabled or configured for public access for this MVP step.
    res = supabase.table("portfolios").select("*").execute()
    return res.data

@router.post("/create")
def create_portfolio(name: str = "My Portfolio"):
    supabase = get_supabase_client()
    # Create a simplified portfolio entry. 
    # If user_id is required check schema. We interpret user_id as optional for now or a dummy UUID.
    dummy_user = "00000000-0000-0000-0000-000000000000"
    data = {"name": name, "user_id": dummy_user} 
    
    try:
        res = supabase.table("portfolios").insert(data).execute()
        return res.data[0]
    except Exception as e:
        # Fallback: try without user_id if schema changed
        try:
            data.pop("user_id")
            res = supabase.table("portfolios").insert(data).execute()
            return res.data[0]
        except Exception as e2:
             raise HTTPException(status_code=500, detail=str(e2))

@router.get("/{portfolio_id}/holdings")
def get_portfolio_holdings(portfolio_id: str):
    supabase = get_supabase_client()
    res = supabase.table("holdings").select("*").eq("portfolio_id", portfolio_id).execute()
    return res.data

@router.post("/{portfolio_id}/holdings")
def add_holding(portfolio_id: str, holding: HoldingRequest):
    supabase = get_supabase_client()
    data = {
        "portfolio_id": portfolio_id,
        "symbol": holding.symbol.upper(),
        "quantity": holding.quantity,
        "average_price": holding.average_price,
        "asset_type": holding.asset_type.upper(),
        "conviction_level": holding.conviction_level,
        "investment_thesis": holding.investment_thesis,
        "risks": holding.risks,
        "target_value": holding.target_value,
        "time_horizon": holding.time_horizon,
        "notes": holding.notes,
        "details": holding.details
    }
    try:
        res = supabase.table("holdings").insert(data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/holdings/{holding_id}")
def delete_holding(holding_id: str):
    supabase = get_supabase_client()
    res = supabase.table("holdings").delete().eq("id", holding_id).execute()
    return res.data

@router.put("/holdings/{holding_id}")
def update_holding(holding_id: str, holding: HoldingRequest):
    supabase = get_supabase_client()
    data = {
        "symbol": holding.symbol.upper(),
        "quantity": holding.quantity,
        "average_price": holding.average_price,
        "asset_type": holding.asset_type.upper(),
        "conviction_level": holding.conviction_level,
        "investment_thesis": holding.investment_thesis,
        "risks": holding.risks,
        "target_value": holding.target_value,
        "time_horizon": holding.time_horizon,
        "notes": holding.notes,
        "details": holding.details
    }
    try:
        res = supabase.table("holdings").update(data).eq("id", holding_id).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{portfolio_id}/refresh-prices")
def refresh_portfolio_prices(portfolio_id: str):
    supabase = get_supabase_client()
    
    # 1. Fetch all holdings
    res = supabase.table("holdings").select("*").eq("portfolio_id", portfolio_id).execute()
    holdings = res.data
    
    updated_count = 0
    errors = []
    
    # 2. Iterate and update prices for relevant assets
    import yfinance as yf
    from datetime import datetime
    
    for h in holdings:
        asset_type = h.get("asset_type", "STOCK")
        symbol = h.get("symbol")
        
        # Only fetch for types that have tickers
        if asset_type in ["STOCK", "CRYPTO", "GOLD", "INDEX_FUND"] and symbol:
            try:
                # Basic caching or optimization could go here
                ticker = yf.Ticker(symbol)
                # fast info fetch
                info = ticker.fast_info
                price = None
                
                # fast_info is often more reliable/faster for just price than .info
                if hasattr(info, "last_price") and info.last_price:
                    price = info.last_price
                else:
                    # Fallback to slower .info
                    full_info = ticker.info
                    price = full_info.get("currentPrice", full_info.get("regularMarketPrice"))
                
                if price:
                    supabase.table("holdings").update({
                        "current_price": price, 
                        "last_price_update": datetime.now().isoformat()
                    }).eq("id", h["id"]).execute()
                    updated_count += 1
            except Exception as e:
                errors.append(f"Failed {symbol}: {str(e)}")
                
    return {"updated": updated_count, "errors": errors}
