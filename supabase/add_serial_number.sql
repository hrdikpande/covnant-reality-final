-- Add the serial_number column
ALTER TABLE properties ADD COLUMN serial_number INT UNIQUE;

-- Backfill existing rows, sorted by created_at
DO $$
DECLARE
    prop RECORD;
    curr_serial INT := 1;
BEGIN
    FOR prop IN SELECT id FROM properties ORDER BY created_at ASC LOOP
        UPDATE properties SET serial_number = curr_serial WHERE id = prop.id;
        curr_serial := curr_serial + 1;
    END LOOP;
END $$;

-- Create sequence for future inserts starting from max serial_number + 1
DO $$
DECLARE
    max_serial INT;
BEGIN
    SELECT COALESCE(MAX(serial_number), 0) INTO max_serial FROM properties;
    EXECUTE 'CREATE SEQUENCE properties_serial_number_seq START WITH ' || (max_serial + 1);
    
    -- Set the column to use the sequence by default
    ALTER TABLE properties ALTER COLUMN serial_number SET DEFAULT nextval('properties_serial_number_seq');
END $$;
