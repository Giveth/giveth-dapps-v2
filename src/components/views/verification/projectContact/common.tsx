import { IconLink, neutralColors } from '@giveth/ui-design-system';
import { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
import Input, { IFormValidations } from '@/components/Input';
import { regexList } from '@/lib/helpers';
import { FlexCenter } from '@/components/styled-components/Flex';
import { RemoveIcon } from '@/components/views/verification/common';

interface IProps {
	setUrl?: (i: string) => void;
	url: string;
	label?: string;
	remove?: () => void;
	setFormValidation?: Dispatch<SetStateAction<IFormValidations | undefined>>;
}

export const WebsiteInput: FC<IProps> = ({
	url,
	setUrl,
	label,
	remove,
	setFormValidation,
}) => {
	return (
		<Container>
			<Input
				label={label || 'Website'}
				placeholder='https://'
				value={url}
				name={label || 'Website'}
				onChange={e => setUrl && setUrl(e.target.value)}
				LeftIcon={<IconLink color={neutralColors.gray[600]} />}
				disabled={!setUrl}
				setFormValidation={setFormValidation}
				validators={
					setUrl && [
						{
							pattern: regexList.url,
							msg: 'Invalid URL',
						},
					]
				}
			/>
			{!setUrl && <RemoveIcon onClick={() => remove && remove()} />}
		</Container>
	);
};

const Container = styled(FlexCenter)`
	gap: 20px;
	> :nth-child(2) {
		margin-top: 0;
	}
`;
