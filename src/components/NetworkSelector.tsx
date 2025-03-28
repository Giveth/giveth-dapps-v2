import { ComponentType, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	B,
	GLink,
	IconChevronDown24,
	IconChevronUp24,
	IconNetwork24,
	brandColors,
	neutralColors,
	Flex,
} from '@giveth/ui-design-system';
import { useAccount, useSwitchChain } from 'wagmi';
import Select, { components } from 'react-select';
import { ChangeNetworkModal } from './modals/ChangeNetwork';
import config from '../configuration';
import { NetworkConfig } from '@/types/config';
import NetworkLogo from './NetworkLogo';
import { Shadow } from './styled-components/Shadow';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import type {
	CSSObjectWithLabel,
	ControlProps,
	DropdownIndicatorProps,
	OptionProps,
	StylesConfig,
} from 'react-select';

export interface ISelected {
	label: string;
	value: number;
	network: NetworkConfig;
	active: boolean;
}

const _options = [
	{ network: config.GNOSIS_CONFIG, active: true },
	{ network: config.OPTIMISM_CONFIG, active: true },
	{ network: config.MAINNET_CONFIG, active: true },
	{ network: config.ZKEVM_CONFIG, active: true },
];

const options = _options.map(o => ({
	label: o.network?.name,
	value: o.network?.id,
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
	const { data, isSelected, isDisabled } = props;
	const { value, label } = data;

	return (
		<components.Option {...props}>
			{isSelected || isDisabled ? (
				<Flex gap='4px' $flexDirection='column'>
					<SelectedTitle>
						{isSelected ? 'Selected' : 'Coming soon'}
					</SelectedTitle>
					<Flex gap='8px' $alignItems='center'>
						<IconWrapper>
							<NetworkLogo chainId={value} logoSize={16} />
						</IconWrapper>
						<GLink size='Big'>{label}</GLink>
					</Flex>
				</Flex>
			) : (
				<Flex gap='8px' $alignItems='center'>
					<IconWrapper>
						<NetworkLogo chainId={value} logoSize={16} />
					</IconWrapper>
					<GLink size='Big'>{label}</GLink>
				</Flex>
			)}
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
	container: (baseStyles, props) =>
		({
			...baseStyles,
			backgroundColor: brandColors.giv[600],
			color: neutralColors.gray[100],
			zIndex: 3,
			border: 'none',
			borderRadius: '32px',
			minWidth: '220px',

			'&:hover': {
				borderColor: 'transparent',
			},
		}) as CSSObjectWithLabel,
	control: (baseStyles, props) =>
		({
			...baseStyles,
			backgroundColor: brandColors.giv[600],
			color: neutralColors.gray[100],
			padding: '12px 16px',
			fontWeight: 500,
			border: 'none',
			boxShadow: 'none',
			borderRadius: '0 24px 24px 0 ',
			cursor: 'pointer',
		}) as CSSObjectWithLabel,
	indicatorSeparator: (baseStyles, props) =>
		({
			...baseStyles,
			display: 'none',
		}) as CSSObjectWithLabel,
	placeholder: baseStyles =>
		({
			...baseStyles,
		}) as CSSObjectWithLabel,
	singleValue: (baseStyles, props) =>
		({
			...baseStyles,
			color: neutralColors.gray[100],
		}) as CSSObjectWithLabel,
	menu: (baseStyles, props) =>
		({
			...baseStyles,
			marginTop: '8px',
			borderRadius: '8px',
			padding: '8px',
			backgroundColor: brandColors.giv[600],
			boxShadow: Shadow.Dark[500],
		}) as CSSObjectWithLabel,
	option: (baseStyles, { isFocused, isSelected, isDisabled }) => ({
		padding: '8px 16px',
		margin: '8px',
		borderRadius: '8px',
		backgroundColor: isSelected
			? brandColors.giv[700]
			: isFocused
				? brandColors.giv[500]
				: brandColors.giv[600],
		color: neutralColors.gray[100],
		opacity: isDisabled ? 0.5 : 1,
		cursor: isDisabled ? 'default' : 'pointer',
	}),
};

export const NetworkSelector = () => {
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);
	const [value, setValue] = useState<ISelected | null>();
	const [targetNetwork, setTargetNetwork] = useState(
		config.MAINNET_NETWORK_NUMBER,
	);

	const { chain } = useAccount();
	const chainId = chain?.id;
	const { switchChain } = useSwitchChain();
	const isSafeEnv = useIsSafeEnvironment();

	const handleChangeNetwork = async (networkNumber: number) => {
		setTargetNetwork(networkNumber);
		if (chainId !== networkNumber) {
			if (switchChain) {
				switchChain({ chainId: networkNumber });
			} else {
				setShowChangeNetworkModal(true);
			}
		}
	};

	useEffect(() => {
		const selected = options.find(o => o.value === chainId);
		if (selected) {
			setValue(selected);
		} else {
			setValue(null);
		}
	}, [chainId]);

	if (isSafeEnv) return null;

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
						isOptionDisabled={(option: any) => !option.active}
					/>
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
	width: fit-content;
`;

const Title = styled(Flex)`
	padding: 12px 16px;
	color: ${brandColors.deep[100]};
	background-color: ${brandColors.giv[900]};
	border-radius: 24px 0 0 24px;
	gap: 8px;
`;

const SelectedTitle = styled(GLink)`
	color: ${brandColors.giv[200]};
`;

const IconWrapper = styled.div`
	width: 16px;
	height: 16px;
`;
