import { useState } from 'react';
import { IconCopy, neutralColors, Subline } from '@giveth/ui-design-system';
import styled from 'styled-components';

interface ICopyToClipboard {
	text: string;
}

export const CopyToClipboard = ({ text }: ICopyToClipboard) => {
	const [quickMsg, setQuickMsg] = useState(false);

	const copyEvent = () => {
		setQuickMsg(true);
		navigator.clipboard.writeText(text);
		setTimeout(() => setQuickMsg(false), 3000);
	};

	return (
		<div>
			{quickMsg && (
				<CopiedBox>
					<img src='/images/triangle-gray.svg' />
					<Subline>Copied!</Subline>
				</CopiedBox>
			)}
			<a onClick={copyEvent}>
				<IconCopy />
			</a>
		</div>
	);
};

const CopiedBox = styled.div`
	display: flex;
	flex-direction: column;
	position: absolute;
	width: 58px;
	height: 34px;
	padding: 8px;
	align-items: center;
	text-align: center;
	border-radius: 8px;
	margin: 25px 0 0 -20px;
	z-index: 4;
	color: white;
	background-color: ${neutralColors.gray[600]};
	img {
		position: absolute;
		top: -8px;
	}
`;
