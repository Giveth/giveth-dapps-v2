import {
	ButtonLink,
	Flex,
	H6,
	IconExternalLink16,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import links from '@/lib/constants/links';

export const StakeTogetherCard = () => {
	return (
		<Wrapper>
			<Image
				src='/images/stake_together.svg'
				alt='stake together logo'
				width={248}
				height={41}
			/>
			<H6 weight={700}>Want to stake ETH & support public goods?</H6>
			<P>
				Join the Giveth Ethereum Staking pool. Stake ETH for stpETH,
				earn a passive interest & support top-boosted projects on with
				part of the rewards.
			</P>
			<StyledLink
				label='Go to Stake Together'
				href={links.STAKE_TOGETHER}
				isExternal={true}
				target='_blank'
				rel='noopener noreferrer'
				icon={<IconExternalLink16 />}
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

const StyledLink = styled(ButtonLink)`
	width: 100%;
`;
