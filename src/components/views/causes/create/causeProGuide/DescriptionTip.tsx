import { P, Flex } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';

const DescriptionTip = () => {
	const { formatMessage } = useIntl();
	return (
		<div>
			<Flex $flexDirection='column' gap='16px'>
				<P>
					{formatMessage({
						id: 'label.cause.create_description_examples_1',
					})}
				</P>
				<P>
					{formatMessage({
						id: 'label.cause.create_description_examples_2',
					})}
				</P>
			</Flex>
		</div>
	);
};

export default DescriptionTip;
