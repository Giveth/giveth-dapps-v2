import React, { Dispatch, FC, SetStateAction, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
	B,
	IconChevronLeft24,
	IconChevronRight24,
	P,
	SublineBold,
	neutralColors,
	semanticColors,
	mediaQueries,
	Flex,
} from '@giveth/ui-design-system';
import styled, { css } from 'styled-components';
import { Navigation } from 'swiper/modules';
import { useIntl } from 'react-intl';
import { useProjectContext } from '@/context/project.context';
import 'swiper/css';
import 'swiper/css/navigation';
import { NavigationWrapper } from '@/components/styled-components/SwiperPagination';
import { ProjectDonationSwiperState } from './ProjectDonations.index';
import { IQFRound } from '@/apollo/types/types';
import { isRecurringActive } from '@/configuration';
interface IQfRoundSelectorProps {
	projectDonationSwiperState: ProjectDonationSwiperState;
	setProjectDonationSwiperState: Dispatch<
		SetStateAction<ProjectDonationSwiperState>
	>;
}

export const QfRoundSelector: FC<IQfRoundSelectorProps> = ({
	projectDonationSwiperState,
	setProjectDonationSwiperState,
}) => {
	const { formatMessage } = useIntl();
	const { projectData } = useProjectContext();
	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);

	const sortedRounds =
		projectData?.qfRounds?.sort(
			(a, b) => Number(b.isActive) - Number(a.isActive),
		) || [];

	const isRecurringSelected = projectDonationSwiperState.isRecurringSelected;
	const selectedQF = projectDonationSwiperState.selectedQF;
	const setSelectedQF = (selectedQF: IQFRound | null) =>
		setProjectDonationSwiperState(prev => ({ ...prev, selectedQF }));
	const setIsRecurringSelected = (isRecurringSelected: boolean) =>
		setProjectDonationSwiperState(prev => ({
			...prev,
			isRecurringSelected,
		}));

	return (
		<Flex gap='8px'>
			<QfNavigationWrapper
				ref={navigationPrevRef}
				className='swiper-button-disabled'
			>
				<IconChevronLeft24 />
			</QfNavigationWrapper>
			<Swiper
				modules={[Navigation]}
				navigation={{
					nextEl: navigationNextRef.current,
					prevEl: navigationPrevRef.current,
				}}
				slidesPerView='auto'
				spaceBetween={21}
				style={{ marginLeft: '0' }}
			>
				<SwiperSlide style={{ width: 'auto' }}>
					<TabItem
						$alignItems='center'
						gap='4px'
						onClick={() => {
							setIsRecurringSelected(false);
							setSelectedQF(null);
						}}
						$isSelected={
							selectedQF === null && isRecurringSelected === false
						}
					>
						{selectedQF === null &&
						isRecurringSelected === false ? (
							<B>
								{formatMessage({ id: 'label.all_donations' })}
							</B>
						) : (
							<P>
								{formatMessage({ id: 'label.all_donations' })}
							</P>
						)}
					</TabItem>
				</SwiperSlide>
				{isRecurringActive && (
					<SwiperSlide style={{ width: 'auto' }}>
						<TabItem
							$alignItems='center'
							gap='4px'
							onClick={() => {
								setSelectedQF(null);
								setIsRecurringSelected(true);
							}}
							$isSelected={isRecurringSelected === true}
						>
							{(projectDonationSwiperState.selectedQF ===
								null) ===
							null ? (
								<B>Recurring Donations</B>
							) : (
								<P>Recurring Donations</P>
							)}
						</TabItem>
					</SwiperSlide>
				)}
				{sortedRounds.map((round, index) => {
					const isSelected = selectedQF?.id === round.id;
					return (
						<SwiperSlide key={index} style={{ width: 'auto' }}>
							<TabItem
								$alignItems='center'
								gap='4px'
								onClick={() => {
									setIsRecurringSelected(false);
									setSelectedQF(round);
								}}
								$isSelected={isSelected}
								$isActive={round.isActive}
							>
								{isSelected ? (
									<B>{round.name}</B>
								) : (
									<P>{round.name}</P>
								)}
								{round.isActive && <OpenLabel>Open</OpenLabel>}
							</TabItem>
						</SwiperSlide>
					);
				})}
			</Swiper>
			<QfNavigationWrapper ref={navigationNextRef}>
				<IconChevronRight24 />
			</QfNavigationWrapper>
		</Flex>
	);
};

interface ITabItemProps {
	$isSelected?: boolean;
	$isActive?: boolean;
}

const QfNavigationWrapper = styled(NavigationWrapper)`
	display: none;
	&.swiper-button-disabled {
		opacity: 0.2;
		cursor: default;
	}
	${mediaQueries.laptopS} {
		display: flex;
	}
`;

const TabItem = styled(Flex)<ITabItemProps>`
	padding: 8px 16px;
	border-radius: 50px;
	width: fit-content;
	cursor: pointer;
	transition: background-color 300ms ease;
	&:hover {
		background: ${neutralColors.gray[200]};
	}
	${props =>
		props.$isSelected &&
		css`
			background: ${neutralColors.gray[300]};
		`}
`;

const OpenLabel = styled(SublineBold)`
	padding: 2px 8px;
	background: ${semanticColors.jade[500]};
	color: ${neutralColors.gray[100]};
	border-radius: 40px;
`;
