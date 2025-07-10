// src/app/api/member-access/route.ts - V8
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface MemberOrganization {
  tenant_id: string
  tenant_name: string
  tenant_slug: string
  member_name: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, selectedTenantId } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Step 1: Find all organizations this member belongs to
    const { data: memberProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        tenant_id,
        first_name,
        last_name,
        tenants!inner (
          id,
          name,
          slug
        )
      `)
      .eq('email', email.toLowerCase().trim())

    if (profileError) {
      console.error('Database error:', profileError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Always return success message for security (don't reveal if email exists)
    if (!memberProfiles || memberProfiles.length === 0) {
      return NextResponse.json({ 
        success: true,
        message: 'If your email address is registered with Voluntold, you should receive an access link shortly. Please check your email (including spam folder).'
      })
    }

    // Transform the data for easier handling
    const organizations: MemberOrganization[] = memberProfiles.map(profile => ({
      tenant_id: profile.tenant_id,
      tenant_name: (profile.tenants as any).name,
      tenant_slug: (profile.tenants as any).slug,
      member_name: `${profile.first_name} ${profile.last_name}`
    }))

    // Step 2: Handle organization selection
    if (!selectedTenantId) {
      // If no tenant selected and multiple organizations, return them for selection
      if (organizations.length > 1) {
        return NextResponse.json({
          requiresOrgSelection: true,
          organizations: organizations.map(org => ({
            tenant_id: org.tenant_id,
            tenant_name: org.tenant_name
          }))
        })
      }
      
      // Single organization - use it automatically
      const selectedOrg = organizations[0]
      return await generateAndSendMagicLink(email, selectedOrg)
    }

    // Step 3: Generate magic link for selected organization
    const selectedOrg = organizations.find(org => org.tenant_id === selectedTenantId)
    if (!selectedOrg) {
      return NextResponse.json({ error: 'Invalid organization selection' }, { status: 400 })
    }

    return await generateAndSendMagicLink(email, selectedOrg)

  } catch (error) {
    console.error('Member access error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateAndSendMagicLink(email: string, organization: MemberOrganization) {
  try {
    // Step 1: Generate secure token
    const token = crypto.randomUUID() + '-' + crypto.randomUUID() // Extra secure
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 2) // Token expires in 2 hours

    // Step 2: Store token in database
    // First, create the member_tokens table if it doesn't exist
    const { error: tokenError } = await supabase
      .from('member_tokens')
      .insert({
        token,
        member_email: email.toLowerCase().trim(),
        tenant_id: organization.tenant_id,
        expires_at: expiresAt.toISOString(),
        used_at: null
      })

    if (tokenError) {
      console.error('Token storage error:', tokenError)
      
      // If table doesn't exist, provide helpful error
      if (tokenError.code === '42P01') {
        return NextResponse.json({ 
          error: 'Database setup incomplete. Please contact system administrator.',
          details: 'member_tokens table needs to be created'
        }, { status: 500 })
      }
      
      return NextResponse.json({ error: 'Failed to generate access token' }, { status: 500 })
    }

    // Step 3: Send magic link email
    const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL}/member/${token}`
    
    const emailResult = await resend.emails.send({
      from: 'noreply@voluntold.net', // Use your verified domain
      to: email,
      subject: `Your ${organization.tenant_name} Member Portal Access`,
      html: generateMagicLinkEmail(organization, magicLink)
    })

    if (emailResult.error) {
      console.error('Email send error:', emailResult.error)
      
      // Clean up the token if email fails
      await supabase
        .from('member_tokens')
        .delete()
        .eq('token', token)
      
      return NextResponse.json({ error: 'Failed to send access email' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Access link sent! Please check your email (including spam folder) and click the link to access your ${organization.tenant_name} member portal. The link will expire in 2 hours.`,
      organizationName: organization.tenant_name
    })

  } catch (error) {
    console.error('Magic link generation error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

function generateMagicLinkEmail(organization: MemberOrganization, magicLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Member Portal Access</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background-color: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Voluntold</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Member Portal Access</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
        <h2 style="color: #1f2937; margin-top: 0;">Hello ${organization.member_name}!</h2>
        
        <p>You requested access to your member portal for <strong>${organization.tenant_name}</strong>.</p>
        
        <p>Click the button below to access your member dashboard:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicLink}" 
             style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Access Member Portal
          </a>
        </div>
        
        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400E;"><strong>Important:</strong></p>
          <ul style="margin: 5px 0 0 0; color: #92400E;">
            <li>This link will expire in 2 hours</li>
            <li>It can only be used once</li>
            <li>Do not share this link with others</li>
          </ul>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't request this access link, you can safely ignore this email.
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          This email was sent by Voluntold on behalf of ${organization.tenant_name}
        </p>
      </div>
      
    </body>
    </html>
  `
}