import { Web3Provider } from '@ethersproject/providers';

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
