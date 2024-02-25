import { P } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { Flex } from '@giveth/ui-design-system';
import { TipLine, TipListItem } from './common.styles';

const AddressesTip = () => {
	const { formatMessage } = useIntl();
	return (
		<Flex $flexDirection='column' gap='16px'>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.double_check_your_wallet_address_for_accuracy_to_ensure_proper_fund_transfer',
					})}
				</P>
			</TipListItem>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.use_a_separate_address_for_your_project_this_improves',
					})}
				</P>
			</TipListItem>
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.adding_a_recipient_address_for_more_chains_will_increase_your_potential_donors',
					})}
				</P>
			</TipListItem>
			<TipLine />
			<TipListItem>
				<P>
					{formatMessage({
						id: 'label.you_can_update_your_recipient_addresses_at_any_time',
					})}
				</P>
			</TipListItem>
		</Flex>
	);
};

export default AddressesTip;
