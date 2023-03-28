import React, { FC } from 'react';
import { P, brandColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';
import { addressToUserView } from '@/lib/routeCreators';
import { IAdminUser } from '@/apollo/types/types';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';
import { Flex } from '@/components/styled-components/Flex';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';
import { shortenAddress } from '@/lib/helpers';

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
				<Flex gap='8px'>
					<Image
						src={convertIPFSToHTTPS(pfpToken.imageIpfs)}
						width={24}
						height={24}
						alt=''
					/>
					<Author>{name || '\u200C'}</Author>
				</Flex>
			) : (
				<Author>{name || '\u200C'}</Author>
			)}
		</Link>
	);
};

const Author = styled(P)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;
