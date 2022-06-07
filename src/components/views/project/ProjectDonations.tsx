import Image from 'next/image';
import styled from 'styled-components';
import { Lead, neutralColors } from '@giveth/ui-design-system';

import { IProject } from '@/apollo/types/types';
import { IDonationsByProjectId } from '@/apollo/types/gqlTypes';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';
import { FlexCenter } from '@/components/styled-components/Flex';

const ProjectDonations = (props: {
	donationsByProjectId: IDonationsByProjectId;
	project?: IProject;
	isActive?: boolean;
	isDraft: boolean;
}) => {
	const { donationsByProjectId, project, isActive, isDraft } = props;
	const { totalDonations } = project || {};

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
						totalDonations={donationsByProjectId.totalCount}
						project={project}
					/>
				</>
			)}
		</>
	);
};

const MessageContainer = styled(FlexCenter)`
	height: 200px;
	width: 100%;
	flex-direction: column;
	gap: 32px;
`;

const MessageText = styled(Lead)`
	color: ${neutralColors.gray[800]};
`;

export default ProjectDonations;
