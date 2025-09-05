import { mediaQueries, neutralColors, Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ProjectStats } from './ProjectStats';
import { AdminActions } from './AdminActions';
import { useProjectContext } from '@/context/project.context';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import MobileDonateFooter from './MobileDonateFooter';
import { DonateSection } from './DonationSection';
import { ProjectPublicActions } from './ProjectPublicActions';

export const ProjectActionCard = () => {
	const isMobile = !useMediaQuery(device.tablet);
	const { isAdmin } = useProjectContext();

	if (isMobile) {
		if (!isAdmin) {
			return <MobileDonateFooter />;
		}
		return null;
	}

	return (
		<ProjectActionCardWrapper
			$flexDirection='column'
			$justifyContent='space-between'
		>
			<ProjectActionInnerCard />
		</ProjectActionCardWrapper>
	);
};

const ProjectActionInnerCard = () => {
	const { isAdmin, hasActiveQFRound, isDraft, projectData } =
		useProjectContext();
	const isMobile = !useMediaQuery(device.tablet);

	return (
		<>
			{isAdmin && !isDraft && <AdminActions />}
			<DonateSection projectData={projectData} />
			{!isMobile && !isAdmin && <ProjectPublicActions />}
			{isAdmin && <ProjectStats />}
		</>
	);
};

const ProjectActionCardWrapper = styled(Flex)`
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	height: 100%;
	padding-top: 12px;
	${mediaQueries.tablet} {
		padding: 24px 24px;
	}
`;
