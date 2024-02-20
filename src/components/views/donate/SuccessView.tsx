import {
	brandColors,
	H4,
	H6,
	OutlineButton,
	P,
} from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import links from '@/lib/constants/links';
import SocialBox from '@/components/SocialBox';
import ExternalLink from '@/components/ExternalLink';
import { client } from '@/apollo/apolloClient';
import { FETCH_GIVETH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import config, { isRecurringActive } from '@/configuration';
import { slugToProjectView } from '@/lib/routeCreators';
import { IFetchGivethProjectGQL } from '@/apollo/types/gqlTypes';
import { useDonateData } from '@/context/donate.context';
import { EContentType } from '@/lib/constants/shareContent';
import QFToast from '@/components/views/donate/QFToast';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { EPassportState, usePassport } from '@/hooks/usePassport';
import { getActiveRound } from '@/helpers/qf';
import { Flex } from '@/components/styled-components/Flex';
import { DonationInfo } from './DonationInfo';

export const SuccessView: FC = () => {
	const { formatMessage } = useIntl();
	const { isSuccessDonation, hasActiveQFRound, project } = useDonateData();
	const { givBackEligible, txHash = [] } = isSuccessDonation || {};
	const hasMultipleTxs = txHash.length > 1;
	const isSafeEnv = useIsSafeEnvironment();
	const [givethSlug, setGivethSlug] = useState<string>('');

	const {
		info: { passportState },
	} = usePassport();

	const { chain } = useAccount();
	const networkId = chain?.id;

	const message = hasMultipleTxs ? (
		<>
			{formatMessage(
				{ id: 'label.thank_you_for_supporting_project_and_giveth' },
				{ title: project.title },
			)}{' '}
			<ExternalLink href={slugToProjectView(givethSlug)} title='here' />.
		</>
	) : (
		formatMessage(
			{ id: 'label.thank_you_for_supporting_project' },
			{ title: project.title },
		)
	);

	const activeRound = getActiveRound(project.qfRounds);

	const isOnEligibleNetworks =
		networkId && activeRound?.eligibleNetworks?.includes(networkId);

	useEffect(() => {
		client
			.query({
				query: FETCH_GIVETH_PROJECT_BY_ID,
				variables: { id: config.GIVETH_PROJECT_ID },
				fetchPolicy: 'no-cache',
			})
			.then((res: IFetchGivethProjectGQL) =>
				setGivethSlug(res.data.projectById.slug),
			);
	}, []);

	return (
		<Wrapper>
			<GiverH4 weight={700}>
				{formatMessage({ id: 'label.youre_giver_now' })}
			</GiverH4>
			<SuccessMessage>{message}</SuccessMessage>
			{givBackEligible && (
				<GivBackContainer>
					<H6>
						{formatMessage({
							id: 'label.youre_eligible_for_givbacks',
						})}
					</H6>
					<P>
						{formatMessage({
							id: 'label.givback_distributed_after_round',
						})}
					</P>
					<ExternalLink href={links.GIVBACK_DOC}>
						<LearnButton size='small' label='LEARN MORE' />
					</ExternalLink>
				</GivBackContainer>
			)}
			{!isSafeEnv &&
				hasActiveQFRound &&
				passportState !== EPassportState.LOADING &&
				isOnEligibleNetworks && <QFToast />}
			<SocialBoxWrapper>
				<SocialBox
					project={project}
					contentType={EContentType.justDonated}
				/>
			</SocialBoxWrapper>
			{isRecurringActive && <DonationInfo />}
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 24px;
	align-items: center;
`;

const SocialBoxWrapper = styled.div`
	margin: -50px 0;
`;

const GiverH4 = styled(H4)`
	color: ${brandColors.deep[700]};
`;

const SuccessMessage = styled(P)`
	position: relative;
	color: ${brandColors.deep[900]};
	a {
		color: ${brandColors.pinky[500]};
	}
`;

const LearnButton = styled(OutlineButton)`
	width: 200px;
	height: 48px;
	border-color: white;
	margin: 16px 0 0 0;
`;

const GivBackContainer = styled.div`
	width: 100%;
	max-width: 560px;
	padding: 32px 53px;
	text-align: center;
	background-image: url('/images/GIVeconomy_Banner.png');
	background-size: cover;
	border-radius: 12px;
	color: white;
	z-index: 1;
	> h6 {
		font-weight: bold;
		margin: 0 0 8px 0;
	}
`;
