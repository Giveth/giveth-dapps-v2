import { FC } from 'react';
import styled from 'styled-components';
import { B, H5 } from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';
import { formatPrice } from '@/lib/helpers';

interface IProps {
	value: number;
	tokenSymbol: string;
	usdValue?: number;
	title?: string;
}

const DonateSummary: FC<IProps> = props => {
	const { value, tokenSymbol, usdValue, title } = props;
	return (
		<>
			<Amount gap='10px'>
				<H5 weight={700}>
					{formatPrice(value) + ' ' + tokenSymbol + ' ~'}
				</H5>
				<b>{formatPrice(usdValue) + ' USD'}</b>
			</Amount>
			<Amount gap='5px'>
				<div>to</div>
				<B>{title}</B>
			</Amount>
		</>
	);
};

const Amount = styled(FlexCenter)`
	align-items: baseline;
	margin: 12px 0;
`;

export default DonateSummary;
