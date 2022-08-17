import { brandColors, Button, H6, Lead } from '@giveth/ui-design-system';
import { useRouter } from 'next/router';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { ContentSeparator, BtnContainer } from './Common.sc';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import { CREATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';

const BeforeStart = () => {
	const { verificationData, setVerificationData, setStep } =
		useVerificationData();
	const router = useRouter();
	const { slug } = router.query;

	const saveStep = () => {
		async function sendReq() {
			const { data } = await client.mutate({
				mutation: CREATE_PROJECT_VERIFICATION,
				variables: { slug },
			});
			setVerificationData(data.createProjectVerificationForm);
			setStep(1);
		}

		if (verificationData?.id) {
			setStep(1);
		} else {
			sendReq().then();
		}
	};

	return (
		<>
			<div>
				<H6 weight={700}>Before you start</H6>
				<Lead>
					<br />
					Giveth would like to offer you the opportunity to reward
					your contributors with GIVbacks! By applying for a verified
					project status, you will be able to make your project stand
					out and encourage donations.
					<br />
					<br />
					Once your project is verified, the Givers who donate to your
					project will be rewarded with GIV tokens which they can use
					to participate in the GIVeconomy.
					<br />
					<br />
					The simple{' '}
					<ExternalLink
						href={links.VERIFICATION_DOCS}
						color={brandColors.pinky[500]}
						title='verification process'
					/>{' '}
					requires some additional information about your project and
					the intended impact of your organization. If you would like
					to apply to receive the &apos;Verified&apos; badge, empower
					more Givers and also give back to those who have helped you
					reach your goals, please fill out this form.
					<br />
					<br />
					You will need to provide a link to a social media post made
					by your organization where you have shared a link to your
					Giveth project to prove that you are in fact part of the
					organization you claim to be.
					<br />
					<br />
					You will be required to provide a list of all wallet
					addresses used for managing funds within your project.
					<br />
					<br />
					If your project is a registered non-profit organization, you
					will need to upload verifiable proof to complete the form.
				</Lead>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button disabled label='<     PREVIOUS' />
					<Button onClick={() => saveStep()} label='NEXT     >' />
				</BtnContainer>
			</div>
		</>
	);
};

export default BeforeStart;
