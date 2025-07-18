// File: src/app/privacy/page.tsx - Version 1.1
import Image from 'next/image'
import Link from 'next/link'

export default function PrivacyPolicy() {
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: July 16, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Hounsell Inc. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the Voluntold volunteer management platform (&quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our Service.
              </p>
              <p className="text-gray-700 mb-4">
                Voluntold is a Software-as-a-Service (SaaS) platform that enables volunteer organizations (&quot;Organizations&quot;) to manage their volunteers, schedule opportunities, and coordinate activities. We are committed to protecting your privacy in accordance with Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA) and other applicable privacy laws.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">We collect the following types of personal information:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address</li>
                <li><strong>Volunteer Information:</strong> Skills, availability, volunteer preferences, and position within the organization</li>
                <li><strong>Activity Data:</strong> Volunteer hours worked, event attendance, opportunity signups, and poll responses</li>
                <li><strong>Authentication Data:</strong> Login credentials for organization administrators</li>
                <li><strong>Communications:</strong> Messages sent through our platform and email interactions</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">2.2 Technical Information</h3>
              <p className="text-gray-700 mb-4">We automatically collect certain technical information:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>IP addresses, browser type, and device information</li>
                <li>Usage patterns and interaction data with our Service</li>
                <li>Log files and error reports for system maintenance</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your personal information for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Service Delivery:</strong> To provide volunteer management services, coordinate opportunities, and facilitate communications</li>
                <li><strong>Account Management:</strong> To create and maintain user accounts, authenticate users, and provide customer support</li>
                <li><strong>Communications:</strong> To send volunteer opportunity notifications, system updates, and organizational communications</li>
                <li><strong>Analytics:</strong> To improve our Service, analyze usage patterns, and develop new features</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
              </ul>
            </section>

            {/* Data Organization and Separation */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Multi-Tenant Data Organization</h2>
              <p className="text-gray-700 mb-4">
                Voluntold operates as a multi-tenant platform, meaning multiple Organizations use our Service. We maintain strict data separation between Organizations:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Each Organization&apos;s data is logically separated and accessible only to authorized users within that Organization</li>
                <li>Organization administrators can only access data belonging to their own Organization</li>
                <li>Volunteers&apos; personal information is only shared with the Organizations they choose to volunteer with</li>
                <li>Cross-organizational data sharing occurs only with explicit consent</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">We may share your personal information in the following circumstances:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Within Your Organization:</strong> With authorized administrators and volunteers within your chosen Organization(s)</li>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our Service (such as cloud hosting and email delivery services)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of business assets</li>
                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We do not sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication systems</li>
                <li>Secure cloud infrastructure with reputable providers</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Data Retention and Deletion</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-3">7.1 Volunteer Data</h3>
              <p className="text-gray-700 mb-4">
                Individual volunteer data is retained as long as you remain active with an Organization. Your personal information is deleted when:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>An Organization administrator removes you from their volunteer roster</li>
                <li>You request deletion of your information</li>
                <li>An Organization&apos;s account is terminated</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">7.2 Organization Data</h3>
              <p className="text-gray-700 mb-4">
                Organization data is retained throughout the duration of their subscription to our Service. When an Organization requests account termination, all associated data is permanently deleted by our super administrators upon request by the Organization&apos;s administrator.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">7.3 System Logs</h3>
              <p className="text-gray-700 mb-4">
                Technical logs and system data are retained for up to 90 days for security and operational purposes.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Your Privacy Rights</h2>
              <p className="text-gray-700 mb-4">Under PIPEDA and applicable privacy laws, you have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information we hold</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete personal information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal and operational requirements)</li>
                <li><strong>Portability:</strong> Request a copy of your personal information in a portable format</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for processing where consent is the legal basis</li>
                <li><strong>Complaint:</strong> File a complaint with the Privacy Commissioner of Canada if you believe your privacy rights have been violated</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us at privacy@voluntold.net. We will respond to your request within 30 days.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">Our Service uses the following third-party services:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Supabase:</strong> Database and authentication services (privacy policy available at supabase.com)</li>
                <li><strong>Resend:</strong> Email delivery services (privacy policy available at resend.com)</li>
                <li><strong>Vercel:</strong> Application hosting services (privacy policy available at vercel.com)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                These services are bound by data processing agreements and are required to protect your information according to applicable privacy laws.
              </p>
            </section>

            {/* International Transfers */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Some of our service providers may process data outside of Canada. When we transfer personal information internationally, we ensure appropriate safeguards are in place, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Data processing agreements with adequate protection clauses</li>
                <li>Transfers only to jurisdictions with adequate privacy protections</li>
                <li>Implementation of additional security measures as required</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Children&apos;s Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Service is not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
              </p>
              <p className="text-gray-700 mb-4">
                For volunteers between 13 and 18 years of age, we recommend that Organizations obtain appropriate parental consent before collecting personal information.
              </p>
            </section>

            {/* Policy Updates */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. When we make material changes, we will:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Update the &quot;Last updated&quot; date at the top of this policy</li>
                <li>Notify registered users via email</li>
                <li>Post a notice on our Service</li>
                <li>Obtain consent for material changes where required by law</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Your continued use of our Service after the effective date of any changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Hounsell Inc.</strong></p>
                <p className="text-gray-700">Privacy Officer</p>
                <p className="text-gray-700">Email: privacy@voluntold.net</p>
                <p className="text-gray-700 mt-2">
                  For complaints about privacy practices, you may also contact the Privacy Commissioner of Canada at: {' '}
                  <a href="https://www.priv.gc.ca" className="text-blue-600 hover:text-blue-700">
                    priv.gc.ca
                  </a>
                </p>
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
              <Link href="/privacy" className="hover:text-gray-900 font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-900">
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