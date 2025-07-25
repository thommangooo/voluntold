// File: src/app/member/[token]/page.tsx
// Version: 3.1 - Added roster settings support to existing group targeting functionality

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
  roster_enabled: boolean
  roster_show_email: boolean
  roster_show_phone: boolean
  roster_show_address: boolean
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
  description?: string
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
  response_counts: { [key: string]: number }
  total_responses: number
  targeting_display?: string
}

interface RosterMember {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string | null
  position: string | null
  address: string | null
}

interface SignupSheet {
  opportunity: {
    id: string
    title: string
    description: string
    date_scheduled: string
    time_start: string
    duration_hours: number
    volunteers_needed: number
    location: string
    project: {
      name: string
    }
  }
  signups: Array<{
    id: string
    member_name: string
    member_email: string
    signed_up_at: string
    status: string
  }>
}

interface MemberGroup {
  group_id: string
  group_name: string
  added_at: string
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
  const [filteredRoster, setFilteredRoster] = useState<RosterMember[]>([])
  const [rosterSearch, setRosterSearch] = useState('')
  const [message, setMessage] = useState('')
  const [selectedPoll, setSelectedPoll] = useState<PollItem | null>(null)
  const [signupSheets, setSignupSheets] = useState<SignupSheet[]>([])
  const [memberGroups, setMemberGroups] = useState<MemberGroup[]>([])
  const [allGroups, setAllGroups] = useState<{id: string, name: string, member_count: number}[]>([])

  // Load member data based on token
  useEffect(() => {
    loadMemberData()
  }, [params.token])

  // Update filtered roster when roster or search changes
  useEffect(() => {
    if (!rosterSearch.trim()) {
      setFilteredRoster(roster)
    } else {
      const filtered = roster.filter(member => 
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        member.email.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        (member.position && member.position.toLowerCase().includes(rosterSearch.toLowerCase()))
      )
      setFilteredRoster(filtered)
    }
  }, [roster, rosterSearch])

