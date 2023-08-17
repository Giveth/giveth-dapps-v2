import { useCallback, useEffect, useState } from 'react';
import { client } from '@/apollo/apolloClient';
import { FETCH_POWER_BOOSTING_INFO } from '@/apollo/gql/gqlPowerBoosting';
import { EDirection } from '@/apollo/types/gqlEnums';
import { IPowerBoosting, IUser } from '@/apollo/types/types';
import { useAppDispatch } from '@/features/hooks';
import { setBoostedProjectsCount } from '@/features/user/user.slice';

export enum EPowerBoostingOrder {
	CreationAt = 'createdAt',
	UpdatedAt = 'updatedAt',
	Percentage = 'Percentage',
}

export interface IBoostedOrder {
	by: EPowerBoostingOrder;
	direction: EDirection;
}

export const useFetchPowerBoostingInfo = (user: IUser) => {
	const [loading, setLoading] = useState(false);
	const [boosts, setBoosts] = useState<IPowerBoosting[]>([]);
	const [order, setOrder] = useState<IBoostedOrder>({
		by: EPowerBoostingOrder.Percentage,
		direction: EDirection.DESC,
	});
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!user || !dispatch) return;

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
	}, [user, order.by, order.direction, dispatch]);

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
	return { loading, boosts, order, setBoosts, setLoading, changeOrder };
};
