import { FC } from 'react';
import styled from 'styled-components';
import { Caption } from '@giveth/ui-design-system';
import { IWalletAddress } from '@/apollo/types/types';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { Badge, EBadgeStatus } from '@/components/Badge';
import NetworkLogo from '@/components/NetworkLogo';
import { networksParams } from '@/helpers/blockchain';

interface INetworkWalletAddress {
	networkWallet: IWalletAddress;
}
export const NetworkWalletAddress: FC<INetworkWalletAddress> = ({
	networkWallet,
}) => {
	return (
		<Wrapper flexDirection='column' alignItems='baseline'>
			<Badge label='wow' status={EBadgeStatus.SUCCESS} />
			<FlexCenter gap='8px'>
				<NetworkLogo chainId={networkWallet.networkId} logoSize={24} />
				{networkWallet.networkId && (
					<Caption>
						{networksParams[networkWallet.networkId].chainName}
					</Caption>
				)}
			</FlexCenter>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	margin: 24px 0;
	gap: 10px;
`;
