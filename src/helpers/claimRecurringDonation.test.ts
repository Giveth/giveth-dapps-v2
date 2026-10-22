/**
 * @jest-environment node
 */
// viem needs TextEncoder, which the jsdom test environment does not provide.
import { Address, Hex, decodeFunctionData } from 'viem';

// @wagmi/core is ESM-only and cannot be loaded by this jest setup; the
// helper under test takes its chain dependencies as an argument, so the
// default wagmi-backed implementations are never exercised here.
jest.mock('@wagmi/core', () => ({
	getBalance: jest.fn(),
	waitForTransactionReceipt: jest.fn(),
	writeContract: jest.fn(),
}));
jest.mock('@/wagmiConfigs', () => ({ wagmiConfig: {} }));
import ISETH from '@/artifacts/ISETH.json';
import superTokenABI from '@/artifacts/superToken.json';
import {
	ClaimTransactionError,
	EClaimStep,
	IClaimDependencies,
	encodeDowngradeCallData,
	executeAnchorClaim,
} from './claimRecurringDonation';
import { IToken } from '@/types/superFluid';
import { isUserRejectedError } from './transactionErrors';

const BASE = 8453;
const OPTIMISM = 10;

const ANCHOR = '0x5dce0a8bd7537491a6c777e76d63feadfd608263' as Address;
// Checksummed, as viem returns decoded addresses.
const PROJECT_ADDRESS = '0xB3f2b4a0b5F2f99e6B6bfc71D5E18a59B92D5606' as Address;

const ethxBase: IToken = {
	id: '0x46fd5cfB4c12D87acD3a13e92BAa53240C661D93' as Address,
	name: 'Super ETH',
	symbol: 'ETHx',
	decimals: 18,
	isSuperToken: true,
	coingeckoId: 'ethereum',
};

const usdcxOptimism: IToken = {
	id: '0x8430f084b939208e2eded1584889c9a66b90562f' as Address,
	name: 'Super USDC',
	symbol: 'USDCx',
	decimals: 18,
	isSuperToken: true,
	coingeckoId: 'usd-coin',
};

// The amount from issue #5651: the Anchor held exactly this many wei, but the
// old code sent Number(103564123415490204) === 103564123415490208 and the
// Anchor reverted with CALL_FAILED().
const ISSUE_5651_AMOUNT = 103564123415490204n;

const DOWNGRADE_HASH = '0x1111' as Hex;
const TRANSFER_HASH = '0x2222' as Hex;

const createDeps = (
	overrides: Partial<{
		receipts: Record<string, 'success' | 'reverted'>;
		anchorBalance: bigint | Error;
		writeContractError: Error;
	}> = {},
) => {
	const receipts = overrides.receipts ?? {
		[DOWNGRADE_HASH]: 'success',
		[TRANSFER_HASH]: 'success',
	};
	let sentTransactions = 0;
	const writeContract = jest.fn(async ({ functionName }) => {
		if (overrides.writeContractError) throw overrides.writeContractError;
		expect(functionName).toBe('execute');
		sentTransactions += 1;
		return sentTransactions === 1 ? DOWNGRADE_HASH : TRANSFER_HASH;
	});
	const waitForTransactionReceipt = jest.fn(async ({ hash }) => ({
		status: receipts[hash],
	}));
	const getNativeBalance = jest.fn(async () => {
		if (overrides.anchorBalance instanceof Error)
			throw overrides.anchorBalance;
		return overrides.anchorBalance ?? 0n;
	});
	const deps: IClaimDependencies = {
		writeContract,
		waitForTransactionReceipt,
		getNativeBalance,
	};
	return { deps, writeContract, waitForTransactionReceipt, getNativeBalance };
};

const decodeDowngrade = (data: Hex, isETHx: boolean) =>
	decodeFunctionData({
		abi: isETHx ? ISETH.abi : superTokenABI.abi,
		data,
	});

