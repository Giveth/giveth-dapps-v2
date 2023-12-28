import {
	brandColors,
	ButtonLink,
	H4,
	H6,
	IconExternalLink24,
	Lead,
	neutralColors,
	OutlineButton,
	P,
} from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useNetwork } from 'wagmi';
import Link from 'next/link';
import links from '@/lib/constants/links';
import SocialBox from '@/components/SocialBox';
import ExternalLink from '@/components/ExternalLink';
import { client } from '@/apollo/apolloClient';
import { FETCH_GIVETH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import config from '@/configuration';
import { slugToProjectView } from '@/lib/routeCreators';
import { IFetchGivethProjectGQL } from '@/apollo/types/gqlTypes';
import { useDonateData } from '@/context/donate.context';
import CongratsAnimation from '@/animations/congrats.json';
import LottieControl from '@/components/LottieControl';
import { EContentType } from '@/lib/constants/shareContent';
import QFToast from '@/components/views/donate/QFToast';
import { useAppSelector } from '@/features/hooks';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { EPassportState, usePassport } from '@/hooks/usePassport';
import { getActiveRound } from '@/helpers/qf';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { formatTxLink } from '@/lib/helpers';

const TxRow = ({ txHash, title }: { txHash: string; title?: string }) => {
	const { chain } = useNetwork();
	const chainId = chain?.id;
	return (
		<TxLink>
			<span>Donation to {title + ' '}</span>
			<ExternalLink
				href={formatTxLink(chainId, txHash)}
				title='View the transaction'
			/>
			<IconExternalLink24 />
		</TxLink>
	);
};

export const SuccessView: FC = () => {
	const { formatMessage } = useIntl();
	const { isLoading } = useAppSelector(state => state.user);
	const { isSuccessDonation, hasActiveQFRound, project } = useDonateData();
	const { givBackEligible, txHash = [] } = isSuccessDonation || {};
	const hasMultipleTxs = txHash.length > 1;
	const isSafeEnv = useIsSafeEnvironment();
	const [givethSlug, setGivethSlug] = useState<string>('');

	const {
		info: { passportState },
	} = usePassport();

	const { chain } = useNetwork();
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

	useEffect(() => {
		//Switch to donate view if user is changed
		if (isLoading) {
			// setSuccessDonation(undefined);
		}
	}, [isLoading]);

	return (
		<Wrapper>
			<ConfettiContainer>
				<LottieControl size={400} animationData={CongratsAnimation} />
			</ConfettiContainer>
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
			<Options>
				<Lead style={{ color: neutralColors.gray[900] }}>
					{formatMessage({
						id: 'label.your_transactions_have_been_submitted',
					})}
					<br />
					{formatMessage({
						id: 'label.you_can_view_them_on_a_blockchain_explorer_here',
					})}
				</Lead>
				<TxRow txHash={txHash[0]} title={project.title} />
				{hasMultipleTxs && <TxRow txHash={txHash[1]} title='Giveth' />}
				<Link href={Routes.AllProjects}>
					<ProjectsButton size='small' label='SEE MORE PROJECTS' />
				</Link>
			</Options>
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

const ConfettiContainer = styled.div`
	position: absolute;
	top: 30px;
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

const TxLink = styled(Lead)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	margin-top: 16px;
	display: flex;
	align-items: center;
	gap: 8px;
	> span {
		color: ${neutralColors.gray[700]};
	}
`;

const Options = styled(FlexCenter)`
	flex-direction: column;
	width: 100%;
	padding: 40px 20px 0;
`;

const ProjectsButton = styled(ButtonLink)`
	width: 242px;
	margin-top: 40px;
`;
