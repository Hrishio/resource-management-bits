import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create a regular client for checking the current user's permissions
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Set the auth header for the client
    supabaseClient.auth.session = null
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if the current user is an admin
    const { data: hasAdminRole, error: roleError } = await supabaseAdmin
      .rpc('has_role', { _user_id: user.id, _role: 'admin' })

    if (roleError || !hasAdminRole) {
      throw new Error('Only admins can create users')
    }

    // Parse request body
    const { email, password, fullName, role } = await req.json()

    if (!email || !password || !role) {
      throw new Error('Email, password, and role are required')
    }

    // Create the user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || email
      }
    })

    if (createError) {
      throw createError
    }

    if (newUser.user) {
      // Assign the role to the new user
      const { error: roleAssignError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: newUser.user.id,
          role: role
        })

      if (roleAssignError) {
        // If role assignment fails, we should ideally delete the user
        // For now, we'll just throw an error
        throw new Error(`User created but role assignment failed: ${roleAssignError.message}`)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: newUser.user,
        message: `User created successfully with ${role} role`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})