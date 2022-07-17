import { Dispatch, FC, SetStateAction, useState } from 'react';
import Image from 'next/image';
import styled, { keyframes, css } from 'styled-components';
import { useDropzone } from 'react-dropzone';
import {
	P,
	Subline,
	SublineBold,
	IconX,
	GLink,
	neutralColors,
	brandColors,
} from '@giveth/ui-design-system';

import { Flex } from './styled-components/Flex';
import { showToastError } from '@/lib/helpers';
import { client } from '@/apollo/apolloClient';
import { UPLOAD_PROFILE_PHOTO } from '@/apollo/gql/gqlUser';

interface IFileUploader {
	urls: string[];
	setUrls: (urls: string[]) => void;
	multiple?: boolean;
	setIsUploading?: Dispatch<SetStateAction<boolean>>;
}

enum EFileUploadingStatus {
	UPLOADING,
	UPLOADED,
	FAILED,
}

interface UploadFile extends File {
	url?: string;
	status?: EFileUploadingStatus;
}

const FileUploader: FC<IFileUploader> = ({
	setUrls,
	urls,
	multiple = false,
	setIsUploading,
}) => {
	const [files, setFiles] = useState<UploadFile[]>([]);
	const [uploading, setUploading] = useState(false);

	const onDrop = async (acceptedFiles: UploadFile[]) => {
		if (acceptedFiles.length < 1) {
			showToastError('File not supported');
		}
		for (let i = 0; i < acceptedFiles.length; i++) {
			const acceptedFile = acceptedFiles[i];
			acceptedFile.status = EFileUploadingStatus.UPLOADING;
			try {
				const { data: imageUploaded } = await client.mutate({
					mutation: UPLOAD_PROFILE_PHOTO,
					variables: {
						fileUpload: {
							image: acceptedFiles[0],
						},
					},
				});
				acceptedFile.status = EFileUploadingStatus.UPLOADED;
				acceptedFile.url = imageUploaded.upload;
				setUrls([...urls, imageUploaded.upload]);
			} catch (error) {
				acceptedFile.status = EFileUploadingStatus.FAILED;
			}
		}
	};

	const { getRootProps, getInputProps, open } = useDropzone({
		accept: {
			'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
			'applications/*': ['.docx', '.eot'],
		},
		multiple: multiple,
		noClick: true,
		noKeyboard: true,
		onDrop: async (acceptedFiles: UploadFile[]) => {
			console.log('acceptedFiles', acceptedFiles);
			setFiles(files => [...files, ...acceptedFiles]);
			setUploading(true);
			setIsUploading && setIsUploading(true);
			await onDrop(acceptedFiles);
			// setUploading(false);
			// setIsUploading && setIsUploading(false);
		},
	});

	const onDelete = () => {
		setUrls([]);
		setFiles([]);
		setUploading(false);
		setIsUploading && setIsUploading(false);
	};

	return (
		<>
			{!multiple && urls.length === 1 ? (
				<ShowingImage>
					<img src={urls[0]} alt='uploaded image' width='100%' />
				</ShowingImage>
			) : (
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
						<span onClick={open}>Upload from device.</span>
					</P>
					<P>
						Suggested image size min. 600px width. Image size up to
						4Mb.
					</P>
				</DropZone>
			)}

			{files &&
				files.map((file, idx) => (
					<UploadContainer key={idx}>
						<UploadInfoRow
							flexDirection='column'
							justifyContent='space-between'
						>
							<Subline>{file.name}</Subline>
							{file.status === EFileUploadingStatus.UPLOADED && (
								<Flex alignItems='center'>
									<SublineBold>Uploaded</SublineBold>
									<GLink size='Tiny'>
										<a
											href={file.url}
											target='_blank'
											rel='noreferrer'
										>
											&nbsp;- Link
										</a>
									</GLink>
									<div style={{ flex: 1 }}></div>
									<DeleteRow onClick={onDelete}>
										<IconX size={16} />
										<GLink size='Small'>Delete</GLink>
									</DeleteRow>
								</Flex>
							)}
							{file.status === EFileUploadingStatus.FAILED && (
								<Flex justifyContent='space-between'>
									<SublineBold>Failed</SublineBold>
									<DeleteRow onClick={onDelete}>
										<IconX size={16} />
										<GLink size='Small'>Delete</GLink>
									</DeleteRow>
								</Flex>
							)}
							<UplaodBar status={file.status} />
						</UploadInfoRow>
					</UploadContainer>
				))}
		</>
	);
};

const ShowingImage = styled.div`
	> img {
		border-radius: 8px;
	}
`;

const DropZone = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 1px dotted ${neutralColors.gray[400]};
	margin: 24px 0 16px 0;
	padding: 64px 20px;
	color: ${brandColors.deep[500]};
	img {
		margin: 0 0 30px 0;
	}
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

const UploadContainer = styled(Flex)`
	margin: 16px 0;
	gap: 14px;
`;

const UploadInfoRow = styled(Flex)`
	flex: 1;
	text-align: left;
`;

const DeleteRow = styled(Flex)`
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

const UplaodBar = styled.div<{ status?: EFileUploadingStatus }>`
	width: 100%;
	height: 4px;
	border-radius: 2px;
	position: relative;
	overflow: hidden;
	${props => {
		switch (props.status) {
			case EFileUploadingStatus.UPLOADING:
				return css`
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
				`;
			case EFileUploadingStatus.UPLOADED:
				return css`
					background-color: ${brandColors.giv[500]};
				`;
			case EFileUploadingStatus.FAILED:
				return css`
					background-color: ${brandColors.pinky[200]};
				`;
			default:
				return css`
					background-color: ${neutralColors.gray[400]};
				`;
				break;
		}
	}}
`;

export default FileUploader;
