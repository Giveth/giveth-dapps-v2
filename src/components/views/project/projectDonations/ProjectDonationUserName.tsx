import React, { FC } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { IAdminUser } from '@/apollo/types/types';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';
import { Flex } from '@/components/styled-components/Flex';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';
import { shortenAddress } from '@/lib/helpers';

interface IProjectDonationUserName {
	donor: IAdminUser;
}

export const ProjectDonationUserName: FC<IProjectDonationUserName> = ({
	donor,
}) => {
	const pfpToken = useGiverPFPToken(donor?.walletAddress, donor?.avatar);
	const name =
		donor?.name || shortenAddress(donor.walletAddress?.toLowerCase());
	return pfpToken ? (
		<Flex gap='8px'>
			<StyledImage
				src={convertIPFSToHTTPS(pfpToken.imageIpfs)}
				width={24}
				height={24}
				alt=''
				id='pfp-avatar'
			/>
			<Bold>{name || '\u200C'}</Bold>
		</Flex>
	) : (
		<NoAvatar>{name || '\u200C'}</NoAvatar>
	);
};

const StyledImage = styled(Image)`
	margin-left: 8px;
	transition: box-shadow 0.2s ease;
`;

const Bold = styled.span`
	font-weight: 500;
`;

const NoAvatar = styled.span`
	padding-left: 40px;
`;
