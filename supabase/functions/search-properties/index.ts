// @ts-expect-error: Deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-expect-error: Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            // @ts-expect-error: Deno
            Deno.env.get('SUPABASE_URL') ?? '',
            // @ts-expect-error: Deno
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        // Parse query parameters
        const url = new URL(req.url)
        const city = url.searchParams.get('city')
        const bedrooms = url.searchParams.get('bedrooms')
        const listingType = url.searchParams.get('listing_type')
        const isVerified = url.searchParams.get('is_verified')
        const limit = parseInt(url.searchParams.get('limit') || '50')
        const offset = parseInt(url.searchParams.get('offset') || '0')

        // Call RPC for secure, optimized filtering
        const { data, error } = await supabaseClient.rpc('search_properties', {
            p_city: city,
            p_bedrooms: bedrooms ? parseInt(bedrooms) : null,
            p_listing_type: listingType,
            p_is_verified: isVerified === 'true' ? true : (isVerified === 'false' ? false : null),
            p_limit: limit,
            p_offset: offset
        })

        if (error) throw error

        return new Response(
            JSON.stringify({
                success: true,
                data: data,
                pagination: {
                    limit,
                    offset,
                    total: data[0]?.total_count || 0
                }
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        )
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
