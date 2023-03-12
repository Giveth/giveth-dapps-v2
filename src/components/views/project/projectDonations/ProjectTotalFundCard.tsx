import { FC } from 'react';
import styled from 'styled-components';
import { Subline, H2, brandColors, H4 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

import { Shadow } from '@/components/styled-components/Shadow';
import ProjectWalletAddress from '@/components/views/project/projectDonations/ProjectWalletAddress';
import { useProjectContext } from '@/context/project.context';

const ProjectTotalFundCard: FC = () => {
	const { projectData } = useProjectContext();
	const { totalDonations, addresses } = projectData || {};
	const { formatMessage } = useIntl();

	return (
		<Wrapper>
			<UpperSection>
				<Subline>
					{formatMessage({ id: 'label.all_time_funding' })}
				</Subline>
				{totalDonations && totalDonations > 0 ? (
					<TotalFund>{'$' + totalDonations}</TotalFund>
				) : (
					<NoDonation>
						{formatMessage({
							id: 'label.be_the_first_to_donate',
						})}
					</NoDonation>
				)}
			</UpperSection>
			{addresses && <ProjectWalletAddress addresses={addresses} />}
		</Wrapper>
	);
};

const NoDonation = styled(H4)`
	margin-top: 20px;
`;

const Wrapper = styled.div`
	background: white;
	border-radius: 12px;
	box-shadow: ${Shadow.Neutral[400]};
	overflow: hidden;
`;

const UpperSection = styled.div`
	padding: 24px 21px 16px 21px;
	color: ${brandColors.deep[800]};
	text-transform: uppercase;
`;

const TotalFund = styled(H2)`
	font-weight: 700;
`;

export default ProjectTotalFundCard;
