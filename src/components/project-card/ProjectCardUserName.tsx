import { FC } from 'react';
import { GLink, neutralColors, brandColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';
import { addressToUserView, slugToProjectView } from '@/lib/routeCreators';
import { PaddedRow } from './ProjectCard';
import { IAdminUser } from '@/apollo/types/types';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';
import { Flex } from '../styled-components/Flex';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';

interface IProjectCardUserName {
	adminUser: IAdminUser;
	slug: string;
	isForeignOrg?: boolean;
	name?: string;
}

export const ProjectCardUserName: FC<IProjectCardUserName> = ({
	adminUser,
	slug,
	isForeignOrg,
	name,
}) => {
	const pfpToken = useGiverPFPToken(
		adminUser?.walletAddress,
		adminUser?.avatar,
	);

	return (
		<PaddedRow style={{ marginTop: '6px' }}>
			{adminUser?.name && !isForeignOrg && (
				<Link
					href={addressToUserView(
						adminUser?.walletAddress?.toLowerCase(),
					)}
				>
					{pfpToken ? (
						<Flex gap='8px'>
							<Image
								src={convertIPFSToHTTPS(pfpToken.imageIpfs)}
								width={24}
								height={24}
								alt=''
							/>
							<Author bold size='Big'>
								{name || '\u200C'}
							</Author>
						</Flex>
					) : (
						<Author size='Big'>{name || '\u200C'}</Author>
					)}
				</Link>
			)}
			<Link href={slugToProjectView(slug)} style={{ flex: 1 }}>
				<Author size='Big'>
					<br />
				</Author>
			</Link>
		</PaddedRow>
	);
};

interface IAuthor {
	bold?: boolean;
}

const Author = styled(GLink)<IAuthor>`
	color: ${neutralColors.gray[700]};
	margin-bottom: 16px;
	display: block;
	&:hover {
		color: ${brandColors.pinky[500]};
	}
	font-weight: ${props => (props.bold ? 500 : 400)};
`;
