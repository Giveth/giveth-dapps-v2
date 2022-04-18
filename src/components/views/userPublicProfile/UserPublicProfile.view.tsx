import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import Image from 'next/image';
import {
	brandColors,
	GLink,
	H3,
	H5,
	IconExternalLink,
	neutralColors,
} from '@giveth/ui-design-system';

import { mediaQueries } from '@/lib/constants/constants';
import PublicProfileContributes from './PublicProfileContributes';
import { IUser } from '@/apollo/types/types';
import EditUserModal from '@/components/modals/EditUserModal';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import useUser from '@/context/UserProvider';
import { formatWalletLink, isUserRegistered } from '@/lib/helpers';
import { Container } from '@/components/Grid';
import useModal from '@/context/ModalProvider';
import { EDirection } from '@/apollo/types/gqlEnums';
import ExternalLink from '@/components/ExternalLink';
import IncompleteProfileToast from '@/components/views/userPublicProfile/IncompleteProfileToast';

export enum EOrderBy {
	TokenAmount = 'TokenAmount',
	UsdAmount = 'UsdAmount',
	CreationDate = 'CreationDate',
	Donations = 'Donations',
}

export interface IOrder {
	by: EOrderBy;
	direction: EDirection;
}

export interface IUserPublicProfileView {
	user: IUser;
	myAccount?: boolean;
}

const UserPublicProfileView: FC<IUserPublicProfileView> = ({
	user,
	myAccount,
}) => {
	const {
		state: { isSignedIn },
	} = useUser();

	const {
		actions: { showSignWithWallet },
	} = useModal();

	const { chainId } = useWeb3React();

	const [showModal, setShowModal] = useState<boolean>(false); // follow this state to refresh user content on screen
	const [showIncompleteWarning, setShowIncompleteWarning] = useState(true);
	const notUserRegisteredAndShowIncompleteWarning =
		!isUserRegistered(user) && showIncompleteWarning;
	useEffect(() => {
		if (myAccount && !isSignedIn) {
			showSignWithWallet();
		}
	}, [user, isSignedIn]);

	if (!user || (myAccount && !isSignedIn))
		return (
			<NoUserContainer>
				<H5>Not logged in</H5>
			</NoUserContainer>
		);

	return (
		<>
			{notUserRegisteredAndShowIncompleteWarning && (
				<IncompleteProfileToast
					close={() => setShowIncompleteWarning(false)}
				/>
			)}
			<PublicProfileHeader>
				<ContainerStyled
					hasMarginTop={notUserRegisteredAndShowIncompleteWarning}
				>
					<Image
						src={user.avatar || '/images/avatar.svg'}
						width={128}
						height={128}
						alt={user.name}
					/>
					<UserInfoRow>
						<H3 weight={700}>{user.name}</H3>
						{user.email && <GLink size='Big'>{user.email}</GLink>}
						<WalletContainer>
							{myAccount && user?.name && user?.email && (
								<PinkLink
									size='Big'
									onClick={() => setShowModal(true)}
								>
									Edit Profile
								</PinkLink>
							)}
							<AddressContainer>
								<AddressText size='Big'>
									{user.walletAddress}
								</AddressText>
								<ExternalLink
									href={formatWalletLink(
										chainId,
										user.walletAddress,
									)}
									color={brandColors.pinky[500]}
								>
									<IconExternalLink />
								</ExternalLink>
							</AddressContainer>
						</WalletContainer>
					</UserInfoRow>
				</ContainerStyled>
			</PublicProfileHeader>
			<PublicProfileContributes user={user} myAccount={myAccount} />
			{showModal && (
				<EditUserModal setShowModal={setShowModal} user={user} />
			)}
		</>
	);
};

const ContainerStyled = styled(Container)<{ hasMarginTop: boolean }>`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 24px;
	flex-direction: column;
	margin-top: ${props => (props.hasMarginTop ? '60px' : '0px')};
	> :first-child {
		border-radius: 32px;
	}
	${mediaQueries.tablet} {
		justify-content: flex-start;
		margin-top: 0;
		flex-direction: row;
	}
`;

const PublicProfileHeader = styled.div`
	padding-top: 180px;
	padding-bottom: 32px;
	background-color: ${neutralColors.gray[100]};
`;

const PinkLink = styled(GLink)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

const UserInfoRow = styled.div`
	text-align: center;
	> :first-child {
		margin-bottom: 16px;
	}
	${mediaQueries.tablet} {
		text-align: left;
	}
`;

const WalletContainer = styled(Flex)`
	flex-direction: column;
	align-items: center;
	margin-top: 16px;
	gap: 16px;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const AddressText = styled(GLink)`
	max-width: 250px;
	overflow: auto;
	margin: 0 5px;
	${mediaQueries.tablet} {
		max-width: 500px;
	}
`;

const AddressContainer = styled(FlexCenter)`
	gap: 5px;
`;

const NoUserContainer = styled.div`
	padding: 200px;
`;

export default UserPublicProfileView;
