import { P, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@giveth/ui-design-system';
import { useAccount } from 'wagmi';
import { mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch } from '@/features/hooks';
import { setShowWalletModal } from '@/features/modal/modal.slice';
import { jointItems } from '@/helpers/text';
import SwitchNetwork from './SwitchNetwork';
import config from '@/configuration';

export interface IWrongNetworkInnerModal {
	cardName: string;
	targetNetworks: number[];
}

export const WrongNetworkInnerModal: FC<IWrongNetworkInnerModal> = ({
	cardName,
	targetNetworks,
}) => {
	const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);

	const { address } = useAccount();
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();

	const connectWallet = () => {
		dispatch(setShowWalletModal(true));
	};

	const chainNames = targetNetworks.map(
		network => config.NETWORKS_CONFIG[network].name,
	);

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
							onClick={connectWallet}
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
