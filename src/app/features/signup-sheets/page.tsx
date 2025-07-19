// File: src/app/features/signup-sheets/page.tsx - Version 1.0
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function SignupSheetsFeature() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
<header className="bg-white shadow-sm border-b">
  <div className="max-w-6xl mx-auto px-4 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src="/voluntold-logo.png"
          alt="Voluntold"
          className="h-12 w-auto"
        />
        
      </div>
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
        <Link href="/help" className="text-gray-600 hover:text-gray-900">Help Center</Link>
        <Link href="/join" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200">Get Started</Link>
      </div>
    </div>
  </div>
</header>

       {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Text Content - Takes up 3 columns (60% of space) */}
            <div className="lg:col-span-3">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Smart Sign-Up Sheets Keep Teams
                <span className="text-blue-600"> In Sync!</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                For your next project, keep your team in sync with online sign-up sheets that are easy to Create, Share, Complete and Manage.  Your members receive multiple sign-ups as a single email and can sign up to each with a single click.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition duration-200"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
            
            {/* Image - Takes up 2 columns (40% of space) */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <Image
                src="/images/sign-up-sheet.png"
                alt="Digital sign-up sheet example"
                width={400}
                height={500}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

        {/* Problem Statement */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Problem: Inbox Mayhem
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We know the pain of endless email chains, double bookings, and chasing down volunteers for simple events.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Email Chaos</h3>
              <p className="text-red-700 italic">
                Endless reply-all emails, lost messages, and confusion about who signed up for what.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Double Bookings</h3>
              <p className="text-red-700 italic">
                People signing up multiple times or events getting overbooked without you knowing.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Time Wasted</h3>
              <p className="text-red-700 italic">
                Hours spent manually tracking signups, sending reminders, and managing spreadsheets.
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
              The Solution: Smart, Simple, Online Sign-up Sheets
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Voluntold&apos;s intelligent sign-up sheets eliminate the headaches and automate the process from start to finish.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Create Once, Manage Forever
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Quick Setup</h4>
                    <p className="text-gray-600">Create detailed volunteer opportunities in minutes with all the information your volunteers need.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Automatic Broadcasting</h4>
                    <p className="text-gray-600">Send professional emails to your entire volunteer base with one click.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Management</h4>
                    <p className="text-gray-600">Track signups in real-time with automatic duplicate prevention and capacity management.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Community Garden Planting</h4>
                <p className="text-gray-600 text-sm mb-3">Help plant spring vegetables in our community garden beds.</p>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  April 15, 2025 • 9:00 AM - 12:00 PM
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">6 of 8 volunteers signed up</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Real-time tracking shows exactly where you stand</p>
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
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From creation to completion, our sign-up sheets handle everything automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your Opportunity</h3>
              <p className="text-gray-600 mb-4">
                Set up your volunteer opportunity with date, time, location, and requirements. Takes less than 2 minutes.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Park Cleanup Day</p>
                  <p className="text-xs text-gray-500">📅 March 22 • 📍 Riverside Park</p>
                  <p className="text-xs text-gray-500">👥 Need 12 volunteers</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Broadcast to Your Team</h3>
              <p className="text-gray-600 mb-4">
                Send professional emails to your volunteers with one click. They get all the details plus easy signup links.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">📧 Email sent to 156 volunteers</p>
                  <p className="text-xs text-gray-500">✓ Professional template</p>
                  <p className="text-xs text-gray-500">✓ One-click signup</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Watch It Fill Up</h3>
              <p className="text-gray-600 mb-4">
                Volunteers sign up instantly. No duplicates, no overbooking, no manual tracking needed.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">🎉 12 of 12 volunteers signed up</p>
                  <p className="text-xs text-gray-500">✓ Auto confirmations sent</p>
                  <p className="text-xs text-gray-500">✓ Calendar invites delivered</p>
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
              Everything You Need, Nothing You Don&apos;t
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our sign-up sheets come packed with intelligent features that make volunteer management effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Duplicate Prevention</h3>
              <p className="text-gray-600">
                Automatically prevents the same person from signing up twice for the same opportunity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600">
                See signups as they happen with live updates on your dashboard.
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
                Beautiful, branded email templates that make your organization look professional.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar Integration</h3>
              <p className="text-gray-600">
                Volunteers can add events directly to their personal calendars with one click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Capacity Management</h3>
              <p className="text-gray-600">
                Automatically closes signups when you reach your volunteer limit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Reporting</h3>
              <p className="text-gray-600">
                Track volunteer hours, participation rates, and generate reports for your board.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-blue-50">
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
              &quot;Voluntold&apos;s sign-up sheets saved us hours every week. What used to take me a full day of emails and spreadsheets now happens automatically. Our volunteers love how easy it is to sign up and stay informed.&quot;
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">Sarah Johnson</p>
                <p className="text-gray-600">Volunteer Coordinator, Fictional Community Gardens Alliance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Volunteer Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join organizations already using Voluntold to streamline their volunteer coordination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition duration-200">
              Get Started Today
            </Link>
            <Link href="/help" className="border border-blue-200 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition duration-200">
              Learn More
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            Currently available to selected organizations • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}