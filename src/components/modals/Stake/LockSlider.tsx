import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { P, B, GLink, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

const LockSlider = () => {
	return (
		<>
			<Flex justifyContent='space-between'>
				<SliderLabel>
					<P>Available: </P>
					<B>1</B>
				</SliderLabel>
				<SliderMax onClick={() => {}}>Max</SliderMax>
			</Flex>
			<Slider
				min={0}
				max={26}
				railStyle={{ backgroundColor: brandColors.giv[800] }}
				trackStyle={{ backgroundColor: brandColors.giv[900] }}
				handleStyle={{
					backgroundColor: brandColors.giv[500],
					border: '3px solid #F6F3FF',
				}}
			/>
			<Flex justifyContent='space-between'>
				<GLink>Min 0 round</GLink>
				<GLink>Max 26 round</GLink>
			</Flex>
		</>
	);
};

const SliderLabel = styled(Flex)``;
const SliderMax = styled(GLink)`
	color: ${brandColors.cyan[500]};
`;

export default LockSlider;
