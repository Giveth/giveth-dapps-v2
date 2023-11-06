import styled from 'styled-components';
import { mediaQueries } from '@giveth/ui-design-system';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Flex } from '@/components/styled-components/Flex';
import config from '@/configuration';
import { TokenInfo } from './TokenInfo';
import type { Dispatch, FC, SetStateAction } from 'react';
import type { ISelectTokenWithBalance } from '../RecurringDonationCard';

export interface ISelectTokenModalProps extends IModal {
	setSelectedToken: Dispatch<
		SetStateAction<ISelectTokenWithBalance | undefined>
	>;
}

export const SelectTokenModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
	setSelectedToken,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Select a Token'
			headerTitlePosition='left'
		>
			<SelectTokenInnerModal
				setShowModal={setShowModal}
				setSelectedToken={setSelectedToken}
			/>
		</Modal>
	);
};

const SelectTokenInnerModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
	setSelectedToken,
}) => {
	const tokens = config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS;
	return (
		<Wrapper>
			{tokens.map(token => (
				<TokenInfo
					key={token.underlyingToken.symbol}
					token={token.underlyingToken}
					setShowModal={setShowModal}
					setSelectedToken={setSelectedToken}
				/>
			))}
			{tokens.map(token => (
				<TokenInfo
					key={token.symbol}
					token={token}
					setShowModal={setShowModal}
					setSelectedToken={setSelectedToken}
				/>
			))}
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	padding: 12px 24px;
	gap: 12px;
	${mediaQueries.tablet} {
		width: 548px;
	}
`;
