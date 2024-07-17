import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import {
	P,
	semanticColors,
	Button,
	IconPassport16,
	ButtonText,
	neutralColors,
	FlexCenter,
	IconInfoOutline,
	IconVerifiedBadge,
	brandColors,
	IconVerified24,
} from '@giveth/ui-design-system';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { EPassportState, EQFElegibilityState } from '@/hooks/usePassport';
import { Spinner } from '@/components/Spinner';
import {
	PassportSection,
	StyledNote,
	QFMinScore,
	ScoreCard,
	ScoreBox,
	Hr,
	RefreshButton,
} from '@/components/views/userProfile/common.sc';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import links from '@/lib/constants/links';

interface PassportModalProps extends IModal {
	qfEligibilityState: EQFElegibilityState;
	passportState: EPassportState | null;
	passportScore: number | null;
	currentRound: any;
	refreshScore: () => void;
	handleSign: () => void;
}

export enum EQFElegibilityTagState {
	NOT_ELIGIBLE,
	ELIGIBLE,
}

export type TQFEligibilityData = {
	[key in EQFElegibilityTagState]: {
		bgColor: string;
		color: string;
		text: string;
		icon?: JSX.Element;
	};
};

export const QFEligibilityData: TQFEligibilityData = {
	[EQFElegibilityTagState.NOT_ELIGIBLE]: {
		bgColor: semanticColors.golden[300],
		color: semanticColors.golden[700],
		text: 'profile.qf_donor_eligibility.tag.not_eligible',
	},
	[EQFElegibilityTagState.ELIGIBLE]: {
		bgColor: semanticColors.jade[500],
		color: neutralColors.gray[100],
		text: 'profile.qf_donor_eligibility.tag.eligible',
		icon: <IconVerified24 />,
	},
};

