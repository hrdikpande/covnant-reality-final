-- ==========================================
-- 32_BLOGS.SQL
-- Schema for the SEO Blog Module
-- ==========================================

-- 1. Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  content TEXT NOT NULL,
  excerpt TEXT,
  focus_keyword TEXT,
  keywords TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  og_image TEXT,
  word_count INT DEFAULT 0,
  reading_time INT DEFAULT 0,
  seo_score INT DEFAULT 0,
  schema_markup JSONB
);

-- 2. Create blog_properties join table
CREATE TABLE IF NOT EXISTS blog_properties (
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  anchor_text TEXT,
  PRIMARY KEY (blog_id, property_id)
);

-- 3. Create blog_images table
CREATE TABLE IF NOT EXISTS blog_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  caption TEXT,
  width INT,
  height INT
);

-- 4. Set up update trigger for updated_at
CREATE OR REPLACE FUNCTION update_blog_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_modtime
BEFORE UPDATE ON blogs
FOR EACH ROW
EXECUTE FUNCTION update_blog_updated_at_column();

-- 5. RLS Policies
-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- Public can read published blogs
CREATE POLICY "Public can read published blogs"
ON blogs FOR SELECT
USING (status = 'published');

-- Public can read blog properties and images for published blogs
CREATE POLICY "Public can read blog properties"
ON blog_properties FOR SELECT
USING (EXISTS (SELECT 1 FROM blogs WHERE id = blog_id AND status = 'published'));

CREATE POLICY "Public can read blog images"
ON blog_images FOR SELECT
USING (EXISTS (SELECT 1 FROM blogs WHERE id = blog_id AND status = 'published'));

-- Admins can do everything
CREATE POLICY "Admins can manage all blogs"
ON blogs FOR ALL
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admins can manage all blog properties"
ON blog_properties FOR ALL
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admins can manage all blog images"
ON blog_images FOR ALL
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
