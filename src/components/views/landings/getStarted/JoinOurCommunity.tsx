import styled from 'styled-components';
import {
	brandColors,
	H3,
	IconDiscord,
	IconInstagram,
	IconLinkedin,
	IconTwitter,
	IconYoutube,
	Lead,
} from '@giveth/ui-design-system';
import { Bullets } from '@/components/styled-components/Bullets';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { Flex } from '@/components/styled-components/Flex';

const JoinOurCommunity = () => {
	return (
		<Wrapper>
			<H3 weight={700}>Join our Community</H3>
			<LeadStyled size='large'>
				Our community hangs out in Discord to build, plan, and share
				ideas. Everyone is welcome! Check out our{' '}
				<ExternalLink
					color={brandColors.pinky[500]}
					href={links.INTRO_DISCORD}
					title='step-by-step guide'
				/>{' '}
				to get started.
				<br />
				<br />
				For the latest updates, announcements, and tips:
				<br />
				<BulletsStyled>
					<li>
						Read{' '}
						<ExternalLink
							color={brandColors.pinky[500]}
							href={links.BLOG}
							title='our blog'
						/>
					</li>
					<li>
						Subscribe to{' '}
						<ExternalLink
							color={brandColors.pinky[500]}
							href={links.NEWS}
							title='GIVnews'
						/>
					</li>
					<li>
						Explore our{' '}
						<ExternalLink
							color={brandColors.pinky[500]}
							href={links.DOCS}
							title='documentation'
						/>
					</li>
					<li>Follow us on social media</li>
					<IconContainer>
						<ExternalLink href={links.TWITTER}>
							<IconTwitter size={32} />
						</ExternalLink>
						<ExternalLink href={links.DISCORD}>
							<IconDiscord size={32} />
						</ExternalLink>
						<ExternalLink href={links.YOUTUBE}>
							<IconYoutube size={32} />
						</ExternalLink>
						<ExternalLink href={links.INSTAGRAM}>
							<IconInstagram size={32} />
						</ExternalLink>
						<ExternalLink href={links.LINKEDIN}>
							<IconLinkedin size={32} />
						</ExternalLink>
					</IconContainer>
				</BulletsStyled>
				<br />
				<br />
				We look forward to building the Future of Giving with you!
			</LeadStyled>
		</Wrapper>
	);
};

const IconContainer = styled(Flex)`
	margin-top: 20px;
	align-items: center;
	gap: 40px;
	height: 100px;
`;

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
