import React, { FC } from 'react';
import { neutralColors, Lead } from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import { addressToUserView } from '@/lib/routeCreators';
import { IAdminUser } from '@/apollo/types/types';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';
import { Flex } from '@/components/styled-components/Flex';
import { shortenAddress } from '@/lib/helpers';
import { PFP } from '@/components/PFP';

interface IProjectOwnerWithPfpProps {
	user?: IAdminUser;
}

export const ProjectOwnerWithPfp: FC<IProjectOwnerWithPfpProps> = ({
	user,
}) => {
	const pfpToken = useGiverPFPToken(user?.walletAddress, user?.avatar);
	const name =
		user?.name || shortenAddress(user?.walletAddress?.toLowerCase());
	return (
		<Link href={addressToUserView(user?.walletAddress?.toLowerCase())}>
			{pfpToken ? (
				<Flex gap='8px' alignItems='center'>
					<StyledPFP pfpToken={pfpToken} />
					<Author>{name || '\u200C'}</Author>
				</Flex>
			) : (
				<Author>{name || '\u200C'}</Author>
			)}
		</Link>
	);
};

const Author = styled(Lead)`
	color: ${neutralColors.gray[300]};
	cursor: pointer;
`;

const StyledPFP = styled(PFP)`
	margin-top: 5px;
`;
