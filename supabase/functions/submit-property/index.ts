// @ts-expect-error: Deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-expect-error: Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Initialize Supabase Client
    const supabaseClient = createClient(
      // @ts-expect-error: Deno
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-expect-error: Deno
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role to manage storage/DB links
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // 2. Validate JWT / User Authentication
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Parse Multipart Form Data
    const formData = await req.formData()
    const propertyData = JSON.parse(formData.get('property') as string)
    const files = formData.getAll('files') as File[]

    if (!propertyData) {
      throw new Error('Missing property data')
    }

    // 4. Create Property via RPC
    const { data: rpcData, error: rpcError } = await supabaseClient.rpc('submit_property', {
      p_property: propertyData
    })

    if (rpcError || !rpcData.success) {
      throw new Error(rpcError?.message || rpcData.error || 'Failed to create property')
    }

    const propertyId = rpcData.property_id
    const uploadedMedia = []

    // 5. Handle File Uploads to Storage
    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `${user.id}/${propertyId}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('property-media')
        .upload(filePath, file)

      if (uploadError) {
        console.error(`Failed to upload ${file.name}:`, uploadError)
        continue
      }

      // 6. Link Media in DB
      const { error: mediaError } = await supabaseClient
        .from('property_media')
        .insert({
          property_id: propertyId,
          media_url: uploadData.path,
          media_type: file.type.startsWith('video') ? 'video' : 'image'
        })

      if (!mediaError) {
        uploadedMedia.push(uploadData.path)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        property_id: propertyId,
        media_count: uploadedMedia.length,
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
