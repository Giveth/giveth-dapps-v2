import { FC } from 'react';
import styled from 'styled-components';
import {
	B,
	H2,
	H4,
	H5,
	Lead,
	neutralColors,
	P,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

import { Shadow } from '@/components/styled-components/Shadow';
import ProjectWalletAddress from '@/components/views/project/projectDonations/ProjectWalletAddress';
import { useProjectContext } from '@/context/project.context';
import { hasActiveRound } from '@/helpers/qf';
import { Flex } from '@/components/styled-components/Flex';

const ProjectTotalFundCard: FC = () => {
	const { projectData } = useProjectContext();
	const { totalDonations, addresses, qfRounds } = projectData || {};
	const { formatMessage } = useIntl();
	const recipientAddresses = addresses?.filter(a => a.isRecipient);
	const isQFActive = hasActiveRound(qfRounds);
	return (
		<Wrapper>
			{!isQFActive ? (
				<UpperSection>
					<LeadStyled>
						{formatMessage({ id: 'label.all_time_funding' })}
					</LeadStyled>
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
						<B>QF round 1 donations</B>
					</BorderedFlex>
					{totalDonations && totalDonations > 0 ? (
						<div>
							<TotalFund>
								{'$' + totalDonations.toFixed(2)}
							</TotalFund>
							<EstimatedMatchingSection
								justifyContent='space-between'
								alignItems='center'
							>
								<EstimatedMatchingPrice>
									+ $2000.00
								</EstimatedMatchingPrice>
								<EstematedMatchingText>
									Estimated Matching
								</EstematedMatchingText>
							</EstimatedMatchingSection>
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
				<P>
					{formatMessage({
						id: 'label.associated_wallet_address',
					})}
				</P>
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

const LeadStyled = styled(Lead)`
	margin-bottom: 8px;
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

const EstematedMatchingText = styled(SublineBold)`
	color: ${semanticColors.jade[600]};
	font-weight: 600;
	max-width: 60px;
`;

export default ProjectTotalFundCard;