describe('encodeDowngradeCallData', () => {
	it.each([
		['the issue #5651 amount', ISSUE_5651_AMOUNT],
		['Number.MAX_SAFE_INTEGER + 1', BigInt(Number.MAX_SAFE_INTEGER) + 1n],
		['an amount a double would round up', 103564123415490204n],
		['an amount a double would round down', 103564123415490212n],
		['a 1,000 ETH balance', 1_000_000_000_000_000_000_000n],
	])('keeps %s exact for ETHx', (_label, amount) => {
		const decoded = decodeDowngrade(
			encodeDowngradeCallData({
				isETHx: true,
				amount,
				projectAddress: PROJECT_ADDRESS,
			}),
			true,
		);
		expect(decoded.functionName).toBe('downgradeToETH');
		expect(decoded.args).toEqual([amount]);
		// Sanity check that the value really is not representable as a Number
		// unless it is one of the exactly representable cases.
		expect(typeof decoded.args?.[0]).toBe('bigint');
	});

	it('documents the Number rounding that caused #5651', () => {
		// Doubles between 2^56 and 2^57 can only represent multiples of 16.
		expect(BigInt(Number(103564123415490204n))).toBe(103564123415490208n); // rounds up: exceeds balance, Anchor reverts
		expect(BigInt(Number(103564123415490212n))).toBe(103564123415490208n); // rounds down: leaves 4 wei of dust
		expect(ISSUE_5651_AMOUNT > BigInt(Number.MAX_SAFE_INTEGER)).toBe(true);
	});

	it('keeps the exact amount and recipient for wrapper super tokens', () => {
		const decoded = decodeDowngrade(
			encodeDowngradeCallData({
				isETHx: false,
				amount: ISSUE_5651_AMOUNT,
				projectAddress: PROJECT_ADDRESS,
			}),
			false,
		);
		expect(decoded.functionName).toBe('downgradeTo');
		expect(decoded.args).toEqual([PROJECT_ADDRESS, ISSUE_5651_AMOUNT]);
	});

	it('rejects Number amounts so precision loss cannot be reintroduced', () => {
		expect(() =>
			encodeDowngradeCallData({
				isETHx: true,
				// @ts-expect-error intentionally passing a Number
				amount: Number(ISSUE_5651_AMOUNT),
				projectAddress: PROJECT_ADDRESS,
			}),
		).toThrow(TypeError);
	});

	it('rejects zero and negative amounts', () => {
		for (const amount of [0n, -1n]) {
			expect(() =>
				encodeDowngradeCallData({
					isETHx: true,
					amount,
					projectAddress: PROJECT_ADDRESS,
				}),
			).toThrow(RangeError);
		}
	});
});

