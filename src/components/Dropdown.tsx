import {
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useRef,
	useState,
} from 'react';
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
	return (
		<Wrapper>
			<Controller>
				<ControllerWrapper
					justifyContent='space-between'
					onClick={e => {
						setOpen(true);
					}}
					isActive={!open}
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
			{open && <Options options={options} setOpen={setOpen} />}
		</Wrapper>
	);
};

interface IOptionsProps {
	options: IOption[];
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const Options: FC<IOptionsProps> = ({ options, setOpen }) => {
	const ddRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(ddRef, () => setOpen(false));
	return (
		<OptionsWrapper ref={ddRef}>
			{options.map((option, idx) => (
				<Option key={idx} option={option} setOpen={setOpen} />
			))}
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
interface IControllerWrapperProps {
	isActive: boolean;
}

const ControllerWrapper = styled(Flex)<IControllerWrapperProps>`
	// prevent pointer events when dropdown is open
	pointer-events: ${props => (props.isActive ? 'auto' : 'none')};
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
	width: 24px;
	height: 24px;
`;

const OptionsWrapper = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
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
