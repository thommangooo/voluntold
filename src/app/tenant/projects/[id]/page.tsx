'use client'

import Header from '../../../../components/Header'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useParams, useRouter } from 'next/navigation'



interface Project {
  id: string
  name: string
  description: string
  tenant_id: string
  created_at: string
}

interface Opportunity {
  id: string
  title: string
  description: string
  date_scheduled: string | null
  time_start: string | null
  duration_hours: number | null
  volunteers_needed: number
  skills_required: string[]
  location: string
  created_at: string
  signup_count?: number
  signups?: Array<{
    id: string
    member_name: string
    member_email: string
    signed_up_at: string
  }>
}

interface TenantInfo {
  id: string
  name: string
}



export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([])
  const [emailLoading, setEmailLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null)
  const [addingSignup, setAddingSignup] = useState<Opportunity | null>(null)
  const [members, setMembers] = useState<Array<{id: string, first_name: string, last_name: string, email: string}>>([])
  const [manualSignup, setManualSignup] = useState({
    memberType: 'existing', // 'existing' or 'custom'
    selectedMember: '',
    customName: '',
    customEmail: ''
  })

  // New opportunity form
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    volunteersNeeded: 1,
    skills: '',
    location: ''
     })

  // Load project and user info
  const loadProjectData = useCallback(async () => {
    try {
      // Get current user and their tenant
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      // Get user's tenant info
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('tenant_id')
        .eq('id', session.user.id)
        .single()

      if (profileError) throw profileError

      if (!profile?.tenant_id) {
        throw new Error('User not associated with a tenant')
      }

      // Get tenant info
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name')
        .eq('id', profile.tenant_id)
        .single()

      if (tenantError) throw tenantError
      setTenantInfo(tenant)

      // Get project info (verify it belongs to this tenant)
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('tenant_id', profile.tenant_id)
        .single()

      if (projectError || !projectData) {
        router.push('/tenant')
        return
      }

      setProject(projectData)
      loadOpportunities(projectId, profile.tenant_id)

    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
      setTimeout(() => router.push('/tenant'), 3000)
    }
  }, [projectId, router])

  useEffect(() => {
    loadProjectData()
  }, [loadProjectData])

  const loadOpportunities = async (projectId: string, tenantId: string) => {
  try {
    // First get the opportunities
    const { data: opportunities, error: oppError } = await supabase
      .from('opportunities')
      .select('*')
      .eq('project_id', projectId)
      .eq('tenant_id', tenantId)
      .order('date_scheduled', { ascending: true })

    if (oppError) throw oppError

    if (!opportunities) {
      setOpportunities([])
      return
    }

    // Then get signup details for each opportunity
    const opportunitiesWithSignups = await Promise.all(
      opportunities.map(async (opp) => {
        const { data: signups, error: signupsError } = await supabase
          .from('signups')
          .select('id, member_name, member_email, signed_up_at')
          .eq('opportunity_id', opp.id)
          .eq('status', 'confirmed')
          .order('signed_up_at', { ascending: true })

        if (signupsError) {
          console.error('Error loading signups for opportunity:', opp.id, signupsError)
        }

        return {
          ...opp,
          signups: signups || [],
          signup_count: signups?.length || 0
        }
      })
    )

    setOpportunities(opportunitiesWithSignups)
  } catch (error) {
    setMessage(`Error loading opportunities: ${(error as Error).message}`)
  }
}
  const loadMembers = useCallback(async () => {
  if (!tenantInfo) return
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, email')
      .eq('tenant_id', tenantInfo.id)
      .eq('role', 'member')
      .order('first_name')

    if (error) throw error
    setMembers(data || [])
  } catch (error) {
    console.error('Error loading members:', error)
  }
}, [tenantInfo])

useEffect(() => {
  if (tenantInfo) {
    loadMembers()
  }
}, [tenantInfo, loadMembers])


  const createOpportunity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project || !tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      // Parse skills into array
      const skillsArray = newOpportunity.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)

      const { error } = await supabase
        .from('opportunities')
        .insert([
            {
            project_id: project.id,
            tenant_id: tenantInfo.id,
            title: newOpportunity.title,
            description: newOpportunity.description,
            date_scheduled: newOpportunity.date || null,
            time_start: newOpportunity.time || null,
            duration_hours: newOpportunity.duration ? parseFloat(newOpportunity.duration) : null,
            volunteers_needed: newOpportunity.volunteersNeeded,
            skills_required: skillsArray,
            location: newOpportunity.location,
            created_by: session.user.id
            }
        ])

      if (error) throw error

      setMessage(`Opportunity "${newOpportunity.title}" created successfully!`)
      setNewOpportunity({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: '',
        volunteersNeeded: 1,
        skills: '',
        location: ''
        })
      
      loadOpportunities(project.id, tenantInfo.id)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!project || !tenantInfo) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto mt-8 p-6">
          <div className="text-center">Loading project...</div>
        </div>
      </>
    )
  }

