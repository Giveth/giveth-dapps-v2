import { H2, H5 } from '@giveth/ui-design-system';
import { FC, useMemo } from 'react';
import { formatUSD } from '@/lib/helpers';
import { ContributeCardBox, ContributeCardTitles } from './ContributeCard.sc';
import { IUserProfileView } from './views/userProfile/UserProfile.view';

interface IContributeCard {
	data1: { label: string; value: string | number };
	data2: { label: string; value: string | number };
}

export const ContributeCard: FC<IContributeCard> = ({ data1, data2 }) => {
	return (
		<ContributeCardBox>
			<ContributeCardTitles>{data1.label}</ContributeCardTitles>
			<ContributeCardTitles>{data2.label}</ContributeCardTitles>
			<H2>{data1.value}</H2>
			<H5>{data2.value}</H5>
		</ContributeCardBox>
	);
};

export const DonateContributeCard: FC<IUserProfileView> = ({ user }) => (
	<ContributeCard
		data1={{ label: 'donations', value: user.donationsCount || 0 }}
		data2={{
			label: 'Total amount donated',
			value: `${formatUSD(user.totalDonated)}`,
		}}
	/>
);

export const ProjectsContributeCard: FC<IUserProfileView> = ({ user }) => (
	<ContributeCard
		data1={{ label: 'Projects', value: user.projectsCount || 0 }}
		data2={{
			label: 'Donation received',
			value: `${formatUSD(user.totalReceived)}`,
		}}
	/>
);

export const PublicGIVpowerContributeCard: FC<IUserProfileView> = ({
	user,
}) => {
	const total = useMemo(() => {
		return 100;
	}, [user]);

	return (
		<ContributeCard
			data1={{
				label: 'total Amount of GIVpower',
				value: total,
			}}
			data2={{
				label: 'Projects boosted',
				value: `${formatUSD(user.boostedProjectsCount)}`,
			}}
		/>
	);
};
