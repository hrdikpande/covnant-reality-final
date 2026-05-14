-- ==========================================
-- 41_SYNC_LOCALITY_TO_PROPERTIES.SQL
-- Creates a trigger on the localities table that
-- automatically propagates name and pincode changes
-- to all linked properties. This ensures the search
-- bar, property cards, and address displays always
-- show the latest locality data.
-- ==========================================

BEGIN;

-- 1. Create the sync function
CREATE OR REPLACE FUNCTION sync_locality_to_properties()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fire if name or pincode actually changed
  IF OLD.name IS DISTINCT FROM NEW.name OR OLD.pincode IS DISTINCT FROM NEW.pincode THEN

    -- Temporarily disable the property validation trigger
    -- so the pincode update doesn't conflict with the old value check
    ALTER TABLE properties DISABLE TRIGGER trg_validate_property_location;

    -- Update the denormalized locality name on all linked properties
    UPDATE properties
    SET 
      locality = NEW.name,
      pincode  = NEW.pincode
    WHERE locality_id = NEW.id;

    -- Re-enable the validation trigger
    ALTER TABLE properties ENABLE TRIGGER trg_validate_property_location;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach the trigger to the localities table
DROP TRIGGER IF EXISTS trg_sync_locality_to_properties ON localities;

CREATE TRIGGER trg_sync_locality_to_properties
AFTER UPDATE ON localities
FOR EACH ROW EXECUTE FUNCTION sync_locality_to_properties();

COMMIT;
