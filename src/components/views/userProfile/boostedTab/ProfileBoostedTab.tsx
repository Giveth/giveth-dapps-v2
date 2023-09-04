import styled from 'styled-components';
import { FC, useCallback } from 'react';
import { captureException } from '@sentry/nextjs';

import { Col, Row } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { IUserProfileView } from '../UserProfile.view';
import BoostsTable from './BoostsTable';
import { IPowerBoosting } from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import {
	SAVE_MULTIPLE_POWER_BOOSTING,
	SAVE_POWER_BOOSTING,
} from '@/apollo/gql/gqlPowerBoosting';
import { Loading } from '../projectsTab/ProfileProjectsTab';
import { EmptyPowerBoosting } from './EmptyPowerBoosting';
import GetMoreGIVpowerBanner from './GetMoreGIVpowerBanner';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	getGIVpowerLink,
	getTotalGIVpower,
	sortBoosts,
} from '@/helpers/givpower';
import { setBoostedProjectsCount } from '@/features/user/user.slice';
import { UserProfileTab } from '../common.sc';
import { ContributeCard } from '@/components/ContributeCard';
import { formatWeiHelper } from '@/helpers/number';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { useFetchPowerBoostingInfo } from './useFetchPowerBoostingInfo';
import { useProfileContext } from '@/context/profile.context';

export const ProfileBoostedTab: FC<IUserProfileView> = () => {
	const { user } = useProfileContext();
	const { loading, boosts, order, setBoosts, setLoading, changeOrder } =
		useFetchPowerBoostingInfo(user);
	const { chainId } = useWeb3React();
	const { userData } = useAppSelector(state => state.user);
	const boostedProjectsCount = userData?.boostedProjectsCount ?? 0;
	const values = useAppSelector(state => state.subgraph);
	const givPower = getTotalGIVpower(values);
	const isZeroGivPower = givPower.total.isZero();
	const dispatch = useAppDispatch();

	const saveBoosts = useCallback(
		async (newBoosts: IPowerBoosting[]) => {
			setLoading(true);
			const percentages = newBoosts.map(boost =>
				Number(boost.percentage),
			);
			const projectIds = newBoosts.map(boost => Number(boost.project.id));
			//fix calculation error
			let indexOfMax = 0;
			let sum = 0;
			for (let i = 0; i < percentages.length; i++) {
				const percentage = percentages[i];
				if (percentage > percentages[indexOfMax]) indexOfMax = i;
				sum += percentage;
			}
			const error = 100 - sum;
			if (error > 0.00001 || error < -0.00001) {
				percentages[indexOfMax] += error;
			}
			try {
				const res = await client.mutate({
					mutation: SAVE_MULTIPLE_POWER_BOOSTING,
					variables: {
						percentages,
						projectIds,
					},
				});
				if (res.data) {
					const setMultiplePowerBoosting: IPowerBoosting[] =
						res.data.setMultiplePowerBoosting;
					const sortedBoosts = sortBoosts(
						setMultiplePowerBoosting,
						order,
					);
					setBoosts(sortedBoosts);
					setLoading(false);
					return true;
				}
				setLoading(false);
				return false;
			} catch (error) {
				console.log({ error });
				captureException(error, {
					tags: {
						section: 'Save manage power boosting',
					},
				});
				setLoading(false);
				return false;
			}
		},
		[order],
	);

	const deleteBoost = useCallback(
		async (id: string) => {
			setLoading(true);
			const tempBoosts = [...boosts];
			let deletedBoost = tempBoosts.find(boost => boost.id === id);

			try {
				const res = await client.mutate({
					mutation: SAVE_POWER_BOOSTING,
					variables: {
						percentage: 0,
						projectId: Number(deletedBoost?.project.id),
					},
				});
				if (res.data) {
					const newBoosts: IPowerBoosting[] =
						res.data.setSinglePowerBoosting;
					const sortedBoosts = sortBoosts(newBoosts, order);
					setBoosts(sortedBoosts);
					dispatch(setBoostedProjectsCount(sortedBoosts.length));
					setLoading(false);
					return true;
				}
				setLoading(false);
				return false;
			} catch (error) {
				console.log({ error });
				captureException(error, {
					tags: {
						section: 'Save manage power boosting',
					},
				});
				setLoading(false);
				return false;
			}
		},
		[boosts, order],
	);

	return (
		<UserProfileTab>
			<Row>
				<Col lg={6}>
					<ContributeCard
						data1={{
							label: 'Projects Boosted',
							value: boostedProjectsCount,
						}}
						data2={{
							label: 'GIVpower',
							value: `${formatWeiHelper(givPower.total)}`,
						}}
					/>
				</Col>
			</Row>
			{boostedProjectsCount &&
			boostedProjectsCount > 0 &&
			isZeroGivPower ? (
				<ZeroGivPowerContainer>
					<InlineToast
						title='Your GIVpower balance is zero!'
						message='Stake GIV to boost these projects again.'
						type={EToastType.Warning}
						link={getGIVpowerLink(chainId)}
						linkText='Stake GIV'
					/>
				</ZeroGivPowerContainer>
			) : (
				<Margin />
			)}
			<PowerBoostingContainer>
				{loading && <Loading />}
				{boostedProjectsCount && boostedProjectsCount > 0 ? (
					<BoostsTable
						boosts={boosts}
						totalAmountOfGIVpower={givPower.total}
						order={order}
						changeOrder={changeOrder}
						saveBoosts={saveBoosts}
						deleteBoost={deleteBoost}
						myAccount={true}
					/>
				) : (
					<EmptyPowerBoosting myAccount={true} />
				)}
			</PowerBoostingContainer>
			<GetMoreGIVpowerBanner />
		</UserProfileTab>
	);
};

// const CustomContributeCard = styled(ContributeCard)`
// 	width: 100%;
// 	${mediaQueries.tablet} {
// 		width: 614px;
// 	}
// `;

const Margin = styled.div`
	height: 70px;
`;

const ZeroGivPowerContainer = styled.div`
	margin: 50px 0 34px;
`;

export const PowerBoostingContainer = styled.div`
	position: relative;
	margin-bottom: 40px;
	overflow-x: auto;
`;
