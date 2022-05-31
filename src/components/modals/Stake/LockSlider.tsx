import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { P, B, GLink, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import type { Dispatch, FC, SetStateAction } from 'react';

const maxRound = 26;
interface ILockSlider {
	round: number;
	setRound: Dispatch<SetStateAction<number>>;
}

const LockSlider: FC<ILockSlider> = ({ round, setRound }) => {
	return (
		<>
			<Flex justifyContent='space-between'>
				<SliderLabel>
					<P>Rounds to lock: &nbsp;</P>
					<B>{round}</B>
				</SliderLabel>
				<SliderMax onClick={() => setRound(maxRound)}>Max</SliderMax>
			</Flex>
			<StyledSlider
				min={0}
				max={maxRound}
				railStyle={{ backgroundColor: brandColors.giv[800] }}
				trackStyle={{ backgroundColor: brandColors.giv[900] }}
				handleStyle={{
					backgroundColor: brandColors.giv[500],
					border: '3px solid #F6F3FF',
				}}
				onChange={value => {
					const _value = Array.isArray(value) ? value[0] : value;
					setRound(_value);
				}}
				value={round}
			/>
			<Flex justifyContent='space-between'>
				<GLink>Min 0 round</GLink>
				<GLink>Max {maxRound} round</GLink>
			</Flex>
		</>
	);
};

const SliderLabel = styled(Flex)``;
const SliderMax = styled(GLink)`
	color: ${brandColors.cyan[500]};
	cursor: pointer;
`;
const StyledSlider = styled(Slider)`
	margin: 8px 0 4px;
`;

export default LockSlider;
