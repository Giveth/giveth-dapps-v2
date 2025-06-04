import { P, Flex } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { TipListItem } from './common.styles';

const SocialMediaTip = () => {
	const { formatMessage } = useIntl();
	return (
		<Flex $flexDirection='column' gap='16px'>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'component.pro_guide.tips.social_media.item1',
					})}
				</P>
			</TipListItem>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'component.pro_guide.tips.social_media.item2',
					})}
				</P>
			</TipListItem>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'component.pro_guide.tips.social_media.item3',
					})}
				</P>
			</TipListItem>
		</Flex>
	);
};

export default SocialMediaTip;
