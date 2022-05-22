import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
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
import {
	formatWalletLink,
	isUserRegistered,
	shortenAddress,
} from '@/lib/helpers';
import { Container } from '@/components/Grid';
import { EDirection } from '@/apollo/types/gqlEnums';
import ExternalLink from '@/components/ExternalLink';
import IncompleteProfileToast from '@/components/views/userPublicProfile/IncompleteProfileToast';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.sclie';

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

const UserPublicProfileView: FC<IUserPublicProfileView> = ({ myAccount }) => {
	const dispatch = useAppDispatch();
	const { isSignedIn } = useAppSelector(state => state.user);
	const userData = useAppSelector(state => state.user.userData);

	const { chainId } = useWeb3React();

	const [showModal, setShowModal] = useState<boolean>(false); // follow this state to refresh user content on screen
	const [showIncompleteWarning, setShowIncompleteWarning] = useState(true);
	const showCompleteProfile =
		!isUserRegistered(userData) && showIncompleteWarning && myAccount;

	useEffect(() => {
		if (myAccount && !isSignedIn) {
			dispatch(setShowSignWithWallet(true));
		}
	}, [userData, isSignedIn]);

	if (!userData || (myAccount && !isSignedIn))
		return (
			<NoUserContainer>
				<H5>Not logged in</H5>
			</NoUserContainer>
		);

	return (
		<>
			<PublicProfileHeader>
				<Container>
					{showCompleteProfile && (
						<IncompleteProfileToast
							close={() => setShowIncompleteWarning(false)}
						/>
					)}
					<UserInfo>
						<img
							src={userData?.avatar || '/images/avatar.svg'}
							width={128}
							height={128}
							alt={userData?.name}
						/>
						<UserInfoRow>
							<H3 weight={700}>{userData?.name}</H3>
							{userData?.email && (
								<GLink size='Big'>{userData?.email}</GLink>
							)}
							<WalletContainer>
								{myAccount &&
									userData?.name &&
									userData?.email && (
										<EditProfile
											size='Big'
											onClick={() => setShowModal(true)}
										>
											Edit Profile
										</EditProfile>
									)}
								<AddressContainer>
									<AddressTextNonMobile size='Big'>
										{userData?.walletAddress}
									</AddressTextNonMobile>
									<AddressTextMobile size='Big'>
										{shortenAddress(
											userData?.walletAddress,
										)}
									</AddressTextMobile>
									<ExternalLink
										href={formatWalletLink(
											chainId,
											userData?.walletAddress,
										)}
										color={brandColors.pinky[500]}
									>
										<IconExternalLink />
									</ExternalLink>
								</AddressContainer>
							</WalletContainer>
						</UserInfoRow>
					</UserInfo>
				</Container>
			</PublicProfileHeader>
			<PublicProfileContributes user={userData} myAccount={myAccount} />
			{showModal && (
				<EditUserModal setShowModal={setShowModal} user={userData} />
			)}
		</>
	);
};

const UserInfo = styled(FlexCenter)`
	gap: 24px;
	margin-top: 32px;
	flex-direction: column;
	> :first-child {
		border-radius: 32px;
	}
	${mediaQueries.tablet} {
		justify-content: flex-start;
		flex-direction: row;
	}
`;

const PublicProfileHeader = styled.div`
	padding-top: 120px;
	padding-bottom: 32px;
	background-color: ${neutralColors.gray[100]};
`;

const EditProfile = styled(GLink)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	flex-shrink: 0;
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

const AddressTextNonMobile = styled(GLink)`
	display: none;
	${mediaQueries.mobileL} {
		margin: 0 5px;
		max-width: 500px;
		display: unset;
	}
`;

const AddressTextMobile = styled(GLink)`
	${mediaQueries.mobileL} {
		display: none;
	}
`;

const AddressContainer = styled(FlexCenter)`
	gap: 5px;
`;

const NoUserContainer = styled.div`
	padding: 200px;
`;

export default UserPublicProfileView;
