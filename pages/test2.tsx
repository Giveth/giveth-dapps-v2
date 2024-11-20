import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Framework } from '@superfluid-finance/sdk-core';

const USDCx_TOKEN_ADDRESS = '0x35adeb0638eb192755b6e52544650603fe65a006';
const USDCex_TOKEN_ADDRESS = '0x8430f084b939208e2eded1584889c9a66b90562f'; // NOT WORKING
const GIVETH_HOUSE_ADDRESS = '0x567c4B141ED61923967cA25Ef4906C8781069a10';

const TOKEN_ADDRESSES = [
	{ name: 'USDCx', address: '0x35adeb0638eb192755b6e52544650603fe65a006' },
	{ name: 'USDCex', address: '0x8430f084b939208e2eded1584889c9a66b90562f' },
	{ name: 'USDC', address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85' },
];

const OPTIMISM_CHAIN_ID = 10;

const YourApp = () => {
	const [tokens, setTokens] = useState<
		{ name: string; address: string; balance: string }[]
	>([]);
	const [selectedToken, setSelectedToken] = useState('');
	const [destinationAddress, setDestinationAddress] = useState(
		'0x567c4B141ED61923967cA25Ef4906C8781069a10',
	);
	const [loading, setLoading] = useState(true);
	const [amount, setAmount] = useState('0.001'); // Initial amount
	const [notification, setNotification] = useState('');

	const handleApproveAndExecute = async () => {
		try {
			// Connect to MetaMask
			if (!window.ethereum) {
				alert('MetaMask not detected');
				return;
			}

			const provider = new ethers.providers.Web3Provider(window.ethereum);
			await provider.send('eth_requestAccounts', []);
			const signer = provider.getSigner();
			const sf = await Framework.create({
				chainId: OPTIMISM_CHAIN_ID,
				provider,
			});

			const address = await signer.getAddress();
			const usdcx = await sf.loadWrapperSuperToken(selectedToken);
			const spenderAddress = GIVETH_HOUSE_ADDRESS;

			// Define the amount to approve (X.XX USDCx)
			const amountToApprove = ethers.utils.parseUnits(amount, 18);

			// Check current allowance
			const allowance = await usdcx.allowance({
				owner: address,
				spender: spenderAddress,
				providerOrSigner: signer,
			});

			// If allowance is insufficient, approve the required amount
			if (ethers.BigNumber.from(allowance).lt(amountToApprove)) {
				const approveOperation = usdcx.approve({
					receiver: spenderAddress,
					amount: amountToApprove.toString(),
				});

				// Get the populated transaction and send it with gasLimit
				const populatedApproveTx =
					await approveOperation.getPopulatedTransactionRequest(
						signer,
					);
				const approveTxResponse = await signer.sendTransaction({
					...populatedApproveTx,
					gasLimit: ethers.utils.hexlify(200000),
				});
				await approveTxResponse.wait();
				console.log(`Approved ${amount} USDC for spending.`);
			} else {
				console.log(`Already approved for ${amount} USDC.`);
			}

			// Now execute the main transaction (transfer)
			const mainTransaction = await usdcx.transfer({
				receiver: spenderAddress,
				amount: amountToApprove.toString(),
			});

			// Get the populated transaction and send it with gasLimit
			const populatedTransferTx =
				await mainTransaction.getPopulatedTransactionRequest(signer);
			const transferTxResponse = await signer.sendTransaction({
				...populatedTransferTx,
				gasLimit: ethers.utils.hexlify(200000),
			});
			await transferTxResponse.wait();
			console.log('Transaction executed successfully.');
			setNotification('Transaction executed successfully!');
			setTimeout(() => setNotification(''), 5000); // Clear notification after 5 seconds
		} catch (error) {
			console.error('Error during approval or execution:', error);
			setNotification(
				'Transaction failed! Please check the console for details.',
			);
			setTimeout(() => setNotification(''), 5000);
		}
	};

	useEffect(() => {
		const fetchTokens = async () => {
			try {
				if (!window.ethereum) {
					alert('MetaMask not detected');
					return;
				}

				const provider = new ethers.providers.Web3Provider(
					window.ethereum,
				);
				await provider.send('eth_requestAccounts', []);
				const signer = provider.getSigner();
				const address = await signer.getAddress();

				const balances = await Promise.all(
					TOKEN_ADDRESSES.map(async token => {
						const contract = new ethers.Contract(
							token.address,
							[
								// ERC20 ABI for balanceOf and decimals
								'function balanceOf(address owner) view returns (uint256)',
								'function decimals() view returns (uint8)',
							],
							provider,
						);

						const balance = await contract.balanceOf(address);
						const decimals = await contract.decimals();

						return {
							name: token.name,
							address: token.address,
							balance: ethers.utils.formatUnits(
								balance,
								decimals,
							),
						};
					}),
				);

				setTokens(balances);
				setSelectedToken(balances[0]?.address || '');
				setLoading(false);
			} catch (error) {
				console.error('Error fetching tokens:', error);
				alert('An error occurred while fetching tokens.');
			}
		};

		fetchTokens();
	}, []);

	return (
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h1>Approve and Execute {amount} USDC</h1>
			<h3>
				Network ID: {OPTIMISM_CHAIN_ID} <em>Optimism Network</em>
			</h3>
			<h3>
				Transaction to wallet: {GIVETH_HOUSE_ADDRESS}
				<em>Giveth House</em>
			</h3>
			<div>
				<h3>Select a Token</h3>
				{loading ? (
					<p>Loading tokens...</p>
				) : (
					<select
						value={selectedToken}
						onChange={e => setSelectedToken(e.target.value)}
						style={{ padding: '10px 20px' }}
					>
						{tokens.map(token => (
							<option key={token.address} value={token.address}>
								{token.name} - ${token.balance} -{' '}
								{token.address}
							</option>
						))}
					</select>
				)}
			</div>
			<br />
			<div>
				<h3>Enter Amount</h3>
				<input
					type='text'
					value={amount}
					onChange={e => setAmount(e.target.value)}
					style={{ padding: '10px', width: '200px' }}
				/>
			</div>
			<br />
			<div>
				<h3>Destination Address</h3>
				<input
					type='text'
					value={destinationAddress}
					onChange={e => setDestinationAddress(e.target.value)}
					style={{ padding: '10px', width: '500px' }}
				/>
			</div>
			<br />
			<button
				onClick={handleApproveAndExecute}
				style={{ padding: '10px 20px' }}
			>
				Approve & Execute
			</button>
			{notification && (
				<div
					style={{
						position: 'fixed',
						bottom: '10px',
						right: '10px',
						backgroundColor: '#4caf50',
						color: 'white',
						padding: '15px',
						borderRadius: '5px',
						boxShadow: '0 0 10px rgba(0,0,0,0.2)',
					}}
				>
					{notification}
				</div>
			)}
		</div>
	);
};

export default YourApp;
