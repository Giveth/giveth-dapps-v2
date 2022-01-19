import { addGIVToken } from '@/lib/metamask';
import { EWallets } from '@/lib/wallet/walletTypes';
import { Web3Provider } from '@ethersproject/providers';
import { brandColors, P } from '@giveth/ui-design-system';
import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Row } from './styled-components/Grid';

interface IAddGIVTokenButton {
	provider: Web3Provider | null;
	showText?: boolean;
}

export const AddGIVTokenButton: FC<IAddGIVTokenButton> = ({
	provider,
	showText = true,
}) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const selectedWallet = window.localStorage.getItem('selectedWallet');
		setShow(selectedWallet === EWallets.METAMASK);
	}, []);

	return show ? (
		<AddGivButton
			onClick={() => {
				if (provider) {
					addGIVToken(provider);
				}
			}}
		>
			<Image
				src='/images/icons/metamask.svg'
				height='32'
				width='32'
				alt='Metamask logo.'
			/>
			{showText && <Desc>Add GIV to Metamask</Desc>}
		</AddGivButton>
	) : null;
};

const AddGivButton = styled(Row)`
	cursor: pointer;
	align-items: center;
	gap: 8px;
`;

const Desc = styled(P)`
	color: ${brandColors.mustard[600]};
`;
