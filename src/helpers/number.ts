import BigNumber from 'bignumber.js';
import { formatEther, formatUnits } from 'viem';
import config from '@/configuration';
import { truncateToDecimalPlaces } from '@/lib/helpers';

export const Zero = new BigNumber(0);

export const formatCrypto = (amount: bigint, decimals: number) => {
	return truncateToDecimalPlaces(formatUnits(amount, decimals), decimals / 3);
};

export const formatCryptoFor8Decimals = (amount: bigint) => {
	return truncateToDecimalPlaces(formatUnits(amount, 8), 6);
};

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
	if (typeof amountWei === 'bigint') amountEth = formatEther(amountWei);
	else {
		amountEth = new BigNumber(amountWei).div(10 ** 18);
	}
	return formatEthHelper(amountEth, decimals, format);
};

export const formatDonation = (
	amount: string | number,
	symbol: string = '',
	local: Intl.LocalesArgument = 'en-US',
	rounded: boolean = false,
	maximumFractionDigits: number = 2,
): string => {
	if (amount === '<0.000001') {
		return '< 0.01';
	}
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
		: symbol + Math.round(num).toLocaleString(local);
};

export function limitFraction(
	numberStr: string,
	maxDecimals: number = config.DONATE_TOKEN_PRECISION,
	trim: boolean = false,
): string {
	let number = parseFloat(numberStr);

	if (isNaN(number)) {
		return '--';
	}

	let smallestRepresentable = parseFloat(`1e-${maxDecimals}`);

	if (0 < Math.abs(number) && Math.abs(number) < smallestRepresentable) {
		return `<${smallestRepresentable.toFixed(maxDecimals)}`;
	}

	let formattedNumber = truncateToDecimalPlaces(
		numberStr.toString(),
		maxDecimals,
	).toString();

	// If trim is true, remove trailing zeros after the decimal point, and also the decimal point if it becomes unnecessary.
	if (trim) {
		// Regex to remove trailing zeros and decimal point if necessary
		formattedNumber = formattedNumber.replace(/\.?0+$/, '');
	}

	return formattedNumber;
}
