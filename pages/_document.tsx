import { ServerStyleSheet } from 'styled-components';
import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from 'next/document';
import Script from 'next/script';

export default class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: App => props =>
						sheet.collectStyles(<App {...props} />),
				});

			const initialProps = await Document.getInitialProps(ctx);
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				),
			};
		} finally {
			sheet.seal();
		}
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel='shortcut icon' href='/favicon.svg' />
					{/* Base Mini App Embed Metadata */}
					<meta
						name='fc:miniapp'
						content={JSON.stringify({
							version: 'next',
							imageUrl:
								'https://giveth.mypinata.cloud/ipfs/QmQ9sfdevs9vS7czBXBfDaRRPhU8a6T5gXxF3NDGSnQe1c',
							button: {
								title: 'Donate Now',
								action: {
									type: 'launch_miniapp',
									name: 'Giveth',
									url: 'https://giveth.io',
								},
							},
						})}
					/>
					<script
						type='text/javascript'
						dangerouslySetInnerHTML={{
							__html: `if (
								window?.location &&
								(window.location.pathname.toLowerCase().startsWith('/giv') || window.location.pathname.toLowerCase().startsWith('/nft'))
							) {
								const r = document.querySelector(':root');
								r.style.setProperty('--bgColor', '#090446');
								r.style.setProperty('--color', '#FFFFFF');
								r.style.setProperty('--scrollColor', '#754CFF');
								r.style.setProperty('--scrollHoverColor', '#211985');
							}`,
						}}
					></script>
					{/* Google Tag Manager */}
					<Script
						id='gtm-script'
						strategy='afterInteractive'
						dangerouslySetInnerHTML={{
							__html: `
								(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
								new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
								j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
								'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
								})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}');
							`,
						}}
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
