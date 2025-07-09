'use client'
import Header from '../../components/Header'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

interface TenantInfo {
  id: string
  name: string
  slug: string        // Add this back
  // owner_id: string // Remove this for now
}

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'closed' | 'on_hold'
  goals: string | null
  created_at: string
  total_hours?: number  // Add this line
  opportunities?: OpportunityWithStats[]
}

interface ProjectResource {
  id: string
  project_id: string
  type: 'file' | 'link' | 'note'
  title: string
  content: string
  created_by: string
  created_at: string
}

interface AdditionalHours {
  id: string
  project_id: string
  member_id: string
  hours_worked: number
  description: string | null
  date_worked: string
  created_at: string
}

interface OpportunityWithStats {
  id: string
  title: string
  volunteers_needed: number
  filled_count: number
  open_positions: number
}

interface Member {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string | null
  position: string | null
  address: string | null
  role: string
  created_at: string
}

interface Poll {
  id: string
  title: string
  question: string
  poll_type: 'yes_no' | 'multiple_choice'
  options: string[] | null
  is_anonymous: boolean
  status: 'draft' | 'active' | 'closed'
  total_responses: number
  created_at: string
  expires_at: string | null
  last_emailed_at: string | null  // Add this line
}

interface PollResponse {
  id: string
  poll_id: string
  member_email: string
  member_name: string
  response: string
  responded_at: string
  updated_by: string | null
  updated_at: string | null
}

export default function TenantDashboard() {
  const router = useRouter()
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [deletingMember, setDeletingMember] = useState<Member | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectToClose, setProjectToClose] = useState<Project | null>(null)
  const [showAllResponses, setShowAllResponses] = useState(false)
  const [pollToClose, setPollToClose] = useState<Poll | null>(null)

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    goals: ''  // Add this line
  })

    // Polling state
  const [polls, setPolls] = useState<Poll[]>([])
  const [showPollForm, setShowPollForm] = useState(false)
  const [viewingPoll, setViewingPoll] = useState<Poll | null>(null)
  const [pollResponses, setPollResponses] = useState<PollResponse[]>([])
  const [editingResponse, setEditingResponse] = useState<PollResponse | null>(null)

  const [newPoll, setNewPoll] = useState({
    title: '',
    question: '',
    poll_type: 'yes_no' as 'yes_no' | 'multiple_choice',
    options: [''],
    is_anonymous: false,
    expires_at: ''
  })


  const [newMember, setNewMember] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    position: '',
    address: '',
    role: 'member'
  })

    // Polling functions
