// File: src/components/Footer.tsx - Version 1.2
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Voluntold</h3>
            <p className="text-gray-400">Free online sign-up sheets and member polling platform for nonprofits, churches, schools, and community organizations.</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/features/signup-sheets" className="hover:text-white">Sign-up Sheets</a></li>
              <li><a href="/features/member-polling" className="hover:text-white">Member Polling</a></li>
              <li><a href="/features/document-library" className="hover:text-white">Document Library</a></li>
              <li><a href="/features/easy-for-all" className="hover:text-white">Easy For All to Use</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Organizations</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/nonprofit" className="hover:text-white">Nonprofits</a></li>
              <li><a href="/churches" className="hover:text-white">Churches</a></li>
              <li><a href="/schools" className="hover:text-white">Schools</a></li>
              <li><a href="/community" className="hover:text-white">Community Groups</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Voluntold. All rights reserved. Free online sign-up sheets and member polling for organizations.</p>
        </div>
      </div>
    </footer>
  )
}