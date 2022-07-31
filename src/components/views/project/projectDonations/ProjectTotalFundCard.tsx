import { FC } from 'react';
import styled from 'styled-components';
import { Subline, H2, H5, brandColors } from '@giveth/ui-design-system';

import { Shadow } from '@/components/styled-components/Shadow';
import ProjectWalletAddress from '@/components/views/project/projectDonations/ProjectWalletAddress';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';

const ProjectTotalFundCard: FC<IProjectBySlug> = ({ project }) => {
	const { totalDonations, addresses, traceCampaignId, totalTraceDonations } =
		project || {};

	return (
		<Wrapper>
			<UpperSection>
				<div>
					<Subline>All time funding received</Subline>
					<TotalFund>{'$' + totalDonations}</TotalFund>
				</div>
				{traceCampaignId && (
					<div>
						<Subline>Funding from Traces</Subline>
						<FromTraces>{'$' + totalTraceDonations}</FromTraces>
					</div>
				)}
			</UpperSection>
			<ProjectWalletAddress addresses={addresses} />
		</Wrapper>
	);
};

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
	display: flex;
	flex-wrap: wrap;
	gap: 40px 150px;
`;

const TotalFund = styled(H2)`
	font-weight: 700;
`;

const FromTraces = styled(H5)`
	margin-top: 12px;
	font-weight: 400;
`;

export default ProjectTotalFundCard;
