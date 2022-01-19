import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import { formatEther } from '@ethersproject/units';
import { BigNumberish } from '@ethersproject/bignumber';
import defaultUserProfile from '/public//images/default_user_profile.png';
import { Shadow } from '../styled-components/Shadow';
import { FlexCenter } from '../styled-components/Grid';
import Routes from '../../lib/constants/Routes';
import { mediaQueries, shortenAddress } from '../../lib/helpers';
import { networkInfo } from '../../lib/constants/NetworksObj';
import useUser from '@/context/UserProvider';
import links from '@/lib/constants/links';
import {
	GLink,
	brandColors,
	neutralColors,
	Subline,
	P,
	Overline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import WalletModal from '../modals/WalletModal';
import { switchNetwork } from '@/lib/wallet';

const MenuWallet = () => {
	const [showModal, setShowModal] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [balance, setBalance] = useState<string | null>(null);

	const {
		state: { user, isSignedIn },
		actions: { signIn, signOut },
	} = useUser();

	const context = useWeb3React();
	const { chainId, account, library } = context;

	useEffect(() => {
		if (!!account && !!library) {
			library
				.getBalance(account)
				.then((_balance: BigNumberish) => {
					setBalance(parseFloat(formatEther(_balance)).toFixed(3));
				})
				.catch(() => setBalance(null));
		}
	}, [account, library, chainId]);

	const { networkName, networkToken } = networkInfo(chainId);

	return (
		<Wrapper
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			{showModal && (
				<WalletModal
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
			<WalletClosed
				isOpen={isOpen}
				onClick={() => setIsOpen(!isOpen)}
				onMouseEnter={() => setIsOpen(true)}
			>
				<UserAvatar src={defaultUserProfile} />
				<UserDetails>
					<GLink size='Medium' color={brandColors.deep[800]}>
						{user?.name || shortenAddress(account)}
					</GLink>
					<Overline color={brandColors.giv[800]}>
						Connected to {networkName}
					</Overline>
				</UserDetails>
			</WalletClosed>

			<WalletOpened isOpen={isOpen} onMouseLeave={() => setIsOpen(false)}>
				<Title>WALLET</Title>
				<Subtitle>
					<LeftSection>
						{balance + ' '}
						<span>{networkToken}</span>
					</LeftSection>
					<StyledButton onClick={() => setShowModal(true)}>
						Change wallet
					</StyledButton>
				</Subtitle>
				<Title>NETWORK</Title>
				<Subtitle>
					<LeftSection>{networkName}</LeftSection>
					{chainId && (
						<StyledButton onClick={() => switchNetwork(chainId)}>
							Switch network
						</StyledButton>
					)}
				</Subtitle>
				<Menus>
					{walletMenuArray.map(i => (
						<Link href={i.url} key={i.title} passHref>
							<MenuItem>{i.title}</MenuItem>
						</Link>
					))}
					{isSignedIn ? (
						<MenuItem onClick={signOut}>Sign out</MenuItem>
					) : (
						<MenuItem onClick={signIn}>Sign in</MenuItem>
					)}
				</Menus>
			</WalletOpened>
		</Wrapper>
	);
};

const walletMenuArray = [
	{ title: 'My Account', url: Routes.MyAccount },
	{ title: 'My Projects', url: Routes.MyProjects },
	{ title: 'My Donations', url: Routes.MyDonations },
	{ title: 'Create a Project', url: Routes.CreateProject },
	{ title: 'Report a bug', url: links.REPORT_ISSUE },
	{ title: 'Support', url: Routes.Support },
];

const Wrapper = styled.div`
	position: relative;
	z-index: 1000;
	color: ${brandColors.deep[800]};
`;

const MenuItem = styled.a`
	height: 45px;
	line-height: 45px;
	border-top: 2px solid ${neutralColors.gray[300]};
	color: ${brandColors.deep[800]};
	padding: 0 16px;
	font-size: 14px;
	cursor: pointer;

	:hover {
		background: ${neutralColors.gray[200]};
		color: ${brandColors.pinky[500]} !important;
	}
`;

const Menus = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 15px;
	padding: 0 !important;
	border-bottom: 2px solid ${neutralColors.gray[300]};
`;

const UserAvatar = styled(Image)`
	border-radius: 50%;
	width: 24px;
	height: 24px;
`;

const UserDetails = styled.div`
	display: none;

	${mediaQueries.sm} {
		display: unset;
		padding-left: 8px;
		padding-right: 13px;
	}
`;

const WalletClosed = styled(FlexCenter)<{ isOpen: boolean }>`
	position: relative;
	z-index: 1080;
	border-radius: 72px;
	background: white;
	height: 48px;
	box-shadow: ${props => (props.isOpen ? 'none' : Shadow.Dark['500'])};
	padding: 0 12.5px;
	cursor: pointer;
`;

const WalletOpened = styled.div<{ isOpen: boolean }>`
	background: white;
	border-radius: 12px;
	box-shadow: ${Shadow.Dark[500]};
	width: 250px;
	position: absolute;
	right: 0;
	top: 22px;
	z-index: 1070;
	padding: 40px 0 5px 0;
	color: ${brandColors.deep[800]};
	max-height: ${props => (props.isOpen ? '600px' : '0px')};
	transition: max-height 0.25s ease-in, opacity 0.25s ease-in;
	visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
	opacity: ${props => (props.isOpen ? 1 : 0)};

	> * {
		opacity: ${props => (props.isOpen ? 1 : 0)};
		transition: opacity 0.25s ease-in;
		transition-delay: 0.25s;
		padding: 0 16px;
	}
`;

const StyledButton = styled(Subline)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

const LeftSection = styled(P)`
	font-weight: 500;

	> span {
		font-size: 14px;
		font-weight: 400;
	}
`;

const Subtitle = styled(Overline)`
	display: flex;
	justify-content: space-between;
	margin-bottom: 7px;
`;

const Title = styled(Overline)`
	color: ${neutralColors.gray[800]};
	text-transform: uppercase;
	font-weight: 500;
	margin-bottom: 2px;
`;

export default MenuWallet;
