import { FC } from 'react';
import styled from 'styled-components';
import { Button, H5, IconFund, Lead } from '@giveth/ui-design-system';
import { Modal } from '@/components/modals/Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export const InsufficientFundModal: FC<IModal> = ({ setShowModal }) => {
	const theme = useAppSelector(state => state.general.theme);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
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
					onClick={closeModal}
					buttonType={theme === ETheme.Dark ? 'primary' : 'secondary'}
				/>
			</InsufficientFundContainer>
		</Modal>
	);
};

const InsufficientFundContainer = styled.div`
	height: 300px;
	width: 100%;
	padding: 24px;
	${mediaQueries.tablet} {
		width: 528px;
	}
`;

const OkButton = styled(Button)`
	width: 300px;
	height: 48px;
	margin: 48px auto 0;
`;

const InsufficientFundTitle = styled(H5)`
	margin-top: 16px;
	font-weight: 700;
`;

const InsufficientFundDescription = styled(Lead)`
	margin-top: 24px;
`;
