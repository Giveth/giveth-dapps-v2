import { neutralColors, P, Subline } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { utils } from 'ethers';
import { IWalletAddress } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import NetworkLogo from '@/components/NetworkLogo';
import { Shadow } from '@/components/styled-components/Shadow';

interface IProjectWalletAddress {
	addresses: IWalletAddress[];
}

const ProjectWalletAddress: FC<IProjectWalletAddress> = ({ addresses }) => {
	const recipientAddresses = addresses
		.filter(a => a.isRecipient)
		.map(a => a.address?.toLowerCase());
	const uniqueAddresses = new Set(recipientAddresses);
	const groupedAddresses: Array<IWalletAddress[]> = [];
	uniqueAddresses.forEach(address => {
		const filteredItems = addresses.filter(
			a => a.isRecipient && a.address?.toLowerCase() === address,
		);
		groupedAddresses.push(filteredItems);
	});

	return (
		<BottomSection>
			{groupedAddresses?.map(group => (
				<WalletAddress
					key={group[0].address!}
					address={group[0].address!}
					networkIds={group.map(g => g.networkId)}
				/>
			))}
		</BottomSection>
	);
};

const WalletAddress = (props: {
	address: string;
	networkIds?: Array<number | undefined>;
}) => {
	const { address, networkIds } = props;
	const { formatMessage } = useIntl();
	const checksumAddress = utils.getAddress(address);

	return (
		<AddressContainer>
			<P>
				{formatMessage({
					id: 'label.associated_wallet_address',
				})}
			</P>
			<Wallet>{checksumAddress}</Wallet>
			<Line />
			<Flex gap='16px' alignItems='center'>
				<P>
					{formatMessage({
						id: 'label.accept_donations_on',
					})}
				</P>
				<Logos>
					{networkIds?.map(networkId => (
						<NetworkLogo
							logoSize={24}
							chainId={networkId}
							key={networkId}
						/>
					))}
				</Logos>
			</Flex>
		</AddressContainer>
	);
};

const Logos = styled(Flex)`
	gap: 8px;
	> * {
		box-shadow: ${Shadow.Neutral[500]};
		border-radius: 50%;
	}
`;

const Line = styled.div`
	margin: 40px 0 16px;
	border: 1px solid ${neutralColors.gray[300]};
`;

const Wallet = styled(Subline)`
	background: ${neutralColors.gray[200]};
	border-radius: 16px;
	padding: 4px 8px;
	margin-top: 8px;
	width: fit-content;
`;

const AddressContainer = styled.div`
	margin-top: 40px;
`;

const BottomSection = styled(Flex)`
	color: ${neutralColors.gray[700]};
	flex-direction: column;
	gap: 10px;
`;

export default ProjectWalletAddress;
