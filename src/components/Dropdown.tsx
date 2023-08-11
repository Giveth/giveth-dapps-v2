import {
	Dispatch,
	FC,
	ReactNode,
	RefObject,
	SetStateAction,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import {
	GLink,
	IconChevronDown,
	IconChevronUp,
	neutralColors,
} from '@giveth/ui-design-system';
import { Flex } from './styled-components/Flex';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Shadow } from './styled-components/Shadow';

interface IDropdownProps {
	label: string;
	options: IOption[];
}

export enum OptionType {
	ITEM,
	SEPARATOR,
}

export interface IOption {
	type: OptionType;
	label: string;
	icon?: ReactNode;
	cb?: any;
	disabled?: boolean;
}

export const Dropdown: FC<IDropdownProps> = ({ label, options }) => {
	const [open, setOpen] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const dropdownStyle =
		open && containerRef.current
			? {
					position: 'absolute',
					top:
						containerRef.current.getBoundingClientRect().bottom +
						window.scrollY +
						'px',
					left:
						containerRef.current.getBoundingClientRect().left +
						window.scrollX +
						'px',
					zIndex: 1000,
			  }
			: {};

	useOnClickOutside(containerRef, () => setOpen(false), open);
	return (
		<Wrapper ref={containerRef}>
			<Controller>
				<ControllerWrapper
					justifyContent='space-between'
					onMouseDown={() => setOpen(_open => !_open)}
				>
					<GLink size='Big'>{label}</GLink>
					<IconWrapper>
						{open ? (
							<IconChevronUp size={24} />
						) : (
							<IconChevronDown size={24} />
						)}
					</IconWrapper>
				</ControllerWrapper>
			</Controller>
			{open &&
				createPortal(
					<Options
						style={dropdownStyle}
						ref={dropdownRef}
						options={options}
						setOpen={setOpen}
					/>,
					document.body,
				)}
		</Wrapper>
	);
};

interface IOptionsProps {
	options: IOption[];
	setOpen: Dispatch<SetStateAction<boolean>>;
	ref: RefObject<HTMLDivElement>;
	style: any;
}

const Options: FC<IOptionsProps> = ({ options, setOpen, ref, style }) => {
	return (
		<OptionsWrapper style={style} ref={ref}>
			{options.map((option, idx) =>
				option.disabled ? null : (
					<Option key={idx} option={option} setOpen={setOpen} />
				),
			)}
		</OptionsWrapper>
	);
};

interface IOptionProps {
	option: IOption;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const Option: FC<IOptionProps> = ({ option, setOpen }) => {
	return (
		<OptionWrapper
			onClick={() => {
				option.cb && option.cb();
				setOpen(false);
			}}
			gap='8px'
		>
			{option.icon && option.icon}
			{option.label}
		</OptionWrapper>
	);
};

const Wrapper = styled.div`
	position: relative;
	user-select: none;
`;

const ControllerWrapper = styled(Flex)`
	width: 100%;
	padding: 10px 16px;
`;

const Controller = styled(Flex)`
	border-radius: 8px;
	background-color: ${neutralColors.gray[300]};
	cursor: pointer;
	pointer-events: auto;
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

const OptionWrapper = styled(Flex)`
	padding: 8px 16px;
	border-radius: 8px;
	margin-bottom: 8px;
	align-items: center;
	cursor: pointer;
	&:hover {
		background-color: ${neutralColors.gray[200]};
	}
`;
