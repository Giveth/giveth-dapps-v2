import { Lead, P } from '@giveth/ui-design-system';
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
	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/*',
		multiple: false,
		onDrop: async acceptedFile => {
			setFile({ preview: URL.createObjectURL(acceptedFile[0]) });
			console.log('acceptedFile', acceptedFile);
			const { data: imageUploaded } = await client.mutate({
				mutation: UPLOAD_PROFILE_PHOTO,
				variables: {
					imageUpload: {
						image: acceptedFile,
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
				<P>Drag 'n' drop some files here, or click to select files</P>
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
	background-color: red;
`;

export default PhotoStep;
