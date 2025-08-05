import { Contract, ethers } from 'ethers';
import { getConnectorClient } from 'wagmi/actions';
import { captureException } from '@sentry/nextjs';
import { wagmiConfig } from '@/wagmiConfigs';
import { EDonationFailedType } from '@/components/modals/FailedDonation';
import { IOnTxHash } from '@/services/donation';
import { client } from '@/apollo/apolloClient';
import { CREATE_CAUSE_DONATION } from '@/apollo/gql/gqlDonations';
import { SENTRY_URGENT } from '@/configuration';

const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Check if the token is supported by Squid router
 *
 * @param chainId - The chain ID
 * @param tokenAddress - The token address
 * @returns true if the token is supported, false otherwise
 */
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

/**
 * Check the allowance of a token
 *
 * @param owner - The owner of the token
 * @param spender - The spender of the token
 * @param tokenAddress - The token address
 * @returns the allowance of the token
 */
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

/**
 * Approve spending of a token
 *
 * @param spender - The spender of the token
 * @param tokenAddress - The token address
 * @param amount - The amount to approve
 */
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

	try {
		const tx = await tokenContract.approve(spender, amount);
		await tx.wait();
		return tx;
	} catch (error: any) {
		if (error.code === 'ACTION_REJECTED') {
			console.warn('User rejected the transaction.');
			return null;
		}
		console.error('Approval transaction failed:', error);
		throw error;
	}
};

export const approveSpendingSquid = async (
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
		console.log(
			`Approved ${fromAmount} tokens for ${transactionRequestTarget}`,
		);
		return tx;
	} catch (error) {
		console.error('Approval failed:', error);
		throw error;
	}
};

/**
 * Fetch a route from the Squid API
 *
 * @param params - Squid route parameters
 * @returns the route object from Squid
 */
export const getSquidRoute = async (params: {
	fromAddress: string;
	fromChain: string;
	fromToken: string;
	fromAmount: string;
	toChain: string;
	toToken: string;
	toAddress: string;
	quoteOnly?: boolean;
}) => {
	const tokenAddressCheck =
		params.fromToken.toLowerCase() === ZERO_ADDRESS
			? NATIVE_TOKEN_ADDRESS
			: params.fromToken;

	const checkedParams = {
		...params,
		fromToken: tokenAddressCheck,
	};

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SQUID_API_BASE_URL}/v2/route`,
			{
				method: 'POST',
				headers: {
					'x-integrator-id':
						process.env.NEXT_PUBLIC_SQUID_API_INTEGRATOR_ID || '',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...checkedParams,
					quoteOnly: checkedParams.quoteOnly ?? false,
				}),
			},
		);

		if (!response.ok) {
			console.error(
				`Failed to fetch Squid route: ${response.status}`,
				response,
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching Squid route:', error);
		return error;
	}
};

/**
 * Execute a transaction through Squid router
 *
 * @param route - The route to execute
 */
export const executeSquidTransaction = async (
	route: any,
	setFailedModalType?: (type: EDonationFailedType) => void,
) => {
	const txRequest = route?.transactionRequest;
	if (!txRequest) throw new Error('No transaction request found');

	const signer = await getEthersSigner();
	const tx = await signer.sendTransaction({
		to: txRequest.target,
		data: txRequest.data,
		value: txRequest.value,
		gasLimit: txRequest.gasLimit,
	});

	try {
		await tx.wait();
		console.log('Squid transaction sent:', tx.hash);
		return tx;
	} catch (error: any) {
		if (error.code === 'ACTION_REJECTED') {
			setFailedModalType?.(EDonationFailedType.REJECTED);
			return error;
		}
		console.error('Squid transaction failed:', error);
		return error;
	}
};

/**
 * Get the ethers signer
 *
 * @returns the ethers signer
 */
const getEthersSigner = async (): Promise<ethers.Signer> => {
	const client = await getConnectorClient(wagmiConfig);

	if (!client) {
		throw new Error('No connector client found');
	}

	// ethers v5 compatible
	const provider = new ethers.providers.Web3Provider(client as any); // cast needed if type mismatch
	return provider.getSigner();
};

const SAVE_CAUSE_DONATION_ITERATIONS = 5;
let saveCauseDonationIteration = 0;

export async function saveCauseDonation(props: IOnTxHash) {
	try {
		return await createCauseDonation(props);
	} catch (error) {
		saveCauseDonationIteration++;
		if (saveCauseDonationIteration >= SAVE_CAUSE_DONATION_ITERATIONS) {
			saveCauseDonationIteration = 0;
			throw error;
		} else return saveCauseDonation(props);
	}
}

const createCauseDonation = async (props: IOnTxHash) => {
	const {
		chainId,
		amount,
		token,
		projectId,
		anonymous,
		nonce,
		chainvineReferred,
		safeTransactionId,
		draftDonationId,
		useDonationBox,
		relevantDonationTxHash,
		swapData,
	} = props;
	const { address, symbol } = token;
	let donationId = 0;

	try {
		const { data } = await client.mutate({
			mutation: CREATE_CAUSE_DONATION,
			variables: {
				transactionNetworkId: chainId,
				nonce,
				amount,
				token: symbol,
				projectId,
				tokenAddress: address,
				anonymous,
				referrerId: chainvineReferred,
				safeTransactionId,
				draftDonationId,
				useDonationBox,
				relevantDonationTxHash,
				swapData,
			},
		});
		donationId = data.createDonation;
	} catch (error) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.error('createDonation error: ', error);
		throw error;
	}

	return donationId;
};
