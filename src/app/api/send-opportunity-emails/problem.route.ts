import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { sendOpportunityEmails, generateSignupToken } from '../../../lib/email'

export async function POST(request: NextRequest) {
  try {
    const { opportunityIds, tenantId, userId } = await request.json()

    // Verify user is authenticated and belongs to the tenant
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('tenant_id, role')
      .eq('id', userId)
      .single()

    if (profileError || !profile || profile.tenant_id !== tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is tenant admin or super admin
    if (!['tenant_admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
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

    if (oppError) {
      return NextResponse.json({ error: 'Failed to load opportunities' }, { status: 500 })
    }

    if (!opportunities || opportunities.length === 0) {
      return NextResponse.json({ error: 'No opportunities found' }, { status: 404 })
    }

    // Get tenant info
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, name')
      .eq('id', tenantId)
      .single()

    if (tenantError || !tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // Get all members of this tenant
    const { data: members, error: membersError } = await supabase
      .from('user_profiles')
      .select('email, first_name, last_name')
      .eq('tenant_id', tenantId)
      .eq('role', 'member')

    if (membersError) {
      return NextResponse.json({ error: 'Failed to load members' }, { status: 500 })
    }

    if (!members || members.length === 0) {
      return NextResponse.json({ error: 'No members found' }, { status: 404 })
    }

    // Store signup tokens in database for verification later
    const tokensToStore = []
    for (const member of members) {
      for (const opportunity of opportunities) {
        const token = generateSignupToken(member.email, opportunity.id, tenantId)
        tokensToStore.push({
          signup_token: token,
          opportunity_id: opportunity.id,
          tenant_id: tenantId,
          member_email: member.email,
          member_name: `${member.first_name} ${member.last_name}`,
          status: 'pending'
        })
      }
    }

    // Insert tokens into database
    const { error: tokenError } = await supabase
      .from('signup_tokens')
      .insert(tokensToStore)

    if (tokenError) {
      console.error('Error storing signup tokens:', tokenError)
      return NextResponse.json({ error: 'Failed to generate signup tokens' }, { status: 500 })
    }

    // Get project name (assuming all opportunities are from the same project)
    const project = {
      name: opportunities[0].projects?.name || 'Project'
    }

    // Send emails
    const emailResults = await sendOpportunityEmails(
      members,
      opportunities,
      project,
      tenant  // This tenant object has 'id' and 'name'
    )

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
      // Don't fail the request for this
    }

    // Count successes and failures
    const successful = emailResults.filter(r => r.success).length
    const failed = emailResults.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${successful} members${failed > 0 ? `, ${failed} failed` : ''}`,
      results: {
        total: members.length,
        successful,
        failed,
        opportunities: opportunities.length
      }
    })

  } catch (error) {
    console.error('Error sending opportunity emails:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}