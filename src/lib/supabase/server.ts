// File: src/lib/supabase/server.ts
// Version: v2
// Purpose: Server-side Supabase client for API routes (compatible with auth-helpers-nextjs)

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  
  return createServerComponentClient({ 
    cookies: () => cookieStore 
  })
}