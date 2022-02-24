import {
	brandColors,
	GLink,
	IconX,
	Lead,
	neutralColors,
	P,
	Subline,
	SublineBold,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { IStep, OnboardActions, OnboardStep } from './common';
import { OnboardSteps } from './Onboarding.view';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { client } from '@/apollo/apolloClient';
import { UPLOAD_PROFILE_PHOTO } from '@/apollo/gql/gqlUser';
import { Row } from '@/components/styled-components/Grid';

const PhotoStep: FC<IStep> = ({ setStep }) => {
	const [url, setUrl] = useState<string>();
	const [file, setFile] = useState<File>();
	const [uploading, setUploading] = useState(false);
	const { getRootProps, getInputProps, open } = useDropzone({
		accept: 'image/*',
		multiple: false,
		onDrop: async acceptedFiles => {
			setUploading(true);
			setFile(acceptedFiles[0]);
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
			setUploading(false);
		},
	});

	const onDelete = () => {
		setUrl(undefined);
		setFile(undefined);
		setUploading(false);
	};

	const onSave = () => {
		setStep(OnboardSteps.DONE);
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
				<Image
					src='/images/icons/image.svg'
					width={36}
					height={36}
					alt='image'
				/>
				<P>
					{`Drag & drop an image here or`}{' '}
					<span onClick={open}>Upload from computer.</span>
				</P>
				<P>
					Suggested image size min. 600px width. Image size up to 4Mb.
				</P>
			</DropZone>
			<UploadsContainer>
				{file && (
					<UploadContainer>
						<Image
							src={URL.createObjectURL(file)}
							height={48}
							width={48}
							alt='user profile photo'
						/>
						<UploadInfoRow
							flexDirection='column'
							justifyContent='space-between'
						>
							<Subline>{file.name}</Subline>
							{url && (
								<Row justifyContent='space-between'>
									<SublineBold>Uploaded</SublineBold>
									<DeleteRow onClick={onDelete}>
										<IconX size={16} />
										<GLink size='Small'>Delete</GLink>
									</DeleteRow>
								</Row>
							)}
							<UplaodBar uploading={uploading} />
						</UploadInfoRow>
					</UploadContainer>
				)}
			</UploadsContainer>
			<OnboardActions onSave={onSave} saveLabel='SAVE' disabled={!url} />
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

const UploadsContainer = styled.div`
	margin-bottom: 85px;
	min-height: 48px;
`;

const UploadContainer = styled(Row)`
	margin: 16px 0;
	gap: 14px;
`;

const UploadInfoRow = styled(Row)`
	flex: 1;
`;

const DeleteRow = styled(Row)`
	color: ${brandColors.pinky[500]};
	gap: 4px;
	cursor: pointer;
`;

const move = keyframes`
	from {
		left: -100px;
	}

	to {
		left: 100%;
	}
`;

const UplaodBar = styled.div<{ uploading: boolean }>`
	width: 100%;
	height: 4px;
	border-radius: 2px;
	position: relative;
	overflow: hidden;
	${props =>
		props.uploading
			? css`
					background-color: ${neutralColors.gray[400]};
					&::after {
						content: '';
						width: 100px;
						height: 4px;
						left: 100px;
						position: absolute;
						background-color: ${brandColors.giv[500]};
						animation: ${move} 1s linear infinite;
					}
			  `
			: css`
					background-color: ${brandColors.giv[500]};
			  `}
`;

export default PhotoStep;
