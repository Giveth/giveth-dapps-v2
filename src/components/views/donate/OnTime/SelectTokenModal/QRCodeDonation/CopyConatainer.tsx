import React, { FC, useState } from 'react';
import { Button, neutralColors, P, IconLink } from '@giveth/ui-design-system';
import styled, { keyframes, css } from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';
import { mediaQueries } from '@/lib/constants/constants';

const CopyContainer: FC<{ text: string }> = ({ text }) => {
	const [isAnimating, setIsAnimating] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(text);
		setIsAnimating(true);

		setTimeout(() => {
			setIsAnimating(false);
		}, 300);
	};

	return (
		<StyledCopyContainer>
			<P>{text}</P>
			<StyledCopyButton
				buttonType='texty-primary'
				label='Copy'
				leftIcon={<IconLink />}
				onClick={copyToClipboard}
				isAnimating={isAnimating}
			/>
		</StyledCopyContainer>
	);
};

const StyledCopyContainer = styled.div`
	display: flex;
	border: 1px solid ${neutralColors.gray[300]};
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	border-radius: 8px;
	gap: 16px;
	padding: 16px;
	width: 100%;
	word-break: break-word;
	overflow-wrap: break-word;

	${mediaQueries.mobileL} {
		flex-direction: row;
	}
`;

const animateButton = keyframes`
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
`;

const StyledCopyButton = styled(Button)<{ isAnimating: boolean }>`
	box-shadow: ${Shadow.Neutral[400]};
	${props =>
		props.isAnimating &&
		css`
			animation: ${animateButton} 0.3s;
		`}
`;

export default CopyContainer;
