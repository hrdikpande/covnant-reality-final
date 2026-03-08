-- ==========================================
-- 02_ENUMS.SQL
-- Custom Enum Types
-- ==========================================

-- Profiles
CREATE TYPE user_role AS ENUM ('buyer', 'tenant', 'owner', 'agent', 'builder', 'admin');

-- Properties
CREATE TYPE property_listing_type AS ENUM ('sell', 'rent');
CREATE TYPE property_type_category AS ENUM ('apartment', 'villa', 'house', 'plot', 'commercial', 'pg');
CREATE TYPE furnishing_status AS ENUM ('furnished', 'semi_furnished', 'unfurnished');
CREATE TYPE property_status AS ENUM ('pending', 'approved', 'rejected', 'sold', 'rented');

-- Projects / Units
CREATE TYPE unit_status AS ENUM ('available', 'blocked', 'sold');

-- Media
CREATE TYPE property_media_type AS ENUM ('image', 'video', 'floorplan');

-- Leads & Followups
CREATE TYPE lead_source AS ENUM ('call', 'whatsapp', 'chat', 'visit');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'visited', 'closed');
CREATE TYPE reminder_type AS ENUM ('call', 'meeting', 'whatsapp');

-- Alerts
CREATE TYPE alert_frequency AS ENUM ('instant', 'daily', 'weekly');

-- Site Visits
CREATE TYPE visit_status AS ENUM ('requested', 'confirmed', 'completed', 'cancelled');
