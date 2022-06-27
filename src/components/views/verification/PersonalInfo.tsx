import { brandColors, Button, H6 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Flex } from '@/components/styled-components/Flex';
import { ButtonStyled } from './common.styled';
import Input from '@/components/Input';
import { ContentSeparator, BtnContainer } from './VerificationIndex';
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
			showToastError('Please confirm your email');
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
					<H6 weight={700}>Personal info</H6>
					<br />
					<Input
						label='What is your full name?'
						disabled
						registerName='name'
						register={register}
					/>
					<Input
						label='Your wallet address'
						disabled
						registerName='walletAddress'
						register={register}
					/>
					<EmailSection>
						{showMailInput() ? (
							<>
								<Input
									key='1'
									label='What is your email address?'
									registerName='email'
									register={register}
									registerOptions={requiredOptions.email}
									error={errors.email}
								/>
								{isDraft && (
									<ButtonStyled
										loading={loading}
										color={brandColors.giv[500]}
										label='VERIFY EMAIL ADDRESS'
										size='small'
										type='submit'
									/>
								)}
							</>
						) : (
							<>
								<Input
									key='2'
									label='What is your email address?'
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
													? 'RE-SEND EMAIL'
													: `RE-SEND EMAIL IN ${addZero(
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
											label='CHANGE MAIL'
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
							label='<     PREVIOUS'
						/>
						<Button onClick={handleNext} label='NEXT     >' />
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
