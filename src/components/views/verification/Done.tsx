import { B, brandColors, H4, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import React from 'react';
import ConfettiAnimation from '@/components/animations/confetti';
import CheckCircle from '@/components/views/verification/CheckCircle';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useVerificationData } from '@/context/verification.context';
import { EVerificationStatus } from '@/apollo/types/types';

const Done = () => {
	const device = useDetectDevice();
	const isMobile = device.isMobile;
	const { verificationData } = useVerificationData();

	const status = verificationData?.status ?? EVerificationStatus.SUBMITTED;

	const titles = {
		[EVerificationStatus.DRAFT]: 'Congratulations',
		[EVerificationStatus.SUBMITTED]: 'Waiting for verification',
		[EVerificationStatus.REJECTED]: 'Verification rejected',
		[EVerificationStatus.VERIFIED]: 'Your project is verified now 🎉',
	};

	const subtitles = {
		[EVerificationStatus.DRAFT]: `Your application has been submitted!
		The Verification Team will send an email once it has been reviewed.`,
		[EVerificationStatus.SUBMITTED]: `Your application has been submitted!
		The Verification Team will send an email once it has been reviewed.`,
		[EVerificationStatus.REJECTED]: 'Please contact support team.',
		[EVerificationStatus.VERIFIED]: '',
	};

	return (
		<>
			<Container>
				<H4 weight={700}>
					{titles[status ?? EVerificationStatus.SUBMITTED]}
				</H4>
				<P>{subtitles[status ?? EVerificationStatus.SUBMITTED]} </P>
				{status === 'draft' && (
					<ConfettiContainer>
						<ConfettiAnimation size={isMobile ? 200 : 600} />
					</ConfettiContainer>
				)}
				<StagesContainer>
					<Submitted>
						Form submited
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
						{status === 'rejected'
							? 'Verification rejected.'
							: 'Waiting for verification'}
						{status === EVerificationStatus.VERIFIED && (
							<CheckCircle />
						)}
					</Waiting>
					<Line />
					<Voila isActive={status === EVerificationStatus.VERIFIED}>
						Voila! Verified badge
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
	margin-left: auto;
	margin-right: auto;
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
