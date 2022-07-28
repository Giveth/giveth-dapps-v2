import { ButtonLink, H6, Lead } from '@giveth/ui-design-system';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useVerificationData } from '@/context/verification.context';
import LoadingVerification from './Loading';
import { EVerificationStatus } from '@/apollo/types/types';
import {
	VCImageContainer,
	VCRejectedHeader,
	VerificationCard,
} from './Common.sc';
import givFontLogo from '/public/images/icons/giv_font_logo.svg';
import check_stars from '/public/images/icons/check_stars.svg';
import failed_stars from '/public/images/icons/failed_stars.svg';
import { slugToProjectView } from '@/lib/routeCreators';
import links from '@/lib/constants/links';

export const VerificationStatusReport = () => {
	const { verificationData } = useVerificationData();
	const { status } = verificationData || {};

	const background = status
		? '/images/backgrounds/email-verification-bg-colored.svg'
		: '';

	return (
		<VerificationCard background={background}>
			{!status && <LoadingVerification />}
			{status === EVerificationStatus.SUBMITTED && <Submitted />}
			{status === EVerificationStatus.VERIFIED && <Verified />}
			{status === EVerificationStatus.REJECTED && <Rejected />}
		</VerificationCard>
	);
};

function Submitted() {
	const router = useRouter();
	const { slug } = router.query;

	return (
		<>
			<H6 weight={700}>Submitted</H6>
			<Lead>
				Your project is now submitted, our team will check your request.
			</Lead>
			<Link href={slugToProjectView(slug as string)} passHref>
				<ButtonLink size='small' label='GO TO THE PROJECT' />
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
				Congratulations!
				<br />
				Your project is now verified, so the donors may have GIVbacks
				for their donations to your projects.
			</Lead>
			<Link href={slugToProjectView(slug as string)} passHref>
				<ButtonLink size='small' label='GO TO THE PROJECT' />
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
			<VCRejectedHeader weight={700}>Rejected!</VCRejectedHeader>
			<Lead>
				Unfortunately, your request for verification does not meet the
				minimum requirements and was rejected by the verification team.
				If you have any objections please contact the support team.
			</Lead>
			<ButtonLink
				size='small'
				label='Support Team - Discord'
				target='_blank'
				href={links.DISCORD_SUPPORT}
			/>

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
