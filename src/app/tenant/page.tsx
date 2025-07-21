// File: src/app/tenant/page.tsx
// Version: 4.0 - Added groups functionality with member targeting

'use client'
import Header from '../../components/Header'
import BulkAddMembersModal from '../../components/BulkAddMembersModal'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

interface TenantInfo {
  id: string
  name: string
  slug: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'closed' | 'on_hold'
  goals: string | null
  created_at: string
  total_hours?: number
  opportunities?: OpportunityWithStats[]
  target_all_members?: boolean
  target_groups?: string[] | null
  targeting_display?: string
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
  description: string | null
  date_scheduled: string | null
  time_start: string | null
  duration_hours: number | null
  location: string | null
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

interface Signup {
  id: string
  opportunity_id: string
  member_email: string
  member_name: string
  status: string
  signed_up_at: string
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
  last_emailed_at: string | null
  target_groups: string[] | null
  target_all_members: boolean
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

interface Group {
  id: string
  name: string
  member_count: number
  created_at: string
  updated_at: string
}

interface GroupMembership {
  id: string
  group_id: string
  group_name: string
  member_email: string
  added_at: string
}

export default function TenantDashboard() {
  const router = useRouter()
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [memberSearch, setMemberSearch] = useState('')
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
  const [showBulkAddModal, setShowBulkAddModal] = useState(false)

  // New state for signup management
  const [managingOpportunity, setManagingOpportunity] = useState<OpportunityWithStats | null>(null)
  const [opportunitySignups, setOpportunitySignups] = useState<Signup[]>([])
  const [showAddSignupForm, setShowAddSignupForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [signupToDelete, setSignupToDelete] = useState<Signup | null>(null)

  // Groups state
  const [groups, setGroups] = useState<Group[]>([])
  const [showGroupForm, setShowGroupForm] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null)
  const [managingGroupMembers, setManagingGroupMembers] = useState<Group | null>(null)
  const [groupMemberships, setGroupMemberships] = useState<GroupMembership[]>([])
  const [newGroupName, setNewGroupName] = useState('')

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    goals: '',
    target_groups: [] as string[],
    target_all_members: true
  })

  const [polls, setPolls] = useState<Poll[]>([])
  const [showPollForm, setShowPollForm] = useState(false)
  const [viewingPoll, setViewingPoll] = useState<Poll | null>(null)
  const [pollResponses, setPollResponses] = useState<PollResponse[]>([])
  const [editingResponse, setEditingResponse] = useState<PollResponse | null>(null)

  // Add state for edit project form
  const [editProjectForm, setEditProjectForm] = useState({
    name: '',
    description: '',
    goals: '',
    status: 'active' as 'active' | 'closed' | 'on_hold',
    target_groups: [] as string[],
    target_all_members: true
  })

  // Add these new state variables for member elevation
  const [elevatingMember, setElevatingMember] = useState<Member | null>(null)
  const [showElevationConfirm, setShowElevationConfirm] = useState(false)
  const [showElevationNotification, setShowElevationNotification] = useState(false)
  const [elevationCustomMessage, setElevationCustomMessage] = useState('')
  const [elevationStep, setElevationStep] = useState<'confirm' | 'notify' | 'complete'>('confirm')

  const [newPoll, setNewPoll] = useState({
    title: '',
    question: '',
    poll_type: 'yes_no' as 'yes_no' | 'multiple_choice',
    options: [''],
    is_anonymous: false,
    expires_at: '',
    target_groups: [] as string[],
    target_all_members: true
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

  // Filter members based on search
  const handleMemberSearch = (searchTerm: string) => {
    setMemberSearch(searchTerm)
  }

  // Update filtered members when members or search changes
  useEffect(() => {
    if (!memberSearch.trim()) {
      setFilteredMembers(members)
    } else {
      const filtered = members.filter(member => 
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
        (member.position && member.position.toLowerCase().includes(memberSearch.toLowerCase())) ||
        member.role.toLowerCase().includes(memberSearch.toLowerCase())
      )
      setFilteredMembers(filtered)
    }
  }, [members, memberSearch])

  // Groups functions
  const loadGroups = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_member_counts')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true })

      if (error) throw error
      setGroups(data || [])
    } catch (error) {
      setMessage(`Error loading groups: ${(error as Error).message}`)
    }
  }

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('groups')
        .insert([
          {
            tenant_id: tenantInfo.id,
            name: newGroupName,
            created_by: session.user.id
          }
        ])

      if (error) throw error

