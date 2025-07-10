'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

interface MemberInfo {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string | null
  position: string | null
  tenant_id: string
}

interface TenantInfo {
  id: string
  name: string
  slug: string
}

interface UpcomingOpportunity {
  id: string
  title: string
  project_name: string
  date_scheduled: string
  time_start: string
  duration_hours: number
  volunteers_needed: number
  filled_count: number
  is_signed_up: boolean
  location?: string
}

interface HoursBreakdown {
  lifetime_total: number
  this_year_total: number
  opportunity_hours: number
  additional_hours: number
  projects: {
    project_name: string
    hours: number
  }[]
}

interface PollItem {
  id: string
  title: string
  question: string
  poll_type: 'yes_no' | 'multiple_choice'
  options?: string[]
  expires_at: string | null
  has_responded: boolean
  member_response?: string
}

interface RosterMember {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string | null
  position: string | null
}

export default function MemberPortal({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null)
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null)
  const [upcomingOpportunities, setUpcomingOpportunities] = useState<UpcomingOpportunity[]>([])
  const [hoursBreakdown, setHoursBreakdown] = useState<HoursBreakdown | null>(null)
  const [activePolls, setActivePolls] = useState<PollItem[]>([])
  const [roster, setRoster] = useState<RosterMember[]>([])
  const [message, setMessage] = useState('')
  const [selectedPoll, setSelectedPoll] = useState<PollItem | null>(null)

  // Load member data based on token
  useEffect(() => {
    loadMemberData()
  }, [params.token])

  const loadMemberData = async () => {
    try {
      // TODO: Validate token and get member info
      // For now, using mock data
      
      // Mock member info
      setMemberInfo({
        id: 'mock-member-id',
        email: 'john.doe@email.com',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '555-123-4567',
        position: 'Volunteer',
        tenant_id: 'mock-tenant-id'
      })

      // Mock tenant info
      setTenantInfo({
        id: 'mock-tenant-id',
        name: 'Community Volunteers',
        slug: 'community-volunteers'
      })

      // Load all member data
      await Promise.all([
        loadUpcomingOpportunities(),
        loadHoursBreakdown(),
        loadActivePolls(),
        loadRoster()
      ])

    } catch (error) {
      setMessage(`Error loading member data: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadUpcomingOpportunities = async () => {
    // TODO: Load opportunities from database
    // Query: Future opportunities + member signup status + available spots
    
    // Mock data
    setUpcomingOpportunities([
      {
        id: '1',
        title: 'Morning Registration Desk',
        project_name: '2026 Charity Run',
        date_scheduled: '2025-08-15',
        time_start: '07:00',
        duration_hours: 4,
        volunteers_needed: 3,
        filled_count: 2,
        is_signed_up: true,
        location: 'Main Entrance'
      },
      {
        id: '2',
        title: 'Setup Crew',
        project_name: 'Annual Picnic',
        date_scheduled: '2025-08-20',
        time_start: '08:00',
        duration_hours: 3,
        volunteers_needed: 5,
        filled_count: 3,
        is_signed_up: false,
        location: 'Community Park'
      },
      {
        id: '3',
        title: 'Afternoon Cleanup',
        project_name: 'Annual Picnic',
        date_scheduled: '2025-08-20',
        time_start: '15:00',
        duration_hours: 2,
        volunteers_needed: 4,
        filled_count: 4,
        is_signed_up: false,
        location: 'Community Park'
      }
    ])
  }

  const loadHoursBreakdown = async () => {
    // TODO: Calculate hours from signups + additional_hours
    
    // Mock data
    setHoursBreakdown({
      lifetime_total: 147.5,
      this_year_total: 47.5,
      opportunity_hours: 32.0,
      additional_hours: 15.5,
      projects: [
        { project_name: '2025 Charity Run', hours: 12.0 },
        { project_name: 'Community Garden', hours: 20.0 },
        { project_name: 'Food Drive', hours: 15.5 }
      ]
    })
  }

  const loadActivePolls = async () => {
    // TODO: Load active polls + member response status
    
    // Mock data
    setActivePolls([
      {
        id: '1',
        title: 'Annual Picnic Location',
        question: 'Where should we hold this year\'s annual picnic?',
        poll_type: 'multiple_choice',
        options: ['Community Park', 'Beach Front', 'School Gymnasium'],
        expires_at: '2025-08-01T23:59:59Z',
        has_responded: false
      },
      {
        id: '2',
        title: 'Meeting Schedule',
        question: 'Should we continue monthly meetings on the first Saturday?',
        poll_type: 'yes_no',
        expires_at: null,
        has_responded: true,
        member_response: 'Yes'
      }
    ])
  }

  const loadRoster = async () => {
    // TODO: Load all members for this tenant
    
    // Mock data
    setRoster([
      {
        id: '1',
        first_name: 'Alice',
        last_name: 'Anderson',
        email: 'alice@email.com',
        phone_number: '555-111-2222',
        position: 'Treasurer'
      },
      {
        id: '2',
        first_name: 'Bob',
        last_name: 'Brown',
        email: 'bob@email.com',
        phone_number: '555-333-4444',
        position: 'Member'
      },
      {
        id: '3',
        first_name: 'Carol',
        last_name: 'Davis',
        email: 'carol@email.com',
        phone_number: null,
        position: 'Secretary'
      },
      {
        id: '4',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@email.com',
        phone_number: '555-123-4567',
        position: 'Volunteer'
      }
    ])
  }

  const submitPollResponse = async (pollId: string, response: string) => {
    // TODO: Submit poll response
    setMessage(`Response "${response}" submitted successfully!`)
    setSelectedPoll(null)
    // Reload polls to update status
    loadActivePolls()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!memberInfo || !tenantInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Invalid or expired access link.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Voluntold</h1>
              <span className="ml-3 text-gray-400">|</span>
              <span className="ml-3 text-gray-600">Member Portal</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {memberInfo.first_name} {memberInfo.last_name}
              </div>
              <div className="text-sm text-gray-500">{tenantInfo.name}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {memberInfo.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">Your volunteer portal for {tenantInfo.name}</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Opportunities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Upcoming Opportunities</h2>
            </div>
            <div className="p-6">
              {upcomingOpportunities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming opportunities available.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                          <p className="text-blue-600 font-medium">{opportunity.project_name}</p>
                        </div>
                        {opportunity.is_signed_up ? (
                          <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                            ✓ Signed Up
                          </span>
                        ) : opportunity.filled_count >= opportunity.volunteers_needed ? (
                          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded">
                            Full
                          </span>
                        ) : (
                          <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2 py-1 rounded">
                            Open
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <strong>Date:</strong> {new Date(opportunity.date_scheduled).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Time:</strong> {opportunity.time_start}
                        </div>
                        <div>
                          <strong>Duration:</strong> {opportunity.duration_hours} hours
                        </div>
                        <div>
                          <strong>Spots:</strong> {opportunity.filled_count}/{opportunity.volunteers_needed} filled
                        </div>
                        {opportunity.location && (
                          <div className="col-span-2">
                            <strong>Location:</strong> {opportunity.location}
                          </div>
                        )}
                      </div>

                      {!opportunity.is_signed_up && opportunity.filled_count < opportunity.volunteers_needed && (
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Sign Up →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hours Tracking */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Your Volunteer Hours</h2>
            </div>
            <div className="p-6">
              {hoursBreakdown ? (
                <div>
                  {/* Total Hours */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">
                          {hoursBreakdown.this_year_total}
                        </div>
                        <div className="text-blue-700 font-medium">This Year</div>
                      </div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">
                          {hoursBreakdown.lifetime_total}
                        </div>
                        <div className="text-blue-700 font-medium">Lifetime Total</div>
                      </div>
                    </div>
                  </div>

                  {/* Hours Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From volunteer opportunities:</span>
                      <span className="font-medium">{hoursBreakdown.opportunity_hours} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Additional hours logged:</span>
                      <span className="font-medium">{hoursBreakdown.additional_hours} hrs</span>
                    </div>
                  </div>

                  {/* Project Breakdown */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Hours by Project:</h4>
                    <div className="space-y-2">
                      {hoursBreakdown.projects.map((project, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{project.project_name}</span>
                          <span className="font-medium">{project.hours} hrs</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hours recorded yet.</p>
              )}
            </div>
          </div>

          {/* Active Polls */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Active Polls</h2>
            </div>
            <div className="p-6">
              {activePolls.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No active polls at this time.</p>
              ) : (
                <div className="space-y-4">
                  {activePolls.map((poll) => (
                    <div key={poll.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{poll.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{poll.question}</p>
                        </div>
                        {poll.has_responded ? (
                          <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                            ✓ Responded
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2 py-1 rounded">
                            Pending
                          </span>
                        )}
                      </div>
                      
                      {poll.expires_at && (
                        <div className="text-xs text-gray-500 mb-3">
                          Expires: {new Date(poll.expires_at).toLocaleDateString()}
                        </div>
                      )}

                      {poll.has_responded ? (
                        <div className="text-sm">
                          <span className="text-gray-600">Your response:</span>{' '}
                          <span className="font-medium text-green-700">{poll.member_response}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedPoll(poll)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Respond →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Membership Roster */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Membership Roster</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {roster.map((member) => (
                      <tr key={member.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {member.first_name} {member.last_name}
                          </div>
                          {member.position && (
                            <div className="text-sm text-gray-500">{member.position}</div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <a 
                            href={`mailto:${member.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {member.email}
                          </a>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.phone_number ? (
                            <a 
                              href={`tel:${member.phone_number}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {member.phone_number}
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Poll Response Modal */}
      {selectedPoll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedPoll.title}</h3>
                <p className="text-gray-600 mt-1">{selectedPoll.question}</p>
              </div>
              <button
                onClick={() => setSelectedPoll(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {selectedPoll.poll_type === 'yes_no' ? (
                <>
                  <button
                    onClick={() => submitPollResponse(selectedPoll.id, 'Yes')}
                    className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => submitPollResponse(selectedPoll.id, 'No')}
                    className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    No
                  </button>
                </>
              ) : (
                selectedPoll.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => submitPollResponse(selectedPoll.id, option)}
                    className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {option}
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPoll(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}