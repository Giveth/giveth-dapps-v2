import { Address, Hex, encodeFunctionData, isAddress, zeroAddress } from 'viem';
import {
	getBalance,
	waitForTransactionReceipt,
	writeContract,
} from '@wagmi/core';
import { wagmiConfig } from '@/wagmiConfigs';
import { IToken } from '@/types/superFluid';
import superTokenABI from '@/artifacts/superToken.json';
import ISETH from '@/artifacts/ISETH.json';
import anchorContractABI from '@/artifacts/anchorContract.json';

// Claiming a recurring donation moves the super tokens that streamed into the
// project's Allo Anchor contract to the project's recipient address.
//
// Wrapper super tokens (USDCx, DAIx, ...) are downgraded straight to the
// recipient with a single `execute(superToken, 0, downgradeTo(recipient, amount))`.
//
// ETHx is a native-asset super token: `downgradeToETH(amount)` can only send
// native ETH back to the caller, which is the Anchor itself. A second
// `execute(recipient, value, "")` then forwards the native ETH. Every amount in
// this file is a bigint in wei; they must never be converted to a JavaScript
// Number, which cannot represent wei amounts above 2^53 exactly.

export enum EClaimStep {
	DOWNGRADE = 'downgrade',
	TRANSFER = 'transfer',
}

export class ClaimTransactionError extends Error {
	step: EClaimStep;
	// Set when the transaction was mined but reverted.
	txHash?: Hex;

	constructor(
		step: EClaimStep,
		message: string,
		txHash?: Hex,
		cause?: unknown,
	) {
		super(message);
		this.name = 'ClaimTransactionError';
		this.step = step;
		this.txHash = txHash;
		this.cause = cause;
	}
}

export const isETHxToken = (token: Pick<IToken, 'symbol'>) =>
	token.symbol.toLowerCase() === 'ethx';

const assertBigintAmount = (amount: unknown): amount is bigint => {
	if (typeof amount !== 'bigint') {
		throw new TypeError(
			`Claim amount must be a bigint, received ${typeof amount}`,
		);
	}
	return true;
};

export const encodeDowngradeCallData = ({
	isETHx,
	amount,
	projectAddress,
}: {
	isETHx: boolean;
	amount: bigint;
	projectAddress: Address;
}): Hex => {
	assertBigintAmount(amount);
	if (amount <= 0n) {
		throw new RangeError('Claim amount must be greater than zero');
	}
	return isETHx
		? encodeFunctionData({
				abi: ISETH.abi,
				functionName: 'downgradeToETH',
				args: [amount],
			})
		: encodeFunctionData({
				abi: superTokenABI.abi,
				functionName: 'downgradeTo',
				args: [projectAddress, amount],
			});
};

export interface IClaimDependencies {
	writeContract: (params: {
		chainId: number;
		address: Address;
		functionName: 'execute';
		args: [Address, bigint, Hex];
	}) => Promise<Hex>;
	waitForTransactionReceipt: (params: {
		chainId: number;
		hash: Hex;
	}) => Promise<{ status: 'success' | 'reverted' }>;
	getNativeBalance: (params: {
		chainId: number;
		address: Address;
	}) => Promise<bigint>;
}

export const defaultClaimDependencies: IClaimDependencies = {
	writeContract: params =>
		writeContract(wagmiConfig, {
			abi: anchorContractABI.abi,
			...params,
		}),
	waitForTransactionReceipt: params =>
		waitForTransactionReceipt(wagmiConfig, params),
	getNativeBalance: async params =>
		(await getBalance(wagmiConfig, params)).value,
};

export interface IExecuteAnchorClaimParams {
	chainId: number;
	anchorContractAddress: Address;
	projectAddress: Address;
	token: IToken;
	amount: bigint;
	onDowngradeSent?: (txHash: Hex) => void;
	onTransferStarted?: (amount: bigint) => void;
	onTransferSent?: (txHash: Hex) => void;
}

