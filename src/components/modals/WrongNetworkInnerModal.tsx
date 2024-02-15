import { P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@giveth/ui-design-system';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { mediaQueries } from '@/lib/constants/constants';
import { jointItems } from '@/helpers/text';
import SwitchNetwork from './SwitchNetwork';
import { getChainName } from '@/lib/network';
import { INetworkIdWithChain } from '../views/donate/common.types';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';

export interface IEVMWrongNetworkSwitchModal {
	cardName: string;
	targetNetworks: INetworkIdWithChain[];
}

export const EVMWrongNetworkSwitchModal: FC<IEVMWrongNetworkSwitchModal> = ({
	cardName,
	targetNetworks,
}) => {
	const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);
	const { walletAddress } = useGeneralWallet();
	const { formatMessage } = useIntl();

	const { walletChainType, handleSignOutAndShowWelcomModal } =
		useGeneralWallet();

	const { open: openConnectModal } = useWeb3Modal();

	const chainNames = targetNetworks.map(network =>
		getChainName(network.networkId),
	);
	const chainsStr = jointItems(chainNames);

	const handleConnectWallet = async () => {
		if (walletChainType === ChainType.SOLANA) {
			handleSignOutAndShowWelcomModal();
		} else {
			setShowSwitchNetwork(true);
		}
	};

	return (
		<EVMWrongNetworkSwitchModalContainer>
			{walletAddress ? (
				<>
					<Description>
						<P>
							{formatMessage(
								{
									id: 'component.reward_card.wrong_network',
								},
								{
									name: cardName,
									chains: chainsStr,
								},
							)}
						</P>
					</Description>
					<ButtonsContainer>
						<Button
							label={formatMessage({
								id: 'label.switch_network',
							})}
							buttonType='primary'
							onClick={handleConnectWallet}
						/>
					</ButtonsContainer>
				</>
			) : (
				<>
					<Description>
						<P>
							{formatMessage(
								{
									id: 'label.please_connect_your_wallet',
								},
								{
									name: cardName,
									chains: chainsStr,
								},
							)}
						</P>
					</Description>
					<ButtonsContainer>
						<Button
							label={formatMessage({
								id: 'component.button.connect_wallet',
							})}
							onClick={() => openConnectModal?.()}
							buttonType='primary'
						/>
					</ButtonsContainer>
				</>
			)}
			{showSwitchNetwork && (
				<SwitchNetwork
					setShowModal={setShowSwitchNetwork}
					customNetworks={targetNetworks}
				/>
			)}
		</EVMWrongNetworkSwitchModalContainer>
	);
};

const EVMWrongNetworkSwitchModalContainer = styled.div`
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
