// File: src/app/api/admin/password-reset/route.ts
// Version: v1
// Purpose: API endpoint for sending password reset emails to existing admins

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { nanoid } from 'nanoid';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if user exists and is an admin
    const { data: adminProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, first_name, tenant_id, tenants(name)')
      .eq('email', email.toLowerCase())
      .in('role', ['tenant_admin', 'super_admin']);

    if (profileError) {
      console.error('Error checking admin profiles:', profileError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // Always return success to prevent email enumeration attacks
    // But only send email if admin actually exists
    if (adminProfiles && adminProfiles.length > 0) {
      // For super_admins or admins with multiple tenants, we'll handle differently
      const profile = adminProfiles[0]; // For now, use the first one

      // Generate secure reset token
      const resetToken = nanoid(32);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

      // Store reset token
      const { error: tokenError } = await supabase
        .from('admin_tokens')
        .insert({
          token: resetToken,
          admin_email: email.toLowerCase(),
          tenant_id: profile.tenant_id,
          token_type: 'password_reset',
          created_by: null, // Self-initiated
          expires_at: expiresAt.toISOString()
        });

      if (tokenError) {
        console.error('Error storing reset token:', tokenError);
        // Still return success to prevent enumeration
      } else {
        // Send password reset email
        const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset/${resetToken}`;
        
        try {
          await resend.emails.send({
            from: 'Voluntold <notifications@voluntold.net>',
            to: email,
            subject: 'Reset your Voluntold admin password',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #2563eb; margin: 0;">Voluntold</h1>
                </div>
                
                <h2 style="color: #374151;">Reset Your Password</h2>
                
                <p>Hi ${profile.first_name || 'Admin'},</p>
                
                <p>You requested a password reset for your Voluntold admin account. Click the button below to set a new password:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" 
                     style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Reset Password
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px;">
                  This reset link will expire in 1 hour for security. If you can't click the button above, copy and paste this link into your browser:
                </p>
                <p style="color: #6b7280; font-size: 14px; word-break: break-all;">
                  ${resetUrl}
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                  If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.
                </p>
              </div>
            `
          });
        } catch (emailError) {
          console.error('Error sending password reset email:', emailError);
          // Still return success to prevent enumeration
        }
      }
    }

    // Always return the same success message regardless of whether email exists
    return NextResponse.json({
      success: true,
      message: 'If an admin account with that email exists, we\'ve sent a password reset link.'
    });

  } catch (error) {
    console.error('Error in password reset:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}