  const loadMemberData = async () => {
    try {
      // Step 1: Check if token exists
      const { data: tokenData, error: tokenError } = await supabase
        .from('member_tokens')
        .select('*')
        .eq('token', params.token)

      if (tokenError || !tokenData || tokenData.length === 0) {
        throw new Error('Invalid access token')
      }

      const token = tokenData[0]

      // Step 2: Check if token is already used
      if (token.used_at) {
        throw new Error('Access token has already been used')
      }

      // Step 3: Check if token is expired
      const now = new Date()
      const expiresAt = new Date(token.expires_at)
      if (now > expiresAt) {
        throw new Error('Access token has expired')
      }

      // Step 4: Mark token as used
      await supabase
        .from('member_tokens')
        .update({ used_at: now.toISOString() })
        .eq('id', token.id)

      // Step 5: Get member info
      const { data: memberData, error: memberError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', token.member_email)
        .eq('tenant_id', token.tenant_id)
        .single()

      if (memberError || !memberData) {
        throw new Error('Member not found')
      }

      // Step 6: Get tenant info including roster settings
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', token.tenant_id)
        .single()

      if (tenantError || !tenantData) {
        throw new Error('Organization not found')
      }

      setMemberInfo(memberData)
      setTenantInfo(tenantData)

      // Load all member data
      await Promise.all([
        loadMemberGroups(token.tenant_id, token.member_email),
        loadAllGroups(token.tenant_id),
        loadUpcomingOpportunities(token.tenant_id, token.member_email),
        loadHoursBreakdown(token.tenant_id, token.member_email),
        loadActivePolls(token.tenant_id, token.member_email),
        // Only load roster if enabled
        tenantData.roster_enabled ? loadRoster(token.tenant_id) : Promise.resolve()
      ])

    } catch (error) {
      console.error('Error loading member data:', error)
      setMessage(`Error loading member data: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadMemberGroups = async (tenantId: string, memberEmail: string) => {
    try {
      const { data: groups, error } = await supabase
        .from('member_group_view')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('member_email', memberEmail)
        .order('group_name', { ascending: true })

      if (error) {
        console.error('Error loading member groups:', error)
        return
      }

      setMemberGroups(groups || [])
    } catch (error) {
      console.error('Error loading member groups:', error)
    }
  }

  const loadAllGroups = async (tenantId: string) => {
    try {
      const { data: groups, error } = await supabase
        .from('group_member_counts')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true })

      if (error) {
        console.error('Error loading all groups:', error)
        return
      }

      setAllGroups(groups || [])
    } catch (error) {
      console.error('Error loading all groups:', error)
    }
  }

  const loadUpcomingOpportunities = async (tenantId: string, memberEmail: string) => {
    try {
      // Get opportunities from projects that this member should see
      const { data: visibleProjects, error: projectsError } = await supabase
        .from('member_visible_projects')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('member_email', memberEmail)

      if (projectsError) {
        console.error('Error loading visible projects:', projectsError)
        return
      }

      const visibleProjectIds = visibleProjects?.map(p => p.id) || []

      if (visibleProjectIds.length === 0) {
        setUpcomingOpportunities([])
        return
      }

      // Get upcoming opportunities from visible projects
      const { data: opportunities, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          projects!inner(name)
        `)
        .eq('tenant_id', tenantId)
        .in('project_id', visibleProjectIds)
        .gte('date_scheduled', new Date().toISOString().split('T')[0])
        .order('date_scheduled', { ascending: true })
        .order('time_start', { ascending: true })

      if (error) {
        console.error('Error loading opportunities:', error)
        return
      }

      // Process opportunities with signup counts and member status
      const processedOpportunities = await Promise.all(
        (opportunities || []).map(async (opp) => {
          // Count confirmed signups
          const { count: filledCount } = await supabase
            .from('signups')
            .select('*', { count: 'exact', head: true })
            .eq('opportunity_id', opp.id)
            .eq('status', 'confirmed')

          // Check if member is signed up
          const { data: memberSignup } = await supabase
            .from('signups')
            .select('*')
            .eq('opportunity_id', opp.id)
            .eq('member_email', memberEmail)
            .eq('status', 'confirmed')
            .single()

          return {
            id: opp.id,
            title: opp.title,
            project_name: opp.projects.name,
            date_scheduled: opp.date_scheduled,
            time_start: opp.time_start || '00:00',
            duration_hours: opp.duration_hours || 0,
            volunteers_needed: opp.volunteers_needed || 1,
            filled_count: filledCount || 0,
            is_signed_up: !!memberSignup,
            location: opp.location,
            description: opp.description
          }
        })
      )

      setUpcomingOpportunities(processedOpportunities)
    } catch (error) {
      console.error('Error loading opportunities:', error)
    }
  }

  const loadHoursBreakdown = async (tenantId: string, memberEmail: string) => {
    try {
      // Get current year
      const currentYear = new Date().getFullYear()
      const startOfYear = `${currentYear}-01-01`
      const endOfYear = `${currentYear}-12-31`

      // Get member profile to get member ID
      const { data: memberProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', memberEmail)
        .eq('tenant_id', tenantId)
        .single()

      if (!memberProfile) return

      // Get hours from completed signups (ALL projects - earned hours are permanent)
      const { data: signupHours } = await supabase
        .from('signups')
        .select(`
          opportunities!inner(duration_hours, date_scheduled, projects!inner(name))
        `)
        .eq('tenant_id', tenantId)
        .eq('member_email', memberEmail)
        .eq('status', 'confirmed')
        .lte('opportunities.date_scheduled', new Date().toISOString().split('T')[0])

      // Get additional hours (ALL projects - earned hours are permanent)
      const { data: additionalHours } = await supabase
        .from('additional_hours')
        .select(`
          hours_worked,
          date_worked,
          projects!inner(name)
        `)
        .eq('tenant_id', tenantId)
        .eq('member_id', memberProfile.id)

      // Calculate totals
      let lifetimeOpportunityHours = 0
      let thisYearOpportunityHours = 0
      let lifetimeAdditionalHours = 0
      let thisYearAdditionalHours = 0
      const projectHours: { [key: string]: number } = {}

      // Process signup hours
      signupHours?.forEach(signup => {
        const hours = (signup.opportunities as any).duration_hours || 0
        const date = (signup.opportunities as any).date_scheduled
        const projectName = ((signup.opportunities as any).projects as any).name
        
        lifetimeOpportunityHours += hours
        projectHours[projectName] = (projectHours[projectName] || 0) + hours
        
        if (date >= startOfYear && date <= endOfYear) {
          thisYearOpportunityHours += hours
        }
      })

      // Process additional hours
      additionalHours?.forEach((hoursRecord: any) => {
        const hoursWorked = hoursRecord.hours_worked || 0
        const date = hoursRecord.date_worked
        const projectName = hoursRecord.projects.name
        
        lifetimeAdditionalHours += hoursWorked
        projectHours[projectName] = (projectHours[projectName] || 0) + hoursWorked
        
        if (date >= startOfYear && date <= endOfYear) {
          thisYearAdditionalHours += hoursWorked
        }
      })

      // Convert project hours to array
      const projectsArray = Object.entries(projectHours).map(([project_name, hours]) => ({
        project_name,
        hours
      }))

      setHoursBreakdown({
        lifetime_total: lifetimeOpportunityHours + lifetimeAdditionalHours,
        this_year_total: thisYearOpportunityHours + thisYearAdditionalHours,
        opportunity_hours: lifetimeOpportunityHours,
        additional_hours: lifetimeAdditionalHours,
        projects: projectsArray
      })
    } catch (error) {
      console.error('Error loading hours breakdown:', error)
    }
  }

  const loadActivePolls = async (tenantId: string, memberEmail: string) => {
    try {
      // Get all active polls
      const { data: polls, error } = await supabase
        .from('polls')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading polls:', error)
        return
      }

      // Get member's group IDs
      const memberGroupIds = memberGroups.map(g => g.group_id)

      // Filter polls based on targeting
      const relevantPolls = polls?.filter(poll => {
        if (poll.target_all_members) {
          return true // Member should see this poll
        }
        
        if (poll.target_groups && poll.target_groups.length > 0) {
          // Check if member is in any of the target groups
          return poll.target_groups.some((groupId: string) => memberGroupIds.includes(groupId))
        }
        
        return false // Poll has no targeting or member not in target groups
      }) || []

      // Check member responses and get response counts for each relevant poll
      const pollsWithResponses = await Promise.all(
        relevantPolls.map(async (poll) => {
          // Check if member has responded
          const { data: response } = await supabase
            .from('poll_responses')
            .select('response')
            .eq('poll_id', poll.id)
            .eq('member_email', memberEmail)
            .single()

          // Get all responses for this poll to calculate counts
          const { data: allResponses } = await supabase
            .from('poll_responses')
            .select('response')
            .eq('poll_id', poll.id)

          // Calculate response counts
          const responseCounts: { [key: string]: number } = {}
          let totalResponses = 0

          if (allResponses) {
            allResponses.forEach(resp => {
              const responseValue = resp.response
              responseCounts[responseValue] = (responseCounts[responseValue] || 0) + 1
              totalResponses++
            })
          }

          // For yes/no polls, ensure both options are present
          if (poll.poll_type === 'yes_no') {
            responseCounts['Yes'] = responseCounts['Yes'] || 0
            responseCounts['No'] = responseCounts['No'] || 0
          }

          // For multiple choice polls, ensure all options are present
          if (poll.poll_type === 'multiple_choice' && poll.options) {
            (poll.options as string[]).forEach(option => {
              responseCounts[option] = responseCounts[option] || 0
            })
          }

          // Generate targeting display
          let targetingDisplay = ''
          if (poll.target_all_members) {
            targetingDisplay = 'All Members'
          } else if (poll.target_groups && poll.target_groups.length > 0) {
            const targetGroupNames = allGroups
              .filter(g => poll.target_groups!.includes(g.id))
              .map(g => g.name)
              .join(', ')
            targetingDisplay = `Groups: ${targetGroupNames}`
          }

          return {
            id: poll.id,
            title: poll.title,
            question: poll.question,
            poll_type: poll.poll_type as 'yes_no' | 'multiple_choice',
            options: poll.options as string[] | undefined,
            expires_at: poll.expires_at,
            has_responded: !!response,
            member_response: response?.response,
            response_counts: responseCounts,
            total_responses: totalResponses,
            targeting_display: targetingDisplay
          }
        })
      )

      setActivePolls(pollsWithResponses)
    } catch (error) {
      console.error('Error loading polls:', error)
    }
  }

  const loadRoster = async (tenantId: string) => {
    try {
      const { data: members, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, email, phone_number, position, address')
        .eq('tenant_id', tenantId)
        .order('first_name', { ascending: true })

      if (error) {
        console.error('Error loading roster:', error)
        return
      }

      setRoster(members || [])
      setFilteredRoster(members || [])
    } catch (error) {
      console.error('Error loading roster:', error)
    }
  }

  // Filter roster based on search
  const handleRosterSearch = (searchTerm: string) => {
    setRosterSearch(searchTerm)
  }

  const loadSignupSheets = async (tenantId: string) => {
    try {
      // Get member's visible projects
      const { data: visibleProjects } = await supabase
        .from('member_visible_projects')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('member_email', memberInfo!.email)

      const visibleProjectIds = visibleProjects?.map(p => p.id) || []

      if (visibleProjectIds.length === 0) {
        setSignupSheets([])
        return
      }

      // Get current and future opportunities from visible projects only
      const { data: opportunities, error: opportunitiesError } = await supabase
        .from('opportunities')
        .select(`
          id,
          title,
          description,
          date_scheduled,
          time_start,
          duration_hours,
          volunteers_needed,
          location,
          projects!inner(name)
        `)
        .eq('tenant_id', tenantId)
        .in('project_id', visibleProjectIds)
        .gte('date_scheduled', new Date().toISOString().split('T')[0])
        .order('date_scheduled', { ascending: true })

      if (opportunitiesError) {
        console.error('Error fetching opportunities:', opportunitiesError)
        return
      }

      // Get all signups for these opportunities
      const opportunityIds = opportunities?.map(opp => opp.id) || []
      
      interface SignupData {
        id: string
        opportunity_id: string
        member_email: string
        member_name: string
        signed_up_at: string
        status: string
      }

      let allSignups: SignupData[] = []
      if (opportunityIds.length > 0) {
        const { data: signups, error: signupsError } = await supabase
          .from('signups')
          .select(`
            id,
            opportunity_id,
            member_email,
            member_name,
            signed_up_at,
            status
          `)
          .eq('tenant_id', tenantId)
          .in('opportunity_id', opportunityIds)
          .order('signed_up_at', { ascending: true })

        if (!signupsError && signups) {
          allSignups = signups as SignupData[]
        }
      }

      // Group signups by opportunity_id
      const signupsByOpportunity = allSignups.reduce((acc, signup) => {
        if (!acc[signup.opportunity_id]) {
          acc[signup.opportunity_id] = []
        }
        acc[signup.opportunity_id].push(signup)
        return acc
      }, {} as Record<string, SignupData[]>)

      // Combine opportunities with their signups
      const sheets = opportunities?.map(opportunity => ({
        opportunity: {
          id: opportunity.id,
          title: opportunity.title,
          description: opportunity.description || '',
          date_scheduled: opportunity.date_scheduled,
          time_start: opportunity.time_start,
          duration_hours: opportunity.duration_hours,
          volunteers_needed: opportunity.volunteers_needed,
          location: opportunity.location || '',
          project: {
            name: (opportunity.projects as any).name
          }
        },
        signups: signupsByOpportunity[opportunity.id] || []
      })) || []

      setSignupSheets(sheets)
    } catch (error) {
      console.error('Error loading signup sheets:', error)
    }
  }

  const submitPollResponse = async (pollId: string, response: string) => {
    try {
      if (!memberInfo || !tenantInfo) return

      // Generate response token
      const responseToken = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15)

      // Submit response
      const { error } = await supabase
        .from('poll_responses')
        .insert({
          poll_id: pollId,
          tenant_id: tenantInfo.id,
          member_email: memberInfo.email,
          member_name: `${memberInfo.first_name} ${memberInfo.last_name}`,
          response,
          response_token: responseToken
        })

      if (error) {
        console.error('Error submitting poll response:', error)
        setMessage('Error submitting response. Please try again.')
        return
      }

      // Update poll response count
      await supabase.rpc('increment_poll_responses', { poll_id: pollId })

      setMessage(`Response "${response}" submitted successfully!`)
      setSelectedPoll(null)
      
      // Reload polls to update status and counts
      if (tenantInfo && memberInfo) {
        loadActivePolls(tenantInfo.id, memberInfo.email)
      }
    } catch (error) {
      console.error('Error submitting poll response:', error)
      setMessage('Error submitting response. Please try again.')
    }
  }

  const signUpForOpportunity = async (opportunityId: string) => {
    try {
      if (!memberInfo || !tenantInfo) return

      // Check if already signed up
      const { data: existingSignup } = await supabase
        .from('signups')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .eq('member_email', memberInfo.email)
        .single()

      if (existingSignup) {
        setMessage('You are already signed up for this opportunity.')
        return
      }

      // Check if opportunity is full
      const { count: currentSignups } = await supabase
        .from('signups')
        .select('*', { count: 'exact', head: true })
        .eq('opportunity_id', opportunityId)
        .eq('status', 'confirmed')

      const opportunity = upcomingOpportunities.find(opp => opp.id === opportunityId)
      if (opportunity && currentSignups && currentSignups >= opportunity.volunteers_needed) {
        setMessage('This Sign-up Sheet is already full.')
        return
      }

      // Generate signup token
      const signupToken = Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15)

      // Create signup
      const { error } = await supabase
        .from('signups')
        .insert({
          opportunity_id: opportunityId,
          tenant_id: tenantInfo.id,
          member_email: memberInfo.email,
          member_name: `${memberInfo.first_name} ${memberInfo.last_name}`,
          signup_token: signupToken,
          status: 'confirmed'
        })

      if (error) {
        console.error('Error signing up:', error)
        setMessage('Error signing up. Please try again.')
        return
      }

      setMessage('Successfully signed up! You will receive a confirmation email.')
      
      // Reload opportunities to update status
      loadUpcomingOpportunities(tenantInfo.id, memberInfo.email)
    } catch (error) {
      console.error('Error signing up:', error)
      setMessage('Error signing up. Please try again.')
    }
  }

