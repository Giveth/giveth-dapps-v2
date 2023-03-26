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

interface IPfpItemProps {
	image: string;
	isSelected: boolean;
	id: number;
}

const PfpItem = ({ image, isSelected, id }: IPfpItemProps) => {
	const convertedImage = convertIPFSToHTTPS(image);
	return (
		<Container>
			<ImageContainer
				src={convertedImage}
				alt='pfp'
				width={210}
				height={210}
			/>
			<SmallCircleWithCheckIconInIt>
				<IconCheck16 color={neutralColors.gray[100]} />
			</SmallCircleWithCheckIconInIt>
			<br />
			<P>The Givers Collection #{id}</P>
		</Container>
	);
};

export default PfpItem;

const Container = styled.div`
	background-color: ${neutralColors.gray[100]};
	width: 250px;
	height: 300px;
	box-shadow: ${Shadow.Neutral[500]};
	border-radius: 8px;
	border: 3px solid ${brandColors.pinky[400]};
	position: relative;
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
