import { Contract, ethers } from 'ethers';
import { getEthersSigner } from '@/helpers/ethers';

const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const isTokenSupportedBySquid = async (
	chainId: number,
	tokenAddress: string,
): Promise<boolean> => {
	// We need to check if the token is the native token or the zero address
	// because squid doesn't support the zero address
	const tokenAddressCheck =
		tokenAddress.toLowerCase() === ZERO_ADDRESS
			? NATIVE_TOKEN_ADDRESS
			: tokenAddress;

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SQUID_API_BASE_URL}/v2/tokens?chainId=${chainId}`,
			{
				method: 'GET',
				headers: {
					'x-integrator-id':
						process.env.NEXT_PUBLIC_SQUID_API_INTEGRATOR_ID || '',
					'Content-Type': 'application/json',
				},
			},
		);
		if (!response.ok)
			throw new Error('Failed to fetch token list from Squid router');
		const data = await response.json();

		const supported = data.tokens?.some(
			(t: any) =>
				t.address.toLowerCase() === tokenAddressCheck.toLowerCase(),
		);

		return supported;
	} catch (error) {
		console.error('Error checking token support from Squid router:', error);
		return false;
	}
};

export const checkAllowance = async (
	owner: string,
	spender: string,
	tokenAddress: string,
): Promise<bigint> => {
	const abi = [
		'function allowance(address owner, address spender) view returns (uint256)',
	];
	const signer = await getEthersSigner();
	const contract = new Contract(tokenAddress, abi, signer);

	try {
		const allowance: bigint = await contract.allowance(owner, spender);
		return allowance;
	} catch (error) {
		console.error('Error checking allowance:', error);
		return 0n;
	}
};

export const approveSpending = async (
	spender: string,
	tokenAddress: string,
	amount: string,
) => {
	const erc20Abi = [
		'function approve(address spender, uint256 amount) public returns (bool)',
	];
	const signer = await getEthersSigner();
	const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

	const tx = await tokenContract.approve(spender, amount);
	await tx.wait();
	console.log(`Approved ${amount} tokens for ${spender}`);
};

export const executeSquidTransaction = async (route: any) => {
	const txRequest = route?.transactionRequest;
	if (!txRequest) throw new Error('No transaction request found');

	const signer = await getEthersSigner();
	const tx = await signer.sendTransaction({
		to: txRequest.target,
		data: txRequest.data,
		value: txRequest.value,
		gasLimit: txRequest.gasLimit,
	});

	await tx.wait();
	console.log('Transaction sent:', tx.hash);
};
