# Skills / Tools 🛠️

This directory contains standalone utility functions and "skills" used by the AI agents or the backend directly.

## 📂 Modules

### `stock_data.py`
A wrapper around the `yfinance` library to fetch market data.

*   `get_stock_price(ticker)`: Retreives current price and basic info.
*   `get_stock_history(ticker, period)`: Retreives historical OHLCV data.

## 📦 Dependencies

*   `yfinance`
