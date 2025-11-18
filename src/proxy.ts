import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const assetExtensionPattern = /\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|txt)$/i;

    // Allow static assets to bypass the middleware
    if (
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico' ||
        assetExtensionPattern.test(pathname)
    ) {
        return NextResponse.next();
    }

    // Get token from cookies or headers
    const token =
        request.cookies.get('auth_token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

    // Public routes that don't require authentication
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If accessing a public route, allow it
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // If no token and trying to access protected route, redirect to login
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If token exists, allow access
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api).*)'],
};
