import React, { FC } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Flex } from '@giveth/ui-design-system';
import { IAdminUser } from '@/apollo/types/types';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';
import { shortenAddress } from '@/lib/helpers';
import { PFP } from './PFP';
import { addressToUserView } from '@/lib/routeCreators';

interface IUserWithPFPInCell {
	user: IAdminUser;
}

export const UserWithPFPInCell: FC<IUserWithPFPInCell> = ({ user }) => {
	const pfpToken = useGiverPFPToken(user?.walletAddress, user?.avatar);
	const userProfileLink =
		addressToUserView(user?.walletAddress?.toLowerCase()) || '';
	const name =
		user?.name ||
		shortenAddress(user?.walletAddress?.toLowerCase()) ||
		'\u200C';
	return pfpToken ? (
		<Flex gap='12px' $alignItems='center'>
			<StyledPFP pfpToken={pfpToken} />
			<Link href={userProfileLink}>{name}</Link>
		</Flex>
	) : (
		<NoAvatar>
			<Link href={userProfileLink}>{name}</Link>
		</NoAvatar>
	);
};
const StyledPFP = styled(PFP)`
	margin-top: 5px;
	margin-left: 5px;
`;

const NoAvatar = styled.span`
	padding-left: 44px;
`;
