import {
	CSSProperties,
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import {
	Flex,
	GLink,
	IconChevronDown24,
	IconChevronUp24,
	neutralColors,
} from '@giveth/ui-design-system';
import { Shadow } from './styled-components/Shadow';
import { zIndex } from '@/lib/constants/constants';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

interface IDropdownProps {
	label: string;
	options: IOption[];
	style?: any;
	stickToRight?: boolean;
	color?: string;
}

export enum EOptionType {
	ITEM,
	SEPARATOR,
}

export interface IOption {
	type?: EOptionType;
	label?: string;
	icon?: ReactNode;
	cb?: any;
	isHidden?: boolean;
	color?: string;
}

export const Dropdown: FC<IDropdownProps> = ({
	label,
	options,
	style,
	stickToRight,
	color,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(
		() => setIsOpen(false),
		isOpen,
		dropdownRef,
		containerRef,
	);

	const dropdownStyle: CSSProperties =
		isOpen && containerRef.current
			? {
					position: 'absolute',
					top:
						containerRef.current.getBoundingClientRect().bottom +
						window.scrollY +
						'px',
					right: stickToRight
						? document.documentElement.clientWidth -
							containerRef.current.getBoundingClientRect().right +
							window.scrollX +
							'px'
						: 'unset',
					left: stickToRight
						? 'unset'
						: containerRef.current.getBoundingClientRect().left +
							window.scrollX +
							'px',
					zIndex: zIndex.DROPDOWN,
				}
			: {};

	return (
		<Wrapper
			style={style}
			ref={containerRef}
			onClick={() => setIsOpen(_open => !_open)}
		>
			<Controller $justifyContent='space-between'>
				<GLink size='Big'>{label}</GLink>
				<IconWrapper>
					{isOpen ? <IconChevronUp24 /> : <IconChevronDown24 />}
				</IconWrapper>
			</Controller>
			{isOpen &&
				createPortal(
					<OptionsWrapper style={dropdownStyle} ref={dropdownRef}>
						{options.map(option =>
							option.isHidden ? null : (
								<Option
									key={option.label}
									option={option}
									setIsOpen={setIsOpen}
									color={color}
								/>
							),
						)}
					</OptionsWrapper>,
					document.body,
				)}
		</Wrapper>
	);
};

interface IOptionProps {
	option: IOption;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	color?: string;
}

const Option: FC<IOptionProps> = ({ option, setIsOpen }) => {
	return option.type === EOptionType.SEPARATOR ? (
		<StyledHr />
	) : (
		<OptionWrapper
			onClick={() => {
				option.cb && option.cb();
				setIsOpen(false);
			}}
			gap='8px'
			$color={option.color}
		>
			{option.icon && option.icon}
			{option.label}
		</OptionWrapper>
	);
};

const Wrapper = styled.div`
	position: relative;
	user-select: none;
	cursor: pointer;
`;

const Controller = styled(Flex)`
	width: 100%;
`;

const IconWrapper = styled.div`
	pointer-events: none;
	width: 24px;
	height: 24px;
`;

const OptionsWrapper = styled.div`
	position: absolute;
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	padding: 8px;
	margin-top: 8px;
	box-shadow: ${Shadow.Neutral[400]};
`;

interface IOptionsWrapperProps {
	$color?: string;
}

const OptionWrapper = styled(Flex)<IOptionsWrapperProps>`
	padding: 8px 16px;
	border-radius: 8px;
	margin-bottom: 8px;
	align-items: center;
	cursor: pointer;
	color: ${({ $color }) => $color || neutralColors.gray[900]};
	&:hover {
		background-color: ${neutralColors.gray[200]};
	}
`;

const StyledHr = styled.hr`
	border: none;
	border-top: 1px solid ${neutralColors.gray[300]};
	width: 100%;
	margin: 8px 0;
`;
