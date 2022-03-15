import { FC, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Lead } from '@giveth/ui-design-system';
import { useMutation } from '@apollo/client';

import { IStep, OnboardActions, OnboardStep } from './common';
import { OnboardSteps } from './Onboarding.view';
import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import { gToast, ToastType } from '@/components/toasts';
import ImageUploader from '@/components/ImageUploader';

const PhotoStep: FC<IStep> = ({ setStep }) => {
	const [url, setUrl] = useState<string>('');
	const [updateUser] = useMutation(UPDATE_USER);

	const onSave = async () => {
		try {
			const { data: response } = await updateUser({
				variables: {
					avatar: url,
				},
			});
			if (response.updateUser) {
				setStep(OnboardSteps.DONE);
				gToast('Profile Photo updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				return true;
			} else {
				throw 'updateUser false';
			}
		} catch (error: any) {
			gToast('Failed to update your information. Please try again.', {
				type: ToastType.DANGER,
				title: error.message,
			});
			console.log(error);
		}
		return false;
	};

	return (
		<>
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
				<ImageUploader setUrl={setUrl} url={url} />
				<OnboardActions
					onSave={onSave}
					saveLabel='SAVE'
					onLater={() => setStep(OnboardSteps.DONE)}
					disabled={!url}
				/>
			</OnboardStep>
		</>
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
