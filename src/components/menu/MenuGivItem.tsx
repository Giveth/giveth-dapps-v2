import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
// @ts-ignore
import tokenAbi from 'human-standard-token-abi';

import { FlexCenter } from '../styled-components/Grid';
import { Shadow } from '../styled-components/Shadow';
import givIcon from '/public//images/GIV_menu_token.svg';
import styled from 'styled-components';
import { brandColors } from '@giveth/ui-design-system';
import config from '@/configuration';
import links from '@/lib/constants/links';

const MenuGivItem = () => {
	const context = useWeb3React();
	const { chainId, account, library, active } = context;

	const [givBalance, setGivBalance] = useState(0);
	const router = useRouter();

	const fetchGivBalance = () => {
		const contract = new Contract(
			chainId === config.XDAI_NETWORK_NUMBER
				? config.XDAI_CONFIG.GIV.LM_ADDRESS
				: config.MAINNET_CONFIG.GIV.LM_ADDRESS,
			tokenAbi,
			library,
		);
		contract
			.balanceOf(account)
			.then((res: number) => {
				setGivBalance(res / 10 ** 18);
			})
			.catch((err: never) => {
				console.log(err);
				setGivBalance(0);
			});
	};

	useEffect(() => {
		if (active) fetchGivBalance();
		else setGivBalance(0);
	}, [account, chainId, active]);

	return (
		<GivMenu onClick={() => router.push(links.GIVECONOMY)}>
			<Image width={24} height={24} src={givIcon} alt='giv icon' />
			<GivBalance>
				{parseFloat(String(givBalance)).toLocaleString('en-US')}{' '}
			</GivBalance>
		</GivMenu>
	);
};

const GivBalance = styled.span`
	margin-left: 8px;
`;

const GivMenu = styled(FlexCenter)`
	padding: 0 14.5px;
	cursor: pointer;
	background: white;
	border-radius: 48px;
	height: 48px;
	color: ${brandColors.deep[800]};
	box-shadow: ${Shadow.Dark[500]};
`;

export default MenuGivItem;
