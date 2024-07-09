import {
	GLink,
	IconAlertTriangleFilled24,
	IconInfoOutline24,
	IconVerifiedBadge24,
	IconWalletOutline16,
	P,
	brandColors,
	mediaQueries,
	semanticColors,
	Flex,
} from '@giveth/ui-design-system';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import {
	EQFElegibilityState,
	EPassportState,
	usePassport,
} from '@/hooks/usePassport';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { smallFormatDate } from '@/lib/helpers';
import { Spinner } from '@/components/Spinner';
import PassportModal from '@/components/modals/PassportModal';

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
	};
}
const IconFingerprint = () => {
	return (
		<svg
			width='32'
			height='33'
			viewBox='0 0 32 33'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M22.4624 7.46405C22.3725 7.46429 22.2842 7.43942 22.2067 7.39205C20.0731 6.20406 18.2285 5.70006 16.0171 5.70006C13.8167 5.70006 11.7274 6.26406 9.82705 7.39205C9.55832 7.55005 9.22709 7.44005 9.07132 7.15005C9.0018 7.01008 8.98612 6.84784 9.02746 6.69627C9.0688 6.54471 9.16407 6.4152 9.29391 6.33406C11.3435 5.12505 13.6608 4.49291 16.0171 4.50006C18.3838 4.50006 20.451 5.06406 22.7182 6.32406C22.8504 6.3997 22.9489 6.52625 22.9925 6.67656C23.0361 6.82687 23.0213 6.98896 22.9513 7.12805C22.9092 7.22681 22.8408 7.31095 22.7542 7.3705C22.6675 7.43005 22.5663 7.46252 22.4624 7.46405ZM6.55993 13.764C6.44446 13.7632 6.33203 13.7255 6.23783 13.656C6.11527 13.5613 6.03284 13.4208 6.00791 13.2641C5.98298 13.1074 6.01749 12.9468 6.10418 12.816C7.2046 11.136 8.60404 9.81605 10.2717 8.89205C13.761 6.95005 18.2285 6.93605 21.7288 8.88005C23.396 9.80405 24.7959 11.112 25.8964 12.78C25.9827 12.9109 26.017 13.0714 25.9921 13.228C25.9672 13.3846 25.885 13.5251 25.7627 13.62C25.7034 13.6661 25.6356 13.6991 25.5635 13.7169C25.4915 13.7347 25.4167 13.7369 25.3438 13.7234C25.2709 13.7099 25.2014 13.6809 25.1397 13.6384C25.0779 13.5959 25.0252 13.5406 24.9849 13.476C23.9849 11.964 22.7182 10.776 21.2178 9.94805C18.0285 8.18405 13.9499 8.18405 10.7717 9.96005C9.26026 10.8 7.9935 12 6.99355 13.51C6.95044 13.5895 6.88724 13.6552 6.8108 13.6999C6.73436 13.7447 6.64761 13.7669 6.55993 13.764ZM13.5052 28.25C13.4318 28.2507 13.359 28.235 13.2919 28.204C13.2248 28.1729 13.1649 28.1272 13.1163 28.07C12.1495 27.024 11.6255 26.35 10.8828 24.9C10.1136 23.424 9.716 21.624 9.716 19.692C9.716 16.128 12.5384 13.224 16.006 13.224C19.4736 13.224 22.298 16.128 22.298 19.692C22.3002 19.7693 22.2874 19.8463 22.2605 19.9184C22.2336 19.9905 22.193 20.0562 22.1412 20.1117C22.0894 20.1672 22.0274 20.2113 21.9589 20.2414C21.8905 20.2715 21.8169 20.287 21.7425 20.287C21.6681 20.287 21.5945 20.2715 21.5261 20.2414C21.4576 20.2113 21.3956 20.1672 21.3438 20.1117C21.292 20.0562 21.2514 19.9905 21.2245 19.9184C21.1976 19.8463 21.1848 19.7693 21.187 19.692C21.187 16.788 18.8641 14.424 16.0084 14.424C13.1528 14.424 10.8275 16.788 10.8275 19.692C10.8275 21.42 11.1827 23.016 11.8606 24.312C12.5721 25.692 13.0624 26.28 13.9167 27.216C14.018 27.3325 14.0741 27.4839 14.0741 27.641C14.0741 27.7981 14.018 27.9495 13.9167 28.066C13.8077 28.1805 13.6601 28.2464 13.5052 28.25ZM21.4735 26.03C20.151 26.03 18.9842 25.67 18.0285 24.962C17.2143 24.3684 16.5491 23.5801 16.0889 22.6633C15.6288 21.7465 15.3872 20.7282 15.3844 19.694C15.3813 19.6161 15.3934 19.5383 15.4199 19.4654C15.4464 19.3924 15.4869 19.3258 15.5388 19.2695C15.5907 19.2132 15.653 19.1684 15.722 19.1378C15.791 19.1072 15.8652 19.0915 15.9402 19.0915C16.0152 19.0915 16.0894 19.1072 16.1584 19.1378C16.2273 19.1684 16.2897 19.2132 16.3416 19.2695C16.3935 19.3258 16.4339 19.3924 16.4604 19.4654C16.487 19.5383 16.499 19.6161 16.4959 19.694C16.4978 20.534 16.6948 21.3611 17.0701 22.1049C17.4454 22.8487 17.988 23.4872 18.6516 23.966C19.4405 24.542 20.363 24.816 21.4745 24.816C21.8616 24.8089 22.2475 24.7687 22.6283 24.696C22.9282 24.636 23.2172 24.852 23.2725 25.188C23.3006 25.3431 23.2685 25.5034 23.1832 25.6339C23.0978 25.7644 22.9662 25.8543 22.8172 25.884C22.3745 25.975 21.9247 26.0232 21.4735 26.028V26.03ZM19.2395 28.5C19.1907 28.4979 19.1423 28.4898 19.0953 28.476C17.3281 27.948 16.1724 27.24 14.9609 25.956C13.4047 24.288 12.5495 22.068 12.5495 19.692C12.5495 17.748 14.0831 16.164 15.9719 16.164C17.8607 16.164 19.3948 17.748 19.3948 19.692C19.3948 20.976 20.4284 22.02 21.7062 22.02C22.984 22.02 24.0176 20.976 24.0176 19.692C24.0176 15.168 20.4058 11.496 15.9608 11.496C12.8048 11.496 9.91551 13.392 8.61558 16.332C8.18291 17.304 7.95985 18.444 7.95985 19.692C7.95985 20.628 8.03725 22.104 8.70404 24.024C8.81557 24.336 8.67087 24.684 8.38194 24.792C8.31327 24.8192 8.24003 24.8317 8.16661 24.8287C8.0932 24.8257 8.02112 24.8073 7.9547 24.7746C7.88829 24.7419 7.82892 24.6956 7.78015 24.6385C7.73138 24.5813 7.69423 24.5145 7.67092 24.442C7.13473 22.9204 6.86005 21.3126 6.85943 19.692C6.85943 18.252 7.11518 16.942 7.61515 15.804C9.09344 12.454 12.3716 10.284 15.9608 10.284C21.0173 10.284 25.1291 14.496 25.1291 19.68C25.1291 21.624 23.5955 23.208 21.7062 23.208C19.8169 23.208 18.2833 21.624 18.2833 19.68C18.2838 18.396 17.2502 17.35 15.9724 17.35C14.6946 17.35 13.661 18.394 13.661 19.678C13.661 21.728 14.3946 23.65 15.7392 25.09C16.7969 26.218 17.8064 26.84 19.3732 27.31C19.6731 27.394 19.84 27.73 19.7621 28.042C19.7378 28.1687 19.6729 28.283 19.5779 28.3662C19.483 28.4494 19.3636 28.4966 19.2395 28.5Z'
				fill='black'
			/>
			<path
				d='M29 8C29 7.72386 29.2239 7.5 29.5 7.5H30.5C31.3284 7.5 32 8.17157 32 9V24C32 24.8284 31.3284 25.5 30.5 25.5H29.5C29.2239 25.5 29 25.2761 29 25C29 24.7239 29.2239 24.5 29.5 24.5H30.3333C30.7015 24.5 31 24.2015 31 23.8333V9.16667C31 8.79848 30.7015 8.5 30.3333 8.5H29.5C29.2239 8.5 29 8.27614 29 8Z'
				fill='black'
			/>
			<path
				d='M3 8C3 7.72386 2.77614 7.5 2.5 7.5H1.5C0.671573 7.5 0 8.17157 0 9V24C0 24.8284 0.671573 25.5 1.5 25.5H2.5C2.77614 25.5 3 25.2761 3 25C3 24.7239 2.77614 24.5 2.5 24.5H1.66667C1.29848 24.5 1 24.2015 1 23.8333V9.16667C1 8.79848 1.29848 8.5 1.66667 8.5H2.5C2.77614 8.5 3 8.27614 3 8Z'
				fill='black'
			/>
		</svg>
	);
};

