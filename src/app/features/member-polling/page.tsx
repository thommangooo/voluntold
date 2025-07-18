// File: src/app/features/email-polling/page.tsx - Version 1.0
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function EmailPollingFeature() {
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
      <section className="bg-gradient-to-br from-purple-50 to-pink-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Make Every Voice Count with
              <span className="text-purple-600"> Smart Polling</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gather feedback, make decisions, and engage your community with professional email polling that&apos;s simple, secure, and effective.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-purple-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-purple-700 transition duration-200">
                Start Polling Today
              </Link>
              <Link href="#how-it-works" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition duration-200">
                See How It Works
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
              Struggling to Get Input from Your Members?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Traditional polling methods are broken. It&apos;s time for a solution that actually works.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Paper Voting Chaos</h3>
              <p className="text-gray-600">
                Lost ballots, unclear handwriting, and hours spent counting votes manually.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Participation</h3>
              <p className="text-gray-600">
                Members don&apos;t show up to meetings, miss deadlines, or simply don&apos;t respond to requests for input.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Slow Decisions</h3>
              <p className="text-gray-600">
                Important decisions get delayed for weeks while you wait for everyone to weigh in.
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
              Professional Email Polling Made Simple
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Voluntold&apos;s email polling system makes it easy to gather feedback, conduct votes, and make decisions with your community.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                From Question to Decision in Minutes
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Any Type of Poll</h4>
                    <p className="text-gray-600">Yes/No questions, multiple choice, or complex decisions - all with professional email delivery.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Anonymous or Identified</h4>
                    <p className="text-gray-600">Choose whether responses are anonymous for sensitive topics or identified for accountability.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-Time Results</h4>
                    <p className="text-gray-600">Watch responses come in live with instant result tracking and automatic deadline management.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">🗳️ Should we schedule an extra workday?</h4>
                <p className="text-gray-600 text-sm mb-4">We have more volunteers than expected. Should we add an additional community garden workday this month?</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Yes, let&apos;s do it!</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">18 votes</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">No, keep as planned</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">6 votes</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Poll closes in 2 days • 24 of 156 members responded</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Live results help you make informed decisions quickly</p>
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
              How Email Polling Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get member input in three simple steps - no meetings required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your Poll</h3>
              <p className="text-gray-600 mb-4">
                Set up your question, choose poll type, and set privacy settings. Add a deadline to create urgency.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">📊 Meeting Time Vote</p>
                  <p className="text-xs text-gray-500">Multiple choice • Anonymous</p>
                  <p className="text-xs text-gray-500">⏰ Closes March 25</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Your Members</h3>
              <p className="text-gray-600 mb-4">
                Send professional poll invitations with one click. Members can reply with a single click.  They can also amend their choice later while polling is open
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">📧 Sent to 156 members</p>
                  <p className="text-xs text-gray-500">✓ Mobile-friendly voting</p>
                  <p className="text-xs text-gray-500">✓ One-click responses</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Results Instantly</h3>
              <p className="text-gray-600 mb-4">
                Watch responses come in real-time. Export results or share them with your team automatically.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">🎉 82% response rate</p>
                  <p className="text-xs text-gray-500">✓ Results exported</p>
                  <p className="text-xs text-gray-500">✓ Decision made</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Poll Types */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Any Decision
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you need quick feedback or formal voting, our polling system adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Yes/No Polls */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Yes/No Polls</h3>
              <p className="text-gray-600 mb-4">
                Perfect for quick decisions and gauge general sentiment on proposals.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Examples:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Should we purchase new equipment?</li>
                  <li>• Approve the budget proposal?</li>
                  <li>• Support the new initiative?</li>
                  <li>• Change the meeting schedule?</li>
                </ul>
              </div>
            </div>

            {/* Multiple Choice Polls */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Multiple Choice Polls</h3>
              <p className="text-gray-600 mb-4">
                Great for choosing between options or gathering specific preferences from your members.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Examples:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• What time works best for meetings?</li>
                  <li>• Which event location do you prefer?</li>
                  <li>• Select your volunteer preferences</li>
                  <li>• Choose the next fundraising activity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Privacy Options That Build Trust
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the right level of privacy for each poll to encourage honest feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">👤 Identified Voting</h3>
              <p className="text-gray-600 mb-4">
                Know who voted and what they chose. Perfect for formal decisions and accountability.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Best for:</span>
                  <span className="text-gray-600">Official votes, scheduling, assignments</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">You see:</span>
                  <span className="text-gray-600">Names + individual responses</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Members know:</span>
                  <span className="text-gray-600">Their vote will be recorded</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔒 Anonymous Voting</h3>
              <p className="text-gray-600 mb-4">
                Encourage honest feedback without fear of judgment. Perfect for sensitive topics.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Best for:</span>
                  <span className="text-gray-600">Sensitive topics, leadership feedback</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">You see:</span>
                  <span className="text-gray-600">Total counts only</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Members know:</span>
                  <span className="text-gray-600">Complete privacy guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Effective Polling
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional polling features that make gathering feedback simple and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Automatic Deadlines</h3>
              <p className="text-gray-600">
                Set poll expiration dates to create urgency and ensure timely responses.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Results</h3>
              <p className="text-gray-600">
                Watch responses come in real-time with instant result calculations and charts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Emails</h3>
              <p className="text-gray-600">
                Beautiful, branded email invitations that work perfectly on mobile devices.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Duplicate Prevention</h3>
              <p className="text-gray-600">
                Automatically prevents multiple votes from the same person while allowing vote changes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Results</h3>
              <p className="text-gray-600">
                Download results as CSV or generate summary reports for board meetings.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a10 10 0 0120 0v10z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reminder System</h3>
              <p className="text-gray-600">
                Send gentle reminders to members who haven&apos;t responded yet, automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-purple-50">
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
              &quot;We used to spend entire meetings just trying to get consensus on simple decisions. Now we send out polls beforehand and come to meetings with clear direction. Our members love being able to voice their opinion on their own time.&quot;
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">Michael Chen</p>
                <p className="text-gray-600">Board Chair, Fictional Downtown Neighborhood Association</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Hear from Your Members?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start gathering feedback and making better decisions with professional email polling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-purple-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition duration-200">
              Start Polling Today
            </Link>
            <Link href="/help" className="border border-purple-200 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-purple-700 transition duration-200">
              Learn More
            </Link>
          </div>
          <p className="text-purple-200 text-sm mt-6">
            Currently available to selected organizations • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}