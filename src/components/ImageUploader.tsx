import { FC } from 'react';
import { useIntl } from 'react-intl';
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
	const { formatMessage } = useIntl();
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
						{formatMessage({
							id: 'label.drag_and_drop_an_image_or',
						})}{' '}
						<span onClick={open}>
							{formatMessage({ id: 'label.upload_from_device' })}
						</span>
					</P>
					<P>
						{formatMessage({
							id: 'label.suggested_image_size_min',
						})}
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
									<GLink size='Small'>
										{formatMessage({
											id: 'label.cancel_upload',
										})}
									</GLink>
								</DeleteRow>
							)}
						</Flex>
						{url && (
							<Flex justifyContent='space-between'>
								<SublineBold>
									{formatMessage({ id: 'label.uploaded' })}
								</SublineBold>
								<DeleteRow onClick={onDelete}>
									<IconX size={16} />
									<GLink size='Small'>
										{formatMessage({ id: 'label.delete' })}
									</GLink>
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
