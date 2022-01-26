import getSigner from './ethersSigner';

export async function send(
	web3: any,
	toAddress: string,
	contractAddress: string, // if none is set, it defaults to ETH
	subtotal: number,
	sendTransaction: any,
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

		const signer = getSigner(web3);
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
		const err = new Error(error);
		throw err;
	}
}

export async function getHashInfo(txHash: string, isXDAI: boolean, web3: any) {
	try {
		const txInfo = await web3.eth.getTransaction(txHash);
		console.log({ txInfo });
		return txInfo;
	} catch (error: any) {
		console.log({ error });
		throw new Error(error);
	}
}

export async function getTxFromHash(
	transactionHash: string,
	isXDAI: boolean,
	web3: any,
) {
	try {
		return await web3.eth.getTransaction(transactionHash);
	} catch (error) {
		return false;
	}
}

export async function confirmEtherTransaction(
	transactionHash: string,
	callbackFunction: Function,
	count = 0,
	isXDAI: boolean,
	web3: any,
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
					isXDAI,
					web3,
				);
			}, 1000);
		}
	} catch (error) {
		return callbackFunction({ error });
	}
}
