import React from 'react';
import {
	P,
	H5,
	Caption,
	brandColors,
	Button,
	neutralColors,
} from '@giveth/ui-design-system';
import { InputContainer } from './Create.sc';
import styled from 'styled-components';
import { OurImages } from '@/utils/constants';

const ImageInput = (props: any) => {
	const uploadImage = () => {
		return true;
	};

	const searchPhotos = () => {
		return true;
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
					<Button
						label='Upload cover image'
						buttonType='primary'
						onClick={uploadImage}
					/>
					<Button
						label='Search for photos'
						buttonType='texty'
						onClick={searchPhotos}
					/>
				</Buttons>
				<DragContainer>
					<img src='/images/icons/image.svg' />
					<P>
						{`Drag & drop an image here or`}{' '}
						<span onClick={uploadImage}>Upload from computer.</span>
					</P>
					<P>
						Suggested image size min. 1200px width. Image size up to
						16Mb.
					</P>
				</DragContainer>
				<CaptionContainer>
					Select an image from our gallery.
				</CaptionContainer>
				<PickImageContainer>
					{OurImages.map((imageOption: any) => {
						return <ColorBox color={imageOption.color} />;
					})}
					<RemoveBox>
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
		box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
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

export default ImageInput;
