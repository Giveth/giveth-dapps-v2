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
		bg: bgColor[EPBGState.WARNING],
		icon: <IconPassport24 />,
	},
	[EPassportBannerState.CONNECT]: {
		content: 'label.passport.connect_wallet',
		bg: bgColor[EPBGState.INFO],
		icon: <IconInfoOutline24 />,
	},
	[EPassportBannerState.NOT_ELIGIBLE]: {
		content: 'label.passport.not_eligible',
		bg: bgColor[EPBGState.WARNING],
		icon: <IconAlertTriangleFilled24 />,
	},
	[EPassportBannerState.ELIGIBLE]: {
		content: 'label.passport.eligible',
		bg: bgColor[EPBGState.SUCCESS],
		icon: <IconVerifiedBadge24 />,
	},
	[EPassportBannerState.ENDED]: {
		content: 'label.passport.round_ended',
		bg: bgColor[EPBGState.ERROR],
		icon: <IconAlertTriangleFilled24 />,
	},
	[EPassportBannerState.INVALID_PASSPORT]: {
		content: 'label.passport.invalid_passport',
		bg: bgColor[EPBGState.ERROR],
		icon: <IconInfoOutline24 />,
	},
	[EPassportBannerState.ERROR]: {
		content: 'label.passport.error',
		bg: bgColor[EPBGState.ERROR],
		icon: <IconInfoOutline24 />,
	},
	[EPassportBannerState.INVALID_RESPONSE]: {
		content: 'label.passport.invalid_response',
		bg: bgColor[EPBGState.ERROR],
		icon: <IconInfoOutline24 />,
	},
};

export const PassportBanner = () => {
	const { formatMessage } = useIntl();

	return (
		<PassportBannerWrapper state={EPBGState.ERROR}>
			{data[EPassportBannerState.ERROR].icon}
			<P>
				{formatMessage({
					id: data[EPassportBannerState.ERROR].content,
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
