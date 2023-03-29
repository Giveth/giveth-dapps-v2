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
import { useIntl } from 'react-intl';
import Link from 'next/link';

import LottieControl from '@/components/LottieControl';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { LockInfoTooltip } from '../StakeLock/LockInfo';
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
import { useProjectContext } from '@/context/project.context';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
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
	const { formatMessage } = useIntl();
	const [percentage, setPercentage] = useState(0);
	const [isChanged, setIsChanged] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [loading, setLoading] = useState(false);
	const [boostedProjects, setBoostedProjects] = useState<IPowerBoosting[]>(
		[],
	);

	const { fetchProjectBoosters } = useProjectContext();

	const boostedProjectsCount = boostedProjects.length ?? 0;
	const user = useAppSelector(state => state.user.userData);
	const isOnlyBoostedProjectIsThisProject =
		boostedProjects[0]?.project.id === projectId &&
		boostedProjects.length === 1;

	const handleCaptionText = () => {
		if (boostedProjectsCount === 0) {
			return (
				<Caption style={{ whiteSpace: `pre-line` }}>
					{formatMessage({
						id: 'label.since_this_is_your_first_time_boosting',
					})}
				</Caption>
			);
		} else if (isOnlyBoostedProjectIsThisProject) {
			return (
				<Caption style={{ whiteSpace: `pre-line` }}>
					{formatMessage({
						id: 'label.you_supported_this_project_with_100%',
					})}
					<Link href={Routes.MyBoostedProjects}>
						<GLink>
							<b>{formatMessage({ id: 'label.my_givpower' })}</b>
						</GLink>
					</Link>
				</Caption>
			);
		} else if (percentage === 100) {
			return (
				<Caption style={{ whiteSpace: `pre-line` }}>
					{formatMessage({ id: 'label.are_you_sure' })} <br />{' '}
					{formatMessage({
						id: 'label.if_you_boost_this_project_with_100%',
					})}{' '}
					<br />
					{formatMessage({
						id: 'label.you_can_review_and_manage_your_givpower',
					})}
					<Link href={Routes.MyBoostedProjects}>
						<GLink>
							<b>{formatMessage({ id: 'label.my_givpower' })}</b>
						</GLink>
					</Link>
				</Caption>
			);
		} else {
			return (
				<Caption style={{ whiteSpace: `pre-line` }}>
					{formatMessage({
						id: 'label.when_you_allocate_a_percentage_of_your_total_givpower',
					})}{' '}
					<br />
					{formatMessage({
						id: 'label.you_can_review_and_manage_your_givpower',
					})}
					&nbsp;
					<Link href={Routes.MyBoostedProjects}>
						<GLink>
							<b>{formatMessage({ id: 'label.my_givpower' })}</b>
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
		fetchProjectBoosters(+projectId, EProjectStatus.ACTIVE);
		setIsSaving(false);
		if (res) {
			setFinalPercentage(percentage);
			setState(EBoostModalState.BOOSTED);
		}
	};

	if (loading) {
		return <LottieControl animationData={LoadingAnimation} size={200} />;
	}

	if (state === EBoostModalState.LIMIT_EXCEEDED) {
		return (
			<>
				<ExceededContainer>
					<Lead>
						{formatMessage({
							id: 'label.you_have_already_boosted_20_projects',
						})}
						<br />{' '}
						{formatMessage({
							id: 'label.to_continue_please_remove_at_least_one_to_boost',
						})}
					</Lead>
				</ExceededContainer>
				<Link href={Routes.MyBoostedProjects}>
					<BoostedProjectsLink
						size='medium'
						label={formatMessage({ id: 'label.go_to_my_givpower' })}
					/>
				</Link>
				<NotNowButton
					buttonType='texty-primary'
					label={formatMessage({ id: 'label.not_now' })}
					onClick={() => setShowModal(false)}
				/>
			</>
		);
	}

	return (
		<>
			<InfoPart>
				<TotalGIVpowerRow alignItems='baseline' gap='12px'>
					<H6>{formatMessage({ id: 'label.total_givpower' })}</H6>
					<GIVpowerValue weight={700}>
						{formatWeiHelper(totalGIVpower)}
						<GIVpowerHelp>
							<IconWithTooltip
								icon={<IconHelpFilled16 />}
								direction={'bottom'}
							>
								<LockInfoTooltip>
									{formatMessage({
										id: 'label.get_more_givpower_by_staking',
									})}
								</LockInfoTooltip>
							</IconWithTooltip>
						</GIVpowerHelp>
					</GIVpowerValue>
				</TotalGIVpowerRow>
				<Flex justifyContent='space-between'>
					<Flex alignItems='baseline' gap='4px'>
						<P>{formatMessage({ id: 'label.boosted_projects' })}</P>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction={'bottom'}
						>
							<LockInfoTooltip>
								{formatMessage({
									id: 'label.this_is_the_number_of_projects_you_have_boosted',
								})}
							</LockInfoTooltip>
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
			<DescToast
				hasError={
					boostedProjectsCount !== 0 &&
					!isOnlyBoostedProjectIsThisProject &&
					percentage === 100
				}
			>
				{handleCaptionText()}
			</DescToast>
			{boostedProjectsCount > 0 && (
				<>
					<SliderWrapper>
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
								const _value = Array.isArray(value)
									? value[0]
									: value;
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
											<HandleTooltip>
												{percentage}%
											</HandleTooltip>
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
												totalGIVpower
													.mul(percentage)
													.div(100),
										  )
										: 0
							  } GIVpower`
							: `${formatMessage({
									id: 'label.drag_to_allocate',
							  })}.`}
					</SliderDesc>
				</>
			)}
			<ConfirmButton
				label={formatMessage({ id: 'label.confirm' })}
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
			{boostedProjectsCount > 0 && (
				<Link href={Routes.MyBoostedProjects}>
					<ManageLink>
						{formatMessage({ id: 'label.manage_your_givpower' })}
					</ManageLink>
				</Link>
			)}
		</>
	);
};

export default BoostInnerModal;
