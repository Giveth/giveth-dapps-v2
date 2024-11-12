import React from 'react';
import { ethers } from 'ethers';
import { Framework } from '@superfluid-finance/sdk-core';
import config from '@/configuration';

const YourApp = () => {
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
				chainId: config.OPTIMISM_CONFIG.id,
				provider,
			});

			// WORK 0x35adeb0638eb192755b6e52544650603fe65a006 USDCx
			// NOT WORK 0x8430f084b939208e2eded1584889c9a66b90562f USDC.ex

			const address = await signer.getAddress();
			const usdcx = await sf.loadWrapperSuperToken(
				'0x8430f084b939208e2eded1584889c9a66b90562f',
			);
			const spenderAddress = '0x567c4B141ED61923967cA25Ef4906C8781069a10';

			// Define the amount to approve (0.1 USDCx)
			const amountToApprove = ethers.utils.parseUnits('0.01', 18);

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
				console.log('Approved 0.01 USDCx for spending.');
			} else {
				console.log('Already approved for 0.01 USDCx.');
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
		} catch (error) {
			console.error('Error during approval or execution:', error);
			alert('An error occurred. Check console for details.');
		}
	};

	return (
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h1>Approve and Execute 0.1 USDC.ex</h1>
			<button onClick={handleApproveAndExecute}>Approve & Execute</button>
		</div>
	);
};

export default YourApp;
