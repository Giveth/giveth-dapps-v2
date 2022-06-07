import { brandColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import { IconEthereum } from './Icons/Eth';
import { IconGIV } from './Icons/GIV';
import { IconHoneyswap } from './Icons/Honeyswap';
import { IconFox } from '@/components/Icons/Fox';
import { IconDai } from '@/components/Icons/Dai';
import { IconElk } from '@/components/Icons/Elk';
import { IconxDAI } from '@/components/Icons/xDAI';
import { IconCult } from '@/components/Icons/Cult';
interface IStakingPoolImagesProps {
	title: string;
}

export const getCurIconWithName = (currency: string) => {
	switch (currency) {
		case 'GIV':
			return <IconGIV size={40} />;
		case 'ETH':
			return <IconEthereum size={40} />;
		case 'HNY':
			return <IconHoneyswap size={40} />;
		case 'FOX':
			return <IconFox size={40} />;
		case 'ELK':
			return <IconElk size={40} />;
		case 'DAI':
			return <IconDai size={40} />;
		case 'CULT':
			return <IconCult size={40} />;
		case 'xDAI':
			return <IconxDAI size={40} />;
		default:
			break;
	}
};

export const StakingPoolImages: FC<IStakingPoolImagesProps> = ({ title }) => {
	const currencies = title.split(' / ');

	return (
		<StakingPoolImagesContainer lenght={currencies.length}>
			{currencies.map((currency, idx) => (
				<div key={idx}>{getCurIconWithName(currency)}</div>
			))}
		</StakingPoolImagesContainer>
	);
};

interface IStakingPoolImagesContainerProps {
	lenght: number;
}

const StakingPoolImagesContainer = styled.div<IStakingPoolImagesContainerProps>`
	padding-left: 27px;
	padding-right: 31px;
	height: 56px;
	width: ${props => (props.lenght == 1 ? 72 : 105)}px;
	background: ${brandColors.giv[700]};
	position: relative;
	border-radius: 0 28px 28px 0;
	& > div {
		position: absolute;
		right: 38px;
		top: 8px;
		z-index: 1;
		:last-child {
			z-index: 0;
			right: 7px;
		}
	}
`;
