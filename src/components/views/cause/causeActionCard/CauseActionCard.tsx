import { mediaQueries, neutralColors, Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { CauseStats } from '@/components/views/cause/causeActionCard/CauseStats';
import { CauseAdminActions } from '@/components/views/cause/causeActionCard/CauseAdminActions';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import MobileDonateFooter from './MobileDonateFooter';
import CauseQFSection from '@/components/views/cause/causeActionCard/CauseQFSection';
import { CauseDonateSection } from '@/components/views/cause/causeActionCard/CauseDonationSection';
import { CausePublicActions } from '@/components/views/cause/causeActionCard/CausePublicActions';
import { useCauseContext } from '@/context/cause.context';

export const CauseActionCard = () => {
	const isMobile = !useMediaQuery(device.tablet);
	const { isAdmin } = useCauseContext();

	if (isMobile) {
		if (!isAdmin) {
			return <MobileDonateFooter />;
		}
		return null;
	}

	return (
		<CauseActionCardWrapper
			$flexDirection='column'
			$justifyContent='space-between'
		>
			<ProjectActionInnerCard />
		</CauseActionCardWrapper>
	);
};

const ProjectActionInnerCard = () => {
	const { isAdmin, hasActiveQFRound, isDraft, causeData } = useCauseContext();
	const isMobile = !useMediaQuery(device.tablet);

	return (
		<>
			{isAdmin && !isDraft && <CauseAdminActions />}
			{!isMobile && hasActiveQFRound ? (
				<CauseQFSection causeData={causeData} />
			) : (
				<CauseDonateSection causeData={causeData} />
			)}
			{!isMobile && !isAdmin && <CausePublicActions />}
			{isAdmin && <CauseStats />}
		</>
	);
};

const CauseActionCardWrapper = styled(Flex)`
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	height: 100%;
	padding-top: 12px;
	${mediaQueries.tablet} {
		padding: 24px 24px;
	}
`;
