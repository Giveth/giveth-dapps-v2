import { isFlowDoesNotExistError } from './transactionErrors';

// Helpers shared by the "end" and "modify" recurring-donation flows. They read
// the real stream state from the Superfluid CFA before sending a transaction,
// because the backend status can lag behind the chain: a stream can be ended
// from another app, or liquidated by a Superfluid sentinel when the sender's
// super-token balance runs out, and the backend only syncs periodically.

export type TRecurringFlowStatus = 'active' | 'ended';

export interface IRecurringFlowState {
	status: TRecurringFlowStatus;
	flowRate: string;
}

// Structural subset of the Superfluid SDK `Framework` used here (method
// syntax keeps the SDK's narrower provider type assignable).
export interface ICfaV1Reader {
	cfaV1: {
		getFlow(params: {
			superToken: string;
			sender: string;
			receiver: string;
			providerOrSigner: any;
		}): Promise<{ flowRate: string }>;
	};
}

// Thrown when the stream state could not be read, so callers never confuse an
// RPC failure with an ended stream.
export class StreamStateUnknownError extends Error {
	constructor(cause?: unknown) {
		super('Could not read the recurring donation stream state on-chain');
		this.name = 'StreamStateUnknownError';
		this.cause = cause;
	}
}

// Reads the flow directly from the CFA. A flow that does not exist has a flow
// rate of 0; any failure to query the chain is rethrown as
// StreamStateUnknownError.
export const getRecurringFlowState = async (
	sf: ICfaV1Reader,
	superTokenAddress: string,
	senderAddress: string,
	receiverAddress: string,
	providerOrSigner: unknown,
): Promise<IRecurringFlowState> => {
	let flowRate: string;
	try {
		const flowInfo = await sf.cfaV1.getFlow({
			superToken: superTokenAddress,
			sender: senderAddress,
			receiver: receiverAddress,
			providerOrSigner,
		});
		flowRate = flowInfo?.flowRate ?? '0';
		// Throws on non-numeric values, which are treated as unknown state.
		BigInt(flowRate);
	} catch (error) {
		throw new StreamStateUnknownError(error);
	}
	return {
		status: BigInt(flowRate) > 0n ? 'active' : 'ended',
		flowRate,
	};
};

export interface IStreamPreflightDeps {
	getFlowState: () => Promise<IRecurringFlowState>;
	// Asks the backend to re-check the donation against the chain and mark it
	// ended. Failures are reported through the return value, never thrown.
	reconcileRecurringDonation: () => Promise<unknown>;
}

export const reconcileSafely = async (
	deps: Pick<IStreamPreflightDeps, 'reconcileRecurringDonation'>,
): Promise<boolean> => {
	try {
		await deps.reconcileRecurringDonation();
		return true;
	} catch (error) {
		console.error('Recurring donation reconciliation failed', { error });
		return false;
	}
};

export type TStreamPreflightResult =
	| { status: 'active' }
	| { status: 'already_ended'; backendSynced: boolean };

// Checks the stream on-chain before a deleteFlow/updateFlow. When the stream
// is already gone it triggers a backend reconciliation so the UI stops showing
// it as active. Throws StreamStateUnknownError when the chain cannot be read.
export const checkStreamBeforeTransaction = async (
	deps: IStreamPreflightDeps,
): Promise<TStreamPreflightResult> => {
	const state = await deps.getFlowState();
	if (state.status === 'active') return { status: 'active' };
	return {
		status: 'already_ended',
		backendSynced: await reconcileSafely(deps),
	};
};

export interface IEndStreamFlowDeps extends IStreamPreflightDeps {
	// Sends the deleteFlow transaction (ethers v5 style response).
	executeDeleteFlow: () => Promise<{
		hash: string;
		wait: () => Promise<{ status?: number | null } | null | undefined>;
	}>;
	// Records the end in the backend with the hash of the confirmed tx.
	endRecurringDonation: (txHash: string) => Promise<unknown>;
}

export type TEndStreamFlowResult =
	| { outcome: 'ended'; txHash: string; backendSynced: boolean }
	| { outcome: 'already_ended'; backendSynced: boolean };

export class StreamTransactionFailedError extends Error {
	txHash: string;

	constructor(txHash: string) {
		super('Transaction failed');
		this.name = 'StreamTransactionFailedError';
		this.txHash = txHash;
	}
}

// Ends a stream safely:
// 1. verify the flow exists on-chain (ended streams need no transaction),
// 2. send deleteFlow; a CFA_FLOW_DOES_NOT_EXIST revert means the stream was
//    ended between the check and the send, which is treated as already ended,
// 3. wait for the receipt and verify it succeeded,
// 4. only then record the end in the backend. A backend failure after a
//    confirmed transaction is reported as `backendSynced: false`, never as a
//    failed transaction; the backend sync job will catch up later.
// Wallet rejections, gas-estimation failures for other reasons and RPC errors
// propagate to the caller unchanged.
export const runEndStreamFlow = async (
	deps: IEndStreamFlowDeps,
): Promise<TEndStreamFlowResult> => {
	const preflight = await checkStreamBeforeTransaction(deps);
	if (preflight.status === 'already_ended') {
		return {
			outcome: 'already_ended',
			backendSynced: preflight.backendSynced,
		};
	}

	let tx: Awaited<ReturnType<IEndStreamFlowDeps['executeDeleteFlow']>>;
	try {
		tx = await deps.executeDeleteFlow();
	} catch (error) {
		if (isFlowDoesNotExistError(error)) {
			return {
				outcome: 'already_ended',
				backendSynced: await reconcileSafely(deps),
			};
		}
		throw error;
	}

	const receipt = await tx.wait();
	if (!receipt?.status) {
		throw new StreamTransactionFailedError(tx.hash);
	}

	let backendSynced = true;
	try {
		await deps.endRecurringDonation(tx.hash);
	} catch (error) {
		backendSynced = false;
		console.error('endRecurringDonation failed after confirmed tx', {
			error,
			txHash: tx.hash,
		});
	}
	return { outcome: 'ended', txHash: tx.hash, backendSynced };
};
