import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import config from '@/configuration';

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

export const gwei2wei = (gweiAmount: string): string =>
	ethers.utils.parseUnits(gweiAmount, 'gwei').toString();
