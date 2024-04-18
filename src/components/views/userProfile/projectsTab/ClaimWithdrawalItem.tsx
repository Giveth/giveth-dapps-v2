import { B, P, neutralColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { utils } from 'ethers';
import { ITokenWithBalance } from '@/hooks/useProjectClaimableDonations';
import { formatDonation, limitFraction } from '@/helpers/number';

interface IClaimWithdrawalItem {
	projectName: string;
	stream: ITokenWithBalance;
	balanceInUsd: number;
}

const ClaimWithdrawalItem = ({
	projectName = '',
	stream,
	balanceInUsd = 0,
}: IClaimWithdrawalItem) => {
	return (
		<Container>
			<P>{`Withdraw to the ${projectName} recipient address`}</P>
			<B>
				{`${limitFraction(
					utils.formatUnits(stream.balance, stream.token.decimals),
					6,
				)} ${
					stream.token.underlyingToken?.symbol
				} ~ ${formatDonation(balanceInUsd)} USD`}
			</B>
		</Container>
	);
};

const Container = styled.div`
	padding: 8px 16px;
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
	text-align: left;
`;

export default ClaimWithdrawalItem;
