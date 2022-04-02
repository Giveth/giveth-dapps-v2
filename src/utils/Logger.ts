import { init, captureException } from '@sentry/browser';

if (typeof window === 'object') {
	const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
	init({
		dsn: sentryDsn,
		tracesSampleRate: 1.0, // james: look at dropping this,
		release: 'giveth-dapp@' + process.env.npm_package_version,
	});
}

export default { captureException };
