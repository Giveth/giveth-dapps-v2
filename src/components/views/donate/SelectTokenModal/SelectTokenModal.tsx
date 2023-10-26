import { FC } from 'react';
import styled from 'styled-components';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Flex } from '@/components/styled-components/Flex';
import config from '@/configuration';
import { TokenInfo } from './TokenInfo';

interface ISelectTokenModalProps extends IModal {}

export const SelectTokenModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Select a Token'
			headerTitlePosition='left'
		>
			<SelectTokenInnerModal setShowModal={setShowModal} />
		</Modal>
	);
};

const SelectTokenInnerModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
}) => {
	const tokens = config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS;
	return (
		<Wrapper>
			{tokens.map(token => (
				<TokenInfo
					key={token.symbol}
					token={token}
					balance={1000000000000000n}
				/>
			))}
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 12px;
`;
