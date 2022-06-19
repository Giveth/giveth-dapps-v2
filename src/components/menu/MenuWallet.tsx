import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { formatEther } from '@ethersproject/units';
import { BigNumberish } from '@ethersproject/bignumber';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
	brandColors,
	neutralColors,
	Subline,
	P,
	Overline,
} from '@giveth/ui-design-system';

import { captureException } from '@sentry/nextjs';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';
import { SignWithWalletModal } from '@/components/modals/SignWithWalletModal';
import { switchNetworkHandler } from '@/lib/wallet';
import { MenuContainer } from './Menu.sc';
import { isUserRegistered, networkInfo } from '@/lib/helpers';
import StorageLabel from '@/lib/localStorage';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowWalletModal,
} from '@/features/modal/modal.slice';
import { signOut } from '@/features/user/user.thunks';
import { ETheme } from '@/features/general/general.sclie';

const MenuWallet = () => {
	const [isMounted, setIsMounted] = useState(false);
	const [balance, setBalance] = useState<string | null>(null);
	const { chainId, account, library } = useWeb3React();
	const [SignWithWallet, setSignWithWallet] = useState<boolean>(false);
	const [queueRoute, setQueueRoute] = useState<string>('');

	const router = useRouter();
	const dispatch = useAppDispatch();
	const { isSignedIn, userData, token } = useAppSelector(state => state.user);
	const theme = useAppSelector(state => state.general.theme);
	const goRoute = (input: {
		url: string;
		requiresSign: boolean;
		requiresRegistration?: boolean;
	}) => {
		const { url, requiresSign, requiresRegistration } = input;
		if (requiresRegistration && !isUserRegistered(userData)) {
			dispatch(setShowCompleteProfile(true));
			if (url === Routes.CreateProject) return;
		}
		if (requiresSign && !isSignedIn) {
			setQueueRoute(url);
			return setSignWithWallet(true);
		}
		router.push(url);
	};

	useEffect(() => {
		if (!!account && !!library) {
			library
				.getBalance(account)
				.then((_balance: BigNumberish) => {
					setBalance(parseFloat(formatEther(_balance)).toFixed(3));
				})
				.catch((error: unknown) => {
					setBalance(null);
					captureException(error, {
						tags: {
							section: 'getBalance',
						},
					});
				});
		}
	}, [account, library, chainId]);

	const { networkName, networkToken } = networkInfo(chainId);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<>
			{SignWithWallet && (
				<SignWithWalletModal
					callback={() => {
						router.push(queueRoute);
						setQueueRoute('');
					}}
					setShowModal={() => {
						setSignWithWallet(false);
						setQueueRoute('');
					}}
				/>
			)}
			<WalletMenuContainer
				isMounted={isMounted}
				theme={theme}
				isSignedIn={isSignedIn || false}
			>
				<Title>WALLET</Title>
				<Subtitle>
					<LeftSection>
						{balance + ' '}
						<span>{networkToken}</span>
					</LeftSection>
					<StyledButton
						onClick={() => {
							window.localStorage.removeItem(StorageLabel.WALLET);
							dispatch(setShowWalletModal(true));
						}}
					>
						Change wallet
					</StyledButton>
				</Subtitle>
				<Title>NETWORK</Title>
				<Subtitle>
					<LeftSection>{networkName}</LeftSection>
					{chainId && (
						<StyledButton
							onClick={() => switchNetworkHandler(chainId)}
						>
							Switch network
						</StyledButton>
					)}
				</Subtitle>
				<Menus>
					{walletMenuArray.map(i => (
						<MenuItem
							key={i.title}
							onClick={() => goRoute(i)}
							theme={theme}
						>
							{i.title}
						</MenuItem>
					))}
					{isSignedIn && (
						<MenuItem
							onClick={() => dispatch(signOut(token!))}
							theme={theme}
						>
							Sign out
						</MenuItem>
					)}
				</Menus>
			</WalletMenuContainer>
		</>
	);
};

const walletMenuArray = [
	{
		title: 'My Account',
		url: Routes.MyAccount,
		requiresSign: true,
	},
	{
		title: 'My Projects',
		url: Routes.MyProjects,
		requiresSign: true,
	},
	{
		title: 'My Donations',
		url: Routes.MyDonations,
		requiresSign: true,
	},
	{
		title: 'Create a Project',
		url: Routes.CreateProject,
		requiresSign: true,
		requiresRegistration: true,
	},
	{ title: 'Report a bug', url: links.REPORT_ISSUE, requiresSign: false },
	{ title: 'Support', url: Routes.Support, requiresSign: false },
];

const MenuItem = styled.a`
	height: 45px;
	line-height: 45px;
	padding: 0 16px;
	font-size: 14px;
	cursor: pointer;
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: neutralColors.gray[800]};
	border-top: 2px solid
		${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[300]
				: neutralColors.gray[300]};
	&:hover {
		background-color: ${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[700]
				: neutralColors.gray[200]};
	}
`;

const Menus = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 15px;
	padding: 0 !important;
	/* border-bottom: 2px solid ${brandColors.giv[300]}; */
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
	/* color: ${neutralColors.gray[800]}; */
	text-transform: uppercase;
	/* font-weight: 500; */
	margin-bottom: 2px;
`;

interface IWalletMenuContainer {
	isSignedIn: boolean;
}

const WalletMenuContainer = styled(MenuContainer)<IWalletMenuContainer>`
	max-height: ${props => (props.isSignedIn ? '470px' : '430px')};
`;

export default MenuWallet;
