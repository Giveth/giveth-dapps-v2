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
	IconFingerprint32,
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

export const PassportBannerData: IData = {
	[EQFElegibilityState.LOADING]: {
		content: 'label.passport.loading',
		bg: EPBGState.WARNING,
		icon: <IconFingerprint32 />,
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
	const { info, updateState, fetchUserMBDScore, handleSign, refreshScore } =
		usePassport();
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
							qfEligibilityState ===
								EQFElegibilityState.RECHECK_ELIGIBILITY && (
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
					updateState={updateState}
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
