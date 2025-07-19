// File: src/app/organizations/churches/page.tsx
// Version: 1.2

import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function ChurchesFeature() {
  return (
    <div className="min-h-screen">
      {/* Header */}
       {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/voluntold-logo.png"
                alt="Voluntold"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
              
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/help" className="text-gray-600 hover:text-gray-900">Help Center</Link>
              <Link href="/contact" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Optimized Styling */}
<section
  className="relative h-96 bg-cover bg-center"
  style={{ 
    backgroundImage: "url('/images/church-groups.jpg')",
    backgroundPosition: 'center 30%' // Optional: adjust image crop
  }}
>
  {/* Overlay with better contrast control */}
  <div className="absolute inset-0 bg-black/40" /> {/* Using black with opacity for better text contrast */}
  
  {/* Content container with max-width and better padding */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-7xl mx-auto">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
      Churches
    </h1>
    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-4 leading-relaxed">
      Streamline volunteer sign‑ups, potluck RSVPs, and council votes for your congregation.
    </p>
    <Link
      href="/contact"
      className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl"
    >
      Get Started Today
    </Link>
  </div>
</section>

      {/* Examples Section */}
      <section id="examples" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Example Use Cases</h2>
            
          </div>

          <div className="space-y-8">
            {/* St. Mark's Worship Team Scheduling */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">St. Mark's Worship Team Scheduling</h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Challenge</h4>
                <p className="text-gray-600">
                  Coordinating volunteers for worship team roles—musicians, sound tech, and greeters—each Sunday requires juggling availability and sending reminders.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-2">Solution</h4>
                <p className="text-gray-600">
                  Create role-based sign-up sheets emailed out in advance. Volunteers claim their slots with one click, see who else is serving, and add events to their calendars automatically.
                </p>
              </div>
            </div>

            {/* Grace Fellowship Potluck RSVP */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Grace Fellowship Potluck RSVP</h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Challenge</h4>
                <p className="text-gray-600">
                  Tracking dish contributions, dietary restrictions, and attendance for the annual church potluck filled inboxes and led to duplicate dishes and unplanned shortages.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-2">Solution</h4>
                <p className="text-gray-600">
                  Distribute a Voluntold poll listing dish categories and dietary options. Members select their contribution, update as needed, and view a live summary to coordinate the menu seamlessly.
                </p>
              </div>
            </div>

            {/* First Community Council Voting */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">First Community Council Voting</h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Challenge</h4>
                <p className="text-gray-600">
                  Voting on budget allocations and event planning outside of weekly meetings risked missed votes and manual tally errors.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-2">Solution</h4>
                <p className="text-gray-600">
                  Send a secure, time-bound Voluntold poll to council members. Each member can vote once; results compile automatically and can be exported for records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Simplify Your Church Operations?
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Empower your congregation and streamline events with email‑based sign‑ups, polls, and votes.
          </p>
          <Link
            href="/contact"
            className="bg-white text-green-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-200"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}