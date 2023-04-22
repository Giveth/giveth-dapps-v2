/* eslint-disable react/jsx-no-undef */
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import {
	brandColors,
	IconCheck16,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';
import { Shadow } from '@/components/styled-components/Shadow';
import { FlexCenter } from '@/components/styled-components/Flex';

interface IPfpItemProps {
	image: string;
	isSelected: boolean;
	id: number;
	onClick: () => void;
}

const PfpItem = ({ image, isSelected, id, onClick }: IPfpItemProps) => {
	const convertedImage = convertIPFSToHTTPS(image);
	return (
		<Container direction='column' onClick={onClick} isSelected={isSelected}>
			<ImageContainer
				src={convertedImage}
				alt='pfp'
				width={210}
				height={210}
			/>
			{isSelected && (
				<SmallCircleWithCheckIconInIt>
					<IconCheck16 color={neutralColors.gray[100]} />
				</SmallCircleWithCheckIconInIt>
			)}
			<br />
			<P style={{ marginBottom: '24px' }}>The Givers Collection #{id}</P>
		</Container>
	);
};

export default PfpItem;

const Container = styled(FlexCenter)<{ isSelected: boolean }>`
	flex-direction: column;
	background-color: ${neutralColors.gray[100]};
	width: 250px;
	padding: 0 20px;
	height: 324px;
	box-shadow: ${Shadow.Neutral[500]};
	border-radius: 8px;
	border: ${props =>
		props.isSelected ? `3px solid ${brandColors.pinky[400]}` : 'none'};
	position: relative;
	cursor: pointer;
`;

const ImageContainer = styled(Image)`
	box-shadow: 0px 1px 21px 1px rgba(225, 69, 141, 0.63);
	border-radius: 8px;
	margin-top: 24px;
	margin-bottom: 16px;
`;

const SmallCircleWithCheckIconInIt = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background-color: ${brandColors.pinky[400]};
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	transform: translate(50%, -50%);
	border: 3px solid ${brandColors.pinky[200]};
`;
