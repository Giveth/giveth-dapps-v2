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
