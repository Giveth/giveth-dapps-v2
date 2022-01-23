import Image from 'next/image';
import { Row } from '@/components/styled-components/Grid';
import { FC, useContext, useState, useEffect } from 'react';
import { ThemeContext, ThemeType } from '@/context/theme.context';
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
import SignInModal from '../SignInModal';
import MenuWallet from '@/components/menu/MenuWallet';
import { ETheme, useGeneral } from '@/context/general.context';

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
	const {
		currentValues: { balances },
	} = useSubgraph();
	const { chainId, active, activate, account, library } = useWeb3React();
	const { theme } = useGeneral();

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
	}, []);

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
					<HeaderLink size='Big' href='/projects'>
						Projects
					</HeaderLink>
					<Link href={links.GIVECONOMY} passHref>
						<HeaderLink size='Big'>GIVeconomy</HeaderLink>
					</Link>
					<Link href='/join' passHref>
						<HeaderLink size='Big'>Community</HeaderLink>
					</Link>
				</HeaderLinks>
				<Row gap='8px'>
					<CreateProject
						label='CREATE A PROJECT'
						href='/create'
						target='_blank'
						linkType={
							theme === ETheme.Light ? 'primary' : 'secondary'
						}
					/>
					<SmallCreateProject
						label=''
						href='/create'
						target='_blank'
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
								<BalanceButton outline>
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
									<CoverLine />
								</BalanceButton>
								{showRewardMenu && <RewardMenu />}
							</MenuAndButtonContainer>
							<MenuAndButtonContainer
								onClick={() => setShowUserMenu(true)}
								onMouseEnter={() => setShowUserMenu(true)}
								onMouseLeave={() => setShowUserMenu(false)}
							>
								<WalletButton
									outline
									onClick={() => {
										// window.localStorage.removeItem(
										// 	'selectedWallet',
										// );
										// deactivate();
										// setShowWalletModal(true);
									}}
								>
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
									<CoverLine />
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
								label='CONNECT WALLET'
								onClick={() => {
									setShowWalletModal(true);
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
