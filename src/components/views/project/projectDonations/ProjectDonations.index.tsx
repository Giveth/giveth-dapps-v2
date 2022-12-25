import Image from 'next/image';
import styled from 'styled-components';
import { Lead, neutralColors } from '@giveth/ui-design-system';

import { IDonationsByProjectId } from '@/apollo/types/gqlTypes';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';
import { FlexCenter } from '@/components/styled-components/Flex';
import { useProjectContext } from '@/context/project.context';

const ProjectDonationsIndex = (props: {
	donationsByProjectId: IDonationsByProjectId;
}) => {
	const { donationsByProjectId } = props;
	const { totalCount } = donationsByProjectId || 0;
	const { isActive, isDraft } = useProjectContext();
	return (
		<>
			{totalCount > 0 ? (
				<>
					<ProjectTotalFundCard />
					<ProjectDonationTable
						donations={donationsByProjectId.donations}
						totalDonations={donationsByProjectId.totalCount}
					/>
				</>
			) : (
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

export default ProjectDonationsIndex;
