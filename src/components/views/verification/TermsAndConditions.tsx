import {
	H6,
	Lead,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { useState } from 'react';
import styled from 'styled-components';
import CheckBox from '@/components/Checkbox';

export default function TermsAndConditions() {
	const [accepted, setAccepted] = useState(false);
	return (
		<>
			<H6 weight={700}>Terms & Conditions</H6>
			<br />
			<br />
			<TermItemsContainer>
				<TermItemContainer>
					<CheckCircle />
					<TermItem>
						I pledge that funds raised will be used for public
						benefit, not for personal gain.
					</TermItem>
				</TermItemContainer>
				<TermItemContainer>
					<CheckCircle />
					<TermItem>
						We understand that Giveth will be analyzing all
						donations looking for fraud or abuse. If there is any
						reason to suspect abuse, we understand that we may lose
						our verified status, our donors may not receive GIVbacks
						and that Giveth may share any evidence of fraud
						publicly.
					</TermItem>
				</TermItemContainer>
				<TermItemContainer>
					<CheckCircle />
					<TermItem>
						We will only accept new, external donations through
						Giveth, and we understand that if we are found to be
						recirculating our own funds through Giveth this will be
						considered abuse of the system.
						<SubTermItem>
							Only “first touch” donations count for GIVbacks. If
							your project receives funding from outside of Giveth
							and is found to be circulating these donations
							within the Giveth platform to receive GIVbacks, you
							will be disqualified.
						</SubTermItem>
					</TermItem>
				</TermItemContainer>
			</TermItemsContainer>
			<br />
			<br />
			<br />
			<br />
			<StyledCheckbox
				style={{
					color: neutralColors.gray[900],
				}}
				title={
					'I accept all of the Giveth community terms and conditions.'
				}
				checkColor={neutralColors.gray[900]}
				checked={accepted}
				onChange={() => setAccepted(!accepted)}
			></StyledCheckbox>
		</>
	);
}

const TermItemsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 40px;
`;

const TermItemContainer = styled.div`
	position: relative;
`;

const TermItem = styled(Lead)`
	padding-left: 18px;
`;

const GreenCircle = styled.div`
	border-radius: 50%;
	border: 2px solid ${semanticColors.jade[100]};
	background: ${semanticColors.jade[500]};
`;

const SubTermItem = styled.div`
	margin-top: 10px;
`;

const CheckCircle = styled(GreenCircle)`
	top: 8px;
	position: absolute;
	width: 14px;
	height: 14px;
	border-width: 4px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const StyledCheckbox = styled(CheckBox)`
	span {
		color: red;
	}
`;
