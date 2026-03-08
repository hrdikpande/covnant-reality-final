-- ==========================================
-- 06_TRIGGERS.SQL
-- Database Triggers and Security Enforcement
-- ==========================================

-- 1. Profile Trigger: Auto-create profile row on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role, company_name, experience)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'role', '')::public.user_role,
      'buyer'::public.user_role
    ),
    NEW.raw_user_meta_data->>'company',
    NEW.raw_user_meta_data->>'experience'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Property Status Trigger: Prevent owners from approving their own properties
CREATE OR REPLACE FUNCTION check_property_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If not an admin, prevent changing sensitive fields
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    IF (OLD.status IS DISTINCT FROM NEW.status) OR
       (OLD.is_verified IS DISTINCT FROM NEW.is_verified) OR
       (OLD.is_featured IS DISTINCT FROM NEW.is_featured) THEN
      RAISE EXCEPTION 'Only admins can modify status, verification, or promotional flags.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER tr_check_property_update
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION check_property_update();
