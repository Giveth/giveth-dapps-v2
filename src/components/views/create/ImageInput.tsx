import React from 'react';
import {
	P,
	H5,
	Caption,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import Image from 'next/image';

import { OurImages } from '@/utils/constants';
import { toBase64 } from '@/utils';
import { InputContainer } from './Create.sc';
import ImageIcon from '/public/images/icons/image.svg';
import XIcon from '/public/images/icons/x.svg';

const ImageInput = (props: { setValue: (x: any) => void; value: string }) => {
	const { setValue, value } = props;
	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/*',
		multiple: false,
		onDrop: async acceptedFile => {
			try {
				const base64Image = await toBase64(acceptedFile[0]);
				setValue(base64Image);
			} catch (error) {
				console.log({ error });
			}
		},
	});

	const pickBg = (index: number) => {
		setValue(`/images/project_image${index}.png`);
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
				{value ? (
					<DragContainer>
						<ShowingImage src={value} />
					</DragContainer>
				) : (
					<DragContainer {...getRootProps()}>
						<input {...getInputProps()} />
						<Image src={ImageIcon} alt='image icon' />
						<P>
							{`Drag & drop an image here or`}{' '}
							<span>Upload from computer.</span>
						</P>
						<P>
							Suggested image size min. 1200px width. Image size
							up to 16Mb.
						</P>
					</DragContainer>
				)}
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
					<RemoveBox onClick={() => setValue(null)}>
						<Image alt='x icon' src={XIcon} />
					</RemoveBox>
				</PickImageContainer>
			</InputContainer>
		</>
	);
};

const CaptionContainer = styled(Caption)`
	height: 18px;
	margin: 8.5px 0 0 0;
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

const DragContainer = styled.div`
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

const PickImageContainer = styled.div`
	display: flex;
	flex-direction: row;
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

const ShowingImage = styled.img`
	width: 80%;
	height: 100%;
`;

export default ImageInput;
