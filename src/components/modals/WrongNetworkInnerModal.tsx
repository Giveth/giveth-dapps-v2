import { P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import { switchNetwork } from '@/lib/wallet';

import { chainName, mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch } from '@/features/hooks';
import { setShowWalletModal } from '@/features/modal/modal.slice';

export interface IWrongNetworkInnerModal {
	text?: string;
	targetNetworks: number[];
}

export const WrongNetworkInnerModal: FC<IWrongNetworkInnerModal> = ({
	text,
	targetNetworks,
}) => {
	const { account } = useWeb3React();
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();

	const connectWallet = () => {
		dispatch(setShowWalletModal(true));
	};

	const checkWalletAndSwitchNetwork = async (network: number) => {
		await switchNetwork(network);
	};

	return (
		<WrongNetworkInnerModalContainer>
			{account ? (
				<>
					<Description>
						<P>{text}</P>
						<P>Please switch the network.</P>
					</Description>
					<ButtonsContainer>
						{targetNetworks.map(network => (
							<Button
								label={`${formatMessage({
									id: 'label.switch_to',
								})} ${chainName(network)}`}
								onClick={() =>
									checkWalletAndSwitchNetwork(network)
								}
								buttonType='primary'
								key={network}
							/>
						))}
					</ButtonsContainer>
				</>
			) : (
				<>
					<Description>
						<P>{text}</P>
					</Description>
					<ButtonsContainer>
						<Button
							label={formatMessage({
								id: 'component.button.connect_wallet',
							})}
							onClick={connectWallet}
							buttonType='primary'
						/>
					</ButtonsContainer>
				</>
			)}
		</WrongNetworkInnerModalContainer>
	);
};

const WrongNetworkInnerModalContainer = styled.div`
	padding: 6px 24px;
	width: 100%;
	${mediaQueries.tablet} {
		max-width: 450px;
	}
`;

const Description = styled.div`
	padding: 12px;
	margin-bottom: 12px;
	text-align: center;
	color: ${brandColors.deep[100]};
`;

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;
