import Image from 'next/image';
import styled from 'styled-components';
import { Lead, neutralColors } from '@giveth/ui-design-system';

import { IProject } from '@/apollo/types/types';
import { IDonationsByProjectId } from '@/apollo/types/gqlTypes';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';

const ProjectDonations = (props: {
	donationsByProjectId: IDonationsByProjectId;
	project?: IProject;
	isActive?: boolean;
	isDraft: boolean;
}) => {
	const { donationsByProjectId, project, isActive, isDraft } = props;
	const { totalDonations, id, traceCampaignId } = project || {};
	return (
		<>
			{totalDonations === 0 ? (
				isActive &&
				!isDraft && (
					<MessageContainer>
						<Image
							src='/images/icons/package.svg'
							alt='package icon'
							height={32}
							width={32}
						/>
						<MessageText>
							It seems this project has not received any donations
							yet!
						</MessageText>
					</MessageContainer>
				)
			) : (
				<>
					<ProjectTotalFundCard project={project} />
					<ProjectDonationTable
						donations={donationsByProjectId.donations}
						id={id}
						showTrace={!!traceCampaignId}
						totalDonations={totalDonations}
					/>
				</>
			)}
		</>
	);
};

const MessageContainer = styled.div`
	height: 200px;
	width: 100%;
	max-width: 750px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 32px;
`;

const MessageText = styled(Lead)`
	color: ${neutralColors.gray[800]};
`;

export default ProjectDonations;
