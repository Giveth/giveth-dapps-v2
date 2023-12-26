import { type Address } from 'wagmi';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { MAX_TOKEN_ORDER } from '@/lib/constants/tokens';
import { IWalletAddress } from '@/apollo/types/types';
import { EDonationFailedType } from '@/components/modals/FailedDonation';
import config from '@/configuration';

export interface ISelectedToken extends IProjectAcceptedToken {
	value?: IProjectAcceptedToken;
	label?: string;
}

interface INetworkIds {
	[key: number]: boolean;
}

export const prepareTokenList = (tokens: IProjectAcceptedToken[]) => {
	const _tokens: ISelectedToken[] = [...tokens];
	_tokens.sort((t1, t2) => {
		const t1Order = t1.order || MAX_TOKEN_ORDER;
		const t2Order = t2.order || MAX_TOKEN_ORDER;
		if (t1Order === t2Order) {
			const t1Name = t1.name.toLowerCase();
			const t2Name = t2.name.toLowerCase();
			return t2Name > t1Name ? -1 : 1;
		}
		return t2Order > t1Order ? -1 : 1;
	});
	_tokens.forEach((token: IProjectAcceptedToken, index: number) => {
		_tokens[index] = {
			...token,
			value: token,
			label: token.symbol,
		};
	});
	return _tokens;
};

export const filterTokens = (
	tokens: IProjectAcceptedToken[],
	networkId: number,
	acceptedNetworkIds: number[],
) => {
	if (!acceptedNetworkIds.includes(networkId)) return [];
	return tokens.filter(i => i.networkId === networkId);
};

export const getNetworkIds = (
	tokens: IProjectAcceptedToken[],
	recipientAddresses?: IWalletAddress[],
) => {
	const recipientAddressesNetwork = recipientAddresses?.map(
		address => address.isRecipient && address.networkId,
	);
	const networkIds: INetworkIds = {};
	tokens.forEach(i => {
		networkIds[i.networkId] = true;
	});
	const networkIdArrays = Object.keys(networkIds).map(i => Number(i));
	return networkIdArrays.filter(
		networkId => recipientAddressesNetwork?.includes(networkId),
	);
};

export const getNetworkNames = (networks: number[], text: string) => {
	return networks.map((network, index) => {
		const name = config.NETWORKS_CONFIG[network]?.name;
		const lastLoop = networks.length === index + 1;
		return (
			<span key={network}>
				{name}
				{!lastLoop && ' ' + text + ' '}
			</span>
		);
	});
};

export interface ICreateDonation {
	walletAddress: Address;
	projectId: number;
	amount: number;
	token: IProjectAcceptedToken;
	anonymous?: boolean;
	chainvineReferred?: string | null;
	symbol: string;
	setFailedModalType: (type: EDonationFailedType) => void;
}

export interface ICreateDonationResult {
	isSaved: boolean;
	txHash: string;
}

type TCreateDonation = (i: ICreateDonation) => Promise<ICreateDonationResult>;
