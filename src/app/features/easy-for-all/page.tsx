// File: src/app/features/easy-for-all/page.tsx - Version 1.0
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function EasyForAllFeature() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image 
                src="/voluntold-logo.png" 
                alt="Voluntold" 
                width={32} 
                height={32}
                className="h-8 w-auto"
              />
              <h1 className="text-2xl font-bold text-gray-900">Voluntold</h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-gray-900">
                Help Center
              </Link>
              <Link href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-50 to-blue-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Technology That&apos;s
              <span className="text-sky-600"> Easy for All to Use</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              If your members can click a link in an email, they can use Voluntold. No technical skills required, no passwords to remember, no training needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-sky-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-sky-700 transition duration-200">
                Make It Simple Today
              </Link>
              <Link href="#how-it-works" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition duration-200">
                See How Simple It Is
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technology Shouldn&apos;t Be a Barrier to Participation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most platforms require your members to become tech experts just to participate. That&apos;s backwards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Password Headaches</h3>
              <p className="text-red-700 italic">
                Creating accounts, remembering passwords, password resets, and helping members who get locked out of their accounts.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Learning Curve</h3>
              <p className="text-red-700 italic">
                Training sessions, help documentation, and frustrated members who just want to participate without becoming tech experts.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Member Dropout</h3>
              <p className="text-red-700 italic">
                Losing volunteers who give up because the technology is too complicated or time-consuming to figure out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple Enough for Everyone, Powerful Enough for You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Voluntold works for every member of your organization, regardless of their comfort level with technology.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Email-Based Simplicity That Just Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">No Passwords Required</h4>
                    <p className="text-gray-600">Members access everything through secure email links - no passwords to create, remember, or reset.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Instant Participation</h4>
                    <p className="text-gray-600">Click a link in an email and you&apos;re participating. No apps to download, no accounts to set up.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Zero Learning Curve</h4>
                    <p className="text-gray-600">If members can check email and click links, they can use Voluntold. No training required.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-blue-100 p-8 rounded-2xl">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h4 className="font-semibold text-gray-900 mb-4">📧 From: Community Garden Project</h4>
                <p className="text-gray-700 text-sm mb-4">
                  <strong>Subject:</strong> New volunteer opportunities available!
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 mb-3">Hi Sarah! We have some great opportunities coming up:</p>
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                      <p className="font-medium text-sm">🌱 Planting Day - March 15</p>
                      <p className="text-xs text-gray-600">9:00 AM - 12:00 PM • 2 of 8 spots filled</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors w-full">
                      ✓ Sign Up for Planting Day
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">One click participation - that&apos;s it!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Email-Based Simplicity Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From email to participation in just one click.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center flex flex-col">
              <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Member Gets Email</h3>
              <p className="text-gray-600 mb-4 flex-grow">
                Members receive beautiful, clear emails with volunteer opportunities, polls, or updates - right in their regular inbox.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border mt-auto">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">📧 Email Received</p>
                  <p className="text-xs text-gray-500">• Clear opportunity details</p>
                  <p className="text-xs text-gray-500">• One-click action buttons</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center flex flex-col">
              <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">One Click to Participate</h3>
              <p className="text-gray-600 mb-4 flex-grow">
                Click the button, confirm their choice, and they&apos;re done. No passwords, no lengthy forms, no confusing interfaces.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border mt-auto">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">⚡ Instant Action</p>
                  <p className="text-xs text-gray-500">• Secure access via email link</p>
                  <p className="text-xs text-gray-500">• Simple confirmation form</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center flex flex-col">
              <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Immediate Confirmation</h3>
              <p className="text-gray-600 mb-4 flex-grow">
                Members get instant confirmation and can access their personal portal to see all their commitments and updates.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border mt-auto">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">✅ All Set</p>
                  <p className="text-xs text-gray-500">• Confirmation received</p>
                  <p className="text-xs text-gray-500">• Portal access available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Benefits */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Everyone, Not Just Tech Experts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Voluntold removes technology barriers so everyone can participate, regardless of their tech comfort level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">👥 Perfect for All Ages & Tech Levels</h3>
              <p className="text-gray-600 mb-4">
                From digital natives to those who prefer simplicity - everyone can participate without barriers.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Works on any device with email</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">No special apps or accounts needed</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Large, clear buttons and text</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔐 Security Without Complexity</h3>
              <p className="text-gray-600 mb-4">
                Enterprise-grade security that members never have to think about or manage.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Secure email-based authentication</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">No passwords to compromise</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Privacy protection built-in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Less Work for Admins, More Participation from Members
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              When technology is simple for members, it&apos;s also simple for you to manage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Password Management</h3>
              <p className="text-gray-600">
                Never deal with password resets, account lockouts, or forgotten login credentials again.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Onboarding</h3>
              <p className="text-gray-600">
                Add someone&apos;s email and they&apos;re ready to participate immediately - no setup required.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Higher Participation</h3>
              <p className="text-gray-600">
                When it&apos;s easier to participate, more members actually do - increasing your volunteer engagement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fewer Support Requests</h3>
              <p className="text-gray-600">
                No more &quot;how do I log in?&quot; or &quot;I forgot my password&quot; support requests from members.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Faster Response Times</h3>
              <p className="text-gray-600">
                Members can respond to opportunities immediately from their email - no delays for logins or navigation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Better Engagement Data</h3>
              <p className="text-gray-600">
                Clear insights into member participation without the noise of technical barriers affecting your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-sky-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <blockquote className="text-xl text-gray-900 mb-6">
              &quot;Finally, a system that works for everyone! Our 75-year-old volunteers participate just as easily as our college students. No more tech support calls, no more training sessions - just simple email links that work every time.&quot;
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">Margaret Thompson</p>
                <p className="text-gray-600">Volunteer Coordinator, Fictional Senior Community Center</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make Technology Disappear?
          </h2>
          <p className="text-xl text-sky-100 mb-8">
            Give your members the simplest volunteer management experience possible while making your job easier too.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-sky-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition duration-200">
              Make It Simple Today
            </Link>
            <Link href="/help" className="border border-sky-200 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-sky-700 transition duration-200">
              Learn More
            </Link>
          </div>
          <p className="text-sky-200 text-sm mt-6">
            Currently available to selected organizations • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}