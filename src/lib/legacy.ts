import legacyRedirectSources from '../../scripts/legacy-redirect-sources.json';

// Public build-time switch: use the same value for Next redirects and rendering.
export const isLegacyMode = process.env.NEXT_PUBLIC_LEGACY_MODE === 'true';
export const NEW_GIVETH_URL = 'https://giveth.io/';

// Mirrors the Next redirect sources (":slug" = one segment, "/:path*" = any
// trailing segments) so client-side navigation is blocked the same way.
const legacyBlockedPatterns = legacyRedirectSources.map(
	source =>
		new RegExp(
			'^' +
				source
					.replace(/\/:[A-Za-z0-9_]+\*$/, '(?:/.*)?')
					.replace(/:[A-Za-z0-9_]+/g, '[^/]+') +
				'/?$',
		),
);

export const isLegacyBlockedPath = (asPath: string) => {
	const pathname = asPath.split(/[?#]/)[0];
	return legacyBlockedPatterns.some(pattern => pattern.test(pathname));
};
