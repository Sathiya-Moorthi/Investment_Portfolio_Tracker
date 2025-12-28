-- Allow creating portfolios without a logged-in user (for MVP)
ALTER TABLE portfolios ALTER COLUMN user_id DROP NOT NULL;

-- Remove the foreign key constraint to auth.users if it exists
-- This allows us to use dummy IDs or NULLs without crashing
ALTER TABLE portfolios DROP CONSTRAINT IF EXISTS portfolios_user_id_fkey;

-- Do the same for holdings policies if needed, but RLS might block insert if no user.
-- Let's disable RLS for now for simplicity in this MVP phase or Update policies.
ALTER TABLE portfolios DISABLE ROW LEVEL SECURITY;
ALTER TABLE holdings DISABLE ROW LEVEL SECURITY;
