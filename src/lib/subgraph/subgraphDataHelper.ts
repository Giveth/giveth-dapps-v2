import { ISubgraphState } from '@/features/subgraph/subgraph.types';
import {
	ITokenBalance,
	ITokenDistro,
	ITokenDistroBalance,
	IUnipool,
	IUnipoolBalance,
} from '@/types/subgraph';
import {
	transformTokenBalance,
	transformTokenDistro,
	transformTokenDistroBalance,
	transformUnipool,
	transformUnipoolBalance,
} from '@/lib/subgraph/subgraphDataTransform';
import config from '@/configuration';

export class SubgraphDataHelper {
	constructor(private readonly state: ISubgraphState) {}

	getUnipool(address: string): IUnipool {
		return (
			(this.state['unipool_' + address.toLowerCase()] as IUnipool) ||
			transformUnipool({})
		);
	}

	getTokenDistro(address?: string): ITokenDistro {
		return address
			? (this.state[
					'tokenDistro_' + address.toLowerCase()
			  ] as ITokenDistro) || transformTokenDistro()
			: transformTokenDistro();
	}

	getTokenBalance(tokenAddress?: string): ITokenBalance {
		return tokenAddress
			? (this.state[
					'tokenBalance_' + tokenAddress?.toLowerCase()
			  ] as ITokenBalance) || transformTokenBalance()
			: transformTokenBalance();
	}

	getUnipoolBalance(address: string): IUnipoolBalance {
		return (
			(this.state[
				'unipoolBalance_' + address.toLowerCase()
			] as IUnipoolBalance) || transformUnipoolBalance()
		);
	}

	getTokenDistroBalance(address?: string): ITokenDistroBalance {
		return address
			? (this.state[
					'tokenDistroBalance_' + address.toLowerCase()
			  ] as ITokenDistroBalance) || transformTokenDistroBalance({})
			: transformTokenDistroBalance({});
	}

	getGIVTokenBalance(): ITokenBalance {
		const givTokenAddress =
			config.NETWORKS_CONFIG[this.state.networkNumber as number]
				?.GIV_TOKEN_ADDRESS;
		return this.getTokenBalance(givTokenAddress);
	}

	getUserGIVPowerBalance(): IUnipoolBalance {
		const _config =
			config.NETWORKS_CONFIG[this.state.networkNumber as number];
		if (!_config || !_config.GIVPOWER) return transformUnipoolBalance();
		const givpowerLMAddress = _config.GIVPOWER.LM_ADDRESS;
		return this.getUnipoolBalance(givpowerLMAddress);
	}

	getUserGIVLockedBalance(): ITokenBalance {
		return (
			(this.state['userGIVLocked'] as ITokenBalance) ||
			transformTokenBalance()
		);
	}

	getGIVTokenDistro(): ITokenDistro {
		const tokenDistroAddress =
			config.NETWORKS_CONFIG[this.state.networkNumber as number]
				?.TOKEN_DISTRO_ADDRESS;
		return this.getTokenDistro(tokenDistroAddress);
	}

	getGIVTokenDistroBalance(): ITokenDistroBalance {
		const tokenDistroAddress =
			config.NETWORKS_CONFIG[this.state.networkNumber as number]
				?.TOKEN_DISTRO_ADDRESS;
		return this.getTokenDistroBalance(tokenDistroAddress);
	}
}
