import { Button, H6, Lead, semanticColors } from '@giveth/ui-design-system';
import React, { useState } from 'react';
import styled from 'styled-components';
import CheckBox from '@/components/Checkbox';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Relative } from '@/components/styled-components/Position';
import { ContentSeparator, BtnContainer } from './VerificationIndex';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import { UPDATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import { PROJECT_VERIFICATION_STEPS } from '@/apollo/types/types';

export default function TermsAndConditions() {
	const [loading, setloading] = useState(false);
	const [isChanged, setIsChanged] = useState(false);

	const { verificationData, setVerificationData, setStep } =
		useVerificationData();
	const [accepted, setAccepted] = useState(
		verificationData?.isTermAndConditionsAccepted || false,
	);

	const handleNext = () => {
		async function sendReq() {
			setloading(true);
			const { data } = await client.mutate({
				mutation: UPDATE_PROJECT_VERIFICATION,
				variables: {
					projectVerificationUpdateInput: {
						projectVerificationId: Number(verificationData?.id),
						step: PROJECT_VERIFICATION_STEPS.TERM_AND_CONDITION,
						isTermAndConditionsAccepted: accepted,
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);
			setloading(false);
			setStep(8);
		}

		if (isChanged) {
			sendReq();
		} else {
			setStep(8);
		}
	};
	return (
		<>
			<Lead>
				<H6 weight={700}>Terms & Conditions</H6>
				<TermItemsContainer>
					<Relative>
						<BulletCircle />
						<TermItem>
							I pledge that funds raised will be used for public
							benefit, not for personal gain.
						</TermItem>
					</Relative>
					<Relative>
						<BulletCircle />
						<TermItem>
							We understand that Giveth will be analyzing all
							donations looking for fraud or abuse. If there is
							any reason to suspect abuse, we understand that we
							may lose our verified status, our donors may not
							receive GIVbacks and that Giveth may share any
							evidence of fraud publicly.
						</TermItem>
					</Relative>
					<Relative>
						<BulletCircle />
						<TermItem>
							We will only accept new, external donations through
							Giveth, and we understand that if we are found to be
							recirculating our own funds through Giveth this will
							be considered abuse of the system.
							<SubTermItem>
								Only “first touch” donations count for GIVbacks.
								If your project receives funding from outside of
								Giveth and is found to be circulating these
								donations within the Giveth platform to receive
								GIVbacks, you will be disqualified.
							</SubTermItem>
						</TermItem>
					</Relative>
				</TermItemsContainer>
				<CheckBox
					title='I accept all of the Giveth community terms and conditions.'
					checked={accepted}
					onChange={e => {
						setIsChanged(true);
						setAccepted(e);
					}}
				/>
			</Lead>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button onClick={() => setStep(6)} label='<     PREVIOUS' />
					<Button
						onClick={() => handleNext()}
						loading={loading}
						disabled={!accepted}
						label='NEXT     >'
					/>
				</BtnContainer>
			</div>
		</>
	);
}

const TermItemsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 40px;
	margin-bottom: 87px;
	margin-top: 50px;
`;

const TermItem = styled.div`
	padding-left: 23px;
`;

const SubTermItem = styled.div`
	margin-top: 10px;
`;

const BulletCircle = styled(FlexCenter)`
	border-radius: 50%;
	border: 4px solid ${semanticColors.jade[100]};
	background: ${semanticColors.jade[500]};
	top: 8px;
	position: absolute;
	width: 14px;
	height: 14px;
`;
