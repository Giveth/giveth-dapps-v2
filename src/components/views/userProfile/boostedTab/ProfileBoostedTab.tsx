import { H5, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useEffect, useState } from 'react';
import {
	ContributeCard,
	ContributeCardTitles,
	UserProfileTab,
} from '../common.sc';
import { EOrderBy, IOrder, IUserProfileView } from '../UserProfile.view';
import { formatWeiHelper } from '@/helpers/number';
import { EDirection } from '@/apollo/types/gqlEnums';

export const ProfileBoostedTab: FC<IUserProfileView> = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});

	const TotalAmountOfGIVpower = '7989240000000000000000';

	const changeOrder = (orderBy: EOrderBy) => {
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
	}, [user, order.by, order.direction]);

	return (
		<UserProfileTab>
			<CustomContributeCard>
				<ContributeCardTitles>
					~total Amount of GIVpower
				</ContributeCardTitles>
				<ContributeCardTitles>Project boosted</ContributeCardTitles>
				<H5>{formatWeiHelper(TotalAmountOfGIVpower)}</H5>
				<H5>8</H5>
			</CustomContributeCard>
		</UserProfileTab>
	);
};

const CustomContributeCard = styled(ContributeCard)`
	width: 100%;
	${mediaQueries.tablet} {
		width: 614px;
	}
`;
