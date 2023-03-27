import { FC, useEffect, useState } from 'react';
import { GLink, neutralColors, brandColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';
import { addressToUserView, slugToProjectView } from '@/lib/routeCreators';
import { PaddedRow } from './ProjectCard';
import { IAdminUser, IGiverPFPToken } from '@/apollo/types/types';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addAccountToPfpPending } from '@/features/pfp/pfp.slice';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';
import { Flex } from '../styled-components/Flex';

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
	const [pfpToken, setPfpToken] = useState<IGiverPFPToken | null>(null);
	const { List } = useAppSelector(state => state.pfp);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!adminUser.walletAddress || !adminUser.avatar) return;
		const _pfpToken = List[adminUser.walletAddress.toLowerCase()];
		if (_pfpToken === undefined) {
			dispatch(
				addAccountToPfpPending({
					address: adminUser.walletAddress,
					avatar: adminUser.avatar,
				}),
			);
		} else {
			if (_pfpToken !== false) {
				setPfpToken(_pfpToken);
			}
		}
	}, [List, adminUser, adminUser.walletAddress, dispatch]);

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
