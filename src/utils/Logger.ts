import { init, captureException } from '@sentry/browser'

if (typeof window === 'object') {
  // const sentryId = process.env.SENTRY_ID
  const sentryId = 'de31cb89ac0045afbb9d28322cc9c040@o510515'
  init({
    dsn: `https://${sentryId}.ingest.sentry.io/5606310`,
    tracesSampleRate: 1.0, // james: look at dropping this,
    release: 'giveth-dapp@' + process.env.npm_package_version
  })
}

export default { captureException }
