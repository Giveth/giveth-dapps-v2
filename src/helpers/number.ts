import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import config from '@/configuration';

export const Zero = new BigNumber(0);
export const BN = ethers.BigNumber.from;

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
	amountWei: ethers.BigNumber | BigNumber.Value,
	decimals: number = config.TOKEN_PRECISION,
	format = true,
): string => {
	let amountEth: BigNumber.Value;
	if (amountWei instanceof ethers.BigNumber)
		amountEth = ethers.utils.formatEther(amountWei);
	else {
		amountEth = new BigNumber(amountWei).div(10 ** 18);
	}
	return formatEthHelper(amountEth, decimals, format);
};

export const formatDonation = (
	amount: string | number,
	symbol: string = '',
	rounded: boolean = false,
	local: Intl.LocalesArgument = 'en-US',
	maximumFractionDigits: number = 2,
): string => {
	const num = parseFloat(String(amount || 0));
	if (rounded) maximumFractionDigits = 0;
	const threshold = Math.pow(10, -maximumFractionDigits);
	if (num === 0) {
		return rounded
			? `${symbol}0`
			: `${symbol}${threshold.toString().replace('1', '0')}`;
	}
	if (num < threshold) return `< ${symbol}${threshold}`;
	return !rounded
		? symbol + num.toLocaleString(local, { maximumFractionDigits })
		: symbol + Math.round(num);
};
