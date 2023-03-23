import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

interface IPfpItemProps {
	image: string;
}

const PfpItem = ({ image }: IPfpItemProps) => {
	return (
		<Container>
			<Image src={image} alt='pfp' width={330} height={330} />
		</Container>
	);
};

export default PfpItem;

const Container = styled.div`
	background-color: white;
`;
