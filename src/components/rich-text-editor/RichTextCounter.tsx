import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { neutralColors, SublineBold } from '@giveth/ui-design-system';

const calcLengthOfHTML = (html: string) => {
	const plainString = html.replace(/<[^>]+>/g, '');
	return plainString.length;
};

interface IRichTextCounterProps {
	value: string;
	maxLimit?: number;
	minLimit?: number;
	setHasLimitError?: (i: boolean) => void;
}

const RichTextCounter: FC<IRichTextCounterProps> = props => {
	const { value, maxLimit, minLimit, setHasLimitError } = props;
	const [count, setCount] = useState(0);

	useEffect(() => {
		const temp = setTimeout(() => {
			const _count = calcLengthOfHTML(value);
			setCount(_count);
			setHasLimitError &&
				setHasLimitError(
					maxLimit ? _count > maxLimit : _count < minLimit!,
				);
		}, 1000);
		return () => {
			clearTimeout(temp);
		};
	}, [maxLimit, minLimit, setHasLimitError, value]);

	return (
		<CounterContainer>
			{count} / {maxLimit || minLimit}
		</CounterContainer>
	);
};

const CounterContainer = styled(SublineBold)`
	position: absolute;
	bottom: 10px;
	right: 10px;
	background-color: ${neutralColors.gray[300]};
	border-radius: 64px;
	padding: 6px 10px;
	color: ${neutralColors.gray[700]};
	opacity: 0.8;
`;

export default RichTextCounter;
