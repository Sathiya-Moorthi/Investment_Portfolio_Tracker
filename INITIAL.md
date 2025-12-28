# INITIAL.md - Project Context

## Project: Investment Portfolio Tracker

### Tech Stack
- Frontend: `Next.js 14`, `Tailwind CSS`, `Shadcn UI`
- Backend: `Python 3.10+`, `FastAPI`
- Database: `Supabase`
- AI: `Langchain`, `LangGraph`

### Convention & Guidelines
- **Folder Structure**: 
    - `frontend/` for Next.js app.
    - `agents/` for Python AI agents.
    - `skills/` for Python tools/functions.
- **Code Style**: 
    - Python: PEP 8 (Black formatter).
    - TS/JS: ESLint + Prettier.
- **Commit Messages**: Conventional Commits (feat, fix, chore, docs).

### Getting Started
1. **Setup Environment**:
    - `pip install -r requirements.txt` (Backend)
    - `npm install` (Frontend)
2. **Environment Variables**:
    - `.env` file required in both root and frontend directories.
