import React, { FC } from 'react';
import {
	brandColors,
	Button,
	Caption,
	H3,
	IconInfo16,
	neutralColors,
} from '@giveth/ui-design-system';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { GIVfrensLink, Subtitle } from '@/components/GIVfrens.sc';
import { Col } from './Grid';
import config from '@/configuration';
import { Flex } from './styled-components/Flex';
import { switchNetwork } from '@/lib/wallet';
import { RegenFarm } from './RegenFarm';

interface IGIVfrensProps {}

interface IChangeNetworkModal {
	network: number;
}

export const GIVfrens: FC<IGIVfrensProps> = () => {
	const { chainId } = useWeb3React();
	const regenFarms =
		chainId === config.XDAI_NETWORK_NUMBER
			? config.XDAI_CONFIG.regenFarms
			: config.MAINNET_CONFIG.regenFarms;

	return (
		<>
			<H3 weight={700}>RegenFarms</H3>
			<Col md={8} lg={6}>
				<Subtitle>
					Explore a multiverse of projects changing the world and earn
					rewards for staking liquidity.&nbsp;
					<GIVfrensLink
						size='Big'
						href=' https://medium.com/giveth/regenfarms-the-next-generation-of-refi-opportunities-7a46f3cf1e09'
						target='_blank'
						rel='noreferrer'
					>
						Learn more
					</GIVfrensLink>
					.
				</Subtitle>
			</Col>
			{regenFarms.map((regenFarm, index) => (
				<RegenFarm key={index} regenFarm={regenFarm} />
			))}
		</>
	);
};

export const DAOChangeNetworkModal = ({ network }: IChangeNetworkModal) => {
	const { account, activate } = useWeb3React();
	const networkLabel =
		network === config.XDAI_NETWORK_NUMBER ? 'Gnosis chain' : 'Mainnet';

	const checkWalletAndSwitchNetwork = async (network: number) => {
		if (!account) {
			await activate(new InjectedConnector({}));
			await switchNetwork(network);
		}
		if (account) {
			await switchNetwork(network);
		}
	};
	return (
		<DAOChangeNetworkModalContainer>
			<Flex gap='16px'>
				<IconInfo16 />
				<Title>Switch network</Title>
			</Flex>
			<Desc>This RegenFarm is only available on {networkLabel}</Desc>
			<ChangeButton
				buttonType='texty'
				label={`Switch to ${networkLabel}`}
				onClick={() => checkWalletAndSwitchNetwork(network)}
			/>
		</DAOChangeNetworkModalContainer>
	);
};

const DAOChangeNetworkModalContainer = styled.div`
	background-color: ${neutralColors.gray[100]};
	color: ${brandColors.giv[300]};
	border: 1px solid ${brandColors.giv[300]};
	border-radius: 8px;
	width: 320px;
	z-index: 4;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	opacity: 2;
	padding: 16px;
`;

const Title = styled(Caption)`
	font-weight: bold;
`;

const Desc = styled(Caption)`
	margin-left: 32px;
	margin-bottom: 16px;
`;

const ChangeButton = styled(Button)`
	color: ${brandColors.giv[300]};
	margin-left: auto;
`;
