import GIVfarmView from '@/components/views/Farm.view';
import Head from 'next/head';

export default function GIVfarmRoute() {
	return (
		<>
			<Head>
				<title>GIVfarm</title>
			</Head>
			<GIVfarmView />
		</>
	);
}
