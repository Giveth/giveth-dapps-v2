import { ComponentType, FC } from 'react';
import {
	neutralColors,
	B,
	IconCaretUp,
	IconCaretDown,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import Select, {
	components,
	OptionProps,
	StylesConfig,
	DropdownIndicatorProps,
} from 'react-select';

import { ISelectedNetwork } from '@/components/views/verification/manageFunds/types';
import selectCustomStyles from '@/lib/constants/selectCustomStyles';

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
					<ImageIcon label={label} />
					<B>{label}</B>
				</RowContainer>
				{isSelected && (
					<Image
						src='/images/checkmark.svg'
						width='10px'
						height='10px'
						alt={label}
					/>
				)}
			</OptionContainer>
		</components.Option>
	);
};

const ImageIcon = (props: { label: string }) => {
	const { label } = props;
	let image_path = '';

	if (label === 'Gnosis') {
		image_path = '/images/currencies/xdai/40.svg';
	} else {
		image_path = '/images/currencies/eth/40.svg';
	}
	return <Image alt={label} src={image_path} width='24px' height='24px' />;
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
