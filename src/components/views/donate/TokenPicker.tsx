import { useState } from 'react';
import {
	neutralColors,
	P,
	brandColors,
	Caption,
	IconGIVBack,
	IconCheck,
	B,
	IconCaretUp,
	IconCaretDown,
	IconSearch,
	IconX,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import Select, {
	GroupBase,
	components,
	OptionProps,
	OnChangeValue,
	StylesConfig,
	MenuListProps,
} from 'react-select';

import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import useDetectDevice from '@/hooks/useDetectDevice';

declare module 'react-select/dist/declarations/src/Select' {
	export interface Props<
		Option,
		IsMulti extends boolean,
		Group extends GroupBase<Option>,
	> {
		isMobile?: boolean | null;
		setIsOpen?: any;
		projectVerified?: boolean;
	}
}

const ImageIcon = (props: { symbol: string }) => {
	const { symbol } = props;
	let image_path = '';
	try {
		require(`../../../../public/images/tokens/${symbol?.toUpperCase()}.svg`);
		image_path = `/images/tokens/${symbol?.toUpperCase()}.svg`;
	} catch (err) {
		image_path = '/images/tokens/ETH.svg'; //set default image path
	}
	return <Image alt={symbol} src={image_path} width='24' height='24' />;
};

const MenuList = (props: MenuListProps<IProjectAcceptedToken, false>) => {
	const projectVerified = props.selectProps.projectVerified;
	const { formatMessage } = useIntl();
	return (
		<components.MenuList {...props}>
			{projectVerified && (
				<GivBackIconContainer>
					<IconGIVBack size={24} color={brandColors.giv[500]} />
					<Caption>
						{formatMessage({
							id: 'label.givbacks_eligible_tokens',
						})}
					</Caption>
				</GivBackIconContainer>
			)}
			{props.children}
		</components.MenuList>
	);
};

const Option = ({ ...props }: OptionProps<IProjectAcceptedToken, false>) => {
	const { data, selectProps } = props;
	const { name, symbol, isGivbackEligible } = data;
	const projectVerified = selectProps.projectVerified;
	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer>
					<ImageIcon symbol={symbol} />
					<B>
						{name} ({symbol}){' '}
					</B>
					{isGivbackEligible && projectVerified && (
						<IconGIVBack size={24} color={brandColors.giv[500]} />
					)}
				</RowContainer>
				{props.isSelected && <IconCheck color={brandColors.giv[500]} />}
			</OptionContainer>
		</components.Option>
	);
};

const NotFound = ({ emptyField }: any) => {
	const { formatMessage } = useIntl();
	return (
		<NotFoundContainer>
			<P>{formatMessage({ id: 'label.no_results_found' })}</P>
			<P>
				{formatMessage({ id: 'label.please_try_a_different_address' })}
			</P>
			<P onClick={emptyField}>
				{formatMessage({ id: 'label.token_list' })}
			</P>
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
	disabled?: boolean;
}) => {
	const {
		tokenList,
		onChange,
		onInputChange,
		inputValue,
		selectedToken,
		placeholder,
		projectVerified,
		disabled,
	} = props;

	const { isMobile } = useDetectDevice();
	const [isOpen, setIsOpen] = useState(false);
	const { formatMessage } = useIntl();

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
		!disabled && setIsOpen(!isOpen);
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
			<TargetContainer
				onClick={toggleOpen}
				isOpen={isOpen}
				isMobile={isMobile}
				disabled={disabled}
			>
				<TokenContainer>
					{selectedToken && (
						<ImageIcon symbol={selectedToken.symbol} />
					)}
					{selectedToken
						? selectedToken.symbol
						: formatMessage({ id: 'label.select_a_token' })}
				</TokenContainer>
				{isOpen ? <IconCaretUp /> : <IconCaretDown />}
			</TargetContainer>
			{isOpen && (
				<Menu>
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
				</Menu>
			)}
			{isOpen && <Blanket onClick={toggleOpen} />}
		</>
	);
};

const Menu = styled.div`
	background-color: white;
	border-radius: 8px;
	box-shadow: ${Shadow.Neutral[400]};
	margin-top: 8px;
	position: absolute;
	z-index: 13;
`;

const Blanket = styled.div`
	bottom: 0;
	left: 0;
	top: 0;
	right: 0;
	position: fixed;
	z-index: 12;
`;

const Control = (props: any) => {
	if (!props.selectProps.isMobile) {
		return <components.Control {...props} />;
	}
	return (
		<>
			<MobileClose onClick={() => props.selectProps.setIsOpen(false)}>
				<IconX size={24} />
			</MobileClose>
			<components.Control {...props} />
		</>
	);
};

const MobileClose = styled.div`
	text-align: right;
	padding: 20px 20px 5px 0;
`;

const DropdownIndicator = () => (
	<DropdownStyled>
		<IconSearch color={neutralColors.gray[600]} />
	</DropdownStyled>
);

const DropdownStyled = styled(FlexCenter)`
	margin-right: 10px;
	padding-left: 6px;
	border-left: 1px solid ${neutralColors.gray[400]};
`;

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

interface ITokenPicker {
	isOpen: boolean;
	isMobile?: boolean | null;
	disabled?: boolean;
}

const TargetContainer = styled.div<ITokenPicker>`
	display: flex;
	cursor: pointer;
	justify-content: space-between;
	align-items: center;
	height: 54px;
	border-right: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px 0 0 8px;
	padding: 14px 16px;
	color: ${props => props.disabled && neutralColors.gray[600]};
	background: ${props =>
		props.disabled
			? neutralColors.gray[200]
			: props.isOpen && props.isMobile
			? 'rgba(79, 87, 106, 0.1)'
			: props.isOpen
			? neutralColors.gray[200]
			: 'transparent'};
`;

const RowContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	> :first-child {
		flex-shrink: 0;
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
