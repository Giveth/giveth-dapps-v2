import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { getConnectorClient } from '@wagmi/core';
import { formatUnits } from 'viem';
import { ethers } from 'ethers';
import { wagmiConfig } from '@/wagmiConfigs';

// Squid Router configuration
// const SQUID_API_BASE_URL = 'https://v2.api.squidrouter.com';
const SQUID_API_BASE_URL = 'https://apiplus.squidrouter.com';

interface Network {
	id: string;
	name: string;
	chainId: number;
}

interface Token {
	address: string;
	symbol: string;
	name: string;
	decimals: number;
	balance?: string;
}

const YourApp = () => {
	const { address: currentUserAddress } = useAccount();
	const [fromAddress, setFromAddress] = useState(currentUserAddress || '');
	const [toAddress, setToAddress] = useState(
		'0x495A28448A06B0DF634750EB062311dDC40B3ae5',
	);
	const [amount, setAmount] = useState('');
	const [sourceNetwork, setSourceNetwork] = useState('137'); // Default Polygon
	const [selectedSourceToken, setSelectedSourceToken] = useState('');
	const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingTokens, setIsLoadingTokens] = useState(false);

	// Available test networks
	const networks: Network[] = [{ id: '137', name: 'Polygon', chainId: 137 }];

	// Test Giveth token on Polygon (destination)
	// const destinationGivethToken: Token = {
	// 	address: '0xc4df120d75604307dcB604fde2AD3b8a8B7c6FAA',
	// 	symbol: 'GIV',
	// 	name: 'Test Giveth Token',
	// 	decimals: 18,
	// };
	const destinationGivethToken: Token = {
		// address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
		address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
		symbol: 'USDC',
		name: 'USDC Token',
		decimals: 6,
	};

	// Get native token balance (POL)
	const { data: nativeBalance } = useBalance({
		address: currentUserAddress,
		chainId: parseInt(sourceNetwork),
	});

	// ERC20 ABI for balanceOf function
	const erc20Abi = [
		{
			name: 'balanceOf',
			type: 'function',
			stateMutability: 'view',
			inputs: [{ name: 'account', type: 'address' }],
			outputs: [{ name: '', type: 'uint256' }],
		},
	] as const;

	// USDT balance on Polygon
	const { data: usdtBalance } = useReadContract({
		address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: currentUserAddress ? [currentUserAddress] : undefined,
		chainId: 137,
	});

	// USDC balance on Polygon
	const { data: usdcBalance } = useReadContract({
		address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: currentUserAddress ? [currentUserAddress] : undefined,
		chainId: 137,
	});

	// Function to get token balance
	const getTokenBalance = (
		tokenAddress: string,
		decimals: number,
	): string => {
		if (!currentUserAddress) return '0.0000';

		try {
			// For native token (POL), use the native balance
			if (tokenAddress === '0x0000000000000000000000000000000000000000') {
				if (nativeBalance) {
					return parseFloat(
						formatUnits(
							nativeBalance.value,
							nativeBalance.decimals,
						),
					).toFixed(4);
				}
				return '0.0000';
			}

			// For USDT
			if (tokenAddress === '0xc2132D05D31c914a87C6611C10748AEb04B58e8F') {
				if (usdtBalance) {
					return parseFloat(
						formatUnits(usdtBalance as bigint, decimals),
					).toFixed(4);
				}
				return '0.0000';
			}

			// For USDC
			if (tokenAddress === '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359') {
				if (usdcBalance) {
					return parseFloat(
						formatUnits(usdcBalance as bigint, decimals),
					).toFixed(4);
				}
				return '0.0000';
			}

			return '0.0000';
		} catch (error) {
			console.error('Error formatting token balance:', error);
			return '0.0000';
		}
	};

	// Update fromAddress when wallet connects
	useEffect(() => {
		if (currentUserAddress) {
			setFromAddress(currentUserAddress);
		}
	}, [currentUserAddress]);

	// Load available tokens when source network changes
	useEffect(() => {
		const loadTokensForNetwork = () => {
			setIsLoadingTokens(true);
			try {
				// Test tokens on different networks
				const networkTokens: { [key: string]: Token[] } = {
					'137': [
						{
							address:
								'0x0000000000000000000000000000000000000000',
							symbol: 'POL',
							name: 'Polygon',
							decimals: 18,
						},
						{
							address:
								'0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
							symbol: 'USDT',
							name: 'Tether USD',
							decimals: 6,
						},
						{
							address:
								'0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
							symbol: 'USDC',
							name: 'USD Coin',
							decimals: 6,
						},
					],
				};

				const tokens = networkTokens[sourceNetwork] || [];

				// Add real balances to tokens
				const tokensWithBalances = tokens.map(token => ({
					...token,
					balance: getTokenBalance(token.address, token.decimals),
				}));

				setAvailableTokens(tokensWithBalances);
				if (tokensWithBalances.length > 0) {
					setSelectedSourceToken(tokensWithBalances[0].address);
				}
			} catch (error) {
				console.error('Error loading tokens:', error);
			} finally {
				setIsLoadingTokens(false);
			}
		};

		if (sourceNetwork && currentUserAddress) {
			loadTokensForNetwork();
		}
	}, [
		sourceNetwork,
		currentUserAddress,
		nativeBalance,
		usdtBalance,
		usdcBalance,
	]);

	const getSquidRoute = async () => {
		try {
			setIsLoading(true);

			const sourceToken = availableTokens.find(
				t => t.address === selectedSourceToken,
			);

			if (!sourceToken) {
				throw new Error('Source token not found');
			}

			const params = {
				fromAddress: fromAddress,
				fromChain: '137',
				fromToken: sourceToken.address,
				fromAmount: (
					parseFloat(amount) * Math.pow(10, sourceToken.decimals)
				).toString(),
				toChain: '137', // Always Polygon for destination
				toToken: destinationGivethToken.address,
				toAddress: toAddress,
				// slippage: '1.0',
				quoteOnly: false,
			};

			const response = await fetch(`${SQUID_API_BASE_URL}/v2/route`, {
				method: 'POST',
				headers: {
					'x-integrator-id':
						'giveth-test-45254b91-2ae7-4007-95db-80d465492e2c',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const route = await response.json();
			console.log('Squid Route:', route);

			return route;
		} catch (error) {
			console.error('Error getting Squid route:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const executeTransaction = async (route: any) => {
		try {
			console.log('Executing transaction with route:', route);
			const squidTransactionRequest = route.transactionRequest;

			const sourceToken = route.estimate.fromToken;
			const fromAmount = route.estimate.fromAmount;

			await approveSpending(
				squidTransactionRequest?.target,
				sourceToken.address,
				fromAmount,
			);

			const signer = await getEthersSigner();

			const tx = await signer.sendTransaction({
				to: squidTransactionRequest.target,
				data: squidTransactionRequest.data,
				value: squidTransactionRequest.value,
				// gasPrice: (await provider.getFeeData()).gasPrice,
				gasLimit: squidTransactionRequest.gasLimit,
			});
			console.log(tx.hash);

			// if (
			// 	squidTransactionRequest &&
			// 	squidTransactionRequest.data &&
			// 	squidTransactionRequest.to
			// ) {
			// 	const signer = await getEthersSigner();
			// 	const tx = await signer.sendTransaction({
			// 		to: squidTransactionRequest.to,
			// 		data: squidTransactionRequest.data,
			// 		value: squidTransactionRequest.value
			// 			? ethers.BigNumber.from(squidTransactionRequest.value)
			// 			: undefined,
			// 		gasLimit: squidTransactionRequest.gasLimit
			// 			? ethers.BigNumber.from(
			// 					squidTransactionRequest.gasLimit,
			// 				)
			// 			: undefined,
			// 	});
			// console.log('Submitted transaction:', tx.hash);
			// await tx.wait();
			// 	console.log('Transaction confirmed');
			// } else {
			// 	console.warn('Skipping execution: No transactionRequest found');
			// }

			console.log('Transaction:', squidTransactionRequest);
		} catch (error) {
			console.error('Error executing transaction:', error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!amount || parseFloat(amount) <= 0) {
			alert('Please enter a valid amount');
			return;
		}

		if (!fromAddress || !toAddress) {
			alert('Please ensure both addresses are filled');
			return;
		}

		if (!selectedSourceToken) {
			alert('Please select a source token');
			return;
		}

		try {
			const sourceToken = availableTokens.find(
				t => t.address === selectedSourceToken,
			);
			console.log('Form submitted with data:', {
				fromAddress,
				toAddress,
				amount,
				sourceNetwork: networks.find(n => n.id === sourceNetwork)?.name,
				sourceToken: sourceToken?.symbol,
				destinationNetwork: 'Polygon',
				destinationToken: 'USDC',
			});

			const routeData = await getSquidRoute();
			if (routeData?.route) {
				await executeTransaction(routeData.route); // pass the inner `route`
			}
		} catch (error) {
			console.error('Transaction failed:', error);
			alert('Transaction failed. Check console for details.');
		}
	};

	const selectedToken = availableTokens.find(
		t => t.address === selectedSourceToken,
	);

	return (
		<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
			<h1>Cross-Chain Token Transfer</h1>
			<p style={{ color: '#666', marginBottom: '20px' }}>
				Transfer tokens from Polygon & Gnosis networks to Giveth Token
				(GIV) on Polygon using Squid Router
			</p>

			<form
				onSubmit={handleSubmit}
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '15px',
				}}
			>
				<div>
					<label
						htmlFor='fromAddress'
						style={{ display: 'block', marginBottom: '5px' }}
					>
						From Address (Current User):
					</label>
					<input
						type='text'
						id='fromAddress'
						value={fromAddress}
						onChange={e => setFromAddress(e.target.value)}
						placeholder='Current user wallet address'
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontSize: '14px',
						}}
					/>
				</div>

				<div>
					<label
						htmlFor='toAddress'
						style={{ display: 'block', marginBottom: '5px' }}
					>
						To Address (Polygon Recipient):
					</label>
					<input
						type='text'
						id='toAddress'
						value={toAddress}
						onChange={e => setToAddress(e.target.value)}
						placeholder='Polygon recipient address'
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontSize: '14px',
						}}
					/>
				</div>

				<div>
					<label
						htmlFor='sourceNetwork'
						style={{ display: 'block', marginBottom: '5px' }}
					>
						Source Network:
					</label>
					<select
						id='sourceNetwork'
						value={sourceNetwork}
						onChange={e => setSourceNetwork(e.target.value)}
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontSize: '14px',
						}}
					>
						{networks.map(network => (
							<option key={network.id} value={network.id}>
								{network.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						htmlFor='sourceToken'
						style={{ display: 'block', marginBottom: '5px' }}
					>
						Source Token {isLoadingTokens && '(Loading...)'}:
					</label>
					<select
						id='sourceToken'
						value={selectedSourceToken}
						onChange={e => setSelectedSourceToken(e.target.value)}
						disabled={
							isLoadingTokens || availableTokens.length === 0
						}
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontSize: '14px',
							backgroundColor: isLoadingTokens
								? '#f5f5f5'
								: 'white',
						}}
					>
						{availableTokens.map(token => (
							<option key={token.address} value={token.address}>
								{token.symbol} - Balance: {token.balance}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						htmlFor='amount'
						style={{ display: 'block', marginBottom: '5px' }}
					>
						Amount ({selectedToken?.symbol || 'Token'}):
					</label>
					<input
						type='number'
						id='amount'
						value={amount}
						onChange={e => setAmount(e.target.value)}
						placeholder={`Enter amount in ${selectedToken?.symbol || 'tokens'}`}
						step='0.000001'
						min='0'
						max={selectedToken?.balance || undefined}
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontSize: '14px',
						}}
					/>
					{selectedToken?.balance && (
						<small style={{ color: '#666' }}>
							Available: {selectedToken.balance}{' '}
							{selectedToken.symbol}
						</small>
					)}
				</div>

				<div>
					<label style={{ display: 'block', marginBottom: '5px' }}>
						Destination Network: Polygon (Fixed)
					</label>
					<input
						type='text'
						value='Polygon'
						disabled
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontSize: '14px',
							backgroundColor: '#f5f5f5',
							color: '#666',
						}}
					/>
				</div>

				<div>
					<label style={{ display: 'block', marginBottom: '5px' }}>
						Destination Token: USDC (USDC Token)
					</label>
					<input
						type='text'
						value='USDC - USDC Token'
						disabled
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontSize: '14px',
							backgroundColor: '#f5f5f5',
							color: '#666',
						}}
					/>
					<small style={{ color: '#666' }}>
						Token Address: {destinationGivethToken.address}
					</small>
				</div>

				<div
					style={{
						padding: '10px',
						backgroundColor: '#e8f5e8',
						borderRadius: '4px',
						fontSize: '14px',
						border: '1px solid #4caf50',
					}}
				>
					<strong>🔄 Cross-Chain Transaction Details:</strong>
					<br />
					From: {networks.find(n => n.id === sourceNetwork)?.name} (
					{selectedToken?.symbol || 'Token'}) → To: Polygon (USDC)
					<br />
					Amount: {amount || '0'} {selectedToken?.symbol || 'Token'}
					<br />
					<small>Recipient: {toAddress}</small>
				</div>

				<button
					type='submit'
					disabled={
						isLoading || isLoadingTokens || !selectedSourceToken
					}
					style={{
						padding: '12px 24px',
						backgroundColor:
							isLoading || isLoadingTokens || !selectedSourceToken
								? '#ccc'
								: '#4caf50',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						fontSize: '16px',
						cursor:
							isLoading || isLoadingTokens || !selectedSourceToken
								? 'not-allowed'
								: 'pointer',
					}}
				>
					{isLoading
						? 'Getting Route...'
						: '🔄 Get Cross-Chain Route & Execute'}
				</button>
			</form>

			{currentUserAddress && (
				<div
					style={{
						marginTop: '20px',
						padding: '10px',
						backgroundColor: '#f8f9fa',
						borderRadius: '4px',
					}}
				>
					<strong>Connected Wallet:</strong> {currentUserAddress}
				</div>
			)}
		</div>
	);
};

export default YourApp;

export const approveSpending = async (
	transactionRequestTarget: string,
	fromToken: string,
	fromAmount: string,
) => {
	const erc20Abi = [
		'function approve(address spender, uint256 amount) public returns (bool)',
	];

	const signer = await getEthersSigner();
	const tokenContract = new ethers.Contract(fromToken, erc20Abi, signer);

	try {
		const tx = await tokenContract.approve(
			transactionRequestTarget,
			fromAmount,
		);
		await tx.wait();
		console.log(`
      Approved ${fromAmount} tokens for ${transactionRequestTarget}`);
	} catch (error) {
		console.error('Approval failed:', error);
		throw error;
	}
};

export const getEthersSigner = async (): Promise<ethers.Signer> => {
	const client = await getConnectorClient(wagmiConfig);

	if (!client) {
		throw new Error('No connector client found');
	}

	// ethers v5 compatible
	const provider = new ethers.providers.Web3Provider(client as any); // cast needed if type mismatch
	return provider.getSigner();
};
