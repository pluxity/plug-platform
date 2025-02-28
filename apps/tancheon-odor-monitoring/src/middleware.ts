// apps/tancheon-odor-monitoring/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
    const url = request.nextUrl.clone()

  if (!token && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if(token){
      try {
        const response = await fetch(`${request.url}/api/auth`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

          if(request.nextUrl.pathname === "/login" && response.ok){
               return NextResponse.redirect(new URL("/", request.url))
           }

          if(request.nextUrl.pathname.startsWith('/admin') && !response.ok){
              return NextResponse.redirect(new URL('/', request.url));
          }

      } catch (error) {
          console.log("API요청 실패", error);
      }

  }
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};
