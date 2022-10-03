import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
	P,
	B,
	GLink,
	brandColors,
	Caption,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Flex } from '@/components/styled-components/Flex';
import { smallFormatDate } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import { getUnlockDate } from '@/helpers/givpower';
import type { IGIVpower } from '@/types/subgraph';

const maxRound = 26;
interface ILockSlider {
	round: number;
	setRound: Dispatch<SetStateAction<number>>;
}

const LockSlider: FC<ILockSlider> = ({ round, setRound }) => {
	const [isChanged, setIsChanged] = useState(false);
	const givpowerInfo = useAppSelector(
		state => state.subgraph.xDaiValues.givpowerInfo,
	) as IGIVpower;
	const unlockDate = new Date(getUnlockDate(givpowerInfo, round));
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
				trackStyle={{ backgroundColor: brandColors.giv[200] }}
				handleStyle={{
					backgroundColor: brandColors.giv[500],
					border: '3px solid #F6F3FF',
				}}
				onChange={value => {
					const _value = Array.isArray(value) ? value[0] : value;
					setRound(_value);
					setIsChanged(true);
				}}
				value={round}
			/>
			<Flex justifyContent='space-between'>
				<GLink>Min 1 round</GLink>
				<GLink>
					{isChanged
						? smallFormatDate(unlockDate)
						: `Max ${maxRound} round`}
				</GLink>
			</Flex>
			<MidRoundToast>
				<ToastTitle medium>Mid-round lock</ToastTitle>
				{round > 0 ? (
					<ToastDesc>
						Your tokens will be locked for the remainder of the
						current round + the{' '}
						<ToastRound as='span' medium>
							{round} round{round > 1 ? 's' : ''}
						</ToastRound>{' '}
						you selected.
					</ToastDesc>
				) : (
					<ToastDesc>
						When you lock your tokens mid-round, they will be locked
						for the remainder of the current round + the numbers of
						rounds you select.
					</ToastDesc>
				)}
			</MidRoundToast>
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

const MidRoundToast = styled.div`
	background-color: ${brandColors.giv[700]};
	border-radius: 8px;
	padding: 16px;
	margin-top: 8px;
`;

const ToastTitle = styled(Caption)`
	text-align: left;
	margin-bottom: 4px;
`;

const ToastDesc = styled(Caption)`
	text-align: left;
	color: ${brandColors.giv[300]};
`;

const ToastRound = styled(Caption)`
	color: ${neutralColors.gray['100']};
`;

export default LockSlider;
