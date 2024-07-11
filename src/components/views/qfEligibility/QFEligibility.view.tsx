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
	const { formatMessage } = useIntl();
	const { info, handleSign, refreshScore, fetchUserMBDScore } = usePassport();
	const { passportState, passportScore, qfEligibilityState, currentRound } =
		info;

	const QFEligibilityCurrentState =
		qfEligibilityState === EQFElegibilityState.ELIGIBLE
			? EQFElegibilityTagState.ELIGIBLE
			: EQFElegibilityTagState.NOT_ELIGIBLE;

	const showPassportScoreSection =
		passportState !== EPassportState.NOT_SIGNED &&
		![
			EQFElegibilityState.CHECK_ELIGIBILITY,
			EQFElegibilityState.PROCESSING,
			EQFElegibilityState.ERROR,
		].includes(qfEligibilityState) &&
		!(
			qfEligibilityState === EQFElegibilityState.ELIGIBLE &&
			passportState !== EPassportState.SUCCESS
		);

	const showQFStateSection =
		passportState === EPassportState.NOT_SIGNED ||
		[
			EQFElegibilityState.CHECK_ELIGIBILITY,
			EQFElegibilityState.PROCESSING,
		].includes(qfEligibilityState) ||
		(qfEligibilityState === EQFElegibilityState.ELIGIBLE &&
			passportState !== EPassportState.SUCCESS);

	const checkEligibilityDisabled = [
		EQFElegibilityState.LOADING,
		EQFElegibilityState.PROCESSING,
		EQFElegibilityState.ELIGIBLE,
		EQFElegibilityState.MORE_INFO_NEEDED,
	].includes(qfEligibilityState);

	const renderQFEligibilityState = () => {
		switch (qfEligibilityState) {
			case EQFElegibilityState.PROCESSING:
				return (
					<>
						<Spinner size={10} color={brandColors.mustard[600]} />
						{formatMessage({ id: 'label.processing' })}
					</>
				);
			case EQFElegibilityState.CHECK_ELIGIBILITY:
				return formatMessage({ id: 'label.it_wont_take_long' });
			case EQFElegibilityState.ELIGIBLE:
				return (
					<>
						{formatMessage({ id: 'label.you_are_all_set' })}
						<IconVerifiedBadge size={24} />
					</>
				);
			case EQFElegibilityState.MORE_INFO_NEEDED:
				return formatMessage({ id: 'label.we_need_a_bit_more_info' });
			default:
				return null;
		}
	};

	const renderBottomSection = () => {
		if (
			[
				EQFElegibilityState.CHECK_ELIGIBILITY,
				EQFElegibilityState.PROCESSING,
			].includes(qfEligibilityState) ||
			(qfEligibilityState === EQFElegibilityState.ELIGIBLE &&
				passportState !== EPassportState.SUCCESS)
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
			passportState === EPassportState.NOT_SIGNED
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
					<EligibilityCardDesc>
						{formatMessage({
							id: QFEligibilityData[QFEligibilityCurrentState]
								.desc,
						})}
					</EligibilityCardDesc>
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
									EPassportState.LOADING ? (
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
