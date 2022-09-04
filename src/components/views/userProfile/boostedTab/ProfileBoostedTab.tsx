import { H5, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useEffect, useState } from 'react';
import {
	ContributeCard,
	ContributeCardTitles,
	UserProfileTab,
} from '../common.sc';
import { IUserProfileView } from '../UserProfile.view';
import { formatWeiHelper } from '@/helpers/number';
import { EDirection } from '@/apollo/types/gqlEnums';
import BoostsTable from './BoostsTable';
import { IBoostedProject } from '@/apollo/types/gqlTypes';
import { getRequest } from '@/helpers/requests';

export enum EBoostedOrderBy {
	Percentage = 'percentage',
}

export interface IBoostedOrder {
	by: EBoostedOrderBy;
	direction: EDirection;
}

export const ProfileBoostedTab: FC<IUserProfileView> = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [boosts, setBoosts] = useState<IBoostedProject[]>([]);
	const [order, setOrder] = useState<IBoostedOrder>({
		by: EBoostedOrderBy.Percentage,
		direction: EDirection.DESC,
	});

	const totalAmountOfGIVpower = '7989240000000000000000';

	const changeOrder = (orderBy: EBoostedOrderBy) => {
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
	};

	useEffect(() => {
		if (!user) return;

		const fetchUserBoosts = async () => {
			setLoading(true);
			const res = await getRequest('/api/boostedProjects');
			setLoading(false);
			const boostedProjects: IBoostedProject[] = res.boostedProjects;
			console.log('boostedProjects', boostedProjects);
			setBoosts(boostedProjects);
		};
		fetchUserBoosts().then();
	}, [user, order.by, order.direction]);

	return (
		<UserProfileTab>
			<CustomContributeCard>
				<ContributeCardTitles>
					~total Amount of GIVpower
				</ContributeCardTitles>
				<ContributeCardTitles>Project boosted</ContributeCardTitles>
				<H5>{formatWeiHelper(totalAmountOfGIVpower)}</H5>
				<H5>8</H5>
			</CustomContributeCard>
			<BoostsTable
				boosts={boosts}
				totalAmountOfGIVpower={totalAmountOfGIVpower}
				order={order}
				changeOrder={changeOrder}
			/>
		</UserProfileTab>
	);
};

const CustomContributeCard = styled(ContributeCard)`
	width: 100%;
	${mediaQueries.tablet} {
		width: 614px;
	}
`;
