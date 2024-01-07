import { brandColors, P } from '@giveth/ui-design-system';
import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { type Address, useAccount } from 'wagmi';
import { Flex } from './styled-components/Flex';
import { addToken } from '@/lib/metamask';

interface IAddGIVTokenButton {
	chainId?: number;
	showText?: boolean;
	tokenSymbol?: string;
	tokenAddress?: Address;
}

export const AddTokenButton: FC<IAddGIVTokenButton> = ({
	chainId,
	showText = true,
	tokenSymbol = 'GIV',
	tokenAddress,
}) => {
	const [show, setShow] = useState(false);

	const { connector: activeConnector } = useAccount();

	useEffect(() => {
		setShow(activeConnector?.id.toLowerCase() === '"metamask"');
	}, []);
	return show ? (
		<AddGivButton
			onClick={() => {
				if (chainId) {
					addToken(chainId, tokenAddress);
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
