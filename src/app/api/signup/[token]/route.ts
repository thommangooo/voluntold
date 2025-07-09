import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// GET - Load signup data for the token
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = await params

    // Get signup token data with opportunity and project info
    const { data: tokenData, error: tokenError } = await supabase
      .from('signup_tokens')
      .select(`
        *,
        opportunities (
          id,
          title,
          description,
          date_scheduled,
          time_start,
          duration_hours,
          volunteers_needed,
          skills_required,
          location,
          projects (
            name
          )
        ),
        tenants (
          name
        )
      `)
      .eq('signup_token', token)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired signup link' },
        { status: 404 }
      )
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at)
    const now = new Date()
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'This signup link has expired' },
        { status: 410 }
      )
    }

    // Check if already used (but allow viewing)
    const tokenStatus = tokenData.status

    // Check if member already signed up for this opportunity
    const { data: existingSignup } = await supabase
      .from('signups')
      .select('id')
      .eq('opportunity_id', tokenData.opportunity_id)
      .eq('member_email', tokenData.member_email)
      .eq('status', 'confirmed')
      .single()

    const signupData = {
      member_name: tokenData.member_name,
      member_email: tokenData.member_email,
      opportunity: {
        id: tokenData.opportunities.id,
        title: tokenData.opportunities.title,
        description: tokenData.opportunities.description,
        date_scheduled: tokenData.opportunities.date_scheduled,
        time_start: tokenData.opportunities.time_start,
        duration_hours: tokenData.opportunities.duration_hours,
        volunteers_needed: tokenData.opportunities.volunteers_needed,
        skills_required: tokenData.opportunities.skills_required,
        location: tokenData.opportunities.location,
        project_name: tokenData.opportunities.projects?.name || 'Project'
      },
      tenant: {
        name: tokenData.tenants.name
      },
      token_status: tokenStatus,
      existing_signup: !!existingSignup
    }

    return NextResponse.json({
      success: true,
      data: signupData
    })

  } catch (error) {
    console.error('Error loading signup data:', error)
    return NextResponse.json(
      { error: 'Failed to load signup information' },
      { status: 500 }
    )
  }
}

// POST - Confirm the signup
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token

    // Get and validate token
    const { data: tokenData, error: tokenError } = await supabase
      .from('signup_tokens')
      .select('*')
      .eq('signup_token', token)
      .eq('status', 'pending')
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid or already used signup link' },
        { status: 404 }
      )
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at)
    const now = new Date()
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'This signup link has expired' },
        { status: 410 }
      )
    }

    // Check if member already signed up for this opportunity
    const { data: existingSignup } = await supabase
      .from('signups')
      .select('id')
      .eq('opportunity_id', tokenData.opportunity_id)
      .eq('member_email', tokenData.member_email)
      .eq('status', 'confirmed')
      .single()

    if (existingSignup) {
      // Update existing signup timestamp
      const { error: updateError } = await supabase
        .from('signups')
        .update({ signed_up_at: new Date().toISOString() })
        .eq('id', existingSignup.id)

      if (updateError) {
        console.error('Error updating existing signup:', updateError)
      }
    } else {
      // Create new signup record
      const { error: signupError } = await supabase
        .from('signups')
        .insert({
          opportunity_id: tokenData.opportunity_id,
          tenant_id: tokenData.tenant_id,
          member_email: tokenData.member_email,
          member_name: tokenData.member_name,
          signup_token: token,
          status: 'confirmed'
        })

      if (signupError) {
        console.error('Error creating signup:', signupError)
        return NextResponse.json(
          { error: 'Failed to confirm signup' },
          { status: 500 }
        )
      }
    }

    // Mark token as used
    const { error: tokenUpdateError } = await supabase
      .from('signup_tokens')
      .update({ status: 'used' })
      .eq('signup_token', token)

    if (tokenUpdateError) {
      console.error('Error updating token status:', tokenUpdateError)
      // Don't fail the request for this
    }

    return NextResponse.json({
      success: true,
      message: existingSignup ? 'Signup updated successfully' : 'Signup confirmed successfully'
    })

  } catch (error) {
    console.error('Error confirming signup:', error)
    return NextResponse.json(
      { error: 'Failed to confirm signup' },
      { status: 500 }
    )
  }
}