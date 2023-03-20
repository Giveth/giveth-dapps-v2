import styled from 'styled-components';
import { FC, useCallback, useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';

import { Col, Row } from '@giveth/ui-design-system';
import { IUserProfileView } from '../UserProfile.view';
import { EDirection } from '@/apollo/types/gqlEnums';
import BoostsTable from './BoostsTable';
import { IPowerBoosting } from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_POWER_BOOSTING_INFO,
	SAVE_MULTIPLE_POWER_BOOSTING,
	SAVE_POWER_BOOSTING,
} from '@/apollo/gql/gqlPowerBoosting';
import { Loading } from '../projectsTab/ProfileProjectsTab';
import { EmptyPowerBoosting } from './EmptyPowerBoosting';
import GetMoreGIVpowerBanner from './GetMoreGIVpowerBanner';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { sortBoosts } from '@/helpers/givpower';
import { setBoostedProjectsCount } from '@/features/user/user.slice';
import { UserProfileTab } from '../common.sc';
import {
	ContributeCard,
	PublicGIVpowerContributeCard,
} from '@/components/ContributeCard';
import { formatWeiHelper } from '@/helpers/number';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import Routes from '@/lib/constants/Routes';
import { StakingType } from '@/types/config';

export enum EPowerBoostingOrder {
	CreationAt = 'createdAt',
	UpdatedAt = 'updatedAt',
	Percentage = 'Percentage',
}

export interface IBoostedOrder {
	by: EPowerBoostingOrder;
	direction: EDirection;
}

export const ProfileBoostedTab: FC<IUserProfileView> = ({
	user,
	myAccount,
}) => {
	const [loading, setLoading] = useState(false);
	const [boosts, setBoosts] = useState<IPowerBoosting[]>([]);
	const [order, setOrder] = useState<IBoostedOrder>({
		by: EPowerBoostingOrder.Percentage,
		direction: EDirection.DESC,
	});

	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.xDaiValues),
	);
	const { userData } = useAppSelector(state => state.user);
	const boostedProjectsCount = userData?.boostedProjectsCount ?? 0;
	const givPower = sdh.getUserGIVPowerBalance();
	const isZeroGivPower = givPower.balance === '0';
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!user) return;

		const fetchUserBoosts = async () => {
			setLoading(true);
			const { data } = await client.query({
				query: FETCH_POWER_BOOSTING_INFO,
				variables: {
					take: 50,
					skip: 0,
					orderBy: { field: order.by, direction: order.direction },
					userId: parseFloat(user.id || '') || -1,
				},
			});
			setLoading(false);
			if (data?.getPowerBoosting) {
				const powerBoostings: IPowerBoosting[] =
					data.getPowerBoosting.powerBoostings;
				setBoosts(powerBoostings);
				dispatch(setBoostedProjectsCount(powerBoostings.length));
			}
		};
		fetchUserBoosts();
	}, [user, order.by, order.direction]);

	const changeOrder = useCallback(
		(orderBy: EPowerBoostingOrder) => {
			if (orderBy === order.by) {
				setOrder({
					by: orderBy,
					direction:
						order.direction === EDirection.ASC
							? EDirection.DESC
							: EDirection.ASC,
				});
			} else {
				setOrder({
					by: orderBy,
					direction: EDirection.DESC,
				});
			}
		},
		[order.by, order.direction],
	);

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
					{myAccount ? (
						<ContributeCard
							data1={{
								label: 'Projects Boosted',
								value: boostedProjectsCount,
							}}
							data2={{
								label: 'GIVpower',
								value: `${formatWeiHelper(givPower.balance)}`,
							}}
						/>
					) : (
						<PublicGIVpowerContributeCard user={user} />
					)}
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
						link={`${Routes.GIVfarm}/?open=${StakingType.GIV_LM}&chain=gnosis`}
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
						totalAmountOfGIVpower={givPower.balance}
						order={order}
						changeOrder={changeOrder}
						saveBoosts={saveBoosts}
						deleteBoost={deleteBoost}
						myAccount={myAccount}
					/>
				) : (
					<EmptyPowerBoosting myAccount={myAccount} />
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
