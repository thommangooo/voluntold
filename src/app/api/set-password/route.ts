// File: src/app/api/set-password/route.ts
// Version: v2 - Set new password for admin users with debug logging

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Create admin client for user management operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ 
        error: 'Token and password are required' 
      }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 })
    }

    // Look up the token
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .is('used_at', null) // Only unused tokens
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ 
        error: 'Invalid or expired token' 
      }, { status: 400 })
    }

    // Check if token has expired
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)
    
    if (now > expiresAt) {
      return NextResponse.json({ 
        error: 'This link has expired. Please request a new password reset.' 
      }, { status: 400 })
    }

    // Check if user exists and has admin privileges
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, role, first_name, last_name')
      .eq('email', tokenData.user_email)
      .in('role', ['tenant_admin', 'super_admin'])
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ 
        error: 'User account not found or invalid permissions' 
      }, { status: 400 })
    }

    // First, try to get existing auth user
    let authUserId = userProfile.id

    console.log('🔍 Checking for existing auth user with ID:', authUserId)

    // Check if auth user already exists
    const { data: existingAuthUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(authUserId)

    console.log('🔍 Get user result:', { user: existingAuthUser.user?.id, error: getUserError })

    if (!existingAuthUser.user) {
      console.log('🆕 Creating new auth user for:', tokenData.user_email)
      console.log('🆕 Using ID:', authUserId)
      
      // Create new auth user if doesn't exist (for new admin setup)
      const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        id: authUserId,
        email: tokenData.user_email,
        password: password,
        email_confirm: true, // Skip email confirmation since admin is setting up
        user_metadata: {
          first_name: userProfile.first_name || '',
          last_name: userProfile.last_name || ''
        }
      })

      console.log('🆕 Create user result:', { 
        success: !!newAuthUser.user, 
        userId: newAuthUser.user?.id, 
        error: createError 
      })

      if (createError) {
        console.error('❌ Error creating auth user:', createError)
        return NextResponse.json({ 
          error: 'Failed to create user account. Please try again.' 
        }, { status: 500 })
      }

      authUserId = newAuthUser.user!.id
    } else {
      console.log('🔄 Updating existing auth user password for:', existingAuthUser.user.email)
      
      // Update existing auth user password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        authUserId,
        { password: password }
      )

      console.log('🔄 Update password result:', { error: updateError })

      if (updateError) {
        console.error('❌ Error updating password:', updateError)
        return NextResponse.json({ 
          error: 'Failed to update password. Please try again.' 
        }, { status: 500 })
      }
    }

    // Mark token as used
    const { error: markUsedError } = await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token)

    if (markUsedError) {
      console.error('Error marking token as used:', markUsedError)
      // Don't fail the request, just log the error
    }

    // Determine success message based on token type
    const successMessage = tokenData.token_type === 'new_admin_setup'
      ? 'Your admin account has been set up successfully! You can now sign in.'
      : 'Your password has been reset successfully! You can now sign in with your new password.'

    return NextResponse.json({
      success: true,
      message: successMessage,
      tokenType: tokenData.token_type
    })

  } catch (error) {
    console.error('Set password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}