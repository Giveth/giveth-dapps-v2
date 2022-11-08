import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { useIntl } from 'react-intl';
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
import { useFormContext } from 'react-hook-form';

import { InputContainer } from '../Create.sc';
import { Shadow } from '@/components/styled-components/Shadow';
import { OurImages } from '@/lib/constants/constants';
import { FlexCenter } from '@/components/styled-components/Flex';
import ImageUploader from '@/components/ImageUploader';
import ExternalLink from '@/components/ExternalLink';
import useUpload from '@/hooks/useUpload';
import { EInputs } from '@/components/views/create/CreateProject';

const ImageSearch = dynamic(() => import('./ImageSearch'), {
	ssr: false,
});

const unsplashOrgUrl = 'https://unsplash.com/';
const unsplashReferral = '?utm_source=giveth.io&utm_medium=referral';
export const unsplashUrl = `${unsplashOrgUrl}${unsplashReferral}`;

const unsplashPhoto = (i: string) =>
	`${unsplashOrgUrl}@${i}${unsplashReferral}`;

interface ImageInputProps {
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const ImageInput: FC<ImageInputProps> = ({ setIsLoading }) => {
	const { getValues, setValue } = useFormContext();
	const { formatMessage } = useIntl();

	const [image, setImage] = useState(getValues(EInputs.image));
	const [isUploadTab, setIsUploadTab] = useState(true);
	const [attributes, setAttributes] = useState({ name: '', username: '' });

	const handleSetImage = (img: string) => {
		setImage(img);
		setValue(EInputs.image, img);
	};

	const useUploadProps = useUpload(handleSetImage, setIsLoading);
	const { onDelete } = useUploadProps;
	const imageUploaderProps = { ...useUploadProps, url: image };

	const removeAttributes = () => setAttributes({ name: '', username: '' });

	const removeImage = () => {
		onDelete();
		removeAttributes();
	};

	const pickBg = (index: number) => {
		onDelete();
		handleSetImage(`/images/defaultProjectImages/${index}.png`);
		removeAttributes();
	};

	return (
		<>
			<H5>
				{formatMessage({ id: 'label.add_an_image_to_your_project' })}
			</H5>
			<CaptionContainer>
				{formatMessage({
					id: 'label.displayed_in_the_header_of_the_project',
				})}
			</CaptionContainer>

			<Tabs>
				<Tab
					onClick={() => setIsUploadTab(true)}
					isActive={isUploadTab}
				>
					{formatMessage({ id: 'label.upload_cover_image' })}
				</Tab>
				<Tab
					onClick={() => setIsUploadTab(false)}
					isActive={!isUploadTab}
				>
					{formatMessage({ id: 'label.search_for_photos' })}
				</Tab>
			</Tabs>

			<InputContainer>
				{!isUploadTab && (
					<ImageSearch
						setAttributes={setAttributes}
						setValue={handleSetImage}
						attributes={!!attributes.name}
					/>
				)}
				{(isUploadTab || (!isUploadTab && image)) && (
					<ImageUploader {...imageUploaderProps} />
				)}

				{attributes.name && (
					<Attributes>
						{formatMessage({ id: 'label.photo_by' })}{' '}
						<ExternalLink
							href={unsplashPhoto(attributes.username)}
							title={attributes.name}
						/>{' '}
						{formatMessage({ id: 'label.on' })}{' '}
						<ExternalLink href={unsplashUrl} title='Unsplash' />
					</Attributes>
				)}

				<Caption>
					{formatMessage({
						id: 'label.select_an_image_from_our_gallery',
					})}
				</Caption>
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
						<RemoveBox isActive={!!image} onClick={removeImage}>
							<IconTrash size={24} />
							<div>{formatMessage({ id: 'label.remove' })}</div>
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
	text-transform: uppercase;
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
