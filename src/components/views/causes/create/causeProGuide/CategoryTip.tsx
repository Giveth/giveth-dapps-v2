import { P, Flex } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { TipListItem } from './common.styles';

const CategoryTip = () => {
	const { formatMessage } = useIntl();
	return (
		<Flex $flexDirection='column' gap='16px'>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.cause.select_categories_desc',
					})}
				</P>
			</TipListItem>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.cause.select_categories_desc_2',
					})}
				</P>
			</TipListItem>
		</Flex>
	);
};

export default CategoryTip;
