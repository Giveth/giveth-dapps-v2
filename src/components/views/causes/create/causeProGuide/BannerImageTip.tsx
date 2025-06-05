import { P, Flex } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { TipLine, TipListItem } from './common.styles';

const BannerImageTip = () => {
	const { formatMessage } = useIntl();
	return (
		<Flex $flexDirection='column' gap='16px'>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.cause.choose_an_image',
					})}
				</P>
			</TipListItem>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.high_quality_clear_images_attract_more_attention_and',
					})}
				</P>
			</TipListItem>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.cause.include_custom_logo_or_graphic',
					})}
				</P>
			</TipListItem>
			<TipLine />
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.suggested_image_size',
					})}
				</P>
				<P>(W: 960px) x (H: 600px)</P>
			</TipListItem>
		</Flex>
	);
};

export default BannerImageTip;
