-- ==========================================
-- 07_RLS_POLICIES.SQL
-- Row Level Security
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- Policies for: PROFILES
-- ==========================================
CREATE POLICY "Service role can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public can view basic agent/builder info" ON profiles FOR SELECT USING (role IN ('agent', 'builder'));
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- ==========================================
-- Policies for: PROJECTS
-- ==========================================
CREATE POLICY "Anyone can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Builders can manage own projects" ON projects FOR ALL USING (auth.uid() = builder_id) WITH CHECK (auth.uid() = builder_id);
CREATE POLICY "Admins can manage all projects" ON projects FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- ==========================================
-- Policies for: PROJECT UNITS
-- ==========================================
CREATE POLICY "Anyone can read project units" ON project_units FOR SELECT USING (true);
CREATE POLICY "Builders can manage units for own projects" ON project_units FOR ALL USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND builder_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND builder_id = auth.uid()));
CREATE POLICY "Admins can manage all project units" ON project_units FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- ==========================================
-- Policies for: PROPERTIES
-- ==========================================
CREATE POLICY "Owners and admins can insert properties" ON properties FOR INSERT WITH CHECK (auth.uid() = owner_id AND ((auth.jwt() -> 'user_metadata' ->> 'role' = 'owner') OR (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')));
CREATE POLICY "Owners can update own property" ON properties FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Admins can update any property" ON properties FOR UPDATE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
CREATE POLICY "Public can view approved properties" ON properties FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners can view own properties" ON properties FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Admins can view all properties" ON properties FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- ==========================================
-- Policies for: PROPERTY MEDIA
-- ==========================================
CREATE POLICY "Owners can insert media for own property" ON property_media FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid()));
CREATE POLICY "Public can view media for approved properties" ON property_media FOR SELECT USING (EXISTS (SELECT 1 FROM properties WHERE id = property_id AND status = 'approved'));
CREATE POLICY "Owners can view own property media" ON property_media FOR SELECT USING (EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid()));
CREATE POLICY "Admins can manage all property media" ON property_media FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- ==========================================
-- Policies for: PROPERTY VIEWS
-- ==========================================
CREATE POLICY "Anyone can insert property views" ON property_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can see views for own properties" ON property_views FOR SELECT USING (EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid()));
CREATE POLICY "Admins can see all property views" ON property_views FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- ==========================================
-- Policies for: SAVED PROPERTIES
-- ==========================================
CREATE POLICY "Users manage own saved properties" ON saved_properties FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- Policies for: SAVED SEARCHES
-- ==========================================
CREATE POLICY "Users manage own searches" ON saved_searches FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- Policies for: LEADS
-- ==========================================
CREATE POLICY "Buyers can see own leads" ON leads FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Agents can see assigned leads" ON leads FOR SELECT USING (auth.uid() = agent_id);
CREATE POLICY "Admins can see all leads" ON leads FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Agents can update assigned leads" ON leads FOR UPDATE USING (auth.uid() = agent_id);
CREATE POLICY "Admins can update all leads" ON leads FOR UPDATE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- ==========================================
-- Policies for: FOLLOWUPS
-- ==========================================
CREATE POLICY "Agents can see own followups" ON followups FOR SELECT USING (auth.uid() = agent_id);
CREATE POLICY "Agents can insert own followups" ON followups FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "Agents can update own followups" ON followups FOR UPDATE USING (auth.uid() = agent_id);
CREATE POLICY "Agents can delete own followups" ON followups FOR DELETE USING (auth.uid() = agent_id);
CREATE POLICY "Admins can see all followups" ON followups FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- ==========================================
-- Policies for: ALERTS
-- ==========================================
CREATE POLICY "Users manage own alerts" ON alerts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- Policies for: SITE VISITS
-- ==========================================
CREATE POLICY "Buyers can see own site visits" ON site_visits FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Agents can see site visits for own properties" ON site_visits FOR SELECT USING (EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = auth.uid()));
CREATE POLICY "Admins can see all site visits" ON site_visits FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
CREATE POLICY "Buyers can requested site visits" ON site_visits FOR INSERT WITH CHECK (auth.uid() = buyer_id);


-- ==========================================
-- Policies for: ACTIVITY LOGS
-- ==========================================
CREATE POLICY "Users can see own activity logs" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can see all activity logs" ON activity_logs FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
CREATE POLICY "Authenticated users can insert own activity logs" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
