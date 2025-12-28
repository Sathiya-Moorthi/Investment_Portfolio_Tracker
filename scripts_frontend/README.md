# Portfolio Tracker Frontend 🖥️

The user interface for the Investment Portfolio Tracker, built with **Next.js 14**, **Tailwind CSS**, and **Shadcn UI**.

## 🛠 Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS
*   **Components**: Shadcn UI (Radix Primitives)
*   **Icons**: Lucide React
*   **State Management**: React Hooks

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## 📁 Key Directories

*   `app/`: Main application pages and layout (Next.js App Router).
*   `components/`: Reusable UI components (buttons, cards, modals, etc.).
*   `lib/`: Utility functions and API helpers (`api.ts`).
*   `public/`: Static assets.

## 🔗 Connection to Backend

This frontend communicates with the FastAPI backend running at `http://localhost:8000`. Ensure the backend is running before using the dashboard features.

## 🎨 Features implemented

*   **Dashboard view**: High-level metrics (Net Worth, P/L).
*   **Portfolio List**: Detailed list of assets with Edit/Delete capabilities.
*   **Smart Forms**: Dynamic input modal that adapts to Asset Type (Stock vs Gold vs etc.).
*   **Chat Interface**: Interact with the generic AI Market Analyst.
