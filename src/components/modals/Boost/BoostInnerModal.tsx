import {
	B,
	brandColors,
	Caption,
	GLink,
	H6,
	IconHelp,
	IconRocketInSpace24,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { LockInfotooltip } from '../StakeLock/LockInfo';
import { Flex } from '@/components/styled-components/Flex';
import 'rc-slider/assets/index.css';
import { formatWeiHelper } from '@/helpers/number';
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
import { EBoostModalState } from './BoostModal';
import type { BigNumber } from 'ethers';
import type { FC, Dispatch, SetStateAction } from 'react';

interface IInnerBoostModalProps {
	totalGIVpower: BigNumber;
	setPercentage: Dispatch<SetStateAction<number>>;
	setState: Dispatch<SetStateAction<EBoostModalState>>;
}

const BoostInnerModal: FC<IInnerBoostModalProps> = ({
	totalGIVpower,
	setPercentage: setFinalPercentage,
	setState,
}) => {
	const [percentage, setPercentage] = useState(0);
	const [isChanged, setIsChanged] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

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
			setFinalPercentage(percentage);
			setState(EBoostModalState.BOOSTED);
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
									This is the total GIVpower you have, you can
									get more GIVpower by stake & lock more
									tokens
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
								This is the project you boosted before
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
				<Caption style={{ whiteSpace: `pre-line` }}>
					{boostedProjects > 0
						? `By allocating GIVpower to this project, we will reduce your allocation on previous project proportionally.
						You can check your previous allocation on `
						: `This is your first time boosting, so 100% will be allocated to this project.
						You can check your allocation on `}
					<Link href={Routes.MyBoostedProjects} passHref>
						<GLink>My account</GLink>
					</Link>
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
										totalGIVpower.mul(percentage).div(100),
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
			<Link href={Routes.MyBoostedProjects} passHref>
				<ManageLink>Manage your allocations</ManageLink>
			</Link>
		</>
	);
};

export default BoostInnerModal;
