import GIVstreamView from '@/components/views/Stream.view';
import Head from 'next/head';

export default function GIVstreamRoute() {
	return (
		<>
			<Head>
				<title>GIVstream</title>
			</Head>
			<GIVstreamView />
		</>
	);
}
