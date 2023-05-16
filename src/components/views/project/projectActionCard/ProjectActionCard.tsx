import { neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import { DonateSection } from './DonationSection';
import { ProjectPublicActions } from './ProjectPublicActions';
import { ProjectStats } from './ProjectStats';
import { AdminActions } from './AdminActions';
import { Flex } from '@/components/styled-components/Flex';
import { useAppSelector } from '@/features/hooks';
import LoadingAnimation from '@/animations/loading_giv.json';
import LottieControl from '@/components/LottieControl';
import { useProjectContext } from '@/context/project.context';

interface IProjectActionCardProps {}

export const ProjectActionCard: FC<IProjectActionCardProps> = ({}) => {
	const { isLoading } = useAppSelector(state => state.user);
	const { isAdmin } = useProjectContext();

	return (
		<ProjectActionCardWrapper
			flexDirection='column'
			justifyContent='space-between'
		>
			{isLoading ? (
				<LottieControl animationData={LoadingAnimation} size={300} />
			) : isAdmin ? (
				<>
					<ProjectStats />
					<AdminActions />
				</>
			) : (
				<>
					<DonateSection />
					<ProjectPublicActions />
				</>
			)}
		</ProjectActionCardWrapper>
	);
};

const ProjectActionCardWrapper = styled(Flex)`
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	height: 100%;
	padding: 32px 24px 24px;
`;
