import React from 'react';
import styled from 'styled-components';
import {
	Flex,
	P,
	H5,
	Button,
	IconPassport16,
	ButtonText,
	neutralColors,
	FlexCenter,
	IconInfoOutline,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { ContributeCardBox } from '@/components/ContributeCard.sc';
import {
	usePassport,
	EPassportState,
	EQFElegibilityState,
} from '@/hooks/usePassport';
import {
	QFEligibilityData,
	EQFElegibilityTagState,
} from '@/components/modals/PassportModal';
import {
	PassportSection,
	RefreshButton,
	StyledNote,
	QFMinScore,
	ScoreCard,
	ScoreBox,
	Hr,
} from '@/components/views/userProfile/common.sc';
import { Spinner } from '@/components/Spinner';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import links from '@/lib/constants/links';

export const QFDonorEligibilityCard = () => {
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

	const checkEligibilityDisabled = [
		EQFElegibilityState.LOADING,
		EQFElegibilityState.PROCESSING,
		EQFElegibilityState.ELIGIBLE,
		EQFElegibilityState.MORE_INFO_NEEDED,
	].includes(qfEligibilityState);

	const actionDescription = () => {
		switch (qfEligibilityState) {
			case EQFElegibilityState.CHECK_ELIGIBILITY:
				return formatMessage({ id: 'label.it_wont_take_long' });
			case EQFElegibilityState.PROCESSING:
				return formatMessage({ id: 'label.processing' });
			case EQFElegibilityState.ELIGIBLE:
				return passportState !== EPassportState.SUCCESS &&
					passportState !== EPassportState.LOADING
					? formatMessage({ id: 'label.you_are_all_set' })
					: formatMessage({ id: 'label.passport_connected' });
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

	return (
		<StyledContributeCardBox>
			<EligibilityCardTop>
				<H5 weight={700}>
					{formatMessage({
						id: 'profile.qf_donor_eligibility.title',
					})}
				</H5>
				<QFEligibilityStatus
					$bgColor={
						QFEligibilityData[QFEligibilityCurrentState].bgColor
					}
					$color={QFEligibilityData[QFEligibilityCurrentState].color}
				>
					{formatMessage({
						id: QFEligibilityData[QFEligibilityCurrentState].text,
					})}
					{QFEligibilityData[QFEligibilityCurrentState].icon}
				</QFEligibilityStatus>
			</EligibilityCardTop>
			<EligibilityCardDesc>
				{formatMessage({
					id: QFEligibilityData[QFEligibilityCurrentState].desc,
				})}
			</EligibilityCardDesc>
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
							{passportState === EPassportState.LOADING ? (
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
			<Hr />
			{qfEligibilityState !== EQFElegibilityState.ERROR &&
				passportState !== EPassportState.ERROR &&
				passportState !== EPassportState.INVALID && (
					<EligibilityCardBottom>
						<P>{actionDescription()}</P>
						{[
							EQFElegibilityState.CHECK_ELIGIBILITY,
							EQFElegibilityState.PROCESSING,
						].includes(qfEligibilityState) ||
						(qfEligibilityState === EQFElegibilityState.ELIGIBLE &&
							passportState !== EPassportState.SUCCESS) ? (
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
						)}
					</EligibilityCardBottom>
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
				<>
					<InlineToast
						type={EToastType.Error}
						message={formatMessage({
							id: 'label.passport.invalid',
						})}
					/>
					<Button
						label={formatMessage({
							id: 'label.go_to_passport',
						})}
						size='small'
						buttonType='primary'
						onClick={() => window.open(links.PASSPORT, '_blank')}
					/>
				</>
			)}
		</StyledContributeCardBox>
	);
};

const StyledContributeCardBox = styled(ContributeCardBox)`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const EligibilityCardTop = styled(Flex)`
	justify-content: space-between;
	align-items: center;
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

const EligibilityCardDesc = styled(P)`
	width: 100%;
	max-width: 1000px;
	gap: 20px;
	button {
		margin: 20px 0 0 0;
		width: 100%;
	}
	background-color: ${neutralColors.gray[200]};
	padding: 16px;
	border-radius: 8px;
`;

const EligibilityCardBottom = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
`;
