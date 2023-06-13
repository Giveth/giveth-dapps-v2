import { ComponentType, ReactElement, useState } from 'react';
import styled from 'styled-components';
import {
	B,
	IconChevronDown24,
	IconChevronUp24,
	IconFlash16,
	IconNetwork24,
	IconRocketInSpace16,
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
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
interface ISelector {
	isSelected: boolean;
}

export interface ISelectedSort {
	icon: ReactElement;
	label: string;
	value: EProjectsSortBy;
}

const DropdownIndicator: ComponentType<DropdownIndicatorProps> = props => {
	return props.selectProps.menuIsOpen ? (
		<IconChevronUp24 color={brandColors.deep[100]} />
	) : (
		<IconChevronDown24 color={brandColors.deep[100]} />
	);
};

const Option: ComponentType<OptionProps<ISelectedSort>> = props => {
	const { data } = props;
	const { label } = data;
	const Icon = data.icon;

	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer>
					{Icon}
					<P>{label}</P>
				</RowContainer>
			</OptionContainer>
		</components.Option>
	);
};

const Control: ComponentType<ControlProps<ISelectedSort>> = ({
	children,
	...props
}) => {
	return (
		<components.Control {...props}>
			{props.selectProps.value ? (
				<>
					{(props.selectProps.value as ISelectedSort).icon}
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
		zIndex: 3,
		border: 'none',
		borderRadius: '8px',
		'&:hover': {
			borderColor: 'transparent',
		},
	}),
	control: styles => ({
		...styles,
		padding: '12px 16px',
		border: 'none',
		boxShadow: 'none',
	}),
	indicatorSeparator: styles => ({
		...styles,
		display: 'none',
	}),
};

const sortByOptions = [
	{
		label: 'label.givpower',
		value: EProjectsSortBy.INSTANT_BOOSTING,
		icon: <IconRocketInSpace16 color={brandColors.deep[900]} />,
	},
	{
		label: 'label.rank',
		value: EProjectsSortBy.GIVPOWER,
		icon: <IconFlash16 color={brandColors.deep[900]} />,
	},
];

export const NetworkSelector = () => {
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);
	const [value, setValue] = useState(sortByOptions[0]);
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
							console.log('e.value', e.value);
						}}
						value={value}
						options={sortByOptions}
						styles={selectStyles}
						id='sorting'
						name='sorting'
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
