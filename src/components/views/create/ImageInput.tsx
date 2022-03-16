import React, { Dispatch, SetStateAction } from 'react';
import {
	H5,
	Caption,
	brandColors,
	neutralColors,
	IconTrash,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { OurImages } from '@/utils/constants';
import { InputContainer } from './Create.sc';
import ImageUploader from '@/components/ImageUploader';
import { FlexCenter } from '@/components/styled-components/Flex';

const ImageInput = (props: {
	setValue: Dispatch<SetStateAction<string>>;
	value: string;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}) => {
	const { setValue, value, setIsLoading } = props;

	const pickBg = (index: number) => {
		setValue(`/images/defaultProjectImages/${index}.png`);
	};

	return (
		<>
			<H5>Add an image to your project</H5>
			<div>
				<CaptionContainer>
					Displayed in the header of the project page.
				</CaptionContainer>
			</div>

			<InputContainer>
				<ImageUploader
					setUrl={setValue}
					url={value}
					setIsUploading={setIsLoading}
				/>
				<CaptionContainer>
					Select an image from our gallery.
				</CaptionContainer>
				<PickImageContainer>
					{OurImages.map((imageOption: any, index: number) => {
						return (
							<ColorBox
								key={index}
								color={imageOption.color}
								onClick={() => pickBg(index + 1)}
							/>
						);
					})}
					<div>
						<Separator />
						<RemoveBox
							isActive={!!value}
							onClick={() => value && setValue('')}
						>
							<IconTrash size={24} />
							<div>REMOVE</div>
						</RemoveBox>
					</div>
				</PickImageContainer>
			</InputContainer>
		</>
	);
};

const Separator = styled.div`
	border-left: 1px solid ${neutralColors.gray[400]};
`;

const CaptionContainer = styled(Caption)`
	margin: 8.5px 0 0 0;
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
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
