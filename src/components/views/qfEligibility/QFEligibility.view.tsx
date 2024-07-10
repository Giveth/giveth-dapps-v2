import React, { useState, useEffect } from 'react';
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
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import {
	QFEligibilityBG,
	Wrapper,
	QFEligibilityBGInner,
	EligibilityTop,
	QFEligibilityStatus,
	EligibilityCardDesc,
	QFEligibilityState,
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

export const QFEligibilityView = () => {
	const { formatMessage } = useIntl();
	const { info, handleSign, refreshScore, fetchUserMBDScore } = usePassport();
	const { passportState, passportScore, qfEligibilityState, currentRound } =
		info;
	console.log('passportState', info);

	const [QFEligibilityCurrentState, setQFEligibilityCurrentState] =
		useState<EQFElegibilityTagState>(EQFElegibilityTagState.ELIGIBLE);

	const checkEligibilityDisabled: boolean =
		qfEligibilityState === EQFElegibilityState.LOADING ||
		qfEligibilityState === EQFElegibilityState.PROCESSING ||
		qfEligibilityState === EQFElegibilityState.ELIGIBLE ||
		qfEligibilityState === EQFElegibilityState.MORE_INFO_NEEDED;

	useEffect(() => {
		if (qfEligibilityState === EQFElegibilityState.ELIGIBLE) {
			setQFEligibilityCurrentState(EQFElegibilityTagState.ELIGIBLE);
		} else {
			setQFEligibilityCurrentState(EQFElegibilityTagState.NOT_ELIGIBLE);
		}
	}, [qfEligibilityState]);

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
							id: 'profile.qf_donor_eligibility.desc',
						})}
					</EligibilityCardDesc>
					{passportState !== EPassportState.SUCCESS && (
						<QFEligibilityState>
							{qfEligibilityState ===
								EQFElegibilityState.PROCESSING && (
								<>
									<Spinner
										size={10}
										color={brandColors.mustard[600]}
									/>
									{formatMessage({ id: 'label.processing' })}
								</>
							)}
							{qfEligibilityState ===
								EQFElegibilityState.CHECK_ELIGIBILITY &&
								formatMessage({
									id: 'label.check_eligibility',
								})}
							{qfEligibilityState ===
								EQFElegibilityState.ELIGIBLE && (
								<>
									{formatMessage({
										id: 'label.you_are_all_set',
									})}
								</>
							)}
							{qfEligibilityState ===
								EQFElegibilityState.MORE_INFO_NEEDED &&
								formatMessage({
									id: 'label.we_need_a_bit_more_info',
								})}
						</QFEligibilityState>
					)}
					{passportState === EPassportState.SUCCESS ||
					(passportState === EPassportState.LOADING &&
						passportScore != null) ? (
						<PassportSection>
							<StyledNote>
								<IconInfoOutline />
								{formatMessage({
									id: 'profile.qf_donor_eligibility.required_score',
								})}
								<QFMinScore>{`>  ${currentRound?.minimumPassportScore}`}</QFMinScore>
							</StyledNote>
							<ScoreCard>
								{formatMessage({
									id: 'profile.qf_donor_eligibility.your_paaaport_score',
								})}
								<ScoreBox>
									{passportState ===
									EPassportState.LOADING ? (
										<Spinner
											color={neutralColors.gray[100]}
											size={10}
										/>
									) : (
										passportScore
									)}
								</ScoreBox>
							</ScoreCard>
						</PassportSection>
					) : null}
					<Hr />
					<EligibilityCardBottom>
						{qfEligibilityState ===
							EQFElegibilityState.CHECK_ELIGIBILITY ||
						qfEligibilityState ===
							EQFElegibilityState.PROCESSING ? (
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
						) : qfEligibilityState ===
								EQFElegibilityState.MORE_INFO_NEEDED &&
						  passportState === EPassportState.NOT_SIGNED ? (
							<Button
								label={formatMessage({
									id: 'profile.qf_donor_eligibility.label.connect_gitcoin_passport',
								})}
								size='small'
								buttonType='primary'
								onClick={handleSign}
							/>
						) : (
							<>
								<P>
									{formatMessage({
										id: 'label.passport_connected',
									})}
								</P>
								<RefreshButton onClick={refreshScore}>
									<FlexCenter gap='8px'>
										<IconPassport16 />
										<ButtonText>
											{formatMessage({
												id: 'label.refresh_score',
											})}
										</ButtonText>
									</FlexCenter>
								</RefreshButton>
							</>
						)}
					</EligibilityCardBottom>
				</QFEligibilityBGInner>
			</QFEligibilityBG>
		</Wrapper>
	);
};
