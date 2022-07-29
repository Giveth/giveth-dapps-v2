import Image from 'next/image';
import { neutralColors, Subline } from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import WalletIcon from '/public/images/wallet_donate_tab.svg';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import config from '@/configuration';
import { IWalletAddress } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';

interface IProjectWalletAddress {
	addresses?: IWalletAddress[];
}

const { SECONDARY_NETWORK, PRIMARY_NETWORK } = config;
const gnosisId = SECONDARY_NETWORK.id;
const mainnetId = PRIMARY_NETWORK.id;

const ProjectWalletAddress: FC<IProjectWalletAddress> = ({ addresses }) => {
	// we may need to change this in the future if we allow more networks config for addresses
	const [sharedAddress, setSharedAddress] = useState<string>();

	const checkAddresses = () => {
		const onlyAddresses = addresses?.map(item => {
			if (item.isRecipient) {
				return item.address;
			}
		});
		const addressesDuplicated = onlyAddresses?.some((item, index) => {
			return onlyAddresses.indexOf(item) !== index;
		});
		if (addressesDuplicated) {
			setSharedAddress(addresses![0].address);
		}
	};

	useEffect(() => {
		if (addresses) checkAddresses();
	}, [addresses]);

	return (
		<BottomSection>
			{sharedAddress ? (
				<WalletAddress address={sharedAddress} />
			) : (
				addresses?.map(address => {
					if (!address.isRecipient) return null;
					return (
						<WalletAddress
							key={address.address}
							address={address.address!}
							networkId={address.networkId}
						/>
					);
				})
			)}
		</BottomSection>
	);
};

const WalletAddress = (props: { address: string; networkId?: number }) => {
	const { address, networkId } = props;
	return (
		<AddressContainer>
			<Image src={WalletIcon} alt='wallet icon' />
			<Subline>{address}</Subline>
			{networkId === gnosisId ? (
				<IconGnosisChain size={16} />
			) : networkId === mainnetId ? (
				<IconEthereum size={16} />
			) : (
				<Flex gap='8px'>
					<IconEthereum size={16} />
					<IconGnosisChain size={16} />
				</Flex>
			)}
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
