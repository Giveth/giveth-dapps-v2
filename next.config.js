// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});
var pjson = require('./package.json');
const generateRobotsTxt = require('./scripts/generate-robots-txt');

const defaultLocale = 'en';
const locales = ['ca', 'en', 'es'];

const moduleExports = withBundleAnalyzer({
	// Your existing module.exports
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{ protocol: 'https', port: '', hostname: 'gateway.pinata.cloud' },
			{ protocol: 'https', port: '', hostname: 'giveth.mypinata.cloud' },
			{ protocol: 'https', port: '', hostname: 'static.tgbwidget.com' },
			{ protocol: 'https', port: '', hostname: 'images.unsplash.com' },
			{ protocol: 'https', port: '', hostname: 'unicorn.mypinata.cloud' },
			{ protocol: 'https', port: '', hostname: 'images.ctfassets.net' },
			{
				protocol: 'https',
				port: '',
				hostname: 'd2m0e1zy3fwxmp.cloudfront.net',
			}, // temporal for CHANGE default image
			{ protocol: 'https', port: '', hostname: 'i.imgur.com' },
			{
				protocol: 'https',
				port: '',
				hostname: 'd2jyzh4ah9xf6q.cloudfront.net',
			}, // temporal for CHANGE default image
			{ protocol: 'https', port: '', hostname: 'static.tgb-preprod.com' },
			{
				protocol: 'https',
				port: '',
				hostname: 'tgb-preproduction-formio.s3.amazonaws.com',
			},
			{
				protocol: 'https',
				port: '',
				hostname: 'dashboard.tgb-preprod.com',
			},
			{
				protocol: 'https',
				port: '',
				hostname: 'cdn-images-1.medium.com',
			},
			{ protocol: 'https', port: '', hostname: 'ipfs.io' },
			{ protocol: 'https', port: '', hostname: '*.amazonaws.com' },
		],
	},
	compiler: {
		// ssr and displayName are configured by default
		styledComponents: true,
		// removeConsole: {
		// 	exclude: ['error'],
		// },
	},
	redirects: () => {
		return [
			{
				source: '/user',
				destination: '/account',
				permanent: true,
			},
			{
				source: '/donate',
				destination: '/projects',
				permanent: false,
			},
			{
				source: '/quests',
				destination:
					'https://giveth.notion.site/Giveth-s-Galactic-Impact-Quests-f8ef267e16d14acfaba41b43183c17de',
				permanent: false,
			},
			{
				source: '/projects',
				destination: '/projects/all',
				permanent: true,
			},
			{
				source: '/qf',
				destination: '/qf/all',
				permanent: true,
			},
			{
				source: '/QuadraticForce',
				destination: '/assets/Giveth_Report_QF_2024.this.one.pdf',
				permanent: false,
			},
			{
				source: '/qfguide',
				destination:
					'https://giveth.notion.site/Giveth-Quadratic-Funding-3478aa27eb094a699f9ddd6a8b611027',
				permanent: false,
			},
		];
	},
	webpack: (config, { isServer, dev }) => {
		if (isServer && !dev) {
			generateRobotsTxt();
		}
		return config;
	},
	i18n: {
		locales,
		defaultLocale,
		localeDetection: false,
	},
	headers: () => {
		return [
			{
				// Adding CORS headers for /manifest.json
				source: '/manifest.json',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: 'https://app.safe.global',
					},
					{ key: 'Access-Control-Allow-Methods', value: 'GET' },
					{
						key: 'Access-Control-Allow-Headers',
						value: 'X-Requested-With, content-type, Authorization',
					},
				],
			},
		];
	},
});

const sentryWebpackPluginOptions = {
	// Additional config options for the Sentry Webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, org, project, authToken, configFile, stripPrefix,
	//   urlPrefix, include, ignore
	org: process.env.NEXT_PUBLIC_SENTRY_ORG,
	project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
	authToken: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
	silent: true, // Suppresses all logs
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);

// module.exports = moduleExports;
