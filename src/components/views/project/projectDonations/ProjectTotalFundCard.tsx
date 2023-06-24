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

import { captureException } from '@sentry/nextjs';
import { useEffect, useState } from 'react';
import { Shadow } from '@/components/styled-components/Shadow';
import ProjectWalletAddress from '@/components/views/project/projectDonations/ProjectWalletAddress';
import { useProjectContext } from '@/context/project.context';
import { calculateTotalEstimatedMatching } from '@/helpers/qf';
import { Flex } from '@/components/styled-components/Flex';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_PROJECT_DONATIONS,
	FETCH_QF_ROUND_HISTORY,
} from '@/apollo/gql/gqlDonations';
import { EDonationStatus, ESortby, EDirection } from '@/apollo/types/gqlEnums';
import {
	IDonationsByProjectId,
	IDonationsByProjectIdGQL,
} from '@/apollo/types/gqlTypes';
import { showToastError } from '@/lib/helpers';
import { IGetQfRoundHistory, IQFRound } from '@/apollo/types/types';

const donationsPerPage = 10;

interface IProjectTotalFundCardProps {
	selectedQF: IQFRound | null;
}

const ProjectTotalFundCard = ({ selectedQF }: IProjectTotalFundCardProps) => {
	const [donationInfo, setDonationInfo] = useState<IDonationsByProjectId>();
	const [qfRoundHistory, setQfRoundHistory] = useState<IGetQfRoundHistory>();
	const { projectData, isAdmin } = useProjectContext();
	const {
		id,
		totalDonations,
		addresses,
		qfRounds,
		countUniqueDonorsForActiveQfRound,
		estimatedMatching,
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
			client
				.query({
					query: FETCH_PROJECT_DONATIONS,
					variables: {
						projectId: parseInt(id),
						skip: 0,
						take: donationsPerPage,
						status: isAdmin ? null : EDonationStatus.VERIFIED,
						qfRoundId:
							selectedQF !== null
								? parseInt(selectedQF.id)
								: undefined,
						orderBy: {
							field: ESortby.CREATION_DATE,
							direction: EDirection.DESC,
						},
					},
				})
				.then((res: IDonationsByProjectIdGQL) => {
					const donationsByProjectId = res.data.donationsByProjectId;
					setDonationInfo(donationsByProjectId);
				})
				.catch((error: unknown) => {
					showToastError(error);
					captureException(error, {
						tags: {
							section: 'fetchProjectDonation',
						},
					});
				});
		};

		const fetchCurrentQfDonationsInfo = async () => {};

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
			: qfRoundHistory?.raisedFundInUsd;

	const roundDonationCount =
		selectedQF && selectedQF.isActive
			? projectData?.countUniqueDonorsForActiveQfRound
			: qfRoundHistory?.uniqueDonors;

	return (
		<Wrapper>
			{selectedQF === null ? (
				<UpperSection>
					<B>All time donations received</B>
					{totalDonations && totalDonations > 0 ? (
						<TotalFund>{'$' + totalDonations.toFixed(2)}</TotalFund>
					) : (
						<NoDonation>
							{formatMessage({
								id: 'label.be_the_first_to_donate',
							})}
						</NoDonation>
					)}
				</UpperSection>
			) : (
				<div>
					<BorderedFlex>
						<P>Round: &nbsp;</P>
						<B>QF round {selectedQF.id} donations</B>
					</BorderedFlex>
					{roundDonationCount && roundDonationCount > 0 ? (
						<div>
							<TotalFund>
								{'$' + roundTotalDonation?.toFixed(2) || '0'}
							</TotalFund>
							<EstimatedMatchingSection
								justifyContent='space-between'
								alignItems='center'
							>
								<EstimatedMatchingPrice>
									+ $
									{calculateTotalEstimatedMatching(
										projectDonationsSqrtRootSum,
										allProjectsSum,
										matchingPool,
									).toFixed(2)}
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
									&nbsp;{countUniqueDonorsForActiveQfRound}
									&nbsp;
								</Subline>
								<LightSubline>contributors</LightSubline>
							</div>
						</div>
					) : (
						<NoDonation>
							{formatMessage({
								id: 'label.be_the_first_to_donate',
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
