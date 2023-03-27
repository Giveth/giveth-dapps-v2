import { FC, useEffect } from 'react';
import { GLink, neutralColors, brandColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import { addressToUserView, slugToProjectView } from '@/lib/routeCreators';
import { PaddedRow } from './ProjectCard';
import { IAdminUser } from '@/apollo/types/types';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addAccountToPfpPending } from '@/features/pfp/pfp.slice';

interface IProjectCardUserName {
	adminUser?: IAdminUser;
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
	const { List } = useAppSelector(state => state.pfp);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const pfp = List.find(
			p => p.walletAddress === adminUser?.walletAddress,
		);
		if (pfp) {
			console.log(pfp);
		} else {
			dispatch(addAccountToPfpPending(adminUser?.walletAddress));
		}
	}, [List, adminUser?.walletAddress, dispatch]);

	return (
		<PaddedRow style={{ marginTop: '6px' }}>
			{adminUser?.name && !isForeignOrg && (
				<Link
					href={addressToUserView(
						adminUser?.walletAddress?.toLowerCase(),
					)}
				>
					<Author size='Big'>{name || '\u200C'}</Author>
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

const Author = styled(GLink)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 16px;
	display: block;
	&:hover {
		color: ${brandColors.pinky[500]};
	}
`;
