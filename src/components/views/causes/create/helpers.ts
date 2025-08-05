import { getConnectorClient, readContract, writeContract } from '@wagmi/core';
import { Address, erc20Abi } from 'viem';
import { ethers } from 'ethers';
import { CAUSE_TITLE_IS_VALID } from '@/apollo/gql/gqlCauses';
import { backendGQLRequest } from '@/helpers/requests';
import { wagmiConfig } from '@/wagmiConfigs';

export const gqlCauseTitleValidation = async (
	title: string,
	locale: string,
) => {
	try {
		const { data, errors } = await backendGQLRequest(
			CAUSE_TITLE_IS_VALID,
			{ title },
			{ 'accept-language': locale },
		);
		if (errors) throw new Error(errors[0].message);
		return data.isValidTitleForCause;
	} catch (error: any) {
		return error.message;
	}
};

/**
 * Approves a token transfer.
 *
 * @param tokenAddress - ERC-20 token contract address
 * @param spender - Address allowed to spend the tokens
 * @param amount - Amount to approve (as BigInt)
 * @param chainId - Chain ID
 * @returns Transaction hash if successful, null if failed
 */
export async function approveTokenTransfer({
	tokenAddress,
	spender,
	amount,
	chainId,
}: {
	tokenAddress: Address;
	spender: Address;
	amount: bigint;
	chainId: number;
}): Promise<`0x${string}` | null> {
	try {
		const txHash = await writeContract(wagmiConfig, {
			address: tokenAddress,
			abi: erc20Abi,
			functionName: 'approve',
			args: [spender, amount],
			chainId,
		});

		return txHash;
	} catch (error) {
		console.error('Approval failed:', error);
		return null;
	}
}

/**
 * Checks if a token allowance is sufficient.
 *
 * @param tokenAddress - ERC-20 token contract address
 * @param owner - User wallet address
 * @param spender - Address allowed to spend the tokens
 * @param requiredAmount - Minimum amount required (as BigInt)
 * @param chainId - Chain ID
 * @returns boolean - true if approved, false if not
 */
export async function checkTokenApproval({
	tokenAddress,
	owner,
	spender,
	requiredAmount,
	chainId,
}: {
	tokenAddress: Address;
	owner: Address;
	spender: Address;
	requiredAmount: bigint;
	chainId: number;
}): Promise<boolean> {
	try {
		const allowance = await readContract(wagmiConfig, {
			address: tokenAddress,
			abi: erc20Abi,
			functionName: 'allowance',
			args: [owner, spender],
			chainId,
		});

		return allowance >= requiredAmount;
	} catch (error) {
		console.error('Failed to read token allowance:', error);
		return false;
	}
}

/**
 * Transfers a token.
 *
 * @param tokenAddress - ERC-20 token contract address
 * @param to - Address to transfer the tokens to
 * @param amount - Amount to transfer (as BigInt)
 * @param chainId - Chain ID
 * @returns Transaction hash if successful, null if failed
 */
export async function transferToken({
	tokenAddress,
	to,
	amount,
	chainId,
}: {
	tokenAddress: Address;
	to: Address;
	amount: bigint;
	chainId: number;
}): Promise<`0x${string}` | null> {
	try {
		const txHash = await writeContract(wagmiConfig, {
			address: tokenAddress,
			abi: erc20Abi,
			functionName: 'transfer',
			args: [to, amount],
			chainId,
		});

		return txHash;
	} catch (error) {
		console.error('Token transfer failed:', error);
		return null;
	}
}

export const getEthersSigner = async (): Promise<ethers.Signer> => {
	const client = await getConnectorClient(wagmiConfig);

	if (!client) throw new Error('No connector client found');

	const provider = new ethers.providers.Web3Provider(client as any);
	return provider.getSigner();
};
