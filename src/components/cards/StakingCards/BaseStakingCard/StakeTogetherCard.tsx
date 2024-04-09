import { Flex, brandColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

export const StakeTogetherCard = () => {
	return (
		<Wrapper>
			<Image
				src='/images/stake_together.svg'
				alt='stake together logo'
				width={248}
				height={41}
			/>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	padding: 24px;
	align-items: flex-start;
	gap: 16px;
	border-radius: 8px;
	background-color: ${brandColors.giv[800]};
	position: relative;
`;
