import { useState } from 'react';
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
import { EQFElegibilityState, usePassport } from '@/hooks/usePassport';
import PassportModal from '@/components/modals/PassportModal';

const QFToast = () => {
	const { formatMessage, locale } = useIntl();
	const { info, refreshScore, handleSign, fetchUserMBDScore } = usePassport();
	const { qfEligibilityState, passportState, passportScore, currentRound } =
		info;
	const [showModal, setShowModal] = useState<boolean>(false);

	const isEligible = qfEligibilityState === EQFElegibilityState.ELIGIBLE;

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
			' ' +
			currentRound?.name +
			' ' +
			formatMessage({
				id: 'label.ends_on',
			}) +
			' ' +
			endDate +
			formatMessage({
				id: 'page.donate.passport_toast.description.eligible_2',
			});
	} else {
		description = (
			<>
				{formatMessage({
					id: 'page.donate.passport_toast.description.non_eligible',
				})}{' '}
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
				{!isEligible && (
					<FlexCenter>
						<Button
							label={formatMessage({
								id: 'qf_donor_eligibility.banner.link.check_eligibility',
							})}
							buttonType='primary'
							size='small'
							icon={<IconExternalLink16 />}
							onAbort={() => setShowModal(true)}
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
