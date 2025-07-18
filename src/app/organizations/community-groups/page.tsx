// File: src/app/organizations/community-groups/page.tsx
// Version: 1.5

import Link from 'next/link'
import Footer from '@/components/Footer'

export default function CommunityGroupsFeature() {
  return (
    <div className="min-h-screen">
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
        <Link href="/contact" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200">Get Started</Link>
      </div>
    </div>
  </div>
</header>

      {/* Hero Section with Optimized Styling */}
<section
  className="relative h-96 bg-cover bg-center"
  style={{ 
    backgroundImage: "url('/images/community-volunteers.png')",
    backgroundPosition: 'center 30%' // Optional: adjust image crop
  }}
>
  {/* Overlay with better contrast control */}
  <div className="absolute inset-0 bg-black/40" /> {/* Using black with opacity for better text contrast */}
  
  {/* Content container with max-width and better padding */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-7xl mx-auto">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
      Community Groups
    </h1>
    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-4 leading-relaxed">
      Mobilize volunteers, manage events, and streamline coordination for any community-driven initiative.
    </p>
    <Link
      href="/contact"
      className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl"
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Practical scenarios and how Voluntold makes coordination effortless.</p>
          </div>

          <div className="space-y-8">
            {/* Summer Music Festival */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Town Summer Music Festival Volunteers</h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Challenge</h4>
                <p className="text-gray-600">
                  Hundreds of volunteers needed to staff stages, ticket booths, info tents, and cleanup teams across multiple days—manual rosters and emails became unmanageable.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-2">Solution</h4>
                <p className="text-gray-600">
                  Publish role-based sign-up sheets via email links. Volunteers claim shifts in real time, receive calendar invites, and see an updated roster—no more back-and-forth scheduling.
                </p>
              </div>
            </div>

            {/* Boat Club Docks-In Event */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Boat Club Docks-In Event Coordination</h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Challenge</h4>
                <p className="text-gray-600">
                  The docks-in event requires teams on the water for docking, a land crew for construction tasks, and volunteers to organize a potluck meal—tracking separate lists and roles was chaotic.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-2">Solution</h4>
                <p className="text-gray-600">
                  Create distinct sign-up sections within a single Voluntold project. Members select water teams, construction tasks, or potluck contributions in one click—viewable group-wide and integrated with calendar invites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Empower Your Community Volunteers?</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Simplify volunteer coordination and focus on making a difference—not managing spreadsheets.
          </p>
          <Link
            href="/contact"
            className="bg-white text-indigo-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-200"
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
