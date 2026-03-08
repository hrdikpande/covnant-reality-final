-- ==========================================
-- 15_LOCATION_HIERARCHY.SQL
-- Geographical Location Hierarchy Tables
-- ==========================================

-- 1. States Table
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country TEXT DEFAULT 'India',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Cities Table
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES states(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state_id, name)
);

-- 3. Localities Table
CREATE TABLE IF NOT EXISTS localities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(city_id, name, pincode)
);

-- 4. Alter Properties Table to include new fields and Foreign Keys
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES states(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES cities(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS locality_id UUID REFERENCES localities(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS address_line TEXT;

-- NOTE: Since `pincode`, `latitude`, `longitude` columns already exist in properties,
-- we just need to use them.

-- Create Indexes for optimization
CREATE INDEX IF NOT EXISTS idx_properties_state ON properties(state_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city_id);
CREATE INDEX IF NOT EXISTS idx_properties_locality ON properties(locality_id);
CREATE INDEX IF NOT EXISTS idx_properties_pincode ON properties(pincode);

-- Trigger for properties validation
CREATE OR REPLACE FUNCTION validate_property_location()
RETURNS TRIGGER AS $$
DECLARE
  v_state_id UUID;
  v_city_id UUID;
  v_pincode TEXT;
BEGIN
  -- 1. Ensure State is one of the allowed (Though the states table only has 3, we ensure the state_id matches)
  -- 2. Validate City belongs to State
  IF NEW.city_id IS NOT NULL THEN
    SELECT state_id INTO v_state_id FROM cities WHERE id = NEW.city_id;
    IF v_state_id != NEW.state_id THEN
      RAISE EXCEPTION 'City does not belong to the selected State';
    END IF;
  END IF;

  -- 3. Validate Locality belongs to City
  IF NEW.locality_id IS NOT NULL THEN
    SELECT city_id, pincode INTO v_city_id, v_pincode FROM localities WHERE id = NEW.locality_id;
    IF v_city_id != NEW.city_id THEN
      RAISE EXCEPTION 'Locality does not belong to the selected City';
    END IF;
    -- 4. Validate Pincode matches Locality pincode
    IF NEW.pincode IS DISTINCT FROM v_pincode THEN
      RAISE EXCEPTION 'Pincode must match the locality pincode';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_property_location ON properties;

CREATE TRIGGER trg_validate_property_location
BEFORE INSERT OR UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION validate_property_location();

-- Update properties with constraints on allowed states
-- We can add a constraint, but state_id referencing states table which only has Telangana, Karnataka, Maharashtra is inherently restricting it.

-- ==========================================
-- SEED DATA
-- ==========================================

-- Seed States
INSERT INTO states (name) VALUES 
('Telangana'), 
('Karnataka'), 
('Maharashtra')
ON CONFLICT (name) DO NOTHING;

-- Seed Cities
INSERT INTO cities (state_id, name)
SELECT id, 'Hyderabad' FROM states WHERE name = 'Telangana'
ON CONFLICT DO NOTHING;

INSERT INTO cities (state_id, name)
SELECT id, 'Warangal' FROM states WHERE name = 'Telangana'
ON CONFLICT DO NOTHING;

INSERT INTO cities (state_id, name)
SELECT id, 'Bangalore' FROM states WHERE name = 'Karnataka'
ON CONFLICT DO NOTHING;

INSERT INTO cities (state_id, name)
SELECT id, 'Mysore' FROM states WHERE name = 'Karnataka'
ON CONFLICT DO NOTHING;

INSERT INTO cities (state_id, name)
SELECT id, 'Mumbai' FROM states WHERE name = 'Maharashtra'
ON CONFLICT DO NOTHING;

INSERT INTO cities (state_id, name)
SELECT id, 'Pune' FROM states WHERE name = 'Maharashtra'
ON CONFLICT DO NOTHING;

-- Seed Localities (Hyderabad)
DO $$
DECLARE
  v_city_id UUID;
BEGIN
  SELECT id INTO v_city_id FROM cities WHERE name = 'Hyderabad' LIMIT 1;
  IF FOUND THEN
    INSERT INTO localities (city_id, name, pincode, latitude, longitude) VALUES 
    (v_city_id, 'Madhapur', '500081', 17.4485, 78.3908),
    (v_city_id, 'Gachibowli', '500032', 17.4401, 78.3489),
    (v_city_id, 'Banjara Hills', '500034', 17.4150, 78.4397)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Seed Localities (Bangalore)
DO $$
DECLARE
  v_city_id UUID;
BEGIN
  SELECT id INTO v_city_id FROM cities WHERE name = 'Bangalore' LIMIT 1;
  IF FOUND THEN
    INSERT INTO localities (city_id, name, pincode, latitude, longitude) VALUES 
    (v_city_id, 'Whitefield', '560066', 12.9698, 77.7499),
    (v_city_id, 'Indiranagar', '560038', 12.9784, 77.6408)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Seed Localities (Mumbai)
DO $$
DECLARE
  v_city_id UUID;
BEGIN
  SELECT id INTO v_city_id FROM cities WHERE name = 'Mumbai' LIMIT 1;
  IF FOUND THEN
    INSERT INTO localities (city_id, name, pincode, latitude, longitude) VALUES 
    (v_city_id, 'Andheri', '400053', 19.1136, 72.8697),
    (v_city_id, 'Bandra', '400050', 19.0596, 72.8295)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
