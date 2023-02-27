import React from 'react';

const SemiCircle = ({ color = '#FED670' }: { color?: string }) => {
	return (
		<svg
			width='26'
			height='28'
			viewBox='0 0 26 28'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				opacity='0.6'
				d='M13.126 0.400146C13.126 7.84422 7.30508 13.9004 0.149947 13.9004C0.0992387 13.9004 0.0504898 13.8929 0 13.8925V27.0592C0.0502712 27.0592 0.0996759 27.063 0.149947 27.063C14.3037 27.063 25.7778 15.1261 25.7778 0.400366L13.126 0.400146Z'
				fill={color}
			/>
		</svg>
	);
};

export default SemiCircle;
