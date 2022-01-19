import GIVgardenView from '@/components/views/Garden.view';
import Head from 'next/head';

export default function GIVgardenRoute() {
	return (
		<>
			<Head>
				<title>GIVgarden</title>
			</Head>
			<GIVgardenView />
		</>
	);
}
