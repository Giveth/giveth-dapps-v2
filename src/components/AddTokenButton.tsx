import { Web3Provider } from '@ethersproject/providers';
import { brandColors, P } from '@giveth/ui-design-system';
import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { EWallets } from '@/lib/wallet/walletTypes';
import { addToken } from '@/lib/metamask';
import { Flex } from './styled-components/Flex';
import StorageLabel from '@/lib/localStorage';

interface IAddGIVTokenButton {
	provider: Web3Provider | null;
	showText?: boolean;
	tokenSymbol?: string;
	tokenAddress?: string;
}

export const AddTokenButton: FC<IAddGIVTokenButton> = ({
	provider,
	showText = true,
	tokenSymbol = 'GIV',
	tokenAddress,
}) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const selectedWallet = window.localStorage.getItem(StorageLabel.WALLET);
		setShow(selectedWallet === EWallets.METAMASK);
	}, []);
	return show ? (
		<AddGivButton
			onClick={() => {
				if (provider) {
					addToken(provider, tokenAddress);
				}
			}}
		>
			<Image
				src='/images/icons/metamask.svg'
				height='32'
				width='32'
				alt='Metamask logo.'
			/>
			{showText && <Desc>Add {tokenSymbol} to Metamask</Desc>}
		</AddGivButton>
	) : null;
};

const AddGivButton = styled(Flex)`
	cursor: pointer;
	align-items: center;
	gap: 8px;
`;

const Desc = styled(P)`
	color: ${brandColors.mustard[600]};
`;
