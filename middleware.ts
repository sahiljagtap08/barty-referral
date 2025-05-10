import { NextRequest, NextResponse } from "next/server";

// Only keep a minimal middleware that doesn't do any auth checks
export async function middleware(req: NextRequest) {
  // Just pass through all requests
  return NextResponse.next();
}

// Keep this matcher config to ensure the middleware doesn't 
// run on static assets which improves performance
export const config = {
  matcher: [
    /*
      Match all request paths except for the ones starting with:
      - _next/static (static files)
      - _next/image (image optimization files)
      - favicon.ico (favicon file)
    */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};