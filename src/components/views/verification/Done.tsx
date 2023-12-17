import { useIntl } from 'react-intl';
import { B, brandColors, H4, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import React from 'react';
import CheckCircle from '@/components/views/verification/CheckCircle';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useVerificationData } from '@/context/verification.context';
import { EVerificationStatus } from '@/apollo/types/types';
import CongratsAnimation from '@/animations/congrats.json';
import LottieControl from '@/components/LottieControl';

const Done = () => {
	const { isMobile } = useDetectDevice();
	const { verificationData } = useVerificationData();
	const { formatMessage } = useIntl();

	const status = verificationData?.status ?? EVerificationStatus.SUBMITTED;

	const titles = {
		[EVerificationStatus.DRAFT]: formatMessage({
			id: 'label.congratulations',
		}),
		[EVerificationStatus.SUBMITTED]: formatMessage({
			id: 'label.waiting_for_verification',
		}),
		[EVerificationStatus.REJECTED]: formatMessage({
			id: 'label.verification_rejected',
		}),
		[EVerificationStatus.VERIFIED]: `${formatMessage({
			id: 'label.your_project_is_verified_now',
		})} 🎉`,
	};

	const subtitles = {
		[EVerificationStatus.DRAFT]: `${formatMessage({
			id: 'label.your_application_has_been_submitted.one',
		})}
		${formatMessage({ id: 'label.your_application_has_been_submitted.two' })}
		`,
		[EVerificationStatus.SUBMITTED]: `${formatMessage({
			id: 'label.your_application_has_been_submitted.one',
		})}
		${formatMessage({ id: 'label.your_application_has_been_submitted.two' })}
		`,
		[EVerificationStatus.REJECTED]: formatMessage({
			id: 'label.please_contact_support_team',
		}),
		[EVerificationStatus.VERIFIED]: '',
	};

	return (
		<>
			<Container>
				<H4 weight={700}>
					{titles[status ?? EVerificationStatus.SUBMITTED]}
				</H4>
				<P>{subtitles[status ?? EVerificationStatus.SUBMITTED]} </P>
				{status === EVerificationStatus.DRAFT && (
					<ConfettiContainer>
						<LottieControl
							size={isMobile ? 200 : 600}
							animationData={CongratsAnimation}
						/>
					</ConfettiContainer>
				)}
				<StagesContainer>
					<Submitted>
						{formatMessage({ id: 'label.form_submitted' })}
						<CheckCircle />
					</Submitted>
					<Line />
					<Waiting
						isActive={[
							EVerificationStatus.DRAFT,
							EVerificationStatus.SUBMITTED,
							EVerificationStatus.REJECTED,
						].includes(status)}
					>
						{status === EVerificationStatus.REJECTED
							? formatMessage({
									id: 'label.verification_rejected',
							  })
							: formatMessage({
									id: 'label.waiting_for_verification',
							  })}
						{status === EVerificationStatus.VERIFIED && (
							<CheckCircle />
						)}
					</Waiting>
					<Line />
					<Voila isActive={status === EVerificationStatus.VERIFIED}>
						{formatMessage({ id: 'label.voila_verified_badge' })}
					</Voila>
					{status === EVerificationStatus.VERIFIED && <CheckCircle />}
				</StagesContainer>
			</Container>
		</>
	);
};

const Line = styled.div`
	border-bottom: 1px dashed ${neutralColors.gray[300]};
	width: 20px;
`;

const Voila = styled.div<{ isActive: boolean }>`
	display: flex;
	gap: 10px;
	align-items: center;
	/* color: ${neutralColors.gray[700]}; */
	color: ${props =>
		props.isActive ? neutralColors.gray[900] : neutralColors.gray[700]};
`;

const Waiting = styled.div<{ isActive: boolean }>`
	display: flex;
	gap: 10px;
	align-items: center;
	color: ${props =>
		props.isActive ? brandColors.giv[500] : neutralColors.gray[900]};
`;

const Submitted = styled.div`
	display: flex;
	gap: 10px;
	align-items: center;
`;

const StagesContainer = styled(B)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 140px;
	gap: 20px;
`;

const ConfettiContainer = styled.div`
	position: absolute;
	top: 50px;
	left: 0;
	right: 0;
`;

const Container = styled.div`
	text-align: center;
	padding-top: 270px;
	> :nth-child(2) {
		margin: 13px auto 0;
		max-width: 370px;
	}
`;

export default Done;
