import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const role = request.cookies.get('role')?.value;

  if (url.pathname.startsWith('/patient') && role !== 'patient') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/therapist') && role !== 'therapist') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/admin') && role !== 'admin') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/patient/:path*', '/therapist/:path*', '/admin/:path*'],
};
