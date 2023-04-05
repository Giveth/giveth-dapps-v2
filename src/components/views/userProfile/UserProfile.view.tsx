import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import {
	brandColors,
	GLink,
	H3,
	H5,
	IconExternalLink,
	neutralColors,
} from '@giveth/ui-design-system';

import { Container } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';
import ProfileContributes from './ProfileContributes';
import { IUser } from '@/apollo/types/types';
import EditUserModal from '@/components/modals/EditUserModal';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import {
	formatWalletLink,
	isUserRegistered,
	shortenAddress,
} from '@/lib/helpers';
import { EDirection } from '@/apollo/types/gqlEnums';
import ExternalLink from '@/components/ExternalLink';
import IncompleteProfileToast from '@/components/views/userProfile/IncompleteProfileToast';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import UploadProfilePicModal from '@/components/modals/UploadProfilePicModal/UploadProfilePicModal';

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

export interface IUserProfileView {
	user: IUser;
	myAccount?: boolean;
}

const UserProfileView: FC<IUserProfileView> = ({ myAccount, user }) => {
	const dispatch = useAppDispatch();
	const { isSignedIn } = useAppSelector(state => state.user);
	const { formatMessage } = useIntl();

	const { chainId } = useWeb3React();

	const [showModal, setShowModal] = useState<boolean>(false); // follow this state to refresh user content on screen
	const [showUploadProfileModal, setShowUploadProfileModal] = useState(false);

	const [showIncompleteWarning, setShowIncompleteWarning] = useState(true);
	const showCompleteProfile =
		!isUserRegistered(user) && showIncompleteWarning && myAccount;

	useEffect(() => {
		if (myAccount && !isSignedIn) {
			dispatch(setShowSignWithWallet(true));
		}
	}, [dispatch, isSignedIn, myAccount]);

	if (myAccount && !isSignedIn)
		return (
			<NoUserContainer>
				<H5>{formatMessage({ id: 'label.please_sign_in' })}</H5>
			</NoUserContainer>
		);

	return (
		<>
			<ProfileHeader>
				<Container>
					{showCompleteProfile && (
						<IncompleteProfileToast
							close={() => setShowIncompleteWarning(false)}
						/>
					)}
					<UserInfo>
						<img
							src={user?.avatar || '/images/avatar.svg'}
							width={128}
							height={128}
							alt={user?.name}
						/>
						<UserInfoRow>
							<H3 weight={700}>{user?.name}</H3>
							{user?.email && (
								<GLink size='Big'>{user?.email}</GLink>
							)}
							<WalletContainer>
								{myAccount && isUserRegistered(user) && (
									<EditProfile
										size='Big'
										onClick={() => setShowModal(true)}
									>
										{formatMessage({
											id: 'label.edit_profile',
										})}
									</EditProfile>
								)}
								<AddressContainer>
									<AddressTextNonMobile size='Big'>
										{user?.walletAddress?.toLowerCase()}
									</AddressTextNonMobile>
									<AddressTextMobile size='Big'>
										{shortenAddress(
											user?.walletAddress?.toLowerCase(),
										)}
									</AddressTextMobile>
									<ExternalLink
										href={formatWalletLink(
											chainId,
											user?.walletAddress?.toLowerCase(),
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
			</ProfileHeader>
			<ProfileContributes user={user} myAccount={myAccount} />
			{showModal && (
				<EditUserModal
					setShowModal={setShowModal}
					user={user}
					setShowProfilePicModal={setShowUploadProfileModal}
				/>
			)}
			{showUploadProfileModal && (
				<UploadProfilePicModal
					setShowModal={setShowUploadProfileModal}
				/>
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

const ProfileHeader = styled.div`
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

export default UserProfileView;
