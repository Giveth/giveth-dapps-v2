import styled from 'styled-components';
import { FC } from 'react';

import { Col, Row } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { IUserProfileView } from '../UserProfile.view';
import BoostsTable from './BoostsTable';
import { Loading } from '../projectsTab/ProfileProjectsTab';
import { EmptyPowerBoosting } from './EmptyPowerBoosting';
import GetMoreGIVpowerBanner from './GetMoreGIVpowerBanner';
import { getGIVpowerLink } from '@/helpers/givpower';
import { UserProfileTab } from '../common.sc';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { useFetchPowerBoostingInfo } from './useFetchPowerBoostingInfo';
import { useProfileContext } from '@/context/profile.context';
import { PublicGIVpowerContributeCard } from '@/components/ContributeCard';

export const PublicProfileBoostedTab: FC<IUserProfileView> = () => {
	const { user, givpowerBalance } = useProfileContext();

	const { loading, boosts, order, totalCount, changeOrder } =
		useFetchPowerBoostingInfo(user);
	const { chainId } = useWeb3React();
	const givpower = new BigNumber(givpowerBalance);
	const isZeroGivPower = givpower.isZero();

	return (
		<UserProfileTab>
			<Row>
				<Col lg={6}>
					<PublicGIVpowerContributeCard />
				</Col>
			</Row>
			{totalCount && totalCount > 0 && isZeroGivPower ? (
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
				{totalCount && totalCount > 0 ? (
					<BoostsTable
						boosts={boosts}
						totalAmountOfGIVpower={givpower}
						order={order}
						changeOrder={changeOrder}
						myAccount={false}
					/>
				) : (
					<EmptyPowerBoosting myAccount={false} />
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
