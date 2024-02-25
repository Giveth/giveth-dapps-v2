import { P } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { Flex } from '@giveth/ui-design-system';
import { TipListItem } from './common.styles';

const CategoryTip = () => {
	const { formatMessage } = useIntl();
	return (
		<Flex $flexDirection='column' gap='16px'>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.select_the_categories_that_best_represents_the_main',
					})}
				</P>
			</TipListItem>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.think_about_where_your_potential_donors_might_look_for_a_project_like_yours',
					})}
				</P>
			</TipListItem>
		</Flex>
	);
};

export default CategoryTip;
