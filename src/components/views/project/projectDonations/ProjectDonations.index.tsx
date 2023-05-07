import styled from 'styled-components';
import { mediaQueries } from '@giveth/ui-design-system';
import { IDonationsByProjectId } from '@/apollo/types/gqlTypes';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';

const ProjectDonationsIndex = (props: {
	donationsByProjectId: IDonationsByProjectId;
}) => {
	const { donationsByProjectId } = props;
	const { totalCount } = donationsByProjectId || 0;
	return (
		<Wrapper>
			<ProjectTotalFundCard />
			{totalCount > 0 && (
				<ProjectDonationTable
					donations={donationsByProjectId.donations}
					totalDonations={donationsByProjectId.totalCount}
				/>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 100px;
	gap: 40px;
	${mediaQueries.desktop} {
		align-items: flex-start;
		flex-direction: row-reverse;
	}
`;

export default ProjectDonationsIndex;
