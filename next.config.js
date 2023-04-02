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

const moduleExports = withBundleAnalyzer({
	// Your existing module.exports
	reactStrictMode: true,
	images: {
		domains: [
			'gateway.pinata.cloud',
			'giveth.mypinata.cloud',
			'static.tgbwidget.com',
			'images.unsplash.com',
			'd2m0e1zy3fwxmp.cloudfront.net', // temporal for CHANGE default image
			'i.imgur.com',
			'd2jyzh4ah9xf6q.cloudfront.net', // temporal for CHANGE default image
			'static.tgb-preprod.com',
			'tgb-preproduction-formio.s3.amazonaws.com',
			'dashboard.tgb-preprod.com',
			'cdn-images-1.medium.com',
			'ipfs.io',
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
		];
	},
	webpack: (config, { isServer, dev }) => {
		if (isServer && !dev) {
			generateRobotsTxt();
		}
		return config;
	},
	i18n: {
		locales: ['ca', 'en', 'es'],
		defaultLocale: 'en',
		localeDetection: false,
	},
});

const sentryWebpackPluginOptions = {
	// Additional config options for the Sentry Webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, org, project, authToken, configFile, stripPrefix,
	//   urlPrefix, include, ignore
	release: pjson.version,
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
