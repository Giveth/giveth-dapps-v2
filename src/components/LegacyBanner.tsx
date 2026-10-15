import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { brandColors } from '@giveth/ui-design-system';
import { NEW_GIVETH_URL } from '@/lib/legacy';
import { zIndex } from '@/lib/constants/constants';

const DISMISSED_KEY = 'giveth-legacy-banner-dismissed';

export default function LegacyBanner() {
	// Start hidden (matching the server render) and show after the storage
	// check so a dismissed banner never flashes or shifts the header.
	const [visible, setVisible] = useState(false);
	const banner = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let dismissed = false;
		try {
			dismissed = sessionStorage.getItem(DISMISSED_KEY) === 'true';
		} catch {
			// Keep the notice usable when browser storage is unavailable.
		}
		setVisible(!dismissed);
	}, []);

	useEffect(() => {
		const updateHeight = () => {
			document.documentElement.style.setProperty(
				'--legacy-banner-height',
				`${banner.current?.getBoundingClientRect().height || 0}px`,
			);
		};
		updateHeight();
		const observer = new ResizeObserver(updateHeight);
		if (banner.current) observer.observe(banner.current);
		return () => {
			observer.disconnect();
			document.documentElement.style.removeProperty(
				'--legacy-banner-height',
			);
		};
	}, [visible]);

	if (!visible) return null;

	return (
		<Banner ref={banner} role='region' aria-label='Legacy app notice'>
			<span>
				This is the legacy Giveth app, kept for recurring donation
				streams. Everything else has moved to{' '}
				<a href={NEW_GIVETH_URL}>giveth.io</a>.
			</span>
			<button
				type='button'
				aria-label='Dismiss legacy app notice'
				onClick={() => {
					try {
						sessionStorage.setItem(DISMISSED_KEY, 'true');
					} catch {
						// Dismiss for this visit even if storage is blocked.
					}
					setVisible(false);
				}}
			>
				×
			</button>
		</Banner>
	);
}

const Banner = styled.div`
	position: sticky;
	top: 0;
	z-index: ${zIndex.HEADER + 1};
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;
	padding: 12px 24px;
	background: ${brandColors.giv[600]};
	color: white;
	text-align: center;
	a {
		color: inherit;
		text-decoration: underline;
		font-weight: 700;
	}
	button {
		background: transparent;
		border: 0;
		color: inherit;
		font-size: 24px;
		cursor: pointer;
	}
`;
