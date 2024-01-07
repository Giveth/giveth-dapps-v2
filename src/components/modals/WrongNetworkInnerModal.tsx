import { P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@giveth/ui-design-system';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { mediaQueries } from '@/lib/constants/constants';
import { jointItems } from '@/helpers/text';
import SwitchNetwork from './SwitchNetwork';
import { getChainName } from '@/lib/network';
import { INetworkIdWithChain } from '../views/donate/common.types';

export interface IWrongNetworkInnerModal {
	cardName: string;
	targetNetworks: INetworkIdWithChain[];
}

export const WrongNetworkInnerModal: FC<IWrongNetworkInnerModal> = ({
	cardName,
	targetNetworks,
}) => {
	const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);

	const { address } = useAccount();
	const { formatMessage } = useIntl();
	const { open: openConnectModal } = useWeb3Modal();

	const chainNames = targetNetworks.map(network =>
		getChainName(network.networkId),
	);
	console.log('targetNetworks', targetNetworks);
	const chainsStr = jointItems(chainNames);

	return (
		<WrongNetworkInnerModalContainer>
			{address ? (
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
							onClick={() => setShowSwitchNetwork(true)}
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
