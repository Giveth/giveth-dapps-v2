import { FC, useState } from 'react';
import styled from 'styled-components';
import {
	Button,
	Caption,
	IconExternalLink16,
	neutralColors,
	P,
	semanticColors,
	FlexCenter,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { EQFElegibilityState, usePassport } from '@/hooks/usePassport';
import PassportModal from '@/components/modals/PassportModal';

interface IQFToast {
	isStellarInQF?: boolean;
	isStellar?: boolean;
}

const QFToast: FC<IQFToast> = ({ isStellarInQF, isStellar }) => {
	const { formatMessage, locale } = useIntl();
	const { info, updateState, refreshScore, handleSign, fetchUserMBDScore } =
		usePassport();
	const { qfEligibilityState, passportState, passportScore, currentRound } =
		info;
	const router = useRouter();
	const [showModal, setShowModal] = useState<boolean>(false);

	const isEligible =
		qfEligibilityState === EQFElegibilityState.ELIGIBLE ||
		(isStellarInQF && isStellar);

	const color = isEligible
		? semanticColors.jade['500']
		: semanticColors.golden['700'];

	const title = formatMessage({
		id: `page.donate.passport_toast.title.${
			isEligible ? 'eligible' : 'non_eligible'
		}`,
	});

	let description;
	const endDate = new Date(currentRound?.endDate || '')
		.toLocaleString(locale || 'en-US', {
			day: 'numeric',
			month: 'short',
		})
		.replace(/,/g, '');

	if (isEligible) {
		description =
			formatMessage({
				id: 'page.donate.passport_toast.description.eligible',
			}) +
			currentRound?.minimumValidUsdValue +
			' ' +
			formatMessage({
				id: 'page.donate.passport_toast.description.eligible_2',
			}) +
			' ' +
			currentRound?.name +
			'.';
	} else {
		description = (
			<>
				{formatMessage(
					{
						id: 'page.donate.passport_toast.description.non_eligible',
					},
					{
						usd_value: currentRound?.minimumValidUsdValue,
					},
				)}{' '}
				<span>{endDate}</span>
			</>
		);
	}

	return (
		<>
			<Wrapper color={color}>
				<Title $medium color={color}>
					{title}
				</Title>
				<Description>{description}</Description>
				{isEligible ? (
					<FlexCenter>
						<Button
							label={formatMessage({
								id: 'qf_donor_eligibility.banner.link.back_to_project',
							})}
							buttonType='primary'
							size='small'
							icon={<IconExternalLink16 />}
							onClick={() => router.push('/qf')}
						/>
					</FlexCenter>
				) : (
					<FlexCenter>
						<Button
							label={formatMessage({
								id: 'qf_donor_eligibility.banner.link.check_eligibility',
							})}
							buttonType='primary'
							size='small'
							icon={<IconExternalLink16 />}
							onClick={() => setShowModal(true)}
						/>
					</FlexCenter>
				)}
			</Wrapper>
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
					fetchUserMBDScore={fetchUserMBDScore}
				/>
			)}
		</>
	);
};

const Description = styled(P)`
	color: ${neutralColors.gray[800]};
	white-space: pre-line;
	margin: 16px 0;
	> span {
		font-weight: 500;
	}
`;

const Title = styled(Caption)<{ color: string }>`
	color: ${props => props.color};
	display: flex;
	align-items: center;
`;

const Wrapper = styled.div<{ color: string }>`
	margin: 24px 0;
	padding: 16px;
	text-align: left;
	color: ${neutralColors.gray[800]};
	border: 1px solid ${props => props.color};
	border-radius: 12px;
`;

export default QFToast;
