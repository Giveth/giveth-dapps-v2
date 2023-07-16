import {
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useRef,
	useState,
} from 'react';
import styled from 'styled-components';
import { GLink, neutralColors } from '@giveth/ui-design-system';
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
}

export const Dropdown: FC<IDropdownProps> = ({ label, options }) => {
	const [open, setOpen] = useState(false);
	return (
		<Wrapper>
			<Controller onClick={() => setOpen(_open => !_open)}>
				<GLink size='Big'>{label}</GLink>
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
`;

const Controller = styled(Flex)`
	padding: 10px 16px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[300]};
	cursor: pointer;
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
	cursor: pointer;
	&:hover {
		background-color: ${neutralColors.gray[200]};
	}
`;
