// File: src/app/api/organization-signup/route.ts
// Version: 2.0 - API endpoint with email notifications

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, email, phone, clubName, description, memberCount, community } = body
    
    if (!name || !email || !phone || !clubName || !description || !memberCount || !community) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Save to database
    const { data, error } = await supabase
      .from('organization_signups')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          club_name: clubName.trim(),
          description: description.trim(),
          member_count: memberCount,
          community: community.trim(),
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      )
    }

    // Send email notification to admin
    try {
      await resend.emails.send({
        from: 'Voluntold <noreply@voluntold.net>',
        to: [process.env.ADMIN_EMAIL || 'thom.hounsell@gmail.com'], // Set this in your environment variables
        subject: `New Organization Signup: ${clubName}`,
        html: `
          <h2>New Organization Beta Application</h2>
          
          <p>A new organization has applied to join the Voluntold beta program:</p>
          
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Contact Name:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Email:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${email}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Phone:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Organization:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${clubName}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Member Count:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${memberCount}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Community:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${community}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; vertical-align: top;">Description:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${description}</td>
            </tr>
          </table>
          
          <p style="margin-top: 20px;">
            <strong>Application ID:</strong> ${data.id}<br>
            <strong>Submitted:</strong> ${new Date(data.created_at).toLocaleString()}
          </p>
          
          <p style="margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #2196f3;">
            <strong>Next Steps:</strong> Review this application and reach out to ${name} at ${email} to discuss setting up their Voluntold organization.
          </p>
        `,
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the request if email fails - the data is already saved
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully',
        id: data.id 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}