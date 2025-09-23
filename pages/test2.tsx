'use client';
import { Transaction } from '@meshsdk/core';
import { MeshProvider, useWallet, useWalletList } from '@meshsdk/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const cardanoProjectId =
	process.env.NEXT_PUBLIC_CARDANO_BLOCKFROST_PROJECT_ID || '';

const MIN_ADA = 1;

const tokenDBList = [
	{
		projectId: cardanoProjectId,
		tokenList: [
			{
				name: 'ADA',
				unit: 'lovelace',
				nameHex: null,
				policyId: null,
				decimals: 6, // 1 ADA = 1,000,000 lovelace
				logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=040',
			},
			{
				name: 'SHEN',
				nameHex: '5368656e4d6963726f555344',
				unit: '8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd615368656e4d6963726f555344',
				policyId:
					'8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61',
				decimals: 6,
				logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=040',
			},
		],
	},
];

const getCoingeckoADAPrice = async () => {
	try {
		const response = await fetch(
			'https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd',
		);
		const data = await response.json();
		return data.cardano.usd;
	} catch (error) {
		console.error('Error getting ADA price:', error);
		return null;
	}
};

const getTokenDataFromBlockfrost = async (unit: string) => {
	try {
		const response = await fetch(
			` https://cardano-mainnet.blockfrost.io/api/v0/assets/${unit}`,
			{
				headers: {
					project_id: cardanoProjectId || '',
				},
			},
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error getting token data:', error);
		return null;
	}
};

export async function fetchTokenPriceInAdaMuesli(
	policyId: string,
	assetNameHex: string,
) {
	try {
		const url = `https://api.muesliswap.com/price?base-policy-id=${policyId}&base-tokenname=${assetNameHex}`;
		const r = await fetch(url, { cache: 'no-store' });
		if (!r.ok) return undefined;
		const j = await r.json();
		const p = Number(j?.price);
		return p > 0 ? p : 0;
	} catch (error) {
		console.error('Error getting token price:', error);
		return 0;
	}
}

// Helper function to convert raw quantity to real token amount
const formatTokenQuantity = (quantity: string, decimals: number): number => {
	const rawAmount = Number(quantity);
	return rawAmount / Math.pow(10, decimals);
};

type WalletInfo = {
	id: string; // e.g. "yoroi", "nami", "eternl"
	name: string; // display name
	icon: string; // icon url
};

function WalletAddress({ wallet }: { wallet: any }) {
	const [address, setAddress] = useState<string>('');

	useEffect(() => {
		const getAddress = async () => {
			try {
				const addr = await wallet.getChangeAddress();
				setAddress(addr);
			} catch (error) {
				console.error('Error getting address:', error);
			}
		};

		if (wallet) {
			getAddress();
		}
	}, [wallet]);

	return <p>Address: {address}</p>;
}

function normalizeAmount(input: string): number {
	// Replace comma with dot, trim spaces
	const normalized = input.replace(',', '.').trim();
	const value = Number(normalized);

	if (isNaN(value) || value <= 0) {
		throw new Error(`Invalid amount: "${input}"`);
	}
	return value;
}

function Inner() {
	const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(
		null,
	);

	const [adaPrice, setAdaPrice] = useState<number | null>(null);
	const [tokenList, setTokenList] = useState<any[]>([]);

	const { connect, disconnect, connecting, connected, wallet } = useWallet();
	const wallets = useWalletList();

	// Connect user with selected wallet if it's stored in local storage
	useEffect(() => {
		const storedWallet = localStorage.getItem('selectedWallet');
		if (storedWallet) {
			setSelectedWallet(JSON.parse(storedWallet));
			connect(JSON.parse(storedWallet).name);
		}
	}, [connect]);

	// Connect user with selected wallet
	const handleWalletSelection = (wallet: WalletInfo) => {
		localStorage.setItem('selectedWallet', JSON.stringify(wallet));
		setSelectedWallet(wallet);
		connect(wallet.name);
	};

	// Disconnect wallet
	const handleDisconnect = () => {
		localStorage.removeItem('selectedWallet');
		disconnect();
		setSelectedWallet(null);
	};

	// Fetch user token list
	useEffect(() => {
		if (wallet && connected) {
			const getWalletBalance = async () => {
				const balance = await wallet.getBalance();

				console.log({ balance });

				if (balance) {
					// Check if have token on the list
					const tokenList = tokenDBList.find(
						project => project.projectId === cardanoProjectId,
					)?.tokenList;

					// Update token price and populate token list
					if (tokenList) {
						const updatedTokenList: any[] = [];
						for (const token of tokenList) {
							// find token in wallet balance array
							const balEntry = balance.find(
								b => b.unit === token.unit,
							);
							const quantity = balEntry ? balEntry.quantity : '0';
							const formattedQuantity = formatTokenQuantity(
								quantity,
								token.decimals,
							);

							if (token.unit === 'lovelace') {
								updatedTokenList.push({
									...token,
									priceAda: 1,
									quantity: formattedQuantity,
									rawQuantity: quantity,
								});
							} else {
								const tokenData =
									await fetchTokenPriceInAdaMuesli(
										token?.policyId || '',
										token?.nameHex || '',
									);
								if (tokenData) {
									updatedTokenList.push({
										...token,
										priceAda: tokenData,
										quantity: formattedQuantity,
										rawQuantity: quantity,
									});
								} else {
									updatedTokenList.push({
										...token,
										priceAda: 0,
										quantity: formattedQuantity,
										rawQuantity: quantity,
									});
								}
							}
						}
						setTokenList(updatedTokenList);
					}
				}
			};
			getWalletBalance();
		}
	}, [wallet, connected]);

	// Fetch ada price only once
	useEffect(() => {
		const fetchAdaPrice = async () => {
			const price = await getCoingeckoADAPrice();
			setAdaPrice(price);
		};
		fetchAdaPrice();
	}, []);

	const handleDonation = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const fromAddress = formData.get('fromAddress') as string;
		const toAddress = formData.get('toAddress') as string;
		const amount = formData.get('amount') as string;
		const tokenUnit = formData.get('token') as string;
		console.log({ fromAddress, toAddress, amount, tokenUnit });

		if (!wallet) {
			console.error('Wallet not connected');
			return;
		}

		try {
			// Get sender address (payment address)
			const address = await wallet.getChangeAddress();

			const amountValue = normalizeAmount(amount);

			console.log({ amountValue });

			if (amountValue < MIN_ADA && tokenUnit === 'lovelace') {
				alert(
					`Amount must be at least ${MIN_ADA} ADA due to min-ADA requirement`,
				);
				return;
			}

			// Build transaction
			const tx = new Transaction({ initiator: wallet });

			if (tokenUnit === 'lovelace') {
				console.log('ADA transfer');
				// ADA transfer: convert ADA → lovelace (1 ADA = 1,000,000 lovelace)
				tx.sendLovelace(
					toAddress,
					String(BigInt(Number(amountValue) * 1_000_000)),
				);
			} else {
				// Token transfer
				tx.sendAssets(toAddress, [
					{
						unit: tokenUnit,
						quantity: String(amountValue), // must be in token's smallest unit
					},
				]);
			}

			// Submit transaction
			const unsignedTx = await tx.build();
			const signedTx = await wallet.signTx(unsignedTx);
			const txHash = await wallet.submitTx(signedTx);

			console.log('Transaction submitted:', txHash);
			alert(`✅ Transaction submitted: ${txHash}`);
		} catch (err) {
			console.error('Transaction failed', err);
			alert('❌ Transaction failed: ' + err);
		}
	};

	return (
		<div style={{ textAlign: 'center', marginTop: 50 }}>
			<h1>TEST CARDANO</h1>
			<hr />
			<SelectedWallet>
				{selectedWallet ? (
					<div>
						<span>{selectedWallet.name}</span>
					</div>
				) : (
					<h2>Select a wallet</h2>
				)}
			</SelectedWallet>
			<SelectWallets>
				{!selectedWallet && !connecting && (
					<ul>
						{wallets.map(wallet => (
							<li
								key={wallet.name}
								onClick={() => handleWalletSelection(wallet)}
							>
								<span>{wallet.name}</span>
							</li>
						))}
					</ul>
				)}
			</SelectWallets>
			<div>
				{!connected && <p>Not connected</p>}
				{connected && <p>Connected</p>}
				{connected && wallet && <WalletAddress wallet={wallet} />}
				{connected && (
					<BlueButton onClick={() => handleDisconnect()}>
						Disconnect
					</BlueButton>
				)}
			</div>
			{connected && (
				<div>
					<hr />
					<h2>Wallet Balance and token list</h2>
					<div>
						{tokenList.map((token: any) => (
							<TokenItem key={token.name}>
								<p>Token Name: {token.name}</p>
								<p>Token Price: {token.priceAda} ADA</p>
								<p>Token Quantity: {token.quantity}</p>
								<p>Token Raw Quantity: {token.rawQuantity}</p>
								<p>Token Decimals: {token.decimals}</p>
								<p>
									Token USD Value:{' '}
									{(
										token.priceAda *
										token.quantity *
										(adaPrice || 0)
									).toFixed(2)}{' '}
									USD
								</p>
							</TokenItem>
						))}
					</div>
				</div>
			)}
			{connected && (
				<div>
					<hr />
					<h2>Make donation with Cardano</h2>
					<FormHolder onSubmit={handleDonation}>
						<InputHolder
							type='text'
							name='fromAddress'
							placeholder='Project ID'
							readOnly
							value={cardanoProjectId}
						/>
						<SelectHolder name='token' id='token'>
							{tokenList.map(token => (
								<option key={token.name} value={token.unit}>
									{token.name} - {token.priceAda} ADA -{' '}
									{token.quantity}
								</option>
							))}
						</SelectHolder>
						<InputHolder
							type='text'
							name='amount'
							placeholder='Amount'
						/>
						<InputHolder
							type='text'
							name='toAddress'
							placeholder='toAddress'
							value='addr1q9ute9k2xxkpqfy4pdljet3nh48zm6c3yfjcdkj0htuapsdwjzm36z25ndrmvxr990m76279jq7zeu50k3lgasjds9ts447s0a'
						/>
						<DonateButton type='submit'>Donate</DonateButton>
					</FormHolder>
				</div>
			)}
		</div>
	);
}

