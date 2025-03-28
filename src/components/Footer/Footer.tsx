import { useState } from 'react';
import {
	P,
	Lead,
	brandColors,
	neutralColors,
	IconDocs,
	IconMedium,
	IconGithub,
	IconYoutube,
	Caption,
	IconDiscord,
	IconInstagram24,
	IconXSocial,
	IconRedit,
	Container,
	Flex,
	IconFaracaster,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';
import { mediaQueries } from '@/lib/constants/constants';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { LanguageModal } from '../modals/LanguageModal';
import ExternalLink from '@/components/ExternalLink';

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
				<LeftContainer $flexWrap>
					<LinkColumn>
						<Link href={Routes.Home}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.home',
								})}
							</LinkItem>
						</Link>
						<Link href={Routes.AllProjects}>
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
						<a
							href={links.DOCS}
							target='_blank'
							rel='noreferrer noopener'
						>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.docs',
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
						<Link href={Routes.Onboarding}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.onboarding_guide',
								})}
							</LinkItem>
						</Link>
					</LinkColumn>
					<LinkColumn>
						<Link href={Routes.Partnerships}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.partnerships',
								})}
							</LinkItem>
						</Link>
						<a
							href={links.FEEDBACK}
							target='_blank'
							rel='noreferrer noopener'
						>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'label.leave_feedback',
								})}
							</LinkItem>
						</a>
						<a href={links.RECRUITEE}>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.we_hiring',
								})}
							</LinkItem>
						</a>
					</LinkColumn>
					<LinkColumn>
						<a href={links.QACC} target='_blank'>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.qacc',
								})}
							</LinkItem>
						</a>
						<a href={links.QACC_NEWS} target='_blank'>
							<LinkItem color={textColor}>
								{formatMessage({
									id: 'component.title.qacc_news',
								})}
							</LinkItem>
						</a>
					</LinkColumn>
				</LeftContainer>
				<RightContainer color={textColor}>
					<SocialContainer>
						<ExternalLink href={links.INSTAGRAM}>
							<IconInstagram24 color={textColor} />
						</ExternalLink>
						<ExternalLink href={links.MEDIUM}>
							<IconMedium size={24} color={textColor} />
						</ExternalLink>
						<ExternalLink href={links.GITHUB}>
							<IconGithub size={24} color={textColor} />
						</ExternalLink>
						<ExternalLink href={links.REDDIT}>
							<IconRedit size={24} color={textColor} />
						</ExternalLink>
						<ExternalLink href={links.TWITTER}>
							<IconXSocial size={24} color={textColor} />
						</ExternalLink>
						<ExternalLink href={links.FARCASTER}>
							<IconFaracaster size={24} color={textColor} />
						</ExternalLink>
						<ExternalLink href={links.YOUTUBE}>
							<IconYoutube size={24} color={textColor} />
						</ExternalLink>
						<ExternalLink href={links.DISCORD}>
							<IconDiscord size={24} color={textColor} />
						</ExternalLink>
						<ExternalLink href={links.DOCS}>
							<IconDocs size={24} color={textColor} />
						</ExternalLink>
					</SocialContainer>
					<SupportUs>
						<Caption $medium>
							{formatMessage({
								id: 'component.title.support_us',
							})}
						</Caption>
						<Link href={links.SUPPORT_US}>
							<CaptionRed $medium>
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
				$isDark={isDark}
				onClick={() => setShowLanguageModal(true)}
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
	padding: 80px 0 12px;
	z-index: 2;
`;

const LeftContainer = styled(Flex)`
	justify-content: space-between;
	gap: 0;

	${mediaQueries.laptopL} {
		gap: 0 0px;
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

	${mediaQueries.laptopS} {
		gap: 30px;
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

const Language = styled.div<{ $isDark?: boolean }>`
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
	margin: 24px;
	padding: 24px 48px;

	color: ${props =>
		props.$isDark ? brandColors.deep[100] : neutralColors.gray[800]};
	${mediaQueries.laptopS} {
		margin: 16px 0 32px 0;
	}
`;

const Lang = styled(Lead)`
	cursor: pointer;
`;
