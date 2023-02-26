import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';

import { useIntl } from 'react-intl';
import { B, GLink } from '@giveth/ui-design-system';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';
import { SignWithWalletModal } from '@/components/modals/SignWithWalletModal';
import { switchNetworkHandler } from '@/lib/wallet';
import { isUserRegistered, networkInfo, shortenAddress } from '@/lib/helpers';
import StorageLabel from '@/lib/localStorage';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowWalletModal,
} from '@/features/modal/modal.slice';
import { signOut } from '@/features/user/user.thunks';
import { ItemRow, ItemTitle, ItemAction, ItemSpacer } from './common';
import { Item } from './Item';

export const UserItems = () => {
	const { formatMessage } = useIntl();
	const { chainId, account } = useWeb3React();
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

	const { networkName } = networkInfo(chainId);

	return (
		<>
			<Item theme={theme}>
				<ItemTitle theme={theme}>
					{formatMessage({ id: 'label.wallet' })}
				</ItemTitle>
				<ItemRow>
					<B>{shortenAddress(account)}</B>
					<ItemAction
						size='Small'
						onClick={() => {
							window.localStorage.removeItem(StorageLabel.WALLET);
							dispatch(setShowWalletModal(true));
						}}
					>
						{formatMessage({ id: 'label.change_wallet' })}
					</ItemAction>
				</ItemRow>
			</Item>
			<Item theme={theme}>
				<ItemTitle theme={theme}>
					{formatMessage({ id: 'label.network' })}
				</ItemTitle>
				<ItemRow>
					<B>{networkName}</B>
					<ItemAction
						size='Small'
						onClick={() => switchNetworkHandler(chainId)}
					>
						{formatMessage({ id: 'label.switch_network' })}
					</ItemAction>
				</ItemRow>
			</Item>
			<ItemSpacer />
			{walletMenuArray.map(i => (
				<Item key={i.title} onClick={() => goRoute(i)} theme={theme}>
					<GLink size='Big'>{formatMessage({ id: i.title })}</GLink>
				</Item>
			))}
			{isSignedIn && (
				<Item onClick={() => dispatch(signOut(token!))} theme={theme}>
					<GLink size='Big'>
						{formatMessage({ id: 'label.sign_out' })}
					</GLink>
				</Item>
			)}
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
