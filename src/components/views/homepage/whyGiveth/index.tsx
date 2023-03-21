import {
	B,
	brandColors,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { Flex } from '@/components/styled-components/Flex';
import StatsCard from '@/components/views/homepage/whyGiveth/StatsCard';
import DonationCard from '@/components/views/homepage/whyGiveth/DonationCard';
import { thousandsSeparator } from '@/lib/helpers';
import { Relative } from '@/components/styled-components/Position';
import CominhoPlusIcon from 'public/images/cominho-plus.svg';
import { IHomeRoute } from 'pages';

type IWhyGivethProps = Omit<
	IHomeRoute,
	'campaigns' | 'latestUpdates' | 'featuredProjects'
>;

const WhyGiveth: FC<IWhyGivethProps> = props => {
	const {
		recentDonations,
		projectsPerDate,
		totalDonorsCountPerDate,
		donationsTotalUsdPerDate,
	} = props;
	const nonZeroDonations = recentDonations.filter(
		i => i.valueUsd && i.valueUsd > 0.1,
	);

	const statsArray = [
		{
			title: 'label.projects_on_giveth',
			value: thousandsSeparator(projectsPerDate.total),
		},
		{
			title: 'label.donated_to_projects',
			value:
				'~$' +
				thousandsSeparator(donationsTotalUsdPerDate.total.toFixed()),
		},
		{
			title: 'label.number_of_givers',
			value: thousandsSeparator(totalDonorsCountPerDate.total),
		},
	];

	const [animationWidth, setAnimationWidth] = useState(1000);

	const { formatMessage } = useIntl();

	const donationCardsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (donationCardsRef.current) {
			const { clientWidth } = donationCardsRef.current;
			setAnimationWidth(clientWidth);
		}
	}, [donationCardsRef.current]);

	return (
		<Relative>
			<GivethStats>
				<Stats>
					{statsArray.map(i => (
						<StatsCard
							key={i.title}
							title={formatMessage({ id: i.title })}
							value={i.value}
						/>
					))}
				</Stats>
			</GivethStats>
			<RecentDonations>
				<B>
					{formatMessage({
						id: 'page.home.section.recent_donations',
					})}
				</B>
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
								slug={i.project.slug}
							/>
						))}
					</DonationCardContainer>
				</DonationCardWrapper>
			</RecentDonations>
			<CyanRing />
			<GivArc />
			<MustardArc />
			<MustardDot />
			<CominhoPlus>
				<Image src={CominhoPlusIcon} alt='Cominho Plus' />
			</CominhoPlus>
		</Relative>
	);
};

const CominhoPlus = styled.div`
	position: absolute;
	bottom: 119px;
	right: 100px;
	${mediaQueries.tablet} {
		bottom: 75px;
		right: 15px;
	}
	${mediaQueries.desktop} {
		bottom: 110px;
		right: 20px;
	}
`;

const MustardDot = styled.div`
	width: 15px;
	height: 15px;
	border-radius: 50%;
	background-color: ${brandColors.mustard[500]};
	position: absolute;
	top: 60px;
	left: 25px;
	${mediaQueries.desktop} {
		top: 210px;
		left: 25px;
	}
`;

const MustardArc = styled.div`
	border-radius: 50%;
	border: 10px solid ${brandColors.mustard[500]};
	border-top-color: transparent;
	border-right-color: transparent;
	transform: rotate(-30deg);
	width: 70px;
	height: 70px;
	position: absolute;
	top: 36px;
	left: -35px;
	${mediaQueries.desktop} {
		top: 186px;
		left: -35px;
	}
`;

const GivArc = styled.div`
	border-radius: 50%;
	border: 13px solid ${brandColors.giv[200]};
	border-bottom-color: transparent;
	border-top-color: transparent;
	border-left-color: transparent;
	transform: rotate(45deg);
	width: 54px;
	height: 54px;
	top: 45px;
	right: 10px;
	position: absolute;
	${mediaQueries.tablet} {
		top: 45px;
		right: 146px;
	}
`;

const CyanRing = styled.div`
	border-radius: 50%;
	border: 5px solid ${brandColors.cyan[700]};
	width: 21px;
	height: 21px;
	position: absolute;
	bottom: -10px;
	left: 90px;
	${mediaQueries.tablet} {
		bottom: 0;
		left: 90px;
	}
	${mediaQueries.desktop} {
		top: 26px;
		left: 250px;
	}
`;

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
	gap: 4px;
	flex-direction: column;
	margin: 40px 0 10px 24px;
	${mediaQueries.tablet} {
		margin-top: 10px;
		margin-left: 40px;
		gap: 40px;
		align-items: center;
		flex-direction: row;
	}
	> div:first-of-type {
		flex-shrink: 0;
	}
`;

const Stats = styled(Flex)`
	gap: 40px;
	flex-direction: column;
	border-radius: 16px;
	background: ${brandColors.giv[500]};
	color: ${neutralColors.gray[100]};
	padding: 40px 20px;
	width: 100%;
	max-width: 1200px;
	justify-content: center;
	align-items: center;
	${mediaQueries.tablet} {
		flex-direction: row;
		gap: 100px;
	}
	${mediaQueries.laptopS} {
		gap: 180px;
	}
`;

const GivethStats = styled.div`
	position: relative;
	padding: 40px 40px 0;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 40px;
	flex-direction: column;
	${mediaQueries.laptopL} {
		gap: 40px 104px;
	}
`;

export default WhyGiveth;
