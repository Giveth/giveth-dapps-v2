import styled from 'styled-components';
import { H3, Lead } from '@giveth/ui-design-system';
import { Bullets } from '@/components/styled-components/Bullets';

const JoinOurCommunity = () => {
	return (
		<Wrapper>
			<H3 weight={700}>Join our Community</H3>
			<LeadStyled size='large'>
				Our community hangs out in Discord to build, plan, and share
				ideas. Everyone is welcome! Check out our step-by-step guide to
				get started.
				<br />
				<br />
				For the latest updates, announcements, and tips:
				<br />
				<BulletsStyled>
					<li>Read our blog</li>
					<li>Subscribe to GIVnews</li>
					<li>Explore our documentation</li>
					<li>Follow us on social media</li>
				</BulletsStyled>
				<br />
				<br />
				We look forward to building the Future of Giving with you!
			</LeadStyled>
		</Wrapper>
	);
};

const BulletsStyled = styled(Bullets)`
	margin-left: 20px;
`;

const Wrapper = styled.div`
	margin: 80px 0;
`;

const LeadStyled = styled(Lead)`
	margin-top: 20px;
`;

export default JoinOurCommunity;
