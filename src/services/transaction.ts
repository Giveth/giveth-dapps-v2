import { Web3Provider } from '@ethersproject/providers';

export async function send(
	web3: Web3Provider,
	toAddress: string,
	contractAddress: string, // if none is set, it defaults to ETH
	subtotal: number,
	sendTransaction: Function,
	txCallbacks: any,
	traceable: boolean,
) {
	try {
		const transaction = {
			to: toAddress,
			// I CHANGED THIS: IMPORTANT
			// value: ethers.utils.parseEther(subtotal.toString())
			value: subtotal.toString(),
		};
		let hash;

		const signer = web3?.getSigner();
		const signerTransaction = await sendTransaction(
			web3,
			transaction,
			txCallbacks,
			contractAddress,
			signer,
			traceable,
		);
		console.log('look here', { signerTransaction });
		hash = signerTransaction?.hash;

		if (!hash) throw new Error('Transaction failed');

		return hash;
	} catch (error: any) {
		throw error;
	}
}

export interface IEthTxConfirmation {
	status: string;
	tooSlow: boolean;
	error?: any;
}

export async function confirmEtherTransaction(
	transactionHash: string,
	callbackFunction: Function,
	count = 0,
	web3: Web3Provider,
) {
	try {
		const MAX_INTENTS = 20; // one every second
		const receipt = await web3?.getTransactionReceipt(transactionHash);
		if (receipt !== null) {
			// Transaction went through
			if (callbackFunction) {
				callbackFunction({ ...receipt, tooSlow: false });
			}
		} else if (count >= MAX_INTENTS) {
			callbackFunction({ tooSlow: true });
		} else {
			// Try again in 1 second
			setTimeout(function () {
				confirmEtherTransaction(
					transactionHash,
					callbackFunction,
					++count,
					web3,
				);
			}, 1000);
		}
	} catch (error) {
		return callbackFunction({ error });
	}
}
