// File: src/app/terms/page.tsx - Version 1.0
import Image from 'next/image'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image 
                src="/voluntold-logo.png" 
                alt="Voluntold" 
                width={32} 
                height={32}
                className="h-8 w-auto"
              />
          
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: July 16, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction and Acceptance</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service (&quot;Terms&quot;) govern your use of the Voluntold volunteer management platform (&quot;Service&quot;) operated by Hounsell Inc. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our Service, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700 mb-4">
                If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms, and &quot;you&quot; refers to both you individually and the organization.
              </p>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-700 mb-4">
                Voluntold is a Software-as-a-Service (SaaS) platform that provides volunteer management tools including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Volunteer opportunity scheduling and signup management</li>
                <li>Member roster and contact management</li>
                <li>Email broadcasting and communication tools</li>
                <li>Volunteer hour tracking and reporting</li>
                <li>Polling and feedback collection</li>
                <li>Administrative dashboard and member portal</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with reasonable notice.
              </p>
            </section>

            {/* Pilot Program */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Pilot Program Terms</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-3">3.1 Invitation-Only Access</h3>
              <p className="text-gray-700 mb-4">
                Voluntold is currently available as an invitation-only pilot program to selected volunteer agencies and service clubs. Access to the Service is granted at our sole discretion and may be limited or restricted at any time.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">3.2 No Service Fees</h3>
              <p className="text-gray-700 mb-4">
                During the pilot program period, the Service is provided at no cost to participating organizations. This pilot program is expected to continue through July 2026, after which pricing and billing terms may be introduced.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">3.3 Feedback and Improvement</h3>
              <p className="text-gray-700 mb-4">
                As a pilot program participant, you may be asked to provide feedback, suggestions, or participate in user research to help improve the Service. Your participation in such activities is voluntary but appreciated.
              </p>
            </section>

            {/* User Accounts and Responsibilities */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. User Accounts and Responsibilities</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-3">4.1 Account Creation</h3>
              <p className="text-gray-700 mb-4">
                Organizations may be granted administrator accounts to manage their volunteer programs. Administrators are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Maintaining the security and confidentiality of login credentials</li>
                <li>All activities that occur under their account</li>
                <li>Ensuring accurate and up-to-date information</li>
                <li>Compliance with these Terms by all users within their organization</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">4.2 Member Access</h3>
              <p className="text-gray-700 mb-4">
                Volunteers access the Service through magic link authentication sent to their email addresses. Organizations are responsible for ensuring they have appropriate consent to include volunteers in their system.
              </p>
            </section>

            {/* Acceptable Use */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Acceptable Use Policy</h2>
              <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Send spam, unsolicited communications, or engage in harassment</li>
                <li>Upload or transmit malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
                <li>Use the Service for commercial purposes outside of legitimate volunteer management</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Collect or harvest personal information without proper consent</li>
                <li>Impersonate others or provide false information</li>
              </ul>
            </section>

            {/* Data and Privacy */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data and Privacy</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-3">6.1 Data Ownership</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of all data you input into the Service. We claim no ownership rights over your organization&apos;s volunteer data, member information, or content.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">6.2 Privacy Compliance</h3>
              <p className="text-gray-700 mb-4">
                Our collection, use, and protection of personal information is governed by our{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
                . Organizations are responsible for ensuring they have appropriate consent from volunteers for data collection and processing.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">6.3 Data Security</h3>
              <p className="text-gray-700 mb-4">
                While we implement appropriate security measures to protect your data, you acknowledge that no system is completely secure. You are responsible for maintaining appropriate security practices within your organization.
              </p>
            </section>

            {/* Account Termination */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Account Termination</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-3">7.1 Voluntary Termination</h3>
              <p className="text-gray-700 mb-4">
                You may discontinue use of the Service at any time by simply ceasing to use the platform. To completely remove your organization&apos;s account and all associated data, please contact us at privacy@voluntold.net.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">7.2 Data Management</h3>
              <p className="text-gray-700 mb-4">
                Organization administrators can remove individual volunteer data by deleting member records through the administrative interface. Upon account termination, all organization data will be permanently deleted from our systems.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">7.3 Termination by Us</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to suspend or terminate accounts that violate these Terms, engage in prohibited activities, or for operational reasons with reasonable notice.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-3">8.1 Our Rights</h3>
              <p className="text-gray-700 mb-4">
                The Service, including its software, features, functionality, and design, is owned by Hounsell Inc. and is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">8.2 License to Use</h3>
              <p className="text-gray-700 mb-4">
                We grant you a limited, non-exclusive, non-transferable license to access and use the Service for your organization&apos;s volunteer management purposes during the pilot program period.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">8.3 Your Content</h3>
              <p className="text-gray-700 mb-4">
                You grant us a limited license to host, store, and process your content solely for the purpose of providing the Service. This license terminates when you remove content or terminate your account.
              </p>
            </section>

            {/* Disclaimers and Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Disclaimers and Limitation of Liability</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-3">9.1 Service Disclaimers</h3>
              <p className="text-gray-700 mb-4">
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. As a pilot program, the Service may experience downtime, bugs, or limited functionality. We make no guarantees about service availability, performance, or fitness for any particular purpose.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">9.2 Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, Hounsell Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of revenue, or business interruption, arising from your use of the Service.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">9.3 Maximum Liability</h3>
              <p className="text-gray-700 mb-4">
                Our total liability to you for any claims arising from the Service shall not exceed the amount paid by you for the Service in the twelve months preceding the claim (which during the pilot program is zero).
              </p>
            </section>

            {/* Indemnification */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold harmless Hounsell Inc. from any claims, damages, losses, or expenses arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Your use of the Service in violation of these Terms</li>
                <li>Your violation of any applicable laws or third-party rights</li>
                <li>Any content or data you submit to the Service</li>
                <li>Any disputes between you and your volunteers or members</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Governing Law and Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of the Province of Ontario, Canada, without regard to conflict of law principles. Any disputes arising from these Terms or the Service shall be resolved in the courts of Ontario, Canada.
              </p>
              <p className="text-gray-700 mb-4">
                Before pursuing formal legal action, we encourage you to contact us at privacy@voluntold.net to attempt to resolve any disputes informally.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Changes to These Terms</h2>
              <p className="text-gray-700 mb-4">
                We may update these Terms from time to time. When we make material changes, we will:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Update the &quot;Last updated&quot; date at the top of these Terms</li>
                <li>Notify registered administrators via email</li>
                <li>Post a notice on our Service</li>
                <li>Provide at least 30 days&apos; notice for material changes</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Your continued use of the Service after the effective date of any changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Miscellaneous */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Miscellaneous</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-3">13.1 Entire Agreement</h3>
              <p className="text-gray-700 mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Hounsell Inc. regarding the Service.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">13.2 Severability</h3>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">13.3 Assignment</h3>
              <p className="text-gray-700 mb-4">
                You may not assign or transfer your rights under these Terms without our written consent. We may assign these Terms without restriction.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Hounsell Inc.</strong></p>
                <p className="text-gray-700">Email: privacy@voluntold.net</p>
                <p className="text-gray-700">Subject: Terms of Service Inquiry</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>&copy; 2025 Hounsell Inc. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-900 font-medium">
                Terms of Service
              </Link>
              <a href="mailto:support@voluntold.net" className="hover:text-gray-900">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}