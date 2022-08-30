import {
	B,
	brandColors,
	Button,
	Caption,
	GLink,
	H4,
	H5,
	H6,
	IconHelp,
	IconRocketInSpace24,
	IconRocketInSpace32,
	neutralColors,
	P,
	semanticColors,
	Subline,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';
import Slider from 'rc-slider';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';

import { useModalAnimation } from '@/hooks/useModalAnimation';
import { mediaQueries } from '@/lib/constants/constants';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { LockInfotooltip } from '../StakeLock/LockInfo';
import { Flex } from '@/components/styled-components/Flex';
import 'rc-slider/assets/index.css';
import { BN, formatWeiHelper } from '@/helpers/number';
import Routes from '@/lib/constants/Routes';

interface IBoostModalProps extends IModal {}

const BoostModal: FC<IBoostModalProps> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [percentage, setPercentage] = useState(0);
	const [isChanged, setIsChanged] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const totalGIVpower = '392743000000000000000000';
	const boostedProjects = 4;

	const confirmAllocation = () => {
		console.log('Confirming');
		setIsSaving(true);
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={'Boost'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<BoostModalContainer>
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
						By allocating GIVpower to this project, we will reduce
						your allocation on previous project proportionally. You
						can check your previous allocation on My account.
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
							backgroundColor: brandColors.giv[500],
						}}
						handleStyle={{
							backgroundColor: neutralColors.gray[100],
							border: `3px solid ${brandColors.giv[800]}`,
							opacity: 1,
						}}
						onChange={value => {
							const _value = Array.isArray(value)
								? value[0]
								: value;
							setPercentage(_value);
							setIsChanged(true);
						}}
						handleRender={renderProps => {
							return (
								<div {...renderProps.props}>
									{isChanged && (
										<HandleTooltip>
											{percentage}%
										</HandleTooltip>
									)}
								</div>
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
					disabled={!isChanged || isSaving}
					onClick={confirmAllocation}
				/>
				<ManageLink href={Routes.BoostedProjects}>
					Manage your allocations
				</ManageLink>
			</BoostModalContainer>
		</Modal>
	);
};

const BoostModalContainer = styled.div`
	width: 100%;
	${mediaQueries.tablet} {
		width: 480px;
	}
	padding: 24px;
`;

const InfoPart = styled.div`
	padding: 16px;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	margin-bottom: 32px;
`;

const TotalGIVpowerRow = styled(Flex)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 21px;
`;

const GIVpowerValue = styled(H4)`
	position: relative;
`;

const GIVpowerHelp = styled.div`
	position: absolute;
	top: -16px;
	right: -20px;
	cursor: pointer;
	&:hover {
		color: ${neutralColors.gray[800]};
	}
`;

const ColoredRocketIcon = styled.div`
	color: ${brandColors.giv[500]};
`;

const DescToast = styled.div`
	padding: 16px;
	border: 1px solid ${semanticColors.blueSky[700]};
	background-color: ${semanticColors.blueSky[100]};
	color: ${semanticColors.blueSky[700]};
	border-radius: 8px;
	margin-bottom: 32px;
`;

const StyledSlider = styled(Slider)`
	margin-bottom: 32px;
`;

const HandleTooltip = styled(Subline)`
	background-color: ${brandColors.giv[800]};
	position: absolute;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	padding: 0 6px;
	color: white;
	border-radius: 4px;
	&::before {
		content: '';
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 5px 5px 5px;
		border-color: transparent transparent ${brandColors.giv[800]}
			transparent;
		position: absolute;
		top: -5px;
		left: 50%;
		transform: translateX(-50%);
	}
`;

const SliderWrapper = styled.div`
	position: relative;
`;

const SliderTooltip = styled(Subline)`
	background-color: ${neutralColors.gray[500]};
	position: absolute;
	top: -20px;
	left: 50%;
	transform: translateX(-50%);
	padding: 0 6px;
	color: white;
	font-size: 12px;
	border-radius: 4px;
	&::before {
		content: '';
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 5px 5px 0 5px;
		border-color: ${neutralColors.gray[500]} transparent transparent
			transparent;
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
	}
`;

interface SliderDescProps {
	isChanged: boolean;
}

const SliderDesc = styled(H5)<SliderDescProps>`
	color: ${props =>
		props.isChanged ? brandColors.giv[500] : neutralColors.gray[700]};
`;

const ConfirmButton = styled(Button)`
	width: 300px;
	margin: 40px auto 12px;
`;

const ManageLink = styled(GLink)`
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[800]};
	}
	transition: color 0.3s ease;
`;

export default BoostModal;
