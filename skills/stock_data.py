import yfinance as yf
from typing import Dict, Any

def get_stock_price(ticker: str) -> Dict[str, Any]:
    """
    Get the current stock price and basic info for a given ticker.
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return {
            "symbol": ticker,
            "currentPrice": info.get("currentPrice", info.get("regularMarketPrice", 0)),
            "open": info.get("open", 0),
            "dayHigh": info.get("dayHigh", 0),
            "dayLow": info.get("dayLow", 0),
            "volume": info.get("volume", 0),
        }
    except Exception as e:
        return {"error": str(e)}

def get_stock_history(ticker: str, period: str = "1mo") -> Dict[str, Any]:
    """
    Get historical stock data.
    """
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period)
        return {
            "symbol": ticker,
            "history": hist.to_dict(orient="index")
        }
    except Exception as e:
        return {"error": str(e)}
