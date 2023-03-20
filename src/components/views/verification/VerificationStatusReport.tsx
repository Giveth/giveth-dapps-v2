import { ButtonLink, H6, Lead } from '@giveth/ui-design-system';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
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
	const status = verificationData?.status || EVerificationStatus.DRAFT;

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
	const { formatMessage } = useIntl();

	return (
		<>
			<H6 weight={700}>{formatMessage({ id: 'label.submitted' })}</H6>
			<Lead>
				{formatMessage({ id: 'label.your_project_is_now_submitted' })}
			</Lead>
			<Link href={slugToProjectView(slug as string)}>
				<ButtonLink
					size='small'
					label={formatMessage({ id: 'label.go_to_projets_page' })}
				/>
			</Link>
			<VCImageContainer>
				<Link href='/'>
					<Image
						src={givFontLogo}
						width='150'
						height='50'
						alt='giveth logo'
					/>
				</Link>
			</VCImageContainer>
		</>
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
				{formatMessage({ id: 'label.congratulations' })}
				<br />
				{formatMessage({
					id: 'label.your_project_is_now_verified_so_the_donors_may_have_givbacks',
				})}
			</Lead>
			<Link href={slugToProjectView(slug as string)}>
				<ButtonLink
					size='small'
					label={formatMessage({ id: 'label.go_to_projets_page' })}
				/>
			</Link>
			<VCImageContainer>
				<Link href='/'>
					<Image
						src={givFontLogo}
						width='150'
						height='50'
						alt='giveth logo'
					/>
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
				isExternal
				size='small'
				label='Support Team - Discord'
				target='_blank'
				href={links.DISCORD_SUPPORT}
			/>

			<VCImageContainer>
				<Link href='/'>
					<Image
						src={givFontLogo}
						width='150'
						height='50'
						alt='giveth logo'
					/>
				</Link>
			</VCImageContainer>
		</>
	);
}
