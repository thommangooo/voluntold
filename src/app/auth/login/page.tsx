// File: src/app/auth/login/page.tsx
// Version: 5.0 - Updated to handle context from home page

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get context from URL parameters
  const urlEmail = searchParams.get('email') || ''
  const accessType = searchParams.get('accessType') || ''
  const orgId = searchParams.get('org') || ''
  const orgName = searchParams.get('orgName') || ''

  // Pre-populate email from URL
  useEffect(() => {
    if (urlEmail) {
      setEmail(urlEmail)
    }
  }, [urlEmail])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Route based on the context passed from home page
      if (accessType === 'super_admin') {
        console.log('🚀 Routing super admin to /admin')
        router.push('/admin')
      } else if (accessType === 'tenant_admin') {
        console.log('🚀 Routing tenant admin to /tenant', { orgId, hasOrgId: !!orgId })
        
        // Add a small delay to ensure session is established
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Pass org context if available to avoid setup redirects
        if (orgId) {
          router.push(`/tenant?org=${orgId}`)
        } else {
          router.push('/tenant')
        }
      } else {
        // Fallback: Check user role in database (original logic)
        console.log('🚀 Using fallback routing - checking database role')
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, tenant_id')
          .eq('id', data.user.id)
          .single()

        if (profile?.role === 'super_admin') {
          router.push('/admin')
        } else if (profile?.role === 'tenant_admin') {
          // Use orgId from URL if available, otherwise use tenant_id from profile
          const targetOrg = orgId || profile.tenant_id
          router.push(`/tenant${targetOrg ? `?org=${targetOrg}` : ''}`)
        } else {
          setMessage('You do not have admin permissions.')
          await supabase.auth.signOut()
        }
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Determine what context to show
  const getContextDisplay = () => {
    if (accessType === 'super_admin') {
      return {
        title: 'Super Admin Login',
        subtitle: 'Sign in with full system access',
        contextInfo: 'You are signing in as a Super Administrator'
      }
    } else if (accessType === 'tenant_admin' && orgName) {
      return {
        title: 'Admin Login',
        subtitle: `Sign in to manage ${orgName}`,
        contextInfo: `You are signing in as an Administrator for ${orgName}`
      }
    } else {
      return {
        title: 'Admin Login',
        subtitle: 'Sign in to manage your organization',
        contextInfo: null
      }
    }
  }

  const contextDisplay = getContextDisplay()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Logo */}
              <button onClick={() => router.push('/')} className="cursor-pointer">
                <Image
                  src="/voluntold-logo.png"
                  alt="Voluntold"
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                  priority
                />
              </button>
            </div>
            
            {/* Home Link */}
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Login Content with Context */}
      <div className="flex items-center justify-center py-16">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {contextDisplay.title}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {contextDisplay.subtitle}
            </p>
            
            {/* Context Information */}
            {contextDisplay.contextInfo && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-center text-sm text-blue-800">
                  {contextDisplay.contextInfo}
                </p>
              </div>
            )}
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {message}
              </div>
            )}
          </form>


        </div>
      </div>
    </div>
  )

  
}