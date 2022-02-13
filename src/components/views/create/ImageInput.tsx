import React, { useState } from 'react';
import {
	P,
	H5,
	Caption,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import { OurImages } from '@/utils/constants';
import { toBase64 } from '@/utils';
import { InputContainer } from './Create.sc';

const ImageInput = (props: any) => {
	const [bgImage, setBgImage] = useState<any>();
	const [showingImage, setShowingImage] = useState<any>();
	const { setValue } = props;
	const { getRootProps, getInputProps, open } = useDropzone({
		accept: 'image/*',
		multiple: false,
		onDrop: async acceptedFile => {
			try {
				const base64Image = await toBase64(acceptedFile[0]);
				setBgImage(acceptedFile);
				setShowingImage(base64Image);
				setValue(base64Image);
			} catch (error) {
				console.log({ error });
			}
		},
	});

	// const searchPhotos = () => {
	// 	return true;
	// };

	const pickBg = (index: number) => {
		if (index === 0) {
			setBgImage(null);
			setShowingImage(null);
		}
		setBgImage(index);
		setValue(index);
		setShowingImage(`/images/project_image${index}.png`);
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
				<Buttons>
					{/*<Button label='Upload cover image' buttonType='primary' />*/}
					{/* <Button
						label='Search for photos'
						buttonType='texty'
						onClick={searchPhotos}
					/> */}
				</Buttons>
				{bgImage ? (
					<DragContainer>
						<ShowingImage src={showingImage} />
					</DragContainer>
				) : (
					<DragContainer {...getRootProps()}>
						<input {...getInputProps()} />
						<img src='/images/icons/image.svg' />
						<P>
							{`Drag & drop an image here or`}{' '}
							<span onClick={open}>Upload from computer.</span>
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
					<RemoveBox onClick={() => pickBg(0)}>
						<img src='/images/icons/x.svg' />
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

const Buttons = styled.div`
	display: flex;
	flex-direction: row;
	* {
		font-weight: normal;
	}
	button:first-child {
		background: white;
		color: ${brandColors.deep[600]};
		box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
	}
	button:nth-child(2) {
		color: ${brandColors.pinky[500]};
		:hover {
			background: transparent;
		}
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
