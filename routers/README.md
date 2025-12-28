# API Routers 🌐

This directory contains the route definitions (endpoints) for the FastAPI backend.

## 📂 Modules

### `portfolio.py`
Handles all CRUD operations and logic for portfolio management.

*   **Prefix**: `/portfolio`
*   **Key Endpoints**:
    *   `POST /create`: Initialize a new portfolio.
    *   `GET /{id}/holdings`: Fetch all assets.
    *   `POST /{id}/holdings`: Add a new investment.
    *   `PUT /holdings/{id}`: Update an investment.
    *   `DELETE /holdings/{id}`: Remove an investment.
    *   `POST /{id}/refresh-prices`: Trigger real-time price updates.

## 🔌 Integration

These routers are aggregated in the root `main.py` using `app.include_router()`.
