import { brandColors, P } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

const suggestedSearches = [
	'Nature',
	'Ocean',
	'Food',
	'People',
	'Pollution',
	'Space',
	'Abstract',
];

const ImageSuggestions = (props: { onClick: (s: string) => void }) => {
	return (
		<Container>
			<P>Suggested searches:</P>
			<P>
				{suggestedSearches.map((s, index) => (
					<>
						<span key={s} onClick={() => props.onClick(s)}>
							{s}
						</span>
						{index + 1 !== suggestedSearches.length && ', '}
					</>
				))}
			</P>
		</Container>
	);
};

const Container = styled.div`
	margin: 24px 0;
	> :nth-child(2) {
		color: ${brandColors.pinky[500]};
		> span {
			cursor: pointer;
		}
	}
`;

export default ImageSuggestions;