export interface IExecuteAnchorClaimResult {
	downgradeTxHash: Hex;
	// Only set for ETHx claims. Undefined when nothing was left to transfer.
	transferTxHash?: Hex;
	transferredAmount: bigint;
}

const executeOnAnchor = async (
	deps: IClaimDependencies,
	step: EClaimStep,
	params: {
		chainId: number;
		anchorContractAddress: Address;
		args: [Address, bigint, Hex];
		onSent?: (txHash: Hex) => void;
	},
): Promise<Hex> => {
	let txHash: Hex;
	try {
		txHash = await deps.writeContract({
			chainId: params.chainId,
			address: params.anchorContractAddress,
			functionName: 'execute',
			args: params.args,
		});
	} catch (error) {
		// Wallet rejection, chain mismatch, or a simulation revert (for example
		// a recipient contract refusing ETH). The cause is kept so callers can
		// still recognise user rejections.
		throw new ClaimTransactionError(
			step,
			`Claim ${step} transaction could not be sent`,
			undefined,
			error,
		);
	}
	params.onSent?.(txHash);
	const receipt = await deps.waitForTransactionReceipt({
		chainId: params.chainId,
		hash: txHash,
	});
	if (receipt?.status !== 'success') {
		throw new ClaimTransactionError(
			step,
			`Claim ${step} transaction reverted`,
			txHash,
		);
	}
	return txHash;
};

// Runs the full claim against the Anchor on `chainId`. Each transaction is
// confirmed and its receipt checked before the next one is sent, so a
// reverted downgrade never triggers the native ETH transfer.
export const executeAnchorClaim = async (
	{
		chainId,
		anchorContractAddress,
		projectAddress,
		token,
		amount,
		onDowngradeSent,
		onTransferStarted,
		onTransferSent,
	}: IExecuteAnchorClaimParams,
	deps: IClaimDependencies = defaultClaimDependencies,
): Promise<IExecuteAnchorClaimResult> => {
	assertBigintAmount(amount);
	// Non-strict: backend addresses are not guaranteed to carry an EIP-55
	// checksum, and viem encodes addresses without checking it either.
	if (
		!isAddress(projectAddress, { strict: false }) ||
		projectAddress.toLowerCase() === zeroAddress
	) {
		throw new Error('Project recipient address is not valid');
	}
	if (!isAddress(anchorContractAddress, { strict: false })) {
		throw new Error('Anchor contract address is not valid');
	}
	const isETHx = isETHxToken(token);

	const downgradeTxHash = await executeOnAnchor(deps, EClaimStep.DOWNGRADE, {
		chainId,
		anchorContractAddress,
		args: [
			token.id,
			0n,
			encodeDowngradeCallData({ isETHx, amount, projectAddress }),
		],
		onSent: onDowngradeSent,
	});

	if (!isETHx) {
		return { downgradeTxHash, transferredAmount: amount };
	}

	// The downgrade left native ETH inside the Anchor. Read the Anchor's actual
	// balance on this chain and forward all of it: this also sweeps ETH stranded
	// by earlier claims, and it can never exceed what the Anchor holds.
	const anchorBalance = await deps.getNativeBalance({
		chainId,
		address: anchorContractAddress,
	});
	assertBigintAmount(anchorBalance);
	if (anchorBalance === 0n) {
		// Nothing left to forward (for example a concurrent claim already
		// moved it). The downgrade succeeded, so there is nothing to retry.
		return { downgradeTxHash, transferredAmount: 0n };
	}

	onTransferStarted?.(anchorBalance);
	const transferTxHash = await executeOnAnchor(deps, EClaimStep.TRANSFER, {
		chainId,
		anchorContractAddress,
		args: [projectAddress, anchorBalance, '0x'],
		onSent: onTransferSent,
	});

	return {
		downgradeTxHash,
		transferTxHash,
		transferredAmount: anchorBalance,
	};
};
