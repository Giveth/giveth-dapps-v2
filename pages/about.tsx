import Head from 'next/head';
import AboutIndex from '@/components/views/about/AboutIndex';
import { aboutMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

const AboutRoute = () => {
	return (
		<>
			<Head>
				<GeneralMetatags info={aboutMetatags} />
			</Head>
			<AboutIndex />
		</>
	);
};

export default AboutRoute;
