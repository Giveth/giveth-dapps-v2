import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Image from 'next/image';

import {
	brandColors,
	GLink,
	H3,
	H5,
	IconExternalLink,
	neutralColors,
	Container,
	IconExternalLink16,
	Flex,
	FlexCenter,
} from '@giveth/ui-design-system';
import { useRouter } from 'next/router';
import config from '@/configuration';

import {
	PROFILE_PHOTO_PLACEHOLDER,
	mediaQueries,
} from '@/lib/constants/constants';
import ProfileContributes from './ProfileContributes';
import EditUserModal from '@/components/modals/EditUserModal';
import {
	formatWalletLink,
	isUserRegistered,
	shortenAddress,
} from '@/lib/helpers';
import ExternalLink from '@/components/ExternalLink';
import IncompleteProfileToast from '@/components/views/userProfile/IncompleteProfileToast';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import UploadProfilePicModal from '@/components/modals/UploadProfilePicModal/UploadProfilePicModal';
import Routes, { ProfileModal } from '@/lib/constants/Routes';
import { removeQueryParamAndRedirect } from '@/helpers/url';
import { useGiverPFPToken } from '@/hooks/useGiverPFPToken';
import { EPFPSize, PFP } from '@/components/PFP';
import { gqlRequest } from '@/helpers/requests';
import { buildUsersPfpInfoQuery } from '@/lib/subgraph/pfpQueryBuilder';
import { IGiverPFPToken } from '@/apollo/types/types';
import { useProfileContext } from '@/context/profile.context';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import VerifyEmailBanner from './VerifyEmailBanner';

export interface IUserProfileView {}

const UserProfileView: FC<IUserProfileView> = () => {
	const router = useRouter();

	const [showModal, setShowModal] = useState<boolean>(false); // follow this state to refresh user content on screen
	const [showUploadProfileModal, setShowUploadProfileModal] = useState(false);
	const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

	const dispatch = useAppDispatch();
	const { isSignedIn } = useAppSelector(state => state.user);
	const { formatMessage } = useIntl();
	const [pfpData, setPfpData] = useState<IGiverPFPToken[]>();
	const { walletChainType, chain } = useGeneralWallet();
	const { user, myAccount } = useProfileContext();
	const pfpToken = useGiverPFPToken(user?.walletAddress, user?.avatar);

	const showCompleteProfile =
		user && !isUserRegistered(user) && showIncompleteWarning && myAccount;

	// Update the modal state if the query changes
	useEffect(() => {
		setShowModal(!!router.query.opencheck);
	}, [router.query.opencheck]);

	useEffect(() => {
		if (user && !isUserRegistered(user) && myAccount) {
			setShowIncompleteWarning(true);
		}
	}, [user]);

	useEffect(() => {
		if (myAccount && !isSignedIn) {
			dispatch(setShowSignWithWallet(true));
		}
	}, [dispatch, isSignedIn, myAccount]);

	useEffect(() => {
		if (router.query.modal === ProfileModal.PFPModal) {
			setShowUploadProfileModal(true);
			removeQueryParamAndRedirect(router, ['modal']);
		}
	}, [router.query.modal]);

	useEffect(() => {
		const fetchPFPInfo = async (walletAddress: string) => {
			try {
				if (!config.MAINNET_CONFIG.subgraphAddress) {
					throw new Error('Subgraph address not found');
				}
				const query = buildUsersPfpInfoQuery([walletAddress]);
				const { data } = await gqlRequest(
					config.MAINNET_CONFIG.subgraphAddress,
					false,
					query,
				);
				if (
					data[`user_${walletAddress}`] &&
					data[`user_${walletAddress}`].length > 0
				) {
					setPfpData(data[`user_${walletAddress}`]);
				}
			} catch (e) {
				console.error(e);
			}
		};
		if (user?.walletAddress) {
			fetchPFPInfo(user?.walletAddress);
		}
	}, [user]);

	if (myAccount && !isSignedIn)
		return (
			<NoUserContainer>
				<H5>{formatMessage({ id: 'label.please_sign_in' })}</H5>
			</NoUserContainer>
		);
	return (
		<>
			{user &&
				myAccount &&
				(user.projectsCount ?? 0) > 0 &&
				!user?.isEmailVerified && (
					<VerifyEmailBanner setShowModal={setShowModal} />
				)}
			<ProfileHeader>
				<Container>
					{showCompleteProfile && (
						<IncompleteProfileToast
							close={() => setShowIncompleteWarning(false)}
						/>
					)}
					<UserInfo>
						{pfpToken ? (
							<PFP pfpToken={pfpToken} size={EPFPSize.LARGE} />
						) : (
							<StyledImage
								src={user?.avatar || PROFILE_PHOTO_PLACEHOLDER}
								alt={user?.name as string}
								width={180}
								height={180}
							/>
						)}
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
										{user?.walletAddress}
									</AddressTextNonMobile>
									<AddressTextMobile size='Big'>
										{shortenAddress(user?.walletAddress)}
									</AddressTextMobile>
									<ExternalLink
										href={formatWalletLink(
											walletChainType,
											chain,
											user?.walletAddress,
										)}
										color={brandColors.pinky[500]}
									>
										<IconExternalLink />
									</ExternalLink>
								</AddressContainer>
							</WalletContainer>
							{/* check pfp data, if truthy we check if user is looking at their account, 
							based on this we show two different messages and links relating to pfp use on profile page  */}
							{pfpData &&
								(myAccount && !pfpToken ? (
									<RaribleLinkContainer>
										<GLink>
											<a href={Routes.MyAccountSetPfp}>
												{' '}
												Set your Givers PFP NFT{' '}
											</a>
										</GLink>
									</RaribleLinkContainer>
								) : (
									pfpToken && (
										<RaribleLinkContainer>
											<a
												href={
													config.RARIBLE_ADDRESS +
													'token/' +
													pfpToken?.id.replace(
														'-',
														':',
													)
												}
												target='_blank'
												rel='noreferrer'
											>
												<GLink>
													View this Givers PFP on
													Rarible{' '}
													<IconExternalLink16 />
												</GLink>
											</a>
										</RaribleLinkContainer>
									)
								))}
						</UserInfoRow>
					</UserInfo>
				</Container>
			</ProfileHeader>
			<ProfileContributes />
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
	${mediaQueries.tablet} {
		justify-content: flex-start;
		flex-direction: row;
	}
`;

const StyledImage = styled(Image)`
	border-radius: 16px;
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

const RaribleLinkContainer = styled.div`
	margin-top: 16px;
	color: ${brandColors.pinky[500]};
`;

export default UserProfileView;
