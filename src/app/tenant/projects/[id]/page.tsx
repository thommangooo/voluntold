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

interface AdditionalHoursWithMember extends AdditionalHours {
  member_name?: string
  member_email?: string
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

  // Resources state
  const [resources, setResources] = useState<ProjectResource[]>([])
  const [showResourceForm, setShowResourceForm] = useState(false)
  const [editingResource, setEditingResource] = useState<ProjectResource | null>(null)
  const [deletingResource, setDeletingResource] = useState<ProjectResource | null>(null)

  // Additional hours state  
  const [additionalHours, setAdditionalHours] = useState<AdditionalHoursWithMember[]>([])
  const [showHoursForm, setShowHoursForm] = useState(false)
  const [editingHours, setEditingHours] = useState<AdditionalHours | null>(null)
  const [deletingHours, setDeletingHours] = useState<AdditionalHours | null>(null)

  // Form state
  const [newResource, setNewResource] = useState({
    type: 'note' as 'file' | 'link' | 'note',
    title: '',
    content: ''
  })

  const [newHours, setNewHours] = useState({
    member_id: '',
    hours_worked: '',
    description: '',
    date_worked: new Date().toISOString().split('T')[0]
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
      loadResources(projectId)
      loadAdditionalHours(projectId)

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

  // Resources functions
  const loadResources = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_resources')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (error) {
      setMessage(`Error loading resources: ${(error as Error).message}`)
    }
  }

const addResource = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!tenantInfo) return

  setLoading(true)
  setMessage('')

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('project_resources')
      .insert([
        {
          project_id: projectId,
          // tenant_id: tenantInfo.id,  // Remove this line
          type: newResource.type,
          title: newResource.title,
          content: newResource.content,
          created_by: session.user.id
        }
      ])

    if (error) throw error

      setMessage(`Resource "${newResource.title}" added successfully!`)
      setNewResource({ type: 'note', title: '', content: '' })
      setShowResourceForm(false)
      loadResources(projectId)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const updateResource = async (updatedData: any) => {
    if (!editingResource || !tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('project_resources')
        .update({
          type: updatedData.type,
          title: updatedData.title,
          content: updatedData.content
        })
        .eq('id', editingResource.id)

      if (error) throw error

      setMessage(`Resource "${updatedData.title}" updated successfully!`)
      setEditingResource(null)
      loadResources(projectId)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteResource = async () => {
    if (!deletingResource || !tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('project_resources')
        .delete()
        .eq('id', deletingResource.id)

      if (error) throw error

      setMessage(`Resource "${deletingResource.title}" deleted successfully!`)
      setDeletingResource(null)
      loadResources(projectId)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  // Additional hours functions
  const loadAdditionalHours = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('additional_hours')
        .select(`
          *,
          user_profiles:member_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('project_id', projectId)
        .order('date_worked', { ascending: false })

      if (error) throw error

      // Transform data to include member names
      const hoursWithMembers = (data || []).map(record => ({
        ...record,
        member_name: record.user_profiles ? 
          `${record.user_profiles.first_name} ${record.user_profiles.last_name}` : 
          'Unknown Member',
        member_email: record.user_profiles?.email || ''
      }))

      setAdditionalHours(hoursWithMembers)
    } catch (error) {
      setMessage(`Error loading additional hours: ${(error as Error).message}`)
    }
  }

  const addAdditionalHours = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('additional_hours')
        .insert([
          {
            project_id: projectId,
            tenant_id: tenantInfo.id,  // This one might be useful for direct tenant queries
            member_id: newHours.member_id,
            hours_worked: parseFloat(newHours.hours_worked),
            description: newHours.description || null,
            date_worked: newHours.date_worked
            // created_by: session.user.id  // Remove if column doesn't exist
          }
        ])

      if (error) throw error

      setMessage(`${newHours.hours_worked} hours logged successfully!`)
      setNewHours({
        member_id: '',
        hours_worked: '',
        description: '',
        date_worked: new Date().toISOString().split('T')[0]
      })
      setShowHoursForm(false)
      loadAdditionalHours(projectId)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const updateAdditionalHours = async (updatedData: any) => {
    if (!editingHours || !tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('additional_hours')
        .update({
          member_id: updatedData.member_id,
          hours_worked: parseFloat(updatedData.hours_worked),
          description: updatedData.description || null,
          date_worked: updatedData.date_worked
        })
        .eq('id', editingHours.id)

      if (error) throw error

      setMessage(`Hours entry updated successfully!`)
      setEditingHours(null)
      loadAdditionalHours(projectId)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteAdditionalHours = async () => {
    if (!deletingHours || !tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('additional_hours')
        .delete()
        .eq('id', deletingHours.id)

      if (error) throw error

      setMessage(`Hours entry deleted successfully!`)
      setDeletingHours(null)
      loadAdditionalHours(projectId)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  // Existing functions
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

  // Resources Section Component
  const ResourcesSection = () => {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Project Resources ({resources.length})</h2>
            <button
              onClick={() => setShowResourceForm(!showResourceForm)}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              {showResourceForm ? 'Hide Form' : 'Add Resource'}
            </button>
          </div>
        </div>

        {showResourceForm && (
          <div className="p-6 border-b bg-gray-50">
            <form onSubmit={addResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Resource Type</label>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value as 'file' | 'link' | 'note' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="note">Note</option>
                  <option value="link">Link</option>
                  <option value="file">File Reference</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Resource title or name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {newResource.type === 'link' ? 'URL' : newResource.type === 'file' ? 'File Path/Name' : 'Content'}
                </label>
                <textarea
                  value={newResource.content}
                  onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                  rows={newResource.type === 'note' ? 4 : 2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={
                    newResource.type === 'link' 
                      ? 'https://example.com' 
                      : newResource.type === 'file' 
                        ? 'filename.pdf or /path/to/file' 
                        : 'Enter your notes here...'
                  }
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Resource'}
              </button>
            </form>
          </div>
        )}

        <div className="p-6">
          {resources.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No resources yet. Add your first resource above!</p>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          resource.type === 'note' ? 'bg-yellow-100 text-yellow-800' :
                          resource.type === 'link' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {resource.type}
                        </span>
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                      </div>
                      
                      <div className="text-gray-600 mb-2">
                        {resource.type === 'link' ? (
                          <a 
                            href={resource.content} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {resource.content}
                          </a>
                        ) : (
                          <div className="whitespace-pre-wrap">{resource.content}</div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Added {new Date(resource.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingResource(resource)}
                        className="text-green-600 hover:text-green-800 font-medium cursor-pointer text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingResource(resource)}
                        className="text-red-600 hover:text-red-800 font-medium cursor-pointer text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Additional Hours Section Component
  const AdditionalHoursSection = () => {
    // Calculate total additional hours
    const totalAdditionalHours = additionalHours.reduce(
      (sum, record) => sum + (record.hours_worked || 0), 
      0
    )

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Additional Volunteer Hours</h2>
              <p className="text-sm text-gray-600">
                {totalAdditionalHours.toFixed(1)} total hours from {additionalHours.length} entries
              </p>
            </div>
            <button
              onClick={() => setShowHoursForm(!showHoursForm)}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              {showHoursForm ? 'Hide Form' : 'Log Hours'}
            </button>
          </div>
        </div>

        {showHoursForm && (
          <div className="p-6 border-b bg-gray-50">
            <form onSubmit={addAdditionalHours} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Volunteer</label>
                  <select
                    value={newHours.member_id}
                    onChange={(e) => setNewHours({ ...newHours, member_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a volunteer</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.first_name} {member.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hours Worked</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={newHours.hours_worked}
                    onChange={(e) => setNewHours({ ...newHours, hours_worked: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g. 2.5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date Worked</label>
                <input
                  type="date"
                  value={newHours.date_worked}
                  onChange={(e) => setNewHours({ ...newHours, date_worked: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  value={newHours.description}
                  onChange={(e) => setNewHours({ ...newHours, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="What work was done? (planning, setup, cleanup, etc.)"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Logging...' : 'Log Hours'}
              </button>
            </form>
          </div>
        )}

        <div className="p-6">
          {additionalHours.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No additional hours logged yet. Use the form above to track volunteer time outside of scheduled opportunities!</p>
          ) : (
            <div className="space-y-4">
              {additionalHours.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-semibold text-lg text-blue-600">
                          {record.hours_worked} hrs
                        </span>
                        <div>
                          <div className="font-medium">{record.member_name}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(record.date_worked).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {record.description && (
                        <div className="text-gray-600 mb-2">
                          {record.description}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Logged {new Date(record.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingHours(record)}
                        className="text-green-600 hover:text-green-800 font-medium cursor-pointer text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingHours(record)}
                        className="text-red-600 hover:text-red-800 font-medium cursor-pointer text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
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
              {showCreateForm ? 'Hide Form' : 'Add Sign-Up Sheet'}
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
              No Sign-Up Sheets yet. Create the first one above!
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
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Project Resources ({resources.length})</h2>
              <button
                onClick={() => setShowResourceForm(!showResourceForm)}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                {showResourceForm ? 'Hide Form' : 'Add Resource'}
              </button>
            </div>
          </div>

          {showResourceForm && (
            <div className="p-6 border-b bg-gray-50">
              <form onSubmit={addResource} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resource Type</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value as 'file' | 'link' | 'note' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="note">Note</option>
                    <option value="link">Link</option>
                    <option value="file">File Reference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Resource title or name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {newResource.type === 'link' ? 'URL' : newResource.type === 'file' ? 'File Path/Name' : 'Content'}
                  </label>
                  <textarea
                    value={newResource.content}
                    onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                    rows={newResource.type === 'note' ? 4 : 2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={
                      newResource.type === 'link' 
                        ? 'https://example.com' 
                        : newResource.type === 'file' 
                          ? 'filename.pdf or /path/to/file' 
                          : 'Enter your notes here...'
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Resource'}
                </button>
              </form>
            </div>
          )}

          <div className="p-6">
            {resources.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No resources yet. Add your first resource above!</p>
            ) : (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            resource.type === 'note' ? 'bg-yellow-100 text-yellow-800' :
                            resource.type === 'link' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {resource.type}
                          </span>
                          <h3 className="font-semibold text-lg">{resource.title}</h3>
                        </div>
                        
                        <div className="text-gray-600 mb-2">
                          {resource.type === 'link' ? (
                            <a 
                              href={resource.content} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              {resource.content}
                            </a>
                          ) : (
                            <div className="whitespace-pre-wrap">{resource.content}</div>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Added {new Date(resource.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingResource(resource)}
                          className="text-green-600 hover:text-green-800 font-medium cursor-pointer text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingResource(resource)}
                          className="text-red-600 hover:text-red-800 font-medium cursor-pointer text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Hours Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Additional Volunteer Hours</h2>
                <p className="text-sm text-gray-600">
                  {additionalHours.reduce((sum, record) => sum + (record.hours_worked || 0), 0).toFixed(1)} total hours from {additionalHours.length} entries
                </p>
              </div>
              <button
                onClick={() => setShowHoursForm(!showHoursForm)}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                {showHoursForm ? 'Hide Form' : 'Log Hours'}
              </button>
            </div>
          </div>

          {showHoursForm && (
            <div className="p-6 border-b bg-gray-50">
              <form onSubmit={addAdditionalHours} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Volunteer</label>
                    <select
                      value={newHours.member_id}
                      onChange={(e) => setNewHours({ ...newHours, member_id: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a volunteer</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.first_name} {member.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hours Worked</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={newHours.hours_worked}
                      onChange={(e) => setNewHours({ ...newHours, hours_worked: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g. 2.5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date Worked</label>
                  <input
                    type="date"
                    value={newHours.date_worked}
                    onChange={(e) => setNewHours({ ...newHours, date_worked: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                  <textarea
                    value={newHours.description}
                    onChange={(e) => setNewHours({ ...newHours, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="What work was done? (planning, setup, cleanup, etc.)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Logging...' : 'Log Hours'}
                </button>
              </form>
            </div>
          )}

          <div className="p-6">
            {additionalHours.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No additional hours logged yet. Use the form above to track volunteer time outside of scheduled opportunities!</p>
            ) : (
              <div className="space-y-4">
                {additionalHours.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-semibold text-lg text-blue-600">
                            {record.hours_worked} hrs
                          </span>
                          <div>
                            <div className="font-medium">{record.member_name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(record.date_worked).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        {record.description && (
                          <div className="text-gray-600 mb-2">
                            {record.description}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          Logged {new Date(record.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingHours(record)}
                          className="text-green-600 hover:text-green-800 font-medium cursor-pointer text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingHours(record)}
                          className="text-red-600 hover:text-red-800 font-medium cursor-pointer text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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

        {/* Edit Resource Modal */}
        {editingResource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Edit Resource</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                updateResource({
                  type: formData.get('type'),
                  title: formData.get('title'),
                  content: formData.get('content')
                })
              }} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resource Type</label>
                  <select
                    name="type"
                    defaultValue={editingResource.type}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="note">Note</option>
                    <option value="link">Link</option>
                    <option value="file">File Reference</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingResource.title}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    name="content"
                    rows={4}
                    defaultValue={editingResource.content}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingResource(null)}
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

        {/* Delete Resource Confirmation Modal */}
        {deletingResource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Delete Resource</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>"{deletingResource.title}"</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeletingResource(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteResource}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete Resource'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Additional Hours Modal */}
        {editingHours && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Edit Hours Entry</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                updateAdditionalHours({
                  member_id: formData.get('member_id'),
                  hours_worked: formData.get('hours_worked'),
                  description: formData.get('description'),
                  date_worked: formData.get('date_worked')
                })
              }} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Volunteer</label>
                    <select
                      name="member_id"
                      defaultValue={editingHours.member_id}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a volunteer</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.first_name} {member.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hours Worked</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      name="hours_worked"
                      defaultValue={editingHours.hours_worked}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date Worked</label>
                  <input
                    type="date"
                    name="date_worked"
                    defaultValue={editingHours.date_worked}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingHours.description || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingHours(null)}
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

        {/* Delete Additional Hours Confirmation Modal */}
        {deletingHours && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Delete Hours Entry</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this <strong>{deletingHours.hours_worked} hour</strong> entry? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeletingHours(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAdditionalHours}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete Entry'}
                </button>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>
    </>
  )
}