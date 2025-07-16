import { H3, H5 } from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { formatUSD } from '@/lib/helpers';
import { ContributeCardBox, ContributeCardTitles } from './ContributeCard.sc';
import { IUserProfileView } from './views/userProfile/UserProfile.view';
import { useProfileContext } from '@/context/profile.context';
import { formatWeiHelper } from '@/helpers/number';

interface IContributeCard {
	data1: { label: string; value: string | number };
	data2: { label: string; value: string | number };
	data3?: { label: string; value: string | number };
}

export const ContributeCard: FC<IContributeCard> = ({
	data1,
	data2,
	data3,
}) => {
	return (
		<ContributeCardBox
			$gridTemplateColumns={data3 ? '1fr 1fr 1fr' : '1fr 1fr'}
		>
			<ContributeCardTitles>{data1.label}</ContributeCardTitles>
			<ContributeCardTitles>{data2.label}</ContributeCardTitles>
			{data3 && (
				<ContributeCardTitles>{data3.label}</ContributeCardTitles>
			)}
			<H3 weight={700}>{data1.value}</H3>
			<H5>{data2.value}</H5>
			{data3 && <H5>{data3.value}</H5>}
		</ContributeCardBox>
	);
};

export const DonateContributeCard: FC<IUserProfileView> = () => {
	const { user } = useProfileContext();
	const { formatMessage } = useIntl();

	return (
		<ContributeCard
			data1={{
				label: formatMessage({ id: 'label.donations' }),
				value: user.donationsCount || 0,
			}}
			data2={{
				label: formatMessage({ id: 'label.total_amount_donated' }),
				value: `$${formatUSD(user.totalDonated)}`,
			}}
		/>
	);
};

export const ProjectsContributeCard: FC<IUserProfileView> = () => {
	const { user } = useProfileContext();
	const { formatMessage } = useIntl();
	return (
		<ContributeCard
			data1={{
				label: formatMessage({ id: 'label.projects' }),
				value: user.projectsCount || 0,
			}}
			data2={{
				label: formatMessage({ id: 'label.donations_received' }),
				value: `$${formatUSD(user.totalReceived)}`,
			}}
		/>
	);
};

export const PublicGIVpowerContributeCard: FC<IUserProfileView> = () => {
	const { user, givpowerBalance } = useProfileContext();
	const { formatMessage } = useIntl();

	return (
		<ContributeCard
			data1={{
				label: formatMessage({ id: 'label.projects_boosted' }),
				value: user.boostedProjectsCount || 0,
			}}
			data2={{
				label: 'GIVpower',
				value:
					givpowerBalance !== undefined
						? formatWeiHelper(givpowerBalance)
						: '--',
			}}
		/>
	);
};

export const CausesContributeCard: FC<IUserProfileView> = () => {
	const { user } = useProfileContext();
	const { formatMessage } = useIntl();

	console.log('user', user);
	return (
		<ContributeCard
			data1={{
				label: formatMessage({ id: 'label.causes' }),
				value: user.ownedCausesCount || 0,
			}}
			data2={{
				label: formatMessage({ id: 'label.total_raised' }),
				value: `$${formatUSD(user.totalCausesRaised || 0)}`,
			}}
			data3={{
				label: formatMessage({ id: 'label.cause.total_distributed' }),
				value: `$${formatUSD(user.totalCausesDistributed || 0)}`,
			}}
		/>
	);
};
