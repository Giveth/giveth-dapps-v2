import { H3, H5 } from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { formatUSD } from '@/lib/helpers';
import { ContributeCardBox, ContributeCardTitles } from './ContributeCard.sc';
import { IUserProfileView } from './views/userProfile/UserProfile.view';
import { useProfileContext } from '@/context/profile.context';
import { getGIVpowerBalanceByAddress } from '@/services/givpower';
import { formatWeiHelper } from '@/helpers/number';

interface IContributeCard {
	data1: { label: string; value: string | number };
	data2: { label: string; value: string | number };
}

export const ContributeCard: FC<IContributeCard> = ({ data1, data2 }) => {
	return (
		<ContributeCardBox>
			<ContributeCardTitles>{data1.label}</ContributeCardTitles>
			<ContributeCardTitles>{data2.label}</ContributeCardTitles>
			<H3 weight={700}>{data1.value}</H3>
			<H5>{data2.value}</H5>
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
				label: formatMessage({ id: 'label.donation_received' }),
				value: `$${formatUSD(user.totalReceived)}`,
			}}
		/>
	);
};

export const PublicGIVpowerContributeCard: FC<IUserProfileView> = () => {
	const { user, myAccount } = useProfileContext();
	const [total, setTotal] = useState('0');
	const { formatMessage } = useIntl();

	useEffect(() => {
		const fetchTotoal = async () => {
			try {
				const res = await getGIVpowerBalanceByAddress([
					user.walletAddress!,
				]);
				setTotal(res[user.walletAddress!]);
			} catch (error) {
				console.log('error on getGIVpowerBalanceByAddress', { error });
			}
		};
		fetchTotoal();
	}, [user]);

	return (
		<ContributeCard
			data1={{
				label: formatMessage({ id: 'label.projects_boosted' }),
				value: user.boostedProjectsCount || 0,
			}}
			data2={{
				label: 'GIVpower',
				value: total !== undefined ? formatWeiHelper(total) : '--',
			}}
		/>
	);
};