const updateOpportunity = async (updatedData: any) => {
  if (!editingOpportunity || !tenantInfo) return

  setLoading(true)
  setMessage('')

  try {
    const { error } = await supabase
      .from('opportunities')
      .update({
        title: updatedData.title,
        description: updatedData.description,
        date_scheduled: updatedData.date || null,
        time_start: updatedData.time || null,
        duration_hours: updatedData.duration ? parseFloat(updatedData.duration) : null,
        volunteers_needed: updatedData.volunteersNeeded,
        skills_required: updatedData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0),
        location: updatedData.location
      })
      .eq('id', editingOpportunity.id)

    if (error) throw error

    setMessage('Opportunity updated successfully!')
    setEditingOpportunity(null)
    loadOpportunities(project!.id, tenantInfo.id)
  } catch (error) {
    setMessage(`Error: ${(error as Error).message}`)
  } finally {
    setLoading(false)
  }
}

const addManualSignup = async () => {
  if (!addingSignup || !tenantInfo) return

  setLoading(true)
  setMessage('')

  try {
    let memberName = ''
    let memberEmail = ''

    if (manualSignup.memberType === 'existing') {
      const selectedMember = members.find(m => m.id === manualSignup.selectedMember)
      if (!selectedMember) {
        throw new Error('Please select a member')
      }
      memberName = `${selectedMember.first_name} ${selectedMember.last_name}`
      memberEmail = selectedMember.email
    } else {
      if (!manualSignup.customName || !manualSignup.customEmail) {
        throw new Error('Please enter name and email for custom signup')
      }
      memberName = manualSignup.customName
      memberEmail = manualSignup.customEmail
    }

    // Check if already signed up
    const { data: existingSignup } = await supabase
      .from('signups')
      .select('id')
      .eq('opportunity_id', addingSignup.id)
      .eq('member_email', memberEmail)
      .eq('status', 'confirmed')
      .single()

    if (existingSignup) {
      throw new Error('This person is already signed up for this opportunity')
    }

    // Add the signup
    const { error } = await supabase
      .from('signups')
      .insert({
        opportunity_id: addingSignup.id,
        tenant_id: tenantInfo.id,
        member_email: memberEmail,
        member_name: memberName,
        signup_token: 'manual-' + crypto.randomUUID(),
        status: 'confirmed'
      })

    if (error) throw error

    setMessage(`Added ${memberName} to the opportunity!`)
    setAddingSignup(null)
    setManualSignup({
      memberType: 'existing',
      selectedMember: '',
      customName: '',
      customEmail: ''
    })
    loadOpportunities(project!.id, tenantInfo.id)
  } catch (error) {
    setMessage(`Error: ${(error as Error).message}`)
  } finally {
    setLoading(false)
  }
}

  const toggleOpportunitySelection = (opportunityId: string) => {
  setSelectedOpportunities(prev => 
    prev.includes(opportunityId)
      ? prev.filter(id => id !== opportunityId)
      : [...prev, opportunityId]
  )
}

