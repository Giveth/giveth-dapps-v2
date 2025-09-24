import styled from 'styled-components';
import {
	B,
	brandColors,
	GLink,
	H2,
	H4,
	H5,
	H6,
	IconExternalLink,
	neutralColors,
	P,
	semanticColors,
	SublineBold,
	Flex,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import config from '@/configuration';
import { Shadow } from '@/components/styled-components/Shadow';
import ProjectWalletAddress from '@/components/views/project/projectDonations/ProjectWalletAddress';
import { useProjectContext } from '@/context/project.context';
import { calculateTotalEstimatedMatching } from '@/helpers/qf';
import { client } from '@/apollo/apolloClient';
import { FETCH_QF_ROUND_HISTORY } from '@/apollo/gql/gqlDonations';
import { IGetQfRoundHistory, IQFRound } from '@/apollo/types/types';
import { formatDonation } from '@/helpers/number';
import { ProjectRaised } from './ProjectRaised';

interface IProjectTotalFundCardProps {
	selectedQF: IQFRound | null;
}

const ProjectTotalFundCard = ({ selectedQF }: IProjectTotalFundCardProps) => {
	const [qfRoundHistory, setQfRoundHistory] = useState<IGetQfRoundHistory>();
	const { projectData, isAdmin, isCause } = useProjectContext();
	const { id, addresses, qfRounds, estimatedMatching } = projectData || {};
	const { formatMessage, locale } = useIntl();
	const recipientAddresses = addresses?.filter(a => a.isRecipient);
	const { allProjectsSum, matchingPool, projectDonationsSqrtRootSum } =
		estimatedMatching || {};

	const {
		allocatedFundUSDPreferred,
		allocatedFundUSD,
		allocatedTokenSymbol,
	} = selectedQF || {};

	const selectedQFData = qfRounds?.find(round => round.id === selectedQF?.id);

	const notDistributedFund =
		!qfRoundHistory?.matchingFund &&
		qfRoundHistory?.matchingFund !== 0 &&
		!selectedQF?.isActive;

	useEffect(() => {
		if (!id) return;
		//TODO: should change to new endpoint for fetching donations amount
		const fetchAllDonationsInfo = async () => {
			// We can fetch project to show the latest donations info but i think it's not necessary
			// fetchProjectBySlug();
		};

		const fetchCurrentQfDonationsInfo = async () => {
			// We can fetch project to show the latest donations info but i think it's not necessary
			// fetchProjectBySlug();
		};

		const fetchFinishedQfDonationsInfo = async () => {
			client
				.query({
					query: FETCH_QF_ROUND_HISTORY,
					variables: {
						projectId: parseInt(id),
						qfRoundId:
							selectedQF !== null
								? parseInt(selectedQF.id)
								: undefined,
					},
				})
				.then((res: any) => {
					const getQfRoundHistory: IGetQfRoundHistory =
						res.data.getQfRoundHistory;
					setQfRoundHistory(getQfRoundHistory);
				});
		};

		if (selectedQF === null) {
			fetchAllDonationsInfo();
		} else if (selectedQF.isActive) {
			fetchCurrentQfDonationsInfo();
		} else {
			fetchFinishedQfDonationsInfo();
		}
	}, [id, isAdmin, selectedQF]);

	const roundTotalDonation =
		selectedQF && selectedQF.isActive
			? projectData?.sumDonationValueUsdForActiveQfRound
			: qfRoundHistory?.raisedFundInUsd || 0;

	const roundDonorsCount =
		selectedQF && selectedQF.isActive
			? projectData?.countUniqueDonorsForActiveQfRound
			: qfRoundHistory?.uniqueDonors;

	const matchFund = selectedQF
		? selectedQF.isActive
			? calculateTotalEstimatedMatching(
					projectDonationsSqrtRootSum,
					allProjectsSum,
					allocatedFundUSDPreferred ? allocatedFundUSD : matchingPool,
					selectedQF.maximumReward,
				)
			: qfRoundHistory
				? qfRoundHistory.matchingFund !== null
					? qfRoundHistory.matchingFund
					: calculateTotalEstimatedMatching(
							qfRoundHistory.estimatedMatching
								.projectDonationsSqrtRootSum,
							qfRoundHistory.estimatedMatching.allProjectsSum,
							qfRoundHistory.estimatedMatching.matchingPool,
							selectedQF.maximumReward,
						)
				: 0
		: 0;

	const totalDonations =
		projectData?.qfRounds?.find(round => round.id === selectedQF?.id)
			?.projectQfRoundRelations?.sumDonationValueUsd || 0;

	const countUniqueDonors =
		projectData?.qfRounds?.find(round => round.id === selectedQF?.id)
			?.projectQfRoundRelations?.countUniqueDonors || 0;

	return (
		<Wrapper>
			{selectedQF === null ? (
				<>
					<UpperSection>
						<B>
							{formatMessage({
								id: 'label.all_time_donations_received',
							})}
						</B>
						{totalDonations && totalDonations > 0 ? (
							<TotalFund>
								{formatDonation(totalDonations, '$')}
							</TotalFund>
						) : (
							<NoDonation>
								{formatMessage({
									id: 'label.be_the_first_to_give',
								})}
							</NoDonation>
						)}
					</UpperSection>
					{countUniqueDonors !== undefined &&
						countUniqueDonors > 0 && (
							<ProjectRaised
								roundDonorsCount={countUniqueDonors}
							/>
						)}
				</>
			) : (
				<div>
					<BorderedFlex>
						<B>{selectedQF.name} donations</B>
					</BorderedFlex>
					{roundDonorsCount && roundDonorsCount > 0 ? (
						<div>
							<TotalFund>
								{formatDonation(roundTotalDonation || 0, '$')}
							</TotalFund>
							{!qfRoundHistory?.distributedFundTxHash && (
								<ProjectRaised
									roundDonorsCount={roundDonorsCount}
								/>
							)}
							{notDistributedFund ? (
								<NotDistributedFundContainer>
									<EstimatedMatchingSection>
										<Flex $flexDirection='column' gap='8px'>
											<H6 weight={700}>
												{formatMessage({
													id: 'label.matching_funds_coming_soon',
												})}{' '}
											</H6>
											<NotDistributedContainer>
												<NotDistributedProjectName>
													{selectedQF.name}&nbsp;
												</NotDistributedProjectName>
												<NotDistributedDescription>
													{formatMessage({
														id: 'label.funds_have_not_yet_been_sent',
													})}
												</NotDistributedDescription>
											</NotDistributedContainer>
										</Flex>
									</EstimatedMatchingSection>
								</NotDistributedFundContainer>
							) : (
								qfRoundHistory?.distributedFundTxHash &&
								!selectedQF.isActive && (
									<EstimatedMatchingSection $flexDirection='column'>
										<Flex $justifyContent='space-between'>
											<EstimatedMatchingPrice>
												+{' '}
												{formatDonation(
													matchFund,
													allocatedFundUSDPreferred
														? '$'
														: '',
													locale,
													!!selectedQFData?.isActive,
												)}{' '}
												{!allocatedFundUSDPreferred &&
													allocatedTokenSymbol}
											</EstimatedMatchingPrice>
											<EstimatedMatchingText>
												{selectedQFData?.isActive
													? 'Estimated Matching'
													: 'Matching Funds'}
											</EstimatedMatchingText>
										</Flex>

										{qfRoundHistory?.distributedFundTxHash &&
											!selectedQF.isActive && (
												<EstimatedMatchingTransaction>
													<BlockExplorerLink
														as='a'
														href={`${
															config
																.EVM_NETWORKS_CONFIG[
																+qfRoundHistory.distributedFundNetwork!
															]?.blockExplorers
																?.default.url
														}
			/tx/${qfRoundHistory?.distributedFundTxHash}`}
														target='_blank'
														size='Big'
													>
														View transaction &nbsp;
														<IconExternalLink
															size={16}
														/>
													</BlockExplorerLink>
												</EstimatedMatchingTransaction>
											)}
									</EstimatedMatchingSection>
								)
							)}
							{qfRoundHistory?.distributedFundTxHash && (
								<ProjectRaised
									roundDonorsCount={roundDonorsCount}
								/>
							)}
						</div>
					) : (
						<NoDonation>
							{formatMessage({
								id: selectedQF.isActive
									? 'label.be_the_first_to_give'
									: 'label.qf_no_donations',
							})}
						</NoDonation>
					)}
				</div>
			)}

			{!isCause && (
				<BottomSection>
					<CustomP>Project recipient address</CustomP>
					{recipientAddresses?.map(addObj => (
						<ProjectWalletAddress
							key={addObj.networkId}
							address={addObj.address!}
							networkId={addObj.networkId!}
							chainType={addObj.chainType}
						/>
					))}
				</BottomSection>
			)}
		</Wrapper>
	);
};

const BottomSection = styled.div`
	color: ${neutralColors.gray[700]};
	margin-top: 30px;
	width: max-content;
`;

const NoDonation = styled(H4)`
	margin-top: 20px;
`;

const Wrapper = styled.div`
	padding: 10px;
	margin: 0 -15px;
	background: white;
	border-radius: 16px;
	box-shadow: ${Shadow.Neutral[400]};
	overflow: hidden;
	${mediaQueries.mobileL} {
		padding: 20px;
		margin: unset;
	}
`;

const UpperSection = styled.div`
	color: ${neutralColors.gray[900]};
`;

const TotalFund = styled(H2)`
	font-weight: 700;
`;

const BorderedFlex = styled(Flex)`
	border-bottom: 1px solid ${neutralColors.gray[300]};
	padding-bottom: 8px;
	margin-bottom: 8px;
`;

const EstimatedMatchingSection = styled(Flex)`
	background-color: ${neutralColors.gray[200]};
	padding: 16px 8px;
	border-radius: 8px;
	margin-top: 8px;
`;

const EstimatedMatchingTransaction = styled.div`
	margin-top: 8px;
	padding-top: 8px;
	border-top: 1px solid ${neutralColors.gray[300]};
`;

const EstimatedMatchingPrice = styled(H5)`
	color: ${semanticColors.jade[600]};
	font-weight: 700;
`;

const EstimatedMatchingText = styled(SublineBold)`
	color: ${semanticColors.jade[600]};
	font-weight: 600;
	max-width: 60px;
`;

const CustomP = styled(P)`
	padding-bottom: 8px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const NotDistributedContainer = styled.div`
	border-top: 1px solid ${neutralColors.gray[300]};
	padding-top: 8px;
`;

const NotDistributedProjectName = styled(B)`
	display: inline-block;
	color: ${neutralColors.gray[700]};
	white-space: nowrap;
`;

const NotDistributedDescription = styled(P)`
	display: inline;
	color: ${neutralColors.gray[700]};
`;

const NotDistributedFundContainer = styled.div`
	margin-bottom: 8px;
`;

const BlockExplorerLink = styled(GLink)`
	display: flex;
	align-items: center;
	width: 100%;
	color: ${brandColors.pinky[400]};
	&:hover {
		color: ${brandColors.pinky[500]};
	}
`;

export default ProjectTotalFundCard;
