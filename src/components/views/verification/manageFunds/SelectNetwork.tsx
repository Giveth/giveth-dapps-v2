import React, { ComponentType, FC } from 'react';
import {
	neutralColors,
	B,
	IconCaretUp,
	IconCaretDown,
	brandColors,
	IconCheck,
	GLink,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Select, {
	components,
	OptionProps,
	StylesConfig,
	DropdownIndicatorProps,
	GroupBase,
} from 'react-select';
import { FieldError } from 'react-hook-form';

import { ISelectedNetwork } from '@/components/views/verification/manageFunds/types';
import selectCustomStyles from '@/lib/constants/selectCustomStyles';
import NetworkLogo from '@/components/NetworkLogo';

declare module 'react-select/dist/declarations/src/Select' {
	export interface Props<
		Option,
		IsMulti extends boolean,
		Group extends GroupBase<Option>,
	> {
		hasError?: boolean;
	}
}

interface IProps {
	networkOptions?: ISelectedNetwork[];
	onChange: (i: ISelectedNetwork) => void;
	selectedNetwork?: ISelectedNetwork;
	error?: FieldError;
}

const SelectNetwork: FC<IProps> = ({
	networkOptions,
	onChange,
	selectedNetwork,
	error,
}) => {
	return (
		<>
			<Select
				components={{
					DropdownIndicator,
					Option: (props: any) => <Option {...props} />,
				}}
				value={selectedNetwork}
				onChange={(e: any) => onChange(e)}
				options={networkOptions}
				styles={selectStyles}
				hasError={!!error}
				placeholder='Select chain'
			/>
			{error?.message && (
				<InputValidation size='Small'>{error?.message}</InputValidation>
			)}
		</>
	);
};

const DropdownIndicator: ComponentType<DropdownIndicatorProps> = props => {
	return props.selectProps.menuIsOpen ? <IconCaretUp /> : <IconCaretDown />;
};

const Option: ComponentType<OptionProps<ISelectedNetwork>> = props => {
	const { data, isSelected } = props;
	const { label, id } = data;
	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer>
					<NetworkLogo chainId={id} logoSize={40} />
					<B>{label}</B>
				</RowContainer>
				{isSelected && <IconCheck color={brandColors.giv[500]} />}
			</OptionContainer>
		</components.Option>
	);
};

const selectStyles: StylesConfig = {
	...selectCustomStyles,
	placeholder: styles => ({
		...styles,
		color: neutralColors.gray[900],
		fontSize: '16px',
		fontWeight: 500,
	}),
	indicatorSeparator: styles => ({
		...styles,
		display: 'none',
	}),
};

const InputValidation = styled(GLink)`
	padding-top: 4px;
	display: block;
	color: ${semanticColors.punch[500]};
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
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export default SelectNetwork;
