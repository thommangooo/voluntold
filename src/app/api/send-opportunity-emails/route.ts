import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '../../../lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple token generation function
function generateSignupToken(memberEmail: string, opportunityId: string, tenantId: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const data = `${memberEmail}-${opportunityId}-${tenantId}-${timestamp}-${randomString}`
  return Buffer.from(data).toString('base64url')
}

export async function POST(request: NextRequest) {
  try {
    console.log('API route called')
    const { opportunityIds, tenantId, userId } = await request.json()

    // Get tenant info
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, name')
      .eq('id', tenantId)
      .single()

    if (tenantError || !tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Get opportunities with project info
    const { data: opportunities, error: oppError } = await supabase
      .from('opportunities')
      .select(`
        *,
        projects (
          name,
          description
        )
      `)
      .in('id', opportunityIds)
      .eq('tenant_id', tenantId)

    if (oppError || !opportunities || opportunities.length === 0) {
      return NextResponse.json({ error: 'No opportunities found' }, { status: 404 })
    }

    // Get all members
    const { data: members, error: membersError } = await supabase
      .from('user_profiles')
      .select('email, first_name, last_name')
      .eq('tenant_id', tenantId)
      .eq('role', 'member')

    if (membersError || !members || members.length === 0) {
      return NextResponse.json({ error: 'No members found' }, { status: 404 })
    }

    // Group opportunities by project
    const projectGroups: { [projectName: string]: any[] } = {}
    opportunities.forEach(opp => {
      const projectName = opp.projects?.name || 'Other'
      if (!projectGroups[projectName]) {
        projectGroups[projectName] = []
      }
      projectGroups[projectName].push(opp)
    })

    // Format date/time for opportunities
    const formatDateTime = (opportunity: any) => {
      const parts = []
      
      if (opportunity.date_scheduled) {
        parts.push(new Date(opportunity.date_scheduled).toLocaleDateString())
      }
      
      if (opportunity.time_start) {
        const time = new Date(`2000-01-01T${opportunity.time_start}`).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
        parts.push(`at ${time}`)
      }
      
      if (opportunity.duration_hours) {
        parts.push(`(${opportunity.duration_hours}h)`)
      }
      
      return parts.length > 0 ? parts.join(' ') : 'Flexible timing'
    }

    // Send emails to all members
    const emailResults = []
    const allTokensToStore = []

    for (const member of members) {
      try {
        // Generate tokens for this member
        const memberTokens: { [oppId: string]: string } = {}
        
        for (const opportunity of opportunities) {
          const token = generateSignupToken(member.email, opportunity.id, tenantId)
          memberTokens[opportunity.id] = token
          
          allTokensToStore.push({
            signup_token: token,
            opportunity_id: opportunity.id,
            tenant_id: tenantId,
            member_email: member.email,
            member_name: `${member.first_name} ${member.last_name}`,
            status: 'pending'
          })
        }

        // Create email content for this member
        const projectSections = Object.entries(projectGroups).map(([projectName, projectOpps]) => {
          const oppList = projectOpps.map(opp => {
            const signupUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/signup/${memberTokens[opp.id]}`
            
            return `
              <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 12px 0; background: #ffffff;">
                <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${opp.title}</h4>
                
                ${opp.description ? `<p style="margin: 8px 0; color: #6b7280; font-size: 14px;">${opp.description}</p>` : ''}
                
                <div style="margin: 12px 0; font-size: 14px; color: #6b7280;">
                  <div style="margin: 4px 0;">📅 <strong>When:</strong> ${formatDateTime(opp)}</div>
                  ${opp.location ? `<div style="margin: 4px 0;">📍 <strong>Where:</strong> ${opp.location}</div>` : ''}
                  <div style="margin: 4px 0;">👥 <strong>Volunteers needed:</strong> ${opp.volunteers_needed}</div>
                  ${opp.skills_required && opp.skills_required.length > 0 ? `<div style="margin: 4px 0;">🔧 <strong>Skills:</strong> ${opp.skills_required.join(', ')}</div>` : ''}
                </div>
                
                <div style="margin: 16px 0;">
                  <a href="${signupUrl}" 
                     style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500; font-size: 14px;">
                    Sign Up for This Opportunity
                  </a>
                </div>
              </div>`
          }).join('')

          return `
            <div style="margin: 24px 0;">
              <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">${projectName}</h3>
              ${oppList}
            </div>`
        }).join('')

        // Send email to this member
        const { data, error } = await resend.emails.send({
          from: 'noreply@voluntold.net',
          to: [member.email],
          subject: `New Sign-Up Sheets - ${tenant.name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Sign-Up Sheets - ${tenant.name}</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
              
              <div style="text-align: center; margin-bottom: 32px; padding: 20px; background: #f9fafb; border-radius: 8px;">
                <h1 style="margin: 0; color: #1f2937;">New Sign-Up SHeets!</h1>
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 16px;">${tenant.name}</p>
              </div>

              <div style="margin-bottom: 24px;">
                <p>Hi ${member.first_name},</p>
                <p>We have ${opportunities.length} new volunteer ${opportunities.length === 1 ? 'opportunity' : 'opportunities'} available. Click the "Sign Up" button for any opportunities that interest you!</p>
              </div>

              ${projectSections}

              <div style="margin-top: 32px; padding: 20px; background: #f9fafb; border-radius: 8px; font-size: 14px; color: #6b7280;">
                <p style="margin: 0;"><strong>Questions?</strong> Reply to this email or contact your project coordinator.</p>
                <p style="margin: 8px 0 0 0;">Thank you for volunteering with ${tenant.name}!</p>
              </div>

            </body>
            </html>`,
          text: `Hi ${member.first_name}! New Sign-Up Sheets from ${tenant.name}:\n\n${opportunities.map(opp => `${opp.title} - ${formatDateTime(opp)} - Sign up: ${process.env.NEXT_PUBLIC_SITE_URL}/signup/${memberTokens[opp.id]}`).join('\n\n')}`
        })

        if (error) {
          console.error(`Email failed for ${member.email}:`, error)
          emailResults.push({ member: member.email, success: false, error: error.message })
        } else {
          emailResults.push({ member: member.email, success: true, emailId: data?.id })
        }

        // Small delay to avoid overwhelming Resend
        // Delay to respect Resend's 2 requests per second limit
        await new Promise(resolve => setTimeout(resolve, 1200))

      } catch (error) {
        console.error(`Error sending to ${member.email}:`, error)
        emailResults.push({ 
          member: member.email, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Store all tokens in database
    if (allTokensToStore.length > 0) {
      const { error: tokenError } = await supabase
        .from('signup_tokens')
        .insert(allTokensToStore)

      if (tokenError) {
        console.error('Error storing tokens:', tokenError)
        // Don't fail the whole operation for this
      }
    }

    // Record the broadcast
    const { error: broadcastError } = await supabase
      .from('email_broadcasts')
      .insert({
        tenant_id: tenantId,
        opportunity_ids: opportunityIds,
        sent_by: userId,
        recipient_count: members.length
      })

    if (broadcastError) {
      console.error('Error recording broadcast:', broadcastError)
    }

    // Count results
    const successful = emailResults.filter(r => r.success).length
    const failed = emailResults.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${successful} members${failed > 0 ? `, ${failed} failed` : ''}`,
      results: {
        total: members.length,
        successful,
        failed,
        opportunities: opportunities.length,
        projects: Object.keys(projectGroups).length
      }
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Error: ' + (error as Error).message }, 
      { status: 500 }
    )
  }
}