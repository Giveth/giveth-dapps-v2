import React from 'react';
import {
	brandColors,
	H5,
	P,
	Button,
	IconPassport16,
	ButtonText,
	neutralColors,
	FlexCenter,
	IconInfoOutline,
	IconVerifiedBadge,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import {
	QFEligibilityBG,
	Wrapper,
	QFEligibilityBGInner,
	EligibilityTop,
	QFEligibilityStatus,
	EligibilityCardDesc,
	QFEligibilityStateSection,
	EligibilityCardBottom,
} from './Common.sc';
import {
	QFEligibilityData,
	EQFElegibilityTagState,
} from '@/components/modals/PassportModal';
import {
	usePassport,
	EPassportState,
	EQFElegibilityState,
} from '@/hooks/usePassport';
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

export const QFEligibilityView = () => {
	const { locale, formatMessage } = useIntl();
	const { info, handleSign, refreshScore, fetchUserMBDScore } = usePassport();
	const { passportState, passportScore, qfEligibilityState, currentRound } =
		info;

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
		![
			EQFElegibilityState.CHECK_ELIGIBILITY,
			EQFElegibilityState.PROCESSING,
			EQFElegibilityState.ERROR,
			EQFElegibilityState.LOADING,
		].includes(qfEligibilityState) &&
		!(
			qfEligibilityState === EQFElegibilityState.ELIGIBLE &&
			passportState !== EPassportState.SIGNED
		);

	const showQFStateSection =
		passportState === EPassportState.NOT_SIGNED ||
		[
			EQFElegibilityState.CHECK_ELIGIBILITY,
			EQFElegibilityState.PROCESSING,
		].includes(qfEligibilityState) ||
		(qfEligibilityState === EQFElegibilityState.ELIGIBLE &&
			passportState !== EPassportState.SIGNED);

	const checkEligibilityDisabled = [
		EQFElegibilityState.LOADING,
		EQFElegibilityState.PROCESSING,
		EQFElegibilityState.ELIGIBLE,
		EQFElegibilityState.MORE_INFO_NEEDED,
	].includes(qfEligibilityState);

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

	const renderQFEligibilityState = () => {
		switch (qfEligibilityState) {
			case EQFElegibilityState.CHECK_ELIGIBILITY:
				return formatMessage({ id: 'label.it_wont_take_long' });
			case EQFElegibilityState.PROCESSING:
				return (
					<>
						<Spinner size={10} color={brandColors.mustard[600]} />
						{formatMessage({ id: 'label.processing' })}
					</>
				);
			case EQFElegibilityState.ELIGIBLE:
				return passportState !== EPassportState.SIGNED &&
					passportState !== EPassportState.LOADING_SCORE ? (
					<>
						{formatMessage({ id: 'label.you_are_all_set' })}
						<IconVerifiedBadge size={24} />
					</>
				) : (
					formatMessage({ id: 'label.passport_connected' })
				);
			case EQFElegibilityState.MORE_INFO_NEEDED:
				return passportState === EPassportState.NOT_SIGNED
					? formatMessage({
							id: 'label.we_need_a_bit_more_info',
						})
					: formatMessage({ id: 'label.passport_connected' });
			default:
				return formatMessage({ id: 'label.passport_connected' });
		}
	};

	const renderBottomSection = () => {
		if (
			[
				EQFElegibilityState.CHECK_ELIGIBILITY,
				EQFElegibilityState.PROCESSING,
				EQFElegibilityState.LOADING,
				EQFElegibilityState.NOT_CONNECTED,
			].includes(qfEligibilityState) ||
			(qfEligibilityState === EQFElegibilityState.ELIGIBLE &&
				passportState !== EPassportState.SIGNED)
		) {
			return (
				<EligibilityCardBottom $justify='center'>
					<Button
						label={formatMessage({
							id: 'profile.qf_donor_eligibility.label.check_eligibility',
						})}
						loading={
							qfEligibilityState ===
							EQFElegibilityState.PROCESSING
						}
						size='small'
						buttonType='primary'
						onClick={fetchUserMBDScore}
						disabled={checkEligibilityDisabled}
					/>
				</EligibilityCardBottom>
			);
		} else if (
			qfEligibilityState === EQFElegibilityState.MORE_INFO_NEEDED &&
			(passportState === EPassportState.NOT_SIGNED ||
				passportState === EPassportState.NOT_CREATED ||
				passportState === EPassportState.CONNECTING)
		) {
			return (
				<EligibilityCardBottom $justify='center'>
					<Button
						label={formatMessage({
							id: 'profile.qf_donor_eligibility.label.connect_gitcoin_passport',
						})}
						size='small'
						buttonType='primary'
						onClick={handleSign}
						loading={passportState === EPassportState.CONNECTING}
					/>
				</EligibilityCardBottom>
			);
		} else {
			return (
				<EligibilityCardBottom $justify='space-between'>
					<P>{formatMessage({ id: 'label.passport_connected' })}</P>
					<RefreshButton onClick={refreshScore}>
						<FlexCenter gap='8px'>
							<IconPassport16 />
							<ButtonText>
								{formatMessage({ id: 'label.refresh_score' })}
							</ButtonText>
						</FlexCenter>
					</RefreshButton>
				</EligibilityCardBottom>
			);
		}
	};

	return (
		<Wrapper>
			<QFEligibilityBG $background='/images/backgrounds/qf-eligibility-bg.svg'>
				<QFEligibilityBGInner>
					<EligibilityTop>
						<H5 weight={700}>
							{formatMessage({
								id: 'profile.qf_donor_eligibility.title',
							})}
						</H5>
						<QFEligibilityStatus
							$bgColor={
								QFEligibilityData[QFEligibilityCurrentState]
									.bgColor
							}
							$color={
								QFEligibilityData[QFEligibilityCurrentState]
									.color
							}
						>
							{formatMessage({
								id: QFEligibilityData[QFEligibilityCurrentState]
									.text,
							})}
							{QFEligibilityData[QFEligibilityCurrentState].icon}
						</QFEligibilityStatus>
					</EligibilityTop>
					{(qfEligibilityState !== EQFElegibilityState.ELIGIBLE ||
						passportState === EPassportState.SIGNED) && (
						<EligibilityCardDesc>
							{eligibilityDesc()}
						</EligibilityCardDesc>
					)}
					{showQFStateSection && (
						<QFEligibilityStateSection>
							{renderQFEligibilityState()}
						</QFEligibilityStateSection>
					)}
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
					{qfEligibilityState === EQFElegibilityState.ERROR && (
						<InlineToast
							type={EToastType.Error}
							message={formatMessage({
								id: 'label.passport.error',
							})}
						/>
					)}
					{passportState === EPassportState.INVALID && (
						<InlineToast
							type={EToastType.Error}
							message={formatMessage({
								id: 'label.passport.invalid',
							})}
						/>
					)}
					{qfEligibilityState !== EQFElegibilityState.ERROR &&
						passportState !== EPassportState.ERROR &&
						passportState !== EPassportState.INVALID && (
							<>
								<Hr />
								{renderBottomSection()}
							</>
						)}
					{passportState === EPassportState.INVALID && (
						<>
							<Hr />
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
						</>
					)}
				</QFEligibilityBGInner>
			</QFEligibilityBG>
		</Wrapper>
	);
};
