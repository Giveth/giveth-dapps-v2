import { FunctionComponent, ReactNode, useState } from 'react';
import { defaultTheme, OnChangeValue } from 'react-select';
import {
	neutralColors,
	P,
	B,
	brandColors,
	Caption,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import Select, {
	GroupBase,
	components,
	OptionProps,
	StylesConfig,
	MenuListProps,
} from 'react-select';

import useDeviceDetect from '@/hooks/useDeviceDetect';
import XIcon from '/public/images/x-icon.svg';
import GivbackEligibleIcon from '/public/images/givback-eligible.svg';
import { Shadow } from '@/components/styled-components/Shadow';
import { ISelectedNetwork } from '@/components/views/verification/manageFunds/types';

interface INetworkPicker {
	isOpen: boolean;
	isMobile?: boolean;
}

declare module 'react-select/dist/declarations/src/Select' {
	export interface Props<
		Option,
		IsMulti extends boolean,
		Group extends GroupBase<Option>,
	> {
		isMobile?: boolean;
		setIsOpen?: any;
	}
}

const { colors } = defaultTheme;

const ImageIcon = (props: { label: string }) => {
	const { label } = props;
	let image_path = '';

	if (label === 'Gnosis') {
		image_path = '/images/currencies/xdai/40.svg';
	} else {
		image_path = '/images/currencies/eth/40.svg';
	}
	return <Image alt={label} src={image_path} width='24px' height='24px' />;
};

const MenuList = (props: MenuListProps<ISelectedNetwork, false>) => {
	return (
		<components.MenuList {...props}>
			<GivBackIconContainer>
				<Image alt='givback eligible icon' src={GivbackEligibleIcon} />
				<Caption>GIVbacks eligible networks</Caption>
			</GivBackIconContainer>
			{props.children}
		</components.MenuList>
	);
};

const Option = ({ ...props }: OptionProps<ISelectedNetwork, false>) => {
	const value = props.data;
	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer>
					<ImageIcon label={value.label} />
					<B>
						{value.label}{' '}
						{value?.isGivbackEligible && (
							<Image
								alt='givback eligible icon'
								src={GivbackEligibleIcon}
							/>
						)}
					</B>
				</RowContainer>
				{props.isSelected && (
					<Image
						src='/images/checkmark.svg'
						width='10px'
						height='10px'
						alt={value.label}
					/>
				)}
			</OptionContainer>
		</components.Option>
	);
};

const NotFound = ({ emptyField }: { emptyField: () => void }) => {
	return (
		<NotFoundContainer>
			<P>No results found</P>
			<P>Please try a different network</P>
			<P onClick={emptyField}>Reset Networks List</P>
		</NotFoundContainer>
	);
};

const SelectNetwork = (props: {
	tokenList?: ISelectedNetwork[];
	onChange: (i: ISelectedNetwork) => void;
	inputValue?: string;
	selectedNetwork?: ISelectedNetwork;
	placeholder: string;
	onInputChange: (i: string) => void;
}) => {
	const {
		tokenList,
		onInputChange,
		onChange,
		inputValue,
		selectedNetwork,
		placeholder,
	} = props;
	const { isMobile } = useDeviceDetect();
	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	const onSelectChange = (value: OnChangeValue<ISelectedNetwork, false>) => {
		toggleOpen();
		onChange(value as ISelectedNetwork);
	};

	const filterOptions = (
		option: { data: ISelectedNetwork },
		inputValue: string,
	) => {
		const { label } = option.data;
		return label?.toLowerCase().includes(inputValue?.toLocaleLowerCase());
	};

	return (
		<>
			{isOpen && isMobile && <OverLay />}
			<Dropdown
				isOpen={isOpen}
				onClose={toggleOpen}
				target={
					<TargetContainer
						onClick={toggleOpen}
						isOpen={isOpen}
						isMobile={isMobile}
					>
						<TokenContainer>
							{selectedNetwork ? (
								<>
									<ImageIcon label={selectedNetwork.label} />{' '}
									{selectedNetwork.label}
								</>
							) : (
								'Select chain'
							)}
						</TokenContainer>
						<ArrowImg
							src={
								!isOpen
									? '/images/caret_down.svg'
									: '/images/caret_up.svg'
							}
							alt='arrow down'
							width='8px'
							height='6px'
						/>{' '}
					</TargetContainer>
				}
			>
				<Select
					autoFocus
					backspaceRemovesValue={false}
					components={{
						DropdownIndicator,
						IndicatorSeparator: null,
						Option: (optionProps: any) => (
							<Option {...optionProps} />
						),
						Control,
						MenuList,
					}}
					noOptionsMessage={() => (
						<NotFound emptyField={() => onInputChange('')} />
					)}
					isMobile={isMobile}
					setIsOpen={setIsOpen}
					value={selectedNetwork}
					controlShouldRenderValue={false}
					hideSelectedOptions={false}
					isClearable={false}
					inputValue={inputValue}
					onInputChange={onInputChange}
					menuIsOpen={isOpen}
					onChange={onSelectChange}
					options={tokenList}
					styles={selectStyles}
					tabSelectsValue={false}
					placeholder={placeholder}
					filterOption={filterOptions}
				/>
			</Dropdown>
		</>
	);
};

