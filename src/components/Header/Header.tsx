import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
	GLink,
	IconMenu24,
	IconSearch24,
	Flex,
	FlexSpacer,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import {
	ConnectButton,
	HeaderLinks,
	StyledHeader,
	SmallCreateProject,
	Logo,
	SmallCreateProjectParent,
	HomeButton,
	GLinkNoWrap,
	SearchButton,
} from './Header.sc';
import { CreateButtonWithMenu } from '../menu/CreateButtonWithMenu';
import {
	isSSRMode,
	isUserRegistered,
	isGIVeconomyRoute as checkIsGIVeconomyRoute,
} from '@/lib/helpers';
import Routes from '@/lib/constants/Routes';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import {
	setShowCompleteProfile,
	setShowSearchModal,
	setShowVerifyEmailModal,
} from '@/features/modal/modal.slice';
import { slugToProjectView } from '@/lib/routeCreators';
import { useModalCallback } from '@/hooks/useModalCallback';
import { LinkWithMenu } from '../menu/LinkWithMenu';
import { ProjectsMenu } from '../menu/ProjectsMenu';
import { GIVeconomyMenu } from '../menu/GIVeconomyMenu';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { ESideBarDirection, SideBar } from '../sidebar/SideBar';
import { useDelayedState } from '@/hooks/useDelayedState';
import { RewardButtonWithMenu } from '../menu/RewardButtonWithMenu';
import { UserButtonWithMenu } from '../menu/UserButtonWithMenu';
import { NotificationButtonWithMenu } from '../menu/NotificationButtonWithMenu';
import { HomeSidebar } from '../sidebar/HomeSidebar';
import { ItemsProvider } from '@/context/Items.context';
import { CommunityMenu } from '../menu/CommunityMenu';
import { useNavigationInfo } from '@/hooks/useNavigationInfo';
import config from '@/configuration';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { EScrollDir, useScrollDetection } from '@/hooks/useScrollDetection';
import { CausesMenu } from '../menu/CausesMenu';

export interface IHeader {
	theme?: ETheme;
	show?: boolean;
	showQFBanner?: boolean;
}

