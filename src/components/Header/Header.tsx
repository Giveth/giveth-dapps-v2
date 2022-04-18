import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, GLink } from '@giveth/ui-design-system';

import { Flex } from '@/components/styled-components/Flex';
import { ThemeType } from '@/context/theme.context';
import { formatWeiHelper } from '@/helpers/number';
import { networksParams } from '@/helpers/blockchain';
import {
	ConnectButton,
	HBBalanceLogo,
	HBContainer,
	HBContent,
	HBPic,
	BalanceButton,
	HeaderLinks,
	HeaderLink,
	StyledHeader,
	WalletButton,
	WBInfo,
	WBNetwork,
	SmallCreateProject,
	Logo,
	BackBtn,
	MenuAndButtonContainer,
	CoverLine,
	SmallCreateProjectParent,
	LargeCreateProject,
	MainLogoBtn,
} from './Header.sc';
import { useSubgraph } from '@/context/subgraph.context';
import { RewardMenu } from '@/components/menu/RewardMenu';
import { walletsArray } from '@/lib/wallet/walletTypes';
import MenuWallet from '@/components/menu/MenuWallet';
import { ETheme, useGeneral } from '@/context/general.context';
import { menuRoutes } from '../menu/menuRoutes';
import useUser from '@/context/UserProvider';
import { isUserRegistered, shortenAddress } from '@/lib/helpers';
import HeaderRoutesResponsive from './HeaderResponsiveRoutes';
import Routes from '@/lib/constants/Routes';
import StorageLabel from '@/lib/localStorage';
import useModal from '@/context/ModalProvider';

export interface IHeader {
	theme?: ThemeType;
	show?: boolean;
}

