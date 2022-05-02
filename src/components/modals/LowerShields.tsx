import Image from 'next/image';
import styled from 'styled-components';
import { Lead, Button, OulineButton } from '@giveth/ui-design-system';

import { Modal } from '@/components/modals/Modal';
import ShieldBlackIcon from '/public/images/icons/shield_black.svg';
import ShieldWhiteIcon from '/public/images/icons/shield_white.svg';
import { ETheme, useGeneral } from '@/context/general.context';
import ShieldImage from '/public/images/brave-shield.png';

const LowerShields = (props: { onClose: () => void }) => {
	const { onClose } = props;
	const { theme } = useGeneral();
	const isDark = theme === ETheme.Dark;

	return (
		<Modal
			setShowModal={onClose}
			headerIcon={
				<Image
					src={isDark ? ShieldWhiteIcon : ShieldBlackIcon}
					width={24}
					height={24}
					alt='shield icon'
				/>
			}
			headerTitle='Sorry to interrupt...'
			headerTitlePosition='left'
		>
			<Container>
				<Lead>
					Please lower shields on your browser in order to use Giveth
					with your Torus Wallet.
				</Lead>
				<Image src={ShieldImage} alt='shield icon' />
				<Lead>
					Brave Shields will prevent Torus wallet from opening the
					window for you to complete your sign-in
				</Lead>
				{isDark ? (
					<OulineButton label='OK' onClick={onClose} />
				) : (
					<Button label='OK' onClick={onClose} />
				)}
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	text-align: left;
	max-width: 528px;
	padding: 48px 24px 24px;

	> :last-child {
		margin: 48px auto 0;
		width: 270px;
	}
`;

export default LowerShields;
