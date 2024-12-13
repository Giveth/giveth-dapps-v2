import React from 'react';
import styled from 'styled-components';
import {
	Flex,
	brandColors,
	P,
	H5,
	Button,
	IconPassport16,
	ButtonText,
	neutralColors,
	FlexCenter,
	IconInfoOutline,
	IconVerifiedBadge,
	IconExternalLink16,
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
import ExternalLink from '@/components/ExternalLink';

export const QFDonorEligibilityCard = () => {
	const { formatMessage } = useIntl();
	const { info, handleSign, refreshScore, fetchUserMBDScore } = usePassport();
	const { passportState, passportScore, qfEligibilityState, currentRound } =
		info;

	const MBDEligible =
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
		!MBDEligible;

	const checkEligibilityDisabled = [
		EQFElegibilityState.LOADING,
		EQFElegibilityState.PROCESSING,
		EQFElegibilityState.ELIGIBLE,
		EQFElegibilityState.MORE_INFO_NEEDED,
	].includes(qfEligibilityState);

	const gitcoinNotConnected =
		passportState === EPassportState.NOT_CONNECTED ||
		passportState === EPassportState.NOT_SIGNED ||
		passportState === EPassportState.NOT_CREATED ||
		passportState === EPassportState.CONNECTING;

	const passportScoreLoading = passportState === EPassportState.LOADING_SCORE;

	const increaseScore =
		passportScore != null &&
		currentRound?.minimumPassportScore != null &&
		passportScore < currentRound.minimumPassportScore;

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
				return MBDEligible ? (
					<>
						{formatMessage({ id: 'label.you_are_all_set' })}
						<IconVerifiedBadge size={24} />
					</>
				) : (
					formatMessage({ id: 'label.passport_connected' })
				);
			case EQFElegibilityState.MORE_INFO_NEEDED:
				return gitcoinNotConnected
					? formatMessage({
							id: 'label.we_need_a_bit_more_info',
						})
					: formatMessage({ id: 'label.passport_connected' });
			default:
				return formatMessage({ id: 'label.passport_connected' });
		}
	};

	const eligibilityDesc = () => {
		if (qfEligibilityState === EQFElegibilityState.ELIGIBLE) {
			return formatMessage({
				id: 'profile.qf_donor_eligibility.eligible_desc',
			});
		} else if (
			passportState === EPassportState.SIGNED ||
			passportState === EPassportState.LOADING_SCORE
		) {
			return (
				<>
					{formatMessage({
						id: 'profile.qf_donor_eligibility.passport.not_eligible.p1',
					})}{' '}
					<BoldText>
						{formatMessage({ id: 'label.refresh_score' })}
					</BoldText>{' '}
					{formatMessage({
						id: 'profile.qf_donor_eligibility.passport.not_eligible.p2',
					})}
				</>
			);
		} else {
			return formatMessage({
				id: 'profile.qf_donor_eligibility.not_eligible_desc',
			});
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
				{passportScoreLoading ? (
					<Spinner size={10} color={brandColors.mustard[600]} />
				) : (
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
				)}
			</EligibilityCardTop>
			<EligibilityCardDesc>{eligibilityDesc()}</EligibilityCardDesc>
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
						{/* TODO: No reason why this is failing at build... may fix later */}
						{/* prettier-ignore */}
						<ScoreBox>
							{passportState === EPassportState.LOADING_SCORE ? (
								<Spinner color={neutralColors.gray[100]} size={10} />
							) : (
								(passportScore ?? '--')
							)}
						</ScoreBox>
					</ScoreCard>
					{increaseScore && (
						<RightPositionedExternalLink href={links.PASSPORT}>
							<Button
								label={formatMessage({
									id: 'label.increase_passport_score',
								})}
								size='small'
								buttonType='primary'
								icon={<IconExternalLink16 />}
							/>
						</RightPositionedExternalLink>
					)}
				</PassportSection>
			)}
			<Hr />
			{qfEligibilityState !== EQFElegibilityState.ERROR &&
				passportState !== EPassportState.ERROR &&
				passportState !== EPassportState.INVALID && (
					<EligibilityCardBottom>
						<QFEligibilityStateSection>
							{renderQFEligibilityState()}
						</QFEligibilityStateSection>
						{[
							EQFElegibilityState.CHECK_ELIGIBILITY,
							EQFElegibilityState.PROCESSING,
						].includes(qfEligibilityState) || MBDEligible ? (
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
			{passportState === EPassportState.ERROR && (
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

export const QFEligibilityStateSection = styled(P)`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-block: 30px;
	gap: 16px;
`;

const RightPositionedExternalLink = styled(ExternalLink)`
	display: flex;
	justify-content: flex-end;
`;

const BoldText = styled.strong`
	font-weight: 600;
	text-transform: capitalize;
`;
