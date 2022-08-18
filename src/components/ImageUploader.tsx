import { FC } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	GLink,
	IconImage,
	IconX,
	neutralColors,
	P,
	Subline,
	SublineBold,
} from '@giveth/ui-design-system';
import { DropzoneState } from 'react-dropzone';
import { Flex, FlexCenter } from './styled-components/Flex';
import ProgressBar from '@/components/ProgressBar';

interface IImageUploader {
	url: string;
	isUploading?: boolean;
	file?: File;
	progress: number;
	onDelete: () => void;
	dropzoneProps: DropzoneState;
}

const ImageUploader: FC<IImageUploader> = props => {
	const { progress, url, isUploading, file, onDelete, dropzoneProps } = props;
	const { getRootProps, getInputProps, open } = dropzoneProps;
	return (
		<>
			{url ? (
				<ShowingImage>
					<img src={url} alt='uploaded image' width='100%' />
				</ShowingImage>
			) : (
				<DropZone {...getRootProps()}>
					<input {...getInputProps()} />
					<IconImage size={32} color={neutralColors.gray[500]} />
					<br />
					<P>
						Drag & drop an image here or{' '}
						<span onClick={open}>Upload from device.</span>
					</P>
					<P>
						Suggested image size min. 600px width. Image size up to
						4Mb.
					</P>
				</DropZone>
			)}
			{file && (url || isUploading) && (
				<UploadContainer>
					<UploadInfoRow
						flexDirection='column'
						justifyContent='space-between'
					>
						<Flex justifyContent='space-between'>
							<Subline>
								<span>{file.name + ' '}</span>
								{!url && <span>({progress}%)</span>}
							</Subline>
							{isUploading && (
								<DeleteRow onClick={onDelete}>
									<IconX size={16} />
									<GLink size='Small'>Cancel upload</GLink>
								</DeleteRow>
							)}
						</Flex>
						{url && (
							<Flex justifyContent='space-between'>
								<SublineBold>Uploaded</SublineBold>
								<DeleteRow onClick={onDelete}>
									<IconX size={16} />
									<GLink size='Small'>Delete</GLink>
								</DeleteRow>
							</Flex>
						)}
						<ProgressBar percentage={url ? 100 : progress} />
					</UploadInfoRow>
				</UploadContainer>
			)}
		</>
	);
};

const ShowingImage = styled.div`
	> img {
		border-radius: 8px;
	}
`;

const DropZone = styled(FlexCenter)`
	flex-direction: column;
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

export default ImageUploader;
