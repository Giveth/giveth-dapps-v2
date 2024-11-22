import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Framework, Operation } from '@superfluid-finance/sdk-core';

const GIVETH_HOUSE_ADDRESS = '0x567c4B141ED61923967cA25Ef4906C8781069a10';

const TOKEN_ADDRESSES = [
	{
		name: 'USDCex',
		address: '0x8430f084b939208e2eded1584889c9a66b90562f',
		decimals: 18,
	},
	{
		name: 'USDC bridged',
		address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
		decimals: 6,
	},
	{
		name: 'USDCx',
		address: '0x35adeb0638eb192755b6e52544650603fe65a006',
		decimals: 18,
	},
	{
		name: 'USDC native',
		address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
		decimals: 6,
	},
];

const OPTIMISM_CHAIN_ID = 10;

const YourApp = () => {
	const [tokens, setTokens] = useState<
		{ name: string; address: string; balance: string }[]
	>([]);
	const [selectedToken, setSelectedToken] = useState('');
	const [destinationAddress, setDestinationAddress] =
		useState(GIVETH_HOUSE_ADDRESS);
	const [loading, setLoading] = useState(true);
	const [amount, setAmount] = useState('0.001'); // Initial amount
	const [notification, setNotification] = useState('');

	const determineTokenType = async (
		sf: {
			loadNativeAssetSuperToken: (arg0: any) => any;
			loadWrapperSuperToken: (arg0: any) => any;
		},
		tokenAddress: any,
	) => {
		let superToken;

		// Check if it's a native super token
		try {
			superToken = await sf.loadNativeAssetSuperToken(tokenAddress);
			console.log('Native Super Token detected.');
			return { type: 'native', superToken };
		} catch (error) {
			console.log('Not a Native Super Token.');
		}

		// Check if it's a wrapper super token
		try {
			superToken = await sf.loadWrapperSuperToken(tokenAddress);
			console.log('Wrapper Super Token detected.');
			return { type: 'wrapper', superToken };
		} catch (error) {
			console.log('Not a Wrapper Super Token.');
		}

		// If both checks fail, it's a regular ERC-20 token
		console.log('Regular ERC-20 token detected.');
		return { type: 'erc20', superToken: null };
	};

	// Function to check if a flow exists
	const checkIfFlowExists = async (
		sf: {
			cfaV1: {
				getFlow: (arg0: {
					superToken: any;
					sender: any;
					receiver: any;
					providerOrSigner: any;
				}) => any;
			};
		},
		superTokenAddress: any,
		senderAddress: any,
		receiverAddress: any,
		signer: any,
	) => {
		try {
			const flowInfo = await sf.cfaV1.getFlow({
				superToken: superTokenAddress,
				sender: senderAddress,
				receiver: receiverAddress,
				providerOrSigner: signer,
			});
			console.log(
				`Existing flow found. Current flow rate: ${flowInfo.flowRate}`,
			);
			return { exists: true, flowRate: flowInfo.flowRate };
		} catch (error) {
			console.log('No existing flow found.');
			return { exists: false, flowRate: '0' };
		}
	};

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

			console.log({ sf });

			const address = await signer.getAddress();

			// Get token details (decimals, etc.)
			const token = TOKEN_ADDRESSES.find(
				t => t.address === selectedToken,
			);
			if (!token) {
				alert('Invalid token selected.');
				return;
			}
			const tokenDecimals = token.decimals;

			// Define the amount to approve (X.XX USDCx)
			const amountToApprove = ethers.utils.parseUnits(
				amount,
				tokenDecimals,
			);

			const flowRatePerSecond = amountToApprove.div(30 * 24 * 60 * 60); // Convert monthly to per-second rate

			// Determine the token type
			const { type, superToken } = await determineTokenType(
				sf,
				selectedToken,
			);

			console.log('Selected token:', selectedToken);
			console.log('Super type:', type);
			console.log('Super Token:', superToken);

			if (type === 'native' || type === 'wrapper') {
				console.log(
					`${type.charAt(0).toUpperCase() + type.slice(1)} Super Token detected`,
				);

				// Attempt to check allowance (skip if it fails)
				let allowance;
				try {
					allowance = await superToken.allowance({
						owner: await signer.getAddress(),
						spender: destinationAddress,
						providerOrSigner: signer,
					});
					console.log(`Current allowance: ${allowance.toString()}`);
				} catch (error) {
					console.log(
						'Allowance does not exist or cannot be fetched. Proceeding to approve...',
					);
				}

				// Approve if needed
				if (ethers.BigNumber.from(allowance).lt(amountToApprove)) {
					const approveOperation = superToken.approve({
						receiver: destinationAddress,
						amount: amountToApprove.toString(),
					});

					const approveTxResponse = await signer.sendTransaction(
						await approveOperation.getPopulatedTransactionRequest(
							signer,
						),
					);
					await approveTxResponse.wait();
					console.log(`Approved ${amount} ${type} super tokens.`);
				}

				// Check for existing flow
				const flowStatus = await checkIfFlowExists(
					sf,
					superToken.address,
					address,
					destinationAddress,
					signer,
				);

				if (flowStatus.exists && flowStatus.flowRate !== '0') {
					// Add new flow rate to existing flow rate
					const newFlowRate = ethers.BigNumber.from(
						flowStatus.flowRate,
					).add(flowRatePerSecond);

					// Update the flow
					const updateFlowOperation = superToken.updateFlow({
						sender: address,
						receiver: destinationAddress,
						flowRate: newFlowRate.toString(), // New total flow rate
					});

					console.log('Updating existing flow...');
					const updateFlowTxResponse = await updateFlowOperation.exec(
						signer,
						70,
					);
					await updateFlowTxResponse.wait();
					console.log('Flow updated successfully.');
					setNotification('Flow updated successfully!');
				} else {
					// Create a new flow if none exists
					const createFlowOperation = superToken.createFlow({
						sender: address,
						receiver: destinationAddress,
						flowRate: flowRatePerSecond.toString(), // New flow rate
					});

					console.log('Creating new flow...');
					const createFlowTxResponse = await createFlowOperation.exec(
						signer,
						2,
					);
					await createFlowTxResponse.wait();
					console.log('Flow created successfully.');
					setNotification('Flow created successfully!');
				}
			} else if (type === 'erc20') {
				console.log('Approving underlying ERC-20 token for upgrade...');

				const operations: Operation[] = [];

				const wrapperSuperToken =
					await sf.loadSuperToken(selectedToken);

				const erc20Contract = new ethers.Contract(
					selectedToken, // Underlying ERC-20 token address
					[
						'function approve(address spender, uint256 amount) public returns (bool)',
					],
					signer,
				);

				// Approve the Super Token contract to spend the ERC-20 token
				const approveTx = await erc20Contract.approve(
					wrapperSuperToken.address, // Address of the Super Token
					amountToApprove.toString(),
				);
				await approveTx.wait();
				console.log('Underlying ERC-20 token approved for upgrade.');

				// Interact with the Super Token contract to perform the upgrade
				// const superTokenAbi = [
				// 	'function upgrade(uint256 amount) external',
				// ];
				// const superTokenContract = new ethers.Contract(
				// 	wrapperSuperToken.address,
				// 	superTokenAbi,
				// 	signer,
				// );

				console.log('Upgrading ERC-20 token to Super Token...');
				const newSuperToken = await sf.loadWrapperSuperToken(
					'0x35adeb0638eb192755b6e52544650603fe65a006',
				);

				console.log({ newSuperToken });

				const upgradeTx = await newSuperToken.upgrade({
					amount: amountToApprove.toString(),
				});
				// await upgradeTx.wait();
				// await upgradeTx.exec(signer);
				operations.push(upgradeTx);
				console.log('Upgrade to Super Token complete.', upgradeTx);

				// Attempt to check allowance (skip if it fails)
				let allowance;
				try {
					allowance = await newSuperToken.allowance({
						owner: await signer.getAddress(),
						spender: destinationAddress,
						providerOrSigner: signer,
					});
					console.log(`Current allowance: ${allowance.toString()}`);
				} catch (error) {
					console.log(
						'Allowance does not exist or cannot be fetched. Proceeding to approve...',
					);
				}

				// Approve if needed
				if (ethers.BigNumber.from(allowance).lt(amountToApprove)) {
					const approveOperation = newSuperToken.approve({
						receiver: destinationAddress,
						amount: amountToApprove.toString(),
					});

					const approveTxResponse = await signer.sendTransaction(
						await approveOperation.getPopulatedTransactionRequest(
							signer,
						),
					);
					await approveTxResponse.wait();
					console.log(`Approved ${amount} ${type} super tokens.`);
				}

				// Create or update the stream
				const flowStatus = await checkIfFlowExists(
					sf,
					newSuperToken.address,
					address,
					destinationAddress,
					signer,
				);

				if (flowStatus.exists && flowStatus.flowRate !== '0') {
					console.log('Updating existing flow...');
					const updateFlowOperation = newSuperToken.updateFlow({
						sender: address,
						receiver: destinationAddress,
						flowRate: flowRatePerSecond.toString(), // New flow rate
					});
					// const flowTxResponse =
					// 	await updateFlowOperation.exec(signer);
					// await flowTxResponse.wait();

					operations.push(updateFlowOperation);

					const batchOp = sf.batchCall(operations);
					const txUpdate = await batchOp.exec(signer, 70);

					console.log('Flow updated successfully.', txUpdate);
					setNotification('Flow updated successfully!');
				} else {
					console.log('Creating new flow...');
					const createFlowOperation = newSuperToken.createFlow({
						sender: address,
						receiver: destinationAddress,
						flowRate: flowRatePerSecond.toString(), // New flow rate
					});
					// const flowTxResponse = await createFlowOperation.exec(
					// 	signer,
					// 	2,
					// );
					// await flowTxResponse.wait();
					operations.push(createFlowOperation);

					const batchOp = sf.batchCall(operations);
					const txCreate = await batchOp.exec(signer, 70);

					console.log('Flow created successfully.', txCreate);
					setNotification('Flow created successfully!');
				}
			}
		} catch (error) {
			console.error('Error during approval or execution:', error);
			setNotification(
				'Transaction failed! Please check the console for details.',
			);
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
				Transaction to wallet: {destinationAddress}
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
