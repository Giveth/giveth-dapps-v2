import { H6, IconTwitter, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FlexCenter } from '@/components/styled-components/Flex';
import { ButtonStyled } from './common.styled';

const SocialProfile = () => {
	return (
		<>
			<H6 weight={700}>Personal Social Media</H6>
			<br />
			<Description>
				<Attention>i</Attention>
				Please connect to your personal social media profiles. At least
				one is required.
			</Description>
			<ButtonsSection>
				<ButtonStyled
					icon={<IconTwitter />}
					color='#00ACEE'
					label='@LAURENLUZ'
				/>
			</ButtonsSection>
		</>
	);
};

const ButtonsSection = styled.div``;

const Attention = styled(FlexCenter)`
	width: 16px;
	font-size: 14px;
	height: 16px;
	border-radius: 50%;
	border: 1px solid ${neutralColors.gray[600]};
`;

const Description = styled(P)`
	display: flex;
	align-items: center;
	gap: 10px;
	color: ${neutralColors.gray[700]};
`;

export default SocialProfile;
