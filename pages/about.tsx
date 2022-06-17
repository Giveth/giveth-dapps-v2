import AboutIndex from '@/components/views/about/AboutIndex';
import { aboutMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

const AboutRoute = () => {
	return (
		<>
			<GeneralMetatags info={aboutMetatags} />
			<AboutIndex />
		</>
	);
};

export default AboutRoute;
