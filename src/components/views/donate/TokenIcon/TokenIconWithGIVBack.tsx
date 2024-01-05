import {
	IconGIVBack16,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';
import { ITokenIconProps, TokenIcon } from './TokenIcon';

interface ITokenIconWithGIVBackProps extends ITokenIconProps {
	showGiveBack?: boolean;
}

export const TokenIconWithGIVBack: FC<ITokenIconWithGIVBackProps> = ({
	showGiveBack = true,
	...props
}) => {
	return showGiveBack ? (
		<TokenIconWrapper>
			<TokenIcon {...props} />
			<GIVBackBadge>
				<IconGIVBack16 size={16} color={brandColors.giv[500]} />
			</GIVBackBadge>
		</TokenIconWrapper>
	) : (
		<TokenIcon {...props} />
	);
};

const TokenIconWrapper = styled.div`
	position: relative;
`;

const GIVBackBadge = styled.div`
	position: absolute;
	bottom: 0;
	right: 0;
	width: 16px;
	height: 16px;
	background: ${neutralColors.gray[100]};
	border-radius: 50%;
`;
