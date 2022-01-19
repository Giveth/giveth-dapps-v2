import { ServerStyleSheet } from 'styled-components';
import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from 'next/document';

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

					<meta name='title' content='GIVeconomy' />
					<meta
						name='description'
						content='The GIVeconomy empowers our collective to build the Future of Giving.'
					/>

					<meta property='og:type' content='website' />
					<meta property='og:url' content='http://giveth.io/' />
					<meta property='og:title' content='GIVeconomy' />
					<meta
						property='og:description'
						content='The GIVeconomy empowers our collective to build the Future of Giving.'
					/>
					<meta
						property='og:image'
						content='https://i.ibb.co/HTbdCdd/Thumbnail.png'
					/>

					<meta
						property='twitter:card'
						content='summary_large_image'
					/>
					<meta property='twitter:url' content='http://giveth.io/' />
					<meta property='twitter:title' content='GIVeconomy' />
					<meta
						property='twitter:description'
						content='The GIVeconomy empowers our collective to build the Future of Giving.'
					/>
					<meta
						property='twitter:image'
						content='https://i.ibb.co/HTbdCdd/Thumbnail.png'
					/>
					<meta name='twitter:card' content='summary_large_image' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
