// File: src/app/api/contact/route.ts - Version 1.0
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, organization, message } = body

    // Validate required fields
    if (!name || !email || !organization || !message) {
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

    // Send email to info@voluntold.net
    const emailData = await resend.emails.send({
      from: 'contact@voluntold.net',
      to: 'info@voluntold.net',
      subject: `Contact Form Submission from ${organization}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Organization:</strong> ${organization}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #374151;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-radius: 8px; font-size: 14px; color: #1e40af;">
            <p style="margin: 0;"><strong>Reply to:</strong> ${email}</p>
            <p style="margin: 5px 0 0 0;">This message was sent via the Voluntold contact form.</p>
          </div>
        </div>
      `,
      // Also include a plain text version
      text: `
        New Contact Form Submission
        
        Contact Information:
        Name: ${name}
        Email: ${email}
        Organization: ${organization}
        
        Message:
        ${message}
        
        Reply to: ${email}
        This message was sent via the Voluntold contact form.
      `
    })

    if (emailData.error) {
      console.error('Resend error:', emailData.error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully', id: emailData.data?.id },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}