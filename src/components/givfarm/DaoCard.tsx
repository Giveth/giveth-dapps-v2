import React from 'react';
import { useIntl } from 'react-intl';
import links from '@/lib/constants/links';
import {
	DaoCardButton,
	DaoCardContainer,
	DaoCardQuote,
	DaoCardTitle,
} from './DaoCard.sc';

export const DaoCard = () => {
	const { formatMessage } = useIntl();
	return (
		<DaoCardContainer>
			<DaoCardTitle weight={900}>
				{formatMessage({ id: 'label.add_your_dao' })}
			</DaoCardTitle>
			<DaoCardQuote size='small'>
				{formatMessage({ id: 'label.apply_to_kickstart_a_regenfarm' })}
			</DaoCardQuote>
			<DaoCardButton
				isExternal
				label={formatMessage({ id: 'label.apply_now' })}
				linkType='primary'
				href={links.JOINGIVFRENS}
				target='_blank'
			/>
		</DaoCardContainer>
	);
};
