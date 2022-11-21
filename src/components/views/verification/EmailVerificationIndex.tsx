import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { brandColors, H6, Lead, ButtonLink } from '@giveth/ui-design-system';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { FlexCenter } from '@/components/styled-components/Flex';
import givFontLogo from '/public/images/icons/giv_font_logo.svg';
import check_stars from '/public/images/icons/check_stars.svg';
import failed_stars from '/public/images/icons/failed_stars.svg';
import LoadingAnimation from '@/animations/loading_giv.json';
import { SEND_EMAIL_VERIFICATION_TOKEN } from '@/apollo/gql/gqlVerification';
import { client } from '@/apollo/apolloClient';
import { slugToVerification } from '@/lib/routeCreators';
import {
	VCImageContainer,
	VCLeadContainer,
	VCRejectedHeader,
	VerificationCard,
	VerificationContainer,
} from './Common.sc';

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
	const router = useRouter();
	const { token } = router.query;
	const [status, setStatus] = useState<EEmailVerificationStatus>(
		EEmailVerificationStatus.Pending,
	);

	const imageAddress = `/images/backgrounds/email-verification-bg-${
		status === EEmailVerificationStatus.Verified ? 'colored' : 'dark'
	}.svg`;

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
			<VerificationCard background={imageAddress}>
				<ContentSelector status={status} />
				<div color={brandColors.giv[500]}></div>
			</VerificationCard>
		</VerificationContainer>
	);
}

function Verified() {
	const router = useRouter();
	const { slug } = router.query;
	const { formatMessage } = useIntl();

	return (
		<>
			<Image
				src={check_stars}
				width={80}
				height={80}
				alt='success icon'
			/>
			<H6 weight={700}>{formatMessage({ id: 'label.well_done' })}</H6>
			<Lead>
				{formatMessage({ id: 'label.your_email_has_been_verified' })}
				! <br />
				{formatMessage({
					id: 'label.you_can_now_close_this_page_and_continue_verifying',
				})}
			</Lead>
			<Link href={slugToVerification(slug as string)} passHref>
				<ButtonLink
					size='small'
					label={
						formatMessage({
							id: 'label.continue_verification',
						})!
					}
				/>
			</Link>
			<VCImageContainer>
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
			</VCImageContainer>
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
			<VCRejectedHeader weight={700}>Oh crap!</VCRejectedHeader>
			<Lead>
				This link is expired or not exist anymore, you have to verify
				your email again.
			</Lead>
			<VCLeadContainer>
				<Lead>
					please go to the verify status form under personal info and
					request a new verification email!
				</Lead>
			</VCLeadContainer>

			<VCImageContainer>
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
			</VCImageContainer>
		</>
	);
}
