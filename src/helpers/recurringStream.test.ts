import {
	IEndStreamFlowDeps,
	StreamStateUnknownError,
	StreamTransactionFailedError,
	checkStreamBeforeTransaction,
	getRecurringFlowState,
	runEndStreamFlow,
} from './recurringStream';

const SENDER = '0xc46c67bb7e84490d7ebdd0b8ecdaca68cf3823f4';
const ANCHOR = '0xd6bfab14e6873fb7ecc0f337351c955e9bde8e36';
const USDCX = '0x35adeb0638eb192755b6e52544650603fe65a006';
const TX_HASH =
	'0xd10005501fd4d5f5e2629c56918384853d1be7abaf4fd4422119747d0e7a3fda';

// The revert the CFA returns for deleteFlow on a liquidated stream (#5503).
const flowDoesNotExistError = Object.assign(
	new Error('cannot estimate gas; transaction may fail'),
	{
		code: 'UNPREDICTABLE_GAS_LIMIT',
		error: { data: { data: '0x5a32bf24' } },
	},
);

const createSf = (flowRate: string | Error) => ({
	cfaV1: {
		getFlow: jest.fn(async () => {
			if (flowRate instanceof Error) throw flowRate;
			return { flowRate };
		}),
	},
});

describe('getRecurringFlowState', () => {
	it('reports an active flow with its rate', async () => {
		const sf = createSf('1902587519025');
		await expect(
			getRecurringFlowState(sf, USDCX, SENDER, ANCHOR, 'provider'),
		).resolves.toEqual({ status: 'active', flowRate: '1902587519025' });
		expect(sf.cfaV1.getFlow).toHaveBeenCalledWith({
			superToken: USDCX,
			sender: SENDER,
			receiver: ANCHOR,
			providerOrSigner: 'provider',
		});
	});

	it('reports a zero-rate flow as ended (manual end or liquidation)', async () => {
		await expect(
			getRecurringFlowState(createSf('0'), USDCX, SENDER, ANCHOR, null),
		).resolves.toEqual({ status: 'ended', flowRate: '0' });
	});

	it('throws StreamStateUnknownError instead of assuming ended on RPC failure', async () => {
		const rpcError = new Error('network error');
		await expect(
			getRecurringFlowState(
				createSf(rpcError),
				USDCX,
				SENDER,
				ANCHOR,
				null,
			),
		).rejects.toBeInstanceOf(StreamStateUnknownError);
	});

	it('treats a malformed flow rate as unknown state', async () => {
		await expect(
			getRecurringFlowState(createSf('n/a'), USDCX, SENDER, ANCHOR, null),
		).rejects.toBeInstanceOf(StreamStateUnknownError);
	});
});

describe('checkStreamBeforeTransaction', () => {
	it('lets an active stream through without touching the backend', async () => {
		const reconcile = jest.fn();
		await expect(
			checkStreamBeforeTransaction({
				getFlowState: async () => ({ status: 'active', flowRate: '1' }),
				reconcileRecurringDonation: reconcile,
			}),
		).resolves.toEqual({ status: 'active' });
		expect(reconcile).not.toHaveBeenCalled();
	});

	it('reconciles the backend when the chain says the stream ended', async () => {
		const reconcile = jest.fn(async () => ({ status: 'ended' }));
		await expect(
			checkStreamBeforeTransaction({
				getFlowState: async () => ({ status: 'ended', flowRate: '0' }),
				reconcileRecurringDonation: reconcile,
			}),
		).resolves.toEqual({ status: 'already_ended', backendSynced: true });
		expect(reconcile).toHaveBeenCalledTimes(1);
	});

	it('still reports already_ended when the reconciliation call fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		await expect(
			checkStreamBeforeTransaction({
				getFlowState: async () => ({ status: 'ended', flowRate: '0' }),
				reconcileRecurringDonation: async () => {
					throw new Error('backend down');
				},
			}),
		).resolves.toEqual({ status: 'already_ended', backendSynced: false });
	});

	it('propagates unknown state so callers do not assume the stream ended', async () => {
		await expect(
			checkStreamBeforeTransaction({
				getFlowState: async () => {
					throw new StreamStateUnknownError();
				},
				reconcileRecurringDonation: jest.fn(),
			}),
		).rejects.toBeInstanceOf(StreamStateUnknownError);
	});
});

