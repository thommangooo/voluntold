// File: src/app/api/admin/setup-password/route.ts
// Version: v1
// Purpose: API endpoint for setting up passwords (invitations) and resetting passwords (password reset)

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Find and validate the token
    const { data: tokenData, error: tokenError } = await supabase
      .from('admin_tokens')
      .select('*')
      .eq('token', token)
      .eq('is_used', false)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      );
    }

    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update the user's password
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('email', tokenData.admin_email)
      .eq('tenant_id', tokenData.tenant_id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Mark token as used
    const { error: markUsedError } = await supabase
      .from('admin_tokens')
      .update({ 
        is_used: true,
        used_at: new Date().toISOString()
      })
      .eq('id', tokenData.id);

    if (markUsedError) {
      console.error('Error marking token as used:', markUsedError);
      // Don't fail the request for this
    }

    // Get tenant info for response
    const { data: tenant } = await supabase
      .from('tenants')
      .select('name, slug')
      .eq('id', tokenData.tenant_id)
      .single();

    return NextResponse.json({
      success: true,
      message: tokenData.token_type === 'invitation' 
        ? 'Admin account set up successfully!' 
        : 'Password reset successfully!',
      tenant: tenant ? {
        name: tenant.name,
        slug: tenant.slug
      } : null
    });

  } catch (error) {
    console.error('Error in password setup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to validate token and get admin info
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Find and validate the token
    const { data: tokenData, error: tokenError } = await supabase
      .from('admin_tokens')
      .select(`
        *,
        tenants (name, slug)
      `)
      .eq('token', token)
      .eq('is_used', false)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      );
    }

    // Get admin profile info
    const { data: adminProfile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, email')
      .eq('email', tokenData.admin_email)
      .eq('tenant_id', tokenData.tenant_id)
      .single();

    return NextResponse.json({
      success: true,
      tokenType: tokenData.token_type,
      adminInfo: {
        email: tokenData.admin_email,
        firstName: adminProfile?.first_name,
        lastName: adminProfile?.last_name
      },
      tenant: tokenData.tenants ? {
        name: tokenData.tenants.name,
        slug: tokenData.tenants.slug
      } : null,
      expiresAt: tokenData.expires_at
    });

  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}