import {
	B,
	brandColors,
	Caption,
	H6,
	IconHelp,
	IconRocketInSpace24,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { FC, useState, useEffect } from 'react';

import { IconWithTooltip } from '@/components/IconWithToolTip';
import { LockInfotooltip } from '../StakeLock/LockInfo';
import { Flex } from '@/components/styled-components/Flex';
import 'rc-slider/assets/index.css';
import { BN, formatWeiHelper } from '@/helpers/number';
import Routes from '@/lib/constants/Routes';
import {
	InfoPart,
	TotalGIVpowerRow,
	GIVpowerValue,
	GIVpowerHelp,
	ColoredRocketIcon,
	DescToast,
	SliderWrapper,
	SliderTooltip,
	StyledSlider,
	Handle,
	HandleTooltip,
	SliderDesc,
	ConfirmButton,
	ManageLink,
} from './BoostModal.sc';

interface IInnerBoostModalProps {}

const BoostInnerModal: FC<IInnerBoostModalProps> = () => {
	const [percentage, setPercentage] = useState(0);
	const [isChanged, setIsChanged] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isBoosted, setIsBoosted] = useState(false);

	let totalGIVpower = '392743000000000000000000';
	// totalGIVpower = '0';
	let boostedProjects = 2;

	useEffect(() => {
		if (boostedProjects === 0) {
			setPercentage(100);
			setIsChanged(true);
		}
	}, [boostedProjects]);

	const confirmAllocation = () => {
		console.log('Confirming');
		setIsSaving(true);
		setTimeout(() => {
			setIsSaving(false);
			setIsBoosted(true);
		}, 1000);
	};

	return (
		<>
			<InfoPart>
				<TotalGIVpowerRow alignItems='baseline' gap='12px'>
					<H6>Total GIVpower</H6>
					<GIVpowerValue weight={700}>
						{formatWeiHelper(totalGIVpower)}
						<GIVpowerHelp>
							<IconWithTooltip
								icon={<IconHelp size={16} />}
								direction={'bottom'}
							>
								<LockInfotooltip>
									{/* TODO: add copy of this toast */}
									Your givpower
								</LockInfotooltip>
							</IconWithTooltip>
						</GIVpowerHelp>
					</GIVpowerValue>
				</TotalGIVpowerRow>
				<Flex justifyContent='space-between'>
					<Flex alignItems='baseline' gap='4px'>
						<P>Boosted projects</P>
						<IconWithTooltip
							icon={<IconHelp size={16} />}
							direction={'bottom'}
						>
							<LockInfotooltip>
								{/* TODO: add copy of this toast */}
								Your givpower
							</LockInfotooltip>
						</IconWithTooltip>
					</Flex>
					<Flex gap='4px'>
						<ColoredRocketIcon>
							<IconRocketInSpace24 />
						</ColoredRocketIcon>
						<B>{boostedProjects}</B>
					</Flex>
				</Flex>
			</InfoPart>
			<DescToast>
				<Caption>
					By allocating GIVpower to this project, we will reduce your
					allocation on previous project proportionally. You can check
					your previous allocation on My account.
				</Caption>
			</DescToast>
			<SliderWrapper>
				{!isChanged && (
					<SliderTooltip>
						Allocated to previous projects
					</SliderTooltip>
				)}
				<StyledSlider
					min={0}
					max={100}
					railStyle={{
						backgroundColor: brandColors.giv[900],
					}}
					trackStyle={{
						backgroundColor:
							boostedProjects === 0
								? brandColors.giv[200]
								: brandColors.giv[500],
					}}
					handleStyle={{
						backgroundColor: neutralColors.gray[100],
						border: `3px solid ${
							boostedProjects === 0
								? neutralColors.gray[500]
								: brandColors.giv[800]
						}`,
						opacity: 1,
					}}
					onChange={value => {
						const _value = Array.isArray(value) ? value[0] : value;
						if (boostedProjects === 0) return;
						setPercentage(_value);
						setIsChanged(true);
					}}
					handleRender={renderProps => {
						return (
							<Handle {...renderProps.props}>
								{isChanged && (
									<HandleTooltip>{percentage}%</HandleTooltip>
								)}
							</Handle>
						);
					}}
					value={percentage}
				/>
			</SliderWrapper>
			<SliderDesc isChanged={isChanged} weight={700}>
				{isChanged
					? `~${
							percentage > 0
								? formatWeiHelper(
										BN(totalGIVpower)
											.mul(percentage)
											.div(100),
								  )
								: 0
					  } GIVpower.`
					: 'Drag to allocate.'}
			</SliderDesc>
			<ConfirmButton
				label='Confirm'
				size='small'
				loading={isSaving}
				disabled={!isChanged || isSaving || percentage === 0}
				onClick={confirmAllocation}
			/>
			<ManageLink href={Routes.BoostedProjects}>
				Manage your allocations
			</ManageLink>
		</>
	);
};

export default BoostInnerModal;
