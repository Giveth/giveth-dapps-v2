import { FC } from 'react';
import styled from 'styled-components';
import {
	H2,
	H4,
	Lead,
	mediaQueries,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

import { Shadow } from '@/components/styled-components/Shadow';
import ProjectWalletAddress from '@/components/views/project/projectDonations/ProjectWalletAddress';
import { useProjectContext } from '@/context/project.context';

const ProjectTotalFundCard: FC = () => {
	const { projectData } = useProjectContext();
	const { totalDonations, addresses } = projectData || {};
	const { formatMessage } = useIntl();
	const recipientAddresses = addresses?.filter(a => a.isRecipient);

	return (
		<Wrapper>
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
			<BottomSection>
				<P>
					{formatMessage({
						id: 'label.associated_wallet_address',
					})}
				</P>
				{recipientAddresses?.map(addObj => (
					<ProjectWalletAddress
						key={addObj.address}
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
	flex-shrink: 0;
	${mediaQueries.mobileL} {
		width: 390px;
	}
`;

const UpperSection = styled.div`
	color: ${neutralColors.gray[900]};
	text-transform: uppercase;
`;

const TotalFund = styled(H2)`
	font-weight: 700;
`;

export default ProjectTotalFundCard;
