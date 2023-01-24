import { useIntl } from 'react-intl';
import { Button, H6, Lead, semanticColors } from '@giveth/ui-design-system';
import React, { useState } from 'react';
import styled from 'styled-components';
import CheckBox from '@/components/Checkbox';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Relative } from '@/components/styled-components/Position';
import { ContentSeparator, BtnContainer } from './Common.sc';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import { UPDATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import { EVerificationStatus, EVerificationSteps } from '@/apollo/types/types';
import { showToastError } from '@/lib/helpers';

export default function TermsAndConditions() {
	const [loading, setLoading] = useState(false);

	const { verificationData, setVerificationData, setStep, isDraft } =
		useVerificationData();
	const [accepted, setAccepted] = useState(
		verificationData?.isTermAndConditionsAccepted || false,
	);
	const { formatMessage } = useIntl();

	const updateVerificationState = () => {
		setVerificationData(prevState =>
			prevState
				? {
						...prevState,
						status: EVerificationStatus.DRAFT,
				  }
				: undefined,
		);
		setStep(8);
	};

	const handleNext = async () => {
		try {
			setLoading(true);
			await client.mutate({
				mutation: UPDATE_PROJECT_VERIFICATION,
				variables: {
					projectVerificationUpdateInput: {
						projectVerificationId: Number(verificationData?.id),
						step: EVerificationSteps.TERM_AND_CONDITION,
						isTermAndConditionsAccepted: accepted,
					},
				},
			});
			setLoading(false);
			updateVerificationState();
		} catch (error) {
			setLoading(false);
			showToastError(error);
		}
	};

	return (
		<>
			<Lead>
				<H6 weight={700}>{formatMessage({ id: 'label.tos' })}</H6>
				<TermItemsContainer>
					<Relative>
						<BulletCircle />
						<TermItem>
							{formatMessage({ id: 'page.verification.tos.one' })}
						</TermItem>
					</Relative>
					<Relative>
						<BulletCircle />
						<TermItem>
							{formatMessage({ id: 'page.verification.tos.two' })}
						</TermItem>
					</Relative>
					<Relative>
						<BulletCircle />
						<TermItem>
							{formatMessage({
								id: 'page.verification.tos.three',
							})}
							<SubTermItem>
								{formatMessage({
									id: 'page.verification.tos.four',
								})}
							</SubTermItem>
						</TermItem>
					</Relative>
				</TermItemsContainer>
				{isDraft && (
					<CheckBox
						label={formatMessage({
							id: 'label.i_accept_all_giveth_tos',
						})}
						checked={accepted}
						onChange={setAccepted}
					/>
				)}
			</Lead>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button
						onClick={() => setStep(6)}
						label={`<     ${formatMessage({
							id: 'label.prev',
						})}`}
					/>
					<Button
						onClick={handleNext}
						loading={loading}
						disabled={!accepted}
						label={`${formatMessage({
							id: 'label.finish',
						})}     >`}
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
