-- ==========================================
-- 01_EXTENSIONS.SQL
-- Creates necessary PostgreSQL extensions
-- ==========================================

-- pgcrypto for gen_random_uuid() (Supabase includes this by default, but good to ensure)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
