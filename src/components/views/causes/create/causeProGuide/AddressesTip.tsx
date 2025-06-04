import { P, Flex } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { TipLine, TipListItem } from './common.styles';

const AddressesTip = () => {
	const { formatMessage } = useIntl();
	return (
		<Flex $flexDirection='column' gap='16px'>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'component.pro_guide.tips.address.item1',
					})}
				</P>
			</TipListItem>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'component.pro_guide.tips.address.item2',
					})}
				</P>
			</TipListItem>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'component.pro_guide.tips.address.item3',
					})}
				</P>
			</TipListItem>
			<TipLine />
			<TipListItem>
				<P>
					{formatMessage({
						id: 'component.pro_guide.tips.address.item4',
					})}
				</P>
			</TipListItem>
		</Flex>
	);
};

export default AddressesTip;
