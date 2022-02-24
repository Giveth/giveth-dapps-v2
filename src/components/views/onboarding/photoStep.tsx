import { brandColors, Lead, neutralColors, P } from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { IStep, OnboardActions, OnboardStep } from './common';
import { OnboardSteps } from './Onboarding.view';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { client } from '@/apollo/apolloClient';
import { UPLOAD_PROFILE_PHOTO } from '@/apollo/gql/gqlUser';

interface IImageFile {
	preview?: string;
}

const PhotoStep: FC<IStep> = ({ setStep }) => {
	const [disabled, setDisabled] = useState(true);
	const [file, setFile] = useState<IImageFile>();
	const { getRootProps, getInputProps, open } = useDropzone({
		accept: 'image/*',
		multiple: false,
		onDrop: async acceptedFile => {
			setFile({ preview: URL.createObjectURL(acceptedFile[0]) });
			console.log('acceptedFile', acceptedFile);
			const { data: imageUploaded } = await client.mutate({
				mutation: UPLOAD_PROFILE_PHOTO,
				variables: {
					fileUpload: {
						image: acceptedFile[0],
					},
				},
			});
		},
	});
	const onSave = () => {
		setStep(OnboardSteps.PHOTO);
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
				This is how you look like right now, strange! right?
				<br />
				Uploadsomething better can help with getting more funds!
			</Desc>
			<DropZone {...getRootProps()}>
				<input {...getInputProps()} />
				<img src='/images/icons/image.svg' />
				<P>
					{`Drag & drop an image here or`}{' '}
					<span onClick={open}>Upload from computer.</span>
				</P>
				<P>
					Suggested image size min. 1200px width. Image size up to
					16Mb.
				</P>
			</DropZone>
			{file && <img src={file.preview} />}
			<OnboardActions
				onSave={onSave}
				saveLabel='SAVE'
				disabled={disabled}
			/>
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

const DropZone = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 1px dotted ${neutralColors.gray[400]};
	margin: 24px 0 16px 0;
	padding: 64px 0;
	color: ${brandColors.deep[500]};
	img {
		margin: 0 0 30px 0;
	}
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

export default PhotoStep;
