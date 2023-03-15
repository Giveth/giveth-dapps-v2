import React from 'react';
import { brandColors } from '@giveth/ui-design-system';

const QuarterArc = ({ color = brandColors.pinky[500] }: { color?: string }) => {
	return (
		<svg
			width='27'
			height='27'
			viewBox='0 0 27 27'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M13.7484 0C13.7484 7.53821 7.65144 13.671 0.157057 13.671C0.103944 13.671 0.0528837 13.6634 0 13.6629V26.9962C0.0526548 26.9962 0.104402 27 0.157057 27C14.9819 27 27 14.9122 27 0.000222759L13.7484 0Z'
				fill={color}
			/>
		</svg>
	);
};

export default QuarterArc;
