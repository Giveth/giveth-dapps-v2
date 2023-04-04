import React, { FC } from 'react';
import styled from 'styled-components';
import { IAdminUser } from '@/apollo/types/types';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';
import { Flex } from '@/components/styled-components/Flex';
import { shortenAddress } from '@/lib/helpers';
import { PFP } from './PFP';

interface IUserWithPFPInCell {
	user: IAdminUser;
}

export const UserWithPFPInCell: FC<IUserWithPFPInCell> = ({ user }) => {
	const pfpToken = useGiverPFPToken(user?.walletAddress, user?.avatar);
	const name =
		user?.name || shortenAddress(user.walletAddress?.toLowerCase());
	return pfpToken ? (
		<Flex gap='8px'>
			<StyledPFP pfpToken={pfpToken} />
			<Bold>{name || '\u200C'}</Bold>
		</Flex>
	) : (
		<NoAvatar>{name || '\u200C'}</NoAvatar>
	);
};
const StyledPFP = styled(PFP)`
	margin-left: 8px;
`;

const Bold = styled.span`
	font-weight: 500;
`;

const NoAvatar = styled.span`
	padding-left: 40px;
`;
