import {
	Address,
	TransactionSerializable,
	encodeFunctionData,
	publicActions,
	serializeTransaction,
	keccak256,
	parseGwei,
} from 'viem';
import { getWalletClient } from '@wagmi/core';
import { erc20ABI } from 'wagmi';
import config from '@/configuration';
import { IProject } from '@/apollo/types/types';
import {
	type ITokenStreams,
	type ISelectTokenWithBalance,
} from '@/context/donate.context';

export const findSuperTokenByTokenAddress = (tokenAddress: Address) => {
	return config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
		token => token.underlyingToken.id === tokenAddress,
	);
};

export const findUserStreamOnSelectedToken = (
	address?: Address,
	project?: IProject,
	tokenStreams?: ITokenStreams,
	selectedSuperToken?: ISelectTokenWithBalance,
) => {
	console.log('address', address);
	if (
		!address ||
		!project ||
		!tokenStreams ||
		!selectedSuperToken ||
		!selectedSuperToken.token.isSuperToken
	)
		return;
	const projectOpAddress = project.addresses?.find(
		address => address.networkId === config.OPTIMISM_NETWORK_NUMBER,
	)?.address;
	if (!projectOpAddress) return;
	const tokenStream = tokenStreams[selectedSuperToken.token.id];
	if (!tokenStream) return;
	return tokenStream.find(
		stream =>
			stream.receiver.id.toLowerCase() === projectOpAddress.toLowerCase(),
	);
};

export async function calculateERC20TransferTxHash(
	tokenAddress: Address,
	toAddress: Address,
	amount: bigint,
	chainId: number,
): Promise<{ txHash: string; nonce: number } | undefined> {
	const walletClient = (await getWalletClient({ chainId }))?.extend(
		publicActions,
	);

	if (!walletClient) return;
	console.log('filter| walletClient', walletClient);

	const nonce = await walletClient.getTransactionCount({
		address: walletClient.account.address,
	});

	const gasPrice = await walletClient.getGasPrice().catch(e => {
		console.log('error on getGasPrice', e);
		return parseGwei('1');
	});
	console.log('filter| gasPrice', gasPrice);

	// Encode the transaction data
	const data = encodeFunctionData({
		abi: erc20ABI,
		functionName: 'transferFrom',
		args: [walletClient.account.address, toAddress, amount],
	});
	console.log('filter| data', data);

	// Create the transaction object
	const tx: TransactionSerializable = {
		to: tokenAddress,
		value: 0n,
		data,
		chainId,
		maxFeePerGas: gasPrice,
		maxPriorityFeePerGas: gasPrice / 10n,
		nonce,
	};
	console.log('filter| tx', tx);

	const gasLimit = ((await walletClient.estimateGas(tx)) * 10n) / 10n;
	console.log('filter| estimatedGas', gasLimit);

	tx.gas = gasLimit;
	// tx.type = 'eip1559';

	const s = serializeTransaction(tx);

	// Sign the transaction
	// const signedTx = await walletClient.signTransaction(tx);

	// const txInfo: UnsignedTransaction = {
	// 	nonce, // Replace with the nonce of the sender's address
	// 	// gasPrice: ethers.utils.parseUnits(gasPrice.toString(), 'wei'),
	// 	// type: 2,
	// 	maxFeePerGas: gasPrice,
	// 	maxPriorityFeePerGas: gasPrice / 10n,
	// 	gasLimit: ethers.utils.parseUnits(gasLimit.toString(), 'wei'), // Replace with the desired gas limit
	// 	to: tokenAddress, // Dummy recipient address
	// 	value: ethers.utils.parseUnits('0'), // Replace with the desired value in Ether
	// 	data, // Empty data field
	// };

	// console.log('filter| txInfo', txInfo);

	// try {
	// 	const unsignedTransaction = ethers.utils.serializeTransaction(txInfo);
	// 	const _txHash = ethers.utils.keccak256(unsignedTransaction);
	// 	console.log('filter| _txHash', _txHash);
	// } catch (e) {
	// 	console.log('filter| e', JSON.stringify(e, null, 2));
	// }

	const txHash = keccak256(s);
	// Calculate the transaction hash
	// const txHash = utils.keccak256(signedTx);
	console.log('filter| txHash', txHash);

	return { txHash, nonce };
}
