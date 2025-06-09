import { FC } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	Flex,
	H6,
	IconGIVBack16,
	IconVerifiedBadge16,
	neutralColors,
	P,
	semanticColors,
	Subline,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { IProject } from '@/apollo/types/types';
import { Shadow } from '@/components/styled-components/Shadow';
import { slugToProjectView } from '@/lib/routeCreators';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { ProjectCardUserName } from '@/components/project-card/ProjectCardUserName';
import { getActiveRound } from '@/helpers/qf';
import { ProjectCardTotalRaised } from '@/components/project-card/ProjectCardTotalRaised';
import { ProjectCardTotalRaisedQF } from '@/components/project-card/ProjectCardTotalRaisedQF';

const SIDE_PADDING = '26px';

export const CauseCreateProjectCard: FC<{ project: IProject }> = ({
	project,
}) => {
	const { formatMessage } = useIntl();
	const {
		id,
		title,
		descriptionSummary,
		image,
		slug,
		adminUser,
		totalDonations,
		sumDonationValueUsdForActiveQfRound,
		organization,
		verified,
		isGivbackEligible,
		latestUpdateCreationDate,
		countUniqueDonors,
		qfRounds,
		countUniqueDonorsForActiveQfRound,
	} = project;

	const orgLabel = organization?.label;
	const isForeignOrg =
		orgLabel !== ORGANIZATION.trace && orgLabel !== ORGANIZATION.giveth;
	const name = adminUser?.name;
	const { activeStartedRound, activeQFRound } = getActiveRound(qfRounds);
	const hasFooter = activeStartedRound || verified || isGivbackEligible;
	const showVerifiedBadge = verified || isGivbackEligible;

	const projectLink = slugToProjectView(slug);

	const isHover = false;

	return (
		<Wrapper>
			<CardBody $isOtherOrganization={isForeignOrg}>
				<TitleWrapper>
					<Title weight={700}>{title}</Title>
				</TitleWrapper>
				<ProjectCardUserName
					name={name}
					adminUser={adminUser}
					slug={slug}
					isForeignOrg={isForeignOrg}
				/>
				<Description>{descriptionSummary}</Description>
				<PaddedRow $justifyContent='space-between'>
					{!activeStartedRound && (
						<ProjectCardTotalRaised
							activeStartedRound={!!activeStartedRound}
							totalDonations={totalDonations || 0}
							sumDonationValueUsdForActiveQfRound={
								sumDonationValueUsdForActiveQfRound || 0
							}
							countUniqueDonors={countUniqueDonors || 0}
						/>
					)}
					{activeStartedRound && (
						<ProjectCardTotalRaisedQF
							activeStartedRound={!!activeStartedRound}
							totalDonations={totalDonations || 0}
							sumDonationValueUsdForActiveQfRound={
								sumDonationValueUsdForActiveQfRound || 0
							}
							countUniqueDonors={
								countUniqueDonorsForActiveQfRound || 0
							}
						/>
					)}
				</PaddedRow>
				{hasFooter && (
					<>
						<Hr />
						<PaddedRow $justifyContent='space-between'>
							<Flex gap='16px'>
								{showVerifiedBadge && (
									<Flex $alignItems='center' gap='4px'>
										<IconVerifiedBadge16
											color={semanticColors.jade[500]}
										/>
										<VerifiedText>
											{formatMessage({
												id: 'label.verified',
											})}
										</VerifiedText>
									</Flex>
								)}
								{isGivbackEligible && (
									<Flex $alignItems='center' gap='4px'>
										<IconGIVBack16
											color={brandColors.giv[500]}
										/>
										<GivbackEligibleText>
											GIVbacks
										</GivbackEligibleText>
									</Flex>
								)}
								{activeStartedRound && (
									<QFBadge>
										{activeStartedRound?.name}
									</QFBadge>
								)}
							</Flex>
						</PaddedRow>
					</>
				)}
			</CardBody>
			{isHover && (
				<CardBodyHover>
					<Link href={projectLink}>Learn more</Link>
				</CardBodyHover>
			)}
		</Wrapper>
	);
};

interface IWrapperProps {
	$order?: number;
	$activeStartedRound?: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
	position: relative;
	width: 50%;
	border-radius: 12px;
	margin: 4px 0 0 0;
	background: white;
	overflow: hidden;
	box-shadow: ${Shadow.Neutral[400]};
	order: ${props => props.$order};
	min-height: 326px;
`;

interface ICardBody {
	$isOtherOrganization?: boolean | '';
}

const CardBody = styled.div<ICardBody>`
	background-color: ${neutralColors.gray[100]};
	transition: top 0.3s ease;
	border-radius: ${props =>
		props.$isOtherOrganization ? '0 12px 12px 12px' : '12px'};

	a {
		pointer-events: none;
	}

	span {
		color: ${neutralColors.gray[800]};
	}
`;

const TitleWrapper = styled.div`
	padding: 32px ${SIDE_PADDING} 0;
	position: relative;
`;

const Title = styled(H6)`
	overflow: hidden;
	margin-bottom: 2px;
	&:hover {
		color: ${brandColors.pinky[500]};
	}
`;

const Description = styled(P)`
	padding: 0 ${SIDE_PADDING};
	height: 75px;
	overflow: hidden;
	color: ${neutralColors.gray[800]};
	margin-bottom: 24px;
`;

interface IPaddedRowProps {
	$sidePadding?: string;
}

export const PaddedRow = styled(Flex)<IPaddedRowProps>`
	padding: 0 ${props => props.$sidePadding || SIDE_PADDING};
`;

const Hr = styled.hr`
	margin-left: ${SIDE_PADDING};
	margin-right: ${SIDE_PADDING};
	border: 1px solid ${neutralColors.gray[300]};
`;

const VerifiedText = styled(Subline)`
	color: ${semanticColors.jade[500]};
`;

const GivbackEligibleText = styled(Subline)`
	color: ${brandColors.giv[500]};
`;

const QFBadge = styled(Subline)`
	background-color: ${brandColors.cyan[600]};
	color: ${neutralColors.gray[100]};
	padding: 4px 8px;
	border-radius: 16px;
	display: flex;
	align-items: center;
`;
