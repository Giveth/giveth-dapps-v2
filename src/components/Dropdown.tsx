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
				<Option key={idx} option={option} />
			))}
		</OptionsWrapper>
	);
};

interface IOptionProps {
	option: IOption;
}

const Option: FC<IOptionProps> = ({ option }) => {
	return (
		<OptionWrapper onClick={() => console.log('Hi babe')}>
			{option.label}
		</OptionWrapper>
	);
};

const Wrapper = styled.div`
	position: relative;
`;

const Controller = styled(Flex)`
	padding: 8px 16px;
	cursor: pointer;
	background-color: ${neutralColors.gray[300]};
`;

const OptionsWrapper = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	/* background-color: ${neutralColors.gray[100]}; */
	background-color: red;
	border-radius: 16px;
	padding: 8px;
	margin-top: 8px;
`;

const OptionWrapper = styled(Flex)``;
