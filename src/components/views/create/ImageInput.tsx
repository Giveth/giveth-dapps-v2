import React, { Dispatch, SetStateAction } from 'react';
import {
	H5,
	Caption,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';

import { OurImages } from '@/utils/constants';
import { InputContainer } from './Create.sc';
import XIcon from '/public/images/icons/x.svg';
import ImageUploader from '@/components/ImageUploader';

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
					<RemoveBox onClick={() => setValue('')}>
						<Image alt='x icon' src={XIcon} />
					</RemoveBox>
				</PickImageContainer>
			</InputContainer>
		</>
	);
};

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
`;

const ColorBox = styled.div`
	width: 80px;
	height: 80px;
	border-radius: 8px;
	margin: 16px 16px 16px 0;
	background-color: ${props => props.color};
	cursor: pointer;
`;

const RemoveBox = styled.div`
	width: 80px;
	height: 80px;
	border: 2px solid ${neutralColors.gray[400]};
	border-radius: 8px;
	margin: 16px 16px 16px 0;
	background-color: transparent;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default ImageInput;
