import React from 'react';
import { H6 } from '@giveth/ui-design-system';
import Image from 'next/image';
import { Card } from '../ProGuide.sc';
import { Flex } from '@/components/styled-components/Flex';

export const ProjectScoreCard = () => {
	return (
		<Card>
			<Flex gap='16px'>
				<Image
					src={'/images/score.svg'}
					alt='score'
					width={32}
					height={32}
				/>
				<H6 weight={700}>Your Project Score</H6>
			</Flex>
			<br />
		</Card>
	);
};
