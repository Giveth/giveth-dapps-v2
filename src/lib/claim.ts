import { captureException } from '@sentry/nextjs';
import { WriteContractReturnType } from 'viem';
import { type Address } from 'viem';
import { writeContract } from '@wagmi/core';
import { ClaimData } from '@/types/GIV';
import config from '../configuration';
import MerkleDropJson from '../artifacts/MerkleDrop.json';
import TOKEN_DISTRO_JSON from '../artifacts/TokenDistro.json';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { wagmiConfig } from '@/wagmiConfigs';
import { fetchSubgraphData } from '@/components/controller/subgraph.ctrl';

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

export const hasClaimedAirDrop = async (address: Address): Promise<boolean> => {
	try {
		const response = await fetchSubgraphData(
			config.GNOSIS_NETWORK_NUMBER,
			address,
		);
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
	chainId: number,
): Promise<WriteContractReturnType | undefined> => {
	const merkleAddress = config.GNOSIS_CONFIG.MERKLE_ADDRESS;

	const claimData = await fetchAirDropClaimData(address);
	if (!claimData) throw new Error('No claim data');

	try {
		return await writeContract(wagmiConfig, {
			address: merkleAddress,
			chainId,
			abi: MERKLE_ABI,
			functionName: 'claim',
			args: [claimData.index, claimData.amount, claimData.proof],
			// @ts-ignore -- needed for safe txs
			value: 0n,
		});
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
	tokenDistroAddress: Address,
	chainId: number | null,
): Promise<WriteContractReturnType | undefined> => {
	if (!chainId) return;

	try {
		return writeContract(wagmiConfig, {
			address: tokenDistroAddress,
			abi: TOKEN_DISTRO_ABI,
			chainId,
			functionName: 'claim',
			value: 0n,
		});
	} catch (error) {
		console.error('Error on claiming token distro reward:', error);
		captureException(error, {
			tags: {
				section: 'claimReward',
			},
		});
	}
};
