'use client'

import Header from '../../components/Header'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

interface Member {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  created_at: string
}

interface Project {
  id: string
  name: string
  description: string
  created_at: string
  created_by: string
}

interface TenantInfo {
  id: string
  name: string
  slug: string
}

export default function TenantAdminPage() {
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [projectLoading, setProjectLoading] = useState(false)
  const [message, setMessage] = useState('')

  // New member form
  const [newMember, setNewMember] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'member'
  })

  // New project form
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  })

  // Load tenant info and data on component mount
  const loadTenantInfo = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('tenant_id')
        .eq('id', session.user.id)
        .single()

      if (profileError) throw profileError
      
      if (profile?.tenant_id) {
        const { data: tenant, error: tenantError } = await supabase
          .from('tenants')
          .select('id, name, slug')
          .eq('id', profile.tenant_id)
          .single()

        if (tenantError) throw tenantError
        
        setTenantInfo(tenant)
        loadMembers(profile.tenant_id)
        loadProjects(profile.tenant_id)
      }
    } catch (error) {
      setMessage(`Error loading tenant info: ${(error as Error).message}`)
    }
  }, [])

  useEffect(() => {
    loadTenantInfo()
  }, [loadTenantInfo])

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

  const loadProjects = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      setMessage(`Error loading projects: ${(error as Error).message}`)
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
            role: newMember.role,
          }
        ])

      if (error) throw error

      setMessage(`Member ${newMember.firstName} ${newMember.lastName} added successfully!`)
      setNewMember({ email: '', firstName: '', lastName: '', role: 'member' })
      loadMembers(tenantInfo.id)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenantInfo) return

    setProjectLoading(true)
    setMessage('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('projects')
        .insert([
          {
            tenant_id: tenantInfo.id,
            name: newProject.name,
            description: newProject.description,
            created_by: session.user.id
          }
        ])

      if (error) throw error

      setMessage(`Project "${newProject.name}" created successfully!`)
      setNewProject({ name: '', description: '' })
      loadProjects(tenantInfo.id)
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`)
    } finally {
      setProjectLoading(false)
    }
  }

  if (!tenantInfo) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto mt-8 p-6">
          <div className="text-center">Loading your organization...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      
      <div className="max-w-6xl mx-auto mt-8 p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
          <p className="text-gray-600">{tenantInfo.name}</p>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
          </div>
          
          {/* Add New Project Form */}
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Create New Project</h3>
            
            <form onSubmit={addProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="e.g., 2025 Craft Show"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    id="projectDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Brief description of the project"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={projectLoading}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {projectLoading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="p-6 text-gray-500 text-center">
              No projects yet. Create your first project above!
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-lg mb-2">{project.name}</h4>
                    {project.description && (
                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                    )}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Manage →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Members Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Members ({members.length})</h2>
          </div>

          {/* Add New Member Form */}
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Add New Member</h3>
            
            <form onSubmit={addMember} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
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
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
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
                  Last Name
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

              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>

          {/* Members List */}
          {members.length === 0 ? (
            <div className="p-6 text-gray-500 text-center">
              No members yet. Add the first member above!
            </div>
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
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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