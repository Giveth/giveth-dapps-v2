import Image from 'next/image';
import { Row } from '@/components/styled-components/Grid';
import { FC, useState, useEffect } from 'react';
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
	CreateProject,
	SmallCreateProject,
	Logo,
	BackBtn,
	MenuAndButtonContainer,
	CoverLine,
	MBContainer,
	HeaderSmallMenuAndButtonContainer,
} from './Header.sc';
import Link from 'next/link';
import { useSubgraph } from '@/context/subgraph.context';
import { RewardMenu } from '@/components/menu/RewardMenu';
import { useWeb3React } from '@web3-react/core';
import WalletModal from '@/components/modals/WalletModal';
import { walletsArray } from '@/lib/wallet/walletTypes';
import SignInModal from '../modals/SignInModal';
import MenuWallet from '@/components/menu/MenuWallet';
import { ETheme, useGeneral } from '@/context/general.context';
import { useRouter } from 'next/router';
import { menuRoutes } from '../menu/MenuRoutes';
import { GLink, IconMenu24 } from '@giveth/ui-design-system';
import { HeaderSmallMenu } from '../menu/HeaderMenu';
import useUser from '@/context/UserProvider';
import {
	checkLinkActive,
	isGivEconomyRoute,
	shortenAddress,
} from '@/lib/helpers';

export interface IHeader {
	theme?: ThemeType;
	show?: boolean;
}

const Header: FC<IHeader> = () => {
	const [showRewardMenu, setShowRewardMenu] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showHeader, setShowHeader] = useState(true);
	const [showSmallMenu, setShowSmallMenu] = useState(false);
	const [showWalletModal, setShowWalletModal] = useState(false);
	const [showSigninModal, setShowSigninModal] = useState(false);
	const [isGIVeconomyRoute, setIsGIVeconomyRoute] = useState(false);
	const [isCreateRoute, setIsCreateRoute] = useState(false);
	const {
		currentValues: { balances },
	} = useSubgraph();
	const {
		state: { user },
	} = useUser();
	const { chainId, active, activate, account, library } = useWeb3React();
	const { theme } = useGeneral();
	const router = useRouter();

	const showLinks = !isCreateRoute;

	const handleHoverClickBalance = (show: boolean) => {
		setShowRewardMenu(show);
	};

	useEffect(() => {
		const selectedWalletName =
			window.localStorage.getItem('selectedWallet');
		const wallet = walletsArray.find(w => w.value === selectedWalletName);
		if (wallet) {
			activate(wallet.connector);
		}
	}, [activate]);

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
			const show = scrollY > lastScrollY ? false : true;
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

	useEffect(() => {
		setIsGIVeconomyRoute(router.route.startsWith('/giv'));
		setIsCreateRoute(router.route.startsWith('/create'));
	}, [router.route]);

	return (
		<>
			{/* <HeaderPlaceholder /> */}
			<StyledHeader
				justifyContent='space-between'
				alignItems='center'
				theme={theme}
				show={showHeader}
			>
				<Row>
					{isCreateRoute ? (
						<BackBtn onClick={() => router.back()}>
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
						<Logo>
							<Image
								width='48px'
								height='48px'
								alt='Giveth logo'
								src={`/images/logo/logo1.png`}
							/>
						</Logo>
					)}
				</Row>
				{showLinks && (
					<HeaderLinks theme={theme}>
						{menuRoutes.map((link, index) => (
							<Link href={link.href} passHref key={index}>
								<HeaderLink
									size='Big'
									theme={theme}
									active={router.route === link.href}
								>
									{link.title}
								</HeaderLink>
							</Link>
						))}
					</HeaderLinks>
				)}

				<Row gap='8px'>
					<Link href='/create' passHref>
						<CreateProject
							label='CREATE A PROJECT'
							size='small'
							theme={theme}
							linkType={
								theme === ETheme.Light ? 'primary' : 'secondary'
							}
						/>
					</Link>
					<Link href='/create' passHref>
						<SmallCreateProject
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
					</Link>
					{active && account && chainId ? (
						<>
							<MenuAndButtonContainer
								onClick={() => handleHoverClickBalance(true)}
								onMouseEnter={() =>
									handleHoverClickBalance(true)
								}
								onMouseLeave={() =>
									handleHoverClickBalance(false)
								}
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
								{showRewardMenu && <RewardMenu />}
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
												'/images/placeholders/profile.png'
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
															.nativeCurrency
															.symbol
													: library?._network?.name}
											</WBNetwork>
										</WBInfo>
									</HBContainer>
									<CoverLine theme={theme} />
								</WalletButton>
								{showUserMenu && (
									<MenuWallet
										setShowWalletModal={setShowWalletModal}
									/>
								)}
							</MenuAndButtonContainer>
						</>
					) : (
						<div>
							<ConnectButton
								buttonType='primary'
								size='small'
								label={
									isGIVeconomyRoute
										? 'CONNECT WALLET'
										: 'SIGN IN'
								}
								onClick={() => {
									setShowWalletModal(isGIVeconomyRoute);
								}}
							/>
						</div>
					)}
				</Row>
			</StyledHeader>
			{showWalletModal && (
				<WalletModal
					showModal={showWalletModal}
					setShowModal={setShowWalletModal}
				/>
			)}
			{showSigninModal && (
				<SignInModal
					showModal={showSigninModal}
					closeModal={() => setShowSigninModal(false)}
				/>
			)}
		</>
	);
};

export default Header;
