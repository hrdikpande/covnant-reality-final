-- ==========================================
-- 42_RELAX_PROPERTY_VALIDATION.SQL
-- Relaxes the property validation trigger so that
-- missing or mismatched locality_id doesn't block
-- property submissions. Instead, it auto-corrects.
-- ==========================================

BEGIN;

CREATE OR REPLACE FUNCTION validate_property_location()
RETURNS TRIGGER AS $$
DECLARE
  v_state_id UUID;
  v_city_id UUID;
  v_pincode TEXT;
BEGIN
  -- 1. Validate City belongs to State
  IF NEW.city_id IS NOT NULL AND NEW.state_id IS NOT NULL THEN
    SELECT state_id INTO v_state_id FROM cities WHERE id = NEW.city_id;
    IF v_state_id IS NOT NULL AND v_state_id != NEW.state_id THEN
      RAISE EXCEPTION 'City does not belong to the selected State';
    END IF;
  END IF;

  -- 2. Validate Locality belongs to City (soft check)
  IF NEW.locality_id IS NOT NULL THEN
    SELECT city_id, pincode INTO v_city_id, v_pincode FROM localities WHERE id = NEW.locality_id;
    
    IF v_city_id IS NULL THEN
      -- Locality doesn't exist — clear it instead of blocking
      NEW.locality_id := NULL;
    ELSIF NEW.city_id IS NOT NULL AND v_city_id != NEW.city_id THEN
      -- Locality belongs to a different city — clear it instead of blocking
      NEW.locality_id := NULL;
    ELSE
      -- Auto-sync pincode from locality if they don't match
      IF NEW.pincode IS DISTINCT FROM v_pincode THEN
        NEW.pincode := v_pincode;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;
