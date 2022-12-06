import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import styled, { keyframes, css } from 'styled-components';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import {
	P,
	Subline,
	SublineBold,
	IconX,
	GLink,
	neutralColors,
	brandColors,
	IconImage,
} from '@giveth/ui-design-system';
import { Flex, FlexSpacer } from './styled-components/Flex';
import { showToastError } from '@/lib/helpers';
import { client } from '@/apollo/apolloClient';
import { UPLOAD_PROFILE_PHOTO } from '@/apollo/gql/gqlUser';
import { convertFileTypeToLogo, convertUrlToUploadFile } from '@/helpers/file';

interface IFileUploader {
	urls: string[];
	setUrls: (urls: string[]) => void;
	multiple?: boolean;
	limit?: number;
	setIsUploading?: Dispatch<SetStateAction<boolean>>;
}

export enum EFileUploadingStatus {
	UPLOADING,
	UPLOADED,
	FAILED,
}

export interface UploadFile extends File {
	url?: string;
	status?: EFileUploadingStatus;
	logo?: string;
}

const FileUploader: FC<IFileUploader> = ({
	setUrls,
	urls,
	multiple = false,
	limit,
	setIsUploading,
}) => {
	const [files, setFiles] = useState<UploadFile[]>([]);
	const [loading, setLoading] = useState(false);
	const { formatMessage } = useIntl();

	useEffect(() => {
		async function fetchUploadedFiles() {
			const _files = await convertUrlToUploadFile(urls);
			setFiles(_files);
		}
		setLoading(true);
		fetchUploadedFiles();
		setLoading(false);
	}, []);

	const onDrop = async (acceptedFiles: UploadFile[]) => {
		for (let i = 0; i < acceptedFiles.length; i++) {
			const acceptedFile = acceptedFiles[i];
			acceptedFile.status = EFileUploadingStatus.UPLOADING;
			try {
				const { data: imageUploaded } = await client.mutate({
					mutation: UPLOAD_PROFILE_PHOTO,
					variables: {
						fileUpload: {
							image: acceptedFile,
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
			'application/msword': ['.doc'],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				['.docx'],
			'application/pdf': ['.pdf'],
			'application/vnd.ms-powerpoint': ['.ppt'],
			'application/vnd.openxmlformats-officedocument.presentationml.presentation':
				['.pptx'],
		},
		multiple: false,
		noClick: true,
		noKeyboard: true,
		onDropRejected: (fileRejections: FileRejection[], event: DropEvent) => {
			showToastError(
				'Please import files with supported format one by one',
			);
		},
		onDropAccepted: async (acceptedFiles: UploadFile[]) => {
			if (limit && limit < acceptedFiles.length + files.length) {
				return showToastError(
					`The maximum allowed number of uploaded files is ${limit}.`,
				);
			}
			for (let i = 0; i < acceptedFiles.length; i++) {
				const acceptedFile = acceptedFiles[i];
				acceptedFile.logo = convertFileTypeToLogo(acceptedFile.type);
			}
			setFiles(files => [...files, ...acceptedFiles]);
			setIsUploading && setIsUploading(true);
			await onDrop(acceptedFiles);
			setIsUploading && setIsUploading(false);
		},
	});

	const onDelete = (url?: string) => {
		if (!url) return;
		let _urls: string[] = [];
		const _files = files.filter(file => {
			if (!file.url) return true;
			if (file.url !== url) {
				_urls.push(file.url);
				return true;
			}
			return false;
		});
		setFiles(_files);
		setUrls(_urls);
	};

	return (
		<>
			{!multiple &&
			files.length === 1 &&
			files[0].status === EFileUploadingStatus.UPLOADED &&
			files[0].type.includes('image') ? (
				<ShowingImage>
					<img src={files[0].url} alt='uploaded image' width='100%' />
				</ShowingImage>
			) : (
				<DropZone {...getRootProps()}>
					<input {...getInputProps()} />
					<IconImage size={32} color={neutralColors.gray[500]} />
					<br />
					<P>
						{formatMessage({
							id: 'label.drag_and_drop_an_image_or',
						})}{' '}
						<span onClick={open}>
							{formatMessage({ id: 'label.upload_from_device' })}
						</span>
					</P>
					<P>
						{formatMessage({ id: 'label.supported_formats' })}:
						.jpg, .jpeg, .png, .gif, .docx, .doc, .pdf, .ppt, pptx
					</P>
					<P>
						{formatMessage({ id: 'label.docs_size_up_to_4mb' })}
						{limit
							? ` Maximum ${limit} file${limit > 1 ? 's' : ''}.`
							: ''}
					</P>
				</DropZone>
			)}

			{files.length
				? files.map((file, idx) => (
						<UploadContainer key={idx}>
							<Image
								width={40}
								height={40}
								src={`/images/extensions/${file.logo}.png`}
								alt='file extension logo'
								quality={100}
							/>
							<UploadInfoRow
								flexDirection='column'
								justifyContent='space-between'
							>
								<Subline>{file.name}</Subline>
								{file.status ===
									EFileUploadingStatus.UPLOADED && (
									<Flex alignItems='center'>
										<SublineBold>
											{formatMessage({
												id: 'label.uplodaded',
											})}
										</SublineBold>
										<GLink
											as='a'
											size='Tiny'
											href={file.url}
											target='_blank'
											rel='noreferrer'
										>
											&nbsp;- Link
										</GLink>
										<FlexSpacer />
										<DeleteRow
											onClick={() => onDelete(file.url)}
										>
											<IconX size={16} />
											<GLink size='Small'>
												{formatMessage({
													id: 'label.delete',
												})}
											</GLink>
										</DeleteRow>
									</Flex>
								)}
								{file.status ===
									EFileUploadingStatus.FAILED && (
									<Flex justifyContent='space-between'>
										<SublineBold>
											{formatMessage({
												id: 'label.failed',
											})}
										</SublineBold>
									</Flex>
								)}
								<UplaodBar status={file.status} />
							</UploadInfoRow>
						</UploadContainer>
				  ))
				: urls.map((url, idx) => (
						<UploadContainer key={idx}>
							<Image
								width={40}
								height={40}
								src={`/images/extensions/unknown.png`}
								alt='file extension logo'
								quality={100}
							/>
							<UploadInfoRow
								flexDirection='column'
								justifyContent='space-between'
							>
								<Subline>{`Attachment ${idx + 1}`}</Subline>
								<Flex alignItems='center'>
									<SublineBold>
										{formatMessage({
											id: 'label.uploaded',
										})}
									</SublineBold>
									<GLink
										as='a'
										size='Tiny'
										href={url}
										target='_blank'
										rel='noreferrer'
									>
										&nbsp;- Link
									</GLink>
								</Flex>
								<UplaodBar
									status={EFileUploadingStatus.UPLOADED}
								/>
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
	margin: 24px 0;
	gap: 4px;
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
