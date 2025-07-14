// File: src/app/HomePageClient.tsx
// Version: v35 - Client component with all interactive functionality

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface AccessOption {
  id: string; // 'super_admin' or tenant_id
  name: string; // Display name
  accessType: 'super_admin' | 'tenant_admin' | 'member';
  tenantId?: string; // Only for tenant-specific access
  organizationName?: string; // Only for tenant-specific access
}

interface UserRoleInfo {
  hasAdminAccess: boolean;
  hasMemberAccess: boolean;
  accessOptions: AccessOption[];
  totalOptions: number;
}

export default function HomePageClient() {
  const router = useRouter()
  const [showSignIn, setShowSignIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedOrgId, setSelectedOrgId] = useState('')
  const [loading, setLoading] = useState(false)
  const [orgSelectionLoading, setOrgSelectionLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [currentStep, setCurrentStep] = useState<'email' | 'org-selection' | 'magic-link-sent'>('email')
  const [userRoleInfo, setUserRoleInfo] = useState<UserRoleInfo | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/check-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check user information');
      }

      setUserRoleInfo(data);

      // If user has no access at all, show generic success for privacy
      if (data.totalOptions === 0) {
        setCurrentStep('magic-link-sent');
        return;
      }

      // If user has multiple access options, show selection
      if (data.totalOptions > 1) {
        setCurrentStep('org-selection');
      } else {
        // Single access option - auto-route based on type
        const singleOption = data.accessOptions[0];
        
        if (singleOption.accessType === 'super_admin' || singleOption.accessType === 'tenant_admin') {
          // Admin access - redirect to auth page
          await redirectToAuthPage(singleOption);
        } else {
          // Member access - send magic link
          await sendMagicLink(singleOption.tenantId!);
        }
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOrgSelection = async (accessOption: AccessOption) => {
    setOrgSelectionLoading(true);
    
    if (accessOption.accessType === 'super_admin' || accessOption.accessType === 'tenant_admin') {
      // Admin access - redirect to auth page
      await redirectToAuthPage(accessOption);
    } else {
      // Member access - send magic link
      await sendMagicLink(accessOption.tenantId!);
    }
    
    setOrgSelectionLoading(false);
  };

  const redirectToAuthPage = async (accessOption: AccessOption) => {
    setLoading(true);
    setMessage('');

    try {
      // Redirect to existing admin login with full context
      const params = new URLSearchParams({
        email: email.trim().toLowerCase(),
        accessType: accessOption.accessType
      });
      
      // Add organization context if it's tenant-specific
      if (accessOption.tenantId) {
        params.set('org', accessOption.tenantId);
        params.set('orgName', accessOption.organizationName || '');
      }
      
      console.log('🔄 Redirecting to auth with context:', {
        email: email.trim().toLowerCase(),
        accessType: accessOption.accessType,
        tenantId: accessOption.tenantId,
        orgName: accessOption.organizationName
      });
      
      router.push(`/auth/login?${params.toString()}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Redirect failed');
    } finally {
      setLoading(false);
    }
  };

  const sendMagicLink = async (orgId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/member-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          selectedTenantId: orgId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send magic link');
      }

      setMessage(data.message);
      setCurrentStep('magic-link-sent');
      setShowSuccessMessage(true);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This function might not be needed anymore since we redirect directly
    // Keeping for backward compatibility
  };

  const resetSignIn = () => {
    setCurrentStep('email');
    setEmail('');
    setPassword('');
    setSelectedOrgId('');
    setUserRoleInfo(null);
    setMessage('');
    setShowSuccessMessage(false);
    setShowSignIn(false);
    setOrgSelectionLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Logo */}
              <Image
                src="/voluntold-logo.png"
                alt="Voluntold - Free Online Sign-up Sheets & Member Polling"
                width={200}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </div>
            <nav className="flex space-x-6">
              <button
                onClick={() => setShowSignIn(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
              >
                Sign In
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Message Display */}
        {message && !showSignIn && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">{message}</p>
          </div>
        )}
        
        <div className="text-center">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl" style={{ color: 'rgb(0, 43, 86)' }}>
            Keep Busy Volunteers
            <span style={{ color: 'rgb(255, 98, 1)' }}> In Sync!</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
            Create professional online sign-up sheets and member polling for your organization's volunteer coordination. 
            Manage projects, track sign-ups, conduct voting, and keep your team connected with email notifications.
          </p>
          
          {/* Marketing Content - 60/40 Split */}
          <div className="mt-12 p-8 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Text Content - 60% */}
              <div className="lg:w-3/5 w-full">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'rgb(0, 43, 86)' }}>Voluntold Makes Sign-up Sheets & Member Polling Easy!</h2>
                <p className="text-gray-700 italic mb-6">
                  We make it easy to create online sign-up sheets, manage your projects, and conduct member polling to keep your volunteers in sync. 
                  No more paper sign-up sheets, no more confusion about who's doing what, no more difficult voting processes. 
                  Just simple, effective management of your community group with professional email notifications.
                  And, it's free for the first year. Let's get your group set up!
                </p>
                
                {/* Call to Action Button */}
                <button
                  onClick={() => router.push('/join')}
                  className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 font-semibold transition-colors"
                >
                  Start Creating Sign-up Sheets!
                </button>
              </div>
              
              {/* Image - 40% */}
              <div className="lg:w-2/5 w-full">
                <Image
                  src="/signups.png"
                  alt="Online sign-up sheets and member polling management interface"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg"
                  priority={false}
                />
              </div>
            </div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Online Sign-up Sheets Made Easy</h3>
            <p className="text-gray-600">Create & manage professional sign-up sheets with ease. Whether it's a series of work party shifts or a one-off task, volunteers can enroll with one click - right from their inbox. They can also change their commitments and keep the team updated with automatic email notifications.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Member Polling & Voting System</h3>
            <p className="text-gray-600">Easily keep track of who's coming for dinner, who's bringing what, who's in favour of what motion. Member polling can be anonymous, time-bound and changeable for maximum flexibility. Perfect for decision-making and gathering community feedback.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Volunteer Self-Management Portal</h3>
            <p className="text-gray-600">Members receive calendar links and email reminders for every scheduled sign-up. Volunteers can access and update their commitments through their personal portal. No passwords required for ease of member management and maximum accessibility.</p>
          </div>
        </div>

        {/* Additional SEO Content Section */}
        <div className="mt-20 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Complete Online Sign-up Sheet & Member Polling Solution</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Perfect for Organizations</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Nonprofits:</strong> Coordinate volunteers with professional sign-up sheets</li>
                <li>• <strong>Churches:</strong> Manage events and member polling for decisions</li>
                <li>• <strong>Schools:</strong> Organize parent volunteers and conduct voting</li>
                <li>• <strong>Community Groups:</strong> Streamline volunteer coordination</li>
                <li>• <strong>Sports Teams:</strong> Schedule volunteers and gather feedback</li>
                <li>• <strong>Clubs & Associations:</strong> Manage members and conduct polls</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Free sign-up sheets</strong> with unlimited volunteers</li>
                <li>• <strong>Member polling system</strong> with anonymous options</li>
                <li>• <strong>Email notifications</strong> for all sign-ups and changes</li>
                <li>• <strong>Calendar integration</strong> for volunteer scheduling</li>
                <li>• <strong>No passwords needed</strong> for volunteer access</li>
                <li>• <strong>Multi-organization support</strong> for admins</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* SEO Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Voluntold</h3>
              <p className="text-gray-400">Free online sign-up sheets and member polling platform for nonprofits, churches, schools, and community organizations.</p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-white">Sign-up Sheets</a></li>
                <li><a href="/features" className="hover:text-white">Member Polling</a></li>
                <li><a href="/features" className="hover:text-white">Email Notifications</a></li>
                <li><a href="/features" className="hover:text-white">Calendar Integration</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Organizations</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/nonprofit" className="hover:text-white">Nonprofits</a></li>
                <li><a href="/churches" className="hover:text-white">Churches</a></li>
                <li><a href="/schools" className="hover:text-white">Schools</a></li>
                <li><a href="/community" className="hover:text-white">Community Groups</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-white">Help Center</a></li>
                <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Voluntold. All rights reserved. Free online sign-up sheets and member polling for organizations.</p>
          </div>
        </div>
      </footer>

      {/* Single Sign-In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {currentStep === 'email' && 'Sign In to Voluntold'}
                {currentStep === 'org-selection' && 'Select Access Type'}
                {currentStep === 'magic-link-sent' && (showSuccessMessage ? 'Check Your Email' : 'Access Link Sent')}
              </h3>
              <button
                onClick={resetSignIn}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            
            {/* Email Entry Step */}
            {currentStep === 'email' && (
              <form className="space-y-4" onSubmit={handleEmailSubmit}>
                <p className="text-gray-600 mb-4">
                  Enter your email address to access your sign-up sheets and member polling. We'll automatically determine the best sign-in method for you.
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                    disabled={loading}
                    required
                  />
                </div>

                {message && (
                  <div className="text-red-600 text-sm">{message}</div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetSignIn}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Checking...' : 'Continue'}
                  </button>
                </div>
              </form>
            )}

            {/* Organization Selection Step */}
            {currentStep === 'org-selection' && userRoleInfo && (
              <>
                <p className="text-gray-600 mb-4">
                  You have access to multiple organizations. Please select how you'd like to sign in:
                </p>
                
                <div className="space-y-3 mb-4">
                  {userRoleInfo.accessOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOrgSelection(option)}
                      disabled={loading || orgSelectionLoading}
                      className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      <div className="font-medium">{option.name}</div>
                      <div className="text-sm text-gray-500">
                        {option.accessType === 'super_admin' && 'Full system access'}
                        {option.accessType === 'tenant_admin' && 'Organization administrator'}
                        {option.accessType === 'member' && 'Organization member'}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  {orgSelectionLoading ? (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Processing your selection...</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCurrentStep('email')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      disabled={loading}
                    >
                      ← Back
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Magic Link Sent Step */}
            {currentStep === 'magic-link-sent' && (
              <>
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {showSuccessMessage ? 'Access Link Sent!' : 'Check Your Email'}
                  </h4>
                  <p className="text-gray-600 mb-6">
                    {message || 'If an account exists with that email address, we\'ve sent you a magic link to access your sign-up sheets and member polling.'}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={resetSignIn}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}