  // Helper function to get visible roster columns based on tenant settings
  const getRosterColumns = () => {
    const columns = ['Name']
    if (tenantInfo?.roster_show_email) columns.push('Email')
    if (tenantInfo?.roster_show_phone) columns.push('Phone')
    if (tenantInfo?.roster_show_address) columns.push('Address')
    return columns
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
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Home
          </button>
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
            <button
              onClick={() => setMessage('')}
              className="ml-4 text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Groups */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">My Groups</h2>
            </div>
            <div className="p-6">
              {allGroups.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No groups have been created yet.</p>
              ) : (
                <div className="space-y-3">
                  {allGroups.map((group: {id: string, name: string, member_count: number}) => {
                    const isMember = memberGroups.some((mg: MemberGroup) => mg.group_id === group.id)
                    return (
                      <div key={group.id} className={`border rounded-lg p-3 ${isMember ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h3 className={`font-medium ${isMember ? 'text-blue-900' : 'text-gray-600'}`}>
                              {group.name}
                            </h3>
                            <p className={`text-sm ${isMember ? 'text-blue-700' : 'text-gray-500'}`}>
                              {group.member_count} member{group.member_count !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isMember 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isMember ? '✓ Member' : 'Not a member'}
                          </div>
                        </div>
                        {isMember && (
                          <div className="mt-2 text-xs text-blue-600">
                            Added: {new Date(memberGroups.find(mg => mg.group_id === group.id)!.added_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              
              {memberGroups.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Why groups matter:</strong> You receive emails and see opportunities from projects that target "All Members" or any groups you belong to.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Opportunities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">My Sign-up Sheets</h2>
              <p className="text-sm text-gray-600 mt-1">Showing opportunities from projects you can access</p>
            </div>
            <div className="p-6">
              {upcomingOpportunities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming Sign-ups available for your groups.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                          <p className="text-blue-600 font-medium">{opportunity.project_name}</p>
                          {opportunity.description && (
                            <p className="text-gray-600 text-sm mt-1">{opportunity.description}</p>
                          )}
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
                        <button
                          onClick={() => signUpForOpportunity(opportunity.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                        >
                          Sign Up
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
              <p className="text-sm text-gray-600 mt-1">All hours earned throughout your volunteer history</p>
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
                      <span className="text-gray-600">From Sign Ups:</span>
                      <span className="font-medium">{hoursBreakdown.opportunity_hours} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Additional hours logged:</span>
                      <span className="font-medium">{hoursBreakdown.additional_hours} hrs</span>
                    </div>
                  </div>

                  {/* Project Breakdown */}
                  {hoursBreakdown.projects.length > 0 && (
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
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hours recorded yet.</p>
              )}
            </div>
          </div>

          {/* Active Polls */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">My Polls</h2>
              <p className="text-sm text-gray-600 mt-1">Polls targeted to you or your groups</p>
            </div>
            <div className="p-6">
              {activePolls.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No active polls for your groups at this time.</p>
              ) : (
                <div className="space-y-4">
                  {activePolls.map((poll) => (
                    <div key={poll.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{poll.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{poll.question}</p>
                          {poll.targeting_display && (
                            <p className="text-xs text-blue-600 mt-1">📧 {poll.targeting_display}</p>
                          )}
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

                      {/* Poll Results */}
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Results ({poll.total_responses} response{poll.total_responses !== 1 ? 's' : ''}):
                        </div>
                        <div className="space-y-2">
                          {poll.poll_type === 'yes_no' ? (
                            <>
                              <div className="flex justify-between items-center text-sm">
                                <span className={poll.member_response === 'Yes' ? 'font-semibold text-green-700' : 'text-gray-600'}>
                                  Yes
                                </span>
                                <span className="font-medium">{poll.response_counts['Yes'] || 0}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className={poll.member_response === 'No' ? 'font-semibold text-green-700' : 'text-gray-600'}>
                                  No
                                </span>
                                <span className="font-medium">{poll.response_counts['No'] || 0}</span>
                              </div>
                            </>
                          ) : (
                            poll.options?.map((option) => (
                              <div key={option} className="flex justify-between items-center text-sm">
                                <span className={poll.member_response === option ? 'font-semibold text-green-700' : 'text-gray-600'}>
                                  {option}
                                </span>
                                <span className="font-medium">{poll.response_counts[option] || 0}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {poll.has_responded ? (
                        <div className="text-sm">
                          <span className="text-gray-600">Your response:</span>{' '}
                          <span className="font-medium text-green-700">{poll.member_response}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedPoll(poll)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                        >
                          Respond
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Membership Roster - Only show if enabled */}
          {tenantInfo.roster_enabled && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">Membership Roster</h2>
                  <span className="text-sm text-gray-500">
                    {filteredRoster.length} of {roster.length} members
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={rosterSearch}
                    onChange={(e) => handleRosterSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>
              <div className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        {getRosterColumns().map((column) => (
                          <th key={column} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRoster.length === 0 ? (
                        <tr>
                          <td colSpan={getRosterColumns().length} className="px-4 py-8 text-center text-gray-500">
                            {rosterSearch ? 'No members found matching your search.' : 'No members found.'}
                          </td>
                        </tr>
                      ) : (
                        filteredRoster.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {member.first_name} {member.last_name}
                              </div>
                              {member.position && (
                                <div className="text-xs text-gray-500">{member.position}</div>
                              )}
                            </td>
                            {tenantInfo.roster_show_email && (
                              <td className="px-4 py-3 whitespace-nowrap">
                                <a 
                                  href={`mailto:${member.email}`}
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                  {member.email}
                                </a>
                              </td>
                            )}
                            {tenantInfo.roster_show_phone && (
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
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
                            )}
                            {tenantInfo.roster_show_address && (
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {member.address || '—'}
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sign-Up Sheets */}
          <div className="bg-white rounded-lg shadow lg:col-span-2">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Current & Upcoming Sign-Up Sheets</h2>
                <p className="text-sm text-gray-600 mt-1">From projects you have access to</p>
              </div>
              <button
                onClick={() => loadSignupSheets(tenantInfo.id)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Load Sign-Up Sheets
              </button>
            </div>
            <div className="p-6">
              {signupSheets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Click "Load Sign-Up Sheets" to view current and upcoming volunteer rosters from your accessible projects.</p>
              ) : (
                <div className="space-y-6">
                  {signupSheets.map((sheet) => (
                    <div key={sheet.opportunity.id} className="border rounded-lg">
                      {/* Opportunity Header */}
                      <div className="border-b border-gray-200 p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{sheet.opportunity.title}</h3>
                            <p className="text-blue-600 font-medium">{sheet.opportunity.project.name}</p>
                            <p className="text-gray-600 text-sm mt-1">{sheet.opportunity.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sheet.signups.length >= sheet.opportunity.volunteers_needed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sheet.signups.length}/{sheet.opportunity.volunteers_needed} filled
                          </span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Date:</span> {new Date(sheet.opportunity.date_scheduled).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span> {sheet.opportunity.time_start}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {sheet.opportunity.duration_hours}h
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {sheet.opportunity.location}
                          </div>
                        </div>
                      </div>

                      {/* Signups List */}
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Volunteers ({sheet.signups.length})
                        </h4>
                        
                        {sheet.signups.length === 0 ? (
                          <p className="text-gray-500 italic text-sm">No volunteers signed up yet</p>
                        ) : (
                          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {sheet.signups.map((signup) => (
                              <div key={signup.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                <div>
                                  <p className="font-medium text-gray-900">{signup.member_name}</p>
                                  <p className="text-xs text-gray-600">
                                    {new Date(signup.signed_up_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className={`px-1 py-0.5 text-xs rounded ${
                                  signup.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {signup.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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