const loadPolls = async (tenantId: string) => {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('tenant_id', tenantId)
      .neq('status', 'closed')  // Add this line to exclude closed polls
      .order('created_at', { ascending: false })

    if (error) throw error
    setPolls(data || [])
  } catch (error) {
    setMessage(`Error loading polls: ${(error as Error).message}`)
  }
}

  const loadTenantData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push('/auth')
        return
      }

      // Get user's profile first
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) throw profileError

      if (!profile?.tenant_id) {
        router.push('/setup-tenant')
        return
      }

      // Then get the tenant info separately
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name, slug')
        .eq('id', profile.tenant_id)
        .single()

      if (tenantError) throw tenantError

      setTenantInfo(tenant)
      
      // Load projects and members
      await loadProjects(tenant.id)
      await loadMembers(tenant.id)
      await loadPolls(tenant.id) 

    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }, [router])

  // Enhanced loadProjects function - replace your existing one
 const loadProjects = async (tenantId: string) => {
  try {
    // Get active projects with all fields including status and goals
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (projectError) throw projectError

    // Get opportunities with signup counts and calculate total hours for each project
    const projectsWithOpportunities = await Promise.all(
      (projects || []).map(async (project) => {
        // Get opportunities for this project with duration info
        const { data: opportunities, error: oppError } = await supabase
          .from('opportunities')
          .select('id, title, volunteers_needed, duration_hours')
          .eq('project_id', project.id)
          .order('date_scheduled', { ascending: true })

        if (oppError) throw oppError

        // Calculate opportunity hours and get signup counts
        let totalOpportunityHours = 0
        const opportunitiesWithStats = await Promise.all(
          (opportunities || []).map(async (opportunity) => {
            const { count, error: countError } = await supabase
              .from('signups')
              .select('*', { count: 'exact', head: true })
              .eq('opportunity_id', opportunity.id)
              .eq('status', 'confirmed')

            if (countError) throw countError

            const filled_count = count || 0
            const volunteers_needed = opportunity.volunteers_needed || 1
            const open_positions = Math.max(0, volunteers_needed - filled_count)
            const duration_hours = opportunity.duration_hours || 0

            // Calculate hours for this opportunity (signups * duration)
            const opportunityHours = filled_count * duration_hours
            totalOpportunityHours += opportunityHours

            return {
              id: opportunity.id,
              title: opportunity.title,
              volunteers_needed,
              filled_count,
              open_positions
            }
          })
        )

        // Get additional hours for this project
        const { data: additionalHours, error: hoursError } = await supabase
          .from('additional_hours')
          .select('hours_worked')
          .eq('project_id', project.id)

        if (hoursError) throw hoursError

        // Sum additional hours
        const totalAdditionalHours = (additionalHours || []).reduce(
          (sum, record) => sum + (record.hours_worked || 0), 
          0
        )

        // Calculate total hours
        const total_hours = totalOpportunityHours + totalAdditionalHours

        // Return the complete project with proper typing
        return {
          id: project.id,
          name: project.name,
          description: project.description,
          status: project.status,
          goals: project.goals,
          created_at: project.created_at,
          total_hours,
          opportunities: opportunitiesWithStats
        } as Project
      })
    )

    setProjects(projectsWithOpportunities)
  } catch (error) {
    setMessage(`Error loading projects: ${(error as Error).message}`)
  }
}

  const loadMembers = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      setMessage(`Error loading members: ${(error as Error).message}`)
    }
  }

  const createProject = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!tenantInfo) return

  setLoading(true)
  setMessage('')

  try {
    const { error } = await supabase
      .from('projects')
      .insert([
        {
          tenant_id: tenantInfo.id,
          name: newProject.name,
          description: newProject.description,
          goals: newProject.goals || null,  // Add this line
          status: 'active'  // Add this line
        }
      ])

    if (error) throw error

    setMessage(`Project "${newProject.name}" created successfully!`)
    setNewProject({ name: '', description: '', goals: '' })  // Update this line
    setShowProjectForm(false)
    loadProjects(tenantInfo.id)
  } catch (error) {
    setMessage(`Error: ${(error as Error).message}`)
  } finally {
    setLoading(false)
  }
}

const updateProject = async (updatedData: any) => {
  if (!editingProject || !tenantInfo) return

  setLoading(true)
  setMessage('')

  try {
    const { error } = await supabase
      .from('projects')
      .update({
        name: updatedData.name,
        description: updatedData.description,
        goals: updatedData.goals || null,
        status: updatedData.status
      })
      .eq('id', editingProject.id)

    if (error) throw error

    setMessage(`Project "${updatedData.name}" updated successfully!`)
    setEditingProject(null)
    loadProjects(tenantInfo.id)
  } catch (error) {
    setMessage(`Error: ${(error as Error).message}`)
  } finally {
    setLoading(false)
  }
}

const closeProject = async () => {
  if (!projectToClose || !tenantInfo) return

  setLoading(true)
  setMessage('')

  try {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'closed' })
      .eq('id', projectToClose.id)

    if (error) throw error

    setMessage(`Project "${projectToClose.name}" has been closed.`)
    setProjectToClose(null)
    loadProjects(tenantInfo.id)
  } catch (error) {
    setMessage(`Error: ${(error as Error).message}`)
  } finally {
    setLoading(false)
  }
}

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert([
          {
            tenant_id: tenantInfo.id,
            email: newMember.email,
            first_name: newMember.firstName,
            last_name: newMember.lastName,
            phone_number: newMember.phoneNumber || null,
            position: newMember.position || null,
            address: newMember.address || null,
            role: newMember.role,
            id: crypto.randomUUID()
          }
        ])

      if (error) throw error

      setMessage(`Member ${newMember.firstName} ${newMember.lastName} added successfully!`)
      setNewMember({ 
        email: '', 
        firstName: '', 
        lastName: '', 
        phoneNumber: '', 
        position: '', 
        address: '', 
        role: 'member' 
      })
      setShowMemberForm(false)
      loadMembers(tenantInfo.id)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const updateMember = async (updatedData: any) => {
    if (!editingMember || !tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: updatedData.firstName,
          last_name: updatedData.lastName,
          email: updatedData.email,
          phone_number: updatedData.phoneNumber || null,
          position: updatedData.position || null,
          address: updatedData.address || null,
          role: updatedData.role
        })
        .eq('id', editingMember.id)

      if (error) throw error

      setMessage(`Member ${updatedData.firstName} ${updatedData.lastName} updated successfully!`)
      setEditingMember(null)
      loadMembers(tenantInfo.id)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteMember = async () => {
    if (!deletingMember || !tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', deletingMember.id)

      if (error) throw error

      setMessage(`Member ${deletingMember.first_name} ${deletingMember.last_name} deleted successfully!`)
      setDeletingMember(null)
      loadMembers(tenantInfo.id)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTenantData()
  }, [loadTenantData])
