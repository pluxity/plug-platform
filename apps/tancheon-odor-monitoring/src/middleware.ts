import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();
    
  if (!token && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
      try {
        const response = await fetch(new URL('/api/auth', request.url), { // 절대 경로로 수정
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (request.nextUrl.pathname === '/login') return NextResponse.next();
          return NextResponse.redirect(new URL('/login', request.url));
        }

        const data = await response.json();

        if (request.nextUrl.pathname === '/login') {
          return NextResponse.redirect(new URL('/', request.url));
        }

        if (request.nextUrl.pathname.startsWith('/admin') && data.user.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch (error) {
        console.log('API요청 실패', error);
      }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};
