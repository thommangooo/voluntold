// File: src/app/api/validate-reset-token/[token]/route.ts
// Version: v1 - Token validation API for password reset/setup

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
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

    // Get user information
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, email, role')
      .eq('email', tokenData.user_email)
      .in('role', ['tenant_admin', 'super_admin'])
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ 
        error: 'User account not found or invalid permissions' 
      }, { status: 400 })
    }

    // Return token validation success with user info
    return NextResponse.json({
      valid: true,
      user: {
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role
      },
      tokenType: tokenData.token_type,
      expiresAt: tokenData.expires_at
    })

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}