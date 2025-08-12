'use client';
import { MeshProvider, useWallet, useWalletList } from '@meshsdk/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

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

function Inner() {
	const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(
		null,
	);

	const { connect, disconnect, connecting, connected, wallet } = useWallet();
	const wallets = useWalletList();

	useEffect(() => {
		const storedWallet = localStorage.getItem('selectedWallet');
		if (storedWallet) {
			setSelectedWallet(JSON.parse(storedWallet));
			connect(JSON.parse(storedWallet).name);
		}
	}, []);

	const handleWalletSelection = (wallet: WalletInfo) => {
		localStorage.setItem('selectedWallet', JSON.stringify(wallet));
		setSelectedWallet(wallet);
		connect(wallet.name);
	};

	const handleDisconnect = () => {
		localStorage.removeItem('selectedWallet');
		disconnect();
		setSelectedWallet(null);
	};

	console.log({ wallet });

	return (
		<div style={{ textAlign: 'center', marginTop: 50 }}>
			<h1>TEST CARDANO</h1>
			<hr />
			<SelectedWallet>
				{selectedWallet ? (
					<div>
						<span>{selectedWallet.name}</span>
						<Image
							src={selectedWallet.icon}
							alt={selectedWallet.name}
							width='30'
							height='30'
						/>
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
								<Image
									src={wallet.icon}
									alt={wallet.name}
									width='30'
									height='30'
								/>
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
