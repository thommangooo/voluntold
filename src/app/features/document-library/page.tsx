// File: src/app/features/document-storage/page.tsx - Version 1.0
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function DocumentStorageFeature() {
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
      <section className="bg-gradient-to-br from-emerald-50 to-teal-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              One Central Hub for All Your
              <span className="text-emerald-600"> Project Resources</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Organize links to all your important documents and resources in one central location where all your members can easily find and access them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-emerald-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-emerald-700 transition duration-200">
                Start Organizing Today
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
              Tired of Members Asking &quot;Where&apos;s That Link?&quot;
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Important project resources and document links shouldn&apos;t be lost in email chains or scattered across different messages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Scattered Links</h3>
              <p className="text-red-700 italic">
                Important document links, forms, and resources buried in old emails or forgotten bookmarks.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Repeated Questions</h3>
              <p className="text-red-700 italic">
                Members constantly asking for the same links, forms, or resource locations because they can&apos;t find them.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Document Dumping</h3>
              <p className="text-red-700 italic">
                Putting all your documents in a single repository makes it easy to share access, but quickly turns into a dumping ground where things get hard to find.
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
              One Central Hub for All Your Project Links
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Voluntold&apos;s resource hub keeps all your important document links organized and accessible to every member in one convenient location.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Everything Your Members Need, Right at Their Fingertips
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Centralized Link Organization</h4>
                    <p className="text-gray-600">Add links to Google Drive, Dropbox, websites, and online forms with clear descriptions and categories.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Project-Based Organization</h4>
                    <p className="text-gray-600">Group all related resource links by project so members can find everything they need in one place.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Easy Member Access</h4>
                    <p className="text-gray-600">Members can instantly access all resources through their personal portal - no passwords or complicated logins.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-8 rounded-2xl">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">📁 Community Garden Project Resources</h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">Garden Planning Guide.pdf</p>
                      <p className="text-xs text-gray-500">Uploaded 2 weeks ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">Seed Supplier Website</p>
                      <p className="text-xs text-gray-500">Link: gardensupplies.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">Volunteer Safety Guidelines</p>
                      <p className="text-xs text-gray-500">Important safety protocols</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">All your project resources in one organized location</p>
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
              How Document Storage Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From upload to member access in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add & Organize Links</h3>
              <p className="text-gray-600 mb-4">
                Add links to Google Drive, Dropbox, websites, and online forms. Organize everything by project with clear descriptions.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">🔗 Links Added</p>
                  <p className="text-xs text-gray-500">• Safety Guidelines (Google Drive)</p>
                  <p className="text-xs text-gray-500">• Equipment List (Dropbox)</p>
                </div>
              </div>
            </div>

          

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Members Access Instantly</h3>
              <p className="text-gray-600 mb-4">
                Members find everything they need in their personal portal - no hunting through emails or asking for links.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">✅ Available Now</p>
                  <p className="text-xs text-gray-500">• Instant access via portal</p>
                  <p className="text-xs text-gray-500">• Mobile-friendly viewing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Store Everything Your Organization Needs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From official documents to helpful links, keep all your project resources organized and accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Documents</h3>
              <p className="text-gray-600 mb-3">Instructions, guidelines, forms, and project-specific materials.</p>
              <div className="text-sm text-gray-500">
                <p>• Safety protocols</p>
                <p>• Training materials</p>
                <p>• Project plans</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Links</h3>
              <p className="text-gray-600 mb-3">External websites, forms, and resources your members need to access.</p>
              <div className="text-sm text-gray-500">
                <p>• Supplier websites</p>
                <p>• Registration forms</p>
                <p>• Reference materials</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Images & Media</h3>
              <p className="text-gray-600 mb-3">Photos, diagrams, videos, and visual resources for your projects.</p>
              <div className="text-sm text-gray-500">
                <p>• Project photos</p>
                <p>• Instructional diagrams</p>
                <p>• Reference images</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Spreadsheets & Data</h3>
              <p className="text-gray-600 mb-3">Lists, schedules, budgets, and data files your team needs to reference.</p>
              <div className="text-sm text-gray-500">
                <p>• Contact lists</p>
                <p>• Budget templates</p>
                <p>• Schedule spreadsheets</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reference Materials</h3>
              <p className="text-gray-600 mb-3">Guides, manuals, and educational content for training and reference.</p>
              <div className="text-sm text-gray-500">
                <p>• Training guides</p>
                <p>• Best practice manuals</p>
                <p>• Educational resources</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Forms & Templates</h3>
              <p className="text-gray-600 mb-3">Blank forms, templates, and documents members need to complete.</p>
              <div className="text-sm text-gray-500">
                <p>• Volunteer agreements</p>
                <p>• Expense forms</p>
                <p>• Report templates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Link Organization Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Smart Organization with Easy Access Control
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Keep your resource links organized by project while controlling who has access to what.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📂 Project-Based Organization</h3>
              <p className="text-gray-600 mb-4">
                Group all related resource links by project so members can find everything they need in one logical place.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Organize by project or category</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Add descriptions for each link</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Link to any online platform</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Simple Access Control</h3>
              <p className="text-gray-600 mb-4">
                Control exactly who can see which resource links with flexible visibility settings for each project.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Project-specific visibility</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Member access via secure portal</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">No complex sharing permissions</span>
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
              Link Organization Made Simple
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              All the features you need to keep your organization&apos;s resource links organized and accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Link Addition</h3>
              <p className="text-gray-600">
                Simply paste any URL and add a description to create organized resource links for your members.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Organization</h3>
              <p className="text-gray-600">
                Group resource links by project, type, or category with clear naming and descriptions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Find resource links quickly with search by title, project, or description.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Access</h3>
              <p className="text-gray-600">
                Members can access resource links from any device, anywhere, anytime through their portal.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visibility Control</h3>
              <p className="text-gray-600">
                Control which members can see which resource links based on their project involvement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Analytics</h3>
              <p className="text-gray-600">
                See which resource links are being accessed most to understand what your members find most valuable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-emerald-50">
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
              &quot;No more searching through old emails for that Google Drive link or asking 'where&apos;s that form again?' All the resource links our volunteers need are right there in their portal, organized by project. It&apos;s been a game-changer for our coordination.&quot;
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">Lisa Rodriguez</p>
                <p className="text-gray-600">Project Manager, Fictional River Cleanup Initiative</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Organize Your Resource Links?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Give your members instant access to all the links they need while keeping everything organized by project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-emerald-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition duration-200">
              Start Organizing Today
            </Link>
            <Link href="/help" className="border border-emerald-200 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-emerald-700 transition duration-200">
              Learn More
            </Link>
          </div>
          <p className="text-emerald-200 text-sm mt-6">
            Currently available to selected organizations • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}