-- Add common fields
ALTER TABLE holdings ADD COLUMN IF NOT EXISTS conviction_level text;
ALTER TABLE holdings ADD COLUMN IF NOT EXISTS investment_thesis text;
ALTER TABLE holdings ADD COLUMN IF NOT EXISTS risks text;
ALTER TABLE holdings ADD COLUMN IF NOT EXISTS target_value numeric;
ALTER TABLE holdings ADD COLUMN IF NOT EXISTS time_horizon text;
ALTER TABLE holdings ADD COLUMN IF NOT EXISTS notes text;

-- Add JSONB column for flexible asset-specific details (stock sector, gold purity, etc.)
ALTER TABLE holdings ADD COLUMN IF NOT EXISTS details jsonb DEFAULT '{}'::jsonb;
