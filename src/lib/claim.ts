import { isAddress } from 'ethers/lib/utils';
import { Contract } from 'ethers';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { captureException } from '@sentry/nextjs';
import { ClaimData } from '@/types/GIV';
import config from '../configuration';
import MerkleDropJson from '../artifacts/MerkleDrop.json';
import TOKEN_DISTRO_JSON from '../artifacts/TokenDistro.json';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { getGasPreference } from '@/lib/helpers';
import { MerkleDistro } from '@/types/contracts';
import { fetchXDaiInfo } from '@/features/subgraph/subgraph.services';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

const { abi: MERKLE_ABI } = MerkleDropJson;
const { abi: TOKEN_DISTRO_ABI } = TOKEN_DISTRO_JSON;

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
		captureException(e, {
			tags: {
				section: 'fetcherAirDropClaimData',
			},
		});
		return undefined;
	}
};

export const hasClaimedAirDrop = async (address: string): Promise<boolean> => {
	try {
		const response = await fetchXDaiInfo(address);
		const sdh = new SubgraphDataHelper(transformSubgraphData(response));

		const balances = sdh.getGIVTokenDistroBalance();
		return balances.givDropClaimed;
	} catch (e) {
		console.error('Error on fetching subgraph');
		captureException(e, {
			tags: {
				section: 'hasClaimedAirDrop',
			},
		});
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
	const merkleContract = new Contract(
		merkleAddress,
		MERKLE_ABI,
		provider,
	) as MerkleDistro;

	const claimData = await fetchAirDropClaimData(address);

	if (!claimData) throw new Error('No claim data');

	try {
		return await merkleContract
			.connect(signer.connectUnchecked())
			.claim(
				claimData.index,
				claimData.amount,
				claimData.proof,
				getGasPreference(config.XDAI_CONFIG),
			);
	} catch (error) {
		console.error('Error on claiming GIVdrop:', error);
		captureException(error, {
			tags: {
				section: 'claimAirDrop',
			},
		});
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
		captureException(error, {
			tags: {
				section: 'claimReward',
			},
		});
	}

	// showPendingClaim(network, tx.hash);

	// const { status } = await tx.wait();

	// if (status) {
	// 	showConfirmedClaim(network, tx.hash);
	// } else {
	// 	showFailedClaim(network, tx.hash);
	// }
};
