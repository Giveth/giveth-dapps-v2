import BigNumber from 'bignumber.js';
import config from '@/configuration';
import { formatEther } from 'viem';

export const Zero = new BigNumber(0);

export const formatEthHelper = (
	amount: BigNumber.Value,
	decimals: number = config.TOKEN_PRECISION,
	format = true,
): string => {
	if (!amount) return '0';
	let amt: BigNumber =
		amount instanceof BigNumber ? amount : new BigNumber(amount);
	if (amt.isZero()) return '0';
	if (format && amt.gt(10 ** 10)) {
		return amt.toExponential(10);
	}
	amt = amt.decimalPlaces(Number(decimals), BigNumber.ROUND_DOWN);
	return format
		? amt.lt(0.0001)
			? '<0.0001'
			: amt.toFormat({
				groupSize: 3,
				groupSeparator: ',',
				decimalSeparator: '.',
			})
		: amt.toFixed();
};

export const formatWeiHelper = (
	amountWei: bigint | BigNumber.Value,
	decimals: number = config.TOKEN_PRECISION,
	format = true,
): string => {
	let amountEth: BigNumber.Value;
	if (typeof amountWei === "bigint")
		amountEth = formatEther(amountWei);
	else {
		amountEth = new BigNumber(amountWei).div(10 ** 18);
	}
	return formatEthHelper(amountEth, decimals, format);
};

export const formatDonations = (
	amount: number,
	symbol: string = '',
	rounded: boolean = false,
): string => {
	if (amount === 0) {
		return rounded ? `${symbol}0` : `${symbol}0.00`;
	}
	if (rounded && amount < 1) return `<${symbol}1`;
	if (amount < 0.01) return `<${symbol}0.01`;
	return !rounded ? symbol + amount.toFixed(2) : symbol + Math.round(amount);
};
