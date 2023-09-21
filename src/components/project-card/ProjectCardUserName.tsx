import { FC } from 'react';
import { brandColors, GLink } from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import { addressToUserView, slugToProjectView } from '@/lib/routeCreators';
import { IAdminUser } from '@/apollo/types/types';
import { Flex } from '../styled-components/Flex';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';
import { PFP } from '../PFP';
import { StyledPaddedRow } from './ProjectCard';

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
		<UserNameContainer>
			<StyledPaddedRow>
				{adminUser?.name && !isForeignOrg && (
					<Link
						href={addressToUserView(
							adminUser?.walletAddress?.toLowerCase(),
						)}
					>
						{pfpToken ? (
							<Flex gap='8px' alignItems='center'>
								<PFP pfpToken={pfpToken} />
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
			</StyledPaddedRow>
		</UserNameContainer>
	);
};

interface IAuthor {
	bold?: boolean;
}

const Author = styled(GLink)<IAuthor>`
	color: ${brandColors.pinky[500]};
	display: block;
	font-weight: ${props => (props.bold ? 500 : 400)};
`;

const UserNameContainer = styled.div`
	height: 40px;
`;
