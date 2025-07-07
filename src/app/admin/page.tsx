'use client'

import Header from '../../components/Header'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface Tenant {
  id: string
  name: string
  slug: string
}

export default function AdminPage() {
  const [tenantName, setTenantName] = useState('')
  const [tenantSlug, setTenantSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Tenant admin creation
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminFirstName, setAdminFirstName] = useState('')
  const [adminLastName, setAdminLastName] = useState('')
  const [selectedTenant, setSelectedTenant] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  // Load tenants on component mount
  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('name')

      if (error) throw error
      setTenants(data || [])
    } catch (error: any) {
      console.error('Error loading tenants:', error)
    }
  }

  const createTenant = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert([
          { name: tenantName, slug: tenantSlug }
        ])
        .select()

      if (error) throw error

      setMessage(`Tenant "${tenantName}" created successfully!`)
      setTenantName('')
      setTenantSlug('')
      loadTenants() // Refresh the tenant list
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createTenantAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdminLoading(true)
    setMessage('')

    try {
      // Create the auth user
      const { data, error } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
      })

      if (error) throw error

      if (data.user) {
        // Create the user profile as tenant admin
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              first_name: adminFirstName,
              last_name: adminLastName,
              role: 'tenant_admin',
              tenant_id: selectedTenant
            }
          ])

        if (profileError) throw profileError

        const selectedTenantName = tenants.find(t => t.id === selectedTenant)?.name
        setMessage(`Tenant admin ${adminFirstName} ${adminLastName} created for ${selectedTenantName}!`)
        
        // Reset form
        setAdminEmail('')
        setAdminPassword('')
        setAdminFirstName('')
        setAdminLastName('')
        setSelectedTenant('')
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setAdminLoading(false)
    }
  }

  return (
    <>
      <Header />
      
      <div className="max-w-4xl mx-auto mt-8 p-6 space-y-8">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>

        {/* Create Tenant Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Organization</h2>
          
          <form onSubmit={createTenant} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., First Baptist Church"
                  required
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  URL Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., first-baptist"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </form>
        </div>

        {/* Create Tenant Admin Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create Tenant Administrator</h2>
          
          <form onSubmit={createTenantAdmin} className="space-y-4">
            <div>
              <label htmlFor="tenant" className="block text-sm font-medium text-gray-700">
                Assign to Organization
              </label>
              <select
                id="tenant"
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Choose an organization...</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label htmlFor="adminFirstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="adminFirstName"
                  value={adminFirstName}
                  onChange={(e) => setAdminFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="adminLastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="adminLastName"
                  value={adminLastName}
                  onChange={(e) => setAdminLastName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adminLoading || !selectedTenant}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {adminLoading ? 'Creating...' : 'Create Tenant Admin'}
            </button>
          </form>
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