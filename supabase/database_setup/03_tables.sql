-- ==========================================
-- 03_TABLES.SQL
-- Core Tables & Relationships
-- ==========================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role user_role,
  city TEXT,
  avatar_url TEXT,
  company_name TEXT,
  experience TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  builder_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  possession_status TEXT,
  rera_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Project Units Table
CREATE TABLE IF NOT EXISTS project_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  unit_number TEXT NOT NULL,
  price NUMERIC NOT NULL,
  status unit_status DEFAULT 'available',
  area_sqft NUMERIC NOT NULL,
  bedrooms INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  listing_type property_listing_type NOT NULL,
  property_type property_type_category NOT NULL,
  commercial_type TEXT,
  price NUMERIC NOT NULL,
  area_sqft NUMERIC NOT NULL,
  area_unit TEXT DEFAULT 'sq ft',
  bedrooms INT,
  bathrooms INT,
  furnishing furnishing_status,
  facing TEXT,
  floor INT,
  total_floors INT,
  possession_status TEXT,
  address TEXT NOT NULL,
  locality TEXT,
  city TEXT NOT NULL,
  state TEXT,
  pincode VARCHAR(10),
  latitude DECIMAL,
  longitude DECIMAL,
  status property_status DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  rera_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_allowed_states CHECK (state IN ('Telangana', 'Karnataka', 'Maharashtra'))
);

-- 5. Property Media Table
CREATE TABLE IF NOT EXISTS property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  media_url TEXT NOT NULL,
  media_type property_media_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Property Views Table
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Saved Properties Table
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- 8. Saved Searches Table
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  filters JSONB NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id),
  agent_id UUID REFERENCES profiles(id),
  name TEXT,
  phone TEXT,
  source lead_source NOT NULL,
  status lead_status DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Followups Table
CREATE TABLE IF NOT EXISTS followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  lead_name TEXT NOT NULL,
  reminder_type reminder_type NOT NULL DEFAULT 'call',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  frequency alert_frequency DEFAULT 'daily',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Site Visits Table
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  agent_id UUID REFERENCES profiles(id),
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  status visit_status DEFAULT 'requested',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
