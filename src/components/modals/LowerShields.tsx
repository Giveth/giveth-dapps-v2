import Image from 'next/image';
import styled from 'styled-components';

import { Modal } from '@/components/modals/Modal';
import ShieldIcon from '/public/images/icons/shield.svg';
import { Lead, Button, brandColors } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';

const LowerShields = (props: { setShowModal: (i: boolean) => void }) => {
	const { setShowModal } = props;

	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={<Image src={ShieldIcon} width={24} height={24} />}
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
				<Button label='OK' onClick={() => setShowModal(false)} />
			</Container>
		</Modal>
	);
};

const ExternalLinkStyled = styled.span`
	color: ${brandColors.pinky[500]};
	font-size: 13px;
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
