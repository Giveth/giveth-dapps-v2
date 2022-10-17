import {
	brandColors,
	Button,
	Container,
	H4,
	IconProfile,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';

const AlreadyRegistered = () => {
	return (
		<ContainerStyled>
			<IconContainer>
				<IconProfile color={brandColors.giv[300]} size={90} />
			</IconContainer>
			<H4Styled>
				You&apos;ve already completed your profile!
				<div>You can use the dashboard to edit.</div>
			</H4Styled>
			<InternalLink href={Routes.MyAccount}>
				<ButtonStyled
					size='medium'
					label='Go to dashboard'
					buttonType='primary'
				/>
			</InternalLink>
			<InternalLink href={Routes.Home}>
				<ButtonTexty
					buttonType='texty'
					label='or Go back to Homepage'
				/>
			</InternalLink>
		</ContainerStyled>
	);
};

const ButtonTexty = styled(Button)`
	:hover {
		background: transparent;
		color: ${brandColors.deep[200]};
	}
`;

const ButtonStyled = styled(Button)`
	width: 200px;
	margin-bottom: 24px;
`;

const H4Styled = styled(H4)`
	color: ${brandColors.deep[800]};
	margin: 32px 0;
`;

const IconContainer = styled(FlexCenter)`
	width: 110px;
	height: 110px;
	border-radius: 50%;
	background: white;
	box-shadow: ${Shadow.Giv[400]};
	position: relative;
`;

const ContainerStyled = styled(Container)`
	margin-bottom: 230px;
	margin-top: 250px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
`;

export default AlreadyRegistered;
