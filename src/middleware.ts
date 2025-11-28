import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If not logged in, redirect to login
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // If logged in, get user profile to check role
  if (session) {
    const { data: user } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', session.user.id)
      .single()

    const userType = user?.user_type

    // Role-based routing
    if (userType === 'graduates') {
      // Graduates can access student dashboard, block mentor dashboard
      if (request.nextUrl.pathname.startsWith('/dashboard/mentor')) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard/student'
        return NextResponse.redirect(url)
      }
    } else if (userType === 'mentor') {
      // Mentors can access mentor dashboard, block student dashboard
      if (request.nextUrl.pathname.startsWith('/dashboard/student')) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard/mentor'
        return NextResponse.redirect(url)
      }
    }

    // After login, redirect based on role
    if (request.nextUrl.pathname === '/auth/callback') {
      const url = request.nextUrl.clone()
      if (userType === 'graduates') {
        url.pathname = '/dashboard/student'
      } else if (userType === 'mentor') {
        url.pathname = '/dashboard/mentor'
      } else {
        url.pathname = '/dashboard'
      }
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
