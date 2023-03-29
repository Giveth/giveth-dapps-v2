import { useState } from 'react';
import {
	P,
	Lead,
	brandColors,
	neutralColors,
	IconDocs,
	IconMedium,
	IconGithub,
	IconRedit,
	IconYoutube,
	IconTwitter,
	Caption,
	IconDiscord,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import { Container } from '@giveth/ui-design-system';
import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '@/components/styled-components/Flex';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { LanguageModal } from '../modals/LanguageModal';

const Footer = () => {
	const { formatMessage } = useIntl();
	const theme = useAppSelector(state => state.general.theme);
	const textColor =
		theme === ETheme.Dark ? brandColors.deep[100] : brandColors.deep[800];
	const isDark = theme === ETheme.Dark;
	const [showLanguageModal, setShowLanguageModal] = useState(false);

	return (
		<FooterContainer>
			{showLanguageModal && (
				<LanguageModal setShowModal={setShowLanguageModal} />
			)}
			<ContainerStyled>
				<LeftContainer flexWrap>
					<LinkColumn>
						<Link href={Routes.Home}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.home',
								})}
							</LinkItem>
						</Link>
						<Link href={Routes.Projects}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.projects',
								})}
							</LinkItem>
						</Link>
						<Link href={Routes.AboutUs}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.about_us',
								})}
							</LinkItem>
						</Link>
						<Link href={Routes.Faq}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.faq',
								})}
							</LinkItem>
						</Link>
						<Link href={Routes.Support}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.support',
								})}
							</LinkItem>
						</Link>
					</LinkColumn>
					<LinkColumn>
						<Link href={Routes.Join}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.join_our_community',
								})}
							</LinkItem>
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
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.tos',
								})}
							</LinkItem>
						</Link>
					</LinkColumn>
					<LinkColumn>
						<a href={links.COMMONS_STACK}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.commons_stack',
								})}
							</LinkItem>
						</a>
						<Link href={Routes.Partnerships}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.partnerships',
								})}
							</LinkItem>
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
							<CaptionRed medium>
								&nbsp;
								{formatMessage({
									id: 'component.title.with_your_donation',
								})}
							</CaptionRed>
						</Link>
					</SupportUs>
				</RightContainer>
			</ContainerStyled>
			<Language
				isDark={isDark}
				onClick={() => {
					setShowLanguageModal(true);
				}}
			>
				<Image
					src={`/images/${isDark ? 'globe_white' : 'globe'}.svg`}
					alt='glboe'
					width={16}
					height={16}
				/>
				<Lang>{formatMessage({ id: 'label.choose_language' })}</Lang>
			</Language>
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

const Language = styled.div<{ isDark?: boolean }>`
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
	margin: 24px;
	padding: 24px 48px;

	color: ${props =>
		props.isDark ? brandColors.deep[100] : neutralColors.gray[800]};
	${mediaQueries.laptopS} {
		margin: 16px 0 32px 0;
	}
`;

const Lang = styled(Lead)`
	cursor: pointer;
`;
