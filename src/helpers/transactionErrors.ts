// Shared helpers to classify errors thrown by wagmi/viem and ethers v5 when
// sending transactions, so UI flows can react to known cases without
// exposing raw provider stack traces to the user.

// Superfluid ConstantFlowAgreementV1 custom error CFA_FLOW_DOES_NOT_EXIST()
// keccak256('CFA_FLOW_DOES_NOT_EXIST()') -> 0x5a32bf24
export const CFA_FLOW_DOES_NOT_EXIST_SELECTOR = '0x5a32bf24';
export const CFA_FLOW_DOES_NOT_EXIST_NAME = 'CFA_FLOW_DOES_NOT_EXIST';

const MAX_ERROR_DEPTH = 6;

// Walks an error (and its nested causes/data) and collects every string it
// finds, so revert selectors and names can be detected regardless of which
// library wrapped the error.
const collectErrorStrings = (
	error: unknown,
	depth = 0,
	seen = new Set<unknown>(),
): string[] => {
	if (error === null || error === undefined || depth > MAX_ERROR_DEPTH)
		return [];
	if (typeof error === 'string') return [error];
	if (typeof error !== 'object' || seen.has(error)) return [];
	seen.add(error);

	const strings: string[] = [];
	const record = error as Record<string, unknown>;
	const nestedKeys = [
		'message',
		'shortMessage',
		'details',
		'reason',
		'data',
		'error',
		'cause',
		'body',
		'info',
	];
	for (const key of nestedKeys) {
		const value = record[key];
		if (typeof value === 'function') continue;
		strings.push(...collectErrorStrings(value, depth + 1, seen));
	}
	// ethers v5 serialises the inner JSON-RPC error into the message, and
	// viem keeps the raw revert data in `data` / `cause.data`.
	if (typeof record.code === 'string') strings.push(record.code);
	return strings;
};

export const isFlowDoesNotExistError = (error: unknown): boolean => {
	const strings = collectErrorStrings(error);
	return strings.some(
		s =>
			s.toLowerCase().includes(CFA_FLOW_DOES_NOT_EXIST_SELECTOR) ||
			s.includes(CFA_FLOW_DOES_NOT_EXIST_NAME),
	);
};

// True when the user rejected the request in their wallet (EIP-1193 code
// 4001, ethers v5 ACTION_REJECTED, viem UserRejectedRequestError).
export const isUserRejectedError = (error: unknown): boolean => {
	if (!error || typeof error !== 'object') return false;
	const record = error as Record<string, unknown>;
	if (record.code === 4001 || record.code === 'ACTION_REJECTED') return true;
	if (record.name === 'UserRejectedRequestError') return true;
	const cause = record.cause;
	if (cause && typeof cause === 'object') {
		return isUserRejectedError(cause);
	}
	return false;
};
