import React, { useCallback, useMemo, useState } from 'react';
import {
	type Address,
	type Hex,
	custom,
	createPublicClient,
	createWalletClient,
	http,
	isAddress,
} from 'viem';
import { base } from 'viem/chains';

import { getDrpcNetwork } from '@/lib/network';

import anchorContract from '@/artifacts/anchorContract.json';
import createProfile from '@/artifacts/createProfile.json';

const BASE_CHAIN_ID = 8453;
const BASE_CHAIN_ID_HEX = '0x2105';
const DEFAULT_ANCHOR_ADDRESS: Address =
	'0x5DCE0A8bd7537491A6c777E76D63FEADfD608263';

const PROFILE_OWNER_ADDRESS: Address =
	'0xDE798cD9C53F4806B9Cc7dD27aDf7c641540167c';

// From your test2 output:
const REGISTRY_ADDRESS: Address = '0x4AAcca72145e1dF2aeC137E1f3C5E3D75DB8b5f3';
const PROFILE_ID: Hex =
	'0x8a3c6e7a759309c127af57160467952f38bf6d046ea0a5ab09ae9285227c00b1';

type ProfileResult =
	| {
			id: Hex;
			nonce: bigint;
			name: string;
			metadata: { protocol: bigint; pointer: string };
			owner: Address;
			anchor: Address;
	  }
	| readonly [
			Hex,
			bigint,
			string,
			readonly [bigint, string],
			Address,
			Address,
	  ];

const _getOwnerFromProfile = (profile: ProfileResult): Address =>
	'owner' in profile ? profile.owner : profile[4];

