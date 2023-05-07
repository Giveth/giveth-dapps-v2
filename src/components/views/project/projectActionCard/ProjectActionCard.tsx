import { neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import { DonateSection } from './DonationSection';
import { LikeAndShareSection } from './LikeAndShareSection';
import { GIVPowerSection } from './GIVPowerSection';
import { ProjectStats } from './ProjectStats';

interface IProjectActionCardProps {
	isAdmin?: boolean;
}

export const ProjectActionCard: FC<IProjectActionCardProps> = ({
	isAdmin = false,
}) => {
	return (
		<ProjectActionCardWrapper>
			{isAdmin ? (
				<>
					<ProjectStats />
				</>
			) : (
				<>
					<DonateSection />
					<LikeAndShareSection />
					<GIVPowerSection />
				</>
			)}
		</ProjectActionCardWrapper>
	);
};

const ProjectActionCardWrapper = styled.div`
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	height: 100%;
	padding: 32px 24px 24px;
`;
