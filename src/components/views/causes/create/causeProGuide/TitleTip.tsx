import { P, Flex } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';

const TitleTip = () => {
	const { formatMessage } = useIntl();
	return (
		<div>
			<Flex $flexDirection='column' gap='16px'>
				<P>
					{formatMessage({
						id: 'label.cause.create_title_desc',
					})}
				</P>
			</Flex>
		</div>
	);
};

export default TitleTip;
