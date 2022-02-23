import {
	brandColors,
	Container,
	GLink,
	H2,
	H3,
	H5,
	IconCopy,
	IconExternalLink,
	neutralColors,
	P,
	Subline,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Row } from '../../styled-components/Grid';
import PublicProfileContributes from './PublicProfileContributes';
import { IUser, IProject } from '@/apollo/types/types';
import { networksParams } from '@/helpers/blockchain';
import { useWeb3React } from '@web3-react/core';

export interface IUserPublicProfileView {
	user: IUser;
	myAccount?: boolean;
}

export interface IUserProfileProjectsView {
	projects: IProject[];
}

const UserPublicProfileView: FC<IUserPublicProfileView> = ({
	user,
	myAccount,
}) => {
	const { chainId } = useWeb3React();
	return (
		<>
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
								<Website
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
								</Website>
							)}
							<WalletContainer>
								<GLink size='Big'>{user.walletAddress}</GLink>
								<WalletIconsContainer
									onClick={() => {
										navigator.clipboard.writeText(
											user.walletAddress || '',
										);
									}}
								>
									<IconCopy />
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

const PubliCProfileHeader = styled.div`
	padding: 173px 0 32px;
	background-color: ${neutralColors.gray[100]};
`;

const UserInfoWithAvatarRow = styled(Row)`
	gap: 24px;
`;

const Website = styled(GLink)`
	color: ${brandColors.pinky[500]};
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
