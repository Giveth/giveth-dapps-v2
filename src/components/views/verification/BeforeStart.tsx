import { useIntl } from 'react-intl';
import { Button, H6, Lead, brandColors } from '@giveth/ui-design-system';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ContentSeparator, BtnContainer } from './Common.sc';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import { CREATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import Routes from '@/lib/constants/Routes';

const BeforeStart = () => {
	const { verificationData, setVerificationData, setStep } =
		useVerificationData();
	const router = useRouter();
	const { slug } = router.query;
	const { formatMessage } = useIntl();
	const projectSlug =
		Routes.Project + '/' + verificationData?.project?.id + '/edit';
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
					{formatMessage({
						id: 'page.verification.update_your_project_social',
					})}{' '}
					<EditProjectLink
						href={projectSlug}
						target='_blank'
						rel='noopener noreferrer'
					>
						{formatMessage({
							id: 'page.verification.click_to_edit',
						})}{' '}
					</EditProjectLink>
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
					{formatMessage({
						id: 'page.verification.before_you_start.seven',
					})}
					<br />
					<br />
					{formatMessage({
						id: 'page.verification.before_you_start.eight',
					})}
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

const EditProjectLink = styled.a`
	color: ${brandColors.pinky[500]};
`;

export default BeforeStart;
