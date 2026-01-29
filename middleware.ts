import { NextResponse, type NextRequest } from 'next/server';

// "Nuclear" mode: force every navigable route to the 404 page.
// We intentionally allow Next.js internals, API routes, and static files
// so the 404 page can still render with its assets.
export function middleware(request: NextRequest) {
	const { nextUrl } = request;
	const { pathname } = nextUrl;

	// Avoid loops: allow already-on-404 (including locale-prefixed 404).
	if (pathname === '/404' || pathname.endsWith('/404')) {
		return NextResponse.next();
	}

	// Allow Next internals and API routes.
	if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
		return NextResponse.next();
	}

	// Allow requests for "real files" (e.g. /favicon.ico, /manifest.json, /assets/*.pdf).
	if (/\.[^/]+$/.test(pathname)) {
		return NextResponse.next();
	}

	const url = nextUrl.clone();
	const locale = nextUrl.locale;

	// Preserve locale prefix if the incoming request used one (e.g. /en/* -> /en/404).
	if (
		locale &&
		(pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
	) {
		url.pathname = `/${locale}/404`;
	} else {
		url.pathname = '/404';
	}

	return NextResponse.redirect(url);
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
