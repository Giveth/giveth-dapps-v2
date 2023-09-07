import SafeApiKit from '@safe-global/api-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { ethers } from 'ethers';

export function getEthAdapter(signer: any) {
	return new EthersAdapter({
		ethers,
		signerOrProvider: signer,
	});
}

export async function verifyGnosisSignature(safeAddress: string, signer: any) {
	const safe = new SafeApiKit({
		txServiceUrl: 'https://safe-transaction-gnosis-chain.safe.global/',
		ethAdapter: getEthAdapter(signer),
	});
	const incomingTxs = await safe.getMultisigTransactions(safeAddress);
	const lastTx = incomingTxs.results[0];
	return lastTx;
}
