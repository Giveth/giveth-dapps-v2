import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { MAX_TOKEN_ORDER } from '@/lib/constants/tokens';
import { EDonationFailedType } from '@/components/modals/FailedDonation';
import { minDonationAmount } from '@/lib/constants/constants';
import { truncateToDecimalPlaces } from '@/lib/helpers';
import { INetworkIdWithChain } from './common.types';
import { getChainName } from '@/lib/network';

export interface ISelectedToken extends IProjectAcceptedToken {
	value?: IProjectAcceptedToken;
	label?: string;
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

export const getNetworkNames = (
	networks: INetworkIdWithChain[],
	text: string,
) => {
	return networks.map((network, index) => {
		// Access the network name using networkId or chainType based on the chainType
		const name = getChainName(network.networkId, network.chainType);

		const lastLoop = networks.length === index + 1;
		return (
			<span key={network.networkId}>
				{name}
				{!lastLoop && ' ' + text + ' '}
			</span>
		);
	});
};

export interface ICreateDonation {
	walletAddress: string;
	projectId: number;
	amount: number;
	token: IProjectAcceptedToken;
	anonymous?: boolean;
	chainvineReferred?: string | null;
	symbol: string;
	setFailedModalType: (type: EDonationFailedType) => void;
}

export const calcDonationShare = (
	totalDonation: number,
	givethDonationPercent: number,
	decimals = 6,
) => {
	let givethDonation = totalDonation * (givethDonationPercent / 100);
	if (givethDonation < minDonationAmount && givethDonationPercent !== 0) {
		givethDonation = minDonationAmount;
	}
	let projectDonation = totalDonation - givethDonation;
	if (projectDonation < minDonationAmount) {
		projectDonation = minDonationAmount;
	}
	return {
		projectDonation: truncateToDecimalPlaces(
			String(projectDonation),
			decimals,
		),
		givethDonation: truncateToDecimalPlaces(
			String(givethDonation),
			decimals,
		),
	};
};
