import { brandColors, Button, H6 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { ButtonStyled } from './common.styled';
import Input from '@/components/Input';
import { ContentSeparator, BtnContainer } from './VerificationIndex';
import { useVerificationData } from '@/context/verification.context';

const PersonalInfo = () => {
	const { setStep } = useVerificationData();
	return (
		<>
			<div>
				<H6 weight={700}>Personal info</H6>
				<br />
				<Input
					label='What is your full name?'
					value={'Lauren Luz'}
					disabled
					name='name'
				/>
				<Input
					label='Your wallet address'
					value={'0x6d97d65adff6771b31671443a6b9512104312d3d'}
					disabled
					name='walletAddress'
				/>
				<EmailSection>
					<Input
						label='What is your email address?'
						value={'lauren@giveth.io'}
						name='email'
					/>
					<ButtonStyled
						color={brandColors.giv[500]}
						label='VERIFY EMAIL ADDRESS'
						size='small'
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
