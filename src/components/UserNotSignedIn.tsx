import styled from 'styled-components';
import {
	brandColors,
	Button,
	Container,
	H4,
	IconAlertTriangleOutline,
} from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';
import { useAppDispatch } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';

const UserNotSignedIn = () => {
	const dispatch = useAppDispatch();

	const handleSignIn = () => {
		dispatch(setShowSignWithWallet(true));
	};

	return (
		<ContainerStyled>
			<IconContainer>
				<IconAlertTriangleOutline
					color={brandColors.deep[900]}
					size={70}
				/>
			</IconContainer>
			<H4Styled>You need to sign in first!</H4Styled>
			<ButtonStyled
				onClick={handleSignIn}
				size='medium'
				label='Sign in'
				buttonType='primary'
			/>
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
	width: 128px;
	height: 128px;
	border-radius: 50%;
	background: white;
	box-shadow: ${Shadow.Giv[400]};
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

export default UserNotSignedIn;
