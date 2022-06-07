import { brandColors, Button, H6 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ChangeEvent, useState } from 'react';
import { Flex } from '@/components/styled-components/Flex';
import { ButtonStyled } from './common.styled';
import Input from '@/components/Input';
import { ContentSeparator, BtnContainer } from './VerificationIndex';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import { UPDATE_PROJECT_VERIFICATION_FORM } from '@/apollo/gql/gqlVerification';
const PersonalInfo = () => {
	const { verificationData, setStep } = useVerificationData();
	console.log('verificationData', verificationData);
	const [email, setEmail] = useState(verificationData?.user.email || '');
	const sendEmail = async () => {
		await client.mutate({
			mutation: UPDATE_PROJECT_VERIFICATION_FORM,
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
						onClick={sendEmail}
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
