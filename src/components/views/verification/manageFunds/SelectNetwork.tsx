import { ComponentType, FC } from 'react';
import {
	neutralColors,
	B,
	IconCaretUp,
	IconCaretDown,
	brandColors,
	IconCheck,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Select, {
	components,
	OptionProps,
	StylesConfig,
	DropdownIndicatorProps,
} from 'react-select';

import { ISelectedNetwork } from '@/components/views/verification/manageFunds/types';
import selectCustomStyles from '@/lib/constants/selectCustomStyles';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconEthereum } from '@/components/Icons/Eth';

interface IProps {
	networkOptions?: ISelectedNetwork[];
	onChange: (i: ISelectedNetwork) => void;
	selectedNetwork?: ISelectedNetwork;
}

const SelectNetwork: FC<IProps> = ({
	networkOptions,
	onChange,
	selectedNetwork,
}) => {
	return (
		<Select
			components={{
				DropdownIndicator,
				Option: (props: any) => <Option {...props} />,
			}}
			value={selectedNetwork}
			onChange={(e: any) => onChange(e)}
			options={networkOptions}
			styles={selectStyles}
			placeholder='Select chain'
		/>
	);
};

const DropdownIndicator: ComponentType<DropdownIndicatorProps> = props => {
	return props.selectProps.menuIsOpen ? <IconCaretUp /> : <IconCaretDown />;
};

const Option: ComponentType<OptionProps<ISelectedNetwork>> = props => {
	const { data, isSelected } = props;
	const { label } = data;
	return (
		<components.Option {...props}>
			<OptionContainer>
				<RowContainer>
					{label === 'Gnosis' ? (
						<IconGnosisChain size={24} />
					) : (
						<IconEthereum size={24} />
					)}
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

export default SelectNetwork;
