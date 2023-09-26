import { hashMessage, _TypedDataEncoder } from 'ethers/lib/utils';
export type EIP712TypedData = ReturnType<typeof _TypedDataEncoder.getPayload>;

export const hashTypedData = (typedData: EIP712TypedData): string => {
	// `ethers` doesn't require `EIP712Domain` and otherwise throws
	const { EIP712Domain: _, ...types } = typedData.types;
	return _TypedDataEncoder.hash(typedData.domain, types, typedData.message);
};

/**
 * The `SafeMessage` `message` field is a hash of the message to be signed
 */
export const generateSafeMessageMessage = (
	message: string | EIP712TypedData,
): string => {
	return typeof message === 'string'
		? hashMessage(message)
		: hashTypedData(message);
};
