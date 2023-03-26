import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';

interface IPfpItemProps {
	image: string;
}

const PfpItem = ({ image }: IPfpItemProps) => {
	const convertedImage = convertIPFSToHTTPS(image);
	return (
		<Container>
			<Image src={convertedImage} alt='pfp' width={330} height={330} />
		</Container>
	);
};

export default PfpItem;

const Container = styled.div`
	background-color: white;
`;