      setMessage(`Group "${newGroupName}" created successfully!`)
      setNewGroupName('')
      setShowGroupForm(false)
      loadGroups(tenantInfo.id)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const updateGroup = async (updatedName: string) => {
    if (!editingGroup || !tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('groups')
        .update({ name: updatedName })
        .eq('id', editingGroup.id)

      if (error) throw error

      setMessage(`Group renamed to "${updatedName}" successfully!`)
      setEditingGroup(null)
      loadGroups(tenantInfo.id)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteGroup = async () => {
    if (!deletingGroup || !tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', deletingGroup.id)

      if (error) throw error

      setMessage(`Group "${deletingGroup.name}" deleted successfully!`)
      setDeletingGroup(null)
      loadGroups(tenantInfo.id)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadGroupMemberships = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('member_group_view')
        .select('*')
        .eq('group_id', groupId)
        .order('member_email', { ascending: true })

      if (error) throw error
      setGroupMemberships(data || [])
    } catch (error) {
      setMessage(`Error loading group members: ${(error as Error).message}`)
    }
  }

  const addMemberToGroup = async (groupId: string, memberEmail: string) => {
    if (!tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('group_memberships')
        .insert([
          {
            group_id: groupId,
            tenant_id: tenantInfo.id,
            member_email: memberEmail,
            added_by: session.user.id
          }
        ])

      if (error) throw error

      setMessage('Member added to group successfully!')
      loadGroupMemberships(groupId)
      loadGroups(tenantInfo.id) // Refresh counts
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const removeMemberFromGroup = async (membershipId: string, groupId: string) => {
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('group_memberships')
        .delete()
        .eq('id', membershipId)

      if (error) throw error

      setMessage('Member removed from group successfully!')
      loadGroupMemberships(groupId)
      loadGroups(tenantInfo!.id) // Refresh counts
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  // Load signups for a specific opportunity
  const loadOpportunitySignups = async (opportunityId: string) => {
    try {
      const { data, error } = await supabase
        .from('signups')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .eq('status', 'confirmed')
        .order('signed_up_at', { ascending: true })

      if (error) throw error
      setOpportunitySignups(data || [])
    } catch (error) {
      setMessage(`Error loading signups: ${(error as Error).message}`)
    }
  }

  // Add a manual signup
  const addManualSignup = async (opportunity: OpportunityWithStats, member: Member) => {
    if (!tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      // Check if member is already signed up
      const { data: existingSignup, error: checkError } = await supabase
        .from('signups')
        .select('id')
        .eq('opportunity_id', opportunity.id)
        .eq('member_email', member.email)
        .eq('status', 'confirmed')
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      if (existingSignup) {
        setMessage(`${member.first_name} ${member.last_name} is already signed up for this opportunity.`)
        setLoading(false)
        return
      }

      // Check if opportunity is full
      if (opportunity.filled_count >= opportunity.volunteers_needed) {
        setMessage('This opportunity is already at capacity. Do you want to add them to a waitlist?')
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from('signups')
        .insert([
          {
            opportunity_id: opportunity.id,
            tenant_id: tenantInfo.id,
            member_email: member.email,
            member_name: `${member.first_name} ${member.last_name}`,
            signup_token: crypto.randomUUID(),
            status: 'confirmed'
          }
        ])

      if (error) throw error

      setMessage(`Successfully signed up ${member.first_name} ${member.last_name} for "${opportunity.title}"`)
      setSelectedMember(null)
      setShowAddSignupForm(false)
      
      
      // Update the managing opportunity counts immediately
      if (managingOpportunity) {
        const updatedOpportunity = {
          ...managingOpportunity,
          filled_count: managingOpportunity.filled_count + 1,
          open_positions: Math.max(0, managingOpportunity.volunteers_needed - (managingOpportunity.filled_count + 1))
        }
        setManagingOpportunity(updatedOpportunity)
      }
      
      // Reload data
      await loadOpportunitySignups(opportunity.id)
      if (tenantInfo) {
        await loadProjects(tenantInfo.id)
      }
    } catch (error) {
      setMessage(`Error adding signup: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  // Remove a signup
  const removeSignup = async () => {
    if (!signupToDelete || !tenantInfo || !managingOpportunity) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('signups')
        .delete()
        .eq('id', signupToDelete.id)

      if (error) throw error

      setMessage(`Successfully removed ${signupToDelete.member_name} from the signup sheet.`)
      setSignupToDelete(null)
      
      // Update the managing opportunity counts immediately
      const updatedOpportunity = {
        ...managingOpportunity,
        filled_count: Math.max(0, managingOpportunity.filled_count - 1),
        open_positions: Math.max(0, managingOpportunity.volunteers_needed - Math.max(0, managingOpportunity.filled_count - 1))
      }
      setManagingOpportunity(updatedOpportunity)
      
      // Reload data
      if (managingOpportunity) {
        await loadOpportunitySignups(managingOpportunity.id)
      }
      if (tenantInfo) {
        await loadProjects(tenantInfo.id)
      }
    } catch (error) {
      setMessage(`Error removing signup: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadPolls = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('tenant_id', tenantId)
        .neq('status', 'closed')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPolls(data || [])
    } catch (error) {
      setMessage(`Error loading polls: ${(error as Error).message}`)
    }
  }

  const elevateMemberToAdmin = async (member: Member, sendNotification: boolean, customMessage: string = '') => {
  if (!tenantInfo) return

  setLoading(true)
  setMessage('')

  try {
    // Update the member's role to tenant_admin
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ role: 'tenant_admin' })
      .eq('id', member.id)

    if (updateError) throw updateError

    let emailResult = null
    if (sendNotification) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const response = await fetch('/api/member-elevation-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberEmail: member.email,
            memberName: `${member.first_name} ${member.last_name}`,
            organizationName: tenantInfo.name,
            customMessage: customMessage.trim(),
            elevatedBy: session?.user?.id
          })
        })

        emailResult = await response.json()
        if (!response.ok) {
          console.error('Notification email error:', emailResult.error)
        }
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError)
      }
    }

    // Send password setup email
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await fetch('/api/password-setup-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: member.email,
          type: 'new_admin_setup',
          createdBy: session?.user?.id
        })
      })
    } catch (setupError) {
      console.error('Failed to send password setup email:', setupError)
    }

    // Set success message
    let successMessage = `${member.first_name} ${member.last_name} has been elevated to admin and will receive a password setup email.`
    if (sendNotification && emailResult?.success) {
      successMessage += ` A notification email has also been sent.`
    } else if (sendNotification && !emailResult?.success) {
      successMessage += ` However, the notification email failed to send.`
    }

    setMessage(successMessage)
    setElevationStep('complete')
    
    // Reload members to show updated role
    loadMembers(tenantInfo.id)

  } catch (error) {
    setMessage(`Error elevating member: ${(error as Error).message}`)
  } finally {
    setLoading(false)
  }
}

  const loadTenantData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push('/auth')
        return
      }

      // Get org context from URL if available
      const urlParams = new URLSearchParams(window.location.search)
      const orgFromUrl = urlParams.get('org')

      let profile = null
      let targetTenantId = null

      if (orgFromUrl) {
        // Org specified in URL - find profile for that specific org
        const { data: orgProfile, error: orgProfileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .eq('tenant_id', orgFromUrl)
          .single()

        if (!orgProfileError && orgProfile) {
          profile = orgProfile
          targetTenantId = orgFromUrl
        } else {
          // Check if user is super admin (can access any org)
          const { data: superProfile, error: superError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .eq('role', 'super_admin')
            .single()

          if (!superError && superProfile) {
            profile = superProfile
            targetTenantId = orgFromUrl
          }
        }
      } else {
        // No org specified - find any admin profile
        const { data: allProfiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .in('role', ['tenant_admin', 'super_admin'])

        if (profilesError) throw profilesError

        // Prefer tenant_admin profile if available
        const tenantAdmin = allProfiles?.find(p => p.role === 'tenant_admin' && p.tenant_id)
        const superAdmin = allProfiles?.find(p => p.role === 'super_admin')
        
        profile = tenantAdmin || superAdmin
        targetTenantId = profile?.tenant_id
      }

      if (!profile || !targetTenantId) {
        router.push('/setup-tenant')
        return
      }

      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name, slug')
        .eq('id', targetTenantId)
        .single()

      if (tenantError) throw tenantError

      setTenantInfo(tenant)
      await loadProjects(tenant.id)
      await loadMembers(tenant.id)
      await loadPolls(tenant.id)
      await loadGroups(tenant.id)

    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }, [router])

  const loadProjects = async (tenantId: string) => {
    try {
      const { data: projects, error: projectError } = await supabase
        .from('project_target_info')
        .select('id, name, description, status, goals, created_at, target_all_members, target_groups, targeting_display')
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (projectError) throw projectError

      const projectsWithOpportunities = await Promise.all(
        (projects || []).map(async (project) => {
          const { data: opportunities, error: oppError } = await supabase
            .from('opportunities')
            .select('id, title, description, date_scheduled, time_start, duration_hours, location, volunteers_needed')
            .eq('project_id', project.id)
            .order('date_scheduled', { ascending: true })

          if (oppError) throw oppError

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

              const opportunityHours = filled_count * duration_hours
              totalOpportunityHours += opportunityHours

              return {
                id: opportunity.id,
                title: opportunity.title,
                description: opportunity.description,
                date_scheduled: opportunity.date_scheduled,
                time_start: opportunity.time_start,
                duration_hours: opportunity.duration_hours,
                location: opportunity.location,
                volunteers_needed,
                filled_count,
                open_positions
              }
            })
          )

          const { data: additionalHours, error: hoursError } = await supabase
            .from('additional_hours')
            .select('hours_worked')
            .eq('project_id', project.id)

          if (hoursError) throw hoursError

          const totalAdditionalHours = (additionalHours || []).reduce(
            (sum, record) => sum + (record.hours_worked || 0), 
            0
          )

          const total_hours = totalOpportunityHours + totalAdditionalHours

          return {
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            goals: project.goals,
            created_at: project.created_at,
            total_hours,
            opportunities: opportunitiesWithStats,
            target_all_members: project.target_all_members,
            target_groups: project.target_groups,
            targeting_display: project.targeting_display
          } as Project & { target_all_members: boolean; target_groups: string[] | null; targeting_display: string }
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
      setFilteredMembers(data || [])
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
            goals: newProject.goals || null,
            status: 'active',
            target_groups: newProject.target_groups.length > 0 ? newProject.target_groups : null,
            target_all_members: newProject.target_all_members
          }
        ])

      if (error) throw error

      setMessage(`Project "${newProject.name}" created successfully!`)
      setNewProject({ 
        name: '', 
        description: '', 
        goals: '',
        target_groups: [],
        target_all_members: true
      })
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
          status: updatedData.status,
          target_groups: updatedData.target_groups && updatedData.target_groups.length > 0 ? updatedData.target_groups : null,
          target_all_members: updatedData.target_all_members
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
    // Check if this is an admin being created
    const isAdminRole = newMember.role === 'tenant_admin'

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

    // If creating an admin, automatically send password setup email
    if (isAdminRole) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const response = await fetch('/api/password-setup-reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: newMember.email,
            type: 'new_admin_setup',
            createdBy: session?.user?.id
          })
        })

        const emailResult = await response.json()

        if (response.ok) {
          setMessage(`Admin ${newMember.firstName} ${newMember.lastName} added successfully! A password setup email has been sent to ${newMember.email}.`)
        } else {
          setMessage(`Admin ${newMember.firstName} ${newMember.lastName} added successfully, but failed to send setup email. Please manually send them their password setup link.`)
          console.error('Setup email error:', emailResult.error)
        }
      } catch (emailError) {
        setMessage(`Admin ${newMember.firstName} ${newMember.lastName} added successfully, but failed to send setup email. Please manually send them their password setup link.`)
        console.error('Setup email error:', emailError)
      }
    } else {
      // Regular member - no email needed
      setMessage(`Member ${newMember.firstName} ${newMember.lastName} added successfully!`)
    }

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
const resendSetupEmail = async (memberEmail: string) => {
  console.log('🔄 Resend setup email clicked for:', memberEmail)
  console.log('🔄 Function starting...')
  setLoading(true)
  setMessage('')

  try {
    const { data: { session } } = await supabase.auth.getSession()
    console.log('👤 Session user ID:', session?.user?.id)
    
    const requestBody = {
      email: memberEmail,
      type: 'new_admin_setup',
      createdBy: session?.user?.id
    }
    console.log('📤 About to send request with body:', requestBody)
    
    const response = await fetch('/api/password-setup-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📧 API response status:', response.status)
    const result = await response.json()
    console.log('📧 API response data:', result)

    if (response.ok) {
      setMessage(`Setup email sent successfully to ${memberEmail}`)
    } else {
      setMessage(`Failed to send setup email: ${result.error}`)
    }
  } catch (error) {
    console.error('❌ Resend setup email error:', error)
    setMessage(`Error sending setup email: ${(error as Error).message}`)
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

      const pollOptions = newPoll.poll_type === 'multiple_choice' 
        ? newPoll.options.filter(opt => opt.trim() !== '')
        : null

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
            status: 'active',
            target_groups: newPoll.target_groups.length > 0 ? newPoll.target_groups : null,
            target_all_members: newPoll.target_all_members
          }
        ])
        .select()
        .single()

      if (pollError) throw pollError

      // Get target member emails based on group selection
      let targetEmails: string[] = []
      
      if (newPoll.target_all_members) {
        // Get all members
        const { data: allMembers, error: membersError } = await supabase
          .from('user_profiles')
          .select('email, first_name, last_name')
          .eq('tenant_id', tenantInfo.id)

        if (membersError) throw membersError
        targetEmails = allMembers?.map(m => m.email) || []
      } else if (newPoll.target_groups.length > 0) {
        // Get members from selected groups (with deduplication)
        const { data: groupMemberEmails, error: groupError } = await supabase
          .rpc('get_group_member_emails', {
            group_ids: newPoll.target_groups,
            tenant_id_param: tenantInfo.id
          })

        if (groupError) throw groupError
        targetEmails = groupMemberEmails || []
      }

      // Create poll response records for target members
      if (targetEmails.length > 0) {
        const { data: targetMembers, error: targetMembersError } = await supabase
          .from('user_profiles')
          .select('email, first_name, last_name')
          .eq('tenant_id', tenantInfo.id)
          .in('email', targetEmails)

        if (targetMembersError) throw targetMembersError

        const pollResponses = targetMembers?.map(member => ({
          poll_id: poll.id,
          tenant_id: tenantInfo.id,
          member_email: member.email,
          member_name: `${member.first_name} ${member.last_name}`,
          response: '',
          response_token: crypto.randomUUID(),
          responded_at: null
        })) || []

        const { error: responsesError } = await supabase
          .from('poll_responses')
          .insert(pollResponses)

        if (responsesError) throw responsesError
      }

      setMessage(`Poll "${newPoll.title}" created successfully with ${targetEmails.length} member records!`)
      setNewPoll({
        title: '',
        question: '',
        poll_type: 'yes_no',
        options: [''],
        is_anonymous: false,
        expires_at: '',
        target_groups: [],
        target_all_members: true
      })
      setShowPollForm(false)
      loadPolls(tenantInfo.id)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const closePoll = async () => {
    if (!pollToClose || !tenantInfo) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('polls')
        .update({ status: 'closed' })
        .eq('id', pollToClose.id)

      if (error) throw error

      setMessage(`Poll "${pollToClose.title}" has been closed.`)
      setPollToClose(null)
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

      const isNewResponse = !editingResponse.response || editingResponse.response.trim() === ''

      const updateData: any = {
        response: newResponse,
        updated_by: session.user.id,
        updated_at: new Date().toISOString()
      }

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

  // Helper function to get group names for display
  const getGroupNames = (groupIds: string[] | null) => {
    if (!groupIds || groupIds.length === 0) return []
    return groups.filter(g => groupIds.includes(g.id)).map(g => g.name)
  }

  useEffect(() => {
    loadTenantData()
  }, [loadTenantData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
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

          {/* 4-Panel Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Projects Panel */}
            <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-300px)]">
              <div className="px-6 py-4 border-b flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
                  <button
                    onClick={() => setShowProjectForm(!showProjectForm)}
                    className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    {showProjectForm ? 'Hide' : 'Create'}
                  </button>
                </div>
              </div>

              {showProjectForm && (
                <div className="p-4 border-b bg-gray-50 flex-shrink-0 max-h-96 overflow-y-auto">
                  <form onSubmit={createProject} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <textarea
                        placeholder="Description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <textarea
                        placeholder="Goals & Objectives"
                        value={newProject.goals}
                        onChange={(e) => setNewProject({ ...newProject, goals: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Group Targeting Section */}
                    <div className="border-t pt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-2">Target Audience</label>
                      
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={newProject.target_all_members}
                            onChange={() => setNewProject({ ...newProject, target_all_members: true, target_groups: [] })}
                            className="mr-2"
                          />
                          <span className="text-sm">All Members ({members.length})</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={!newProject.target_all_members}
                            onChange={() => setNewProject({ ...newProject, target_all_members: false })}
                            className="mr-2"
                          />
                          <span className="text-sm">Selected Groups</span>
                        </label>
                      </div>

                      {!newProject.target_all_members && (
                        <div className="mt-2 max-h-24 overflow-y-auto border rounded p-2">
                          {groups.length === 0 ? (
                            <p className="text-xs text-gray-500">No groups available</p>
                          ) : (
                            groups.map(group => (
                              <label key={group.id} className="flex items-center mb-1">
                                <input
                                  type="checkbox"
                                  checked={newProject.target_groups.includes(group.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewProject({ ...newProject, target_groups: [...newProject.target_groups, group.id] })
                                    } else {
                                      setNewProject({ ...newProject, target_groups: newProject.target_groups.filter(id => id !== group.id) })
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-xs">{group.name} ({group.member_count})</span>
                              </label>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Creating...' : 'Create'}
                    </button>
                  </form>
                </div>
              )}

              <div className="p-4 flex-1 overflow-hidden">
                {projects.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">No projects yet.</p>
                ) : (
                  <div className="h-full overflow-y-auto space-y-3 pr-2">
                    {projects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow relative">
                        <button
                          onClick={() => setProjectToClose(project)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100"
                          title="Close project"
                        >
                          ×
                        </button>
                        
                        <button
                            onClick={() => router.push(`/tenant/projects/${project.id}`)}
                            className="font-semibold text-sm mb-2 pr-6 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left block"
                          >
                            {project.name}
                          </button>
                        {project.description && (
                          <p className="text-gray-600 mb-2 text-xs">{project.description}</p>
                        )}

                        {/* Project targeting display */}
                        <div className="mb-2 text-xs text-gray-500">
                          👥 {project.targeting_display || 'All Members'}
                        </div>
                        
                        {project.opportunities && project.opportunities.length > 0 ? (
                          <div className="mb-3">
                            <h4 className="text-xs font-medium text-gray-700 mb-1">Sign-Up Sheets:</h4>
                            <div className="space-y-1">
                              {project.opportunities.slice(0, 2).map((opportunity) => (
                                <div key={opportunity.id} className="bg-gray-50 rounded p-2">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <button
                                        onClick={() => {
                                          setManagingOpportunity(opportunity)
                                          loadOpportunitySignups(opportunity.id)
                                        }}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                                      >
                                        {opportunity.title}
                                      </button>
                                      {opportunity.date_scheduled && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          {new Date(opportunity.date_scheduled).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right ml-2">
                                      <div className="text-xs">
                                        <span className="text-green-600 font-medium">{opportunity.filled_count}</span>
                                        <span className="text-gray-500">/</span>
                                        <span className="text-gray-900">{opportunity.volunteers_needed}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {project.opportunities.length > 2 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{project.opportunities.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-3 text-xs text-gray-500">No Sign-up Sheets</div>
                        )}

                        <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-blue-900">Total Hours</span>
                            <span className="text-sm font-bold text-blue-900">
                              {project.total_hours?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setEditingProject(project)
                              setEditProjectForm({
                                name: project.name,
                                description: project.description,
                                goals: project.goals || '',
                                status: project.status,
                                target_groups: project.target_groups || [],
                                target_all_members: project.target_all_members !== false
                              })
                            }}
                            className="text-green-600 hover:text-green-800 font-medium cursor-pointer text-xs"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Polls Panel - Enhanced with Group Targeting */}
            <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-300px)]">
              <div className="px-6 py-4 border-b flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Polls ({polls.length})</h2>
                  <button
                    onClick={() => setShowPollForm(!showPollForm)}
                    className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    {showPollForm ? 'Hide' : 'Create'}
                  </button>
                </div>
              </div>

              {showPollForm && (
                <div className="p-4 border-b bg-gray-50 flex-shrink-0 max-h-96 overflow-y-auto">
                  <form onSubmit={createPoll} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Poll Title"
                        value={newPoll.title}
                        onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <textarea
                        placeholder="Question"
                        value={newPoll.question}
                        onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <select
                        value={newPoll.poll_type}
                        onChange={(e) => setNewPoll({ ...newPoll, poll_type: e.target.value as 'yes_no' | 'multiple_choice' })}
                        className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="yes_no">Yes/No</option>
                        <option value="multiple_choice">Multiple Choice</option>
                      </select>
                    </div>

                    {newPoll.poll_type === 'multiple_choice' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Options</label>
                        {newPoll.options.map((option, index) => (
                          <div key={index} className="flex gap-2 mb-1">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...newPoll.options]
                                newOptions[index] = e.target.value
                                setNewPoll({ ...newPoll, options: newOptions })
                              }}
                              className="flex-1 px-2 py-1 text-sm rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder={`Option ${index + 1}`}
                            />
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = newPoll.options.filter((_, i) => i !== index)
                                  setNewPoll({ ...newPoll, options: newOptions })
                                }}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}

                    {/* Group Targeting Section */}
                    <div className="border-t pt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-2">Target Audience</label>
                      
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={newPoll.target_all_members}
                            onChange={() => setNewPoll({ ...newPoll, target_all_members: true, target_groups: [] })}
                            className="mr-2"
                          />
                          <span className="text-sm">All Members ({members.length})</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={!newPoll.target_all_members}
                            onChange={() => setNewPoll({ ...newPoll, target_all_members: false })}
                            className="mr-2"
                          />
                          <span className="text-sm">Selected Groups</span>
                        </label>
                      </div>

                      {!newPoll.target_all_members && (
                        <div className="mt-2 max-h-32 overflow-y-auto border rounded p-2">
                          {groups.length === 0 ? (
                            <p className="text-xs text-gray-500">No groups available</p>
                          ) : (
                            groups.map(group => (
                              <label key={group.id} className="flex items-center mb-1">
                                <input
                                  type="checkbox"
                                  checked={newPoll.target_groups.includes(group.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewPoll({ ...newPoll, target_groups: [...newPoll.target_groups, group.id] })
                                    } else {
                                      setNewPoll({ ...newPoll, target_groups: newPoll.target_groups.filter(id => id !== group.id) })
                                    }
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-xs">{group.name} ({group.member_count})</span>
                              </label>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPoll.is_anonymous}
                        onChange={(e) => setNewPoll({ ...newPoll, is_anonymous: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-xs">Anonymous responses</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Creating...' : 'Create Poll'}
                    </button>
                  </form>
                </div>
              )}

              <div className="p-4 flex-1 overflow-hidden">
                {polls.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">No polls yet.</p>
                ) : (
                  <div className="h-full overflow-y-auto space-y-3 pr-2">
                    {polls.map((poll) => (
                      <div key={poll.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow relative">
                        <button
                          onClick={() => setPollToClose(poll)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100"
                          title="Close poll"
                        >
                          ×
                        </button>
                        
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 pr-6">
                            <button
                              onClick={() => {
                                setViewingPoll(poll)
                                loadPollResponses(poll.id)
                              }}
                              className="font-semibold text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                            >
                              {poll.title}
                            </button>
                            <p className="text-gray-600 mt-1 text-xs">{poll.question}</p>
                            
                            {/* Group targeting display */}
                            <div className="mt-1 text-xs text-gray-500">
                              {poll.target_all_members ? (
                                <span>📧 All Members</span>
                              ) : (
                                <span>📧 Groups: {getGroupNames(poll.target_groups).join(', ') || 'None selected'}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                poll.status === 'active' ? 'bg-green-100 text-green-800' :
                                poll.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {poll.status}
                              </span>
                              <span>{poll.total_responses} responses</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mb-2">
                          <button
                            onClick={() => sendPollEmails(poll.id)}
                            className="text-purple-600 hover:text-purple-800 font-medium cursor-pointer text-xs"
                          >
                            Email
                          </button>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-200 text-right">
                          <span className="text-xs text-gray-500">
                            {poll.last_emailed_at 
                              ? `Last: ${new Date(poll.last_emailed_at).toLocaleDateString()}`
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

            {/* Groups Panel */}
            <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-300px)]">
              <div className="px-6 py-4 border-b flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Groups ({groups.length})</h2>
                  <button
                    onClick={() => setShowGroupForm(!showGroupForm)}
                    className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    {showGroupForm ? 'Hide' : 'Create'}
                  </button>
                </div>
              </div>

              {showGroupForm && (
                <div className="p-4 border-b bg-gray-50 flex-shrink-0">
                  <form onSubmit={createGroup} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Group Name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Creating...' : 'Create Group'}
                    </button>
                  </form>
                </div>
              )}

              <div className="p-4 flex-1 overflow-hidden">
                {groups.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-sm">No groups yet.</p>
                ) : (
                  <div className="h-full overflow-y-auto space-y-3 pr-2">
                    {groups.map((group) => (
                      <div key={group.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow relative">
                        <button
                          onClick={() => setDeletingGroup(group)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100"
                          title="Delete group"
                        >
                          ×
                        </button>
                        
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 pr-6">
                            <button
                              onClick={() => {
                                setManagingGroupMembers(group)
                                loadGroupMemberships(group.id)
                              }}
                              className="font-semibold text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                            >
                              {group.name}
                            </button>
                            <div className="text-xs text-gray-500 mt-1">
                              {group.member_count} member{group.member_count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => setEditingGroup(group)}
                            className="text-green-600 hover:text-green-800 font-medium cursor-pointer text-xs"
                          >
                            Rename
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Members Panel - Enhanced with Group Display */}
            <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-300px)]">
              <div className="px-6 py-4 border-b flex-shrink-0">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">Members</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {filteredMembers.length} of {members.length}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowBulkAddModal(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer text-sm"
                      >
                        Bulk
                      </button>
                      <button
                        onClick={() => setShowMemberForm(!showMemberForm)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer text-sm"
                      >
                        {showMemberForm ? 'Hide' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => handleMemberSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>

              {showMemberForm && (
                <div className="p-4 border-b bg-gray-50 flex-shrink-0 max-h-72 overflow-y-auto">
                  <form onSubmit={addMember} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={newMember.firstName}
                        onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                        className="px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={newMember.lastName}
                        onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                        className="px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newMember.phoneNumber}
                        onChange={(e) => setNewMember({ ...newMember, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Adding...' : 'Add Member'}
                    </button>
                  </form>
                </div>
              )}

              <div className="p-4 flex-1 overflow-hidden">
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-8">
                    {memberSearch ? (
                      <p className="text-gray-500 text-sm">No members found matching "{memberSearch}"</p>
                    ) : (
                      <p className="text-gray-500 text-sm">No members yet.</p>
                    )}
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto space-y-3 pr-2">
                    {filteredMembers.map((member) => (
                      <div key={member.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow relative">
                          <button
                            onClick={() => setDeletingMember(member)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100"
                            title="Delete member"
                          >
                            ×
                          </button>
                          
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-6">
                              <div className="mb-1">
                                <button
                                  onClick={() => setEditingMember(member)}
                                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                  title="Click to edit member"
                                >
                                  {member.first_name} {member.last_name}
                                </button>
                              </div>
                              
                              <div className="text-xs text-gray-600 mb-1">
                                {member.email}
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-400">
                                  {member.role === 'tenant_admin' ? 'admin' : 'member'}
                                </span>
                                
                                {/* Resend Setup Email icon for admins */}
                                {member.role === 'tenant_admin' && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <button
                                      onClick={() => resendSetupEmail(member.email)}
                                      title="Resend password setup link to this admin"
                                      className="text-blue-600 hover:text-blue-800 cursor-pointer p-1 rounded hover:bg-blue-50 transition-colors"
                                    >
                                      <img 
                                        src="/mail-key.png" 
                                        alt="Resend setup" 
                                        className="w-4 h-4"
                                      />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                                            ))}
                                          </div>
                )}
              </div>
            </div>
          </div>

          {/* Group Management Modal */}
          {managingGroupMembers && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Manage Group: {managingGroupMembers.name}</h3>
                    <p className="text-gray-600 mt-1">{groupMemberships.length} members in this group</p>
                  </div>
                  <button
                    onClick={() => {
                      setManagingGroupMembers(null)
                      setGroupMemberships([])
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Add Member to Group */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Add Member to Group</h4>
                  <div className="flex gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addMemberToGroup(managingGroupMembers.id, e.target.value)
                          e.target.value = ''
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a member to add...</option>
                      {members
                        .filter(member => !groupMemberships.some(gm => gm.member_email === member.email))
                        .sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`))
                        .map((member) => (
                          <option key={member.id} value={member.email}>
                            {member.first_name} {member.last_name} ({member.email})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Current Group Members */}
                <div>
                  <h4 className="font-medium mb-3">Current Members</h4>
                  {groupMemberships.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No members in this group yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {groupMemberships.map((membership) => (
                        <div key={membership.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{membership.member_email}</div>
                            <div className="text-sm text-gray-500">
                              Added: {new Date(membership.added_at).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => removeMemberFromGroup(membership.id, managingGroupMembers.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Edit Group Modal */}
          {editingGroup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Rename Group</h3>
                
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  updateGroup(formData.get('name') as string)
                }} className="space-y-4">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Group Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingGroup.name}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingGroup(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Group Confirmation Modal */}
          {deletingGroup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Delete Group</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the group <strong>"{deletingGroup.name}"</strong>? 
                  This will remove all member assignments to this group. This action cannot be undone.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeletingGroup(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteGroup}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete Group'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* All other existing modals remain the same... */}
          {/* Signup Management Modal */}
          {managingOpportunity && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">{managingOpportunity.title}</h3>
                    {managingOpportunity.description && (
                      <p className="text-gray-600 mt-1">{managingOpportunity.description}</p>
                    )}
                    {managingOpportunity.date_scheduled && (
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(managingOpportunity.date_scheduled).toLocaleDateString()}
                        {managingOpportunity.time_start && ` at ${managingOpportunity.time_start}`}
                        {managingOpportunity.location && ` • ${managingOpportunity.location}`}
                      </p>
                    )}
                    <div className="mt-2 text-sm">
                      <span className="text-green-600 font-medium">{managingOpportunity.filled_count}</span>
                      <span className="text-gray-500"> / </span>
                      <span className="text-gray-900">{managingOpportunity.volunteers_needed}</span>
                      <span className="text-gray-500"> volunteers signed up</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setManagingOpportunity(null)
                      setOpportunitySignups([])
                      setShowAddSignupForm(false)
                      setSelectedMember(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Add Signup Form */}
                {!showAddSignupForm ? (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowAddSignupForm(true)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      + Member
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">Signing Up...</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Member
                        </label>
                        <select
                          value={selectedMember?.id || ''}
                          onChange={(e) => {
                            const member = members.find(m => m.id === e.target.value)
                            setSelectedMember(member || null)
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Choose a member...</option>
                          {members
                            .sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`))
                            .map((member) => {
                              const isAlreadySignedUp = opportunitySignups.some(signup => signup.member_email === member.email)
                              return (
                                <option 
                                  key={member.id} 
                                  value={member.id}
                                  disabled={isAlreadySignedUp}
                                  style={isAlreadySignedUp ? { color: '#9CA3AF', fontStyle: 'italic' } : {}}
                                >
                                  {member.first_name} {member.last_name} ({member.email})
                                  {isAlreadySignedUp ? ' - Already signed up' : ''}
                                </option>
                              )
                            })}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (selectedMember) {
                              addManualSignup(managingOpportunity, selectedMember)
                            }
                          }}
                          disabled={!selectedMember || loading}
                          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading ? 'Adding...' : 'Add Signup'}
                        </button>
                        <button
                          onClick={() => {
                            setShowAddSignupForm(false)
                            setSelectedMember(null)
                          }}
                          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Signups */}
                <div>
                  <h4 className="font-medium mb-3">Current Signups ({opportunitySignups.length})</h4>
                  {opportunitySignups.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No signups yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {opportunitySignups.map((signup) => (
                        <div key={signup.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium">{signup.member_name}</div>
                              <div className="text-sm text-gray-600">{signup.member_email}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Signed up: {new Date(signup.signed_up_at).toLocaleString()}
                              </div>
                            </div>
                            <button
                              onClick={() => setSignupToDelete(signup)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Remove Signup Confirmation Modal */}
          {signupToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Remove Signup</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove <strong>{signupToDelete.member_name}</strong> from this signup sheet?
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSignupToDelete(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={removeSignup}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Removing...' : 'Remove Signup'}
                  </button>
                </div>
              </div>
            </div>
          )}

          
          {/* Complete Edit Member Modal */}
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
                      {editingMember.role === 'member' ? (
                        <div className="mt-1 space-y-2">
                          <select
                            name="role"
                            defaultValue={editingMember.role}
                            onChange={(e) => {
                              if (e.target.value === 'tenant_admin') {
                                // Start elevation process
                                setElevatingMember(editingMember)
                                setShowElevationConfirm(true)
                                setElevationStep('confirm')
                                // Reset the select back to member
                                e.target.value = 'member'
                              }
                            }}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="member">Member</option>
                            <option value="tenant_admin">Admin</option>
                          </select>
                          <p className="text-xs text-gray-500">
                            Note: Elevating to admin requires additional confirmation steps
                          </p>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <div className="px-3 py-2 bg-orange-50 border border-orange-200 rounded-md">
                            <div className="flex items-center justify-between">
                              <span className="text-orange-800 font-medium">Administrator</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Are you sure you want to remove admin privileges from this user? They will become a regular member and lose access to all administrative functions.')) {
                                    // Handle role downgrade
                                    const updatedData = {
                                      firstName: editingMember.first_name,
                                      lastName: editingMember.last_name,
                                      email: editingMember.email,
                                      phoneNumber: editingMember.phone_number || '',
                                      position: editingMember.position || '',
                                      address: editingMember.address || '',
                                      role: 'member'
                                    }
                                    updateMember(updatedData)
                                  }
                                }}
                                className="text-xs text-red-600 hover:text-red-800 underline font-medium"
                              >
                                Remove Admin Rights
                              </button>
                            </div>
                            <p className="text-xs text-orange-600 mt-1">
                              This user has full administrative access to the organization
                            </p>
                          </div>
                          {/* Hidden input to maintain current role */}
                          <input type="hidden" name="role" value={editingMember.role} />
                        </div>
                      )}
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
                  
                  <div className="flex justify-end space-x-3 pt-4">
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

          {/* Member Elevation Confirmation Modal */}
          {showElevationConfirm && elevatingMember && elevationStep === 'confirm' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-red-600 mb-4">⚠️ Elevate Member to Administrator</h3>
                <p className="text-gray-700 mb-4">
                  You are about to give <strong>{elevatingMember.first_name} {elevatingMember.last_name}</strong> full administrative privileges.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
                  <h4 className="font-medium text-red-800 mb-2">This will give them the ability to:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Add, edit, and delete all members</li>
                    <li>• Create and manage all projects</li>
                    <li>• Send emails to all members</li>
                    <li>• Elevate other members to admin</li>
                    <li>• Access all organization data</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowElevationConfirm(false)
                      setElevatingMember(null)
                      setElevationStep('confirm')
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowElevationConfirm(false)
                      setShowElevationNotification(true)
                      setElevationStep('notify')
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Continue with Elevation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Member Elevation Notification Modal */}
          {showElevationNotification && elevatingMember && elevationStep === 'notify' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-4">Notify New Administrator</h3>
                <p className="text-gray-600 mb-4">
                  Would you like to send <strong>{elevatingMember.first_name} {elevatingMember.last_name}</strong> a notification about their new admin role?
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Message (Optional)
                  </label>
                  <textarea
                    value={elevationCustomMessage}
                    onChange={(e) => setElevationCustomMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a personal message that will be included in the notification email..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This message will appear above the standard notification text.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> They will automatically receive a separate email with instructions to set up their admin password.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      elevateMemberToAdmin(elevatingMember, false)
                    }}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Skip Notification
                  </button>
                  <button
                    onClick={() => {
                      elevateMemberToAdmin(elevatingMember, true, elevationCustomMessage)
                    }}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Notification & Elevate'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Member Elevation Complete Modal */}
          {elevatingMember && elevationStep === 'complete' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Member Elevated Successfully!</h3>
                  <p className="text-gray-600 mb-6">{message}</p>
                  
                  <button
                    onClick={() => {
                      setElevatingMember(null)
                      setShowElevationNotification(false)
                      setElevationStep('confirm')
                      setElevationCustomMessage('')
                      setEditingMember(null)
                      setMessage('')
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    Done
                  </button>
                </div>
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
                  updateProject(editProjectForm)
                }} className="space-y-4">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project Name *</label>
                    <input
                      type="text"
                      value={editProjectForm.name}
                      onChange={(e) => setEditProjectForm({ ...editProjectForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={3}
                      value={editProjectForm.description}
                      onChange={(e) => setEditProjectForm({ ...editProjectForm, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Goals & Objectives</label>
                    <textarea
                      rows={3}
                      value={editProjectForm.goals}
                      onChange={(e) => setEditProjectForm({ ...editProjectForm, goals: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="What are the main goals and expected outcomes?"
                    />
                  </div>

                  {/* Group Targeting Section */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Target Audience</label>
                    
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={editProjectForm.target_all_members}
                          onChange={() => setEditProjectForm({ ...editProjectForm, target_all_members: true, target_groups: [] })}
                          className="mr-2"
                        />
                        <span className="text-sm">All Members ({members.length})</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={!editProjectForm.target_all_members}
                          onChange={() => setEditProjectForm({ ...editProjectForm, target_all_members: false })}
                          className="mr-2"
                        />
                        <span className="text-sm">Selected Groups</span>
                      </label>
                    </div>

                    {!editProjectForm.target_all_members && (
                      <div className="mt-3 max-h-32 overflow-y-auto border rounded p-3">
                        {groups.length === 0 ? (
                          <p className="text-sm text-gray-500">No groups available</p>
                        ) : (
                          groups.map(group => (
                            <label key={group.id} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                checked={editProjectForm.target_groups.includes(group.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditProjectForm({ 
                                      ...editProjectForm, 
                                      target_groups: [...editProjectForm.target_groups, group.id] 
                                    })
                                  } else {
                                    setEditProjectForm({ 
                                      ...editProjectForm, 
                                      target_groups: editProjectForm.target_groups.filter(id => id !== group.id) 
                                    })
                                  }
                                }}
                                className="mr-2"
                              />
                              <span className="text-sm">{group.name} ({group.member_count})</span>
                            </label>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={editProjectForm.status}
                      onChange={(e) => setEditProjectForm({ ...editProjectForm, status: e.target.value as 'active' | 'closed' | 'on_hold' })}
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

          {/* Close Poll Confirmation Modal */}
          {pollToClose && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Close Poll</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to close <strong>"{pollToClose.title}"</strong>? 
                  This will remove it from the active polls list and stop accepting new responses.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setPollToClose(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={closePoll}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Closing...' : 'Close Poll'}
                  </button>
                </div>
              </div>
            </div>
          )}

         {/* Poll Results Modal */}
          {viewingPoll && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-screen overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">{viewingPoll.title}</h3>
                    <p className="text-gray-600 mt-1">{viewingPoll.question}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        viewingPoll.status === 'active' ? 'bg-green-100 text-green-800' :
                        viewingPoll.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {viewingPoll.status}
                      </span>
                      <span>{viewingPoll.poll_type === 'yes_no' ? 'Yes/No' : 'Multiple Choice'}</span>
                      {viewingPoll.is_anonymous && <span>Anonymous</span>}
                      <span>{pollResponses.length} total responses</span>
                      <span>
                        Target: {viewingPoll.target_all_members ? 'All Members' : `Groups: ${getGroupNames(viewingPoll.target_groups).join(', ')}`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setViewingPoll(null)
                      setPollResponses([])
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Response Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Response Summary</h4>
                  {viewingPoll.poll_type === 'yes_no' ? (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {pollResponses.filter(r => r.response.toLowerCase() === 'yes').length}
                        </div>
                        <div className="text-sm text-gray-600">Yes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {pollResponses.filter(r => r.response.toLowerCase() === 'no').length}
                        </div>
                        <div className="text-sm text-gray-600">No</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-600">
                          {pollResponses.filter(r => !r.response || r.response.trim() === '').length}
                        </div>
                        <div className="text-sm text-gray-600">No Response</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {viewingPoll.options?.map((option, index) => {
                        const count = pollResponses.filter(r => r.response === option).length
                        const percentage = pollResponses.length > 0 ? (count / pollResponses.length * 100).toFixed(1) : '0'
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{option}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-12 text-right">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                      <div className="flex items-center justify-between border-t pt-2">
                        <span className="text-sm text-gray-600">No Response</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gray-600 h-2 rounded-full"
                              style={{ 
                                width: `${pollResponses.length > 0 ? (pollResponses.filter(r => !r.response || r.response.trim() === '').length / pollResponses.length * 100) : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {pollResponses.filter(r => !r.response || r.response.trim() === '').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Individual Responses */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Individual Responses</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAllResponses(!showAllResponses)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {showAllResponses ? 'Show Responded Only' : 'Show All Members'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {(showAllResponses ? pollResponses : pollResponses.filter(r => r.response && r.response.trim() !== ''))
                      .sort((a, b) => {
                        // Sort by response status, then by name
                        if (a.response && !b.response) return -1
                        if (!a.response && b.response) return 1
                        return a.member_name.localeCompare(b.member_name)
                      })
                      .map((response) => (
                        <div key={response.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium">{response.member_name}</div>
                              {!viewingPoll.is_anonymous && (
                                <div className="text-sm text-gray-600">{response.member_email}</div>
                              )}
                              <div className="mt-2">
                                {response.response ? (
                                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                    response.response.toLowerCase() === 'yes' ? 'bg-green-100 text-green-800' :
                                    response.response.toLowerCase() === 'no' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {response.response}
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                    No Response
                                  </span>
                                )}
                              </div>
                              {response.responded_at && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Responded: {new Date(response.responded_at).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingResponse(response)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                {response.response ? 'Edit' : 'Add Response'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Poll Response Modal */}
          {editingResponse && viewingPoll && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                  {editingResponse.response ? 'Edit Response' : 'Add Response'}
                </h3>
                <p className="text-gray-600 mb-4">
                  <strong>{editingResponse.member_name}</strong>
                </p>
                <p className="text-sm text-gray-600 mb-4">{viewingPoll.question}</p>
                
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  const response = formData.get('response') as string
                  updatePollResponse(editingResponse.id, response)
                }} className="space-y-4">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Response</label>
                    {viewingPoll.poll_type === 'yes_no' ? (
                      <select
                        name="response"
                        defaultValue={editingResponse.response || ''}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select response...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      <select
                        name="response"
                        defaultValue={editingResponse.response || ''}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select response...</option>
                        {viewingPoll.options?.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
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
                      {loading ? 'Saving...' : (editingResponse.response ? 'Update Response' : 'Add Response')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Bulk Add Members Modal */}
          {showBulkAddModal && tenantInfo && (
            <BulkAddMembersModal
              tenantId={tenantInfo.id}
              onClose={() => setShowBulkAddModal(false)}
              onMembersAdded={loadTenantData}
            />
          )}
        </div>
      </div>
    </>
  )
}