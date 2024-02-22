import { P } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { TipListItem } from './common.styles';
import { Flex } from '@/components/styled-components/Flex';

const TitleTip = () => {
	const { formatMessage } = useIntl();
	return (
		<div>
			<Flex $flexDirection='column' gap='16px'>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.keep_it_short_and_impactful',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.use_relevant_keywords_that_describe_your_project',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.make_it_unique_and_memorable_to_stand_out_from_other_projects',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.avoid_using_jargon_or_complex_language',
						})}
					</P>
				</TipListItem>
			</Flex>
		</div>
	);
};

export default TitleTip;
