import { GeneralMetatags } from '@/components/Metatag';
import PartnershipsIndex from '@/components/views/partnerships/PartnershipsIndex';
import { partnershipMetatags } from '@/content/metatags';

const PartnershipsRoute = () => {
	return (
		<>
			<GeneralMetatags info={partnershipMetatags} />
			<PartnershipsIndex />
		</>
	);
};

export default PartnershipsRoute;
