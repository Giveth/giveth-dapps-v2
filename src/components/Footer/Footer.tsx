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
import { Row } from '@/components/styled-components/Grid';
import { ETheme, useGeneral } from '@/context/general.context';

export const Footer = () => {
	const { theme } = useGeneral();
	const textColor =
		theme === ETheme.Dark ? brandColors.deep[100] : brandColors.deep[800];
	return (
		<FooterContainer>
			<Container>
				<Row>
					<LeftContainer wrap={1}>
						<LinkColumn>
							<Link href='/' passHref>
								<a>
									<LinkItem color={textColor}>Home</LinkItem>
								</a>
							</Link>
							<a href='https://giveth.io/projects'>
								<LinkItem color={textColor}>Projects</LinkItem>
							</a>
							<a href='https://giveth.io/about'>
								<LinkItem color={textColor}>About Us</LinkItem>
							</a>
							<a href='https://giveth.io/faq'>
								<LinkItem color={textColor}>FAQ</LinkItem>
							</a>
							<a href=''>
								<LinkItem color={textColor}>Support</LinkItem>
							</a>
						</LinkColumn>
						<LinkColumn>
							<a href='https://giveth.io/join'>
								<LinkItem color={textColor}>
									Join Our Community
								</LinkItem>
							</a>
							<a href='https://docs.giveth.io/whatisgiveth/'>
								<LinkItem color={textColor}>
									What is Giveth?
								</LinkItem>
							</a>
							<a href='https://docs.giveth.io/dapps/'>
								<LinkItem color={textColor}>
									User Guides
								</LinkItem>
							</a>
							<a href='https://docs.giveth.io/dapps/givethioinstallation'>
								<LinkItem color={textColor}>
									Developer Docs
								</LinkItem>
							</a>
							<a href='https://giveth.io/tos'>
								<LinkItem color={textColor}>
									Terms of Use
								</LinkItem>
							</a>
						</LinkColumn>
						<LinkColumn>
							<a href='https://trace.giveth.io/'>
								<LinkItem color={textColor}>
									Giveth TRACE
								</LinkItem>
							</a>
							<a href='https://commonsstack.org/'>
								<LinkItem color={textColor}>
									Commons Stack
								</LinkItem>
							</a>
							<a href='https://giveth.io/partnerships'>
								<LinkItem color={textColor}>
									Partnerships
								</LinkItem>
							</a>
							<a href='https://docs.giveth.io/jobs/'>
								<LinkItem color={textColor}>
									We’re Hiring!
								</LinkItem>
							</a>
						</LinkColumn>
					</LeftContainer>
					<RightContainer color={textColor}>
						<SocialContainer>
							<a href='https://medium.com/giveth/'>
								<IconMedium size={24} color={textColor} />
							</a>
							<a href='https://github.com/giveth'>
								<IconGithub size={24} color={textColor} />
							</a>
							<a href='https://reddit.com/r/giveth'>
								<IconRedit size={24} color={textColor} />
							</a>
							<a href='https://twitter.com/givethio'>
								<IconTwitter size={24} color={textColor} />
							</a>
							<a href='https://www.youtube.com/channel/UClfutpRoY0WTVnq0oB0E0wQ'>
								<IconYoutube size={24} color={textColor} />
							</a>
							<a href='https://docs.giveth.io/'>
								<IconWikipedia size={24} color={textColor} />
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

const RightContainer = styled.div<{ color: string }>`
	flex: 1;
	color: ${props => props.color};
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

const LinkItem = styled(P)<{ color: string }>`
	cursor: pointer;
	color: ${props => props.color};
`;

const CaptionRed = styled(Caption)`
	color: ${brandColors.pinky[500]};
`;

const CopyRights = styled(Subline)`
	text-align: right;
`;
