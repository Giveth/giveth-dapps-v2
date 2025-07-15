import {
	brandColors,
	H4,
	OutlineButton,
	P,
	Flex,
	Col,
	Row,
	neutralColors,
	H6,
} from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { ICause } from '@/apollo/types/types';
import ExternalLink from '@/components/ExternalLink';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_PROJECT_BY_SLUG_SUCCESS,
	FETCH_GIVETH_PROJECT_BY_ID,
} from '@/apollo/gql/gqlProjects';
import config from '@/configuration';
import { slugToProjectView } from '@/lib/routeCreators';
import { useDonateData } from '@/context/donate.context';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import {
	EPassportState,
	usePassport,
	EQFElegibilityState,
} from '@/hooks/usePassport';
import { getActiveRound } from '@/helpers/qf';
import ProjectCardImage from '@/components/project-card/ProjectCardImage';
import { DonatePageProjectDescription } from './DonatePageProjectDescription';
import SocialBox from '@/components/SocialBox';
import links from '@/lib/constants/links';
import { EContentType, EContentTypeCause } from '@/lib/constants/shareContent';

import QFToast from './QFToast';
import { DonationInfo } from './DonationInfo';
import { ManageRecurringDonation } from './Recurring/ManageRecurringDonation';
import EndaomentProjectsInfo from '../project/EndaomentProjectsInfo';
import ImprovementBanner from './ImprovementBanner';

interface ISuccessView {
	isStellar?: boolean;
	isStellarInQF?: boolean;
}
export const SuccessView: FC<ISuccessView> = ({ isStellar, isStellarInQF }) => {
	const { formatMessage } = useIntl();
	const { successDonation, hasActiveQFRound, project } = useDonateData();
	const {
		givBackEligible,
		txHash = [],
		chainId,
		excludeFromQF,
		isRecurring,
	} = successDonation || {};
	const hasMultipleTxs = txHash.length > 1;
	const isSafeEnv = useIsSafeEnvironment();
	const [givethSlug, setGivethSlug] = useState<string>('');
	const [fullCauseProject, setFullCauseProject] = useState<ICause>();
	const router = useRouter();
	const isCauseDonation = router.query.cause === 'true';
	useEffect(() => {
		if (!isCauseDonation || !project?.slug) return;

		client
			.query({
				query: FETCH_PROJECT_BY_SLUG_SUCCESS,
				variables: {
					slug: project.slug,
					connectedWalletUserId: undefined, // or pass actual userId if needed
				},
			})
			.then((res: any) => {
				const fullData = res.data?.projectBySlug;
				if (fullData) {
					setFullCauseProject(fullData); // fullData.activeProjectsCount is available here
				}
			})
			.catch(console.error);
	}, [isCauseDonation, project?.slug]);

	const {
		info: { passportState, qfEligibilityState },
	} = usePassport();

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

	const { activeStartedRound } = getActiveRound(project.qfRounds);

	const isOnEligibleNetworks = activeStartedRound?.eligibleNetworks?.includes(
		(isStellar ? config.STELLAR_NETWORK_NUMBER : chainId) || 0,
	);

	useEffect(() => {
		if (!hasMultipleTxs) return;
		client;
		client
			.query({
				query: FETCH_GIVETH_PROJECT_BY_ID,
				variables: { id: project.id },
			})
			.then(res => {
				const fullData = res.data?.projectById;
				if (fullData?.projectType === 'CAUSE') {
					setFullCauseProject(fullData);
				}
			});
	}, []);

	const socialContentType: EContentType | EContentTypeCause = isCauseDonation
		? isRecurring
			? EContentTypeCause.justDonatedRecurring
			: EContentTypeCause.donationSuccess // ✅ changed from justDonated
		: isRecurring
			? EContentType.justDonatedRecurring
			: EContentType.justDonated;
	const showQFToast =
		!excludeFromQF &&
		!isSafeEnv &&
		hasActiveQFRound &&
		isOnEligibleNetworks &&
		((isStellarInQF && isStellar) ||
			(passportState !== EPassportState.CONNECTING &&
				passportState !== EPassportState.LOADING_SCORE &&
				qfEligibilityState !== EQFElegibilityState.LOADING &&
				qfEligibilityState !== EQFElegibilityState.PROCESSING &&
				qfEligibilityState !== EQFElegibilityState.NOT_CONNECTED &&
				qfEligibilityState !== EQFElegibilityState.ERROR));
	console.log('🎯 Cause project:', fullCauseProject);

	return (
		<Wrapper>
			<ImprovementBanner />
			<Row>
				<Col xs={12} lg={6}>
					<InfoWrapper>
						<EndaomentProjectsInfo
							orgLabel={project?.organization?.label}
						/>
						<ImageWrapper>
							<ProjectCardImage image={project.image} />
						</ImageWrapper>
						<DonatePageProjectDescription
							projectData={project}
							showRaised={true}
						/>
					</InfoWrapper>
				</Col>
				<Col xs={12} lg={6}>
					<RightSectionWrapper>
						<div>
							<GiverH4 id='donation-success' weight={700}>
								{formatMessage({ id: 'label.youre_giver_now' })}
							</GiverH4>
							<br />
							<SuccessMessage>{message}</SuccessMessage>
						</div>
						<br />
						{givBackEligible && (
							<>
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
										<LearnButton
											size='small'
											label='LEARN MORE'
										/>
									</ExternalLink>
								</GivBackContainer>
								<br />
							</>
						)}
						{showQFToast && (
							<QFToast
								isStellar={isStellar}
								isStellarInQF={isStellarInQF}
							/>
						)}
						{isRecurring && <ManageRecurringDonation />}
						<SocialBoxWrapper>
							<SocialBox
								{...(isCauseDonation
									? {
											cause:
												fullCauseProject ??
												(project as unknown as ICause),
											numberOfProjects:
												fullCauseProject?.activeProjectsCount ??
												0,
										}
									: { project })}
								contentType={socialContentType}
							/>
						</SocialBoxWrapper>
					</RightSectionWrapper>
				</Col>
			</Row>
			<DonationInfo />
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	position: relative;
	flex-direction: column;
	gap: 24px;
	align-items: center;
`;

const SocialBoxWrapper = styled.div`
	margin: 0 0 -50px;
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

const InfoWrapper = styled.div`
	background-color: ${neutralColors.gray[100]};
	padding: 24px;
	border-radius: 16px;
	height: 100%;
	text-align: left;
`;

const ImageWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 231px;
	margin-bottom: 24px;
	border-radius: 8px;
	overflow: hidden;
`;

const RightSectionWrapper = styled(Flex)`
	flex-direction: column;
	justify-content: center;
	background-color: ${neutralColors.gray[100]};
	padding: 32px;
	border-radius: 16px;
	height: 100%;
`;
