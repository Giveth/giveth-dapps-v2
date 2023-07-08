import {
	brandColors,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { ProjectPublicActions } from './ProjectPublicActions';
import { ProjectStats } from './ProjectStats';
import { AdminActions } from './AdminActions';
import { Flex } from '@/components/styled-components/Flex';
import { useAppSelector } from '@/features/hooks';
import LoadingAnimation from '@/animations/loading_giv.json';
import LottieControl from '@/components/LottieControl';
import { useProjectContext } from '@/context/project.context';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device, zIndex } from '@/lib/constants/constants';
import { Shadow } from '@/components/styled-components/Shadow';
import QFSection from './QFSection';
import { DonateSection } from './DonationSection';

interface IProjectActionCardProps {}

interface IWrapperWithHeight extends IWrapper {
	height: number;
}

interface IWrapper {
	isMobile: boolean | null;
}

export const ProjectActionCard: FC<IProjectActionCardProps> = ({}) => {
	const { isLoading } = useAppSelector(state => state.user);
	const { isAdmin, hasActiveQFRound } = useProjectContext();
	const isMobile = !useMediaQuery(device.tablet);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [wrapperHeight, setWrapperHeight] = useState<number>(0);

	useEffect(() => {
		const handleResize = () =>
			setWrapperHeight(wrapperRef?.current?.clientHeight || 0);
		if (isMobile) {
			handleResize();
			window.addEventListener('resize', handleResize);
		}
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [isMobile, isLoading]);

	return isMobile ? (
		<Wrapper
			ref={wrapperRef}
			height={wrapperHeight}
			drag={isMobile ? 'y' : false}
			dragElastic={0}
			dragConstraints={{ top: -(wrapperHeight - 180), bottom: 132 }}
			isMobile={isMobile}
		>
			<TopLine />
			<ProjectActionCardWrapper
				flexDirection='column-reverse'
				justifyContent='space-between'
			>
				{isLoading ? (
					<LottieControl
						animationData={LoadingAnimation}
						size={300}
					/>
				) : isAdmin ? (
					<>
						<ProjectStats />
						<AdminActions />
					</>
				) : (
					<>
						{hasActiveQFRound ? <QFSection /> : <DonateSection />}

						<ProjectPublicActions />
					</>
				)}
			</ProjectActionCardWrapper>
		</Wrapper>
	) : (
		<ProjectActionCardWrapper
			flexDirection='column'
			justifyContent='space-between'
		>
			{isLoading ? (
				<LottieControl animationData={LoadingAnimation} size={300} />
			) : isAdmin ? (
				<>
					<ProjectStats />
					<AdminActions />
				</>
			) : (
				<>
					{hasActiveQFRound ? <QFSection /> : <DonateSection />}
					<ProjectPublicActions />
				</>
			)}
		</ProjectActionCardWrapper>
	);
};

const ProjectActionCardWrapper = styled(Flex)`
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	height: 100%;
	padding-top: 12px;
	${mediaQueries.tablet} {
		padding: 16px 24px;
	}
`;

const wrapperMQs = css`
	${mediaQueries.tablet} {
		padding: 16px;
		border-radius: 40px;
	}

	${mediaQueries.laptopS} {
		max-width: 285px;
	}

	${mediaQueries.laptopL} {
		padding: 32px;
		max-width: 325px;
	}
`;

const Wrapper = styled(motion.div)<IWrapperWithHeight>`
	margin-top: -62px;
	height: fit-content;
	z-index: ${zIndex.BOTTOM_SHEET};
	align-self: flex-start;
	width: 100%;
	position: fixed;
	bottom: ${({ height }) => `calc(180px - ${height}px)`};
	left: 0;
	${mediaQueries.tablet} {
		position: sticky;
		top: 132px;
	}
	${props =>
		props.isMobile
			? css`
					background: ${brandColors.giv['000']};
					box-shadow: ${Shadow.Neutral[400]};
					border-radius: 40px 40px 0 0;
					padding: 32px;
					${wrapperMQs}
			  `
			: css``}
`;

const TopLine = styled.div`
	width: 80px;
	height: 3px;
	background-color: ${brandColors.giv['800']};
	margin: 0 auto 8px;
	position: relative;
	top: -8px;
`;
