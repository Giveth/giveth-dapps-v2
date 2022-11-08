import {
	B,
	brandColors,
	Caption,
	GLink,
	H6,
	IconHelpFilled16,
	IconRocketInSpace24,
	Lead,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LottieControl from '@/components/animations/lottieControl';

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
	ExceededContainer,
	BoostedProjectsLink,
	NotNowButton,
} from './BoostModal.sc';
import { EBoostModalState } from './BoostModal';
import {
	FETCH_POWER_BOOSTING_INFO,
	SAVE_POWER_BOOSTING,
} from '@/apollo/gql/gqlPowerBoosting';
import { client } from '@/apollo/apolloClient';
import { IPowerBoosting } from '@/apollo/types/types';
import { useAppSelector } from '@/features/hooks';
import LoadingAnimation from '@/animations/loading_giv.json';
import type { FC, Dispatch, SetStateAction } from 'react';
import type { BigNumber } from 'ethers';

interface IInnerBoostModalProps {
	totalGIVpower: BigNumber;
	setPercentage: Dispatch<SetStateAction<number>>;
	state: EBoostModalState;
	setState: Dispatch<SetStateAction<EBoostModalState>>;
	projectId: string;
	setShowModal: (showModal: boolean) => void;
}

const BoostInnerModal: FC<IInnerBoostModalProps> = ({
	totalGIVpower,
	setPercentage: setFinalPercentage,
	state,
	setState,
	projectId,
	setShowModal,
}) => {
	const [percentage, setPercentage] = useState(0);
	const [isChanged, setIsChanged] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [loading, setLoading] = useState(false);
	const [boostedProjects, setBoostedProjects] = useState<IPowerBoosting[]>(
		[],
	);
	const boostedProjectsCount = boostedProjects.length ?? 0;
	const user = useAppSelector(state => state.user.userData);
	const isOnlyBoostedProjectIsThisProject =
		boostedProjects[0]?.project.id === projectId &&
		boostedProjects.length === 1;

	const handleCaptionText = () => {
		if (boostedProjectsCount === 0) {
			return (
				<Caption style={{ whiteSpace: `pre-line` }}>
					This is your first time boosting, 100% will be allocated to
					this project. You can check your allocation on &nbsp;
					<Link href={Routes.MyBoostedProjects} passHref>
						<GLink>
							<b>My account</b>
						</GLink>
					</Link>
				</Caption>
			);
		} else if (isOnlyBoostedProjectIsThisProject) {
			return (
				<Caption style={{ whiteSpace: `pre-line` }}>
					You supported this project with 100% of your total GIVpower.
					You can't edit the allocation unless you have at least 1
					other boosted project. Try boosting other projects or
					managing them in &nbsp;
					<Link href={Routes.MyBoostedProjects} passHref>
						<GLink>
							<b>My account</b>
						</GLink>
					</Link>
				</Caption>
			);
		} else {
			return (
				<Caption style={{ whiteSpace: `pre-line` }}>
					By allocating GIVpower to this project, we will reduce your
					allocation on previous project proportionally. You can check
					your previous allocation on &nbsp;
					<Link href={Routes.MyBoostedProjects} passHref>
						<GLink>
							<b>My account</b>
						</GLink>
					</Link>
				</Caption>
			);
		}
	};

	useEffect(() => {
		if (!user) return;

		const fetchUserBoosts = async () => {
			setLoading(true);
			//Check user has boosted any  project or not
			const { data } = await client.query({
				query: FETCH_POWER_BOOSTING_INFO,
				variables: {
					take: 50,
					skip: 0,
					userId: parseFloat(user.id || '') || -1,
				},
			});

			setLoading(false);
			if (data?.getPowerBoosting) {
				const powerBoostings: IPowerBoosting[] =
					data.getPowerBoosting.powerBoostings;
				setBoostedProjects(powerBoostings);
				const count = data.getPowerBoosting.powerBoostings?.length ?? 0;
				if (count === 0) {
					setPercentage(100);
					setIsChanged(true);
				} else {
					const sameProject = powerBoostings.find(
						project => project?.project.id === projectId,
					);
					const _percentage = Math.floor(
						sameProject?.percentage ?? 0,
					);
					setPercentage(_percentage);
					if (count >= 20 && !sameProject) {
						setState(EBoostModalState.LIMIT_EXCEEDED);
					}
				}
			}
		};
		fetchUserBoosts();
	}, [user]);

	const confirmAllocation = async () => {
		setIsSaving(true);
		const res = await client.mutate({
			mutation: SAVE_POWER_BOOSTING,
			variables: {
				percentage,
				projectId: +projectId,
			},
		});
		setIsSaving(false);
		if (res) {
			setFinalPercentage(percentage);
			setState(EBoostModalState.BOOSTED);
		}
	};

	if (loading) {
		return <LottieControl animationData={LoadingAnimation} size={50} />;
	}

	if (state === EBoostModalState.LIMIT_EXCEEDED) {
		return (
			<>
				<ExceededContainer>
					<Lead>
						You have already boosted the maximum 20 projects!
						<br /> To continue with this boosting, remove at least
						one other boosted project from your account and come
						back to this project again!
					</Lead>
				</ExceededContainer>
				<Link href={Routes.MyBoostedProjects} passHref>
					<BoostedProjectsLink
						size='medium'
						label='Go to Boosted Projects'
					/>
				</Link>
				<NotNowButton
					buttonType='texty-primary'
					label='Not now'
					onClick={() => setShowModal(false)}
				/>
			</>
		);
	}

	return (
		<>
			<InfoPart>
				<TotalGIVpowerRow alignItems='baseline' gap='12px'>
					<H6>Total GIVpower</H6>
					<GIVpowerValue weight={700}>
						{formatWeiHelper(totalGIVpower)}
						<GIVpowerHelp>
							<IconWithTooltip
								icon={<IconHelpFilled16 />}
								direction={'bottom'}
							>
								<LockInfotooltip>
									Get more GIVpower by staking & locking more
									GIV tokens.
								</LockInfotooltip>
							</IconWithTooltip>
						</GIVpowerHelp>
					</GIVpowerValue>
				</TotalGIVpowerRow>
				<Flex justifyContent='space-between'>
					<Flex alignItems='baseline' gap='4px'>
						<P>Boosted projects</P>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction={'bottom'}
						>
							<LockInfotooltip>
								This is the number of projects you have boosted
								before
							</LockInfotooltip>
						</IconWithTooltip>
					</Flex>
					<Flex gap='4px'>
						<ColoredRocketIcon>
							<IconRocketInSpace24 />
						</ColoredRocketIcon>
						<B>{boostedProjectsCount}</B>
					</Flex>
				</Flex>
			</InfoPart>
			<DescToast>{handleCaptionText()}</DescToast>
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
							boostedProjectsCount === 0
								? brandColors.giv[200]
								: brandColors.giv[500],
					}}
					handleStyle={{
						backgroundColor: neutralColors.gray[100],
						border: `3px solid ${
							boostedProjectsCount === 0
								? neutralColors.gray[500]
								: brandColors.giv[800]
						}`,
						opacity: 1,
					}}
					onChange={(value: any) => {
						const _value = Array.isArray(value) ? value[0] : value;
						if (
							boostedProjectsCount === 0 ||
							isSaving ||
							isOnlyBoostedProjectIsThisProject
						)
							return;
						setPercentage(_value);
						setIsChanged(true);
					}}
					handleRender={(renderProps: any) => {
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
					  } GIVpower`
					: 'Drag to allocate.'}
			</SliderDesc>
			<ConfirmButton
				label='Confirm'
				size='small'
				loading={isSaving}
				disabled={
					!isChanged ||
					isSaving ||
					percentage === 0 ||
					isOnlyBoostedProjectIsThisProject
				}
				onClick={confirmAllocation}
			/>
			<Link href={Routes.MyBoostedProjects} passHref>
				<ManageLink>Manage your allocations</ManageLink>
			</Link>
		</>
	);
};

export default BoostInnerModal;