describe('executeAnchorClaim', () => {
	describe('ETHx', () => {
		it.each([
			['Base', BASE],
			['Optimism', OPTIMISM],
		])(
			'downgrades, waits for success, then sweeps the exact anchor balance on %s',
			async (_name, chainId) => {
				const { deps, writeContract, getNativeBalance } = createDeps({
					anchorBalance: ISSUE_5651_AMOUNT,
				});
				const onTransferStarted = jest.fn();

				const result = await executeAnchorClaim(
					{
						chainId,
						anchorContractAddress: ANCHOR,
						projectAddress: PROJECT_ADDRESS,
						token: ethxBase,
						amount: ISSUE_5651_AMOUNT,
						onTransferStarted,
					},
					deps,
				);

				expect(writeContract).toHaveBeenCalledTimes(2);
				const [downgradeCall, transferCall] = writeContract.mock.calls;
				expect(downgradeCall[0]).toMatchObject({
					chainId,
					address: ANCHOR,
					functionName: 'execute',
				});
				expect(downgradeCall[0].args[0]).toBe(ethxBase.id);
				expect(downgradeCall[0].args[1]).toBe(0n);
				expect(
					decodeDowngrade(downgradeCall[0].args[2], true).args,
				).toEqual([ISSUE_5651_AMOUNT]);

				// The balance is read from the same anchor on the same chain.
				expect(getNativeBalance).toHaveBeenCalledWith({
					chainId,
					address: ANCHOR,
				});
				expect(transferCall[0]).toMatchObject({
					chainId,
					address: ANCHOR,
					functionName: 'execute',
					args: [PROJECT_ADDRESS, ISSUE_5651_AMOUNT, '0x'],
				});
				expect(typeof transferCall[0].args[1]).toBe('bigint');
				expect(onTransferStarted).toHaveBeenCalledWith(
					ISSUE_5651_AMOUNT,
				);
				expect(result).toEqual({
					downgradeTxHash: DOWNGRADE_HASH,
					transferTxHash: TRANSFER_HASH,
					transferredAmount: ISSUE_5651_AMOUNT,
				});
			},
		);

		it('sweeps previously stranded ETH together with the new downgrade', async () => {
			const stranded = 103564123415490210n; // left behind by the failed claim in #5651
			const freshDowngrade = 20178900000000000n;
			const { deps, writeContract } = createDeps({
				anchorBalance: stranded + freshDowngrade,
			});

			const result = await executeAnchorClaim(
				{
					chainId: BASE,
					anchorContractAddress: ANCHOR,
					projectAddress: PROJECT_ADDRESS,
					token: ethxBase,
					amount: freshDowngrade,
				},
				deps,
			);

			expect(writeContract.mock.calls[1][0].args).toEqual([
				PROJECT_ADDRESS,
				stranded + freshDowngrade,
				'0x',
			]);
			expect(result.transferredAmount).toBe(stranded + freshDowngrade);
		});

		it('never sends more than the anchor holds, even if the stream balance was larger', async () => {
			const { deps, writeContract } = createDeps({
				anchorBalance: ISSUE_5651_AMOUNT,
			});
			await executeAnchorClaim(
				{
					chainId: BASE,
					anchorContractAddress: ANCHOR,
					projectAddress: PROJECT_ADDRESS,
					token: ethxBase,
					amount: ISSUE_5651_AMOUNT + 4n,
				},
				deps,
			);
			expect(writeContract.mock.calls[1][0].args[1]).toBe(
				ISSUE_5651_AMOUNT,
			);
		});

		it('does not send the transfer when the downgrade reverted', async () => {
			const { deps, writeContract, getNativeBalance } = createDeps({
				receipts: { [DOWNGRADE_HASH]: 'reverted' },
				anchorBalance: ISSUE_5651_AMOUNT,
			});

			await expect(
				executeAnchorClaim(
					{
						chainId: BASE,
						anchorContractAddress: ANCHOR,
						projectAddress: PROJECT_ADDRESS,
						token: ethxBase,
						amount: ISSUE_5651_AMOUNT,
					},
					deps,
				),
			).rejects.toMatchObject({
				name: 'ClaimTransactionError',
				step: EClaimStep.DOWNGRADE,
				txHash: DOWNGRADE_HASH,
			});

			expect(writeContract).toHaveBeenCalledTimes(1);
			expect(getNativeBalance).not.toHaveBeenCalled();
		});

		it('reports a reverted transfer with its hash', async () => {
			const { deps } = createDeps({
				receipts: {
					[DOWNGRADE_HASH]: 'success',
					[TRANSFER_HASH]: 'reverted',
				},
				anchorBalance: ISSUE_5651_AMOUNT,
			});

			let caught: unknown;
			try {
				await executeAnchorClaim(
					{
						chainId: BASE,
						anchorContractAddress: ANCHOR,
						projectAddress: PROJECT_ADDRESS,
						token: ethxBase,
						amount: ISSUE_5651_AMOUNT,
					},
					deps,
				);
			} catch (error) {
				caught = error;
			}
			expect(caught).toBeInstanceOf(ClaimTransactionError);
			expect((caught as ClaimTransactionError).step).toBe(
				EClaimStep.TRANSFER,
			);
			expect((caught as ClaimTransactionError).txHash).toBe(
				TRANSFER_HASH,
			);
		});

		it('skips the transfer when the anchor holds no ETH after the downgrade', async () => {
			const { deps, writeContract } = createDeps({ anchorBalance: 0n });

			const result = await executeAnchorClaim(
				{
					chainId: BASE,
					anchorContractAddress: ANCHOR,
					projectAddress: PROJECT_ADDRESS,
					token: ethxBase,
					amount: ISSUE_5651_AMOUNT,
				},
				deps,
			);

			expect(writeContract).toHaveBeenCalledTimes(1);
			expect(result).toEqual({
				downgradeTxHash: DOWNGRADE_HASH,
				transferredAmount: 0n,
			});
		});

		it('fails instead of guessing when the anchor balance cannot be read', async () => {
			const { deps, writeContract } = createDeps({
				anchorBalance: new Error('rpc down'),
			});

			await expect(
				executeAnchorClaim(
					{
						chainId: BASE,
						anchorContractAddress: ANCHOR,
						projectAddress: PROJECT_ADDRESS,
						token: ethxBase,
						amount: ISSUE_5651_AMOUNT,
					},
					deps,
				),
			).rejects.toThrow('rpc down');
			expect(writeContract).toHaveBeenCalledTimes(1);
		});

		it('wraps send failures (wallet rejection, simulation revert) keeping the cause', async () => {
			const rejection = Object.assign(new Error('User rejected'), {
				code: 4001,
			});
			const { deps, waitForTransactionReceipt } = createDeps({
				writeContractError: rejection,
			});

			let caught: unknown;
			try {
				await executeAnchorClaim(
					{
						chainId: BASE,
						anchorContractAddress: ANCHOR,
						projectAddress: PROJECT_ADDRESS,
						token: ethxBase,
						amount: ISSUE_5651_AMOUNT,
					},
					deps,
				);
			} catch (error) {
				caught = error;
			}
			expect(caught).toBeInstanceOf(ClaimTransactionError);
			expect((caught as ClaimTransactionError).step).toBe(
				EClaimStep.DOWNGRADE,
			);
			expect((caught as ClaimTransactionError).txHash).toBeUndefined();
			expect((caught as ClaimTransactionError).cause).toBe(rejection);
			expect(isUserRejectedError(caught)).toBe(true);
			expect(waitForTransactionReceipt).not.toHaveBeenCalled();
		});

		it('reports a transfer the recipient refuses (simulation revert) as a transfer failure', async () => {
			const revert = Object.assign(new Error('execution reverted'), {
				name: 'ContractFunctionExecutionError',
			});
			let sent = 0;
			const { deps } = createDeps({ anchorBalance: ISSUE_5651_AMOUNT });
			(deps.writeContract as jest.Mock).mockImplementation(async () => {
				sent += 1;
				if (sent === 2) throw revert;
				return DOWNGRADE_HASH;
			});

			let caught: unknown;
			try {
				await executeAnchorClaim(
					{
						chainId: BASE,
						anchorContractAddress: ANCHOR,
						projectAddress: PROJECT_ADDRESS,
						token: ethxBase,
						amount: ISSUE_5651_AMOUNT,
					},
					deps,
				);
			} catch (error) {
				caught = error;
			}
			expect((caught as ClaimTransactionError).step).toBe(
				EClaimStep.TRANSFER,
			);
			expect((caught as ClaimTransactionError).cause).toBe(revert);
			expect(isUserRejectedError(caught)).toBe(false);
		});
	});

	describe('wrapper super tokens', () => {
		it('downgrades straight to the project address in one transaction', async () => {
			const { deps, writeContract, getNativeBalance } = createDeps();

			const result = await executeAnchorClaim(
				{
					chainId: OPTIMISM,
					anchorContractAddress: ANCHOR,
					projectAddress: PROJECT_ADDRESS,
					token: usdcxOptimism,
					amount: ISSUE_5651_AMOUNT,
				},
				deps,
			);

			expect(writeContract).toHaveBeenCalledTimes(1);
			const call = writeContract.mock.calls[0][0];
			expect(call.chainId).toBe(OPTIMISM);
			expect(call.args[0]).toBe(usdcxOptimism.id);
			expect(decodeDowngrade(call.args[2], false).args).toEqual([
				PROJECT_ADDRESS,
				ISSUE_5651_AMOUNT,
			]);
			expect(getNativeBalance).not.toHaveBeenCalled();
			expect(result).toEqual({
				downgradeTxHash: DOWNGRADE_HASH,
				transferredAmount: ISSUE_5651_AMOUNT,
			});
		});

		it('surfaces a reverted downgrade', async () => {
			const { deps } = createDeps({
				receipts: { [DOWNGRADE_HASH]: 'reverted' },
			});
			await expect(
				executeAnchorClaim(
					{
						chainId: OPTIMISM,
						anchorContractAddress: ANCHOR,
						projectAddress: PROJECT_ADDRESS,
						token: usdcxOptimism,
						amount: ISSUE_5651_AMOUNT,
					},
					deps,
				),
			).rejects.toMatchObject({ step: EClaimStep.DOWNGRADE });
		});
	});

	describe('input validation', () => {
		it.each([
			['zero address', '0x0000000000000000000000000000000000000000'],
			['empty string', ''],
			['malformed', '0x1234'],
		])(
			'refuses to claim to a %s recipient',
			async (_label, projectAddress) => {
				const { deps, writeContract } = createDeps();
				await expect(
					executeAnchorClaim(
						{
							chainId: BASE,
							anchorContractAddress: ANCHOR,
							projectAddress: projectAddress as Address,
							token: ethxBase,
							amount: ISSUE_5651_AMOUNT,
						},
						deps,
					),
				).rejects.toThrow('recipient address');
				expect(writeContract).not.toHaveBeenCalled();
			},
		);

		it('refuses a Number amount before sending anything', async () => {
			const { deps, writeContract } = createDeps();
			await expect(
				executeAnchorClaim(
					{
						chainId: BASE,
						anchorContractAddress: ANCHOR,
						projectAddress: PROJECT_ADDRESS,
						token: ethxBase,
						amount: Number(ISSUE_5651_AMOUNT) as unknown as bigint,
					},
					deps,
				),
			).rejects.toThrow(TypeError);
			expect(writeContract).not.toHaveBeenCalled();
		});
	});
});
