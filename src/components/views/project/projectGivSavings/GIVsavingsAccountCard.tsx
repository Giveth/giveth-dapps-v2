import {
	Col,
	H4,
	H6,
	Row,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import NetworkLogo from '@/components/NetworkLogo';
import { OptimismNetworkConfig } from '@/types/config';
import { DepositCard } from './DepositCard';

interface IGIVsavingsAccountCard {
	network: OptimismNetworkConfig;
}

enum EAccountState {
	DEPOSIT = 'deposit',
	WITHDRAW = 'withdraw',
}

const tabs = [EAccountState.DEPOSIT, EAccountState.WITHDRAW];

export const GIVsavingsAccountCard: FC<IGIVsavingsAccountCard> = ({
	network,
}) => {
	const [state, setState] = useState(EAccountState.DEPOSIT);
	return (
		<Wrapper>
			<ActionCard>
				<Header justifyContent='space-between'>
					<Flex alignItems='center' gap='8px'>
						<NetworkLogo
							chainId={parseInt(network.chainId)}
							logoSize={40}
						/>
						<H4 weight={700}>Account</H4>
					</Flex>
					<NetworkCard gap='12px'>
						<NetworkLogo
							chainId={parseInt(network.chainId)}
							logoSize={32}
						/>
						<H6>{network.chainName}</H6>
					</NetworkCard>
				</Header>
				<Flex gap='24px'>
					{tabs.map(tab => (
						<Tab
							key={tab}
							isActive={state === tab}
							onClick={() => setState(tab)}
						>
							{tab}
						</Tab>
					))}
				</Flex>
				<Row>
					<Col lg={6}>
						<DepositCard
							givsavingsAccount={network.givsavingsAccounts[0]}
						/>
					</Col>
				</Row>
			</ActionCard>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 24px;
	background-color: ${brandColors.giv['000']};
`;

const ActionCard = styled.div`
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
`;

const Header = styled(Flex)``;

const NetworkCard = styled(Flex)`
	padding: 12px;
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
`;

interface ITab {
	isActive: boolean;
}

const Tab = styled(Flex)<ITab>`
	padding: 9px 24px;
	color: ${neutralColors.gray[800]};
	border-radius: 50px;
	cursor: pointer;
	${props =>
		props.isActive &&
		css`
			background-color: ${neutralColors.gray[200]};
			color: ${brandColors.pinky['500']};
		`};
`;
