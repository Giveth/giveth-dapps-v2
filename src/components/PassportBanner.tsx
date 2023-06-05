import {
	GLink,
	IconAlertTriangleFilled24,
	IconExternalLink16,
	IconInfoOutline24,
	IconPassport24,
	IconVerifiedBadge24,
	IconWalletOutline16,
	P,
	brandColors,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Flex } from './styled-components/Flex';
import { EPassportState, usePassport } from '@/hooks/usePassport';

enum EPBGState {
	SUCCESS,
	INFO,
	WARNING,
	ERROR,
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
	[EPassportState.LOADING]: {
		content: 'label.passport.loading',
		bg: EPBGState.WARNING,
		icon: <IconPassport24 />,
	},
	[EPassportState.NOT_CONNECTED]: {
		content: 'label.passport.not_connected',
		bg: EPBGState.INFO,
		icon: <IconInfoOutline24 color={semanticColors.golden[700]} />,
	},
	[EPassportState.NOT_CREATED]: {
		content: 'label.passport.not_created',
		bg: EPBGState.INFO,
		icon: <IconInfoOutline24 color={semanticColors.golden[700]} />,
	},
	[EPassportState.NOT_ELIGIBLE]: {
		content: 'label.passport.not_eligible',
		bg: EPBGState.WARNING,
		icon: <IconAlertTriangleFilled24 color={brandColors.giv[500]} />,
		link: { label: 'label.passport.link.update_score', url: '/' },
	},
	[EPassportState.ELIGIBLE]: {
		content: 'label.passport.eligible',
		bg: EPBGState.SUCCESS,
		icon: <IconVerifiedBadge24 color={semanticColors.jade[600]} />,
		link: { label: 'label.passport.link.update_score', url: '/' },
	},
	[EPassportState.ENDED]: {
		content: 'label.passport.ended',
		bg: EPBGState.ERROR,
		icon: <IconAlertTriangleFilled24 color={semanticColors.punch[500]} />,
	},
	[EPassportState.INVALID]: {
		content: 'label.passport.invalid',
		bg: EPBGState.ERROR,
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
		link: { label: 'label.passport.link.go_to_passport', url: '/' },
	},
	[EPassportState.ERROR]: {
		content: 'label.passport.error',
		bg: EPBGState.ERROR,
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
	},
};

export const PassportBanner = () => {
	const { state, score, handleConnect } = usePassport();
	const { formatMessage } = useIntl();

	return (
		<PassportBannerWrapper state={data[state].bg}>
			{data[state].icon}
			<P>
				{formatMessage({
					id: data[state].content,
				})}
			</P>
			{data[state]?.link && (
				<StyledLink
					as='a'
					href={data[state].link?.url}
					target='_blank'
					referrerPolicy='no-referrer'
					rel='noreferrer'
				>
					<GLink>
						{formatMessage({
							id: data[state].link?.label,
						})}
					</GLink>
					<IconExternalLink16 />
				</StyledLink>
			)}
			{state === EPassportState.NOT_CONNECTED && (
				<StyledLink
					onClick={() => {
						handleConnect();
					}}
				>
					<GLink>
						{formatMessage({
							id: 'component.button.connect_wallet',
						})}
					</GLink>
					<IconWalletOutline16 />
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
	cursor: pointer;
`;
