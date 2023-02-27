import { D3 } from '@giveth/ui-design-system';
import Image from 'next/image';
import { useEffect } from 'react';
import Link from 'next/link';
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
import links from '@/lib/constants/links';
import {
	ErrorContainer,
	ArcMustardBottom,
	CustomBigWarningImage,
	ArcMustardTop,
	CustomH4,
	CustomSmallWarningImage,
	SocialContainer,
	TextContainer,
	StyledImage,
	LogoContainer,
} from './ErrorsIndex.sc';
import {
	hideHeaderFooter,
	showHeaderFooter,
} from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

interface IErrorProps {
	statusCode: '401' | '403' | '404' | '500' | '502' | '503' | '504';
}

const ErrorsIndex = ({ statusCode }: IErrorProps) => {
	const dispatch = useAppDispatch();

	const {
		TWITTER: twitterLink,
		DISCORD: discordLink,
		MEDIUM: mediumLink,
	} = links;

	useEffect(() => {
		dispatch(hideHeaderFooter());
		return () => {
			dispatch(showHeaderFooter());
		};
	}, []);

	return (
		<ErrorContainer>
			<ArcMustardTop />
			<ArcMustardBottom />
			<CustomBigWarningImage
				src='/images/icons/warning.svg'
				loading='lazy'
			/>
			<CustomSmallWarningImage
				src='/images/icons/warning.svg'
				loading='lazy'
			/>
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
				<LogoContainer>
					<Link href='/'>
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

const ErrorsObject = {
	'401': {
		image: error401,
		title: 'Authorization Required',
	},
	'403': {
		image: error403,
		title: 'Access Denied/Forbidden',
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

export default ErrorsIndex;
