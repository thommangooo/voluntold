// File: src/components/Header.tsx
// Version: 2.0 - Added Voluntold logo matching home page

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        
        // Get user profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setProfile(profileData)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Image
              src="/voluntold-logo.png"
              alt="Voluntold"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
            {profile?.role === 'super_admin' && (
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Super Admin
              </span>
            )}
            {profile?.role === 'tenant_admin' && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Tenant Admin
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {profile?.first_name} {profile?.last_name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}