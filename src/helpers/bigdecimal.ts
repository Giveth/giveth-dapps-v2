export class BigDecimal {
	private value: bigint;
	private precision: bigint;

	constructor(input: number | string, precision: number = 6) {
		this.precision = BigInt(precision);
		this.value = BigInt(
			Math.round(
				parseFloat(input.toString()) *
					Math.pow(10, Number(this.precision)),
			),
		);
	}

	// Helper to convert bigint back to a floating point number
	private fromBigInt(bigIntValue: bigint): string {
		const stringValue = bigIntValue.toString();
		const beforeDecimal = stringValue.slice(
			0,
			-Number(this.precision) || undefined,
		);
		const afterDecimal = stringValue
			.slice(-Number(this.precision))
			.padStart(Number(this.precision), '0');
		return `${beforeDecimal}.${afterDecimal}`;
	}

	// Arithmetic operations
	public add(other: BigDecimal): BigDecimal;
	public add(other: bigint): BigDecimal;
	public add(other: BigDecimal | bigint): BigDecimal {
		const otherValue =
			other instanceof BigDecimal
				? other.value
				: other * 10n ** this.precision;
		return new BigDecimal(
			parseFloat(this.fromBigInt(this.value + otherValue)),
			Number(this.precision),
		);
	}

	public subtract(other: BigDecimal): BigDecimal;
	public subtract(other: bigint): BigDecimal;
	public subtract(other: BigDecimal | bigint): BigDecimal {
		const otherValue =
			other instanceof BigDecimal
				? other.value
				: other * 10n ** this.precision;
		return new BigDecimal(
			parseFloat(this.fromBigInt(this.value - otherValue)),
			Number(this.precision),
		);
	}

	public multiply(other: BigDecimal): BigDecimal;
	public multiply(other: bigint): BigDecimal;
	public multiply(other: BigDecimal | bigint): BigDecimal {
		if (other instanceof BigDecimal) {
			const result = (this.value * other.value) / 10n ** this.precision;
			return new BigDecimal(
				parseFloat(this.fromBigInt(result)),
				Number(this.precision),
			);
		} else {
			const result = this.value * other;
			return new BigDecimal(
				parseFloat(this.fromBigInt(result)),
				Number(this.precision),
			);
		}
	}

	public divide(other: BigDecimal): BigDecimal;
	public divide(other: bigint): BigDecimal;
	public divide(other: BigDecimal | bigint): BigDecimal {
		const otherValue =
			other instanceof BigDecimal
				? other.value
				: other * 10n ** this.precision;
		if (otherValue === 0n) {
			throw new Error('Division by zero is not allowed.');
		}
		const result = (this.value * 10n ** this.precision) / otherValue;
		return new BigDecimal(
			parseFloat(this.fromBigInt(result)),
			Number(this.precision),
		);
	}

	public toString(): string {
		return this.fromBigInt(this.value);
	}
}

// Example usage
const a = new BigDecimal('1.23');
const b = new BigDecimal('4.56');
const c = BigInt(789);

console.log(a.add(b).toString()); // BigDecimal + BigDecimal
console.log(a.subtract(c).toString()); // BigDecimal - BigInt
console.log(a.multiply(c).toString()); // BigDecimal * BigInt
console.log(a.divide(c).toString()); // BigDecimal / BigInt
