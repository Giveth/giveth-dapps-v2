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
import { useIntl } from 'react-intl';
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
	const { formatMessage, locale } = useIntl();
	const [isChanged, setIsChanged] = useState(false);
	const givpowerInfo = useAppSelector(
		state => state.subgraph.xDaiValues.givpowerInfo,
	) as IGIVpower;
	const unlockDate = new Date(getUnlockDate(givpowerInfo, round));
	return (
		<>
			<Flex justifyContent='space-between'>
				<SliderLabel>
					<P>
						{formatMessage({ id: 'label.rounds_to_lock' })}: &nbsp;
					</P>
					<B>{round}</B>
				</SliderLabel>
				<SliderMax onClick={() => setRound(maxRound)}>
					{formatMessage({ id: 'label.max' })}
				</SliderMax>
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
			<Flex>
				{round < 1 && (
					<GLink>
						{formatMessage({ id: 'label.min_one_round' })}
					</GLink>
				)}
				<Flex1 />
				<GLink>
					{isChanged
						? `${formatMessage({
								id: 'label.lock_until',
						  })} ${smallFormatDate(unlockDate, locale)}`
						: formatMessage(
								{
									id: 'label.max_max_round',
								},
								{ maxRound },
						  )}
				</GLink>
			</Flex>
			<MidRoundToast>
				{round > 0 ? (
					<>
						<ToastTitle medium>
							{formatMessage({ id: 'label.mid_round_lock' })}
						</ToastTitle>
						<ToastDesc>
							{formatMessage({
								id: 'label.your_tokens_will_be_locked_for_the_remainder',
							})}{' '}
							<ToastRound as='span' medium>
								{round > 1
									? formatMessage(
											{
												id: 'label.plural.round_count',
											},
											{ round },
									  )
									: formatMessage(
											{
												id: 'label.singular.round_count',
											},
											{ round },
									  )}
							</ToastRound>{' '}
							{formatMessage({ id: 'label.you_selected' })}
						</ToastDesc>
					</>
				) : (
					<ToastDesc>
						{formatMessage({
							id: 'label.when_you_lock_your_tokens_midround',
						})}
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

const Flex1 = styled.div`
	flex: 1;
`;

export default LockSlider;
