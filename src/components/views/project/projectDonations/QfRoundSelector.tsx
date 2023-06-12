import React, { Dispatch, FC, SetStateAction, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
	B,
	P,
	SublineBold,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled, { css } from 'styled-components';
import { Navigation } from 'swiper';
import { useProjectContext } from '@/context/project.context';
import 'swiper/css';
import 'swiper/css/navigation';
import { Flex } from '@/components/styled-components/Flex';

interface IQfRoundSelectorProps {
	selectedQF: string | null;
	setSelectedQF: Dispatch<SetStateAction<string | null>>;
}

export const QfRoundSelector: FC<IQfRoundSelectorProps> = ({
	selectedQF,
	setSelectedQF,
}) => {
	const { projectData } = useProjectContext();
	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);

	console.log('projectData', projectData?.qfRounds);

	return (
		<Swiper modules={[Navigation]} slidesPerView='auto' spaceBetween={21}>
			<SwiperSlide style={{ width: 'auto' }}>
				<TabItem
					alignItems='center'
					gap='4px'
					onClick={() => setSelectedQF(null)}
					isSelected={selectedQF === null}
				>
					{selectedQF === null ? (
						<B>All Donations</B>
					) : (
						<P>All Donations</P>
					)}
				</TabItem>
			</SwiperSlide>
			{projectData?.qfRounds?.map((round, index) => {
				const isSelected = selectedQF === round.id;
				return (
					<SwiperSlide key={index} style={{ width: 'auto' }}>
						<TabItem
							alignItems='center'
							gap='4px'
							onClick={() => setSelectedQF(round.id)}
							isSelected={isSelected}
						>
							{isSelected ? <B>{round.id}</B> : <P>{round.id}</P>}
							{round.isActive && <OpenLabel>Open</OpenLabel>}
						</TabItem>
					</SwiperSlide>
				);
			})}
		</Swiper>
	);
};

interface ITabItemProps {
	isSelected?: boolean;
}

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
		props.isSelected &&
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
