import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can be added here
    return
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes - require authentication
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        
        // Allow all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*'
  ]
}