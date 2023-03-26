import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';
import { Shadow } from '@/components/styled-components/Shadow';

interface IPfpItemProps {
	image: string;
	isSelected: boolean;
}

const PfpItem = ({ image, isSelected }: IPfpItemProps) => {
	const convertedImage = convertIPFSToHTTPS(image);
	return (
		<Container>
			<ImageContainer
				src={convertedImage}
				alt='pfp'
				width={210}
				height={210}
			/>
		</Container>
	);
};

export default PfpItem;

const Container = styled.div`
	background-color: ${neutralColors.gray[100]};
	width: 250px;
	height: 300px;
	box-shadow: ${Shadow.Neutral[500]};
`;

const ImageContainer = styled(Image)`
	box-shadow: 0px 1px 21px 1px rgba(225, 69, 141, 0.63);
	border-radius: 8px;
	margin-top: 24px;
`;
