import {
	IconGIVBack16,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { ITokenIconProps, TokenIcon } from './TokenIcon';

interface TokenIconWrapperProps {
	$isSuperToken: boolean;
}

interface ITokenIconWithGIVBackProps extends ITokenIconProps {
	showGiveBack?: boolean;
	isSuperToken?: boolean;
}

export const TokenIconWithGIVBack: FC<ITokenIconWithGIVBackProps> = ({
	showGiveBack = true,
	isSuperToken = false,
	...props
}) => {
	return (
		<TokenIconWrapper $isSuperToken={isSuperToken}>
			<TokenIcon {...props} />
			{isSuperToken && <SecondGreenDot />}
			{showGiveBack && (
				<GIVBackBadge>
					<IconGIVBack16 color={brandColors.giv[500]} />
				</GIVBackBadge>
			)}
		</TokenIconWrapper>
	);
};

const TokenIconWrapper = styled.div<TokenIconWrapperProps>`
	position: relative;
	${props =>
		props.$isSuperToken
			? css`
					display: inline-flex;
					justify-content: center;
					align-items: center;
					height: 40px;
					width: 40px;
					border: 2px solid #36ce36;
					padding: 1px;
					border-radius: 50%;

					& > img:first-child {
						z-index: 5;
					}

					&:before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						width: 16px;
						height: 7px;
						border-radius: 50%;
						background-color: white;
					}

					&:after {
						content: '';
						position: absolute;
						top: 1px;
						left: 7px;
						width: 2px;
						height: 2px;
						border-radius: 50%;
						background-color: #36ce36;
					}
				`
			: css`
					display: flex;
					justify-content: center;
					align-items: center;
				`}
`;

const SecondGreenDot = styled.div`
	position: absolute;
	top: 3px;
	left: 4px;
	width: 2px;
	height: 2px;
	border-radius: 50%;
	background-color: #36ce36;
`;

const GIVBackBadge = styled.div`
	position: absolute;
	bottom: 0;
	right: 0;
	width: 16px;
	height: 16px;
	background: ${neutralColors.gray[100]};
	border-radius: 50%;
	z-index: 10;
`;
