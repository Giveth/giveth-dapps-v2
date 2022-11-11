import { H2, H5 } from '@giveth/ui-design-system';
import { FC } from 'react';
import { ContributeCardBox, ContributeCardTitles } from './ContributeCard.sc';

interface IContributeCard {
	data1: { label: string; value: string | number };
	data2: { label: string; value: string | number };
}

export const ContributeCard: FC<IContributeCard> = ({ data1, data2 }) => {
	return (
		<ContributeCardBox>
			<ContributeCardTitles>{data1.label}</ContributeCardTitles>
			<ContributeCardTitles>{data2.label}</ContributeCardTitles>
			<H2>{data1.value}</H2>
			<H5>{data2.value}</H5>
		</ContributeCardBox>
	);
};