const Test2 = () => {
	const publicClient = useMemo(() => {
		const drpcKey = process.env.NEXT_PUBLIC_DRPC_KEY;
		const network = getDrpcNetwork(BASE_CHAIN_ID);
		const rpcUrl =
			drpcKey && network
				? `https://lb.drpc.org/ogrpc?network=${network}&dkey=${drpcKey}`
				: 'https://mainnet.base.org';

		return createPublicClient({
			chain: base,
			transport: http(rpcUrl),
		});
	}, []);

	const [anchorAddress, setAnchorAddress] = useState<string>(
		DEFAULT_ANCHOR_ADDRESS,
	);
	const [error, setError] = useState<string | null>(null);

	const [recipientAddress, setRecipientAddress] = useState<string>(
		PROFILE_OWNER_ADDRESS,
	);
	const [txHash, setTxHash] = useState<Hex | null>(null);
	const [claimStatus, setClaimStatus] = useState<
		'idle' | 'checking' | 'signing' | 'waiting' | 'success'
	>('idle');
	const [anchorEthBalanceWei, setAnchorEthBalanceWei] = useState<
		bigint | null
	>(null);

	const anchor = useMemo(() => {
		return isAddress(anchorAddress) ? (anchorAddress as Address) : null;
	}, [anchorAddress]);

	const recipient = useMemo(() => {
		return isAddress(recipientAddress)
			? (recipientAddress as Address)
			: null;
	}, [recipientAddress]);

	const refreshAnchorBalance = useCallback(async () => {
		setError(null);
		setAnchorEthBalanceWei(null);
		setTxHash(null);
		setClaimStatus('idle');

		if (!anchor) {
			setError('Invalid anchor address.');
			return;
		}

		try {
			const balance = await publicClient.getBalance({ address: anchor });
			setAnchorEthBalanceWei(balance);
		} catch (e: unknown) {
			setError(
				e instanceof Error
					? e.message
					: 'Unknown error while reading balance.',
			);
		}
	}, [anchor, publicClient]);

	const claimStuckEth = useCallback(async () => {
		setError(null);
		setTxHash(null);

		if (!anchor) {
			setError('Invalid anchor address.');
			return;
		}
		if (!recipient) {
			setError('Invalid recipient address.');
			return;
		}
		if (typeof window === 'undefined' || !window.ethereum) {
			setError(
				'No injected wallet found (window.ethereum). Use Rabby/MetaMask.',
			);
			return;
		}

		setClaimStatus('checking');
		try {
			const chainId = (await window.ethereum.request?.({
				method: 'eth_chainId',
			})) as string | undefined;

			if (!chainId || chainId.toLowerCase() !== BASE_CHAIN_ID_HEX) {
				setError(
					`Your wallet is not on Base (8453). Please switch network in your wallet to Base, then click again.`,
				);
				setClaimStatus('idle');
				return;
			}

			const walletClient = createWalletClient({
				chain: base,
				transport: custom(window.ethereum),
			});

			const accounts = (await window.ethereum.request?.({
				method: 'eth_requestAccounts',
			})) as string[] | undefined;

			const account = accounts?.[0];
			if (!account || !isAddress(account)) {
				setError('No wallet account selected.');
				setClaimStatus('idle');
				return;
			}

			const isAuthorized = (await publicClient.readContract({
				address: REGISTRY_ADDRESS,
				abi: createProfile.abi,
				functionName: 'isOwnerOrMemberOfProfile',
				args: [PROFILE_ID, account as Address],
			})) as boolean;

			if (!isAuthorized) {
				setError(
					`Connected wallet (${account}) is NOT owner/member of this profile. Only the profile owner/member can claim.`,
				);
				setClaimStatus('idle');
				return;
			}

			const balance = await publicClient.getBalance({ address: anchor });
			setAnchorEthBalanceWei(balance);
			if (balance === 0n) {
				setError('Anchor has 0 ETH balance; nothing to claim.');
				setClaimStatus('idle');
				return;
			}

			setClaimStatus('signing');
			const hash = await walletClient.writeContract({
				address: anchor,
				abi: anchorContract.abi,
				functionName: 'execute',
				args: [recipient, balance, '0x'],
				account: account as Address,
			});
			setTxHash(hash as Hex);

			setClaimStatus('waiting');
			await publicClient.waitForTransactionReceipt({ hash: hash as Hex });
			setClaimStatus('success');
		} catch (e: unknown) {
			setError(
				e instanceof Error
					? e.message
					: 'Unknown error while claiming.',
			);
			setClaimStatus('idle');
		}
	}, [anchor, publicClient, recipient]);

	return (
		<div
			style={{
				width: '500px',
				margin: '100px auto',
				padding: 24,
				fontFamily: 'sans-serif',
			}}
		>
			<h1>Claim stuck ETH from Anchor (Base)</h1>
			<p>
				ChainId: <b>{BASE_CHAIN_ID}</b>
			</p>

			<div style={{ display: 'grid', gap: 8, maxWidth: 820 }}>
				<label>
					<div style={{ fontWeight: 600, marginBottom: 4 }}>
						Anchor address
					</div>
					<input
						value={anchorAddress}
						onChange={e => setAnchorAddress(e.target.value.trim())}
						style={{
							width: '100%',
							padding: 8,
							fontFamily: 'monospace',
						}}
					/>
				</label>

				{error && (
					<div style={{ color: '#b00020', whiteSpace: 'pre-wrap' }}>
						<b>Error:</b> {error}
					</div>
				)}

				<div style={{ marginTop: 12 }}>
					<div>
						<b>Registry (fixed):</b> {REGISTRY_ADDRESS}
					</div>
					<div>
						<b>ProfileId (fixed):</b> {PROFILE_ID}
					</div>
					<div>
						<b>Profile owner (fixed):</b> {PROFILE_OWNER_ADDRESS}
					</div>
					<div>
						<b>Anchor ETH balance (wei):</b>{' '}
						{anchorEthBalanceWei === null
							? '—'
							: anchorEthBalanceWei.toString()}
					</div>
				</div>

				<hr style={{ margin: '16px 0' }} />

				<button
					onClick={refreshAnchorBalance}
					disabled={!anchor}
					style={{ padding: 10, width: 260 }}
				>
					Refresh anchor balance
				</button>

				<label>
					<div style={{ fontWeight: 600, marginBottom: 4 }}>
						Recipient address (where the ETH should be sent)
					</div>
					<input
						value={recipientAddress}
						onChange={e =>
							setRecipientAddress(e.target.value.trim())
						}
						style={{
							width: '100%',
							padding: 8,
							fontFamily: 'monospace',
						}}
					/>
				</label>

				<button
					onClick={claimStuckEth}
					disabled={
						!anchor ||
						!recipient ||
						claimStatus === 'checking' ||
						claimStatus === 'signing' ||
						claimStatus === 'waiting'
					}
					style={{
						padding: 10,
						width: 360,
						backgroundColor: 'blue',
						color: 'white',
						borderRadius: 8,
						border: 'none',
						cursor: 'pointer',
						fontSize: 16,
						fontWeight: 600,
						textTransform: 'uppercase',
						letterSpacing: 0.5,
						transition: 'background-color 0.3s ease',
						boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
					}}
				>
					{claimStatus === 'checking'
						? 'Checking permission…'
						: claimStatus === 'signing'
							? 'Sign tx in wallet…'
							: claimStatus === 'waiting'
								? 'Waiting confirmation…'
								: claimStatus === 'success'
									? 'Claimed ✅'
									: 'Claim stuck ETH (send full balance)'}
				</button>

				{txHash && (
					<div style={{ marginTop: 8 }}>
						<b>Tx:</b>{' '}
						<a
							href={`https://basescan.org/tx/${txHash}`}
							target='_blank'
							rel='noreferrer'
						>
							{txHash}
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default Test2;