console.log('Members array:', members, 'Length:', members.length)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const sendPollEmails = async (pollId: string) => {
  if (!tenantInfo) return

  setLoading(true)
  setMessage('Sending emails one at a time...hang tight.')

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Not authenticated')

    const response = await fetch('/api/send-poll-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pollId: pollId,
        tenantId: tenantInfo.id,
        userId: session.user.id
      })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send emails')
    }

    setMessage(result.message)
    if (result.failedEmails && result.failedEmails.length > 0) {
      console.log('Failed emails:', result.failedEmails)
    }
    loadPolls(tenantInfo.id)
  } catch (error) {
    setMessage(`Error: ${(error as Error).message}`)
  } finally {
    setLoading(false)
  }
}


const createPoll = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!tenantInfo) return

  setLoading(true)
  setMessage('')

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Not authenticated')

    // Prepare options for multiple choice
    const pollOptions = newPoll.poll_type === 'multiple_choice' 
      ? newPoll.options.filter(opt => opt.trim() !== '')
      : null

    // Create the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert([
        {
          tenant_id: tenantInfo.id,
          title: newPoll.title,
          question: newPoll.question,
          poll_type: newPoll.poll_type,
          options: pollOptions,
          is_anonymous: newPoll.is_anonymous,
          expires_at: newPoll.expires_at || null,
          created_by: session.user.id,
          status: 'active'
        }
      ])
      .select()
      .single()

    if (pollError) throw pollError

    // Create poll response records for all members
    const { data: members, error: membersError } = await supabase
      .from('user_profiles')
      .select('email, first_name, last_name')
      .eq('tenant_id', tenantInfo.id)

    if (membersError) throw membersError

    if (members && members.length > 0) {
      const pollResponses = members.map(member => ({
        poll_id: poll.id,
        tenant_id: tenantInfo.id,
        member_email: member.email,
        member_name: `${member.first_name} ${member.last_name}`,
        response: '',
        response_token: crypto.randomUUID(),
        responded_at: null
      }))

      const { error: responsesError } = await supabase
        .from('poll_responses')
        .insert(pollResponses)

      if (responsesError) throw responsesError
    }

    setMessage(`Poll "${newPoll.title}" created successfully with ${members?.length || 0} member records!`)
    setNewPoll({
      title: '',
      question: '',
      poll_type: 'yes_no',
      options: [''],
      is_anonymous: false,
      expires_at: ''
    })
    setShowPollForm(false)
    loadPolls(tenantInfo.id)
  } catch (error) {
    setMessage(`Error: ${(error as Error).message}`)
  } finally {
    setLoading(false)
  }
}

const loadPollResponses = async (pollId: string) => {
  try {
    const { data, error } = await supabase
      .from('poll_responses')
      .select('*')
      .eq('poll_id', pollId)
      .order('responded_at', { ascending: false })

    if (error) throw error
    setPollResponses(data || [])
  } catch (error) {
    setMessage(`Error loading poll responses: ${(error as Error).message}`)
  }
}

const updatePollStatus = async (pollId: string, newStatus: 'active' | 'closed') => {
  setLoading(true)
  try {
    const { error } = await supabase
      .from('polls')
      .update({ status: newStatus })
      .eq('id', pollId)

    if (error) throw error

    setMessage(`Poll ${newStatus === 'active' ? 'activated' : 'closed'} successfully!`)
    if (tenantInfo) {
      loadPolls(tenantInfo.id)
    }
  } catch (error) {
    setMessage(`Error: ${(error as Error).message}`)
  } finally {
    setLoading(false)
  }
}

