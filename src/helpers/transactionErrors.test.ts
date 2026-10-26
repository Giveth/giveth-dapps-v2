import {
	CFA_FLOW_DOES_NOT_EXIST_SELECTOR,
	isFlowDoesNotExistError,
	isUserRejectedError,
} from './transactionErrors';

// Trimmed copy of the error shown in issue #5503 (ethers v5 + MetaMask).
const ethersGasEstimationError = Object.assign(
	new Error(
		'cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (reason="execution reverted", method="estimateGas", transaction={"from":"0xC46c67Bb7E84490D7EbdD0b8ecDaca68Cf3823F4","to":"0xcfA132E353cB4E398080B9700609bb008eceB125","data":"0xb4b333c6"}, error={"code":-32603,"message":"Internal JSON-RPC error.","data":{"code":3,"message":"execution reverted","data":"0x5a32bf24","cause":null}}, code=UNPREDICTABLE_GAS_LIMIT, version=providers/5.7.2)',
	),
	{
		reason: 'execution reverted',
		code: 'UNPREDICTABLE_GAS_LIMIT',
		method: 'estimateGas',
		error: {
			code: -32603,
			message: 'Internal JSON-RPC error.',
			data: {
				code: 3,
				message: 'execution reverted',
				data: '0x5a32bf24',
				cause: null,
			},
		},
	},
);

describe('isFlowDoesNotExistError', () => {
	it('exports the CFA_FLOW_DOES_NOT_EXIST selector', () => {
		expect(CFA_FLOW_DOES_NOT_EXIST_SELECTOR).toBe('0x5a32bf24');
	});

	it('detects the ethers v5 gas estimation error from issue #5503', () => {
		expect(isFlowDoesNotExistError(ethersGasEstimationError)).toBe(true);
	});

	it('detects the selector in nested viem-style causes', () => {
		const viemLike = {
			name: 'ContractFunctionExecutionError',
			shortMessage: 'Execution reverted',
			cause: {
				name: 'ContractFunctionRevertedError',
				data: '0x5A32BF24',
				cause: { details: 'execution reverted' },
			},
		};
		expect(isFlowDoesNotExistError(viemLike)).toBe(true);
	});

	it('detects the decoded custom error name', () => {
		expect(
			isFlowDoesNotExistError(
				new Error(
					'reverted with custom error CFA_FLOW_DOES_NOT_EXIST()',
				),
			),
		).toBe(true);
	});

	it('ignores unrelated errors and odd inputs', () => {
		expect(isFlowDoesNotExistError(new Error('insufficient funds'))).toBe(
			false,
		);
		expect(
			isFlowDoesNotExistError({
				error: { data: { data: '0xea76c9b3' } }, // CFA_INSUFFICIENT_BALANCE()
			}),
		).toBe(false);
		expect(isFlowDoesNotExistError(null)).toBe(false);
		expect(isFlowDoesNotExistError(undefined)).toBe(false);
		expect(isFlowDoesNotExistError('user rejected')).toBe(false);
	});

	it('survives circular error structures', () => {
		const circular: Record<string, unknown> = { message: 'boom' };
		circular.cause = circular;
		expect(isFlowDoesNotExistError(circular)).toBe(false);
	});
});

describe('isUserRejectedError', () => {
	it.each([
		['ethers ACTION_REJECTED', { code: 'ACTION_REJECTED' }],
		['EIP-1193 code 4001', { code: 4001 }],
		['viem UserRejectedRequestError', { name: 'UserRejectedRequestError' }],
		[
			'wrapped viem error',
			{ name: 'TransactionExecutionError', cause: { code: 4001 } },
		],
	])('detects %s', (_label, error) => {
		expect(isUserRejectedError(error)).toBe(true);
	});

	it('does not treat other errors as rejections', () => {
		expect(isUserRejectedError(ethersGasEstimationError)).toBe(false);
		expect(isUserRejectedError(new Error('rpc down'))).toBe(false);
		expect(isUserRejectedError(null)).toBe(false);
	});
});
