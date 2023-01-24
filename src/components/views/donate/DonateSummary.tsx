import { FC } from 'react';
import styled from 'styled-components';
import { B, H5 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { FlexCenter } from '@/components/styled-components/Flex';
import { formatPrice, formatUSD } from '@/lib/helpers';

interface IProps {
	value: number;
	tokenSymbol: string;
	usdValue?: number;
	title?: string;
}

const DonateSummary: FC<IProps> = props => {
	const { value, tokenSymbol, usdValue, title } = props;
	const { formatMessage } = useIntl();
	return (
		<>
			<Amount gap='10px'>
				<H5 weight={700}>
					{formatPrice(value) + ' ' + tokenSymbol + ' ~'}
				</H5>
				<b>{(usdValue ? formatUSD(usdValue) : '--') + ' USD'}</b>
			</Amount>
			<Amount gap='5px'>
				<div>{formatMessage({ id: 'label.to_lowercase' })}</div>
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
