// File: src/app/api/send-poll-emails/route.ts
// Version: 2.0 - Added group targeting support and email footer information

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(request: NextRequest) {
  try {
    const { pollId, tenantId, userId } = await request.json()

    if (!pollId || !tenantId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get poll details with targeting information
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .eq('tenant_id', tenantId)
      .single()

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    // Get tenant info
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('name')
      .eq('id', tenantId)
      .single()

    if (tenantError || !tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Determine target members based on poll targeting settings
    let targetMemberEmails: string[] = []
    let targetingInfo = ''

    if (poll.target_all_members) {
      // Get all members
      const { data: allMembers, error: allMembersError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('tenant_id', tenantId)

      if (allMembersError) {
        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
      }

      targetMemberEmails = allMembers?.map(m => m.email) || []
      targetingInfo = 'All Members'
      
    } else if (poll.target_groups && poll.target_groups.length > 0) {
      // Get members from selected groups (with deduplication)
      const { data: groupMemberEmails, error: groupError } = await supabase
        .rpc('get_group_member_emails', {
          group_ids: poll.target_groups,
          tenant_id_param: tenantId
        })

      if (groupError) {
        return NextResponse.json({ error: 'Failed to fetch group members' }, { status: 500 })
      }

      targetMemberEmails = groupMemberEmails || []

      // Get group names for footer display
      const { data: groups, error: groupNamesError } = await supabase
        .from('groups')
        .select('name')
        .eq('tenant_id', tenantId)
        .in('id', poll.target_groups)

      if (groupNamesError) {
        console.warn('Failed to fetch group names:', groupNamesError)
        targetingInfo = 'Selected Groups'
      } else {
        const groupNames = groups?.map(g => g.name).join(', ') || 'Selected Groups'
        targetingInfo = `Groups: ${groupNames}`
      }
      
    } else {
      return NextResponse.json({ error: 'No target audience specified' }, { status: 400 })
    }

    if (targetMemberEmails.length === 0) {
      return NextResponse.json({ error: 'No target members found' }, { status: 404 })
    }

    // Get full member details for the target emails
    const { data: members, error: membersError } = await supabase
      .from('user_profiles')
      .select('email, first_name, last_name')
      .eq('tenant_id', tenantId)
      .in('email', targetMemberEmails)

    if (membersError) {
      return NextResponse.json({ error: 'Failed to fetch member details' }, { status: 500 })
    }

    if (!members || members.length === 0) {
      return NextResponse.json({ error: 'No members found' }, { status: 404 })
    }

    console.log(`Sending poll to ${members.length} members (${targetingInfo})...`)

    let successful = 0
    let failed = 0
    const failedEmails = []

    // Send emails to target members with rate limiting
    for (const member of members) {
      try {
        const voteToken = crypto.randomUUID()
        
        // Generate vote URLs for each option
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
        let voteButtons = ''

        if (poll.poll_type === 'yes_no') {
          voteButtons = `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/vote/${voteToken}?response=Yes" 
                 style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px; display: inline-block;">
                YES
              </a>
              <a href="${baseUrl}/vote/${voteToken}?response=No" 
                 style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px; display: inline-block;">
                NO
              </a>
            </div>
          `
        } else {
          voteButtons = '<div style="text-align: center; margin: 30px 0;">'
          poll.options?.forEach((option: string) => {
            voteButtons += `
              <a href="${baseUrl}/vote/${voteToken}?response=${encodeURIComponent(option)}" 
                 style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 5px; display: inline-block;">
                ${option}
              </a>
            `
          })
          voteButtons += '</div>'
        }

        // Update existing poll response record with vote token
        const { error: insertError } = await supabase
          .from('poll_responses')
          .update({ response_token: voteToken })
          .eq('poll_id', pollId)
          .eq('member_email', member.email)

        if (insertError) {
          console.error('Error updating vote token for', member.email, ':', insertError)
          failed++
          failedEmails.push(member.email)
          continue
        }

        // Send email with enhanced footer including targeting information
        const emailResult = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'polls@voluntold.net',
          to: member.email,
          subject: `Poll: ${poll.title} - ${tenant.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="color: #1e293b; margin: 0 0 10px 0;">${tenant.name}</h1>
                <h2 style="color: #475569; margin: 0; font-size: 18px;">New Poll: ${poll.title}</h2>
              </div>
              
              <div style="background-color: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h3 style="color: #334155; margin: 0 0 20px 0; font-size: 20px;">${poll.question}</h3>
                
                <p style="color: #64748b; margin-bottom: 20px;">
                  Hi ${member.first_name}, please cast your vote by clicking one of the options below:
                </p>
                
                ${voteButtons}
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
                  <p>This poll ${poll.is_anonymous ? 'is anonymous' : 'will show your name with your response'}.</p>
                  ${poll.expires_at ? `<p>Poll expires: ${new Date(poll.expires_at).toLocaleString()}</p>` : ''}
                  <p>You can only vote once. Choose carefully!</p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
                <p>This email was sent by ${tenant.name} via Voluntold.</p>
                <p style="margin-top: 8px; font-style: italic;">Sent to: ${targetingInfo}</p>
              </div>
            </div>
          `
        })

        console.log(`Email sent successfully to ${member.email}`)
        successful++

        // Wait 1.1 seconds between emails (respects 1 email/second limit)
        if (members.indexOf(member) < members.length - 1) {
          await delay(1100)
        }

      } catch (emailError) {
        console.error('Failed to send email to', member.email, ':', emailError)
        failed++
        failedEmails.push(member.email)
        
        // Still wait before next attempt
        if (members.indexOf(member) < members.length - 1) {
          await delay(1100)
        }
      }
    }

    // Update the poll's last_emailed_at timestamp
    const { error: updateError } = await supabase
      .from('polls')
      .update({ last_emailed_at: new Date().toISOString() })
      .eq('id', pollId)

    if (updateError) {
      console.warn('Failed to update last_emailed_at:', updateError)
    }

    // Return success response with targeting information
    return NextResponse.json({
      message: `Poll emails sent to ${targetingInfo}! ${successful} successful, ${failed} failed.`,
      sent: successful,
      failed: failed,
      failedEmails: failedEmails,
      targetingInfo: targetingInfo
    })

  } catch (error) {
    console.error('Error sending poll emails:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to send poll emails', details: errorMessage },
      { status: 500 }
    )
  }
}