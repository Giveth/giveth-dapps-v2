import { H5, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import {
	ContributeCard,
	ContributeCardTitles,
	UserProfileTab,
} from '../common.sc';
import { IUserProfileView } from '../UserProfile.view';
import { formatWeiHelper } from '@/helpers/number';
import type { FC } from 'react';

export const ProfileBoostedTab: FC<IUserProfileView> = () => {
	const TotalAmountofGIVpower = '7989240000000000000000';

	return (
		<UserProfileTab>
			<CustomContributeCard>
				<ContributeCardTitles>
					~total Amount of GIVpower
				</ContributeCardTitles>
				<ContributeCardTitles>Project boosted</ContributeCardTitles>
				<H5>{formatWeiHelper(TotalAmountofGIVpower)}</H5>
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
