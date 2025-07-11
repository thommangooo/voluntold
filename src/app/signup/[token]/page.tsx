'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface SignupData {
  member_name: string
  member_email: string
  opportunity: {
    id: string
    title: string
    description: string
    date_scheduled: string | null
    time_start: string | null
    duration_hours: number | null
    volunteers_needed: number
    skills_required: string[]
    location: string
    project_name: string
  }
  tenant: {
    name: string
  }
  token_status: string
  existing_signup: boolean
}

export default function SignupPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [signupData, setSignupData] = useState<SignupData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadSignupData()
  }, [token])

  const loadSignupData = async () => {
    try {
      const response = await fetch(`/api/signup/${token}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load signup data')
      }

      setSignupData(result.data)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const confirmSignup = async () => {
    if (!signupData) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/signup/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to confirm signup')
      }

      setSuccess(true)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDateTime = (opportunity: SignupData['opportunity']) => {
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

  // Calendar integration functions
  const generateCalendarData = () => {
    if (!signupData?.opportunity) return null

    const opp = signupData.opportunity
    const startDate = new Date()
    
    // If we have a scheduled date/time, use it; otherwise default to next week
    if (opp.date_scheduled) {
      startDate.setTime(new Date(opp.date_scheduled).getTime())
      
      if (opp.time_start) {
        const [hours, minutes] = opp.time_start.split(':')
        startDate.setHours(parseInt(hours), parseInt(minutes))
      }
    } else {
      // Default to next week if no date specified
      startDate.setDate(startDate.getDate() + 7)
      startDate.setHours(9, 0) // 9 AM default
    }

    const endDate = new Date(startDate)
    if (opp.duration_hours) {
      endDate.setHours(endDate.getHours() + opp.duration_hours)
    } else {
      endDate.setHours(endDate.getHours() + 2) // Default 2 hours
    }

    const formatDateForCal = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const title = `${opp.title} - ${opp.project_name}`
    const description = `Sign-Up Sheet: ${opp.title}${opp.description ? `\n\n${opp.description}` : ''}\n\nOrganization: ${signupData.tenant.name}${opp.skills_required.length > 0 ? `\nSkills: ${opp.skills_required.join(', ')}` : ''}`
    const location = opp.location || ''

    return {
      title,
      description,
      location,
      startDate,
      endDate,
      startDateCal: formatDateForCal(startDate),
      endDateCal: formatDateForCal(endDate)
    }
  }

  const calendarData = generateCalendarData()

  const generateGoogleCalendarUrl = () => {
    if (!calendarData) return ''
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: calendarData.title,
      dates: `${calendarData.startDateCal}/${calendarData.endDateCal}`,
      details: calendarData.description,
      location: calendarData.location
    })
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  const generateIcsFile = () => {
    if (!calendarData) return ''
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Voluntold//Volunteer Signup//EN',
      'BEGIN:VEVENT',
      `UID:${crypto.randomUUID()}@voluntold.app`,
      `DTSTART:${calendarData.startDateCal}`,
      `DTEND:${calendarData.endDateCal}`,
      `SUMMARY:${calendarData.title}`,
      `DESCRIPTION:${calendarData.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${calendarData.location}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Signed up shift in 1 hour',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
    
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    return URL.createObjectURL(blob)
  }

  const generateOutlookUrl = () => {
    if (!calendarData) return ''
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: calendarData.title,
      startdt: calendarData.startDateCal,
      enddt: calendarData.endDateCal,
      body: calendarData.description,
      location: calendarData.location
    })
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Sign-Up Sheet...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Signup</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">
              This link may have expired or already been used. Please contact your organization if you need assistance.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Signup Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for volunteering for <strong>{signupData?.opportunity.title}</strong>!
            </p>
          </div>

          {/* Calendar Integration */}
          {calendarData && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                📅 Add to Your Calendar
              </h3>
              <div className="space-y-3">
                {/* Google Calendar */}
                <a
                  href={generateGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="mr-2">📅</span>
                  Add to Google Calendar
                </a>

                {/* Apple Calendar / iCal */}
                <a
                  href={generateIcsFile()}
                  download={`volunteer-${signupData?.opportunity.title.replace(/[^a-zA-Z0-9]/g, '-') || 'opportunity'}.ics`}
                  className="flex items-center justify-center w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <span className="mr-2">🍎</span>
                  Download for Apple Calendar
                </a>

                {/* Outlook */}
                <a
                  href={generateOutlookUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <span className="mr-2">📧</span>
                  Add to Outlook Calendar
                </a>

                {/* Manual ICS Download */}
                <a
                  href={generateIcsFile()}
                  download={`volunteer-${signupData?.opportunity.title.replace(/[^a-zA-Z0-9]/g, '-') || 'opportunity'}.ics`}
                  className="flex items-center justify-center w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span className="mr-2">💾</span>
                  Download ICS File (Any Calendar)
                </a>
              </div>

              {/* Event Details Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Event Details:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Event:</strong> {calendarData.title}</p>
                  <p><strong>Date:</strong> {calendarData.startDate.toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {calendarData.startDate.toLocaleTimeString()} - {calendarData.endDate.toLocaleTimeString()}</p>
                  {calendarData.location && <p><strong>Location:</strong> {calendarData.location}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 text-center">
              You should receive a confirmation email shortly with all the details.
            </p>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Questions? Contact your project coordinator or reply to the original email.
          </p>
        </div>
      </div>
    )
  }

  if (!signupData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Signup</h1>
          <p className="mt-2 text-lg text-gray-600">{signupData.tenant.name}</p>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Opportunity Details */}
          <div className="px-6 py-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {signupData.opportunity.title}
                </h2>
                <p className="text-lg text-blue-600 font-medium">
                  {signupData.opportunity.project_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Volunteers needed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {signupData.opportunity.volunteers_needed}
                </p>
              </div>
            </div>

            {signupData.opportunity.description && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {signupData.opportunity.description}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📅</span>
                  <div>
                    <p className="font-medium text-gray-900">When</p>
                    <p className="text-gray-600">{formatDateTime(signupData.opportunity)}</p>
                  </div>
                </div>

                {signupData.opportunity.location && (
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📍</span>
                    <div>
                      <p className="font-medium text-gray-900">Where</p>
                      <p className="text-gray-600">{signupData.opportunity.location}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {signupData.opportunity.skills_required.length > 0 && (
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🔧</span>
                    <div>
                      <p className="font-medium text-gray-900">Skills Needed</p>
                      <p className="text-gray-600">
                        {signupData.opportunity.skills_required.join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <span className="text-2xl mr-3">👤</span>
                  <div>
                    <p className="font-medium text-gray-900">Signing up as</p>
                    <p className="text-gray-600">{signupData.member_name}</p>
                    <p className="text-sm text-gray-500">{signupData.member_email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Signup Warning */}
            {signupData.existing_signup && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <span className="text-yellow-500 text-xl mr-3">⚠️</span>
                  <div>
                    <p className="font-medium text-yellow-800">Already Signed Up</p>
                    <p className="text-sm text-yellow-700">
                      You're already registered for this opportunity. Clicking confirm again will update your signup.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={confirmSignup}
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Confirming...
                  </span>
                ) : signupData.existing_signup ? (
                  'Update Signup'
                ) : (
                  'Confirm Signup'
                )}
              </button>
              
              <button
                onClick={() => window.close()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Questions about this opportunity? Contact your project coordinator.
          </p>
        </div>
      </div>
    </div>
  )
}