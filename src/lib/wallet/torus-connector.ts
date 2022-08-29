import { AbstractConnector } from '@web3-react/abstract-connector';
import { ConnectorUpdate } from '@web3-react/types';
import TorusInpageProvider from '@toruslabs/torus-embed/dist/types/inpage-provider';
import { Maybe } from '@toruslabs/torus-embed';
import config from '@/configuration';
import type Torus from '@toruslabs/torus-embed';

interface TorusConnectorArguments {
	chainIds: number[];
	initOptions?: any;
	constructorOptions?: any;
	loginOptions?: any;
}

const networks: { [key: number]: string } = {
	1: 'mainnet',
	100: 'xdai',
	5: 'goerli',
};

export class TorusConnector extends AbstractConnector {
	private readonly constructorOptions: any;
	private readonly loginOptions: any;
	private readonly chainIds: number[];

	public torus: Torus | undefined;

	constructor({
		chainIds,
		constructorOptions = {},
		loginOptions = {},
	}: TorusConnectorArguments) {
		super({ supportedChainIds: chainIds });

		this.chainIds = chainIds;
		this.constructorOptions = constructorOptions;
		this.loginOptions = loginOptions;
	}

	public async activate(): Promise<ConnectorUpdate> {
		if (!this.torus) {
			const TorusEmbed = await import('@toruslabs/torus-embed').then(
				m => m?.default ?? m,
			);

			this.torus = new TorusEmbed(this.constructorOptions);

			const host =
				networks[this.chainIds[0]] ||
				networks[config.MAINNET_NETWORK_NUMBER];
			await this.torus.init({
				network: {
					chainId: this.chainIds[0],
					host: host,
				},
			});

			this.torus.ethereum.on('chainChanged', chainId => {
				if (chainId)
					this.emitUpdate({
						chainId: Number(chainId),
					});
			});
		}

		const account = await this.torus
			.login(this.loginOptions)
			.then((accounts: string[]): string => accounts[0]);

		return { provider: this.torus.provider, account };
	}

	public async getProvider(): Promise<TorusInpageProvider | undefined> {
		return this?.torus?.provider;
	}

	public async getChainId(): Promise<number | string> {
		const provider = await this.getProvider();
		return provider?.chainId || 0;
	}

	public async getAccount(): Promise<null | string> {
		const accounts: Maybe<[string]> | undefined =
			await this?.torus?.ethereum?.request({
				method: 'eth_accounts',
			});
		if (accounts && accounts[0]) return accounts[0];

		return null;
	}

	public async deactivate() {
		await this.close();
	}

	public async close() {
		await this?.torus?.cleanUp();
		this.torus = undefined;
		this.emitDeactivate();
	}

	public async changeChainId(network: number) {
		const host =
			networks[network] || networks[config.MAINNET_NETWORK_NUMBER];
		this.torus?.setProvider({
			host,
		});
	}
}
