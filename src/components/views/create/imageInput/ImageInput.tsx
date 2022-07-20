import React, { Dispatch, SetStateAction, useState } from 'react';
import {
	H5,
	Caption,
	brandColors,
	IconTrash,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

import { InputContainer } from '../Create.sc';
import { Shadow } from '@/components/styled-components/Shadow';
import { OurImages } from '@/lib/constants/constants';
import { FlexCenter } from '@/components/styled-components/Flex';
import ImageUploader from '@/components/ImageUploader';
import ExternalLink from '@/components/ExternalLink';

const ImageSearch = dynamic(() => import('./ImageSearch'), {
	ssr: false,
});

const unsplashOrgUrl = 'https://unsplash.com/';
const unsplashReferral = '?utm_source=giveth.io&utm_medium=referral';
export const unsplashUrl = `${unsplashOrgUrl}${unsplashReferral}`;

const unsplashPhoto = (i: string) =>
	`${unsplashOrgUrl}@${i}${unsplashReferral}`;

interface ImageInputProps {
	setValue: (img: string) => void;
	value: string;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const ImageInput = (props: ImageInputProps) => {
	const { value, setValue, setIsLoading } = props;

	const [isUploadTab, setIsUploadTab] = useState(true);
	const [attributes, setAttributes] = useState({ name: '', username: '' });
	const [uploading, setUploading] = useState(false);
	const [file, setFile] = useState<File>();

	const removeAttributes = () => setAttributes({ name: '', username: '' });

	const removeImage = () => {
		setValue('');
		setFile(undefined);
		removeAttributes();
	};

	const handleUpload = (image: string) => {
		setValue(image);
		removeAttributes();
	};

	const pickBg = (index: number) => {
		setValue(`/images/defaultProjectImages/${index}.png`);
		removeAttributes();
	};

	const handleUploading = (i: boolean) => {
		setUploading(i);
		setIsLoading(i);
	};

	return (
		<>
			<H5>Add an image to your project</H5>
			<CaptionContainer>
				Displayed in the header of the project page.
			</CaptionContainer>

			<Tabs>
				<Tab
					onClick={() => setIsUploadTab(true)}
					isActive={isUploadTab}
				>
					Upload cover image
				</Tab>
				<Tab
					onClick={() => setIsUploadTab(false)}
					isActive={!isUploadTab}
				>
					Search for photos
				</Tab>
			</Tabs>

			<InputContainer>
				{!isUploadTab && (
					<ImageSearch
						setAttributes={setAttributes}
						setValue={setValue}
						attributes={!!attributes.name}
					/>
				)}
				{(isUploadTab || (!isUploadTab && value)) && (
					<ImageUploader
						url={value}
						setUrl={handleUpload}
						uploading={uploading}
						setUploading={handleUploading}
						file={file}
						setFile={setFile}
					/>
				)}

				{attributes.name && (
					<Attributes>
						Photo by{' '}
						<ExternalLink
							href={unsplashPhoto(attributes.username)}
							title={attributes.name}
						/>{' '}
						on <ExternalLink href={unsplashUrl} title='Unsplash' />
					</Attributes>
				)}

				<Caption>Select an image from our gallery.</Caption>
				<PickImageContainer>
					{OurImages.map((imageOption: any, index: number) => (
						<ColorBox
							key={index}
							color={imageOption.color}
							onClick={() => pickBg(index + 1)}
						/>
					))}
					<div>
						<Separator />
						<RemoveBox isActive={!!value} onClick={removeImage}>
							<IconTrash size={24} />
							<div>REMOVE</div>
						</RemoveBox>
					</div>
				</PickImageContainer>
			</InputContainer>
		</>
	);
};

const Attributes = styled(Subline)`
	margin-top: 10px;
	margin-bottom: 20px;
	text-align: center;
	color: ${neutralColors.gray[600]};
	a {
		font-style: italic;
	}
`;

const Tab = styled.div<{ isActive: boolean }>`
	cursor: pointer;
	padding: 8px 32px;
	background: ${props => (props.isActive ? 'white' : 'transparent')};
	border-radius: 54px;
	box-shadow: ${props => props.isActive && Shadow.Neutral[400]};
	color: ${props =>
		props.isActive ? brandColors.deep[600] : brandColors.pinky[500]};
`;

const Tabs = styled.div`
	display: flex;
	margin: 24px 0;
	gap: 10px;
`;

const CaptionContainer = styled(Caption)`
	margin: 8.5px 0 0 0;
`;

const Separator = styled.div`
	border-left: 1px solid ${neutralColors.gray[400]};
`;

const PickImageContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-top: 16px;

	> :last-of-type {
		display: flex;
		gap: 16px;
	}
`;

const ColorBox = styled.div`
	width: 80px;
	height: 80px;
	border-radius: 8px;
	background-color: ${props => props.color};
	cursor: pointer;
`;

const RemoveBox = styled(FlexCenter)<{ isActive: boolean }>`
	width: 80px;
	height: 80px;
	border: 2px solid
		${props =>
			props.isActive ? neutralColors.gray[700] : neutralColors.gray[500]};
	border-radius: 8px;
	background-color: transparent;
	cursor: ${props => props.isActive && 'pointer'};
	flex-direction: column;
	color: ${props =>
		props.isActive ? neutralColors.gray[700] : neutralColors.gray[500]};

	> :first-child {
		color: inherit;
	}

	> :last-child {
		padding: 0;
		color: inherit;
		margin-top: 6px;
		font-size: 12px;
		font-weight: 700;
	}
`;

export default ImageInput;
