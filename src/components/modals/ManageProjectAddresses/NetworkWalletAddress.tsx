import { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
import {
	Button,
	Caption,
	IconChevronRight16,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Chain } from 'viem';
import { IWalletAddress } from '@/apollo/types/types';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import NetworkLogo from '@/components/NetworkLogo';
import { getChainName } from '@/lib/network';
import { NonEVMChain } from '@/types/config';
import { findAddressByChain } from '@/lib/helpers';

interface INetworkWalletAddress {
	chain: Chain | NonEVMChain;
	setSelectedChain: Dispatch<SetStateAction<Chain | NonEVMChain | undefined>>;
	addresses: IWalletAddress[];
}
export const NetworkWalletAddress: FC<INetworkWalletAddress> = ({
	chain,
	setSelectedChain,
	addresses,
}) => {
	const { formatMessage } = useIntl();
	const chainType = 'chainType' in chain ? chain.chainType : undefined;
	const walletAddress = findAddressByChain(addresses, chain.id, chainType);
	return (
		<Wrapper $flexDirection='column'>
			{/* <StyledBadge label='wow' status={EBadgeStatus.SUCCESS} /> */}
			<Flex $justifyContent='space-between'>
				<FlexCenter gap='8px'>
					<NetworkLogo
						chainId={chain.id}
						chainType={chainType}
						logoSize={24}
					/>
					<Caption>{getChainName(chain.id, chainType)}</Caption>
				</FlexCenter>
				{!walletAddress?.address && (
					<Button
						size='small'
						label={formatMessage({ id: 'label.add_address' })}
						buttonType='texty-secondary'
						icon={
							<div>
								<IconChevronRight16 />
							</div>
						}
						onClick={() => setSelectedChain(chain)}
					/>
				)}
			</Flex>
			<Address>
				{walletAddress?.address ? walletAddress.address : '---'}
			</Address>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	margin: 24px 0;
	gap: 8px;
`;

const Address = styled(Subline)`
	background-color: ${neutralColors.gray[200]};
	color: ${neutralColors.gray[700]};
	border-radius: 16px;
	padding: 4px 8px;
`;
