import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	H6,
	Lead,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { ButtonStyled } from '@/components/GeneralCard.sc';
import { useAppDispatch } from '@/features/hooks';
import { setShowFooter } from '@/features/general/general.slice';
import { Shadow } from '@/components/styled-components/Shadow';
import givFontLogo from '/public/images/icons/giv_font_logo.svg';
import check_stars from '/public/images/icons/check_stars.svg';
import failed_stars from '/public/images/icons/failed_stars.svg';
import { mediaQueries } from '@/lib/constants/constants';
import LoadingAnimation from '@/animations/loading_giv.json';
import { SEND_EMAIL_VERIFICATION_TOKEN } from '@/apollo/gql/gqlVerification';
import { client } from '@/apollo/apolloClient';
import { slugToVerification } from '@/lib/routeCreators';
import { VerificationContainer } from './common.sc';

const LazyLottie = dynamic(() => import('react-lottie'));

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

export enum EEmailVerificationStatus {
	Pending = 'Pending',
	Verified = 'Verified',
	Rejected = 'Rejected',
}

interface IContentSelector {
	status: EEmailVerificationStatus;
}

const ContentSelector: FC<IContentSelector> = ({ status }) => {
	switch (status) {
		case EEmailVerificationStatus.Verified:
			return <Verified />;
		case EEmailVerificationStatus.Rejected:
			return <Rejected />;
		default:
			return (
				<FlexCenter>
					<LazyLottie
						options={loadingAnimationOptions}
						height={150}
						width={150}
					/>
				</FlexCenter>
			);
	}
};

export default function EmailVerificationIndex() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { token } = router.query;
	const [status, setStatus] = useState<EEmailVerificationStatus>(
		EEmailVerificationStatus.Pending,
	);

	const imageAddress = `/images/backgrounds/email-verification-bg-${
		status === EEmailVerificationStatus.Verified ? 'colored' : 'dark'
	}.svg`;

	useEffect(() => {
		dispatch(setShowFooter(false));
	}, []);

	useEffect(() => {
		if (token) {
			client
				.mutate({
					mutation: SEND_EMAIL_VERIFICATION_TOKEN,
					variables: {
						emailConfirmationToken: token,
					},
				})
				.then(() => setStatus(EEmailVerificationStatus.Verified))
				.catch(() => setStatus(EEmailVerificationStatus.Rejected));
		}
	}, [token]);

	return (
		<VerificationContainer>
			<InnerContainer status={status} imageAddress={imageAddress}>
				<ContentSelector status={status} />
				<div color={brandColors.giv[500]}></div>
			</InnerContainer>
		</VerificationContainer>
	);
}

function Verified() {
	const router = useRouter();
	const { slug } = router.query;

	return (
		<>
			<Image
				src={check_stars}
				width={80}
				height={80}
				alt='success icon'
			/>
			<H6 weight={700}>Well Done</H6>
			<Lead>
				Your email has been verified! <br />
				You can now close this page and continue verifying your project.
			</Lead>
			<Link href={slugToVerification(slug as string)} passHref>
				<StyledButton size='small' label='CONTINUE VERIFICATION' />
			</Link>
			<ImageContainer>
				<Link href='/' passHref>
					<a>
						<Image
							src={givFontLogo}
							width='150'
							height='50'
							alt='giveth logo'
						/>
					</a>
				</Link>
			</ImageContainer>
		</>
	);
}

function Rejected() {
	return (
		<>
			<Image
				src={failed_stars}
				width={80}
				height={80}
				alt='success icon'
			/>
			<RejectedHeader weight={700}>Oh crap!</RejectedHeader>
			<Lead>
				This link is expired or not exist anymore, you have to verify
				your email again.
			</Lead>
			<LeadContainer>
				<Lead>
					please go to the verify status form under personal info and
					request a new verification email!
				</Lead>
			</LeadContainer>

			<ImageContainer>
				<Link href='/' passHref>
					<a>
						<Image
							src={givFontLogo}
							width='150'
							height='50'
							alt='giveth logo'
						/>
					</a>
				</Link>
			</ImageContainer>
		</>
	);
}

const InnerContainer = styled(Flex)<{
	status: EEmailVerificationStatus;
	imageAddress: string;
}>`
	border-radius: 16px;
	padding: 100px 8px;
	padding-bottom: ${props =>
		props.status !== EEmailVerificationStatus.Pending && '375px'};
	text-align: center;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 24px;
	background-color: ${neutralColors.gray[100]};
	width: 85%;
	max-width: 1076px;
	height: 100%;
	position: relative;
	overflow: hidden;
	box-shadow: 0 3px 20px ${Shadow.Neutral[400]};
	::before {
		display: ${props =>
			props.status === EEmailVerificationStatus.Pending
				? 'none'
				: 'block'};
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		background-image: url(${props => props.imageAddress});
		background-position: bottom;
		height: 375px;
		width: 100%;
		background-repeat: no-repeat;
	}
	${mediaQueries.laptopS} {
		min-height: 765px;
	}
`;

const ImageContainer = styled.div`
	position: absolute;
	bottom: 30px;
	cursor: pointer;
`;

const StyledButton = styled(ButtonStyled)`
	width: auto;
	height: auto;
	padding: 16px 24px;
	margin-top: 0;
	/* font-size: 12px; */
`;

const LeadContainer = styled.div`
	color: ${neutralColors.gray[700]};
	max-width: 500px;
`;

const RejectedHeader = styled(H6)`
	color: ${semanticColors.punch[500]};
`;
