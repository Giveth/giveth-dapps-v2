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
import { useModalCallback, EModalEvents } from '@/hooks/useModalCallback';
import Routes from '@/lib/constants/Routes';

enum EPBGState {
	SUCCESS,
	INFO,
	WARNING,
	ERROR,
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

export const PassportBannerData: IData = {
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
	[EPassportState.NOT_SIGNED]: {
		content: 'label.passport.not_signed',
		bg: EPBGState.INFO,
		icon: <IconInfoOutline24 color={semanticColors.golden[700]} />,
	},
	[EPassportState.NOT_CREATED]: {
		content: 'label.passport.not_created',
		bg: EPBGState.INFO,
		icon: <IconInfoOutline24 color={semanticColors.golden[700]} />,
		link: {
			label: 'label.passport.link.update_score',
			url: Routes.Passport,
		},
	},
	[EPassportState.NOT_ELIGIBLE]: {
		content: 'label.passport.not_eligible',
		bg: EPBGState.WARNING,
		icon: <IconAlertTriangleFilled24 color={brandColors.giv[500]} />,
		link: {
			label: 'label.passport.link.update_score',
			url: Routes.Passport,
		},
	},
	[EPassportState.ELIGIBLE]: {
		content: 'label.passport.eligible',
		bg: EPBGState.SUCCESS,
		icon: <IconVerifiedBadge24 color={semanticColors.jade[600]} />,
		link: {
			label: 'label.passport.link.update_score',
			url: Routes.Passport,
		},
	},
	[EPassportState.ENDED]: {
		content: 'label.passport.ended',
		bg: EPBGState.ERROR,
		icon: <IconAlertTriangleFilled24 color={semanticColors.punch[500]} />,
	},
	[EPassportState.NOT_ACTIVE_ROUND]: {
		content: 'label.passport.no_active_round',
		bg: EPBGState.INFO,
		icon: <IconAlertTriangleFilled24 color={semanticColors.golden[500]} />,
	},
	[EPassportState.INVALID]: {
		content: 'label.passport.invalid',
		bg: EPBGState.ERROR,
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
		link: {
			label: 'label.passport.link.go_to_passport',
			url: Routes.Passport,
		},
	},
	[EPassportState.ERROR]: {
		content: 'label.passport.error',
		bg: EPBGState.ERROR,
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
	},
};

export const PassportBanner = () => {
	const { info, handleSign } = usePassport();
	const { passportState, currentRound } = info;

	const { formatMessage, locale } = useIntl();

	const { modalCallback: connectThenSignIn } = useModalCallback(
		handleSign,
		EModalEvents.CONNECTED,
	);

	return (
		<PassportBannerWrapper bgColor={PassportBannerData[passportState].bg}>
			{PassportBannerData[passportState].icon}
			<P>
				{formatMessage({
					id: PassportBannerData[passportState].content,
				})}
				{currentRound &&
					(passportState === EPassportState.NOT_CREATED ||
						passportState === EPassportState.NOT_ELIGIBLE) && (
						<strong>
							{new Date(currentRound.endDate)
								.toLocaleString(locale || 'en-US', {
									day: 'numeric',
									month: 'short',
								})
								.replace(/,/g, '')}
						</strong>
					)}
			</P>
			{PassportBannerData[passportState].link && (
				<StyledLink
					as='a'
					href={PassportBannerData[passportState].link?.url}
					target='_blank'
					referrerPolicy='no-referrer'
					rel='noreferrer'
				>
					<GLink>
						{formatMessage({
							id: PassportBannerData[passportState].link?.label,
						})}
					</GLink>
					<IconExternalLink16 />
				</StyledLink>
			)}
			{passportState === EPassportState.NOT_CONNECTED && (
				<StyledLink onClick={() => connectThenSignIn()}>
					<GLink>
						{formatMessage({
							id: 'component.button.connect_wallet',
						})}
					</GLink>
					<IconWalletOutline16 />
				</StyledLink>
			)}
			{passportState === EPassportState.NOT_SIGNED && (
				<StyledLink onClick={() => handleSign()}>
					<GLink>
						{formatMessage({
							id: 'label.sign_message',
						})}
					</GLink>
					<IconWalletOutline16 />
				</StyledLink>
			)}
		</PassportBannerWrapper>
	);
};

interface IPassportBannerWrapperProps {
	bgColor: EPBGState;
}

export const PassportBannerWrapper = styled(Flex)<IPassportBannerWrapperProps>`
	height: 56px;
	background-color: ${props => bgColor[props.bgColor]};
	padding: 16px;
	align-items: center;
	justify-content: center;
	gap: 8px;
	position: relative;
`;

const StyledLink = styled(Flex)`
	color: ${brandColors.giv[500]};
	align-items: center;
	gap: 4px;
	cursor: pointer;
`;
