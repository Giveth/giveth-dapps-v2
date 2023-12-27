import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { neutralColors, SublineBold } from '@giveth/ui-design-system';

const calcLengthOfHTML = (html: string) => {
	const plainString = html.replace(/<[^>]+>/g, '');
	return plainString.length;
};

interface IRichTextCounterProps {
	value: string;
	limit: number;
	setIsLimitExceeded?: (i: boolean) => void;
}

const RichTextCounter: FC<IRichTextCounterProps> = props => {
	const { value, limit, setIsLimitExceeded } = props;
	const [count, setCount] = useState(0);
	useEffect(() => {
		const temp = setTimeout(() => {
			const _count = calcLengthOfHTML(value);
			setCount(_count);
			setIsLimitExceeded && setIsLimitExceeded(_count > limit);
		}, 1000);

		return () => {
			clearTimeout(temp);
		};
	}, [limit, setIsLimitExceeded, value]);

	return (
		<CounterContainer>
			{count} / {limit}
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
