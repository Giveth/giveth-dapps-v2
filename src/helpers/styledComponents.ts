import { InputSize } from '@/components/Input';

export const inputSizeToFontSize = (inputSize?: InputSize) => {
	switch (inputSize) {
		case InputSize.SMALL:
			return 12;
		case InputSize.MEDIUM:
			return 16;
		case InputSize.LARGE:
			return 16;
		default:
			return 16;
	}
};

export const inputSizeToHeight = (inputSize?: InputSize) => {
	switch (inputSize) {
		case InputSize.SMALL:
			return 32;
		case InputSize.MEDIUM:
			return 54;
		case InputSize.LARGE:
			return 56;
		default:
			return 56;
	}
};

export const inputSizeToPaddingLeft = (inputSize?: InputSize) => {
	switch (inputSize) {
		case InputSize.SMALL:
			return 36;
		case InputSize.MEDIUM:
			return 44;
		case InputSize.LARGE:
			return 44;
		default:
			return 44;
	}
};
