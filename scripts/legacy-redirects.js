// Keep read-only siblings (project details, cause browsing, account tabs) open.
// The list lives in legacy-redirect-sources.json so src/lib/legacy.ts can apply
// the same rules to client-side navigation (Next redirects only run on full
// page loads and data fetches). It includes the /test1 and /test2 transaction
// playgrounds so they cannot bypass the disable sweep.
const sources = require('./legacy-redirect-sources.json');

// Not permanent: browsers cache 308s forever, which would outlive the switch.
module.exports = enabled =>
	enabled
		? sources.map(source => ({
				source,
				destination: '/',
				permanent: false,
			}))
		: [];
