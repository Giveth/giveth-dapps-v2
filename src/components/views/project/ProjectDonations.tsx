import { IProject } from '@/apollo/types/types';
import { IDonationsByProjectId } from '@/apollo/types/gqlTypes';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';
import styled from 'styled-components';

const ProjectDonations = (props: {
	donationsByProjectId: IDonationsByProjectId;
	project?: IProject;
}) => {
	const { donationsByProjectId, project } = props;
	const { totalDonations, walletAddress, id } = project || {};
	return (
		<Wrapper>
			<ProjectTotalFundCard
				address={walletAddress}
				totalFund={totalDonations}
			/>
			<ProjectDonationTable
				donations={donationsByProjectId}
				projectId={id || ''}
			/>
		</Wrapper>
	);
};

const Wrapper = styled.div``;

export default ProjectDonations;
