import {
	Subline,
	neutralColors,
	B,
	P,
	IconChevronRight16,
	brandColors,
	mediaQueries,
	Flex,
	H5,
	semanticColors,
	H4,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { type FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { formatDonation } from '@/helpers/number';
import { IProject } from '@/apollo/types/types';
import { VerifiedBadge } from '@/components/badges/VerifiedBadge';
import { slugToProjectView } from '@/lib/routeCreators';
import { ProjectCardUserName } from '@/components/project-card/ProjectCardUserName';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { useDonateData } from '@/context/donate.context';
import { ChainType } from '@/types/config';
import config from '@/configuration';
import { calculateTotalEstimatedMatching, getActiveRound } from '@/helpers/qf';

interface IDonatePageProjectDescriptionProps {
	projectData?: IProject;
	showRaised?: boolean;
}

export const DonatePageProjectDescription: FC<
	IDonatePageProjectDescriptionProps
> = ({ projectData, showRaised = true }) => {
	const { formatMessage, locale } = useIntl();
	const router = useRouter();
	const {
		totalDonations,
		sumDonationValueUsdForActiveQfRound,
		countUniqueDonorsForActiveQfRound,
		slug,
		title,
		descriptionSummary,
		adminUser,
		organization,
		estimatedMatching,
	} = projectData || {};

	const { allProjectsSum, matchingPool, projectDonationsSqrtRootSum } =
		estimatedMatching || {};
	const isQRDonation = router.query.chain === ChainType.STELLAR.toLowerCase();
	const orgLabel = organization?.label;
	const isForeignOrg =
		orgLabel !== ORGANIZATION.trace && orgLabel !== ORGANIZATION.giveth;

	const projectLink = slugToProjectView(slug!);
	const { project } = useDonateData();

	const { activeStartedRound, activeQFRound } = getActiveRound(
		project.qfRounds,
	);

	const stellarNetworkId =
		config.NON_EVM_NETWORKS_CONFIG[ChainType.STELLAR].networkId;
	const isStellarIncludedInQF =
		activeStartedRound?.eligibleNetworks?.includes(stellarNetworkId);

	const {
		allocatedFundUSDPreferred,
		allocatedFundUSD,
		allocatedTokenSymbol,
	} = activeQFRound || {};

	return (
		<DonationSectionWrapper gap='16px'>
			{projectData?.verified && (
				<Flex>
					<VerifiedBadge />
				</Flex>
			)}
			<Link href={projectLink}>
				<CustomH5>{title}</CustomH5>
			</Link>
			<ProjectCardUserName
				name={adminUser?.name}
				adminUser={adminUser!}
				slug={slug!}
				isForeignOrg={isForeignOrg}
				sidePadding='0'
			/>
			{isQRDonation && isStellarIncludedInQF && showRaised ? (
				<>
					{totalDonations || 0 ? (
						<>
							<AmountRaisedText>
								<Subline color={neutralColors.gray[700]}>
									{formatMessage({
										id: 'label.amount_raised_in_this_round',
									})}
								</Subline>
							</AmountRaisedText>
							<PriceText>
								{formatDonation(
									totalDonations || 0,
									'$',
									locale,
								)}
							</PriceText>

							<div>
								<LightSubline>
									{formatMessage({
										id: 'label.raised_from',
									})}{' '}
								</LightSubline>
								<Subline style={{ display: 'inline-block' }}>
									&nbsp;
									{countUniqueDonorsForActiveQfRound || 0}
									&nbsp;
								</Subline>
								<LightSubline>
									{formatMessage(
										{
											id: 'label.contributors',
										},
										{
											count: countUniqueDonorsForActiveQfRound,
										},
									)}
								</LightSubline>
							</div>
							<EstimatedMatchingPrice>
								+&nbsp;
								{formatDonation(
									calculateTotalEstimatedMatching(
										projectDonationsSqrtRootSum,
										allProjectsSum,
										allocatedFundUSDPreferred
											? allocatedFundUSD
											: matchingPool,
										activeStartedRound?.maximumReward,
									),
									allocatedFundUSDPreferred ? '$' : '',
									locale,
									true,
								)}
								{allocatedFundUSDPreferred
									? ''
									: ` ${allocatedTokenSymbol}`}
							</EstimatedMatchingPrice>
						</>
					) : (
						<DonateInfo>
							<NoFund weight={700}>
								{formatMessage({
									id: 'label.donate_first_lead_the_way',
								})}
							</NoFund>
						</DonateInfo>
					)}
				</>
			) : (
				<>
					{showRaised && (
						<P>
							{formatMessage({ id: 'label.raised' })}:{' '}
							{formatDonation(totalDonations || 0, '$', locale)}
						</P>
					)}
					<DescriptionSummary>
						{descriptionSummary}
					</DescriptionSummary>
					{project?.organization?.label ===
					ORGANIZATION.endaoment ? null : (
						<DonateDescription $flexDirection='column' gap='8px'>
							<B>
								{formatMessage({
									id: 'component.donation_section.100_to_the_project',
								})}
							</B>
							<B></B>
							<P>
								{formatMessage({
									id: 'component.donation_section.desc',
								})}
							</P>
							<a
								href='https://docs.giveth.io/whatisgiveth/zero-fees'
								target='_blank'
								referrerPolicy='no-referrer'
								rel='noreferrer'
							>
								<LearnLink $alignItems='center' gap='2px'>
									<Subline>
										{formatMessage({
											id: 'component.donation_section.learn_zero_fee',
										})}
									</Subline>
									<IconChevronRight16 />
								</LearnLink>
							</a>
						</DonateDescription>
					)}
				</>
			)}
		</DonationSectionWrapper>
	);
};

const CustomH5 = styled(H5)`
	font-weight: 700;
`;

const DescriptionSummary = styled(P)`
	max-height: 75px;
	overflow: hidden;
	color: ${neutralColors.gray[800]};
	margin-bottom: 16px;
`;

const DonationSectionWrapper = styled(Flex)`
	justify-content: space-between;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
	${mediaQueries.laptopS} {
		flex-direction: column;
	}
`;

const DonateDescription = styled(Flex)`
	padding: 8px 16px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 16px;
	margin-bottom: 24px;
	margin-top: 10px;
`;

const LearnLink = styled(Flex)`
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[700]};
	}
`;
const AmountRaisedText = styled(Subline)`
	color: ${neutralColors.gray[700]};
	background-color: ${neutralColors.gray[300]};
	padding: 2px px;
	width: fit-content;
	> span {
		font-weight: 500;
	}
`;

const PriceText = styled(H5)`
	display: inline;
	color: ${neutralColors.gray[900]};
	font-weight: 700;
`;

const LightSubline = styled(Subline)`
	display: inline-block;
	color: ${neutralColors.gray[700]};
`;

const EstimatedMatchingPrice = styled(H5)`
	color: ${semanticColors.jade[500]};
`;

const DonateInfo = styled.div`
	height: 130px;
`;

const NoFund = styled(H4)`
	color: ${neutralColors.gray[800]};
	margin-top: 16px;
`;
