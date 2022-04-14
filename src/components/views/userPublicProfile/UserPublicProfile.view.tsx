import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import Image from 'next/image';
import {
	brandColors,
	Button,
	Caption,
	GLink,
	H3,
	H5,
	IconAlertTriangle,
	IconExternalLink,
	IconX,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';

import { mediaQueries } from '@/lib/constants/constants';
import { CopyToClipboard } from '@/components/CopyToClipboard';
import PublicProfileContributes from './PublicProfileContributes';
import { IProject, IUser } from '@/apollo/types/types';
import { networksParams } from '@/helpers/blockchain';
import EditUserModal from '@/components/modals/EditUserModal';
import { Flex } from '@/components/styled-components/Flex';
import useUser from '@/context/UserProvider';
import { isUserRegistered } from '@/lib/helpers';
import { Container } from '@/components/Grid';
import useModal from '@/context/ModalProvider';
import { EDirection } from '@/apollo/types/gqlEnums';

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
	} = useModal();

	return (
		<IncompleteToast>
			<IncompleteProfile>
				<IconAlertTriangle size={16} color={brandColors.mustard[700]} />
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
				<div onClick={close}>
					<IconX size={16} color={brandColors.mustard[700]} />
				</div>
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

	const {
		actions: { showSignWithWallet },
	} = useModal();

	const { chainId } = useWeb3React();
	const [showModal, setShowModal] = useState<boolean>(false); // follow this state to refresh user content on screen
	const [showIncompleteWarning, setShowIncompleteWarning] = useState(true);

	useEffect(() => {
		if (myAccount && !isSignedIn) {
			showSignWithWallet();
		}
	}, [user, isSignedIn]);

	if (!user || (myAccount && !isSignedIn))
		return (
			<>
				<NoUserContainer>
					<H5>Not logged in</H5>
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
								<AddressContainer>
									<AddressText size='Big'>
										{user.walletAddress}
									</AddressText>
									<AddressContainer>
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
									</AddressContainer>
								</AddressContainer>
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
	${mediaQueries.mobileS} {
		flex-direction: column;
	}
	${mediaQueries.tablet} {
		flex-direction: row;
	}
	${mediaQueries.laptop} {
		flex-direction: row;
	}
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
	${mediaQueries.mobileS} {
		align-items: center;
	}
	${mediaQueries.tablet} {
		align-items: flex-start;
	}
	${mediaQueries.laptop} {
		align-items: flex-start;
	}
`;

const WalletContainer = styled(Flex)`
	gap: 18px;
	flex-direction: column;

	${mediaQueries.mobileS} {
		flex-direction: column;
		align-items: center;
		margin-top: 16px;
		gap: 0;
	}
	${mediaQueries.tablet} {
		flex-direction: row;
		margin-top: 0;
	}
	${mediaQueries.laptop} {
		flex-direction: row;
		margin-top: 0;
	}
`;

const AddressText = styled(GLink)`
	${mediaQueries.mobileS} {
		max-width: 250px;
		overflow: auto;
		margin: 0 5px;
	}
	${mediaQueries.tablet} {
		max-width: 500px;
	}
`;

const AddressContainer = styled(WalletContainer)`
	flex-direction: row;
	margin: 0;
	${mediaQueries.mobileS} {
		align-items: center;
		justify-content: center;
		gap: 5px;
	}
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
	> :last-child {
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
