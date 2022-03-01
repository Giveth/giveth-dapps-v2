import {
	brandColors,
	Container,
	GLink,
	Button,
	H3,
	H5,
	IconExternalLink,
	Lead,
	neutralColors,
	Caption,
} from '@giveth/ui-design-system';
import { useRouter } from 'next/router';
import { client } from '@/apollo/apolloClient';
import { GET_USER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { CopyToClipboard } from '@/components/CopyToClipboard';
import { WelcomeSigninModal } from '@/components/modals/WelcomeSigninModal';
import useUser from '@/context/UserProvider';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Row } from '../../styled-components/Grid';
import PublicProfileContributes from './PublicProfileContributes';
import { IUser, IProject } from '@/apollo/types/types';
import { networksParams } from '@/helpers/blockchain';
import { useWeb3React } from '@web3-react/core';
import EditUserModal from '@/components/modals/EditUserModal';

export enum EOrderBy {
	TokenAmount = 'TokenAmount',
	UsdAmount = 'UsdAmount',
	CreationDate = 'CreationDate',
	Donations = 'Donations',
}

export enum EDirection {
	DESC = 'DESC',
	ASC = 'ASC',
}

export interface IOrder {
	by: EOrderBy;
	direction: EDirection;
}

export interface IUserPublicProfileView {
	user: IUser;
	myAccount?: boolean;
}

export interface IUserProfileProjectsView {
	projects: IProject[];
}

export interface IProjectsTable {
	projects: IProject[];
	order: IOrder;
	orderChangeHandler: any;
}

interface IEmptyBox {
	title: string;
	heartIcon?: boolean;
}

interface IIncompleteToast {
	absolute?: boolean;
	close?: any;
}
const IncompleteProfileToast = ({ close, absolute }: IIncompleteToast) => {
	const router = useRouter();
	return (
		<IncompleteToast absolute={absolute}>
			<IncompleteProfile>
				<img src='/images/warning.svg' />
				<div>
					<Caption>Your profile is incomplete</Caption>
					<Caption>
						You can’t create project unless you complete your
						profile.
					</Caption>
				</div>
			</IncompleteProfile>
			<LetsDoIt>
				<Btn
					size='small'
					label="LET'S DO IT"
					buttonType='texty'
					onClick={e => router.push('/onboard')}
				/>
				{absolute && (
					<img
						onClick={close}
						src='/images/x-icon-mustard.svg'
						width='16px'
						height='16px'
					/>
				)}
			</LetsDoIt>
		</IncompleteToast>
	);
};

export const NothingToSee = ({ title, heartIcon }: IEmptyBox) => {
	return (
		<NothingBox>
			<img
				src={
					heartIcon
						? '/images/heart-white.svg'
						: '/images/empty-box.svg'
				}
			/>
			<Lead>{title}</Lead>
		</NothingBox>
	);
};