export default function YourApp() {
	return (
		<MeshProvider>
			<Inner />
		</MeshProvider>
	);
}

export const SelectWallets = styled.div`
	margin: 10px;
	border: none;
	padding: 10px 20px;
	font-size: 1rem;
	border-radius: 6px;
	cursor: pointer;
	transition: background-color 0.2s ease;

	ul {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		list-style: none;
		padding: 0;
		margin: 0;
		li {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10px;
			flex-direction: column;
			font-size: 1.8rem;
			border: 1px solid #000;
			padding: 10px;
			border-radius: 6px;
			cursor: pointer;
			transition: background-color 0.2s ease;
			&:hover {
				color: white;
				background-color: #005bb5;
			}
		}
	}
`;

export const SelectedWallet = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;

	div {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: 1px solid #000;
		padding: 10px;
		border-radius: 6px;
	}
`;

export const BlueButton = styled.button`
	display: inline-block;
	margin: 10px;
	background-color: #0070f3; /* blue */
	color: white;
	border: none;
	padding: 10px 20px;
	font-size: 1rem;
	border-radius: 6px;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: #005bb5; /* darker blue on hover */
	}

	&:disabled {
		background-color: #a0c4ff;
		cursor: not-allowed;
	}
`;

export const TokenItem = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 10px;
	margin: 10px;
	border: 1px solid #000;
	padding: 10px;
	border-radius: 6px;

	p {
		width: 30%;
		text-align: left;
	}
`;

export const FormHolder = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	margin: 10px 15em;
`;

export const InputHolder = styled.input`
	width: 100%;
	padding: 10px;
	border: 1px solid #000;
	border-radius: 6px;
`;

export const SelectHolder = styled.select`
	width: 100%;
	padding: 10px;
	border: 1px solid #000;
	border-radius: 6px;
`;

export const DonateButton = styled.button`
	width: 100%;
	padding: 10px;
	border: 1px solid #000;
	border-radius: 6px;
`;
