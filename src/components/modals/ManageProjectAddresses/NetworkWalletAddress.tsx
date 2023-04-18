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
import { IWalletAddress } from '@/apollo/types/types';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import NetworkLogo from '@/components/NetworkLogo';
import { networksParams } from '@/helpers/blockchain';

interface INetworkWalletAddress {
	networkWallet: IWalletAddress;
	setSelectedWallet: Dispatch<SetStateAction<IWalletAddress | undefined>>;
}
export const NetworkWalletAddress: FC<INetworkWalletAddress> = ({
	networkWallet,
	setSelectedWallet,
}) => {
	const { formatMessage } = useIntl();

	return (
		<Wrapper flexDirection='column'>
			{/* <StyledBadge label='wow' status={EBadgeStatus.SUCCESS} /> */}
			<Flex justifyContent='space-between'>
				<FlexCenter gap='8px'>
					<NetworkLogo
						chainId={networkWallet.networkId}
						logoSize={24}
					/>
					{networkWallet.networkId && (
						<Caption>
							{networksParams[networkWallet.networkId].chainName}
						</Caption>
					)}
				</FlexCenter>
				{!networkWallet.address && (
					<Button
						size='small'
						label={formatMessage({ id: 'label.add_address' })}
						buttonType='texty-secondary'
						icon={
							<div>
								<IconChevronRight16 />
							</div>
						}
						onClick={() => setSelectedWallet(networkWallet)}
					/>
				)}
			</Flex>
			<Address>
				{networkWallet.address ? networkWallet.address : '---'}
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
