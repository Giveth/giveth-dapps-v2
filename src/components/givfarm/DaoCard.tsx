import React from 'react';
import links from '@/lib/constants/links';
import {
	DaoCardButton,
	DaoCardContainer,
	DaoCardQuote,
	DaoCardTitle,
} from './DaoCard.sc';

export const DaoCard = () => {
	return (
		<DaoCardContainer>
			<DaoCardTitle weight={900}>Add Your DAO</DaoCardTitle>
			<DaoCardQuote size='small'>
				Apply to kickstart a RegenFarm for your for-good DAO
			</DaoCardQuote>
			<DaoCardButton
				label='APPLY NOW'
				linkType='primary'
				href={links.JOINGIVFRENS}
				target='_blank'
			/>
		</DaoCardContainer>
	);
};
