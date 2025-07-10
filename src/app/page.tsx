'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()
  const [showAdminSignIn, setShowAdminSignIn] = useState(false)
  const [showMemberAccess, setShowMemberAccess] = useState(false)
  const [memberEmail, setMemberEmail] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [organizations, setOrganizations] = useState<{tenant_id: string, tenant_name: string}[]>([])
  const [showOrgSelection, setShowOrgSelection] = useState(false)
  const [adminOrganizations, setAdminOrganizations] = useState<{tenant_id: string, tenant_name: string, role: string}[]>([])
  const [showAdminOrgSelection, setShowAdminOrgSelection] = useState(false)
  const [adminUserType, setAdminUserType] = useState<'tenant_admin' | 'super_admin'>('tenant_admin')

  const handleMemberAccess = async () => {
    if (!memberEmail.trim()) {
      setMessage('Please enter your email address')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/member-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: memberEmail })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Failed to process request')
        return
      }

      if (data.requiresOrgSelection) {
        setOrganizations(data.organizations)
        setShowOrgSelection(true)
        setMessage('')
      } else if (data.success) {
        setMessage(data.message)
        setShowSuccessMessage(true)
        setMemberEmail('')
      }

    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOrgSelection = async (tenantId: string) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/member-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: memberEmail, selectedTenantId: tenantId })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Failed to process request')
        return
      }

      if (data.success) {
        setMessage(data.message)
        setMemberEmail('')
        setShowOrgSelection(false)
        setOrganizations([])
        setShowSuccessMessage(true)
      }

    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetMemberAccess = () => {
    setShowMemberAccess(false)
    setMemberEmail('')
    setMessage('')
    setOrganizations([])
    setShowOrgSelection(false)
    setShowSuccessMessage(false)
    setLoading(false)
  }

  const handleAdminSignIn = async () => {
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setMessage('Please enter both email and password')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: adminEmail, 
          password: adminPassword 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Sign-in failed')
        return
      }

      if (data.requiresOrgSelection) {
        setAdminOrganizations(data.organizations)
        setAdminUserType(data.userType)
        setShowAdminOrgSelection(true)
        setMessage('')
      } else if (data.success) {
        setMessage(`Welcome! Redirecting to ${data.organizationName} dashboard...`)
        // Clear form
        setAdminEmail('')
        setAdminPassword('')
        // Redirect to tenant dashboard
        setTimeout(() => {
          router.push(data.redirectTo)
        }, 1500)
      }

    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminOrgSelection = async (tenantId: string) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: adminEmail, 
          password: adminPassword,
          selectedTenantId: tenantId 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Failed to access organization')
        return
      }

      if (data.success) {
        setMessage(`Welcome! Redirecting to ${data.organizationName} dashboard...`)
        setAdminEmail('')
        setAdminPassword('')
        setShowAdminOrgSelection(false)
        setAdminOrganizations([])
        // Redirect to tenant dashboard
        setTimeout(() => {
          router.push(data.redirectTo)
        }, 1500)
      }

    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetAdminSignIn = () => {
    setShowAdminSignIn(false)
    setAdminEmail('')
    setAdminPassword('')
    setMessage('')
    setAdminOrganizations([])
    setShowAdminOrgSelection(false)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Logo */}
              <Image
                src="/voluntold-logo.png" // You'll need to place the logo file in the public folder
                alt="Voluntold"
                width={200}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </div>
            <nav className="flex space-x-6">
              <button
                onClick={() => setShowAdminSignIn(true)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Admin Sign In
              </button>
              <button
                onClick={() => setShowMemberAccess(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
              >
                Member Access
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Message Display */}
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">{message}</p>
          </div>
        )}
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Volunteer Management
            <span className="text-blue-600"> Made Simple</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
            Streamline your organization's volunteer coordination with our comprehensive platform. 
            Manage projects, schedule opportunities, and keep your team connected.
          </p>
          
          {/* Marketing Content Placeholder */}
          <div className="mt-12 p-8 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Marketing Content Placeholder</h3>
            <p className="text-blue-700">
              This section is ready for your marketing content, features overview, testimonials, or any other promotional material.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setShowAdminSignIn(true)}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-md hover:bg-blue-50 font-semibold text-lg transition-colors"
            >
              Organization Admin Sign In
            </button>
            <button
              onClick={() => setShowMemberAccess(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-semibold text-lg transition-colors"
            >
              Member Portal Access
            </button>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Management</h3>
            <p className="text-gray-600">Organize volunteer opportunities by project with clear goals and tracking.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Coordination</h3>
            <p className="text-gray-600">Send professional volunteer requests with personalized signup links.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Member Portal</h3>
            <p className="text-gray-600">Give volunteers easy access to their schedules and organization information.</p>
          </div>
        </div>
      </main>

      {/* Admin Sign In Modal */}
      {showAdminSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {showAdminOrgSelection ? 'Select Organization' : 'Admin Sign In'}
              </h3>
              <button
                onClick={resetAdminSignIn}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            
            {!showAdminOrgSelection ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !adminPassword ? document.getElementById('admin-password')?.focus() : e.key === 'Enter' && handleAdminSignIn()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="admin@organization.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminSignIn()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={resetAdminSignIn}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdminSignIn}
                    disabled={loading || !adminEmail.trim() || !adminPassword.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  {adminUserType === 'super_admin' 
                    ? 'Please select which organization you\'d like to manage:' 
                    : 'You have admin access to multiple organizations. Please select one:'
                  }
                </p>
                
                <div className="space-y-3 mb-4">
                  {adminOrganizations.map((org) => (
                    <button
                      key={org.tenant_id}
                      onClick={() => handleAdminOrgSelection(org.tenant_id)}
                      disabled={loading}
                      className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{org.tenant_name}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {org.role.replace('_', ' ')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAdminOrgSelection(false)
                      setAdminOrganizations([])
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    Back
                  </button>
                </div>

                {loading && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-sm text-gray-600">Signing in...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Member Access Modal */}
      {showMemberAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {showSuccessMessage ? 'Check Your Email' : 
                 showOrgSelection ? 'Select Organization' : 'Member Portal Access'}
              </h3>
              <button
                onClick={resetMemberAccess}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            
            {showSuccessMessage ? (
              <>
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Access Link Sent!</h4>
                  <p className="text-gray-600 mb-6">{message}</p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={resetMemberAccess}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    Done
                  </button>
                </div>
              </>
            ) :  !showOrgSelection ? (
              <>
                <p className="text-gray-600 mb-4">
                  Enter your email address to access your member portal. We'll send you a secure access link.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleMemberAccess()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="member@email.com"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={resetMemberAccess}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleMemberAccess}
                      disabled={loading || !memberEmail.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send Access Link'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  You're a member of multiple organizations. Please select which one you'd like to access:
                </p>
                
                <div className="space-y-3 mb-4">
                  {organizations.map((org) => (
                    <button
                      key={org.tenant_id}
                      onClick={() => handleOrgSelection(org.tenant_id)}
                      disabled={loading}
                      className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div className="font-medium">{org.tenant_name}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowOrgSelection(false)
                      setOrganizations([])
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    Back
                  </button>
                </div>

                {loading && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-sm text-gray-600">Sending access link...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}