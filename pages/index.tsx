import type { FC } from 'react';

import type {
	ICampaign,
	IProjectUpdateWithProject,
} from '@/apollo/types/types';

export interface IHomeRoute {
	projectsPerDate: { total: number };
	totalDonorsCountPerDate: { total: number };
	donationsTotalUsdPerDate: { total: number };
	latestUpdates: IProjectUpdateWithProject[];
	campaigns: ICampaign[];
}

const HomeRoute: FC = () => {
	return <p> Please check Giveth - Crypto Donations mini app</p>;
};

export default HomeRoute;
