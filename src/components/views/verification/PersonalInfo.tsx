import { brandColors, H6 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { ButtonStyled } from './common.styled';
import Input from '@/components/Input';

const PersonalInfo = () => {
	return (
		<>
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
