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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading volunteer opportunity...</p>
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
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Signup Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for volunteering for <strong>{signupData?.opportunity.title}</strong>!
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                You should receive a confirmation email shortly with all the details.
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Questions? Contact your project coordinator or reply to the original email.
            </p>
          </div>
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