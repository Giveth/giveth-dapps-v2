import Head from 'next/head';
import HomeView from '../src/components/views/Home.view';

export default function HomeRoute() {
	return (
		<>
			<Head>
				<title>GIVeconomy</title>
			</Head>
			<HomeView />
		</>
	);
}
