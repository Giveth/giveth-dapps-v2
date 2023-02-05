import { FC } from 'react';
import styled from 'styled-components';
import { mediaQueries, P } from '@giveth/ui-design-system';
import BigNumber from 'bignumber.js';
import { useIntl } from 'react-intl';
import { IModal } from '@/types/common';
import { Modal } from './Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IMintInsufficientModalProps extends IModal {
	qty: number;
	nftPrice?: BigNumber;
}

export const MintInsufficientModal: FC<IMintInsufficientModalProps> = ({
	setShowModal,
}) => {
	const { formatMessage } = useIntl();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.label.insufficient_funds',
			})}
			headerTitlePosition='left'
		>
			<MintInsufficientModalContainer>
				{formatMessage({
					id: 'label.label.add_fund_desc',
				})}
			</MintInsufficientModalContainer>
		</Modal>
	);
};

const MintInsufficientModalContainer = styled(P)`
	padding: 16px 24px;
	margin-bottom: 22px;
	width: 100%;
	${mediaQueries.tablet} {
		width: 370px;
	}
`;
