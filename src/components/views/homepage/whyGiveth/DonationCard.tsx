import { FC } from 'react';
import styled from 'styled-components';
import {
	B,
	IconArrowRight,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { shortenAddress } from '@/lib/helpers';

interface IDonationCard {
	address: string;
	amount: string;
	projectTitle: string;
}

const DonationCard: FC<IDonationCard> = props => {
	const { address, amount, projectTitle } = props;
	return (
		<CardContainer>
			<Section>
				<B>{'@' + shortenAddress(address)}</B>
				<div>donated</div>
				<Amount>{'~$' + Number(amount).toFixed(1)}</Amount>
			</Section>
			<Section>
				<Arrow>
					<IconArrowRight />
				</Arrow>
				<Title>{projectTitle}</Title>
			</Section>
		</CardContainer>
	);
};

const Section = styled(Flex)`
	gap: 8px;
	align-items: center;
	width: max-content;
`;

const Arrow = styled(Flex)`
	margin: 0 3px;
	color: ${neutralColors.gray[900]};
`;

const Title = styled(B)`
	color: ${neutralColors.gray[900]};
`;

const Amount = styled(B)`
	padding: 0 8px;
	border-radius: 4px;
	background: ${neutralColors.gray[300]};
`;

const CardContainer = styled(Flex)`
	color: ${neutralColors.gray[700]};
	padding: 8px 24px;
	border-radius: 12px;
	border: 1px solid ${neutralColors.gray[300]};
	gap: 8px;
	flex-direction: column;
	width: 100%;
	${mediaQueries.tablet} {
		border-radius: 100px;
		flex-direction: row;
	}
`;

export default DonationCard;
