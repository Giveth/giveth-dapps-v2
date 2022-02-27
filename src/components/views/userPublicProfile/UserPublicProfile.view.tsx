import {
	brandColors,
	Container,
	GLink,
	H2,
	H3,
	H5,
	IconCopy,
	IconExternalLink,
	Lead,
	neutralColors,
	P,
	Subline,
} from '@giveth/ui-design-system';
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
	if (!userFromContext)
		return (
			<NoUserContainer>
				<H5>Not logged in or user not found</H5>
			</NoUserContainer>
		);
	return (
		<>
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
						{user.avatar ? (
							<img src={user.avatar} alt={user.name} />
						) : (
							<Image
								src='/images/avatar.svg'
								width={128}
								height={128}
								alt='user avatar'
							/>
						)}
						<UserInforRow>
							<H3 weight={700}>{user.name}</H3>
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
								{myAccount && (
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
