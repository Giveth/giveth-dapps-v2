import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import Select, {
	components,
	OptionProps,
	OnChangeValue,
	StylesConfig,
} from 'react-select';
import Image from 'next/image';
import { useDeviceDetect } from '@/utils';
import { defaultTheme } from 'react-select';
import { neutralColors, P, B, brandColors } from '@giveth/ui-design-system';
import XIcon from '/public/images/x-icon.svg';
import styled from 'styled-components';

interface ISelectObj {
	value: string;
	label: string;
	chainId?: number;
	symbol?: string;
	icon?: string;
	address?: string;
	ethereumAddress?: string;
	decimals?: number;
}
interface ITokenPicker {
	isOpen: boolean;
	isMobile?: boolean;
}

const { colors } = defaultTheme;

const ImageIcon = ({ ...props }: any) => {
	const { value, style } = props;
	let image_path = '';
	try {
		require(`../../../../public/images/tokens/${value.symbol?.toLowerCase()}.png`);
		image_path = `/images/tokens/${value.symbol?.toLowerCase()}.png`;
	} catch (err) {
		image_path = '/images/tokens/eth.png'; //set default image path
	}
	return (
		<Img
			key={value?.symbol}
			src={image_path}
			style={{ marginRight: '16px', ...style }}
			width='24px'
			height='24px'
		/>
	);
};

const Option = ({ ...props }: OptionProps<ISelectObj, false>) => {
	const value = props.data as any;
	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer>
					<ImageIcon value={value} />
					<B style={{ color: neutralColors.gray[900] }}>
						{value.name} ({value.symbol})
					</B>
				</RowContainer>
				{props.isSelected && (
					<Img
						src='/images/checkmark.svg'
						width='10px'
						height='10px'
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
	tokenList: ISelectObj[] | undefined;
	onChange: any;
	onInputChange: any;
	inputValue?: any;
	selectedToken: ISelectObj | undefined;
	placeholder: string;
}) => {
	const {
		tokenList,
		onChange,
		onInputChange,
		inputValue,
		selectedToken,
		placeholder,
	} = props;
	const { isMobile } = useDeviceDetect();
	const [value, setValue] = useState<ISelectObj | null>();
	const [isOpen, setIsOpen] = useState(false);

	const selectStyles: StylesConfig<ISelectObj, false> = {
		control: (base: any) => ({
			...base,
			minWidth: isMobile ? '90%' : 240,
			maxWidth: isMobile ? '90%' : '280px',
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
			width: isMobile ? '100%' : '280px',
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
	const onSelectChange = (value: OnChangeValue<ISelectObj, false>) => {
		toggleOpen();
		setValue(value);
		onChange(value);
	};

	const filterOptions = (option: any, inputValue: string) => {
		if (
			option.data.address?.toLowerCase() ===
			inputValue?.toLowerCase()?.replace(/ /g, '')
		) {
			return true;
		}
		return (
			option.label.includes(inputValue?.toUpperCase()) ||
			option.data.name
				?.toLowerCase()
				.includes(inputValue?.toLocaleLowerCase())
		);
	};

	useEffect(() => {
		setValue(selectedToken);
	}, [selectedToken]);

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
							{value && (
								<ImageIcon
									value={value}
									style={{ margin: '0 16px 0 4px' }}
								/>
							)}
							<P
								style={{
									color: neutralColors.gray[900],
									marginLeft: '-8px',
								}}
							>
								{value ? `${value.label}` : 'Select a token'}
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
						Option,
						Control: (props: any) =>
							Control({
								...props,
								isMobile,
								closeMenu: () => setIsOpen(false),
							}),
					}}
					noOptionsMessage={() => (
						<NotFound emptyField={() => onChange('')} />
					)}
					value={value}
					inputValue={inputValue}
					controlShouldRenderValue={false}
					hideSelectedOptions={false}
					isClearable={false}
					menuIsOpen={isOpen}
					onChange={onSelectChange}
					onInputChange={onInputChange}
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
	if (!props.isMobile) {
		return <components.Control {...props} />;
	}
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<div>
				<a
					onClick={() => props.closeMenu()}
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
		<>
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
		</>
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
		<div style={{ position: 'relative', zIndex: 3 }}>
			{target}
			{isOpen ? <Menu>{children}</Menu> : null}
			{isOpen ? <Blanket onClick={onClose} /> : null}
		</div>
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
	z-index: 3;
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
	border-radius: 6px 0px 0px 6px;
	border: none;
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
	flex-direction: row;
`;
const OptionContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;
const TokenContainer = styled.div`
	display: flex;
	flex-direction: row;
`;
const Img = styled.img`
	margin-left: -10px;
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

export default TokenPicker;
