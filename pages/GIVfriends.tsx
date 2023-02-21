import { GeneralMetatags } from '@/components/Metatag';
import GIVfriendsIndex from '@/components/views/partnerships/GIVfriendsIndex';
import { GIVfriendsMetatags } from '@/content/metatags';

const GIVfriendsRoute = () => {
	return (
		<>
			<GeneralMetatags info={GIVfriendsMetatags} />
			<GIVfriendsIndex />
		</>
	);
};

export default GIVfriendsRoute;
