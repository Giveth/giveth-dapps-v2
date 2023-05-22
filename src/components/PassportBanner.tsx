import {
	IconAlertTriangleFilled24,
	IconInfoOutline24,
	IconPassport24,
	IconVerifiedBadge24,
	P,
	brandColors,
	semanticColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Flex } from './styled-components/Flex';

enum EPBGState {
	SUCCESS,
	INFO,
	WARNING,
	ERROR,
}

enum EPassportBannerState {
	LOADING,
	CONNECT,
	NOT_ELIGIBLE,
	ELIGIBLE,
	ENDED,
	INVALID_PASSPORT,
	ERROR,
	INVALID_RESPONSE,
}

interface IPassportBannerWrapperProps {
	state: EPBGState;
}

const bgColor = {
	[EPBGState.SUCCESS]: semanticColors.jade[100],
	[EPBGState.INFO]: semanticColors.golden[200],
	[EPBGState.WARNING]: brandColors.giv[100],
	[EPBGState.ERROR]: semanticColors.punch[100],
};

const data = {
	[EPassportBannerState.LOADING]: {
		content: 'label.passport.loading',
		bg: EPBGState.WARNING,
		icon: <IconPassport24 />,
	},
	[EPassportBannerState.CONNECT]: {
		content: 'label.passport.connect_wallet',
		bg: EPBGState.INFO,
		icon: <IconInfoOutline24 color={semanticColors.golden[700]} />,
	},
	[EPassportBannerState.NOT_ELIGIBLE]: {
		content: 'label.passport.not_eligible',
		bg: EPBGState.WARNING,
		icon: <IconAlertTriangleFilled24 color={brandColors.giv[500]} />,
	},
	[EPassportBannerState.ELIGIBLE]: {
		content: 'label.passport.eligible',
		bg: EPBGState.SUCCESS,
		icon: <IconVerifiedBadge24 color={semanticColors.jade[600]} />,
	},
	[EPassportBannerState.ENDED]: {
		content: 'label.passport.round_ended',
		bg: EPBGState.ERROR,
		icon: <IconAlertTriangleFilled24 color={semanticColors.punch[500]} />,
	},
	[EPassportBannerState.INVALID_PASSPORT]: {
		content: 'label.passport.invalid_passport',
		bg: EPBGState.ERROR,
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
	},
	[EPassportBannerState.ERROR]: {
		content: 'label.passport.error',
		bg: bgColor[EPBGState.ERROR],
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
	},
	[EPassportBannerState.INVALID_RESPONSE]: {
		content: 'label.passport.invalid_response',
		bg: bgColor[EPBGState.ERROR],
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
	},
};

export const PassportBanner = () => {
	const { formatMessage } = useIntl();
	const state = EPassportBannerState.ENDED;

	return (
		<PassportBannerWrapper state={data[state].bg}>
			{data[state].icon}
			<P>
				{formatMessage({
					id: data[state].content,
				})}
			</P>
		</PassportBannerWrapper>
	);
};

const PassportBannerWrapper = styled(Flex)<IPassportBannerWrapperProps>`
	height: 56px;
	background-color: ${props => bgColor[props.state]};
	padding: 16px;
	align-items: center;
	justify-content: center;
	gap: 8px;
`;
