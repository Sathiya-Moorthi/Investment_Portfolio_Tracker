-- Add columns for price tracking and P/L calculation
ALTER TABLE holdings ADD COLUMN IF NOT EXISTS current_price numeric;
ALTER TABLE holdings ADD COLUMN IF NOT EXISTS last_price_update timestamptz;
