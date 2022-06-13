import { B, brandColors, H4, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import React from 'react';
import ConfettiAnimation from '@/components/animations/confetti';
import CheckCircle from '@/components/views/verification/CheckCircle';
import useDetectDevice from '@/hooks/useDetectDevice';

const Done = () => {
	const device = useDetectDevice();
	const isMobile = device.isMobile;
	return (
		<>
			<Container>
				<H4 weight={700}>Congratulations</H4>
				<P>
					Your application has been submitted! The Verification Team
					will send an email once it has been reviewed.
				</P>
				<ConfettiContainer>
					<ConfettiAnimation size={isMobile ? 200 : 600} />
				</ConfettiContainer>
				<StagesContainer>
					<Submitted>
						Form submited
						<CheckCircle />
					</Submitted>
					<Line />
					<Waiting>Waiting for verification</Waiting>
					<Line />
					<Voila>Voila! Verified badge</Voila>
				</StagesContainer>
			</Container>
		</>
	);
};

const Line = styled.div`
	border-bottom: 1px dashed ${neutralColors.gray[300]};
	width: 20px;
`;

const Voila = styled.div`
	color: ${neutralColors.gray[700]};
`;

const Waiting = styled.div`
	color: ${brandColors.giv[500]};
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
