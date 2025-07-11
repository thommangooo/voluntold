import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface Opportunity {
  id: string
  title: string
  description: string
  date_scheduled: string | null
  time_start: string | null
  duration_hours: number | null
  volunteers_needed: number
  skills_required: string[]
  location: string
}

interface Member {
  email: string
  first_name: string
  last_name: string
}

interface Project {
  name: string
}

interface TenantInfo {
  id: string
  name: string
}

// Generate a unique signup token
export function generateSignupToken(
  memberEmail: string, 
  opportunityId: string, 
  tenantId: string
): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const data = `${memberEmail}-${opportunityId}-${tenantId}-${timestamp}-${randomString}`
  
  // In production, you'd want to encrypt this or use JWT
  return Buffer.from(data).toString('base64url')
}

// Create email content for opportunity signup
export function createOpportunityEmailContent(
  member: Member,
  opportunities: Opportunity[],
  project: Project,
  tenant: TenantInfo,
  signupTokens: { [opportunityId: string]: string }
) {
  const formatDateTime = (opportunity: Opportunity) => {
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

  const opportunityList = opportunities.map(opp => {
    const signupUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/signup/${signupTokens[opp.id]}`
    
    return `
<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0; background: #ffffff;">
  <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px;">${opp.title}</h3>
  
  ${opp.description ? `<p style="margin: 8px 0; color: #6b7280;">${opp.description}</p>` : ''}
  
  <div style="margin: 12px 0; font-size: 14px; color: #6b7280;">
    <div style="margin: 4px 0;">
      📅 <strong>When:</strong> ${formatDateTime(opp)}
    </div>
    ${opp.location ? `<div style="margin: 4px 0;">📍 <strong>Where:</strong> ${opp.location}</div>` : ''}
    <div style="margin: 4px 0;">
      👥 <strong>Volunteers needed:</strong> ${opp.volunteers_needed}
    </div>
    ${opp.skills_required.length > 0 ? `<div style="margin: 4px 0;">🔧 <strong>Skills:</strong> ${opp.skills_required.join(', ')}</div>` : ''}
  </div>
  
  <div style="margin: 16px 0;">
    <a href="${signupUrl}" 
       style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
      Sign Up for This Opportunity
    </a>
  </div>
</div>`
  }).join('')

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign-Up Sheets - ${project.name}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="text-align: center; margin-bottom: 32px; padding: 20px; background: #f9fafb; border-radius: 8px;">
    <h1 style="margin: 0; color: #1f2937;">New Sign-Up Sheets!</h1>
    <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 16px;">${project.name} • ${tenant.name}</p>
  </div>

  <div style="margin-bottom: 24px;">
    <p>Hi ${member.first_name},</p>
    <p>We have ${opportunities.length} new volunteer ${opportunities.length === 1 ? 'opportunity' : 'opportunities'} available for <strong>${project.name}</strong>. Click the "Sign Up" button for any opportunities that interest you!</p>
  </div>

  ${opportunityList}

  <div style="margin-top: 32px; padding: 20px; background: #f9fafb; border-radius: 8px; font-size: 14px; color: #6b7280;">
    <p style="margin: 0;"><strong>Questions?</strong> Reply to this email or contact your project coordinator.</p>
    <p style="margin: 8px 0 0 0;">Thank you for volunteering with ${tenant.name}!</p>
  </div>

</body>
</html>`

  const textContent = `
Hi ${member.first_name},

We have ${opportunities.length} new volunteer ${opportunities.length === 1 ? 'opportunity' : 'opportunities'} available for ${project.name}:

${opportunities.map(opp => {
    const signupUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/signup/${signupTokens[opp.id]}`
    return `
${opp.title}
${opp.description ? opp.description + '\n' : ''}When: ${formatDateTime(opp)}
${opp.location ? `Where: ${opp.location}\n` : ''}Volunteers needed: ${opp.volunteers_needed}
${opp.skills_required.length > 0 ? `Skills: ${opp.skills_required.join(', ')}\n` : ''}
Sign up: ${signupUrl}
`
  }).join('\n---\n')}

Questions? Reply to this email or contact your project coordinator.
Thank you for volunteering with ${tenant.name}!
`

  return {
    subject: `New Sign-Up Sheets: ${project.name}`,
    html: htmlContent,
    text: textContent
  }
}

// Send opportunity emails to members
export async function sendOpportunityEmails(
  members: Member[],
  opportunities: Opportunity[],
  project: Project,
  tenant: TenantInfo,
  fromEmail: string = 'noreply@voluntold.app'
) {
  const results = []

  for (const member of members) {
    try {
      // Generate signup tokens for each opportunity
      const signupTokens: { [opportunityId: string]: string } = {}
      
      for (const opportunity of opportunities) {
        signupTokens[opportunity.id] = generateSignupToken(
          member.email,
          opportunity.id,
          tenant.id
        )
      }

      // Create email content
      const emailContent = createOpportunityEmailContent(
        member,
        opportunities,
        project,
        tenant,
        signupTokens
      )

      // Send email
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [member.email],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      })

      if (error) {
        console.error(`Failed to send email to ${member.email}:`, error)
        results.push({ member: member.email, success: false, error: error.message })
      } else {
        results.push({ member: member.email, success: true, emailId: data?.id })
      }

    } catch (error) {
      console.error(`Error sending email to ${member.email}:`, error)
      results.push({ 
        member: member.email, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  return results
}