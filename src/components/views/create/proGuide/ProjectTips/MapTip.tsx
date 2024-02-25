import { P } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { Flex } from '@giveth/ui-design-system';
import { TipListItem } from './common.styles';

const MapTip = () => {
	const { formatMessage } = useIntl();
	return (
		<div>
			<Flex $flexDirection='column' gap='16px'>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.providing_location_details_makes_a_personal_connection_with',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.potential_donors_might_resonante_more_with_your_project_if_they',
						})}
					</P>
				</TipListItem>
			</Flex>
		</div>
	);
};

export default MapTip;
