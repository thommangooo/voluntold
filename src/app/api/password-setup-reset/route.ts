// File: src/app/api/password-setup-reset/route.ts
// Version: v1 - Unified password setup/reset email API

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, type, createdBy } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()
    const tokenType = type || 'password_reset' // 'password_reset' or 'new_admin_setup'

    // Verify the email exists in user_profiles with admin role
    const { data: adminProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, email, role')
      .eq('email', emailLower)
      .in('role', ['tenant_admin', 'super_admin'])
      .single()

    if (profileError || !adminProfile) {
      // For security, return success even if user doesn't exist
      return NextResponse.json({ 
        success: true, 
        message: 'If an admin account exists with that email, a password reset link has been sent.' 
      })
    }

    // Generate secure token
    const token = crypto.randomUUID() + '-' + Date.now()

    // Store token in database
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert([
        {
          token: token,
          user_email: emailLower,
          token_type: tokenType,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          created_by: createdBy || null
        }
      ])

    if (tokenError) {
      console.error('Error storing reset token:', tokenError)
      return NextResponse.json({ error: 'Failed to generate reset token' }, { status: 500 })
    }

    // Prepare email content based on type
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/auth/set-password/${token}`
    
    const emailContent = tokenType === 'new_admin_setup' 
      ? {
          subject: 'Complete Your Admin Account Setup - Voluntold',
          greeting: `Hello ${adminProfile.first_name || 'there'}!`,
          mainText: 'Your administrator account has been created for Voluntold. To complete your setup and access the admin dashboard, please set your password by clicking the link below.',
          actionText: 'Set Your Password',
          additionalInfo: 'This link will expire in 24 hours for security reasons. If you need assistance, please contact the person who created your account.'
        }
      : {
          subject: 'Reset Your Password - Voluntold',
          greeting: `Hello ${adminProfile.first_name || 'there'}!`,
          mainText: 'You requested to reset your password for your Voluntold admin account. Click the link below to set a new password.',
          actionText: 'Reset Password',
          additionalInfo: 'If you didn\'t request this password reset, please ignore this email. This link will expire in 24 hours.'
        }

    // Send email
    const { error: emailError } = await resend.emails.send({
      from: 'Voluntold <noreply@voluntold.net>',
      to: [emailLower],
      subject: emailContent.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailContent.subject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${baseUrl}/voluntold-logo.png" alt="Voluntold" style="height: 60px; width: auto;">
          </div>

          <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
            <h1 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
              ${emailContent.greeting}
            </h1>
            
            <p style="color: #4b5563; margin: 0 0 25px 0; font-size: 16px;">
              ${emailContent.mainText}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
                ${emailContent.actionText}
              </a>
            </div>
            
            <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 14px;">
              ${emailContent.additionalInfo}
            </p>
          </div>

          <div style="text-align: center; color: #9ca3af; font-size: 12px; padding: 20px 0;">
            <p>This email was sent by Voluntold. If you have questions, please contact your organization administrator.</p>
            <p>Link expires: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()}</p>
          </div>
        </body>
        </html>
      `
    })

    if (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: tokenType === 'new_admin_setup' 
        ? 'Account setup email sent successfully!' 
        : 'Password reset email sent successfully!' 
    })

  } catch (error) {
    console.error('Password setup/reset error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}