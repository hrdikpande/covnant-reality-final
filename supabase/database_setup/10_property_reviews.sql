-- Create property_reviews table
CREATE TABLE IF NOT EXISTS public.property_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a user can only review a property once (optional but recommended for reviews)
    UNIQUE(property_id, user_id)
);

-- Enable RLS
ALTER TABLE public.property_reviews ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Anyone can read property reviews"
    ON public.property_reviews
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can write reviews"
    ON public.property_reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.property_reviews
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.property_reviews
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_property_reviews_property_id ON public.property_reviews(property_id);
