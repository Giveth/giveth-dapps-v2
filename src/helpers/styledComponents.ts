import { InputSize } from '@/components/Input';

export const INPUT_VERTICAL_PADDING_SMALL = 8;
export const INPUT_HORIZONTAL_PADDING_SMALL = 8;

export const INPUT_VERTICAL_PADDING_MEDIUM = 15;
export const INPUT_HORIZONTAL_PADDING_MEDIUM = 16;

export const INPUT_VERTICAL_PADDING_LARGE = 18;
export const INPUT_HORIZONTAL_PADDING_LARGE = 16;

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

export const inputSizeToPaddingLeft = (
	inputSize?: InputSize,
	hasLeftIcon?: boolean,
) => {
	if (hasLeftIcon) {
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
	} else {
		switch (inputSize) {
			case InputSize.SMALL:
				return INPUT_HORIZONTAL_PADDING_SMALL;
			case InputSize.MEDIUM:
				return INPUT_HORIZONTAL_PADDING_MEDIUM;
			case InputSize.LARGE:
				return INPUT_HORIZONTAL_PADDING_LARGE;
			default:
				return INPUT_HORIZONTAL_PADDING_LARGE;
		}
	}
};

export const inputSizeToVerticalPadding = (inputSize?: InputSize) => {
	switch (inputSize) {
		case InputSize.SMALL:
			return INPUT_VERTICAL_PADDING_SMALL;
		case InputSize.MEDIUM:
			return INPUT_VERTICAL_PADDING_MEDIUM;
		case InputSize.LARGE:
			return INPUT_VERTICAL_PADDING_LARGE;
		default:
			return INPUT_VERTICAL_PADDING_LARGE;
	}
};