const sendEmailBroadcast = async () => {
  if (selectedOpportunities.length === 0) {
    setMessage('Please select at least one opportunity to email about.')
    return
  }

  setEmailLoading(true)
  setMessage('')

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user || !tenantInfo) {
      throw new Error('Not authenticated')
    }

    const response = await fetch('/api/send-opportunity-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        opportunityIds: selectedOpportunities,
        tenantId: tenantInfo.id,
        userId: session.user.id
      })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send emails')
    }

    setMessage(result.message)
    setSelectedOpportunities([])
  } catch (error) {
    setMessage(`Error: ${(error as Error).message}`)
  } finally {
    setEmailLoading(false)
  }
}



  return (
    <>
      <Header />
      
      <div className="max-w-6xl mx-auto mt-8 p-6 space-y-8">
        {/* Breadcrumb and Project Header */}
        <div>
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/tenant" className="hover:text-gray-700">← Back to Dashboard</a>
          </nav>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-gray-600 mt-2">{tenantInfo.name}</p>
                {project.description && (
                  <p className="text-gray-700 mt-3">{project.description}</p>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Created: {new Date(project.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Create New Opportunity */}
<div className="bg-white rounded-lg shadow-md">
  <div className="px-6 py-4 border-b flex justify-between items-center">
    <h2 className="text-xl font-semibold">Create Volunteer Opportunity</h2>
    <button
      onClick={() => setShowCreateForm(!showCreateForm)}
      className="text-blue-600 hover:text-blue-800 font-medium"
    >
      {showCreateForm ? 'Hide Form' : 'Add Opportunity'}
    </button>
  </div>
  
  {showCreateForm && (
    <form onSubmit={createOpportunity} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Opportunity Title *
          </label>
          <input
            type="text"
            id="title"
            value={newOpportunity.title}
            onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Setup Crew, Bar Service, Cleanup"
            required
          />
        </div>

        <div>
          <label htmlFor="volunteersNeeded" className="block text-sm font-medium text-gray-700">
            Volunteers Needed
          </label>
          <input
            type="number"
            id="volunteersNeeded"
            min="1"
            value={newOpportunity.volunteersNeeded}
            onChange={(e) => setNewOpportunity({ ...newOpportunity, volunteersNeeded: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date (Optional)
          </label>
          <input
            type="date"
            id="date"
            value={newOpportunity.date}
            onChange={(e) => setNewOpportunity({ ...newOpportunity, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Start Time (Optional)
          </label>
          <input
            type="time"
            id="time"
            value={newOpportunity.time}
            onChange={(e) => setNewOpportunity({ ...newOpportunity, time: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (Hours, Optional)
          </label>
          <input
            type="number"
            id="duration"
            step="0.5"
            min="0"
            value={newOpportunity.duration}
            onChange={(e) => setNewOpportunity({ ...newOpportunity, duration: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., 2.5"
          />
          <p className="mt-1 text-xs text-gray-500">Leave empty for flexible duration</p>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location (Optional)
          </label>
          <input
            type="text"
            id="location"
            value={newOpportunity.location}
            onChange={(e) => setNewOpportunity({ ...newOpportunity, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Main Hall, Kitchen, Parking Lot"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={3}
            value={newOpportunity.description}
            onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Additional details about what volunteers will be doing..."
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills Required (Optional)
          </label>
          <input
            type="text"
            id="skills"
            value={newOpportunity.skills}
            onChange={(e) => setNewOpportunity({ ...newOpportunity, skills: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Has truck, Welding, Safe Serve (separate with commas)"
          />
          <p className="mt-1 text-xs text-gray-500">Separate multiple skills with commas</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Opportunity'}
      </button>
    </form>
  )}
</div>

        {/* Opportunities List */}
<div className="bg-white rounded-lg shadow-md">
  <div className="px-6 py-4 border-b flex justify-between items-center">
    <h2 className="text-xl font-semibold">Volunteer Opportunities ({opportunities.length})</h2>
    {opportunities.length > 0 && (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {selectedOpportunities.length} selected
        </span>
        <button
          onClick={sendEmailBroadcast}
          disabled={selectedOpportunities.length === 0 || emailLoading}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
        >
          {emailLoading ? 'Sending...' : `Email Members (${selectedOpportunities.length})`}
        </button>
      </div>
    )}
  </div>
  
  {opportunities.length === 0 ? (
    <div className="p-6 text-gray-500 text-center">
      No volunteer opportunities yet. Create the first one above!
    </div>
  ) : (
    <div className="p-6">
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
        <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={selectedOpportunities.includes(opportunity.id)}
              onChange={() => toggleOpportunitySelection(opportunity.id)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">{opportunity.title}</h4>
                  {opportunity.description && (
                    <p className="text-gray-600 mt-1">{opportunity.description}</p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>Needs {opportunity.volunteers_needed} volunteer{opportunity.volunteers_needed !== 1 ? 's' : ''}</div>
                  <div className="mt-1">
                    <span className={`font-medium ${
                      (opportunity.signup_count || 0) >= opportunity.volunteers_needed 
                        ? 'text-green-600' 
                        : 'text-blue-600'
                    }`}>
                      {opportunity.signup_count || 0} signed up
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                {(opportunity.date_scheduled || opportunity.time_start) && (
                  <div className="flex items-center">
                    <span className="font-medium">📅</span>
                    <span className="ml-1">
                      {opportunity.date_scheduled && new Date(opportunity.date_scheduled).toLocaleDateString()}
                      {opportunity.date_scheduled && opportunity.time_start && ' at '}
                      {opportunity.time_start && new Date(`2000-01-01T${opportunity.time_start}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      {opportunity.duration_hours && ` (${opportunity.duration_hours}h)`}
                    </span>
                  </div>
                )}
                
                {opportunity.location && (
                  <div className="flex items-center">
                    <span className="font-medium">📍</span>
                    <span className="ml-1">{opportunity.location}</span>
                  </div>
                )}
                
                {opportunity.skills_required.length > 0 && (
                  <div className="flex items-center">
                    <span className="font-medium">🔧</span>
                    <span className="ml-1">{opportunity.skills_required.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Signups Section */}
{opportunity.signups && opportunity.signups.length > 0 ? (
  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <h5 className="font-medium text-gray-900">Volunteers Signed Up:</h5>
      <button
        onClick={() => setAddingSignup(opportunity)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
      >
        + Add
      </button>
    </div>
    <div className="space-y-1">
      {opportunity.signups.map((signup) => (
                      <div key={signup.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-900">
                          {signup.member_name}
                        </span>
                        <span className="text-gray-500">
                          {new Date(signup.signed_up_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-yellow-800">
                      No volunteers signed up yet
                    </p>
                    <button
                      onClick={() => setAddingSignup(opportunity)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                    >
                      + Add First Volunteer
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Created: {new Date(opportunity.created_at).toLocaleDateString()}
                </span>
                <div className="space-x-2">
                  <button 
                    onClick={() => setEditingOpportunity(opportunity)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  )}

  {/* Edit Opportunity Modal */}
{editingOpportunity && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Edit Opportunity</h3>
      
      <form onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        updateOpportunity({
          title: formData.get('title'),
          description: formData.get('description'),
          date: formData.get('date'),
          time: formData.get('time'),
          duration: formData.get('duration'),
          volunteersNeeded: parseInt(formData.get('volunteersNeeded') as string),
          skills: formData.get('skills'),
          location: formData.get('location')
        })
      }} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              name="title"
              defaultValue={editingOpportunity.title}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Volunteers Needed</label>
            <input
              type="number"
              name="volunteersNeeded"
              min="1"
              defaultValue={editingOpportunity.volunteers_needed}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={editingOpportunity.date_scheduled || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              defaultValue={editingOpportunity.time_start || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
            <input
              type="number"
              name="duration"
              step="0.5"
              min="0"
              defaultValue={editingOpportunity.duration_hours || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={editingOpportunity.location || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={editingOpportunity.description || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills Required</label>
          <input
            type="text"
            name="skills"
            defaultValue={editingOpportunity.skills_required?.join(', ') || ''}
            placeholder="Separate with commas"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setEditingOpportunity(null)}
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

{/* Add Manual Signup Modal */}
{addingSignup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Add Volunteer</h3>
      <p className="text-sm text-gray-600 mb-4">
        Adding to: <strong>{addingSignup.title}</strong>
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Volunteer Type</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="memberType"
                value="existing"
                checked={manualSignup.memberType === 'existing'}
                onChange={(e) => setManualSignup({...manualSignup, memberType: e.target.value as 'existing' | 'custom'})}
                className="mr-2"
              />
              Existing Member
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="memberType"
                value="custom"
                checked={manualSignup.memberType === 'custom'}
                onChange={(e) => setManualSignup({...manualSignup, memberType: e.target.value as 'existing' | 'custom'})}
                className="mr-2"
              />
              Non-Member/Guest
            </label>
          </div>
        </div>
        
        {manualSignup.memberType === 'existing' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Member</label>
            <select
              value={manualSignup.selectedMember}
              onChange={(e) => setManualSignup({...manualSignup, selectedMember: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Choose a member...</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.first_name} {member.last_name} ({member.email})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={manualSignup.customName}
                onChange={(e) => setManualSignup({...manualSignup, customName: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={manualSignup.customEmail}
                onChange={(e) => setManualSignup({...manualSignup, customEmail: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>
          </>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => {
            setAddingSignup(null)
            setManualSignup({
              memberType: 'existing',
              selectedMember: '',
              customName: '',
              customEmail: ''
            })
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={addManualSignup}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Volunteer'}
        </button>
      </div>
    </div>
  </div>
)}
</div>

        {message && (
          <div className={`p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>
    </>
  )
}