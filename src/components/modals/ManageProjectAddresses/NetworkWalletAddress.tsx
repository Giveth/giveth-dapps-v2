import { FC } from 'react';
import styled from 'styled-components';
import { IWalletAddress } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import { Badge, EBadgeStatus } from '@/components/Badge';

interface INetworkWalletAddress {
	networkWallet: IWalletAddress;
}
export const NetworkWalletAddress: FC<INetworkWalletAddress> = () => {
	return (
		<Wrapper flexDirection='column'>
			<Badge label='wow' status={EBadgeStatus.SUCCESS} />
		</Wrapper>
	);
};

const Wrapper = styled(Flex)``;
