import { Arc } from '@/components/styled-components/Arc';
import { D3, H4, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';
import Image from 'next/image';
import error401 from '/public/images/icons/errors/401.svg';
import error403 from '/public/images/icons/errors/403.svg';
import error404 from '/public/images/icons/errors/404.svg';
import error500 from '/public/images/icons/errors/500.svg';
import error502 from '/public/images/icons/errors/502.svg';
import error504 from '/public/images/icons/errors/504.svg';
import twitter from '/public/images/icons/twitter.svg';
import discord from '/public/images/icons/discord.svg';
import medium from '/public/images/icons/medium.svg';
import givFontLogo from '/public/images/icons/giv_font_logo.svg';
import { useGeneral } from '@/context/general.context';
import { useEffect } from 'react';
import links from '@/lib/constants/links';

interface IErrorProps {
	statusCode: '401' | '403' | '404' | '500' | '502' | '503' | '504';
}

const ErrorsIndex = ({ statusCode }: IErrorProps) => {
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
		<Container>
			<ArcMustardTop />
			<ArcMustardBottom />
			<TextContainer>
				<Image
					src={ErrorsObject[statusCode].image}
					width='100'
					height='100'
					alt='error icon'
				/>
				<D3>{statusCode}</D3>
				<CustomH4>
					<b>Oops!</b> {ErrorsObject[statusCode].title}
				</CustomH4>
				<div>
					<Image
						src={givFontLogo}
						width='150'
						height='100'
						alt='giveth logo'
					/>
				</div>
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
		</Container>
	);
};

const ErrorsObject = {
	'401': {
		image: error401,
		title: 'Authorization Required',
	},
	'403': {
		image: error403,
		title: 'Acces Denied/Forbidden',
	},
	'404': {
		image: error404,
		title: 'Page Not Found...',
	},
	'500': {
		image: error500,
		title: 'Internal Server Error',
	},
	'502': {
		image: error502,
		title: 'Bad Gateway',
	},
	'503': {
		image: error504,
		title: 'Service is Temporarily Unavailable',
	},
	'504': {
		image: error504,
		title: 'Gateway Timeout',
	},
};

const SocialContainer = styled.div`
	display: flex;
	text-align: center;
	gap: 16px;
	justify-content: center;
`;

const ArcMustardTop = styled(Arc)`
	border-width: 50px;
	border-color: transparent ${brandColors.mustard[500]}
		${brandColors.mustard[500]} transparent;
	transform: rotate(135deg);
	top: 100px;
	right: -130px;
	width: 260px;
	height: 260px;
	z-index: 0;
	display: none;
	${mediaQueries.tablet} {
		display: unset;
	}
`;

const CustomH4 = styled(H4)`
	color: ${brandColors.mustard[500]};
`;

const ArcMustardBottom = styled(Arc)`
	border-width: 50px;
	border-color: transparent ${brandColors.mustard[500]}
		${brandColors.mustard[500]} transparent;
	transform: rotate(315deg);
	bottom: 100px;
	left: -130px;
	width: 260px;
	height: 260px;
	z-index: 0;
	display: none;
	${mediaQueries.tablet} {
		display: unset;
	}
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	justify-content: center;
	height: 100%;
	gap: 20px;
	padding: 0;
	* {
		z-index: 2;
	}
`;

const Container = styled.div`
	background: ${brandColors.giv[500]};
	background-image: url('/images/GIV_homepage.svg');
	height: 100vh;

	color: white;
	overflow: hidden;
	position: relative;

	${mediaQueries.mobileS} {
		padding: 18px;
	}

	${mediaQueries.tablet} {
		padding: 150px 130px;
	}
`;

export default ErrorsIndex;
