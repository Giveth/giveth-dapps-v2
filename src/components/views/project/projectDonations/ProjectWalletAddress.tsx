import Image from 'next/image';
import { neutralColors, Subline } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import WalletIcon from '/public/images/wallet_donate_tab.svg';
import { IWalletAddress } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import NetworkLogo from '@/components/NetworkLogo';

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
	return (
		<AddressContainer>
			<Image src={WalletIcon} alt='wallet icon' />
			<Subline>{address?.toLowerCase()}</Subline>
			<Flex gap='8px'>
				{networkIds?.map(networkId => (
					<NetworkLogo
						logoSize={16}
						chainId={networkId}
						key={networkId}
					/>
				))}
			</Flex>
		</AddressContainer>
	);
};

const AddressContainer = styled(Flex)`
	gap: 10px;
`;

const BottomSection = styled(Flex)`
	background: ${neutralColors.gray[200]};
	padding: 8px 25px;
	color: ${neutralColors.gray[500]};
	flex-direction: column;
	gap: 10px;
`;

export default ProjectWalletAddress;
