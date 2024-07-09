import React, { useState, useEffect } from 'react';
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

export const QFDonorEligibilityCard = () => {
	const { formatMessage } = useIntl();
	const { info, handleSign, refreshScore, fetchUserMBDScore } = usePassport();
	const { passportState, passportScore, qfEligibilityState, currentRound } =
		info;

	const [QFEligibilityCurrentState, setQFEligibilityCurrentState] =
		useState<EQFElegibilityTagState>(EQFElegibilityTagState.ELIGIBLE);

	const checkEligibilityDisabled: boolean =
		qfEligibilityState === EQFElegibilityState.LOADING ||
		qfEligibilityState === EQFElegibilityState.PROCESSING ||
		qfEligibilityState === EQFElegibilityState.ELIGIBLE ||
		qfEligibilityState === EQFElegibilityState.MORE_INFO_NEEDED;

	const actionDescription = () => {
		if (qfEligibilityState === EQFElegibilityState.CHECK_ELIGIBILITY) {
			return formatMessage({ id: 'label.it_wont_take_long' });
		} else if (
			qfEligibilityState === EQFElegibilityState.ELIGIBLE &&
			passportState !== EPassportState.SUCCESS &&
			passportState !== EPassportState.LOADING
		) {
			return formatMessage({ id: 'label.you_are_all_set' });
		} else if (
			qfEligibilityState === EQFElegibilityState.MORE_INFO_NEEDED
		) {
			return formatMessage({ id: 'label.we_need_a_bit_more_info' });
		} else {
			return formatMessage({ id: 'label.passport_connected' });
		}
	};

	useEffect(() => {
		if (qfEligibilityState === EQFElegibilityState.ELIGIBLE) {
			setQFEligibilityCurrentState(EQFElegibilityTagState.ELIGIBLE);
		} else {
			setQFEligibilityCurrentState(EQFElegibilityTagState.NOT_ELIGIBLE);
		}
	}, [qfEligibilityState]);

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
				<P>
					{formatMessage({ id: 'profile.qf_donor_eligibility.desc' })}
				</P>
			</EligibilityCardDesc>
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
							{passportState === EPassportState.LOADING ? (
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
				<P>{actionDescription()}</P>
				{qfEligibilityState === EQFElegibilityState.CHECK_ELIGIBILITY ||
				qfEligibilityState === EQFElegibilityState.PROCESSING ? (
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
								{formatMessage({ id: 'label.refresh_score' })}
							</ButtonText>
						</FlexCenter>
					</RefreshButton>
				)}
			</EligibilityCardBottom>
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

const EligibilityCardDesc = styled.div`
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
