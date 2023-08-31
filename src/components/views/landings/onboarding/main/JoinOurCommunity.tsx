import styled from 'styled-components';
import {
	brandColors,
	H5,
	IconDiscord24,
	IconGithub,
	IconInstagram24,
	IconTwitter,
	IconYoutube,
	Lead,
} from '@giveth/ui-design-system';
import { OnboardingWrapper } from '@/components/views/landings/onboarding/common/common.styled';
import { Bullets } from '@/components/styled-components/Bullets';
import { Flex } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const JoinOurCommunity = () => {
	return (
		<OnboardingWrapperStyled>
			<H5 weight={700}>Join our Community</H5>
			<br />
			<Lead size='medium'>
				Our community hangs out in Discord to build, plan, and share
				ideas. Everyone is welcome! Check out our step by step guide to
				get started
				<br />
				<br />
				For the latest updates, announcements, and tips:
				<br />
				<Bullets>
					<li>
						Read our{' '}
						<ExternalLink
							href={links.BLOG}
							color={brandColors.pinky[500]}
							title='blog'
						/>
					</li>
					<li>
						Subscribe to{' '}
						<ExternalLink
							href={links.NEWS}
							color={brandColors.pinky[500]}
							title='GIVnews'
						/>
					</li>
					<li>
						Explore our{' '}
						<ExternalLink
							href={links.DOCS}
							color={brandColors.pinky[500]}
							title='documentation'
						/>
					</li>
					<li>Follow us on social media</li>
				</Bullets>
			</Lead>
			<br />
			<FlexStyled gap='40px'>
				<ExternalLink href={links.GITHUB}>
					<IconGithub size={24} />
				</ExternalLink>
				<ExternalLink href={links.DISCORD}>
					<IconDiscord24 />
				</ExternalLink>
				<ExternalLink href={links.TWITTER}>
					<IconTwitter size={24} />
				</ExternalLink>
				<ExternalLink href={links.YOUTUBE}>
					<IconYoutube size={24} />
				</ExternalLink>
				<ExternalLink href={links.INSTAGRAM}>
					<IconInstagram24 />
				</ExternalLink>
			</FlexStyled>
		</OnboardingWrapperStyled>
	);
};

const FlexStyled = styled(Flex)`
	padding: 0 24px;
	flex-wrap: wrap;
`;

const OnboardingWrapperStyled = styled(OnboardingWrapper)`
	padding-top: 124px;
	padding-bottom: 24px;
`;

export default JoinOurCommunity;
