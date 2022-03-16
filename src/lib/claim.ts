import { isAddress } from 'ethers/lib/utils';
import { Contract } from 'ethers';
import { ClaimData } from '@/types/GIV';
import config from '../configuration';
import { abi as MERKLE_ABI } from '../artifacts/MerkleDrop.json';
import { abi as TOKEN_DISTRO_ABI } from '../artifacts/TokenDistro.json';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { fetchSubgraph } from '@/services/subgraph.service';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { getGasPreference } from '@/lib/helpers';

export const fetchAirDropClaimData = async (
	address: string,
): Promise<ClaimData | undefined> => {
	if (!address) return undefined;
	try {
		const data = { address };
		const response = await fetch('/api/airdrop', {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify(data),
		});
		return await response.json();
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e);
		return undefined;
	}
};

export const hasClaimedAirDrop = async (address: string): Promise<boolean> => {
	try {
		const response = await fetchSubgraph(
			SubgraphQueryBuilder.getXDaiQuery(address),
			config.XDAI_NETWORK_NUMBER,
		);
		const { balances } = transformSubgraphData(response);
		return balances.givDropClaimed;
	} catch (e) {
		console.error('Error on fetching subgraph');
		// It's better to continue givDrop if subgraph is unreachable
		return false;
	}
};

export const claimAirDrop = async (
	address: string,
	provider: Web3Provider,
): Promise<TransactionResponse | undefined> => {
	const merkleAddress = config.XDAI_CONFIG.MERKLE_ADDRESS;
	if (!isAddress(merkleAddress)) throw new Error('No MerkleAddress');
	if (!provider) throw new Error('No Provider');

	const signer = provider.getSigner().connectUnchecked();
	const merkleContract = new Contract(merkleAddress, MERKLE_ABI, provider);

	const claimData = await fetchAirDropClaimData(address);

	if (!claimData) throw new Error('No claim data');

	const args = [claimData.index, claimData.amount, claimData.proof];

	try {
		return await merkleContract
			.connect(signer.connectUnchecked())
			.claim(...args, getGasPreference(config.XDAI_CONFIG));
	} catch (error) {
		console.error('Error on claiming GIVdrop:', error);
	}
};

export const claimReward = async (
	tokenDistroAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (!isAddress(tokenDistroAddress)) return;
	if (!provider) return;

	const signer = provider.getSigner();
	const network = provider.network.chainId;

	const tokenDistro = new Contract(
		tokenDistroAddress,
		TOKEN_DISTRO_ABI,
		signer.connectUnchecked(),
	);

	const networkConfig = config.NETWORKS_CONFIG[network];
	try {
		return await tokenDistro.claim(getGasPreference(networkConfig));
	} catch (error) {
		console.error('Error on claiming token distro reward:', error);
	}

	// showPendingClaim(network, tx.hash);

	// const { status } = await tx.wait();

	// if (status) {
	// 	showConfirmedClaim(network, tx.hash);
	// } else {
	// 	showFailedClaim(network, tx.hash);
	// }
};
