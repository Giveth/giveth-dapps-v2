import {
	P,
	brandColors,
	IconDocs,
	IconMedium,
	IconGithub,
	IconRedit,
	IconYoutube,
	IconTwitter,
	Caption,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';

import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '@/components/styled-components/Flex';
import { Container } from '@/components/Grid';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.sclie';

const Footer = () => {
	const theme = useAppSelector(state => state.general.theme);
	const textColor =
		theme === ETheme.Dark ? brandColors.deep[100] : brandColors.deep[800];
	return (
		<FooterContainer>
			<ContainerStyled>
				<LeftContainer wrap={1}>
					<LinkColumn>
						<Link href={Routes.Home}>
							<a>
								<LinkItem color={textColor}>Home</LinkItem>
							</a>
						</Link>
						<Link href={Routes.Projects}>
							<a>
								<LinkItem color={textColor}>Projects</LinkItem>
							</a>
						</Link>
						<Link href={Routes.AboutUs}>
							<a>
								<LinkItem color={textColor}>About Us</LinkItem>
							</a>
						</Link>
						<Link href={Routes.Faq}>
							<a>
								<LinkItem color={textColor}>FAQ</LinkItem>
							</a>
						</Link>
						<Link href={Routes.Support}>
							<a>
								<LinkItem color={textColor}>Support</LinkItem>
							</a>
						</Link>
					</LinkColumn>
					<LinkColumn>
						<Link href={Routes.Join}>
							<a>
								<LinkItem color={textColor}>
									Join Our Community
								</LinkItem>
							</a>
						</Link>
						<a href={links.GIVETH_DOCS}>
							<LinkItem color={textColor}>
								What is Giveth?
							</LinkItem>
						</a>
						<a href={links.USER_DOCS}>
							<LinkItem color={textColor}>User Guides</LinkItem>
						</a>
						<a href={links.DEVELOPER_DOCS}>
							<LinkItem color={textColor}>
								Developer Docs
							</LinkItem>
						</a>
						<Link href={Routes.Terms}>
							<a>
								<LinkItem color={textColor}>
									Terms of Use
								</LinkItem>
							</a>
						</Link>
					</LinkColumn>
					<LinkColumn>
						<a href={links.TRACE}>
							<LinkItem color={textColor}>Giveth TRACE</LinkItem>
						</a>
						<a href={links.COMMONS_STACK}>
							<LinkItem color={textColor}>Commons Stack</LinkItem>
						</a>
						<Link href={Routes.Partnerships}>
							<a>
								<LinkItem color={textColor}>
									Partnerships
								</LinkItem>
							</a>
						</Link>
						<a href={links.RECRUITEE}>
							<LinkItem color={textColor}>We’re Hiring!</LinkItem>
						</a>
					</LinkColumn>
				</LeftContainer>
				<RightContainer color={textColor}>
					<SocialContainer>
						<a href={links.MEDIUM}>
							<IconMedium size={24} color={textColor} />
						</a>
						<a href={links.GITHUB}>
							<IconGithub size={24} color={textColor} />
						</a>
						<a href={links.REDDIT}>
							<IconRedit size={24} color={textColor} />
						</a>
						<a href={links.TWITTER}>
							<IconTwitter size={24} color={textColor} />
						</a>
						<a href={links.YOUTUBE}>
							<IconYoutube size={24} color={textColor} />
						</a>
						<a href={links.DOCS}>
							<IconDocs size={24} color={textColor} />
						</a>
					</SocialContainer>
					<SupportUs>
						<Caption medium>Support us</Caption>
						<Link href={links.SUPPORT_US}>
							<a>
								<CaptionRed medium>
									&nbsp;with your Donation
								</CaptionRed>
							</a>
						</Link>
					</SupportUs>
				</RightContainer>
			</ContainerStyled>
		</FooterContainer>
	);
};

export default Footer;

const ContainerStyled = styled(Container)`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
`;

const FooterContainer = styled.div`
	position: relative;
	padding: 35px 0 12px;
	z-index: 2;
`;

const LeftContainer = styled(Flex)`
	justify-content: space-between;
	gap: 0;

	${mediaQueries.laptopL} {
		gap: 0 72px;
	}
`;

const RightContainer = styled.div<{ color: string }>`
	text-align: left;
	color: ${props => props.color};

	${mediaQueries.laptop} {
		text-align: right;
	}
`;

const SupportUs = styled.div`
	display: flex;
	margin-bottom: 32px;

	${mediaQueries.laptop} {
		justify-content: flex-end;
	}
`;

const SocialContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	justify-content: space-between;
	margin-bottom: 32px;

	${mediaQueries.mobileL} {
		gap: 40px;
	}
`;

const LinkColumn = styled(Flex)`
	flex-direction: column;
	gap: 8px;
	margin-bottom: 32px;
	width: 180px;
`;

const LinkItem = styled(P)<{ color: string }>`
	cursor: pointer;
	color: ${props => props.color};
`;

const CaptionRed = styled(Caption)`
	color: ${brandColors.pinky[500]};
`;
