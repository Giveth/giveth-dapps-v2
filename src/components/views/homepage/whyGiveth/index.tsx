import {
	brandColors,
	Container,
	H3,
	mediaQueries,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useEffect, useRef, useState } from 'react';
import { Flex } from '@/components/styled-components/Flex';
import StatsCard from '@/components/views/homepage/whyGiveth/StatsCard';
import DonationCard from '@/components/views/homepage/whyGiveth/DonationCard';
import { IRecentDonation } from '@/apollo/types/types';

interface IWhyGiveth {
	recentDonations: IRecentDonation[];
}

const WhyGiveth: FC<IWhyGiveth> = props => {
	const { recentDonations } = props;
	const nonZeroDonations = recentDonations.filter(
		i => i.valueUsd && i.valueUsd > 0.1,
	);

	const [animationWidth, setAnimationWidth] = useState(1000);

	const donationCardsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (donationCardsRef.current) {
			const { clientWidth } = donationCardsRef.current;
			setAnimationWidth(clientWidth);
		}
	}, [donationCardsRef.current]);

	return (
		<>
			<GivethStats>
				<Title weight={700}>Why Giveth?</Title>
				<Stats>
					{statsArray.map(i => (
						<StatsCard
							key={i.title}
							title={i.title}
							value={i.value}
						/>
					))}
				</Stats>
			</GivethStats>
			<RecentDonations>
				<Subline>RECENT DONATIONS</Subline>
				<Line />
				<DonationCardWrapper>
					<DonationCardContainer
						width={animationWidth}
						ref={donationCardsRef}
					>
						{nonZeroDonations.map(i => (
							<DonationCard
								key={i.id}
								address={i.user.walletAddress}
								amount={i.valueUsd!}
								projectTitle={i.project.title}
							/>
						))}
					</DonationCardContainer>
				</DonationCardWrapper>
			</RecentDonations>
		</>
	);
};

const statsArray = [
	{
		title: 'Projects on Giveth',
		value: '1,726',
	},
	{
		title: 'Donated to projects',
		value: '~$190,854',
	},
	{
		title: '# of givers',
		value: '19,702',
	},
];

const DonationCardWrapper = styled.div`
	overflow: hidden;
`;

const DonationCardContainer = styled(Flex)<{ width?: number }>`
	animation: moveSlideshow ${props => (props.width || 1000) / 100}s linear
		infinite;
	width: max-content;
	:hover {
		animation-play-state: paused;
	}
	@keyframes moveSlideshow {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-${props => props.width}px);
		}
	}
`;

const Line = styled.div`
	width: 1px;
	background: ${neutralColors.gray[300]};
	height: 40px;
	display: none;
	${mediaQueries.tablet} {
		flex-shrink: 0;
		display: block;
	}
`;

const RecentDonations = styled(Flex)`
	margin-top: 60px;
	gap: 4px;
	flex-direction: column;
	margin-left: 24px;
	${mediaQueries.tablet} {
		gap: 40px;
		align-items: center;
		flex-direction: row;
		margin-left: 40px;
	}
	> div:first-of-type {
		flex-shrink: 0;
	}
`;

const Stats = styled(Flex)`
	gap: 40px 112px;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const Title = styled(H3)`
	color: ${brandColors.giv[600]};
`;

const GivethStats = styled(Container)`
	position: relative;
	padding-top: 58px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 40px;
	flex-direction: column;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
	${mediaQueries.laptopL} {
		gap: 40px 104px;
	}
`;

export default WhyGiveth;