export const PassportBannerData: IData = {
	[EQFElegibilityState.LOADING]: {
		content: 'label.passport.loading',
		bg: EPBGState.WARNING,
		icon: <IconFingerprint />,
	},
	[EQFElegibilityState.PROCESSING]: {
		content: 'label.qf_donor_eligibility.banner.check_eligibility',
		bg: EPBGState.WARNING,
		icon: <IconAlertTriangleFilled24 color={brandColors.giv[500]} />,
	},
	[EQFElegibilityState.NOT_CONNECTED]: {
		content: 'label.passport.not_connected',
		bg: EPBGState.INFO,
		icon: <IconInfoOutline24 color={semanticColors.golden[700]} />,
	},
	[EQFElegibilityState.ELIGIBLE]: {
		content: 'label.passport.eligible',
		bg: EPBGState.SUCCESS,
		icon: <IconVerifiedBadge24 color={semanticColors.jade[600]} />,
	},
	[EQFElegibilityState.ENDED]: {
		content: 'label.passport.ended',
		bg: EPBGState.ERROR,
		icon: <IconAlertTriangleFilled24 color={semanticColors.punch[500]} />,
	},
	[EQFElegibilityState.NOT_STARTED]: {
		content: 'label.passport.round_starts_on',
		bg: EPBGState.INFO,
		icon: <IconAlertTriangleFilled24 color={semanticColors.golden[500]} />,
	},
	[EQFElegibilityState.NOT_ACTIVE_ROUND]: {
		content: 'label.passport.no_active_round',
		bg: EPBGState.INFO,
		icon: <IconAlertTriangleFilled24 color={semanticColors.golden[500]} />,
	},
	[EQFElegibilityState.ERROR]: {
		content: 'label.passport.error',
		bg: EPBGState.ERROR,
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
	},
	[EQFElegibilityState.NOT_AVAILABLE_FOR_GSAFE]: {
		content: 'label.unfortunately_passport_is_incompatible',
		bg: EPBGState.ERROR,
		icon: <IconInfoOutline24 color={semanticColors.punch[500]} />,
	},
	[EQFElegibilityState.CHECK_ELIGIBILITY]: {
		content: 'label.qf_donor_eligibility.banner.check_eligibility',
		bg: EPBGState.WARNING,
		icon: <IconAlertTriangleFilled24 color={brandColors.giv[500]} />,
	},
	[EQFElegibilityState.RECHECK_ELIGIBILITY]: {
		content: 'label.qf_donor_eligibility.banner.recheck_eligibility',
		bg: EPBGState.WARNING,
		icon: <IconAlertTriangleFilled24 color={brandColors.giv[500]} />,
	},
	[EQFElegibilityState.MORE_INFO_NEEDED]: {
		content: 'label.qf_donor_eligibility.banner.more_info_needed',
		bg: EPBGState.INFO,
		icon: <IconInfoOutline24 color={semanticColors.golden[700]} />,
	},
};

