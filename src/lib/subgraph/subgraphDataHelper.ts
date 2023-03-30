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
import { SimpleNetworkConfig } from '@/types/config';

export class SubgraphDataHelper {
	constructor(private readonly state: ISubgraphState) {}

	getUnipool(address: string): IUnipool {
		return (
			(this.state['unipool_' + address.toLowerCase()] as IUnipool) ||
			transformUnipool({})
		);
	}

	getTokenDistro(address: string): ITokenDistro {
		return (
			(this.state[
				'tokenDistro_' + address.toLowerCase()
			] as ITokenDistro) || transformTokenDistro()
		);
	}

	getTokenBalance(tokenAddress: string): ITokenBalance {
		return (
			(this.state[
				'tokenBalance_' + tokenAddress.toLowerCase()
			] as ITokenBalance) || transformTokenBalance()
		);
	}

	getUnipoolBalance(address: string): IUnipoolBalance {
		return (
			(this.state[
				'unipoolBalance_' + address.toLowerCase()
			] as IUnipoolBalance) || transformUnipoolBalance()
		);
	}

	getTokenDistroBalance(address: string): ITokenDistroBalance {
		return (
			(this.state[
				'tokenDistroBalance_' + address.toLowerCase()
			] as ITokenDistroBalance) || transformTokenDistroBalance({})
		);
	}

	getGIVTokenBalance(): ITokenBalance {
		const givTokenAddress = (
			config.NETWORKS_CONFIG[
				this.state.networkNumber as number
			] as SimpleNetworkConfig
		).TOKEN_ADDRESS;
		return this.getTokenBalance(givTokenAddress);
	}

	getUserGIVPowerBalance(): IUnipoolBalance {
		const givTokenAddress = config.XDAI_CONFIG.GIV.LM_ADDRESS;
		return this.getUnipoolBalance(givTokenAddress);
	}

	getUserGIVLockedBalance(): ITokenBalance {
		return (
			(this.state['userGIVLocked'] as ITokenBalance) ||
			transformTokenBalance()
		);
	}

	getGIVTokenDistro(): ITokenDistro {
		const tokenDistroAddress = (
			config.NETWORKS_CONFIG[
				this.state.networkNumber as number
			] as SimpleNetworkConfig
		).TOKEN_DISTRO_ADDRESS;
		return this.getTokenDistro(tokenDistroAddress);
	}

	getGIVTokenDistroBalance(): ITokenDistroBalance {
		const tokenDistroAddress = (
			config.NETWORKS_CONFIG[
				this.state.networkNumber as number
			] as SimpleNetworkConfig
		).TOKEN_DISTRO_ADDRESS;
		return this.getTokenDistroBalance(tokenDistroAddress);
	}
}
