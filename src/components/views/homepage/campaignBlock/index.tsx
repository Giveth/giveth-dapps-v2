import {
	brandColors,
	ButtonText,
	H1,
	H4,
	IconChevronRight32,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import InternalLink from '@/components/InternalLink';
import ProjectsSwiper from '@/components/views/homepage/campaignBlock/ProjectsSwiper';
import { IProject } from '@/apollo/types/types';

const CampaignBlock = (props: { projects: IProject[] }) => {
	const { projects } = props;
	return (
		<Wrapper>
			<Title weight={700}>#FreshCampaign</Title>
			<Flex gap='24px'>
				<SavePlanet>
					<H1 weight={700}>Save The Planet!</H1>
					<InternalLink href={''} color={brandColors.giv[500]}>
						<ExploreText>
							EXPLORE <IconChevronRight32 />
						</ExploreText>
					</InternalLink>
				</SavePlanet>
				<ProjectsSwiper projects={projects} />
			</Flex>
		</Wrapper>
	);
};

const Title = styled(H4)`
	padding: 0 120px 32px;
`;

const ExploreText = styled(ButtonText)`
	margin-top: 44px;
	display: flex;
	align-items: center;
	gap: 10px;
`;

const SavePlanet = styled.div`
	border-radius: 12px;
	box-shadow: 12px 0 20px rgba(212, 218, 238, 0.4);
	padding: 73px 24px 77px 144px;
	max-width: 391px;
`;

const Wrapper = styled.div`
	padding: 42px 0;
	//max-width: 1440px;
	margin: 0 auto;
	> h4 {
		color: ${neutralColors.gray[600]};
	}
`;

export default CampaignBlock;
