import Image from 'next/image';
import styled from 'styled-components';

import { Modal } from '@/components/modals/Modal';
import ShieldBlackIcon from '/public/images/icons/shield_black.svg';
import ShieldWhiteIcon from '/public/images/icons/shield_white.svg';
import {
	Lead,
	Button,
	brandColors,
	OulineButton,
} from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
import { ETheme, useGeneral } from '@/context/general.context';

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
				<br />
				<Lead>
					Why this happened?{' '}
					<ExternalLinkStyled>
						<ExternalLink
							href='https://github.com/Giveth/giveth-planning/issues/451'
							title='Learn more here'
						/>
					</ExternalLinkStyled>
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

const ExternalLinkStyled = styled.span`
	color: ${brandColors.pinky[500]};
	font-size: 16px;
`;

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
