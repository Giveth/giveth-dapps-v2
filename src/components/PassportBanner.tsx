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
	mediaQueries,
	semanticColors,
	Flex,
} from '@giveth/ui-design-system';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { EPassportState, usePassport } from '@/hooks/usePassport';
import Routes from '@/lib/constants/Routes';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { smallFormatDate } from '@/lib/helpers';

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
			label: 'label.passport.link.go_to_passport',
			url: Routes.Passport,
		},
	},
	[EPassportState.NOT_ELIGIBLE]: {
		content: 'label.passport.not_eligible',
		bg: EPBGState.WARNING,
		icon: <IconAlertTriangleFilled24 color={brandColors.giv[500]} />,
		link: {
			label: 'label.passport.link.go_to_passport',
			url: Routes.Passport,
		},
	},
	[EPassportState.ELIGIBLE]: {
		content: 'label.passport.eligible',
		bg: EPBGState.SUCCESS,
		icon: <IconVerifiedBadge24 color={semanticColors.jade[600]} />,
		link: {
			label: 'label.passport.link.go_to_passport',
			url: Routes.Passport,
		},
	},
	[EPassportState.ENDED]: {
		content: 'label.passport.ended',
		bg: EPBGState.ERROR,
		icon: <IconAlertTriangleFilled24 color={semanticColors.punch[500]} />,
	},
	[EPassportState.NOT_STARTED]: {
		content: 'label.passport.round_starts_on',
		bg: EPBGState.INFO,
		icon: <IconAlertTriangleFilled24 color={semanticColors.golden[500]} />,
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
	[EPassportState.NOT_AVAILABLE_FOR_GSAFE]: {
		content: 'label.unfortunately_passport_is_incompatible',
		bg: EPBGState.ERROR,
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
	},
};

export const PassportBanner = () => {
	const { info, handleSign } = usePassport();
	const { passportState, currentRound } = info;

	const { formatMessage, locale } = useIntl();
	const { open: openConnectModal } = useWeb3Modal();
	const { isOnSolana, handleSingOutAndSignInWithEVM } = useGeneralWallet();

	return !isOnSolana ? (
		<PassportBannerWrapper bgColor={PassportBannerData[passportState].bg}>
			<Flex gap='8px' $alignItems='center'>
				<IconWrapper>
					{PassportBannerData[passportState].icon}
				</IconWrapper>
				<P>
					{formatMessage(
						{
							id: PassportBannerData[passportState].content,
						},
						{
							data:
								passportState === EPassportState.NOT_STARTED &&
								currentRound
									? smallFormatDate(
											new Date(currentRound?.beginDate),
										)
									: undefined,
						},
					)}
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
			</Flex>
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
				<StyledLink onClick={() => openConnectModal?.()}>
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
	) : (
		<PassportBannerWrapper bgColor={PassportBannerData[passportState].bg}>
			<P>
				{formatMessage({
					id: 'label.to_activate_your_gitcoin_passport',
				})}
			</P>
			<StyledP onClick={handleSingOutAndSignInWithEVM}>
				{formatMessage({
					id: 'label.switch_to_evm',
				})}
			</StyledP>
		</PassportBannerWrapper>
	);
};

interface IPassportBannerWrapperProps {
	bgColor: EPBGState;
}

export const PassportBannerWrapper = styled(Flex)<IPassportBannerWrapperProps>`
	flex-direction: column;
	background-color: ${props => bgColor[props.bgColor]};
	padding: 16px;
	align-items: center;
	justify-content: center;
	gap: 8px;
	position: relative;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const IconWrapper = styled.div`
	width: 24px;
`;

const StyledLink = styled(Flex)`
	color: ${brandColors.giv[500]};
	align-items: center;
	gap: 4px;
	cursor: pointer;
`;

const StyledP = styled(P)`
	color: ${brandColors.giv[500]};
	align-items: center;
	gap: 4px;
	cursor: pointer;
`;
