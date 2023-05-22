import {
	GLink,
	IconAlertTriangleFilled24,
	IconExternalLink16,
	IconInfoOutline24,
	IconPassport24,
	IconVerifiedBadge24,
	P,
	brandColors,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { ReactNode } from 'react';
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

interface IData {
	[key: string]: {
		content: string;
		bg: EPBGState;
		icon: ReactNode;
		link?: {
			label: string;
			url: string;
		};
	};
}

const data: IData = {
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
		link: { label: 'label.passport.link.update_score', url: '/' },
	},
	[EPassportBannerState.ELIGIBLE]: {
		content: 'label.passport.eligible',
		bg: EPBGState.SUCCESS,
		icon: <IconVerifiedBadge24 color={semanticColors.jade[600]} />,
		link: { label: 'label.passport.link.update_score', url: '/' },
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
		link: { label: 'label.passport.link.go_to_passport', url: '/' },
	},
	[EPassportBannerState.ERROR]: {
		content: 'label.passport.error',
		bg: EPBGState.ERROR,
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
	},
	[EPassportBannerState.INVALID_RESPONSE]: {
		content: 'label.passport.invalid_response',
		bg: EPBGState.ERROR,
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
		link: { label: 'label.passport.link.go_to_passport', url: '/' },
	},
};

export const PassportBanner = () => {
	const { formatMessage } = useIntl();
	const state = EPassportBannerState.ELIGIBLE;

	return (
		<PassportBannerWrapper state={data[state].bg}>
			{data[state].icon}
			<P>
				{formatMessage({
					id: data[state].content,
				})}
			</P>
			{data[state]?.link && (
				<StyledLink>
					<a
						href={data[state].link.url}
						target='_blank'
						referrerPolicy='no-referrer'
						rel='noreferrer'
					>
						<GLink>
							{formatMessage({
								id: data[state].link.label,
							})}
						</GLink>
					</a>
					<IconExternalLink16 />
				</StyledLink>
			)}
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

const StyledLink = styled(Flex)`
	color: ${brandColors.giv[500]};
	align-items: center;
	gap: 4px;
`;