describe('runEndStreamFlow', () => {
	const createDeps = (
		overrides: Partial<IEndStreamFlowDeps> = {},
	): IEndStreamFlowDeps => ({
		getFlowState: jest.fn(async () => ({
			status: 'active' as const,
			flowRate: '1902587519025',
		})),
		reconcileRecurringDonation: jest.fn(async () => ({ status: 'ended' })),
		executeDeleteFlow: jest.fn(async () => ({
			hash: TX_HASH,
			wait: async () => ({ status: 1 }),
		})),
		endRecurringDonation: jest.fn(async () => 1),
		...overrides,
	});

	beforeEach(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('ends an active stream and records it only after the receipt succeeds', async () => {
		const order: string[] = [];
		const deps = createDeps({
			executeDeleteFlow: jest.fn(async () => ({
				hash: TX_HASH,
				wait: async () => {
					order.push('wait');
					return { status: 1 };
				},
			})),
			endRecurringDonation: jest.fn(async () => {
				order.push('backend');
				return 1;
			}),
		});

		await expect(runEndStreamFlow(deps)).resolves.toEqual({
			outcome: 'ended',
			txHash: TX_HASH,
			backendSynced: true,
		});
		expect(order).toEqual(['wait', 'backend']);
		expect(deps.endRecurringDonation).toHaveBeenCalledWith(TX_HASH);
		expect(deps.reconcileRecurringDonation).not.toHaveBeenCalled();
	});

	it('skips the transaction for a manually ended stream and reconciles the backend', async () => {
		const deps = createDeps({
			getFlowState: jest.fn(async () => ({
				status: 'ended' as const,
				flowRate: '0',
			})),
		});

		await expect(runEndStreamFlow(deps)).resolves.toEqual({
			outcome: 'already_ended',
			backendSynced: true,
		});
		expect(deps.executeDeleteFlow).not.toHaveBeenCalled();
		expect(deps.endRecurringDonation).not.toHaveBeenCalled();
		expect(deps.reconcileRecurringDonation).toHaveBeenCalledTimes(1);
	});

	it('handles a liquidated stream the backend still reports as ACTIVE', async () => {
		// The backend row says ACTIVE, but the sentinel already deleted the
		// flow on-chain (flow rate 0). No deleteFlow must be attempted.
		const deps = createDeps({
			getFlowState: jest.fn(async () => ({
				status: 'ended' as const,
				flowRate: '0',
			})),
		});
		const result = await runEndStreamFlow(deps);
		expect(result.outcome).toBe('already_ended');
		expect(deps.executeDeleteFlow).not.toHaveBeenCalled();
	});

	it('treats a CFA_FLOW_DOES_NOT_EXIST revert after the check as already ended (race)', async () => {
		const deps = createDeps({
			executeDeleteFlow: jest.fn(async () => {
				throw flowDoesNotExistError;
			}),
		});

		await expect(runEndStreamFlow(deps)).resolves.toEqual({
			outcome: 'already_ended',
			backendSynced: true,
		});
		expect(deps.endRecurringDonation).not.toHaveBeenCalled();
		expect(deps.reconcileRecurringDonation).toHaveBeenCalledTimes(1);
	});

	it('rethrows wallet rejections and other send errors untouched', async () => {
		const rejection = Object.assign(new Error('user rejected'), {
			code: 'ACTION_REJECTED',
		});
		const deps = createDeps({
			executeDeleteFlow: jest.fn(async () => {
				throw rejection;
			}),
		});
		await expect(runEndStreamFlow(deps)).rejects.toBe(rejection);
		expect(deps.endRecurringDonation).not.toHaveBeenCalled();
		expect(deps.reconcileRecurringDonation).not.toHaveBeenCalled();
	});

	it('fails without touching the backend when the receipt is reverted', async () => {
		const deps = createDeps({
			executeDeleteFlow: jest.fn(async () => ({
				hash: TX_HASH,
				wait: async () => ({ status: 0 }),
			})),
		});
		await expect(runEndStreamFlow(deps)).rejects.toBeInstanceOf(
			StreamTransactionFailedError,
		);
		expect(deps.endRecurringDonation).not.toHaveBeenCalled();
	});

	it('propagates a failed receipt retrieval', async () => {
		const deps = createDeps({
			executeDeleteFlow: jest.fn(async () => ({
				hash: TX_HASH,
				wait: async () => {
					throw new Error('receipt timeout');
				},
			})),
		});
		await expect(runEndStreamFlow(deps)).rejects.toThrow('receipt timeout');
		expect(deps.endRecurringDonation).not.toHaveBeenCalled();
	});

	it('reports a confirmed end even when the backend update fails', async () => {
		const deps = createDeps({
			endRecurringDonation: jest.fn(async () => {
				throw new Error('backend down');
			}),
		});
		await expect(runEndStreamFlow(deps)).resolves.toEqual({
			outcome: 'ended',
			txHash: TX_HASH,
			backendSynced: false,
		});
	});

	it('does not assume the stream ended when the state check fails', async () => {
		const deps = createDeps({
			getFlowState: jest.fn(async () => {
				throw new StreamStateUnknownError(new Error('rpc'));
			}),
		});
		await expect(runEndStreamFlow(deps)).rejects.toBeInstanceOf(
			StreamStateUnknownError,
		);
		expect(deps.executeDeleteFlow).not.toHaveBeenCalled();
		expect(deps.reconcileRecurringDonation).not.toHaveBeenCalled();
	});
});
