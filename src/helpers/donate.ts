import { Address, encodeFunctionData } from 'viem';
import { getWalletClient } from '@wagmi/core';
import { erc20ABI } from 'wagmi';
import { utils } from 'ethers/lib/ethers';
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
) {
	const walletClient = await getWalletClient({ chainId });
	if (!walletClient) return;
	console.log('filter| walletClient', walletClient);

	// Encode the transaction data
	const data = encodeFunctionData({
		abi: erc20ABI,
		functionName: 'transferFrom',
		args: [walletClient.account.address, toAddress, amount],
	});
	console.log('filter| data', data);

	// Create the transaction object
	const tx = {
		to: tokenAddress,
		value: 0n,
		data: data,
	};
	console.log('filter| tx', tx);

	// Sign the transaction
	const signedTx = await walletClient.signTransaction(tx);
	console.log('filter| signedTx', signedTx);

	// Calculate the transaction hash
	const txHash = utils.keccak256(signedTx);
	console.log('filter| txHash', txHash);

	return txHash;
}
