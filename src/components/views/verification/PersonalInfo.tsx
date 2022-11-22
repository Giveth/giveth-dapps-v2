import { useIntl } from 'react-intl';
import { brandColors, Button, H6 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Flex } from '@/components/styled-components/Flex';
import { ButtonStyled } from './Common.sc';
import Input from '@/components/Input';
import { ContentSeparator, BtnContainer } from './Common.sc';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import {
	SEND_EMAIL_VERIFICATION,
	UPDATE_PROJECT_VERIFICATION,
} from '@/apollo/gql/gqlVerification';
import { getNowUnixMS } from '@/helpers/time';
import { durationToYMDh, showToastError } from '@/lib/helpers';
import { requiredOptions } from '@/lib/constants/regex';

interface IFormInfo {
	name: string;
	walletAddress: string;
	email: string;
	disabledEmail: string;
}

function addZero(num: number) {
	return num < 10 ? '0' + num : num;
}

const PersonalInfo = () => {
	const [loading, setLoading] = useState(false);
	const { verificationData, setStep, setVerificationData, isDraft } =
		useVerificationData();
	const [resetMail, setResetMail] = useState(false);
	const [timer, setTimer] = useState(0);
	const [canReSendEmail, setCanReSendEmail] = useState(false);
	const [isSentMailLoading, setIsSentMailLoading] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<IFormInfo>();
	const { formatMessage } = useIntl();

	const sendPersonalInfo = async () => {
		return await client.mutate({
			mutation: UPDATE_PROJECT_VERIFICATION,
			variables: {
				projectVerificationUpdateInput: {
					step: 'personalInfo',
					personalInfo: {
						email: getValues('email'),
						walletAddress: verificationData?.user.walletAddress,
						fullName:
							verificationData?.user.firstName +
							' ' +
							verificationData?.user.lastName,
					},
					projectVerificationId: Number(verificationData?.id),
				},
			},
		});
	};
	const sendEmail = async () => {
		setLoading(true);
		try {
			const { data } = await client.mutate({
				mutation: SEND_EMAIL_VERIFICATION,
				variables: {
					projectVerificationFormId: Number(verificationData?.id),
				},
			});
			setVerificationData(data.projectVerificationSendEmailConfirmation);
		} catch (error: any) {
			showToastError(error?.message);
		} finally {
			setLoading(false);
		}
	};
	const showMailInput = () => {
		if (resetMail) {
			return true;
		} else if (
			verificationData?.emailConfirmed ||
			verificationData?.emailConfirmationSent
		) {
			return false;
		} else {
			return true;
		}
	};
	const handleFormSubmit = async () => {
		try {
			setIsSentMailLoading(true);
			await sendPersonalInfo();
			await sendEmail();
			setResetMail(false);
		} catch (error) {
			console.log('SubmitError', error);
		} finally {
			setIsSentMailLoading(false);
		}
	};
	function handleNext() {
		if (!verificationData?.emailConfirmed) {
			showToastError(
				formatMessage({ id: 'label.please_confirm_your_email' }),
			);
		} else {
			setStep(2);
		}
	}

	useEffect(() => {
		if (!verificationData?.emailConfirmationTokenExpiredAt) return;
		const date = new Date(
			verificationData?.emailConfirmationTokenExpiredAt,
		).getTime();
		const interval = setInterval(() => {
			const diff = date - getNowUnixMS();
			setTimer(diff);
			diff > 0 ? setCanReSendEmail(false) : setCanReSendEmail(true);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [verificationData?.emailConfirmationTokenExpiredAt]);

	useEffect(() => {
		setValue(
			'name',
			`${verificationData?.user?.firstName} ${verificationData?.user?.lastName}`,
		);
		setValue('walletAddress', verificationData?.user.walletAddress || '');
		setValue(
			'email',
			verificationData?.email || verificationData?.user?.email || '',
		);
	}, [verificationData]);

	return (
		<>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div>
					<H6 weight={700}>
						{formatMessage({ id: 'label.personal_info' })}
					</H6>
					<br />
					<Input
						label={formatMessage({
							id: 'page.verification.personal_info.one',
						})}
						disabled
						registerName='name'
						register={register}
					/>
					<Input
						label={formatMessage({
							id: 'page.verification.personal_info.two',
						})}
						disabled
						registerName='walletAddress'
						register={register}
					/>
					<EmailSection>
						{showMailInput() ? (
							<>
								<Input
									key='1'
									label={formatMessage({
										id: 'page.verification.personal_info.three',
									})}
									registerName='email'
									register={register}
									registerOptions={requiredOptions.email}
									error={errors.email}
								/>
								{isDraft && (
									<ButtonStyled
										loading={loading}
										color={brandColors.giv[500]}
										label={formatMessage({
											id: 'label.verify_email_address',
										})}
										size='small'
										type='submit'
									/>
								)}
							</>
						) : (
							<>
								<Input
									key='2'
									label={formatMessage({
										id: 'page.verification.personal_info.three',
									})}
									registerName='email'
									register={register}
									disabled
								/>
								{isDraft && (
									<>
										<ResendEmailButton
											color={brandColors.giv[500]}
											label={
												canReSendEmail || timer === 0
													? formatMessage({
															id: 'label.resend_email',
													  })
													: `${formatMessage({
															id: 'label.resend_email_in',
													  })} ${addZero(
															durationToYMDh(
																timer,
															).min,
													  )} : ${addZero(
															durationToYMDh(
																timer,
															).sec,
													  )}`
											}
											size='small'
											onClick={handleFormSubmit}
											disabled={!canReSendEmail}
											loading={isSentMailLoading}
										/>
										<LightBotton
											onClick={() => setResetMail(true)}
											label={formatMessage({
												id: 'label.change_email',
											})}
										/>
									</>
								)}
							</>
						)}
					</EmailSection>
				</div>
				<div>
					<ContentSeparator />
					<BtnContainer>
						<Button
							onClick={() => setStep(0)}
							label={`<     ${formatMessage({
								id: 'label.prev',
							})}`}
						/>
						<Button
							onClick={handleNext}
							label={`${formatMessage({
								id: 'label.next',
							})}     >`}
						/>
					</BtnContainer>
				</div>
			</form>
		</>
	);
};

const EmailSection = styled(Flex)`
	gap: 0 24px;
	align-items: center;
	flex-wrap: wrap;
	> :first-child {
		width: 100%;
		min-width: 250px;
	}
`;

const LightBotton = styled(Button)`
	background-color: transparent;
	color: ${brandColors.deep[400]};
	:hover {
		background-color: transparent;
		color: ${brandColors.deep[600]};
	}
`;

const ResendEmailButton = styled(ButtonStyled)`
	min-width: 200px;
	width: 220px;
`;

export default PersonalInfo;
