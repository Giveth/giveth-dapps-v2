import styled from 'styled-components';
import { FC } from 'react';

import { Col, Row } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { IUserProfileView } from '../UserProfile.view';
import BoostsTable from './BoostsTable';
import { Loading } from '../projectsTab/ProfileProjectsTab';
import { EmptyPowerBoosting } from './EmptyPowerBoosting';
import GetMoreGIVpowerBanner from './GetMoreGIVpowerBanner';
import { useAppSelector } from '@/features/hooks';
import { getGIVpowerLink, getTotalGIVpower } from '@/helpers/givpower';
import { UserProfileTab } from '../common.sc';
import { PublicGIVpowerContributeCard } from '@/components/ContributeCard';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { useFetchPowerBoostingInfo } from './useFetchPowerBoostingInfo';

export const PublicProfileBoostedTab: FC<IUserProfileView> = ({ user }) => {
	const { loading, boosts, order, changeOrder } =
		useFetchPowerBoostingInfo(user);
	const { chainId } = useWeb3React();
	const values = useAppSelector(state => state.subgraph);
	const givPower = getTotalGIVpower(values);
	const isZeroGivPower = givPower.total.isZero();

	return (
		<UserProfileTab>
			<Row>
				<Col lg={6}>
					<PublicGIVpowerContributeCard user={user} />
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
