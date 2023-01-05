import styled from 'styled-components';
import {
	brandColors,
	Button,
	Container,
	H4,
	IconWalletOutline,
	IconXCircle,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import InternalLink from '@/components/InternalLink';
import Routes from '@/lib/constants/Routes';
import { useAppDispatch } from '@/features/hooks';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';

const WalletNotConnected = () => {
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();

	const handleConnectWallet = () => {
		dispatch(setShowWelcomeModal(true));
	};

	return (
		<ContainerStyled>
			<IconContainer>
				<IconWalletOutline color={brandColors.giv[300]} size={80} />
				<IconXContainer>
					<IconXCircle color={brandColors.pinky[500]} size={30} />
				</IconXContainer>
			</IconContainer>
			<H4Styled>
				{formatMessage({
					id: 'label.you_need_to_connect_your_wallet_to_continue',
				})}
			</H4Styled>
			<ButtonStyled
				onClick={handleConnectWallet}
				size='medium'
				label={formatMessage({ id: 'component.button.connect_wallet' })}
				buttonType='primary'
			/>
			<InternalLink href={Routes.Home}>
				<ButtonTexty
					buttonType='texty'
					label={formatMessage({ id: 'label.or_go_back_to_home' })}
				/>
			</InternalLink>
		</ContainerStyled>
	);
};

const IconXContainer = styled(FlexCenter)`
	background: white;
	border-radius: 50%;
	width: 36px;
	height: 36px;
	box-shadow: ${Shadow.Giv[400]};
	position: absolute;
	right: 0;
	bottom: 0;
`;

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

export default WalletNotConnected;
