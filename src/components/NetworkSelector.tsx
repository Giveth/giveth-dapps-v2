import { ComponentType, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	B,
	IconChevronDown24,
	IconChevronUp24,
	IconNetwork24,
	P,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';

import Select, {
	ControlProps,
	DropdownIndicatorProps,
	OptionProps,
	StylesConfig,
	components,
} from 'react-select';
import { switchNetwork } from '@/lib/wallet';
import { Flex } from './styled-components/Flex';
import { ChangeNetworkModal } from './modals/ChangeNetwork';
import config from '../configuration';
import { BasicNetworkConfig } from '@/types/config';
import NetworkLogo from './NetworkLogo';

export interface ISelected {
	label: string;
	value: number;
	network: BasicNetworkConfig;
	active: boolean;
}

const _options = [
	{ network: config.MAINNET_CONFIG, active: true },
	{ network: config.XDAI_CONFIG, active: true },
	{ network: config.OPTIMISM_CONFIG, active: true },
	{ network: config.CELO_CONFIG, active: false },
];

const options = _options.map(o => ({
	label: o.network.chainName,
	value: parseInt(o.network.chainId),
	network: o.network,
	active: o.active,
}));

const DropdownIndicator: ComponentType<DropdownIndicatorProps> = props => {
	return props.selectProps.menuIsOpen ? (
		<IconChevronUp24 color={brandColors.deep[100]} />
	) : (
		<IconChevronDown24 color={brandColors.deep[100]} />
	);
};

const Option: ComponentType<OptionProps<ISelected>> = props => {
	const { data } = props;
	const { value, label } = data;

	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer>
					<NetworkLogo chainId={value} logoSize={24} />
					<P>{label}</P>
				</RowContainer>
			</OptionContainer>
		</components.Option>
	);
};

const Control: ComponentType<ControlProps<ISelected>> = ({
	children,
	...props
}) => {
	const value = props.selectProps.value;
	return (
		<components.Control {...props}>
			{value ? (
				<>
					<NetworkLogo
						chainId={(value as ISelected).value}
						logoSize={24}
					/>
					{children}
				</>
			) : (
				children
			)}
		</components.Control>
	);
};

const selectStyles: StylesConfig = {
	container: styles => ({
		...styles,
		backgroundColor: brandColors.giv[600],
		color: neutralColors.gray[100],
		zIndex: 3,
		border: 'none',
		borderRadius: '32px',
		minWidth: '200px',
		'&:hover': {
			borderColor: 'transparent',
		},
	}),
	control: styles => ({
		...styles,
		backgroundColor: brandColors.giv[600],
		color: neutralColors.gray[100],
		padding: '12px 16px',
		border: 'none',
		boxShadow: 'none',
		borderRadius: '0 24px 24px 0 ',
	}),
	indicatorSeparator: styles => ({
		...styles,
		display: 'none',
	}),
	placeholder: styles => ({
		...styles,
		color: neutralColors.gray[100],
	}),
	singleValue: (styles, { data }) => ({
		...styles,
		color: neutralColors.gray[100],
	}),
};

export const NetworkSelector = () => {
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);
	const [value, setValue] = useState(options[1]);
	const [targetNetwork, setTargetNetwork] = useState(
		config.MAINNET_NETWORK_NUMBER,
	);

	const { chainId } = useWeb3React();

	const handleChangeNetwork = async (networkNumber: number) => {
		setTargetNetwork(networkNumber);
		if (chainId !== networkNumber) {
			if (typeof (window as any).ethereum !== 'undefined') {
				switchNetwork(networkNumber);
			} else {
				setShowChangeNetworkModal(true);
			}
		}
	};

	useEffect(() => {
		if (chainId) {
			const selected = options.find(o => o.value === chainId);
			if (selected) {
				setValue(selected);
			}
		}
	}, [chainId]);

	return (
		<>
			{chainId ? (
				<NetworkSelectorContainer>
					<Title>
						<IconNetwork24 />
						<B>Network</B>
					</Title>
					<Select
						components={{
							DropdownIndicator,
							Option: (props: any) => <Option {...props} />,
							Control: (props: any) => <Control {...props} />,
						}}
						onChange={(e: any) => {
							handleChangeNetwork(e.value);
						}}
						value={value}
						options={options}
						styles={selectStyles}
						id='network-selector'
						name='network-selector'
						isClearable={false}
						isSearchable={false}
						isMulti={false}
					/>
					{/* <Selector
						isSelected={chainId === config.XDAI_NETWORK_NUMBER}
						onClick={() =>
							handleChangeNetwork(config.XDAI_NETWORK_NUMBER)
						}
					>
						<IconGnosisChain size={24} />
						<B>Gnosis Chain</B>
					</Selector>
					<Selector
						isSelected={
							chainId === config.MAINNET_NETWORK_NUMBER ||
							!givEconomySupportedNetworks.includes(chainId)
						}
						onClick={() =>
							handleChangeNetwork(config.MAINNET_NETWORK_NUMBER)
						}
					>
						<IconEthereum size={24} />
						<B>Ethereum</B>
					</Selector> */}
				</NetworkSelectorContainer>
			) : (
				'' // TODO: show connect your wallet
			)}
			{showChangeNetworkModal && (
				<ChangeNetworkModal
					setShowModal={setShowChangeNetworkModal}
					targetNetwork={targetNetwork}
				/>
			)}
		</>
	);
};

interface INetworkSelectorProps {}

const NetworkSelectorContainer = styled(Flex)<INetworkSelectorProps>`
	height: 48px;
	border-radius: 24px;
	border: 1px solid ${brandColors.giv[600]};
`;

const Title = styled(Flex)`
	padding: 12px 16px;
	color: ${brandColors.deep[100]};
	background-color: ${brandColors.giv[900]};
	border-radius: 24px 0 0 24px;
`;

const OptionContainer = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const RowContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	> :first-child {
		flex-shrink: 0;
	}
	> :last-child {
		width: 100%;
		color: ${neutralColors.gray[900]};
	}
`;
