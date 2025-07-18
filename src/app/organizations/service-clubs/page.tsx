// File: src/app/organizations/service-clubs/page.tsx
// Version: 1.2

import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function ServiceClubsFeature() {
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
    backgroundImage: "url('/images/service-clubs.jpg')",
    backgroundPosition: 'center 30%' // Optional: adjust image crop
  }}
>
  {/* Overlay with better contrast control */}
  <div className="absolute inset-0 bg-black/40" /> {/* Using black with opacity for better text contrast */}
  
  {/* Content container with max-width and better padding */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-7xl mx-auto">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
      Service Clubs
    </h1>
    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-4 leading-relaxed">
      Streamline club management with online sign-ups, polls, votes and resources for your service club.
    </p>
    <Link
      href="/contact"
      className="bg-white text-green-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl"
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Real-world challenges and how Voluntold solves them.</p>
          </div>

          <div className="space-y-8">
            {/* Kinsmen's Big Home Show */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logos/kinsmen.jpeg"
                  alt="Kinsmen Club Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Kinsmen Home Show Sign‑Ups</h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Challenge</h4>
                <p className="text-gray-600">
                  The show requires hundreds of service hours.  It takes many shifts with several volunteers per shift to make the show run smoothly.  Each member needs to remember what commitments they made and their shift scheduled dates and times.  
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-2">Solution</h4>
                <p className="text-gray-600">
                  Create time slot sign up sheets for each of the shifts that needs coverage.  Members select their shifts with a single click.  They always know which shifts are already filled.  Calendar links let them save their commitments to the calendar of their choice.  The whole club has access to see who's doing which shifts.  Next year, the club can create a copy of the project from this year, which gives them a big head start.  Their show documents and spreadsheets are easy to find in the show's document library for easy knowledge transfer.
                </p>
              </div>
            </div>

            {/* Lions Club Meal Poll */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logos/lions.png"
                  alt="Lions Club Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Lions Club Meal RSVP</h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Challenge</h4>
                <p className="text-gray-600">
                  Every couple weeks, someone takes on the task of asking each member whether they will be at the next meeting and whether they are opting to order dinner.  Combing through the 30 or so individual responses and tallying the numbers is tedious and fills everyone's inbox with unneeded messages.  Members often have changes in plan, and the churn gets overwhelming.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-2">Solution</h4>
                <p className="text-gray-600">
                  With a couple clicks, you've created and distributed a Voluntold Poll to all members. Your note asks the question, but it also encourages them to save the email just in case they change their mind.  Of course, you need some cut-off time, so you set one before sending the poll, and let members know how long they have to change their mind. The result is a running tally that's easy for everyone and always up to date.
                </p>
              </div>
            </div>

            {/* Rotary Club Voting */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logos/rotary.svg"
                  alt="Rotary Club Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Rotary Club Voting</h3>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Challenge</h4>
                <p className="text-gray-600">
                  After a meeting cancellation, urgent votes on key issues needed to be cast securely, without worry of duplicate votes.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-2">Solution</h4>
                <p className="text-gray-600">
                  Use Voluntold Polling to ensure everyone's vote is recorded with ease.  Vote responses can be anonymous and/or time-bound.  Only registered members can vote.  The secretary has a perfect record of the vote.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Simplify Your Service Club Operations?</h2>
          <p className="text-lg text-green-100 mb-8">
            Empower your volunteers and streamline events with email‑based sign‑ups, polls, and votes.
          </p>
          <Link href="/contact" className="bg-white text-green-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-200">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
