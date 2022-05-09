import { H1, H4 } from '@giveth/ui-design-system';
import Image from 'next/image';
import { useEffect } from 'react';
import Link from 'next/link';
import links from '@/lib/constants/links';
import { useGeneral } from '@/context/general.context';
import givFontLogo from '/public/images/icons/giv_font_logo.svg';
import twitter from '/public/images/icons/twitter.svg';
import discord from '/public/images/icons/discord.svg';
import medium from '/public/images/icons/medium.svg';

import {
	ErrorContainer,
	ArcMustardBottom,
	ArcMustardTop,
	SocialContainer,
	TextContainer,
	CustomGearImage,
	CustomGearsImage,
	MustardSpan,
	LogoContainer,
	StyledImage,
} from './ErrorsIndex.sc';
const MaintenanceIndex = () => {
	const { setShowFooter, setShowHeader } = useGeneral();
	const {
		TWITTER: twitterLink,
		DISCORD: discordLink,
		MEDIUM: mediumLink,
	} = links;

	useEffect(() => {
		setShowFooter(false);
		setShowHeader(false);
		return () => {
			setShowFooter(true);
			setShowHeader(true);
		};
	}, []);

	return (
		<ErrorContainer>
			<ArcMustardTop />
			<ArcMustardBottom />
			<CustomGearImage src='/images/icons/gear.svg' loading='lazy' />
			<CustomGearsImage src='/images/icons/gears.svg' loading='lazy' />
			<TextContainer>
				<Image
					src='/images/icons/warning_mustard.svg'
					width='100'
					height='100'
					alt='error icon'
				/>
				<H1>
					Giveth.io is currently offline for scheduled maintenance!
				</H1>
				<div>
					<H4>Check again in a few hours to dive</H4>
					<H4>
						<b>
							back into the{' '}
							<MustardSpan>Future of Giving</MustardSpan>
						</b>
					</H4>
				</div>
				<LogoContainer>
					<Link href='/' passHref>
						<StyledImage
							src={givFontLogo}
							width='150'
							height='50'
							alt='giveth logo'
						/>
					</Link>
				</LogoContainer>
			</TextContainer>
			<SocialContainer>
				<a href={discordLink} target='_blank' rel='noreferrer noopener'>
					<Image
						src={discord}
						width='20'
						height='20'
						alt='giveth discord'
					/>
				</a>
				<a href={mediumLink} target='_blank' rel='noreferrer noopener'>
					<Image
						src={medium}
						width='20'
						height='20'
						alt='giveth medium'
					/>
				</a>
				<a href={twitterLink} target='_blank' rel='noreferrer noopener'>
					{' '}
					<Image
						src={twitter}
						width='20'
						height='20'
						alt='giveth twitter'
					/>
				</a>
			</SocialContainer>
		</ErrorContainer>
	);
};

export default MaintenanceIndex;
