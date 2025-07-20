// File: src/app/api/admin/invite/route.ts
// Version: v1
// Purpose: API endpoint for sending admin invitations

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { nanoid } from 'nanoid';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, tenantId, role = 'tenant_admin' } = await request.json();

    if (!email || !firstName || !lastName || !tenantId) {
      return NextResponse.json(
        { error: 'Email, first name, last name, and tenant ID are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get current user and verify they have permission to invite admins
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is admin for this tenant
    const { data: currentUserProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, tenant_id')
      .eq('id', user.id)
      .eq('tenant_id', tenantId)
      .single();

    if (profileError || !currentUserProfile || 
        !['tenant_admin', 'super_admin'].includes(currentUserProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Check if email already exists as admin in this tenant
    const { data: existingAdmin } = await supabase
      .from('user_profiles')
      .select('id, role')
      .eq('email', email.toLowerCase())
      .eq('tenant_id', tenantId)
      .single();

    if (existingAdmin && ['tenant_admin', 'super_admin'].includes(existingAdmin.role)) {
      return NextResponse.json(
        { error: 'An admin with this email already exists in this organization' },
        { status: 409 }
      );
    }

    // Get tenant name for the email
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('name')
      .eq('id', tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json({ error: 'Invalid tenant' }, { status: 400 });
    }

    // Generate secure invitation token
    const invitationToken = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    // Store invitation token
    const { error: tokenError } = await supabase
      .from('admin_tokens')
      .insert({
        token: invitationToken,
        admin_email: email.toLowerCase(),
        tenant_id: tenantId,
        token_type: 'invitation',
        created_by: user.id,
        expires_at: expiresAt.toISOString()
      });

    if (tokenError) {
      console.error('Error storing invitation token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      );
    }

    // Create user profile record (without password) for the invited admin
    const { error: profileCreateError } = await supabase
      .from('user_profiles')
      .insert({
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        tenant_id: tenantId,
        role: role
      });

    if (profileCreateError) {
      console.error('Error creating user profile:', profileCreateError);
      // Clean up the token if profile creation fails
      await supabase
        .from('admin_tokens')
        .delete()
        .eq('token', invitationToken);
      
      return NextResponse.json(
        { error: 'Failed to create admin profile' },
        { status: 500 }
      );
    }

    // Send invitation email
    const invitationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/setup/${invitationToken}`;
    
    try {
      await resend.emails.send({
        from: 'Voluntold <notifications@voluntold.net>',
        to: email,
        subject: `You're invited to join ${tenant.name} as an admin - Voluntold`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">Voluntold</h1>
            </div>
            
            <h2 style="color: #374151;">You're invited to be an admin!</h2>
            
            <p>Hi ${firstName},</p>
            
            <p>You've been invited to join <strong>${tenant.name}</strong> as an administrator on Voluntold. As an admin, you'll be able to:</p>
            
            <ul style="color: #6b7280; margin: 20px 0;">
              <li>Manage volunteer projects and opportunities</li>
              <li>Send email broadcasts to members</li>
              <li>Track volunteer hours and participation</li>
              <li>Create polls and gather feedback</li>
              <li>Manage organization members</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Set Up Your Admin Account
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              This invitation will expire in 7 days. If you can't click the button above, copy and paste this link into your browser:
            </p>
            <p style="color: #6b7280; font-size: 14px; word-break: break-all;">
              ${invitationUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
      // Don't fail the entire request if email fails
      // The admin can be created and the invitation can be resent
    }

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${email}`,
      invitationUrl // Include for testing/manual sharing if needed
    });

  } catch (error) {
    console.error('Error in admin invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}