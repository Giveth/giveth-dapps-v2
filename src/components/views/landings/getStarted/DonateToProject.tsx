import styled from 'styled-components';
import { Button, H3, Lead } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
import { VideoContainer } from '@/components/views/landings/getStarted/common.styled';

const DonateToProject = () => {
	return (
		<Wrapper>
			<H3 weight={700}>Donate to a Project</H3>
			<LeadStyled size='large'>
				Next up, try donating to a project on Giveth! We’ve got over
				1,800 to choose from in categories ranging from Disaster Relief,
				Art & Culture, Education, Health & Wellness and more!
				<br />
				<br />
				<VideoContainer>
					<iframe
						width='100%'
						height='315'
						src='https://www.youtube.com/embed/UlaXjiamHZk'
						title='YouTube video player'
						frameBorder='0'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
						allowFullScreen
					/>
				</VideoContainer>
				<br />
				<ExternalLink href='https://youtube.com/playlist?list=PL4Artm1rmCWH4Q5XnrQWf8fm0xob3hbdZ'>
					<Button label='View our entire Giveth Donor Series' />
				</ExternalLink>
			</LeadStyled>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin: 80px 0;
`;

const LeadStyled = styled(Lead)`
	margin-top: 20px;
`;

export default DonateToProject;