const Header: FC<IHeader> = () => {
	const [showRewardMenu, setShowRewardMenu] = useState(false);
	const [showRewardMenuModal, setShowRewardMenuModal] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showHeader, setShowHeader] = useState(true);
	const [isGIVeconomyRoute, setIsGIVeconomyRoute] = useState(false);
	const [isCreateRoute, setIsCreateRoute] = useState(false);

	const {
		currentValues: { balances },
	} = useSubgraph();
	const {
		state: { user, isEnabled, isSignedIn },
	} = useUser();
	const {
		actions: {
			showWelcomeModal,
			showSignWithWallet,
			showCompleteProfile,
			showWalletModal,
		},
	} = useModal();
	const { chainId, active, activate, account, library } = useWeb3React();
	const { theme } = useGeneral();
	const router = useRouter();

	const showLinks = !isCreateRoute;

	useEffect(() => {
		const selectedWalletName = localStorage.getItem(StorageLabel.WALLET);
		const wallet = walletsArray.find(w => w.value === selectedWalletName);
		if (wallet) {
			activate(wallet.connector);
		}
	}, [activate]);

	useEffect(() => {
		setIsGIVeconomyRoute(router.route.startsWith('/giv'));
		setIsCreateRoute(router.route.startsWith(Routes.CreateProject));
	}, [router.route]);

	useEffect(() => {
		const threshold = 0;
		let lastScrollY = window.pageYOffset;
		let ticking = false;

		const updateScrollDir = () => {
			const scrollY = window.pageYOffset;

			if (Math.abs(scrollY - lastScrollY) < threshold) {
				ticking = false;
				return;
			}
			const show = scrollY <= lastScrollY;
			setShowHeader(show);
			if (!show) {
				setShowRewardMenu(false);
				setShowUserMenu(false);
			}
			lastScrollY = scrollY > 0 ? scrollY : 0;
			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(updateScrollDir);
				ticking = true;
			}
		};

		window.addEventListener('scroll', onScroll);

		return () => window.removeEventListener('scroll', onScroll);
	}, [showHeader]);

	const handleModals = () => {
		if (isGIVeconomyRoute) {
			showWalletModal();
		} else {
			showWelcomeModal();
		}
	};

	const handleCreateButton = () => {
		if (!isEnabled) {
			showWelcomeModal();
		} else if (!isSignedIn) {
			showSignWithWallet();
		} else if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			showCompleteProfile();
		}
	};

	const handleRewardMenuOnLeave = () => {
		if (!showRewardMenuModal) {
			setShowRewardMenu(false);
		}
	};

	return (
		<>
			<StyledHeader
				justifyContent='space-between'
				alignItems='center'
				theme={theme}
				show={showHeader}
			>
				<Flex>
					{isCreateRoute ? (
						<BackBtn onClick={router.back}>
							<Logo>
								<Image
									width='26px'
									height='26px'
									alt='Giveth logo'
									src={`/images/back-2.svg`}
								/>{' '}
							</Logo>
						</BackBtn>
					) : (
						<>
							<MainLogoBtn>
								<Link href={Routes.Home}>
									<a>
										<Logo>
											<Image
												width='48px'
												height='48px'
												alt='Giveth logo'
												src={`/images/logo/logo1.png`}
											/>
										</Logo>
									</a>
								</Link>
							</MainLogoBtn>
							<HeaderRoutesResponsive />
						</>
					)}
				</Flex>
				{showLinks && (
					<HeaderLinks theme={theme}>
						{menuRoutes.map((link, index) => (
							<Link href={link.href[0]} passHref key={index}>
								<HeaderLink
									size='Big'
									theme={theme}
									active={link.href.includes(router.route)}
								>
									{link.title}
								</HeaderLink>
							</Link>
						))}
					</HeaderLinks>
				)}

				<Flex gap='8px'>
					<LargeCreateProject>
						<Button
							label='CREATE A PROJECT'
							size='small'
							buttonType={
								theme === ETheme.Light ? 'primary' : 'secondary'
							}
							onClick={handleCreateButton}
						/>
					</LargeCreateProject>
					<SmallCreateProjectParent>
						<SmallCreateProject
							onClick={handleCreateButton}
							theme={theme}
							label=''
							icon={
								<Image
									src='/images/plus-white.svg'
									width={16}
									height={16}
									alt='create project'
								/>
							}
							linkType={
								theme === ETheme.Light ? 'primary' : 'secondary'
							}
						/>
					</SmallCreateProjectParent>
					{active && account && chainId ? (
						<>
							<MenuAndButtonContainer
								onClick={() => setShowRewardMenu(true)}
								onMouseEnter={() => setShowRewardMenu(true)}
								onMouseLeave={handleRewardMenuOnLeave}
							>
								<BalanceButton outline theme={theme}>
									<HBContainer>
										<HBBalanceLogo
											src={'/images/logo/logo.svg'}
											alt='Profile Pic'
											width={'24px'}
											height={'24px'}
										/>

										<HBContent size='Big'>
											{formatWeiHelper(balances.balance)}
										</HBContent>
									</HBContainer>
									<CoverLine theme={theme} />
								</BalanceButton>
								{showRewardMenu && (
									<RewardMenu
										showWhatIsGIVstreamModal={
											showRewardMenuModal
										}
										setShowWhatIsGIVstreamModal={
											setShowRewardMenuModal
										}
									/>
								)}
							</MenuAndButtonContainer>
							<MenuAndButtonContainer
								onClick={() => setShowUserMenu(true)}
								onMouseEnter={() => setShowUserMenu(true)}
								onMouseLeave={() => setShowUserMenu(false)}
							>
								<WalletButton outline theme={theme}>
									<HBContainer>
										<HBPic
											src={
												user?.avatar
													? user.avatar
													: '/images/placeholders/profile.png'
											}
											alt='Profile Pic'
											width={'24px'}
											height={'24px'}
										/>
										<WBInfo>
											<GLink size='Medium'>
												{user?.name ||
													shortenAddress(account)}
											</GLink>
											<WBNetwork size='Tiny'>
												Connected to{' '}
												{networksParams[chainId]
													? networksParams[chainId]
															.chainName
													: library?._network?.name}
											</WBNetwork>
										</WBInfo>
									</HBContainer>
									<CoverLine theme={theme} />
								</WalletButton>
								{showUserMenu && <MenuWallet />}
							</MenuAndButtonContainer>
						</>
					) : (
						<ConnectButton
							buttonType='primary'
							size='small'
							label={
								isGIVeconomyRoute ? 'CONNECT WALLET' : 'SIGN IN'
							}
							onClick={handleModals}
						/>
					)}
				</Flex>
			</StyledHeader>
		</>
	);
};

export default Header;
