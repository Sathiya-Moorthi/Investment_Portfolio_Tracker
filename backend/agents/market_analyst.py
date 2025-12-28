from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from skills.stock_data import get_stock_price, get_stock_history
import json

def analyze_market_trend(ticker: str):
    """
    Analyzes the market trend for a specific ticker using yfinance data and GPT-4o-mini.
    """
    try:
        # 1. Fetch real stock data
        price_data = get_stock_price(ticker)
        if "error" in price_data:
            return {"error": f"Failed to fetch data: {price_data['error']}"}
        
        # 2. Prepare context for the LLM
        context = f"""
        Ticker: {ticker}
        Current Price: {price_data.get('currentPrice')}
        Open: {price_data.get('open')}
        Day High: {price_data.get('dayHigh')}
        Day Low: {price_data.get('dayLow')}
        Volume: {price_data.get('volume')}
        """

        # 3. Call LLM for analysis
        model = ChatOpenAI(model="gpt-4o-mini")
        messages = [
            SystemMessage(content="You are a financial market analyst. Analyze the provided stock data and give a short trend summary (Bullish/Bearish/Neutral) and key levels to watch."),
            HumanMessage(content=f"Analyze this stock data:\n{context}")
        ]
        
        response = model.invoke(messages)
        return {
            "symbol": ticker,
            "data": price_data,
            "analysis": response.content
        }
    except Exception as e:
        return {"error": str(e)}
