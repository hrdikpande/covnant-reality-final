-- ==========================================
-- 04_INDEXES.SQL
-- Indexes for performance and lookup
-- ==========================================

-- Properties Indexes
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_project_id ON properties(project_id);

-- Geolocation Index
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties (latitude, longitude);

-- Full-Text Search Index (GIN) on Properties
CREATE INDEX IF NOT EXISTS idx_properties_title_description_search ON properties 
USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Followups Indexes
CREATE INDEX IF NOT EXISTS idx_followups_agent_id ON followups(agent_id);
CREATE INDEX IF NOT EXISTS idx_followups_scheduled_at ON followups(scheduled_at);

-- Alerts Indexes
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);

-- Saved Records Indexes
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
