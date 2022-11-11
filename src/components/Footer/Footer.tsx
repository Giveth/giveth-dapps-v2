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
	IconDiscord,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '@/components/styled-components/Flex';
import { Container } from '@/components/Grid';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';

const Footer = () => {
	const { formatMessage } = useIntl();
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
								<LinkItem color={textColor}>
									{formatMessage({
										id: 'component.title.home',
									})}
								</LinkItem>
							</a>
						</Link>
						<Link href={Routes.Projects}>
							<a>
								<LinkItem color={textColor}>
									{formatMessage({
										id: 'component.title.projects',
									})}
								</LinkItem>
							</a>
						</Link>
						<Link href={Routes.AboutUs}>
							<a>
								<LinkItem color={textColor}>
									{formatMessage({
										id: 'component.title.about_us',
									})}
								</LinkItem>
							</a>
						</Link>
						<Link href={Routes.Faq}>
							<a>
								<LinkItem color={textColor}>
									{formatMessage({
										id: 'component.title.faq',
									})}
								</LinkItem>
							</a>
						</Link>
						<Link href={Routes.Support}>
							<a>
								<LinkItem color={textColor}>
									{formatMessage({
										id: 'component.title.support',
									})}
								</LinkItem>
							</a>
						</Link>
					</LinkColumn>
					<LinkColumn>
						<Link href={Routes.Join}>
							<a>
								<LinkItem color={textColor}>
									{formatMessage({
										id: 'component.title.join_our_community',
									})}
								</LinkItem>
							</a>
						</Link>
						<a href={links.GIVETH_DOCS}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.what_is_giveth',
								})}
							</LinkItem>
						</a>
						<a href={links.USER_DOCS}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.user_guides',
								})}
							</LinkItem>
						</a>
						<a href={links.DEVELOPER_DOCS}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.dev_docs',
								})}
							</LinkItem>
						</a>
						<Link href={Routes.Terms}>
							<a>
								<LinkItem color={textColor}>
									{formatMessage({
										id: 'component.title.tos',
									})}
								</LinkItem>
							</a>
						</Link>
					</LinkColumn>
					<LinkColumn>
						<a href={links.TRACE}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.giveth_trace',
								})}
							</LinkItem>
						</a>
						<a href={links.COMMONS_STACK}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.commons_stack',
								})}
							</LinkItem>
						</a>
						<Link href={Routes.Partnerships}>
							<a>
								<LinkItem color={textColor}>
									{formatMessage({
										id: 'component.title.partnerships',
									})}
								</LinkItem>
							</a>
						</Link>
						<a href={links.RECRUITEE}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.we_hiring',
								})}
							</LinkItem>
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
						<a href={links.DISCORD}>
							<IconDiscord size={24} color={textColor} />
						</a>
						<a href={links.DOCS}>
							<IconDocs size={24} color={textColor} />
						</a>
					</SocialContainer>
					<SupportUs>
						<Caption medium>
							{formatMessage({
								id: 'component.title.support_us',
							})}
						</Caption>
						<Link href={links.SUPPORT_US}>
							<a>
								<CaptionRed medium>
									&nbsp;
									{formatMessage({
										id: 'component.title.with_your_donation',
									})}
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

	${mediaQueries.laptopS} {
		text-align: right;
	}
`;

const SupportUs = styled.div`
	display: flex;
	margin-bottom: 32px;

	${mediaQueries.laptopS} {
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
