// File: src/app/auth/set-password/[token]/page.tsx
// Version: v1 - Password setup/reset page for admin users

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface UserInfo {
  email: string
  firstName: string
  lastName: string
  role: string
}

interface TokenValidation {
  valid: boolean
  user?: UserInfo
  tokenType?: 'password_reset' | 'new_admin_setup'
  expiresAt?: string
  error?: string
}

export default function SetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [message, setMessage] = useState('')
  const [tokenValidation, setTokenValidation] = useState<TokenValidation | null>(null)
  const [token, setToken] = useState<string>('')
  const router = useRouter()

  // Validate token on component mount
  useEffect(() => {
    const initializeToken = async () => {
      const resolvedParams = await params
      setToken(resolvedParams.token)
      validateToken(resolvedParams.token)
    }
    initializeToken()
  }, [params])

  const validateToken = async (tokenValue: string) => {
    try {
      setValidating(true)
      const response = await fetch(`/api/validate-reset-token/${tokenValue}`)
      const data = await response.json()

      if (!response.ok) {
        setTokenValidation({ valid: false, error: data.error })
      } else {
        setTokenValidation(data)
      }
    } catch (error) {
      setTokenValidation({ 
        valid: false, 
        error: 'Failed to validate reset link. Please try again.' 
      })
    } finally {
      setValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    // Validation
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Failed to set password')
        return
      }

      // Success! Show success message then redirect to login
      setMessage(data.message)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(`/auth/login?email=${encodeURIComponent(tokenValidation?.user?.email || '')}`)
      }, 3000)

    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (validating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating your reset link...</p>
        </div>
      </div>
    )
  }

  // Invalid token state
  if (!tokenValidation?.valid) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
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
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center py-16">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h1>
              <p className="text-gray-600 mb-6">
                {tokenValidation?.error || 'This password reset link is invalid or has expired.'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
                >
                  Go to Sign In
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 font-medium"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state (after password set)
  if (message && message.includes('successfully')) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
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
          </div>
        </header>

        <div className="flex items-center justify-center py-16">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {tokenValidation.tokenType === 'new_admin_setup' ? 'Account Setup Complete!' : 'Password Reset Complete!'}
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500 mb-6">You will be redirected to the sign-in page in a few seconds...</p>
              <button
                onClick={() => router.push(`/auth/login?email=${encodeURIComponent(tokenValidation.user?.email || '')}`)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
              >
                Sign In Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Password setup form
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
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
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Password Form */}
      <div className="flex items-center justify-center py-16">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {tokenValidation.tokenType === 'new_admin_setup' ? 'Set Up Your Account' : 'Reset Your Password'}
              </h1>
              <p className="text-gray-600">
                {tokenValidation.tokenType === 'new_admin_setup' 
                  ? `Welcome ${tokenValidation.user?.firstName}! Please set your password to complete your admin account setup.`
                  : `Hello ${tokenValidation.user?.firstName}! Please enter your new password below.`
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your new password"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your new password"
                  required
                  minLength={8}
                />
              </div>

              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  message.includes('successfully') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 font-medium"
              >
                {loading ? 'Setting Password...' : (
                  tokenValidation.tokenType === 'new_admin_setup' ? 'Complete Setup' : 'Reset Password'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Link expires: {tokenValidation.expiresAt ? new Date(tokenValidation.expiresAt).toLocaleString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}