const UserPublicProfileView: FC<IUserPublicProfileView> = ({
	user: userFromSSR,
	myAccount,
}) => {
	const { chainId } = useWeb3React();
	const [user, setUser] = useState(userFromSSR);
	const [incompleteProfile, setIncompleteProfile] = useState<boolean>(false);
	const [showWelcomeSignin, setShowWelcomeSignin] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false); // follow this state to refresh user content on screen

	const {
		state: { isSignedIn, user: userFromContext },
	} = useUser();

	useEffect(() => {
		const getUser = async () => {
			try {
				if (!userFromContext?.walletAddress) return;
				const { data: userData } = await client.query({
					query: GET_USER_BY_ADDRESS,
					variables: {
						address: userFromContext?.walletAddress,
					},
				});
				setUser(userData?.userByAddress);
			} catch (error) {
				console.log({ error });
			}
		};
		if (myAccount && userFromContext?.id !== user?.id) {
			// fetch new user
			getUser();
		}
		if (userFromContext && myAccount && !isSignedIn) {
			setShowWelcomeSignin(true);
		}
	}, [myAccount, isSignedIn, userFromContext]);

	useEffect(() => {
		setIncompleteProfile(!user?.name || !user?.email);
	}, [user]);

	if (!userFromContext || (myAccount && !isSignedIn))
		return (
			<>
				{showWelcomeSignin && (
					<WelcomeSigninModal
						showModal={true}
						setShowModal={() => setShowWelcomeSignin(false)}
					/>
				)}
				<NoUserContainer>
					<H5>Not logged in or user not found</H5>
				</NoUserContainer>
			</>
		);
	return (
		<>
			{incompleteProfile && user?.name && (
				<IncompleteProfileToast
					absolute={true}
					close={() => setIncompleteProfile(false)}
				/>
			)}
			{showModal && (
				<EditUserModal
					showModal={showModal}
					setShowModal={setShowModal}
					user={user}
				/>
			)}
			{showWelcomeSignin && (
				<WelcomeSigninModal
					showModal={true}
					setShowModal={() => setShowWelcomeSignin(false)}
				/>
			)}
			<PubliCProfileHeader>
				<Container>
					<UserInfoWithAvatarRow>
						<Image
							src={
								user.avatar ? user.avatar : '/images/avatar.svg'
							}
							width={128}
							height={128}
							alt={user.name}
						/>
						<UserInforRow>
							{incompleteProfile && !user?.name && (
								<IncompleteProfileToast
									close={() => setIncompleteProfile(false)}
								/>
							)}
							<H3 weight={700} onClick={() => setShowModal(true)}>
								{user.name}
							</H3>
							{user.url && (
								<PinkLink
									size='Big'
									href={
										user.url
											.toLowerCase()
											.startsWith('http')
											? user.url
											: `https://${user.url}`
									}
								>
									{user.url}
								</PinkLink>
							)}
							<WalletContainer>
								{myAccount && user?.name && user?.email && (
									<PinkLink
										size='Big'
										onClick={() => setShowModal(true)}
									>
										Edit Profile
									</PinkLink>
								)}
								<GLink size='Big'>{user.walletAddress}</GLink>
								<WalletIconsContainer>
									<CopyToClipboard
										text={user.walletAddress || ''}
									/>
								</WalletIconsContainer>

								<WalletIconsContainer
									onClick={() => {
										if (chainId) {
											window.open(
												`${networksParams[chainId].blockExplorerUrls[0]}/address/${user.walletAddress}`,
											);
										}
									}}
								>
									<IconExternalLink />
								</WalletIconsContainer>
							</WalletContainer>
						</UserInforRow>
					</UserInfoWithAvatarRow>
				</Container>
			</PubliCProfileHeader>
			<PublicProfileContributes user={user} myAccount={myAccount} />
		</>
	);
};

export default UserPublicProfileView;

const NothingBox = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	align-items: center;
	color: ${neutralColors.gray[800]};
	font-size: 20px;
	img {
		padding-bottom: 21px;
	}
`;

const NoUserContainer = styled.div`
	padding: 200px;
`;

const PubliCProfileHeader = styled.div`
	padding: 180px 0 32px;
	background-color: ${neutralColors.gray[100]};
`;

const UserInfoWithAvatarRow = styled(Row)`
	gap: 24px;
`;

const PinkLink = styled(GLink)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

const UserInforRow = styled(Row)`
	flex-direction: column;
	flex: 1;
	justify-content: space-between;
	align-items: flex-start;
`;

const WalletContainer = styled(Row)`
	gap: 18px;
`;

const WalletIconsContainer = styled.div`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

const IncompleteToast = styled.div`
	max-width: 1136px;
	width: 100%;
	position: ${(props: IIncompleteToast) =>
		props.absolute ? 'absolute' : 'relative'};
	top: ${(props: IIncompleteToast) => (props.absolute ? '90px' : '0')};
	left: 0;
	right: 0;
	margin-left: auto;
	margin-right: auto;
	background-color: ${brandColors.mustard[200]};
	border: 1px solid ${brandColors.mustard[700]};
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
`;

const IncompleteProfile = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 17px;
	align-items: flex-start;
	div {
		display: flex;
		flex-direction: column;
		color: ${brandColors.mustard[700]};
		padding-left: 8px;
		margin-top: -2px;
	}
	div:first-child {
		font-weight: bold;
	}
`;

const LetsDoIt = styled.div`
	display: flex;
	align-items: flex-start;
	padding-right: 16px;
	margin: 7px 0 0 0;
	button {
		border: none;
		font-weight: bold;
		color: ${brandColors.mustard[700]};
		:hover {
			border: none;
			background: transparent;
			color: ${brandColors.mustard[800]};
		}
	}
	img {
		cursor: pointer;
		margin: 7px 0 0 0;
	}
`;

const Btn = styled(Button)`
	background-color: ${props =>
		props.buttonType === 'secondary' && 'transparent'};
	color: ${props =>
		props.buttonType === 'secondary' && brandColors.pinky[500]};
	border: 2px solid
		${props => props.buttonType === 'secondary' && brandColors.pinky[500]};
	:hover {
		background-color: ${props =>
			props.buttonType === 'secondary' && 'transparent'};
		border: 2px solid
			${props =>
				props.buttonType === 'secondary' && brandColors.pinky[700]};
		color: ${props =>
			props.buttonType === 'secondary' && brandColors.pinky[700]};
	}
`;
