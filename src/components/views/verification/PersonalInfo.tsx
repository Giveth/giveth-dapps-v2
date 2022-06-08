import { brandColors, Button, H6 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ChangeEvent, useState } from 'react';
import { Flex } from '@/components/styled-components/Flex';
import { ButtonStyled } from './common.styled';
import Input from '@/components/Input';
import { ContentSeparator, BtnContainer } from './VerificationIndex';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import {
	SEND_EMAIL_VERIFICATION,
	UPDATE_PROJECT_VERIFICATION,
} from '@/apollo/gql/gqlVerification';
const PersonalInfo = () => {
	const { verificationData, setStep } = useVerificationData();
	console.log('verificationData', verificationData);
	const [email, setEmail] = useState(verificationData?.user.email || '');
	const sendPersonalInfo = async () => {
		return await client.mutate({
			mutation: UPDATE_PROJECT_VERIFICATION,
			variables: {
				projectVerificationUpdateInput: {
					step: 'personalInfo',
					personalInfo: {
						email,
						walletAddress: verificationData?.user.walletAddress,
						fullName:
							verificationData?.user.firstName +
							' ' +
							verificationData?.user.lastName,
					},
					projectVerificationId: Number(verificationData?.id),
				},
			},
		});
	};
	const sendEmail = async () => {
		return await client.mutate({
			mutation: SEND_EMAIL_VERIFICATION,
			variables: {
				projectVerificationFormId: Number(verificationData?.id),
			},
		});
	};

	const handleFormSubmit = async () => {
		try {
			const personalInfoRes = await sendPersonalInfo();
			console.log('personalInfoRes', personalInfoRes);
			const emailRes = await sendEmail();
			console.log('emailRes', emailRes);
		} catch (error) {
			console.log('SubmitError', error);
		}
	};

	return (
		<>
			<div>
				<H6 weight={700}>Personal info</H6>
				<br />
				<Input
					label='What is your full name?'
					value={`${verificationData?.user.firstName} ${verificationData?.user.lastName}`}
					disabled
					name='name'
				/>
				<Input
					label='Your wallet address'
					value={verificationData?.user.walletAddress || ''}
					disabled
					name='walletAddress'
				/>
				<EmailSection>
					<Input
						label='What is your email address?'
						value={email}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setEmail(e.target.value);
						}}
						name='email'
					/>
					<ButtonStyled
						color={brandColors.giv[500]}
						label='VERIFY EMAIL ADDRESS'
						size='small'
						onClick={handleFormSubmit}
					/>
				</EmailSection>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button onClick={() => setStep(0)} label='<     PREVIOUS' />
					<Button onClick={() => setStep(2)} label='NEXT     >' />
				</BtnContainer>
			</div>
		</>
	);
};

const EmailSection = styled(Flex)`
	gap: 24px;
	align-items: center;
	> :first-child {
		width: 100%;
	}
`;

export default PersonalInfo;
