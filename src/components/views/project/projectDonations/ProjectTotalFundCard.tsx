import styled from 'styled-components';
import {
	B,
	H2,
	H4,
	H5,
	neutralColors,
	P,
	semanticColors,
	Subline,
	SublineBold,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

import { useEffect, useState } from 'react';
import { Shadow } from '@/components/styled-components/Shadow';
import ProjectWalletAddress from '@/components/views/project/projectDonations/ProjectWalletAddress';
import { useProjectContext } from '@/context/project.context';
import { calculateTotalEstimatedMatching } from '@/helpers/qf';
import { Flex } from '@/components/styled-components/Flex';
import { client } from '@/apollo/apolloClient';
import { FETCH_QF_ROUND_HISTORY } from '@/apollo/gql/gqlDonations';
import { IGetQfRoundHistory, IQFRound } from '@/apollo/types/types';
import { formatDonations } from '@/helpers/number';

interface IProjectTotalFundCardProps {
	selectedQF: IQFRound | null;
}

const ProjectTotalFundCard = ({ selectedQF }: IProjectTotalFundCardProps) => {
	const [qfRoundHistory, setQfRoundHistory] = useState<IGetQfRoundHistory>();
	const { projectData, isAdmin } = useProjectContext();
	const {
		id,
		totalDonations,
		addresses,
		qfRounds,
		estimatedMatching,
		countUniqueDonors,
	} = projectData || {};
	const { formatMessage } = useIntl();
	const recipientAddresses = addresses?.filter(a => a.isRecipient);
	const { allProjectsSum, matchingPool, projectDonationsSqrtRootSum } =
		estimatedMatching || {};

	const selectedQFData = qfRounds?.find(round => round.id === selectedQF?.id);

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
					matchingPool,
			  )
			: qfRoundHistory
			? qfRoundHistory.matchingFund !== null
				? qfRoundHistory.matchingFund
				: calculateTotalEstimatedMatching(
						qfRoundHistory.estimatedMatching
							.projectDonationsSqrtRootSum,
						qfRoundHistory.estimatedMatching.allProjectsSum,
						qfRoundHistory.estimatedMatching.matchingPool,
				  )
			: 0
		: 0;

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
								{formatDonations(totalDonations, '$')}
							</TotalFund>
						) : (
							<NoDonation>
								{formatMessage({
									id: 'label.be_the_first_to_donate',
								})}
							</NoDonation>
						)}
					</UpperSection>
					<div>
						<LightSubline>
							{formatMessage({
								id: 'label.raised_from',
							})}
						</LightSubline>
						<Subline style={{ display: 'inline-block' }}>
							&nbsp;{countUniqueDonors}
							&nbsp;
						</Subline>
						<LightSubline>
							{formatMessage(
								{
									id: 'label.contributors',
								},
								{
									count: countUniqueDonors,
								},
							)}
						</LightSubline>
					</div>
				</>
			) : (
				<div>
					<BorderedFlex>
						<P>Round: &nbsp;</P>
						<B>QF round {selectedQF.id} donations</B>
					</BorderedFlex>
					{roundDonorsCount && roundDonorsCount > 0 ? (
						<div>
							<TotalFund>
								{formatDonations(roundTotalDonation || 0, '$')}
							</TotalFund>
							<EstimatedMatchingSection
								justifyContent='space-between'
								alignItems='center'
							>
								<EstimatedMatchingPrice>
									+ {formatDonations(matchFund, '$')}
								</EstimatedMatchingPrice>
								<EstimatedMatchingText>
									{selectedQFData?.isActive
										? 'Estimated Matching'
										: 'Matching Funds'}
								</EstimatedMatchingText>
							</EstimatedMatchingSection>
							<div>
								<LightSubline> Raised from </LightSubline>
								<Subline style={{ display: 'inline-block' }}>
									&nbsp;{roundDonorsCount}
									&nbsp;
								</Subline>
								<LightSubline>contributors</LightSubline>
							</div>
						</div>
					) : (
						<NoDonation>
							{formatMessage({
								id: selectedQF.isActive
									? 'label.be_the_first_to_donate'
									: 'label.qf_no_donations',
							})}
						</NoDonation>
					)}
				</div>
			)}

			<BottomSection>
				<CustomP>Project recipient address</CustomP>
				{recipientAddresses?.map(addObj => (
					<ProjectWalletAddress
						key={addObj.networkId}
						address={addObj.address!}
						networkId={addObj.networkId!}
					/>
				))}
			</BottomSection>
		</Wrapper>
	);
};

const BottomSection = styled.div`
	color: ${neutralColors.gray[700]};
	margin-top: 40px;
`;

const NoDonation = styled(H4)`
	margin-top: 20px;
`;

const Wrapper = styled.div`
	padding: 24px;
	background: white;
	border-radius: 16px;
	box-shadow: ${Shadow.Neutral[400]};
	overflow: hidden;
`;

const UpperSection = styled.div`
	color: ${neutralColors.gray[900]};
	text-transform: uppercase;
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

const EstimatedMatchingPrice = styled(H5)`
	color: ${semanticColors.jade[600]};
	font-weight: 700;
`;

const EstimatedMatchingText = styled(SublineBold)`
	color: ${semanticColors.jade[600]};
	font-weight: 600;
	max-width: 60px;
`;

const LightSubline = styled(Subline)`
	display: inline-block;
	color: ${neutralColors.gray[700]};
`;

const CustomP = styled(P)`
	padding-bottom: 8px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

export default ProjectTotalFundCard;
