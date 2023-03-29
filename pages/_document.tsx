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
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