const Header: FC<IHeader> = ({ showQFBanner }) => {
	const [showBackBtn, setShowBackBtn] = useState(false);

	const [showSidebar, sidebarCondition, openSidebar, closeSidebar] =
		useDelayedState();

	const { walletAddress, openWalletConnectModal } = useGeneralWallet();
	const { chain } = useAccount();
	const chainId = chain?.id;

	const networkHasGIV =
		(chainId && config.EVM_NETWORKS_CONFIG[chainId]?.GIV_TOKEN_ADDRESS) ??
		null;
	const dispatch = useAppDispatch();
	const { isEnabled, isSignedIn, userData } = useAppSelector(
		state => state.user,
	);
	const theme = useAppSelector(state => state.general.theme);

	const router = useRouter();
	const { currentLabel } = useNavigationInfo();
	const isProjectPage = router.route.startsWith(Routes.Project + '/');

	const { formatMessage } = useIntl();
	const isDesktop = useMediaQuery(device.laptopL);
	const isMobile = useMediaQuery(device.mobileL);
	const scrollDir = useScrollDetection();

	const isGIVeconomyRoute = checkIsGIVeconomyRoute(router.route);

	const handleBack = () => {
		const calculateSlug = () => {
			if (typeof router.query?.slug === 'string') {
				return router.query?.slug;
			}
			return '';
		};
		if (
			router.route.startsWith(Routes.Verification) &&
			router?.query?.slug &&
			!router?.query?.token
		) {
			router.push(slugToProjectView(calculateSlug()));
		} else if (
			router.route.startsWith(Routes.Verification) &&
			router?.query?.token
		) {
			router.push(`${Routes.Verification}/${calculateSlug()}`);
		} else if (router.route.startsWith(Routes.NFTMint)) {
			router.push(Routes.NFT);
		} else {
			router.back();
		}
	};

	useEffect(() => {
		setShowBackBtn(
			router.route.startsWith(Routes.CreateProject) ||
				router.route.startsWith(Routes.Verification) ||
				router.route.startsWith(Routes.NFTMint),
		);
	}, [router.route]);

	const handleModals = () => {
		openWalletConnectModal();
	};

	const { modalCallback: signInThenCreate } = useModalCallback(() =>
		router.push(Routes.CreateProject),
	);

	const handleCreateButton = () => {
		if (isSSRMode) return;
		if (!isEnabled) {
			openWalletConnectModal();
		} else if (!isSignedIn) {
			signInThenCreate();
		} else if (!isUserRegistered(userData)) {
			dispatch(setShowCompleteProfile(true));
		} else if (!userData?.isEmailVerified) {
			dispatch(setShowVerifyEmailModal(true));
		} else if (isUserRegistered(userData)) {
			router.push(Routes.CreateProject);
		} else {
			dispatch(setShowCompleteProfile(true));
		}
	};

	return (
		<StyledHeader
			$alignItems='center'
			$baseTheme={theme}
			$show={scrollDir !== EScrollDir.Down}
			$showQFBanner={showQFBanner}
		>
			<Flex>
				{showBackBtn ? (
					<Logo onClick={handleBack}>
						<Image
							width='26'
							height='26'
							alt='Giveth logo'
							src={`/images/back-2.svg`}
						/>
					</Logo>
				) : (
					<Flex gap='24px' $alignItems='center'>
						{isMobile && (
							<Link href={Routes.Home}>
								<Logo>
									<Image
										width='50'
										height='50'
										alt='Giveth logo'
										src='/images/logo/logo.svg'
									/>
								</Logo>
							</Link>
						)}
						{!isDesktop && (
							<HomeButton gap='4px' onClick={openSidebar}>
								<IconMenu24 />
								<GLink size='Big'>{currentLabel} </GLink>
							</HomeButton>
						)}
					</Flex>
				)}
			</Flex>
			{isDesktop && !showBackBtn && (
				<HeaderLinks $baseTheme={theme}>
					<LinkWithMenu
						title={formatMessage({ id: 'label.projects' })}
						isHeaderShowing={scrollDir !== EScrollDir.Down}
						href={Routes.AllProjects}
					>
						<ProjectsMenu />
					</LinkWithMenu>
					<LinkWithMenu
						title={formatMessage({ id: 'label.causes' })}
						isHeaderShowing={scrollDir !== EScrollDir.Down}
						href={Routes.AllCauses}
					>
						<CausesMenu />
					</LinkWithMenu>
					<LinkWithMenu
						title='GIVeconomy'
						isHeaderShowing={scrollDir !== EScrollDir.Down}
						href={Routes.GIVeconomy}
					>
						<GIVeconomyMenu />
					</LinkWithMenu>
					<LinkWithMenu
						title={formatMessage({ id: 'label.community' })}
						isHeaderShowing={scrollDir !== EScrollDir.Down}
						href={Routes.Join}
					>
						<CommunityMenu />
					</LinkWithMenu>
					<SearchButton
						$baseTheme={theme}
						onClick={() => dispatch(setShowSearchModal(true))}
					>
						<Flex $alignItems='center' gap='16px'>
							<GLinkNoWrap size='Big'>
								{formatMessage({ id: 'label.search' })}
							</GLinkNoWrap>
							<IconSearch24 />
						</Flex>
					</SearchButton>
				</HeaderLinks>
			)}
			<FlexSpacer />
			<Flex gap='8px'>
				<CreateButtonWithMenu
					isHeaderShowing={scrollDir !== EScrollDir.Down}
					onClick={handleCreateButton}
					size='small'
					isProjectPage={isProjectPage}
				/>
				<SmallCreateProjectParent>
					<SmallCreateProject
						onClick={handleCreateButton}
						buttonType='primary'
						label='+'
					/>
				</SmallCreateProjectParent>
				{walletAddress ? (
					<>
						<NotificationButtonWithMenu
							isHeaderShowing={scrollDir !== EScrollDir.Down}
							theme={theme}
						/>
						{networkHasGIV && (
							<RewardButtonWithMenu
								isHeaderShowing={scrollDir !== EScrollDir.Down}
								theme={theme}
							/>
						)}
						<UserButtonWithMenu
							isHeaderShowing={scrollDir !== EScrollDir.Down}
							theme={theme}
						/>
					</>
				) : (
					<ConnectButton
						buttonType='primary'
						size='small'
						label={formatMessage({
							id: isGIVeconomyRoute
								? 'component.button.connect_wallet'
								: 'component.button.sign_in',
						})}
						onClick={handleModals}
					/>
				)}
			</Flex>
			{sidebarCondition && (
				<SideBar
					close={closeSidebar}
					isAnimating={showSidebar}
					direction={ESideBarDirection.Left}
				>
					<ItemsProvider close={closeSidebar}>
						<HomeSidebar />
					</ItemsProvider>
				</SideBar>
			)}
		</StyledHeader>
	);
};

export default Header;
