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
import deleteIcon from '../../public/images/delete.png';
import { client } from '@/apollo/apolloClient';
import { UPLOAD_PROFILE_PHOTO } from '@/apollo/gql/gqlUser';

interface IImageUploader {
	// multiple: boolean;
	setUrl: Dispatch<SetStateAction<string>>;
	url: string;
	setIsUploading?: Dispatch<SetStateAction<boolean>>;
}

const ImageUploader: FC<IImageUploader> = ({ setUrl, url, setIsUploading }) => {
	const [file, setFile] = useState<File>();
	const [uploading, setUploading] = useState(false);

	const onDrop = async (acceptedFiles: File[]) => {
		const { data: imageUploaded } = await client.mutate({
			mutation: UPLOAD_PROFILE_PHOTO,
			variables: {
				fileUpload: {
					image: acceptedFiles[0],
				},
			},
		});
		setUrl(imageUploaded.upload);
	};

	const { getRootProps, getInputProps, open } = useDropzone({
		accept: 'image/*',
		multiple: false,
		noClick: true,
		noKeyboard: true,
		onDrop: async (acceptedFiles: File[]) => {
			setFile(acceptedFiles[0]);
			setUploading(true);
			setIsUploading && setIsUploading(true);
			await onDrop(acceptedFiles);
			setUploading(false);
			setIsUploading && setIsUploading(false);
		},
	});

	const onDelete = () => {
		setUrl('');
		setFile(undefined);
		setUploading(false);
		setIsUploading && setIsUploading(false);
	};

	return (
		<>
			{url ? (
				<ShowingImage>
					<img src={url} alt='uploaded image' width='100%' />
					<Image
						width={32}
						height={32}
						src={deleteIcon}
						alt='delete icon'
						onClick={onDelete}
					/>
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
						<span onClick={open}>Upload from computer.</span>
					</P>
					<P>
						Suggested image size min. 600px width. Image size up to
						4Mb.
					</P>
				</DropZone>
			)}
			{file && (
				<UploadContainer>
					<UploadInfoRow
						flexDirection='column'
						justifyContent='space-between'
					>
						<Subline>{file.name}</Subline>
						{url && (
							<Flex justifyContent='space-between'>
								<SublineBold>Uploaded</SublineBold>
								<DeleteRow onClick={onDelete}>
									<IconX size={16} />
									<GLink size='Small'>Delete</GLink>
								</DeleteRow>
							</Flex>
						)}
						<UplaodBar uploading={uploading} />
					</UploadInfoRow>
				</UploadContainer>
			)}
		</>
	);
};

const ShowingImage = styled.div`
	position: relative;
	> img {
		border-radius: 8px;
	}
	> :nth-child(2) {
		position: absolute !important;
		right: 5px;
		bottom: 10px;
		cursor: pointer;
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

export default ImageUploader;
