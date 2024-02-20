import { Header, Payload, SIWS } from '@web3auth/sign-in-with-solana';
import { signMessage } from '@wagmi/core';
import config from '@/configuration';
import { wagmiConfig } from '@/wagmiConfigs';

let domain = 'giveth.io';
export const fetchNonce = async (): Promise<string> => {
	const nonceResponse: any = await fetch(
		`${config.MICROSERVICES.authentication}/nonce`,
	).then(n => {
		return n.json();
	});
	const nonce = nonceResponse.message;
	return nonce;
};

export const createSiweMessage = async (
	address: string,
	chainId: number,
	statement: string,
) => {
	try {
		if (typeof window !== 'undefined') {
			domain = window.location.hostname;
		}
		const nonce = await fetchNonce();
		const { SiweMessage } = await import('siwe');
		const siweMessage = new SiweMessage({
			domain,
			address,
			nonce,
			statement,
			uri: origin,
			version: '1',
			chainId,
		});
		return {
			message: siweMessage.prepareMessage(),
			nonce,
		};
	} catch (error) {
		console.log({ error });
		return false;
	}
};

interface SignResult {
	signature: string;
	message: string;
	nonce: string;
}
export const signWithEvm = async (
	address: string,
	chainId: number,
): Promise<SignResult | undefined> => {
	const siweMessage: any = await createSiweMessage(
		address!,
		chainId!,
		'Login into Giveth services',
	);

	const { message, nonce } = siweMessage;

	const signature = await signMessage(wagmiConfig, { message: message });

	return (
		signature && {
			signature,
			message,
			nonce,
		}
	);
};

// Solana sign message
export const createSwisMessage = async (
	address: string,
	statement: string,
): Promise<{ message: string; nonce: string }> => {
	if (typeof window !== 'undefined') {
		domain = window.location.hostname;
	}

	const nonce = await fetchNonce();
	const header = new Header();
	header.t = 'sip99';
	const payload = new Payload();
	payload.domain = domain;
	payload.address = address;
	payload.uri = origin;
	payload.statement = statement;
	payload.version = '1';
	payload.nonce = nonce;
	const message = new SIWS({
		header,
		payload,
	}).prepareMessage();

	return { message, nonce };
};
