from typing import List, Dict
from agents.market_analyst import analyze_market_trend

def suggest_rebalancing(portfolio: List[Dict]):
    """
    Suggests portfolio rebalancing based on current market trends.
    Expects portfolio to be a list of dicts with keys: 'symbol', 'quantity', 'average_price'.
    """
    recommendations = []
    
    for holding in portfolio:
        symbol = holding.get("symbol")
        if not symbol:
            continue
            
        # Get market analysis
        analysis = analyze_market_trend(symbol)
        
        if "error" in analysis:
            recommendations.append({
                "symbol": symbol,
                "action": "ERROR",
                "reason": analysis["error"]
            })
            continue
        
        recommendations.append({
            "symbol": symbol,
            "current_analysis": analysis.get("analysis"),
            "market_data": analysis.get("data")
        })
        
    return {"portfolio_summary": recommendations}
