import { FunctionComponent, ReactNode, useState } from 'react';
import { defaultTheme } from 'react-select';
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
	OnChangeValue,
	StylesConfig,
	MenuListProps,
} from 'react-select';

import useDeviceDetect from '@/hooks/useDeviceDetect';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import XIcon from '/public/images/x-icon.svg';
import GivbackEligibleIcon from '/public/images/givback-eligible.svg';

interface ITokenPicker {
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
		projectVerified?: boolean;
	}
}

const { colors } = defaultTheme;

const ImageIcon = (props: { symbol: string }) => {
	const { symbol } = props;
	let image_path = '';
	try {
		require(`../../../../public/images/tokens/${symbol?.toLowerCase()}.png`);
		image_path = `/images/tokens/${symbol?.toLowerCase()}.png`;
	} catch (err) {
		image_path = '/images/tokens/eth.png'; //set default image path
	}
	return <Image alt={symbol} src={image_path} width='24px' height='24px' />;
};

const MenuList = (props: MenuListProps<IProjectAcceptedToken, false>) => {
	const projectVerified = props.selectProps.projectVerified;
	return (
		<components.MenuList {...props}>
			{projectVerified && (
				<GivBackIconContainer>
					<Image
						alt='givback eligible icon'
						src={GivbackEligibleIcon}
					/>
					<Caption>GIVbacks eligible tokens</Caption>
				</GivBackIconContainer>
			)}
			{props.children}
		</components.MenuList>
	);
};

const Option = ({ ...props }: OptionProps<IProjectAcceptedToken, false>) => {
	const value = props.data;
	const projectVerified = props.selectProps.projectVerified;
	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer>
					<ImageIcon symbol={value.symbol} />
					<B>
						{value.name} ({value.symbol}){'  '}{' '}
						{value?.isGivbackEligible && projectVerified && (
							<Image
								alt='givback eligible icon'
								src={GivbackEligibleIcon}
							/>
						)}
					</B>{' '}
				</RowContainer>
				{props.isSelected && (
					<Image
						src='/images/checkmark.svg'
						width='10px'
						height='10px'
						alt={value.symbol}
					/>
				)}
			</OptionContainer>
		</components.Option>
	);
};

const NotFound = ({ emptyField }: any) => {
	return (
		<NotFoundContainer>
			<P>No results found</P>
			<P>Please try a different address or select one from the list</P>
			<P onClick={emptyField}>Token List</P>
		</NotFoundContainer>
	);
};

const TokenPicker = (props: {
	projectVerified: boolean;
	tokenList: IProjectAcceptedToken[] | undefined;
	onChange: any;
	onInputChange?: any;
	inputValue?: any;
	selectedToken: IProjectAcceptedToken | undefined;
	placeholder: string;
}) => {
	const {
		tokenList,
		onChange,
		onInputChange,
		inputValue,
		selectedToken,
		placeholder,
		projectVerified,
	} = props;
	const { isMobile } = useDeviceDetect();
	const [isOpen, setIsOpen] = useState(false);
	const selectStyles: StylesConfig<IProjectAcceptedToken, false> = {
		control: (base: any) => ({
			...base,
			minWidth: isMobile ? '90%' : 240,
			maxWidth: isMobile ? '90%' : '100%',
			margin: isMobile ? '8px 16px' : 8,
			marginBottom: isMobile ? 3 : -3,
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
			padding: isMobile ? '0 15px' : 0,
			width: isMobile ? '100%' : '320px',
			height: isMobile ? '300px' : '220px',
		}),
		singleValue: (base: any) => ({
			...base,
			padding: 0,
		}),
		container: (base: any) => ({
			...base,
			borderColor: 'white',
			width: '100%',
			background: isMobile ? 'white' : 'transparent',
			position: isMobile ? 'fixed' : 'relative',
			left: isMobile ? 0 : 'null',
			bottom: isMobile ? 0 : 'null',
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

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	const onSelectChange = (
		value: OnChangeValue<IProjectAcceptedToken, false>,
	) => {
		toggleOpen();
		onChange(value);
	};

	const filterOptions = (
		option: { data: IProjectAcceptedToken },
		inputValue: string,
	) => {
		const { address, name, symbol } = option.data;
		if (
			address?.toLowerCase() ===
			inputValue?.toLowerCase()?.replace(/ /g, '')
		) {
			return true;
		}
		return (
			symbol.includes(inputValue?.toUpperCase()) ||
			name?.toLowerCase().includes(inputValue?.toLocaleLowerCase())
		);
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
							{selectedToken && (
								<ImageIcon symbol={selectedToken.symbol} />
							)}
							<P>
								{selectedToken
									? selectedToken.symbol
									: 'Select a token'}
							</P>
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
						<NotFound emptyField={() => onChange('')} />
					)}
					isMobile={isMobile}
					projectVerified={projectVerified}
					setIsOpen={setIsOpen}
					value={selectedToken}
					inputValue={inputValue}
					controlShouldRenderValue={false}
					hideSelectedOptions={false}
					isClearable={false}
					menuIsOpen={isOpen}
					onChange={onSelectChange}
					onInputChange={onInputChange && onInputChange}
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

// styled components

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

const TargetContainer = styled.div`
	display: flex;
	cursor: pointer;
	flex-direction: row;
	justify-content: space-between;
	height: 54px;
	border: 2px solid ${neutralColors.gray[300]};
	padding: 14px 16px;
	background: ${(props: ITokenPicker) =>
		props.isOpen && props.isMobile
			? 'rgba(79, 87, 106, 0.1)'
			: props.isOpen
			? neutralColors.gray[200]
			: 'transparent'};
	border-radius: 6px 0 0 6px;
	align-items: center;
	border-right: 2px solid
		${(props: ITokenPicker) =>
			props.isMobile && props.isOpen
				? 'rgba(79, 87, 106, 0.1)'
				: neutralColors.gray[300]};
	img {
		filter: ${(props: ITokenPicker) =>
			props.isMobile && props.isOpen && 'brightness(70%)'};
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
const TokenContainer = styled.div`
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

export default TokenPicker;
