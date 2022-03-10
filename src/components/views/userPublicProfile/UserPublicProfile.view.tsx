import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import Image from 'next/image';
import {
	brandColors,
	Container,
	GLink,
	H3,
	IconExternalLink,
	Lead,
	neutralColors,
	H5,
	Caption,
	Button,
} from '@giveth/ui-design-system';

import { CopyToClipboard } from '@/components/CopyToClipboard';
import { WelcomeSigninModal } from '@/components/modals/WelcomeSigninModal';
import PublicProfileContributes from './PublicProfileContributes';
import { IUser, IProject } from '@/apollo/types/types';
import { networksParams } from '@/helpers/blockchain';
import EditUserModal from '@/components/modals/EditUserModal';
import { Flex } from '@/components/styled-components/Flex';
import useUser from '@/context/UserProvider';
import { isUserRegistered } from '@/lib/helpers';

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
	close: () => void;
}
const IncompleteProfileToast = ({ close }: IIncompleteToast) => {
	const {
		actions: { showCompleteProfile },
	} = useUser();

	return (
		<IncompleteToast>
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
					onClick={showCompleteProfile}
				/>
				<img
					onClick={close}
					src='/images/x-icon-mustard.svg'
					width='16px'
					height='16px'
				/>
			</LetsDoIt>
		</IncompleteToast>
	);
};

export const NothingToSee = ({ title, heartIcon }: IEmptyBox) => {
	return (
		<NothingBox>
			<Image
				width='100%'
				height='100%'
				src={
					heartIcon
						? '/images/heart-white.svg'
						: '/images/empty-box.svg'
				}
				alt='nothing'
			/>
			<Lead>{title}</Lead>
		</NothingBox>
	);
};

const UserPublicProfileView: FC<IUserPublicProfileView> = ({
	user,
	myAccount,
}) => {
	const {
		state: { isSignedIn },
	} = useUser();
	const { chainId } = useWeb3React();
	const [showWelcomeSignin, setShowWelcomeSignin] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false); // follow this state to refresh user content on screen
	const [showIncompleteWarning, setShowIncompleteWarning] = useState(true);

	useEffect(() => {
		myAccount && setShowWelcomeSignin(!isSignedIn);
	}, [user, isSignedIn]);

	if (!user || (myAccount && !isSignedIn))
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
			{!isUserRegistered(user) && showIncompleteWarning && (
				<IncompleteProfileToast
					close={() => setShowIncompleteWarning(false)}
				/>
			)}
			<PubliCProfileHeader>
				<Container>
					<UserInfoWithAvatarRow>
						<Image
							src={user.avatar || '/images/avatar.svg'}
							width={128}
							height={128}
							alt={user.name}
						/>
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

const PubliCProfileHeader = styled.div`
	padding: 180px 0 32px;
	background-color: ${neutralColors.gray[100]};
`;

const UserInfoWithAvatarRow = styled(Flex)`
	gap: 24px;
`;

const PinkLink = styled(GLink)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

const UserInforRow = styled(Flex)`
	flex-direction: column;
	flex: 1;
	justify-content: space-between;
	align-items: flex-start;
`;

const WalletContainer = styled(Flex)`
	gap: 18px;
`;

const WalletIconsContainer = styled.div`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

const IncompleteToast = styled.div`
	width: 100%;
	max-width: 1214px;
	position: absolute;
	top: 90px;
	left: 0;
	right: 0;
	margin: 0 auto;
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

const NoUserContainer = styled.div`
	padding: 200px;
`;
