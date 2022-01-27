import { IModal, Modal } from '@/components/modals/Modal';
import { FC } from 'react';
import styled from 'styled-components';
import { IconFund } from '@giveth/ui-design-system/lib/cjs/components/icons/Fund';
import { brandColors, Button, H5, Lead } from '@giveth/ui-design-system';
import { ETheme, useGeneral } from '@/context/general.context';

export const InsufficientFundModal: FC<IModal> = ({
	showModal,
	setShowModal,
}) => {
	const { theme } = useGeneral();
	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			hiddenClose={false}
			headerIcon={<IconFund />}
			headerTitle='Insufficient Fund'
			headerTitlePosition='left'
		>
			<InsufficientFundContainer>
				<InsufficientFundTitle>
					You don’t have enough funds!
				</InsufficientFundTitle>
				<InsufficientFundDescription>
					Please add funds to your wallet or switch to a different
					wallet.
				</InsufficientFundDescription>

				<OkButton
					label='OK'
					onClick={() => setShowModal(false)}
					buttonType={theme === ETheme.Dark ? 'primary' : 'secondary'}
				/>
			</InsufficientFundContainer>
		</Modal>
	);
};

const InsufficientFundContainer = styled.div`
	height: 300px;
	width: 528px;
	padding: 24px;
`;

const OkButton = styled(Button)`
	width: 300px;
	height: 48px;
	margin: 48px auto 0;
`;

const InsufficientFundTitle = styled(H5)`
	margin-top: 34px;
	font-weight: 700;
`;

const InsufficientFundDescription = styled(Lead)`
	margin-top: 24px;
`;