const updatePollResponse = async (responseId: string, newResponse: string) => {
  if (!editingResponse) return

  setLoading(true)
  setMessage('')

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Not authenticated')

    // Check if this is a new response or an update
    const isNewResponse = !editingResponse.response || editingResponse.response.trim() === ''

    const updateData: any = {
      response: newResponse,
      updated_by: session.user.id,
      updated_at: new Date().toISOString()
    }

    // If it's a new response, also set responded_at
    if (isNewResponse) {
      updateData.responded_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('poll_responses')
      .update(updateData)
      .eq('id', responseId)

    if (error) throw error

    setMessage(isNewResponse ? 'Response recorded successfully!' : 'Response updated successfully!')
    setEditingResponse(null)
    if (viewingPoll) {
      loadPollResponses(viewingPoll.id)
    }
  } catch (error) {
    setMessage(`Error: ${(error as Error).message}`)
  } finally {
    setLoading(false)
  }
}

  if (!tenantInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">No Organization Found</h1>
          <p className="text-gray-600 mt-2">Please set up your organization first.</p>
        </div>
      </div>
    )
  }

  return (
  <>
    <Header />
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{tenantInfo.name} Dashboard</h1>
          <p className="text-gray-600">Manage your projects and team members</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
                <button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  {showProjectForm ? 'Hide Form' : 'Create Project'}
                </button>
              </div>
            </div>

            {showProjectForm && (
              <div className="p-6 border-b bg-gray-50">
                <form onSubmit={createProject} className="space-y-4">
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="projectName"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="projectDescription"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectGoals" className="block text-sm font-medium text-gray-700">
                      Goals & Objectives
                    </label>
                    <textarea
                      id="projectGoals"
                      value={newProject.goals}
                      onChange={(e) => setNewProject({ ...newProject, goals: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="What are the main goals and expected outcomes for this project?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Project'}
                  </button>
                </form>
              </div>
            )}

            <div className="p-6">
              {projects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No projects yet. Create your first project to get started!</p>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow relative">
                      {/* Close X in top right corner */}
                      <button
                        onClick={() => setProjectToClose(project)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                        title="Close project"
                      >
                        ×
                      </button>
                      
                      <h3 className="font-semibold text-lg mb-2 pr-8">{project.name}</h3>
                      {project.description && (
                        <p className="text-gray-600 mb-3">{project.description}</p>
                      )}
                      
                      {/* Opportunities List */}
                      {project.opportunities && project.opportunities.length > 0 ? (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Volunteer Opportunities:</h4>
                          <div className="space-y-2">
                            {project.opportunities.map((opportunity) => (
                              <div key={opportunity.id} className="bg-gray-50 rounded p-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-900">{opportunity.title}</span>
                                  </div>
                                  <div className="text-right ml-3">
                                    <div className="text-sm">
                                      <span className="text-green-600 font-medium">{opportunity.filled_count}</span>
                                      <span className="text-gray-500"> / </span>
                                      <span className="text-gray-900">{opportunity.volunteers_needed}</span>
                                      <span className="text-gray-500 text-xs ml-1">filled</span>
                                    </div>
                                    {opportunity.open_positions > 0 ? (
                                      <div className="text-xs text-orange-600">
                                        {opportunity.open_positions} positions open
                                      </div>
                                    ) : (
                                      <div className="text-xs text-green-600">Fully staffed</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                       ) : (
                            <div className="mb-4 text-sm text-gray-500">No volunteer opportunities yet</div>
                          )}

                          {/* Total Hours Display */}
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-blue-900">Total Volunteer Hours</span>
                              <span className="text-lg font-bold text-blue-900">
                                {project.total_hours?.toFixed(1) || '0.0'} hrs
                              </span>
                            </div>
                            {project.total_hours && project.total_hours > 0 && (
                              <div className="text-xs text-blue-700 mt-1">
                                From {project.opportunities?.length || 0} opportunities + additional hours
                              </div>
                            )}
                          </div>
                      

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="text-green-600 hover:text-green-800 font-medium cursor-pointer text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => router.push(`/tenant/projects/${project.id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Members Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Members ({members.length})</h2>
                <button
                  onClick={() => setShowMemberForm(!showMemberForm)}
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  {showMemberForm ? 'Hide Form' : 'Add Member'}
                </button>
              </div>
                          <div className="p-6">
              {members.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No members yet. Add your first team member!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {members.map((member) => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {member.first_name} {member.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{member.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {member.phone_number || '—'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(member.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setEditingMember(member)}
                              className="text-blue-600 hover:text-blue-800 mr-3 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingMember(member)}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            </div>

            {/* Polls Section */}
            <div className="bg-white rounded-lg shadow mt-8">
              <div className="px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Active Polls ({polls.length})</h2>
                  <button
                    onClick={() => setShowPollForm(!showPollForm)}
                    className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    {showPollForm ? 'Hide Form' : 'Create Poll'}
                  </button>
                </div>
              </div>

              {showPollForm && (
                <div className="p-6 border-b bg-gray-50">
                  <form onSubmit={createPoll} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Poll Title</label>
                        <input
                          type="text"
                          value={newPoll.title}
                          onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="e.g., Annual Picnic Location"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Poll Type</label>
                        <select
                          value={newPoll.poll_type}
                          onChange={(e) => setNewPoll({ ...newPoll, poll_type: e.target.value as 'yes_no' | 'multiple_choice' })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="yes_no">Yes/No</option>
                          <option value="multiple_choice">Multiple Choice</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Question</label>
                      <textarea
                        value={newPoll.question}
                        onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="What would you like to ask your members?"
                        required
                      />
                    </div>

                    {newPoll.poll_type === 'multiple_choice' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Options</label>
                        {newPoll.options.map((option, index) => (
                          <div key={index} className="flex gap-2 mt-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...newPoll.options]
                                newOptions[index] = e.target.value
                                setNewPoll({ ...newPoll, options: newOptions })
                              }}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder={`Option ${index + 1}`}
                            />
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = newPoll.options.filter((_, i) => i !== index)
                                  setNewPoll({ ...newPoll, options: newOptions })
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newPoll.is_anonymous}
                            onChange={(e) => setNewPoll({ ...newPoll, is_anonymous: e.target.checked })}
                            className="mr-2"
                          />
                          Anonymous responses
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expires (Optional)</label>
                        <input
                          type="datetime-local"
                          value={newPoll.expires_at}
                          onChange={(e) => setNewPoll({ ...newPoll, expires_at: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Poll'}
                    </button>
                  </form>
                </div>
              )}

              <div className="p-6">
                {polls.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No polls yet. Create your first poll to get member feedback!</p>
                ) : (
                  <div className="space-y-4">
                    {polls.map((poll) => (
                      <div key={poll.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow relative">
                        {/* Close X in top right corner */}
                        <button
                          onClick={() => setPollToClose(poll)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                          title="Close poll"
                        >
                          ×
                        </button>
                        
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 pr-8">
                            <h3 className="font-semibold text-lg">{poll.title}</h3>
                            <p className="text-gray-600 mt-1">{poll.question}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                poll.status === 'active' ? 'bg-green-100 text-green-800' :
                                poll.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {poll.status}
                              </span>
                              <span>{poll.poll_type === 'yes_no' ? 'Yes/No' : 'Multiple Choice'}</span>
                              {poll.is_anonymous && <span>Anonymous</span>}
                              <span>{poll.total_responses} responses</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => sendPollEmails(poll.id)}
                              className="text-purple-600 hover:text-purple-800 font-medium cursor-pointer text-sm"
                            >
                              Email Members
                            </button>
                            <button
                              onClick={() => {
                                setViewingPoll(poll)
                                loadPollResponses(poll.id)
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            >
                              View Results →
                            </button>
                          </div>
                        </div>
                        
                        {/* Last emailed status */}
                        <div className="mt-4 pt-3 border-t border-gray-200 text-right">
                          <span className="text-xs text-gray-500">
                            {poll.last_emailed_at 
                              ? `Last emailed: ${new Date(poll.last_emailed_at).toLocaleDateString()}`
                              : 'Never emailed'
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {showMemberForm && (
              <div className="p-6 border-b bg-gray-50">
                <form onSubmit={addMember} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        value={newMember.phoneNumber}
                        onChange={(e) => setNewMember({ ...newMember, phoneNumber: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={newMember.firstName}
                        onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={newMember.lastName}
                        onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                        Position/Status
                      </label>
                      <input
                        type="text"
                        id="position"
                        value={newMember.position}
                        onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Member, Life Member, Volunteer"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        id="address"
                        rows={2}
                        value={newMember.address}
                        onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Street address, city, postal code"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Member'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

        {/* Edit Member Modal */}
        {editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Edit Member</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                updateMember({
                  firstName: formData.get('firstName'),
                  lastName: formData.get('lastName'),
                  email: formData.get('email'),
                  phoneNumber: formData.get('phoneNumber'),
                  position: formData.get('position'),
                  address: formData.get('address'),
                  role: formData.get('role')
                })
              }} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      defaultValue={editingMember.first_name}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      defaultValue={editingMember.last_name}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingMember.email}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      defaultValue={editingMember.phone_number || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position/Status</label>
                    <input
                      type="text"
                      name="position"
                      defaultValue={editingMember.position || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., Member, Life Member"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      name="role"
                      defaultValue={editingMember.role}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="member">Member</option>
                      <option value="tenant_admin">Admin</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    rows={3}
                    defaultValue={editingMember.address || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Street address, city, postal code"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Member Confirmation Modal */}
        {deletingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Delete Member</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{deletingMember.first_name} {deletingMember.last_name}</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeletingMember(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteMember}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete Member'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {editingProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Edit Project</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                updateProject({
                  name: formData.get('name'),
                  description: formData.get('description'),
                  goals: formData.get('goals'),
                  status: formData.get('status')
                })
              }} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProject.name}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingProject.description}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Goals & Objectives</label>
                  <textarea
                    name="goals"
                    rows={3}
                    defaultValue={editingProject.goals || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="What are the main goals and expected outcomes?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    defaultValue={editingProject.status}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Poll Results Modal */}
        {viewingPoll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold">{viewingPoll.title}</h3>
                  <p className="text-gray-600 mt-1">{viewingPoll.question}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      viewingPoll.status === 'active' ? 'bg-green-100 text-green-800' :
                      viewingPoll.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {viewingPoll.status}
                    </span>
                    <span className="text-gray-500">{viewingPoll.poll_type === 'yes_no' ? 'Yes/No' : 'Multiple Choice'}</span>
                    {viewingPoll.is_anonymous && <span className="text-gray-500">Anonymous</span>}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setViewingPoll(null)
                    setPollResponses([])
                    setShowAllResponses(false)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Response Summary */}
              {(() => {
                const actualVotes = pollResponses.filter(r => r.response && r.response.trim() !== '')
                const totalSent = pollResponses.length
                return (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">
                      Response Summary ({actualVotes.length} of {totalSent} members voted)
                    </h4>
                    {actualVotes.length > 0 ? (
                      <div className="space-y-2">
                        {viewingPoll.poll_type === 'yes_no' ? (
                          <>
                            {['Yes', 'No'].map((option) => {
                              const count = actualVotes.filter(r => r.response === option).length
                              const percentage = actualVotes.length > 0 ? (count / actualVotes.length * 100).toFixed(1) : 0
                              return (
                                <div key={option} className="flex items-center gap-3">
                                  <span className="w-12 text-sm font-medium">{option}:</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                                    <div 
                                      className={`h-3 rounded-full ${option === 'Yes' ? 'bg-green-500' : 'bg-red-500'}`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                                </div>
                              )
                            })}
                          </>
                        ) : (
                          <>
                            {viewingPoll.options?.map((option) => {
                              const count = actualVotes.filter(r => r.response === option).length
                              const percentage = actualVotes.length > 0 ? (count / actualVotes.length * 100).toFixed(1) : 0
                              return (
                                <div key={option} className="flex items-center gap-3">
                                  <span className="w-24 text-sm font-medium truncate">{option}:</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                                    <div 
                                      className="h-3 rounded-full bg-blue-500"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                                </div>
                              )
                            }) || []}
                          </>
                        )}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-3">
                            <span className="w-24 text-sm font-medium text-gray-700">Participation:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div 
                                className="h-3 rounded-full bg-purple-500"
                                style={{ width: `${totalSent > 0 ? (actualVotes.length / totalSent * 100).toFixed(1) : 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {totalSent > 0 ? (actualVotes.length / totalSent * 100).toFixed(1) : 0}% of members
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No votes received yet.</p>
                    )}
                  </div>
                )
              })()}

              {/* Individual Responses */}
              <div>
                <h4 className="font-medium mb-3">
                  {viewingPoll.is_anonymous ? 'Anonymous Responses' : 'Member Responses'}
                </h4>
                {(() => {
                  const actualVotes = pollResponses.filter(r => r.response && r.response.trim() !== '')
                  const pendingVotes = pollResponses.filter(r => !r.response || r.response.trim() === '')
                  
                  const sortedVotes = actualVotes.sort((a, b) => {
                    if (a.response === b.response) {
                      return a.member_name.localeCompare(b.member_name)
                    }
                    return a.response.localeCompare(b.response)
                  })

                  const sortedPending = pendingVotes.sort((a, b) => a.member_name.localeCompare(b.member_name))
                  
                  return (
                    <>
                      {actualVotes.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No responses yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {sortedVotes.map((response) => (
                            <div key={response.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    {!viewingPoll.is_anonymous && (
                                      <span className="font-medium">{response.member_name}</span>
                                    )}
                                    <span className={`px-2 py-1 text-sm font-medium rounded ${
                                      response.response === 'Yes' ? 'bg-green-100 text-green-800' :
                                      response.response === 'No' ? 'bg-red-100 text-red-800' :
                                      'bg-blue-100 text-blue-800'
                                    }`}>
                                      {response.response}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(response.responded_at).toLocaleString()}
                                    {response.updated_at && (
                                      <span className="ml-2">(Edited by admin)</span>
                                    )}
                                  </div>
                                </div>
                                
                                {!viewingPoll.is_anonymous && (
                                  <button
                                    onClick={() => setEditingResponse(response)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {!viewingPoll.is_anonymous && pendingVotes.length > 0 && (
                        <div className="mt-6">
                          {!showAllResponses ? (
                            <div className="text-center">
                              <button
                                onClick={() => setShowAllResponses(true)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Show all members ({pendingVotes.length} haven't responded)
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-center mb-4">
                                <h5 className="font-medium text-gray-700">
                                  Members who haven't responded ({pendingVotes.length}):
                                </h5>
                                <button
                                  onClick={() => setShowAllResponses(false)}
                                  className="text-gray-600 hover:text-gray-800 text-sm"
                                >
                                  Hide unresponded
                                </button>
                              </div>
                              <div className="space-y-3">
                                {sortedPending.map((pending) => (
                                  <div key={pending.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                          <span className="font-medium">{pending.member_name}</span>
                                          <span className="px-2 py-1 text-sm font-medium rounded bg-yellow-100 text-yellow-800">
                                            No response
                                          </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Poll sent but not yet responded
                                        </div>
                                      </div>
                                      
                                      <button
                                        onClick={() => setEditingResponse(pending)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                                      >
                                        Record Response
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Edit Poll Response Modal */}
        {editingResponse && viewingPoll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingResponse.response && editingResponse.response.trim() !== '' ? 'Edit Response' : 'Record Response'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {editingResponse.response && editingResponse.response.trim() !== '' 
                  ? `Editing response from ${editingResponse.member_name}`
                  : `Recording response for ${editingResponse.member_name}`
                }
              </p>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const newResponse = formData.get('response') as string
                updatePollResponse(editingResponse.id, newResponse)
              }} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response</label>
                  {viewingPoll.poll_type === 'yes_no' ? (
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="response"
                          value="Yes"
                          defaultChecked={editingResponse.response === 'Yes'}
                          className="mr-2"
                          required
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="response"
                          value="No"
                          defaultChecked={editingResponse.response === 'No'}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {viewingPoll.options?.map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="response"
                            value={option}
                            defaultChecked={editingResponse.response === option}
                            className="mr-2"
                            required
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingResponse(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Response'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Close Poll Confirmation Modal */}
        {pollToClose && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Close Poll</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to close <strong>"{pollToClose.title}"</strong>? 
                This will remove it from the dashboard and prevent further responses.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setPollToClose(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updatePollStatus(pollToClose.id, 'closed')
                    setPollToClose(null)
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Closing...' : 'Close Poll'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Close Project Confirmation Modal */}
        {projectToClose && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Close Project</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to close <strong>"{projectToClose.name}"</strong>? 
                This will remove it from the dashboard and mark it as completed.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setProjectToClose(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={closeProject}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Closing...' : 'Close Project'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </>
)
}