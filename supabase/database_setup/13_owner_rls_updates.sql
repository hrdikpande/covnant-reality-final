-- Drop existing policy if it exists to be safe
DROP POLICY IF EXISTS "Owners can see leads for own properties" ON leads;

-- Create policy for owners to view leads on properties they own
CREATE POLICY "Owners can see leads for own properties" 
ON leads 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 
        FROM properties 
        WHERE id = leads.property_id 
        AND owner_id = auth.uid()
    )
);

-- Add indexes for owner dashboard performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads(property_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_property_id ON site_visits(property_id);

-- Note: we know properties table already has 'owner_id' as verified earlier.
