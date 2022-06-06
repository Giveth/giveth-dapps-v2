import {
	B,
	brandColors,
	Button,
	H4,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import React from 'react';
import ConfettiAnimation from '@/components/animations/confetti';
import CheckCircle from '@/components/views/verification/CheckCircle';
import { ContentSeparator, BtnContainer } from './VerificationIndex';

const Done = () => {
	return (
		<>
			<Container>
				<H4 weight={700}>Congratulations</H4>
				<P>
					Your application has been submitted! The Verification Team
					will send an email once it has been reviewed.
				</P>
				<ConfettiContainer>
					<ConfettiAnimation size={600} />
				</ConfettiContainer>
				<StagesContainer>
					<Submitted>
						Form submited
						<CheckCircle />
					</Submitted>
					<Line>------</Line>
					<Waiting>Waiting for verification</Waiting>
					<Line>------</Line>
					<Voila>Voila! Verified badge</Voila>
				</StagesContainer>
			</Container>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button label='<     PREVIOUS' />
					<Button disabled label='NEXT     >' />
				</BtnContainer>
			</div>
		</>
	);
};

const Line = styled.div`
	color: ${neutralColors.gray[300]};
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
`;

const StagesContainer = styled(B)`
	display: flex;
	justify-content: center;
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
