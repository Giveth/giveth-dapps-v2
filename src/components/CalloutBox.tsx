import React, { FC } from 'react';

interface CalloutBoxProps {
	title: string;
	description: string;
	buttonLabel: string;
	onClose: () => void;
	type?: 'info' | 'warning';
}

const CalloutBox: FC<CalloutBoxProps> = ({
	title,
	description,
	buttonLabel,
	onClose,
}) => (
	<div
		style={{
			background: '#816cff', // lighter purple
			padding: '20px 24px',
			borderRadius: '16px',
			color: 'white',
			marginBottom: '16px',
			position: 'relative',
			fontFamily: 'Arial, sans-serif',
		}}
	>
		<strong
			style={{
				display: 'block',
				fontWeight: '700',
				textTransform: 'uppercase',
				fontSize: '16px',
				marginBottom: '12px',
			}}
		>
			{title}
		</strong>
		<p
			style={{
				fontWeight: '400',
				fontSize: '14px',
				lineHeight: '1.5',
				marginBottom: '40px', // enough space for the button
			}}
		>
			{description}
		</p>
		<button
			onClick={onClose}
			style={{
				position: 'absolute',
				right: '20px',
				bottom: '20px',
				color: '#fff',
				background: 'transparent',
				border: '1.5px solid #fff',
				borderRadius: '8px',
				padding: '8px 16px',
				cursor: 'pointer',
				fontWeight: '600',
				fontSize: '14px',
			}}
		>
			{buttonLabel}
		</button>
	</div>
);

export const CalloutContainer: FC<{
	visible: boolean;
	children: React.ReactNode;
}> = ({ visible, children }) => (
	<div
		style={{
			height: visible ? 'auto' : '116px', // reserve space when hidden (adjust if needed)
			visibility: visible ? 'visible' : 'hidden',
			pointerEvents: visible ? 'auto' : 'none',
			marginBottom: '16px',
			transition: 'visibility 0.3s ease',
		}}
	>
		{children}
	</div>
);

export default CalloutBox;
