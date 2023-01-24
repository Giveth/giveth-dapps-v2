import { IDonationsByProjectId } from '@/apollo/types/gqlTypes';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';

const ProjectDonationsIndex = (props: {
	donationsByProjectId: IDonationsByProjectId;
}) => {
	const { donationsByProjectId } = props;
	const { totalCount } = donationsByProjectId || 0;
	return (
		<>
			<ProjectTotalFundCard />
			{totalCount > 0 && (
				<ProjectDonationTable
					donations={donationsByProjectId.donations}
					totalDonations={donationsByProjectId.totalCount}
				/>
			)}
		</>
	);
};

export default ProjectDonationsIndex;
