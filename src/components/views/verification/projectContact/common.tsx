import { IconLink, neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import Input from '@/components/Input';
import { FlexCenter } from '@/components/styled-components/Flex';
import { RemoveIcon } from '@/components/views/verification/Common';

interface IProps {
	url: string;
	label?: string;
	remove: () => void;
	hideRemoveIcon?: boolean;
}

export const OtherInput: FC<IProps> = ({
	url,
	label,
	remove,
	hideRemoveIcon = false,
}) => {
	return (
		<Container>
			<Input
				label={label}
				placeholder='https://'
				value={url}
				name={label}
				LeftIcon={<IconLink color={neutralColors.gray[600]} />}
				disabled
			/>
			{!hideRemoveIcon && <RemoveIcon onClick={remove} />}
		</Container>
	);
};

const Container = styled(FlexCenter)`
	gap: 20px;
	> :nth-child(2) {
		margin-top: 0;
	}
`;
