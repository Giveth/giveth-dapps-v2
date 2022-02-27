import { Lead } from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { IStep, OnboardActions, OnboardStep } from './common';
import { OnboardSteps } from './Onboarding.view';
import Image from 'next/image';
import { client } from '@/apollo/apolloClient';
import { UPDATE_USER, UPLOAD_PROFILE_PHOTO } from '@/apollo/gql/gqlUser';
import { useMutation } from '@apollo/client';
import { gToast, ToastType } from '@/components/toasts';
import ImageUploader from '@/components/ImageUploader';

const PhotoStep: FC<IStep> = ({ setStep }) => {
	const [url, setUrl] = useState<string>();
	const [updateUser] = useMutation(UPDATE_USER);

	const onDrop = async (acceptedFiles: File[]) => {
		console.log('acceptedFiles', acceptedFiles);
		const { data: imageUploaded } = await client.mutate({
			mutation: UPLOAD_PROFILE_PHOTO,
			variables: {
				fileUpload: {
					image: acceptedFiles[0],
				},
			},
		});
		setUrl(imageUploaded);
	};

	const onSave = async () => {
		try {
			const { data: response } = await updateUser({
				variables: {
					avatar: url,
				},
			});
			if (response.updateUser) {
				setStep(OnboardSteps.DONE);
			} else {
				throw 'updateUser false';
			}
		} catch (error) {
			gToast('Failed to update your profile photo. Please try again.', {
				type: ToastType.DANGER,
			});
			console.log(error);
		}
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
					This is how you look like right now, strange! right?
					<br />
					Uploadsomething better can help with getting more funds!
				</Desc>
				<ImageUploader onDrop={onDrop} setUrl={setUrl} url={url} />
				<OnboardActions
					onSave={onSave}
					saveLabel='SAVE'
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
