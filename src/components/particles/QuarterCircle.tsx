import React from 'react';
import { brandColors } from '@giveth/ui-design-system';

const QuarterCircle = ({
	color = brandColors.pinky[500],
}: {
	color?: string;
}) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='31'
			height='32'
			fill='none'
		>
			<path fill={color} d='M31 31.004c0-17.093-13.907-31-31-31v31h31Z' />
		</svg>
	);
};

export default QuarterCircle;
