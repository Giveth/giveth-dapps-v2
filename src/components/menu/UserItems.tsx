import { Dispatch, FC, SetStateAction } from 'react';
import { useIntl } from 'react-intl';
import { B, GLink, FlexCenter } from '@giveth/ui-design-system';
import { useRouter } from 'next/router';

import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';
import { isUserRegistered, shortenAddress } from '@/lib/helpers';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';
import { signOut } from '@/features/user/user.thunks';
import {
	ItemRow,
	ItemTitle,
	ItemAction,
	ItemSpacer,
	NetworkName,
} from './common';
import { Item } from './Item';
import NetworkLogo from '@/components/NetworkLogo';
import StorageLabel from '@/lib/localStorage';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
interface IUserItemsProps {
	setSignWithWallet: Dispatch<SetStateAction<boolean>>;
	setQueueRoute: Dispatch<SetStateAction<string>>;
}

export const UserItems: FC<IUserItemsProps> = ({
	setSignWithWallet,
	setQueueRoute,
}) => {
	const { formatMessage } = useIntl();

	const {
		walletAddress,
		disconnect,
		chainName,
		isOnSolana,
		walletChainType,
	} = useGeneralWallet();
	const { chain } = useAccount();
	const chainId = chain?.id;
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { isSignedIn, userData, token } = useAppSelector(state => state.user);
	const theme = useAppSelector(state => state.general.theme);
	const isSafeEnv = useIsSafeEnvironment();

	const { open: openChainModal } = useWeb3Modal();

	const goRoute = (input: {
		url: string;
		requiresSign: boolean;
		requiresRegistration?: boolean;
	}) => {
		const { url, requiresSign, requiresRegistration } = input;
		if (requiresSign && !isSignedIn) {
			setQueueRoute(url);
			return setSignWithWallet(true);
		}
		if (requiresRegistration && !isUserRegistered(userData)) {
			dispatch(setShowCompleteProfile(true));
			if (url === Routes.CreateProject) return;
		}
		router.push(url);
	};

	return (
		<>
			<Item $baseTheme={theme}>
				<ItemTitle $baseTheme={theme}>
					{formatMessage({ id: 'label.wallet' })}
				</ItemTitle>
				<ItemRow>
					<B>{shortenAddress(walletAddress)}</B>
				</ItemRow>
			</Item>
			<Item $baseTheme={theme}>
				<ItemTitle $baseTheme={theme}>
					{formatMessage({ id: 'label.network' })}
				</ItemTitle>
				<ItemRow>
					<FlexCenter gap='4px'>
						<NetworkLogo
							chainId={chainId}
							chainType={walletChainType}
							logoSize={16}
						/>
						<NetworkName width={isOnSolana ? '120px' : '90px'}>
							{chainName}
						</NetworkName>
					</FlexCenter>

					{!isSafeEnv && !isOnSolana && (
						<ItemAction
							size='Small'
							onClick={() => {
								openChainModal && openChainModal();
							}}
						>
							{formatMessage({ id: 'label.switch_network' })}
						</ItemAction>
					)}
				</ItemRow>
			</Item>
			<ItemSpacer />
			{walletMenuArray.map(i => (
				<Item
					key={i.title}
					onClick={() => goRoute(i)}
					$baseTheme={theme}
				>
					<GLink size='Big'>{formatMessage({ id: i.title })}</GLink>
				</Item>
			))}
			{!isSafeEnv && (
				<Item
					onClick={() => {
						isSignedIn && dispatch(signOut(token!));
						localStorage.removeItem(StorageLabel.WALLET);
						disconnect();
					}}
					$baseTheme={theme}
				>
					<GLink size='Big'>
						{formatMessage({ id: 'label.sign_out' })}
					</GLink>
				</Item>
			)}
		</>
	);
};

const walletMenuArray = [
	{
		title: 'label.my_account',
		url: Routes.MyAccount,
		requiresSign: true,
	},
	{
		title: 'label.my_projects',
		url: Routes.MyProjects,
		requiresSign: true,
	},
	{
		title: 'label.my_donations',
		url: Routes.MyDonations,
		requiresSign: true,
	},
	{
		title: 'label.my_givpower',
		url: Routes.MyBoostedProjects,
		requiresSign: true,
	},
	{
		title: 'label.create_a_project',
		url: Routes.CreateProject,
		requiresSign: true,
		requiresRegistration: true,
	},
	{
		title: 'label.report_a_bug',
		url: links.REPORT_ISSUE,
		requiresSign: false,
	},
	{ title: 'label.support', url: Routes.Support, requiresSign: false },
];