const PassportModal: FC<PassportModalProps> = props => {
	const {
		qfEligibilityState,
		passportState,
		passportScore,
		currentRound,
		setShowModal,
		refreshScore,
		handleSign,
	} = props;

	const { locale, formatMessage } = useIntl();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const MBDEligibile =
		qfEligibilityState === EQFElegibilityState.ELIGIBLE &&
		passportState !== EPassportState.SIGNED &&
		passportState !== EPassportState.LOADING_SCORE;

	const QFEligibilityCurrentState =
		qfEligibilityState === EQFElegibilityState.ELIGIBLE
			? EQFElegibilityTagState.ELIGIBLE
			: EQFElegibilityTagState.NOT_ELIGIBLE;

	const showPassportScoreSection =
		passportState !== EPassportState.NOT_SIGNED &&
		passportState !== EPassportState.NOT_CREATED &&
		passportState !== EPassportState.CONNECTING &&
		passportState !== EPassportState.NOT_CONNECTED &&
		passportState !== EPassportState.INVALID &&
		passportState !== EPassportState.ERROR &&
		![
			EQFElegibilityState.CHECK_ELIGIBILITY,
			EQFElegibilityState.PROCESSING,
			EQFElegibilityState.ERROR,
			EQFElegibilityState.LOADING,
		].includes(qfEligibilityState) &&
		!MBDEligibile;

	const gitcoinNotConnected =
		passportState === EPassportState.NOT_CONNECTED ||
		passportState === EPassportState.NOT_SIGNED ||
		passportState === EPassportState.NOT_CREATED ||
		passportState === EPassportState.CONNECTING;

	const qfRoundEndDate = currentRound?.endDate
		? new Date(currentRound.endDate)
				.toLocaleString(locale || 'en-US', {
					day: 'numeric',
					month: 'short',
				})
				.replace(/,/g, '')
		: '';

	const eligibilityDesc = () => {
		if (qfEligibilityState === EQFElegibilityState.ELIGIBLE) {
			return formatMessage({
				id: 'profile.qf_donor_eligibility.eligible_desc',
			});
		} else if (
			passportState === EPassportState.SIGNED ||
			passportState === EPassportState.LOADING_SCORE
		) {
			return `${formatMessage({
				id: 'profile.qf_donor_eligibility.passport.not_eligible.p1',
			})} ${qfRoundEndDate} ${formatMessage({
				id: 'profile.qf_donor_eligibility.passport.not_eligible.p2',
			})}`;
		} else {
			return formatMessage({
				id: 'profile.qf_donor_eligibility.not_eligible_desc',
			});
		}
	};

	useEffect(() => {
		if (
			qfEligibilityState === EQFElegibilityState.ERROR ||
			qfEligibilityState === EQFElegibilityState.ELIGIBLE
		) {
			setTimeout(() => {
				closeModal();
			}, 5000);
		}
	}, [passportState, qfEligibilityState, closeModal]);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
			doNotCloseOnClickOutside
			headerTitle={formatMessage({
				id: 'profile.qf_donor_eligibility.title',
			})}
		>
			<StyledWrapper>
				<PassportInfoBox>{eligibilityDesc()}</PassportInfoBox>
				<EligibilityStatusSection>
					<StyledPElem>
						{formatMessage({
							id:
								qfEligibilityState ===
								EQFElegibilityState.ELIGIBLE
									? 'label.you_are_all_set'
									: passportState === EPassportState.SIGNED ||
										  passportState ===
												EPassportState.LOADING_SCORE
										? 'label.increase_your_score'
										: 'label.we_need_a_bit_more_info',
						})}
						{qfEligibilityState ===
							EQFElegibilityState.ELIGIBLE && (
							<StyledVerifIcon>
								<IconVerifiedBadge size={24} />
							</StyledVerifIcon>
						)}
					</StyledPElem>
					<QFEligibilityStatus
						$bgColor={
							QFEligibilityData[QFEligibilityCurrentState].bgColor
						}
						$color={
							QFEligibilityData[QFEligibilityCurrentState].color
						}
					>
						{formatMessage({
							id: QFEligibilityData[QFEligibilityCurrentState]
								.text,
						})}
						{QFEligibilityData[QFEligibilityCurrentState].icon}
					</QFEligibilityStatus>
				</EligibilityStatusSection>
				{showPassportScoreSection && (
					<PassportSection>
						<StyledNote>
							<IconInfoOutline />
							{formatMessage({
								id: 'profile.qf_donor_eligibility.required_score',
							})}
							<QFMinScore>{`>  ${currentRound?.minimumPassportScore ?? '--'}`}</QFMinScore>
						</StyledNote>
						<ScoreCard>
							{formatMessage({
								id: 'profile.qf_donor_eligibility.your_passport_score',
							})}
							<ScoreBox>
								{passportState ===
								EPassportState.LOADING_SCORE ? (
									<Spinner
										color={neutralColors.gray[100]}
										size={10}
									/>
								) : (
									passportScore ?? '--'
								)}
							</ScoreBox>
						</ScoreCard>
					</PassportSection>
				)}
				{passportState === EPassportState.INVALID && (
					<StyledToast
						type={EToastType.Error}
						message={formatMessage({
							id: 'label.passport.invalid',
						})}
					/>
				)}
				<Hr />
				{passportState === EPassportState.ERROR && (
					<InlineToast
						type={EToastType.Error}
						message={formatMessage({
							id: 'label.passport.error',
						})}
					/>
				)}
				<EligibilityCardBottom>
					{passportState === EPassportState.INVALID ? (
						<Button
							label={formatMessage({
								id: 'label.go_to_passport',
							})}
							size='small'
							buttonType='primary'
							onClick={() =>
								window.open(links.PASSPORT, '_blank')
							}
						/>
					) : passportState !== EPassportState.ERROR ? (
						gitcoinNotConnected ? (
							<Button
								label={formatMessage({
									id: 'profile.qf_donor_eligibility.label.connect_gitcoin_passport',
								})}
								size='small'
								buttonType='primary'
								onClick={handleSign}
								loading={
									passportState === EPassportState.CONNECTING
								}
							/>
						) : (
							<RefreshButton onClick={refreshScore}>
								<FlexCenter gap='8px'>
									<IconPassport16 />
									<ButtonText color={brandColors.pinky[500]}>
										{formatMessage({
											id: 'label.refresh_score',
										})}
									</ButtonText>
								</FlexCenter>
							</RefreshButton>
						)
					) : null}
				</EligibilityCardBottom>
			</StyledWrapper>
		</Modal>
	);
};

const StyledWrapper = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 600px;
`;

const PassportInfoBox = styled(P)`
	width: 100%;
	max-width: 600px;
	gap: 20px;
	background-color: ${neutralColors.gray[200]};
	padding: 16px;
	border-radius: 8px;
	text-align: left;
`;

const EligibilityStatusSection = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
`;

const QFEligibilityStatus = styled.div<{ $bgColor: string; $color: string }>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	height: 40px;
	width: 135px;
	border-radius: 25px;
	background-color: ${props => props.$bgColor};
	color: ${props => props.$color};
`;

const StyledVerifIcon = styled.span`
	margin-left: 10px;
	margin-top: 6px;
`;

const StyledPElem = styled(P)`
	display: flex;
	align-items: center;
`;

const EligibilityCardBottom = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-block-end: 16px;
`;

const StyledToast = styled(InlineToast)`
	margin-inline: 16px;
`;

export default PassportModal;
