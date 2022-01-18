import {
	P,
	brandColors,
	Container,
	IconMedium,
	IconGithub,
	IconRedit,
	IconYoutube,
	IconWikipedia,
	IconTwitter,
	Caption,
	Subline,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import { Row } from './styled-components/Grid';

export const Footer = () => {
	return (
		<FooterContainer>
			<Container>
				<Row>
					<LeftContainer wrap={1}>
						<LinkColumn>
							<Link href='/' passHref>
								<a>
									<LinkItem>Home</LinkItem>
								</a>
							</Link>
							<a href='https://giveth.io/projects'>
								<LinkItem>Projects</LinkItem>
							</a>
							<a href='https://giveth.io/about'>
								<LinkItem>About Us</LinkItem>
							</a>
							<a href='https://giveth.io/faq'>
								<LinkItem>FAQ</LinkItem>
							</a>
							<a href=''>
								<LinkItem>Support</LinkItem>
							</a>
						</LinkColumn>
						<LinkColumn>
							<a href='https://giveth.io/join'>
								<LinkItem>Join Our Community</LinkItem>
							</a>
							<a href='https://docs.giveth.io/whatisgiveth/'>
								<LinkItem>What is Giveth?</LinkItem>
							</a>
							<a href='https://docs.giveth.io/dapps/'>
								<LinkItem>User Guides</LinkItem>
							</a>
							<a href='https://docs.giveth.io/dapps/givethioinstallation'>
								<LinkItem>Developer Docs</LinkItem>
							</a>
							<a href='https://giveth.io/tos'>
								<LinkItem>Terms of Use</LinkItem>
							</a>
						</LinkColumn>
						<LinkColumn>
							<a href='https://trace.giveth.io/'>
								<LinkItem>Giveth TRACE</LinkItem>
							</a>
							<a href='https://commonsstack.org/'>
								<LinkItem>Commons Stack</LinkItem>
							</a>
							<a href='https://giveth.io/partnerships'>
								<LinkItem>Partnerships</LinkItem>
							</a>
							<a href='https://docs.giveth.io/jobs/'>
								<LinkItem>We’re Hiring!</LinkItem>
							</a>
						</LinkColumn>
					</LeftContainer>
					<RightContainer>
						<SocialContainer>
							<a href='https://medium.com/giveth/'>
								<IconMedium
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
							<a href='https://github.com/giveth'>
								<IconGithub
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
							<a href='https://reddit.com/r/giveth'>
								<IconRedit
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
							<a href='https://twitter.com/givethio'>
								<IconTwitter
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
							<a href='https://www.youtube.com/channel/UClfutpRoY0WTVnq0oB0E0wQ'>
								<IconYoutube
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
							<a href='https://docs.giveth.io/'>
								<IconWikipedia
									size={24}
									color={brandColors.deep[100]}
								/>
							</a>
						</SocialContainer>
						<Row justifyContent='flex-end'>
							<Caption medium>Support us</Caption>
							<a href='https://giveth.io/donate/the-giveth-community-of-makers'>
								<CaptionRed medium>
									&nbsp;with your Donation
								</CaptionRed>
							</a>
						</Row>
						<CopyRights>
							MMXX - No Rights Reserved - The Giveth DAC
						</CopyRights>
					</RightContainer>
				</Row>
			</Container>
		</FooterContainer>
	);
};

const FooterContainer = styled.div`
	padding: 57px 0 83px;
`;

const LeftContainer = styled(Row)`
	flex: 1;
	justify-content: space-between;
`;

const RightContainer = styled.div`
	flex: 1;
	color: ${brandColors.deep[100]};
`;

const SocialContainer = styled(Row)`
	gap: 40px;
	justify-content: flex-end;
	margin-bottom: 32px;
`;

const LinkColumn = styled(Row)`
	flex-direction: column;
	gap: 8px;
	padding-right: 16px;
	margin-bottom: 32px;
`;

const LinkItem = styled(P)`
	color: ${brandColors.deep[100]};
	cursor: pointer;
`;

const CaptionRed = styled(Caption)`
	color: ${brandColors.pinky[500]};
`;

const CopyRights = styled(Subline)`
	text-align: right;
`;
