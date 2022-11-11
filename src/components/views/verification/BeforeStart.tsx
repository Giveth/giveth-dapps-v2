import { useIntl } from 'react-intl';
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
	const { formatMessage } = useIntl();

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
				<H6 weight={700}>
					{formatMessage({ id: 'label.before_you_start' })}
				</H6>
				<Lead>
					<br />
					{formatMessage({
						id: 'page.verification.before_you_start.one',
					})}
					<br />
					<br />
					Once your project is verified, the Givers who donate to your
					project will be rewarded with GIV tokens which they can use
					to participate in the GIVeconomy.
					<br />
					<br />
					{formatMessage({
						id: 'page.verification.before_you_start.three',
					})}{' '}
					<ExternalLink
						href={links.VERIFICATION_DOCS}
						color={brandColors.pinky[500]}
						title={formatMessage({
							id: 'label.verification_process',
						})}
					/>{' '}
					{formatMessage({
						id: 'page.verification.before_you_start.four',
					})}
					<br />
					<br />
					{formatMessage({
						id: 'page.verification.before_you_start.five',
					})}
					<br />
					<br />
					{formatMessage({
						id: 'page.verification.before_you_start.six',
					})}
					<br />
					<br />
					If your project is a registered non-profit organization, you
					will need to upload verifiable proof to complete the form.
					<br />
					<br />
					Once your project becomes verified you will need to provide
					quarterly updates in order to maintain your verified status.
				</Lead>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button
						disabled
						label={`<     ${formatMessage({ id: 'label.prev' })}`}
					/>
					<Button
						onClick={() => saveStep()}
						label={`${formatMessage({ id: 'label.next' })}     >`}
					/>
				</BtnContainer>
			</div>
		</>
	);
};

export default BeforeStart;