const selectStyles: StylesConfig<ISelectedNetwork, false> = {
	control: (base: any) => ({
		...base,
		minWidth: 240,
		maxWidth: '100%',
		margin: 8,
		marginBottom: -3,
		border: `2px solid ${neutralColors.gray[500]}`,
		borderRadius: '8px !important',
	}),
	menu: () => ({
		borderRadius: 0,
		hyphens: 'auto',
		marginTop: 0,
		textAlign: 'left',
		wordWrap: 'break-word',
		padding: 8,
		zIndex: 5,
	}),
	menuList: (base: any) => ({
		...base,
		borderRadius: 0,
		padding: 0,
		width: '100%',
		height: '220px',
	}),
	singleValue: (base: any) => ({
		...base,
		padding: 0,
	}),
	container: (base: any) => ({
		...base,
		borderColor: 'white',
		width: '100%',
		background: 'transparent',
		position: 'relative',
		left: 'null',
		bottom: 'null',
	}),
	option: (provided, state) => ({
		...provided,
		width: '100%',
		background: state.isSelected ? neutralColors.gray[200] : 'white',
		':hover': {
			background: neutralColors.gray[200],
		},
		color: neutralColors.gray[900],
		padding: '8px 16px',
		borderRadius: '8px',
		cursor: 'pointer',
	}),
	placeholder: (base: any) => ({
		...base,
		color: neutralColors.gray[500],
		fontSize: '12px',
	}),
	input: (base: any) => ({
		...base,
		borderRadius: '8px !important',
		display: 'flex',
		flex: 1,
		'*': {
			width: '100%',
		},
		input: {
			width: '100% !important',
		},
	}),
};

const Control = (props: any) => {
	if (!props.selectProps.isMobile) {
		return <components.Control {...props} />;
	}
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<div>
				<a
					onClick={() => props.selectProps.setIsOpen(false)}
					style={{
						float: 'right',
						margin: '19px 12px 8px 0',
					}}
				>
					<Image alt='x icon' src={XIcon} />
				</a>
			</div>
			<components.Control {...props} />
		</div>
	);
};

const Menu = (props: JSX.IntrinsicElements['div']) => {
	const shadow = 'hsla(218, 50%, 10%, 0.1)';
	return (
		<div
			style={{
				backgroundColor: 'white',
				borderRadius: 4,
				boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
				marginTop: 8,
				position: 'absolute',
				zIndex: 2,
				width: '100%',
			}}
			{...props}
		/>
	);
};

const Blanket = (props: JSX.IntrinsicElements['div']) => (
	<div
		style={{
			bottom: 0,
			left: 0,
			top: 0,
			right: 0,
			position: 'fixed',
			zIndex: 1,
		}}
		{...props}
	/>
);

interface DropdownProps {
	readonly isOpen: boolean;
	readonly target: ReactNode;
	readonly onClose: () => void;
}

const Dropdown: FunctionComponent<DropdownProps> = ({
	children,
	isOpen,
	target,
	onClose,
}) => {
	return (
		<>
			<div style={{ zIndex: 1 }}>{target}</div>
			<div style={{ position: 'relative', zIndex: 11 }}>
				{isOpen ? <Menu>{children}</Menu> : null}
				{isOpen ? <Blanket onClick={onClose} /> : null}
			</div>
		</>
	);
};

const Svg = (p: JSX.IntrinsicElements['svg']) => (
	<svg
		width='24'
		height='24'
		viewBox='0 0 24 24'
		focusable='false'
		role='presentation'
		{...p}
	/>
);

const DropdownIndicator = () => (
	<div style={{ color: colors.neutral20, height: 24, width: 32 }}>
		<Svg>
			<path
				d='M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z'
				fill='currentColor'
				fillRule='evenodd'
			/>
		</Svg>
	</div>
);

const OverLay = styled.div`
	position: fixed;
	display: block;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(79, 87, 106, 0.5);
	z-index: 11;
	cursor: pointer;
`;

const TargetContainer = styled.div<INetworkPicker>`
	display: flex;
	cursor: pointer;
	flex-direction: row;
	justify-content: space-between;
	height: 54px;
	border: 2px solid
		${props =>
			props.isOpen ? brandColors.giv[600] : neutralColors.gray[300]};
	padding: 14px 16px;
	background: ${props =>
		props.isOpen && props.isMobile
			? 'rgba(79, 87, 106, 0.1)'
			: props.isOpen
			? neutralColors.gray[200]
			: 'transparent'};
	border-radius: 8px;
	align-items: center;
	:hover {
		box-shadow: ${Shadow.Neutral[500]};
	}
	img {
		filter: ${props => props.isMobile && props.isOpen && 'brightness(70%)'};
	}
`;

const RowContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	> :first-child {
		flex-shrink: 0;
		padding-right: 20px;
	}
	> :last-child {
		width: 100%;
		color: ${neutralColors.gray[900]};
	}
`;
const OptionContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;
const TokenContainer = styled(B)`
	display: flex;
	align-items: center;
	gap: 8px;

	> :first-child {
		flex-shrink: 0;
	}
`;
const ArrowImg = styled.img`
	margin-left: 5px;
`;
const NotFoundContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 20px;

	div:first-child {
		font-weight: bold;
	}
	div:nth-child(3) {
		margin-top: 20px;
		color: ${brandColors.pinky[500]};
		cursor: pointer;
	}
`;

const GivBackIconContainer = styled.div`
	display: flex;
	flex-direction: row;
	padding: 8px 10px;
	margin: 0 0 10px 0;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	* {
		color: ${brandColors.deep[600]};
	}
	div {
		margin-left: 10px;
	}
`;

export default SelectNetwork;
