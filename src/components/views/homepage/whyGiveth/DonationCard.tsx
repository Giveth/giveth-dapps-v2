import { FC } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';

interface IDonationCard {
	address: string;
	amount: string;
	projectTitle: string;
}

const DonationCard: FC<IDonationCard> = props => {
	const { address, amount, projectTitle } = props;
	return (
		<CardContainer>
			<div>{address}</div>
			<div>{amount}</div>
			<div>{projectTitle}</div>
		</CardContainer>
	);
};

const CardContainer = styled(Flex)`
	padding: 8px 24px;
	border-radius: 100px;
	border: 1px solid ${neutralColors.gray[300]};
`;

export default DonationCard;
