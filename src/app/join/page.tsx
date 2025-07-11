// File: src/app/join/page.tsx
// Version: 1.0 - Organization sign-up form for beta program

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function OrganizationSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    clubName: '',
    description: '',
    memberCount: '',
    community: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/organization-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      // Show success message
      setShowSuccess(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        clubName: '',
        description: '',
        memberCount: '',
        community: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      // You might want to show an error message to the user here
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setShowSuccess(false)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
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
              
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Thanks. We will get back to you shortly.
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Return to Home
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 font-medium transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </main>
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
            
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome to Voluntold
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Voluntold is currently in beta and therefore free to use for select non-profit service organizations and other community groups. Please tell us about your club and we will get you set up. All fields required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email: <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone: <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="(555) 123-4567"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-2">
                Club/Group Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clubName"
                name="clubName"
                value={formData.clubName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Tell us a bit about your club/group and projects you're trying to manage: <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your organization's mission, activities, and the types of volunteer projects you coordinate..."
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="memberCount" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Members: <span className="text-red-500">*</span>
              </label>
              <select
                id="memberCount"
                name="memberCount"
                value={formData.memberCount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              >
                <option value="">Select member count</option>
                <option value="1-10">1-10 members</option>
                <option value="11-25">11-25 members</option>
                <option value="26-50">26-50 members</option>
                <option value="51-100">51-100 members</option>
                <option value="101-250">101-250 members</option>
                <option value="251+">251+ members</option>
              </select>
            </div>

            <div>
              <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-2">
                Community Served: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="community"
                name="community"
                value={formData.community}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Toronto, Ontario or Greater Seattle Area"
                required
                disabled={loading}
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Questions about the beta program?{' '}
              <a href="mailto:support@voluntold.com" className="text-blue-600 hover:text-blue-500">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}