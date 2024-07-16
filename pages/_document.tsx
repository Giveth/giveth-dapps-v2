import { ServerStyleSheet } from 'styled-components';
import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from 'next/document';
import { GoogleTagManager } from '@next/third-parties/google';
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
				<GoogleTagManager gtmId='GTM-KSWSWXTW' />
				<Head>
					<link rel='shortcut icon' href='/favicon.svg' />
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
            })(window,document,'script','dataLayer','GTM-KSWSWXTW');
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
