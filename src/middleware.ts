import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check if user is super admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Protect tenant admin routes
  if (request.nextUrl.pathname.startsWith('/tenant')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check if user is tenant admin or super admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['tenant_admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/tenant/:path*']
}