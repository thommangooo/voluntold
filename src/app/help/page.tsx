// File: src/app/help/page.tsx - Version 1.0
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function HelpCenter() {
  return (
    <div className="bg-gray-50 min-h-screen">
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Getting Started with Voluntold</h1>
          <p className="text-gray-700 text-lg mb-6">
            Welcome to Voluntold! This guide will walk you through everything you need to know to manage your volunteer program effectively.
          </p>
          
          {/* Quick Navigation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Navigation</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <a href="#create-account" className="text-blue-700 hover:text-blue-800 font-medium block mb-2">
                  1. Creating Your Account
                </a>
                <a href="#adding-members" className="text-blue-700 hover:text-blue-800 font-medium block mb-2">
                  2. Adding Members
                </a>
                <a href="#creating-projects" className="text-blue-700 hover:text-blue-800 font-medium block mb-2">
                  3. Creating Projects
                </a>
                <a href="#creating-signups" className="text-blue-700 hover:text-blue-800 font-medium block mb-2">
                  4. Creating Sign-up Sheets
                </a>
              </div>
              <div>
                <a href="#broadcasting" className="text-blue-700 hover:text-blue-800 font-medium block mb-2">
                  5. Broadcasting Opportunities
                </a>
                <a href="#volunteer-signup" className="text-blue-700 hover:text-blue-800 font-medium block mb-2">
                  6. How Volunteers Sign Up
                </a>
                <a href="#polls" className="text-blue-700 hover:text-blue-800 font-medium block mb-2">
                  7. Creating and Managing Polls
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Creating Account */}
        <div id="create-account" className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">1</div>
            <h2 className="text-2xl font-bold text-gray-900">Creating Your Account</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Complete the &quot;Let&apos;s Get Started&quot; Page</h3>
              <p className="text-gray-700 mb-4">
                As Voluntold is currently in pilot mode, account creation is by invitation only. When you receive an invitation:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Fill out the organization setup form with your organization&apos;s details</li>
                <li>Provide your contact information as the primary administrator</li>
                <li>Submit the form and await email confirmation</li>
                <li>You&apos;ll receive login credentials and setup instructions via email</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-yellow-700 font-medium">Response Time</p>
                  <p className="text-yellow-700 text-sm">Account setup typically takes 1-2 business days. You&apos;ll receive email confirmation once your account is ready.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Adding Members */}
        <div id="adding-members" className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">2</div>
            <h2 className="text-2xl font-bold text-gray-900">Adding Members</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Method 1: Manual Addition</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>Navigate to the &quot;Members&quot; section in your admin dashboard</li>
                <li>Click &quot;Add New Member&quot;</li>
                <li>Fill in the member&apos;s details: name, email, phone, and position (if applicable)</li>
                <li>Click &quot;Save Member&quot;</li>
              </ol>
              <p className="text-gray-600 text-sm">💡 <strong>Tip:</strong> Email address is required as it&apos;s used for member authentication and communications.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Method 2: Bulk Import via CSV</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>Click &quot;Bulk Import&quot; in the Members section</li>
                <li>Download the CSV template to ensure proper formatting</li>
                <li>Fill in your member data with columns: First Name, Last Name, Email, Phone, Position</li>
                <li>Upload your completed CSV file</li>
                <li>Review the preview and confirm the import</li>
              </ol>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <p className="text-gray-700 font-medium mb-2">CSV Format Example:</p>
                <code className="text-sm text-gray-600 block">
                  First Name,Last Name,Email,Phone,Position<br/>
                  John,Smith,john@email.com,555-0123,Volunteer<br/>
                  Jane,Doe,jane@email.com,555-0456,Team Lead
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Method 3: Comma-Separated Email List</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>Click &quot;Quick Add by Email&quot; in the Members section</li>
                <li>Paste or type email addresses separated by commas</li>
                <li>Example: <code className="bg-gray-100 px-2 py-1 rounded text-sm">john@email.com, jane@email.com, bob@email.com</code></li>
                <li>Click &quot;Add Members&quot;</li>
                <li>Members will be created with email addresses only - you can update additional details later</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Section 3: Creating Projects */}
        <div id="creating-projects" className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">3</div>
            <h2 className="text-2xl font-bold text-gray-900">Creating Projects</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Important:</strong> Projects must be created before you can create sign-up sheets. Projects help organize your volunteer opportunities by category or initiative.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Steps to Create a Project</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Go to the &quot;Projects&quot; section in your admin dashboard</li>
                <li>Click &quot;Create New Project&quot;</li>
                <li>Fill in the project details:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Project Name:</strong> Choose a clear, descriptive name</li>
                    <li><strong>Description:</strong> Explain the project&apos;s purpose and goals</li>
                    <li><strong>Goals:</strong> Optional field for specific project objectives</li>
                  </ul>
                </li>
                <li>Set the project status to &quot;Active&quot;</li>
                <li>Click &quot;Create Project&quot;</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Examples</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">Community Garden</p>
                  <p className="text-gray-600 text-sm">Organizing volunteer shifts for planting, weeding, and harvesting activities.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">Food Drive</p>
                  <p className="text-gray-600 text-sm">Coordinating collection, sorting, and distribution of donated food items.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">Youth Mentorship</p>
                  <p className="text-gray-600 text-sm">Matching volunteers with youth for mentoring and tutoring opportunities.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">Event Planning</p>
                  <p className="text-gray-600 text-sm">Organizing volunteers for fundraising events and community celebrations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Creating Sign-up Sheets */}
        <div id="creating-signups" className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">4</div>
            <h2 className="text-2xl font-bold text-gray-900">Creating Sign-up Sheets</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Steps to Create a Sign-up Sheet (Opportunity)</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Navigate to &quot;Opportunities&quot; in your admin dashboard</li>
                <li>Click &quot;Create New Opportunity&quot;</li>
                <li>Select the project this opportunity belongs to (from your created projects)</li>
                <li>Fill in the opportunity details:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Title:</strong> Clear, descriptive name for the volunteer activity</li>
                    <li><strong>Description:</strong> What volunteers will be doing</li>
                    <li><strong>Date:</strong> When the volunteer activity takes place</li>
                    <li><strong>Start Time:</strong> What time volunteers should arrive</li>
                    <li><strong>Duration:</strong> How many hours the activity will last</li>
                    <li><strong>Volunteers Needed:</strong> Maximum number of volunteers required</li>
                    <li><strong>Location:</strong> Where the activity takes place</li>
                    <li><strong>Skills Required:</strong> Any special skills or requirements (optional)</li>
                  </ul>
                </li>
                <li>Review your details and click &quot;Create Opportunity&quot;</li>
              </ol>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Example Opportunity</h4>
              <div className="text-sm text-gray-700">
                <p><strong>Title:</strong> Community Garden Planting Day</p>
                <p><strong>Project:</strong> Community Garden</p>
                <p><strong>Description:</strong> Help plant spring vegetables and flowers in our community garden beds.</p>
                <p><strong>Date:</strong> April 15, 2025</p>
                <p><strong>Time:</strong> 9:00 AM - 12:00 PM (3 hours)</p>
                <p><strong>Volunteers Needed:</strong> 8</p>
                <p><strong>Location:</strong> Riverside Community Garden, 123 Garden St</p>
                <p><strong>Skills:</strong> No experience required, gloves provided</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Broadcasting */}
        <div id="broadcasting" className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">5</div>
            <h2 className="text-2xl font-bold text-gray-900">Broadcasting Sign-up Opportunities</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Send Opportunities to Your Members</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Go to the &quot;Email Broadcast&quot; section in your admin dashboard</li>
                <li>Click &quot;Create New Broadcast&quot;</li>
                <li>Select one or more opportunities to include in the email:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>You can select multiple opportunities for a single email</li>
                    <li>Only active, future opportunities will be available</li>
                    <li>Preview shows how each opportunity will appear in the email</li>
                  </ul>
                </li>
                <li>Review the email preview to see how it will look to recipients</li>
                <li>Choose your recipient list (typically &quot;All Active Members&quot;)</li>
                <li>Click &quot;Send Broadcast&quot; to deliver the email immediately</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What Members Receive</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 mb-3">Each broadcast email includes:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Professional email template with your organization branding</li>
                  <li>Details for each opportunity (date, time, location, description)</li>
                  <li>Unique &quot;Sign Up&quot; button for each opportunity</li>
                  <li>Clear information about volunteer requirements</li>
                  <li>Contact information for questions</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-700 font-medium">Best Practice</p>
                  <p className="text-green-700 text-sm">Send broadcasts at least 1-2 weeks before opportunities to give volunteers time to plan. You can always send reminder emails closer to the date.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Volunteer Signup Process */}
        <div id="volunteer-signup" className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">6</div>
            <h2 className="text-2xl font-bold text-gray-900">How Volunteers Sign Up</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">The Volunteer Experience</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-3">
                <li>
                  <strong>Receives Email:</strong> Volunteer gets your broadcast email with opportunity details
                </li>
                <li>
                  <strong>Clicks Sign Up:</strong> Clicks the &quot;Sign Up&quot; button for an opportunity they&apos;re interested in
                </li>
                <li>
                  <strong>Enters Information:</strong> Fills out a simple form with:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Full name</li>
                    <li>Email address (must match their member record)</li>
                    <li>Confirmation of availability</li>
                  </ul>
                </li>
                <li>
                  <strong>Receives Confirmation:</strong> Gets immediate email confirmation with:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Opportunity details and location</li>
                    <li>Contact information for questions</li>
                    <li>Any special instructions or requirements</li>
                  </ul>
                </li>
                <li>
                  <strong>Calendar Integration:</strong> Can add the volunteer opportunity to their personal calendar
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What You See as an Administrator</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Real-time signup notifications in your dashboard</li>
                  <li>Updated volunteer counts for each opportunity</li>
                  <li>Complete list of signed-up volunteers with contact information</li>
                  <li>Ability to manage signups (add, remove, or modify as needed)</li>
                  <li>Automatic tracking of volunteer hours for reporting</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Signup Protection Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Duplicate Prevention</h4>
                  <p className="text-blue-800 text-sm">System prevents the same person from signing up twice for the same opportunity.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Capacity Management</h4>
                  <p className="text-blue-800 text-sm">Signup automatically closes when the volunteer limit is reached.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Member Verification</h4>
                  <p className="text-blue-800 text-sm">Only registered members of your organization can sign up for opportunities.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Secure Links</h4>
                  <p className="text-blue-800 text-sm">Each signup link is unique and secure, preventing unauthorized access.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 7: Polls */}
        <div id="polls" className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">7</div>
            <h2 className="text-2xl font-bold text-gray-900">Creating and Managing Polls</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Creating a New Poll</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Navigate to the &quot;Polls&quot; section in your admin dashboard</li>
                <li>Click &quot;Create New Poll&quot;</li>
                <li>Fill in the basic poll information:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Title:</strong> A clear, descriptive name for your poll</li>
                    <li><strong>Question:</strong> The main question you&apos;re asking members</li>
                    <li><strong>Poll Type:</strong> Choose between Yes/No or Multiple Choice</li>
                  </ul>
                </li>
                <li>Configure poll options (see detailed sections below)</li>
                <li>Set expiration and privacy settings</li>
                <li>Save as draft or make active immediately</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Poll Types</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Yes/No Polls</h4>
                  <p className="text-gray-700 mb-3">Perfect for simple decisions or gauging general interest.</p>
                  <div className="text-sm text-gray-600">
                    <p><strong>Example:</strong></p>
                    <p><em>Question:</em> &quot;Should we schedule an additional community garden workday this month?&quot;</p>
                    <p><em>Options:</em> Yes / No</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Multiple Choice Polls</h4>
                  <p className="text-gray-700 mb-3">Great for choosing between several options or gathering specific preferences.</p>
                  <div className="text-sm text-gray-600">
                    <p><strong>Example:</strong></p>
                    <p><em>Question:</em> &quot;What time works best for our monthly volunteer meeting?&quot;</p>
                    <p><em>Options:</em> 6:00 PM / 7:00 PM / 7:30 PM / Weekend Morning</p>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    💡 <strong>Tip:</strong> You can add up to 10 options for multiple choice polls.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Setting Poll Expiration</h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-orange-800">
                  <strong>Important:</strong> Setting an expiration date helps create urgency and ensures you get timely responses from your members.
                </p>
              </div>
              
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>In the poll creation form, find the &quot;Expiration Settings&quot; section</li>
                <li>Choose an expiration date and time</li>
                <li>Consider these timeframes:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Quick decisions:</strong> 3-7 days</li>
                    <li><strong>Planning decisions:</strong> 1-2 weeks</li>
                    <li><strong>Long-term planning:</strong> 2-4 weeks</li>
                  </ul>
                </li>
                <li>Once expired, the poll automatically closes and no new responses are accepted</li>
              </ol>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">What Happens When a Poll Expires</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                  <li>The poll status automatically changes to &quot;Closed&quot;</li>
                  <li>Members can no longer submit new responses</li>
                  <li>You can still view all results and responses</li>
                  <li>The poll remains visible in your dashboard for reference</li>
                  <li>You can export results even after expiration</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Anonymous vs. Identified Polls</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3">✓ Anonymous Polls</h4>
                  <p className="text-green-800 text-sm mb-3">
                    Choose anonymous when you want honest feedback without social pressure.
                  </p>
                  <div className="text-green-700 text-sm">
                    <p className="font-medium mb-1">Best for:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Sensitive topics</li>
                      <li>Leadership feedback</li>
                      <li>Program evaluation</li>
                      <li>Conflict resolution input</li>
                    </ul>
                    <p className="mt-3 font-medium">Results show:</p>
                    <p>Total response counts only, no names attached</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">👤 Identified Polls</h4>
                  <p className="text-blue-800 text-sm mb-3">
                    Choose identified when you need to know who responded or follow up individually.
                  </p>
                  <div className="text-blue-700 text-sm">
                    <p className="font-medium mb-1">Best for:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Scheduling decisions</li>
                      <li>Event planning</li>
                      <li>Skill assessments</li>
                      <li>Volunteer availability</li>
                    </ul>
                    <p className="mt-3 font-medium">Results show:</p>
                    <p>Response counts plus member names and individual answers</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-yellow-700 font-medium">Privacy Notice</p>
                    <p className="text-yellow-700 text-sm">Make sure to clearly indicate to members whether a poll is anonymous or identified before they respond. This setting cannot be changed after the poll is created.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Broadcasting Polls to Members</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>Create your poll and set its status to &quot;Active&quot;</li>
                
                <li>Click the Email Members button to broadcast the poll to all members.</li>
                <li>Select your recipient list (typically &quot;All Active Members&quot;)</li>
                <li>Review the email preview showing how the poll will appear</li>
                <li>Send the broadcast to deliver poll invitations immediately</li>
              </ol>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">What Members Receive</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                  <li>Professional email with the poll question and context</li>
                  <li>Clear indication if the poll is anonymous or identified</li>
                  <li>Direct link to respond to the poll</li>
                  <li>Expiration date and time clearly displayed</li>
                  <li>Simple, mobile-friendly response interface</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Managing Poll Results</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Real-Time Tracking</h4>
                  <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                    <li>View response counts as they come in</li>
                    <li>See percentage breakdown for each option</li>
                    <li>Track total participation rate vs. total members</li>
                    <li>Monitor time remaining until expiration</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Closing and Exporting</h4>
                  <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                    <li>Manually close polls early if needed</li>
                    <li>Export results to CSV for further analysis</li>
                    <li>Generate summary reports for board meetings</li>
                    <li>Archive completed polls for future reference</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-700 font-medium">Best Practices for Effective Polls</p>
                  <ul className="text-green-700 text-sm mt-2 space-y-1">
                    <li>• Keep questions clear and unbiased</li>
                    <li>• Provide context about why you&apos;re asking</li>
                    <li>• Set realistic expiration dates</li>
                    <li>• Follow up with results after closing</li>
                    <li>• Use anonymous polls for sensitive topics</li>
                    <li>• Send reminder emails if response rates are low</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Need Additional Help?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-700">support@voluntold.net</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Response within 24 hours</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Start with a small project to test the system</li>
                <li>• Add a few test members before your first broadcast</li>
                <li>• Use clear, descriptive titles for opportunities</li>
                <li>• Include location details and any special instructions</li>
                <li>• Send broadcasts at least 1-2 weeks in advance</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      
            {/* Footer */}
            
            {/* Footer */}
                  <Footer />
    </div>
  )
}