// File: src/app/api/member-elevation-notification/route.ts
// Version: v1 - Send notification when member is elevated to admin

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { memberEmail, memberName, organizationName, customMessage, elevatedBy } = await request.json()

    if (!memberEmail || !memberName || !organizationName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the person who elevated the member (for email signature)
    let elevatedByName = 'Your organization administrator'
    if (elevatedBy) {
      const { data: elevatorProfile } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', elevatedBy)
        .single()

      if (elevatorProfile) {
        elevatedByName = `${elevatorProfile.first_name} ${elevatorProfile.last_name}`
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Prepare email content
    const customMessageHtml = customMessage 
      ? `
        <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
          <p style="color: #1f2937; margin: 0; font-style: italic;">
            "${customMessage}"
          </p>
        </div>
      `
      : ''

    // Send email
    const { error: emailError } = await resend.emails.send({
      from: 'Voluntold <noreply@voluntold.net>',
      to: [memberEmail],
      subject: `You've been made an administrator of ${organizationName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Administrator Access Granted</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${baseUrl}/voluntold-logo.png" alt="Voluntold" style="height: 60px; width: auto;">
          </div>

          <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
            <h1 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
              Congratulations, ${memberName}!
            </h1>
            
            <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px;">
              You have been granted administrator privileges for <strong>${organizationName}</strong> on Voluntold.
            </p>

            ${customMessageHtml}
            
            <h2 style="color: #1f2937; margin: 20px 0 15px 0; font-size: 18px; font-weight: 600;">
              What does this mean?
            </h2>
            
            <p style="color: #4b5563; margin: 0 0 15px 0; font-size: 16px;">
              As an administrator, you now have the ability to:
            </p>
            
            <ul style="color: #4b5563; margin: 0 0 20px 20px; font-size: 16px;">
              <li>Manage all organization members</li>
              <li>Create and manage volunteer projects</li>
              <li>Send emails to members</li>
              <li>Create polls and collect responses</li>
              <li>View detailed analytics and reports</li>
              <li>Grant admin access to other members</li>
            </ul>
            
            <div style="background: #dbeafe; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                <strong>Next Steps:</strong> You will receive a separate email with instructions to set up your administrator password. Please check your inbox and follow those instructions to complete your setup.
              </p>
            </div>
            
            <p style="color: #4b5563; margin: 20px 0 0 0; font-size: 14px;">
              If you have any questions about your new role or need assistance, please don't hesitate to reach out.
            </p>
          </div>

          <div style="text-align: center; color: #9ca3af; font-size: 12px; padding: 20px 0;">
            <p>Best regards,<br>${elevatedByName}</p>
            <p style="margin-top: 15px;">This email was sent via Voluntold. You are receiving this because you were granted administrator access to ${organizationName}.</p>
          </div>
        </body>
        </html>
      `
    })

    if (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json({ error: 'Failed to send notification email' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Elevation notification sent successfully!' 
    })

  } catch (error) {
    console.error('Member elevation notification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}