export const PassportBanner = () => {
	const { info, fetchUserMBDScore, handleSign, refreshScore } = usePassport();
	const { currentRound, passportState, passportScore, qfEligibilityState } =
		info;

	const { formatMessage, locale } = useIntl();
	const { open: openConnectModal } = useWeb3Modal();
	const { isOnSolana, handleSingOutAndSignInWithEVM } = useGeneralWallet();
	const [showModal, setShowModal] = useState<boolean>(false);

	return !isOnSolana ? (
		<>
			<PassportBannerWrapper
				$bgColor={PassportBannerData[qfEligibilityState].bg}
			>
				<Flex gap='8px' $alignItems='center'>
					<IconWrapper>
						{PassportBannerData[qfEligibilityState].icon}
					</IconWrapper>
					<P>
						{formatMessage(
							{
								id: PassportBannerData[qfEligibilityState]
									.content,
							},
							{
								data:
									qfEligibilityState ===
										EQFElegibilityState.NOT_STARTED &&
									currentRound
										? smallFormatDate(
												new Date(
													currentRound?.beginDate,
												),
											)
										: undefined,
							},
						)}
						{currentRound &&
							(passportState === EPassportState.NOT_CREATED ||
								qfEligibilityState ===
									EQFElegibilityState.RECHECK_ELIGIBILITY) && (
								<>
									{' '}
									<strong>
										{new Date(currentRound.endDate)
											.toLocaleString(locale || 'en-US', {
												day: 'numeric',
												month: 'short',
											})
											.replace(/,/g, '')}
									</strong>
								</>
							)}
					</P>
				</Flex>
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
				{qfEligibilityState ===
					EQFElegibilityState.CHECK_ELIGIBILITY && (
					<StyledLink onClick={() => fetchUserMBDScore()}>
						<GLink>
							{formatMessage({
								id: 'qf_donor_eligibility.banner.link.check_eligibility',
							})}
						</GLink>
					</StyledLink>
				)}
				{qfEligibilityState ===
					EQFElegibilityState.RECHECK_ELIGIBILITY && (
					<StyledLink onClick={() => setShowModal(true)}>
						<GLink>
							{formatMessage({
								id: 'qf_donor_eligibility.banner.link.recheck_eligibility',
							})}
						</GLink>
					</StyledLink>
				)}
				{qfEligibilityState === EQFElegibilityState.PROCESSING && (
					<StyledStatus>
						{formatMessage({
							id: 'label.processing',
						})}
						<Spinner color={brandColors.mustard[600]} size={25} />
					</StyledStatus>
				)}
				{qfEligibilityState ===
					EQFElegibilityState.MORE_INFO_NEEDED && (
					<StyledLink onClick={() => setShowModal(true)}>
						<GLink>
							{formatMessage({
								id: 'label.add_more_info',
							})}
						</GLink>
					</StyledLink>
				)}
			</PassportBannerWrapper>
			{showModal && (
				<PassportModal
					qfEligibilityState={qfEligibilityState}
					passportState={passportState}
					passportScore={passportScore}
					currentRound={currentRound}
					setShowModal={setShowModal}
					refreshScore={refreshScore}
					handleSign={handleSign}
				/>
			)}
		</>
	) : (
		<PassportBannerWrapper
			$bgColor={PassportBannerData[qfEligibilityState].bg}
		>
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
	$bgColor: EPBGState;
}

export const PassportBannerWrapper = styled(Flex)<IPassportBannerWrapperProps>`
	flex-direction: column;
	background-color: ${props => bgColor[props.$bgColor]};
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
	width: 30px;
`;

const StyledLink = styled(Flex)`
	color: ${brandColors.giv[500]};
	align-items: center;
	gap: 4px;
	cursor: pointer;
`;

const StyledStatus = styled(Flex)`
	color: ${brandColors.giv[500]};
	align-items: center;
	gap: 4px;
`;

const StyledP = styled(P)`
	color: ${brandColors.giv[500]};
	align-items: center;
	gap: 4px;
	cursor: pointer;
`;
