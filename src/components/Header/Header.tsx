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
	MenuAndButtonContainer,
	CoverLine,
	SmallHeaderLinks,
	HeaderPlaceholder,
} from './Header.sc';
import Link from 'next/link';
import { useSubgraph } from '@/context/subgraph.context';
import { RewardMenu } from '@/components/menu/RewardMenu';
import { useWeb3React } from '@web3-react/core';
import WalletModal from '@/components/modals/WalletModal';
import { walletsArray } from '@/lib/wallet/walletTypes';
import links from '@/lib/constants/links';
import SignInModal from '../modals/SignInModal';
import MenuWallet from '@/components/menu/MenuWallet';
import { ETheme, useGeneral } from '@/context/general.context';
import { useRouter } from 'next/router';

export interface IHeader {
	theme?: ThemeType;
	show?: boolean;
}

const Header: FC<IHeader> = () => {
	const [showRewardMenu, setShowRewardMenu] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showHeader, setShowHeader] = useState(true);
	const [showWalletModal, setShowWalletModal] = useState(false);
	const [showSigninModal, setShowSigninModal] = useState(false);
	const [isGIVconomyRoute, setIsGIVconomyRoute] = useState(false);
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { chainId, active, activate, account, library } = useWeb3React();
	const { theme } = useGeneral();
	const router = useRouter();

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
		setIsGIVconomyRoute(router.route.startsWith('/giv'));
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
					<Logo>
						<Image
							width='48p'
							height='48px'
							alt='Giveth logo'
							src={`/images/logo/logo1.png`}
						/>
					</Logo>
					<SmallHeaderLinks>
						{/* <IconMenu24 /> */}
						<Link href='/' passHref>
							<HeaderLink size='Big'>GIVeconomy</HeaderLink>
						</Link>
					</SmallHeaderLinks>
				</Row>
				<HeaderLinks theme={theme}>
					<Link href='/' passHref>
						<HeaderLink size='Big'>Home</HeaderLink>
					</Link>
					<Link href='/projects' passHref>
						<HeaderLink size='Big'>Projects</HeaderLink>
					</Link>
					<Link href={links.GIVECONOMY} passHref>
						<HeaderLink size='Big'>GIVeconomy</HeaderLink>
					</Link>
					<Link href='/join' passHref>
						<HeaderLink size='Big'>Community</HeaderLink>
					</Link>
				</HeaderLinks>
				<Row gap='8px'>
					<Link href='/terms' passHref>
						<CreateProject
							label='CREATE A PROJECT'
							linkType={
								theme === ETheme.Light ? 'primary' : 'secondary'
							}
						/>
					</Link>
					<Link href='/terms' passHref>
						<SmallCreateProject
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
										<HBContent>
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
											<span>{`${account.substring(
												0,
												6,
											)}...${account.substring(
												account.length - 5,
												account.length,
											)}`}</span>
											<WBNetwork>
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
								label={
									isGIVconomyRoute
										? 'CONNECT WALLET'
										: 'SIGN IN'
								}
								onClick={() => {
									if (isGIVconomyRoute) {
										setShowWalletModal(true);
									} else {
										setShowSigninModal(true);
									}
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
