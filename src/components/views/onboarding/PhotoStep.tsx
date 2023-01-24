import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Lead } from '@giveth/ui-design-system';
import { useMutation } from '@apollo/client';

import { captureException } from '@sentry/nextjs';
import { useWeb3React } from '@web3-react/core';
import {
	IStep,
	OnboardActionsContainer,
	OnboardStep,
	SaveButton,
	SkipButton,
} from './common';
import { OnboardSteps } from './Onboarding.view';
import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import { gToast, ToastType } from '@/components/toasts';
import ImageUploader from '@/components/ImageUploader';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { Col } from '@/components/Grid';
import useUpload from '@/hooks/useUpload';

const PhotoStep: FC<IStep> = ({ setStep }) => {
	const [updateUser] = useMutation(UPDATE_USER);
	const dispatch = useAppDispatch();
	const isSignedIn = useAppSelector(state => state.user.isSignedIn);
	const { account } = useWeb3React();

	const useUploadProps = useUpload();
	const { url, onDelete } = useUploadProps;

	useEffect(() => {
		if (!isSignedIn) {
			dispatch(setShowSignWithWallet(true));
		}
	}, [isSignedIn]);

	const onSave = async () => {
		try {
			const { data: response } = await updateUser({
				variables: {
					avatar: url,
				},
			});
			if (response.updateUser) {
				setStep(OnboardSteps.DONE);
				account && dispatch(fetchUserByAddress(account));
				gToast('Profile Photo updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				onDelete();
				return true;
			} else {
				throw 'updateUser false';
			}
		} catch (error: any) {
			gToast('Failed to update your information. Please try again.', {
				type: ToastType.DANGER,
				title: error.message,
			});
			captureException(error, {
				tags: {
					section: 'PhotoStepSave',
				},
			});
			console.log(error);
		}
		return false;
	};

	return (
		<OnboardStep>
			<ProfilePicWrapper>
				<Image
					src='/images/avatar.svg'
					width={128}
					height={128}
					alt='user avatar'
				/>
			</ProfilePicWrapper>
			<Desc>
				This is how you look right now! Strange, right?
				<br />
				Upload a photo that represents who you are.
			</Desc>
			<ImageUploader {...useUploadProps} />
			<OnboardActionsContainer>
				<Col xs={12} md={7}>
					<SaveButton
						label='SAVE'
						onClick={onSave}
						disabled={!url}
						size='medium'
					/>
				</Col>
				<Col xs={12} md={2}>
					<SkipButton
						label='Do it later'
						size='medium'
						buttonType='texty'
						onClick={() => setStep(OnboardSteps.DONE)}
					/>
				</Col>
			</OnboardActionsContainer>
		</OnboardStep>
	);
};

const ProfilePicWrapper = styled.div`
	padding-bottom: 24px;
	text-align: center;
`;

const Desc = styled(Lead)`
	text-align: center;
	padding-bottom: 24px;
`;

export default PhotoStep;
